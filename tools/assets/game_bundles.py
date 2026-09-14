#!/usr/bin/env python3
"""Resolve and download the game's Unity asset bundles behind every asset the wiki shows.

The wanted set comes from the site data: every doll (base art, Mod art when the doll has a Mod, each skin with an id), its Spine rigs, its skill
icons and every equipment icon. Each wanted asset is matched to a bundle by name and then confirmed against the file list the ResData manifest
records for that bundle, so nothing is downloaded on a guess.

Naming rules, from the Phase 4B research:

- Art is `character_<code>`, Mod art `character_<code>mod`, skin art `character_<code>_<skinId>`.
- About 350 bundles only exist as `_nom` and `_he` twins. `_nom` is the fallback, `_he` (the censored build) is never used. A plain bundle can
  also exist next to a `_nom` twin and hold only an expression sheet, which is why every file is confirmed rather than every bundle name.
- Spine rigs are `<art bundle>_spine`, falling back to the art bundle itself when it holds the `.skel` files.
- Skill icons live in `sprites_ui`, equipment icons in `resource_icon_equip`.

Subcommands:

- `inventory` writes `tools/assets/.cache/inventory.json` and prints the summary. Nothing is downloaded.
- `download` fetches every resolved bundle into `tools/assets/.cache/bundles/<name>.ab`, skipping bundles already cached at the right size.
- `verify` checks that every resolved bundle is cached at the size ResData records.
"""

import argparse
import collections
import concurrent.futures
import glob
import json
import os
import shutil
import sys
import threading
import time
import urllib.request

from download_spine import BUNDLE_KEYS, CODE_OVERRIDES, MOD_ID_OFFSET, resolve_code


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(os.path.dirname(TOOLS_DIR))
SITE_DATA_DIR = os.path.join(REPO_ROOT, "src", "data")
CACHE_DIR = os.path.join(TOOLS_DIR, ".cache")
BUNDLE_CACHE_DIR = os.path.join(CACHE_DIR, "bundles")
INVENTORY_PATH = os.path.join(CACHE_DIR, "inventory.json")

USER_AGENT = "gfl-reactjs-wiki-asset-rebuild/1.0 (fan wiki asset pipeline; https://github.com/steve1316/gfl-reactjs-wiki)"
MAX_WORKERS = 4
ATTEMPTS = 3
BACKOFF_SECONDS = 2.0
TIMEOUT_SECONDS = 60
CHUNK_BYTES = 1 << 20
BYTES_PER_MB = 1048576

# Suffix tried after the plain bundle name. The `_he` twin is deliberately absent.
NOM_SUFFIX = "_nom"
SKILL_BUNDLE = "sprites_ui"
EQUIP_BUNDLE = "resource_icon_equip"

# Tiers in report order.
TIERS = ("art", "mod_art", "skin_art", "spine", "mod_spine", "skin_spine", "skill_icon", "equip_icon")

# Each role is `(name, filename alternatives, required)`. `{stem}` is the codename, with `_<skinId>` for skins.
ART_ROLES = (
    ("full", ("pic_{stem}.png",), True),
    ("full_d", ("pic_{stem}_D.png",), True),
    ("card", ("pic_{stem}_N.jpg",), True),
)
MOD_CARD_ROLE = ("mod_card", ("pic_{stem}_N_mod.jpg",), False)
SPINE_ROLES = (
    ("skel", ("{stem}.skel.bytes", "{stem}.skel"), True),
    ("atlas", ("{stem}.atlas.txt", "{stem}.atlas"), True),
    ("texture", ("{stem}.png",), True),
    ("dorm_skel", ("R{stem}.skel.bytes", "R{stem}.skel"), False),
    ("dorm_atlas", ("R{stem}.atlas.txt", "R{stem}.atlas"), False),
    ("dorm_texture", ("R{stem}.png",), False),
)
SKILL_ROLES = (("icon", ("SkillIcon/{stem}.png",), True),)
EQUIP_ROLES = (("icon", ("Equip/{stem}.png",), True), ("alpha", ("Equip/{stem}_Alpha.png",), False))

# Skill codes with no icon anywhere in `sprites_ui`, confirmed by the research pass.
EXPECTED_MISSING_SKILL_CODES = frozenset(code.lower() for code in ("ma", "mg4", "rmb", "xm3", "m2wnl", "TaeSkill"))

# Skill codes whose icon file carries another name. `c93G` was checked pixel-identical to the hosted C93 skill icon.
SKILL_ICON_ALIASES = {"c93": "c93G"}

LOG_LOCK = threading.Lock()


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Loading


def read_json(path):
    """Read one JSON file.

    Args:
        path: File path.

    Returns:
        The parsed value.
    """
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def load_index(resdata):
    """Index the ResData bundles by lowercased name, keeping their file lists.

    Args:
        resdata: The parsed `resdata_no_hash.json`.

    Returns:
        A `(index, res_url)` pair. Each index entry holds `resname`, `sizeOriginal` and `files`, a list of `(lowercased path, path)` pairs.
    """
    index = {}
    for key in BUNDLE_KEYS:
        for bundle in resdata.get(key, []):
            files = [(res["pathKey"].lower(), res["pathKey"]) for res in bundle.get("assetAllRes", [])]
            index[bundle["assetBundleName"].lower()] = {"resname": bundle["resname"], "sizeOriginal": bundle["sizeOriginal"], "files": files}
    return index, resdata["resUrl"]


def load_site(site_dir):
    """Read the dolls and equipment ids the site shows.

    Args:
        site_dir: Directory holding `dolls-*.json` and `equipment.json`.

    Returns:
        A `(dolls, equipment_ids)` pair, dolls sorted by id and ids sorted and deduplicated.
    """
    dolls = []
    for path in sorted(glob.glob(os.path.join(site_dir, "dolls-*.json"))):
        dolls.extend(read_json(path))
    dolls.sort(key=lambda doll: doll["normal"]["id"])
    items = read_json(os.path.join(site_dir, "equipment.json"))["items"]
    equipment_ids = sorted({item["id"] for group in items.values() for item in group})
    return dolls, equipment_ids


def load_tables(gf_data_dir):
    """Read the `stc` tables that turn ids into codenames.

    Args:
        gf_data_dir: The `gf-data-us` checkout.

    Returns:
        A `(guns, skill_codes, equip_codes)` triple: gun rows by id, skill codename by skill group id (lowest level wins), equipment codename by id.
    """
    stc = os.path.join(gf_data_dir, "stc")
    guns = {row["id"]: row for row in read_json(os.path.join(stc, "gun.json"))}
    skill_rows = sorted(read_json(os.path.join(stc, "battle_skill_config.json")), key=lambda row: (row["skill_group_id"], row.get("level", 0), row["id"]))
    skill_codes = {}
    for row in skill_rows:
        skill_codes.setdefault(row["skill_group_id"], row["code"])
    equip_codes = {row["id"]: row["code"] for row in read_json(os.path.join(stc, "equip.json"))}
    return guns, skill_codes, equip_codes


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Resolution


def bundle_candidates(names):
    """Expand bundle names with their `_nom` fallback, preserving order.

    Args:
        names: Bundle names in preference order.

    Returns:
        A list with each name followed by its `_nom` twin.
    """
    return [candidate for name in names for candidate in (name.lower(), name.lower() + NOM_SUFFIX)]


def find_file(index, bundle_names, filenames):
    """Find the first bundle holding one of the wanted files.

    Filenames match the end of a path at a folder boundary, case-insensitively, so `SkillIcon/x.png` only matches inside that folder.

    Args:
        index: The bundle index from `load_index`.
        bundle_names: Candidate bundle names in preference order, already expanded with `_nom`.
        filenames: Filename alternatives in preference order.

    Returns:
        A `{"bundle", "path"}` dict, or None when no candidate holds any alternative.
    """
    suffixes = ["/" + filename.lower() for filename in filenames]
    for name in bundle_names:
        bundle = index.get(name)
        if not bundle:
            continue
        for suffix in suffixes:
            for lowered, path in bundle["files"]:
                if lowered.endswith(suffix):
                    return {"bundle": name, "path": path}
    return None


def resolve_item(index, tier, key, stem, bundle_names, roles, **extra):
    """Resolve one wanted item role by role.

    Args:
        index: The bundle index from `load_index`.
        tier: One of `TIERS`.
        key: Stable item key such as `skin_art:65:30033`.
        stem: Codename used to fill the role filename templates.
        bundle_names: Bundle names in preference order, before `_nom` expansion.
        roles: Role tuples such as `ART_ROLES`.
        **extra: Descriptive fields copied onto the item, e.g. `doll_id`.

    Returns:
        The item dict with `status` of `resolved`, `partial` or `unresolved`.
    """
    candidates = bundle_candidates(bundle_names)
    assets, missing, found_required = {}, [], 0
    for role, templates, required in roles:
        hit = find_file(index, candidates, [template.format(stem=stem) for template in templates])
        if hit:
            assets[role] = hit
            found_required += required
        elif required:
            missing.append(role)
    bundles = sorted({hit["bundle"] for hit in assets.values()})
    if not missing:
        status = "resolved"
    elif found_required:
        status = "partial"
    else:
        status = "unresolved"
    return {
        "key": key,
        "tier": tier,
        **extra,
        "status": status,
        "bundles": bundles,
        "assets": assets,
        "missing": missing,
        "sizeOriginal": sum(index[name]["sizeOriginal"] for name in bundles),
    }


def rig_stem(index, bundle_names, stem):
    """Find the stem a rig's files actually use.

    A few `_spine` bundles name their files differently from the codename, e.g. `Gsh-18_523.skel` in `character_gsh18_523_spine`. When no
    candidate holds `<stem>.skel`, the stem is taken from the one combat skeleton in the first existing bundle, the skeleton with no `R` prefix.

    Args:
        index: The bundle index from `load_index`.
        bundle_names: Candidate bundle names in preference order, already expanded with `_nom`.
        stem: The codename-based stem.

    Returns:
        The stem to resolve the Spine roles with.
    """
    if find_file(index, bundle_names, [template.format(stem=stem) for template in SPINE_ROLES[0][1]]):
        return stem
    for name in bundle_names:
        bundle = index.get(name)
        if not bundle:
            continue
        skels = {path.rsplit("/", 1)[-1].split(".skel")[0] for lowered, path in bundle["files"] if lowered.endswith((".skel", ".skel.bytes"))}
        combat = [skel for skel in skels if not (skel[:1] in "Rr" and skel[1:] in skels)]
        return combat[0] if len(combat) == 1 else stem
    return stem


def spine_item(index, tier, key, stem, art_bundle, **extra):
    """Resolve a rig from `<art bundle>_spine`, falling back to the art bundle.

    Args:
        index: The bundle index from `load_index`.
        tier: One of the Spine tiers.
        key: Stable item key.
        stem: The codename-based stem.
        art_bundle: The art bundle name the rig bundle is named after.
        **extra: Descriptive fields copied onto the item.

    Returns:
        The item dict, with `code` set to the stem the rig files use.
    """
    names = [f"{art_bundle}_spine", art_bundle]
    actual = rig_stem(index, bundle_candidates(names), stem)
    return resolve_item(index, tier, key, actual, names, SPINE_ROLES, **{**extra, "code": actual})


def unresolved_item(tier, key, reason, **extra):
    """Build an item that could not even be named, e.g. a doll with no codename.

    Args:
        tier: One of `TIERS`.
        key: Stable item key.
        reason: Why no bundle name could be built.
        **extra: Descriptive fields copied onto the item.

    Returns:
        An unresolved item dict.
    """
    return {"key": key, "tier": tier, **extra, "status": "unresolved", "reason": reason, "bundles": [], "assets": {}, "missing": [], "sizeOriginal": 0}


def doll_items(index, doll, codes):
    """Resolve the art and Spine items for one doll, its Mod and its skins.

    Args:
        index: The bundle index from `load_index`.
        doll: One site doll record with `normal`, `mod` and `skins`.
        codes: Weapon codename by gun id, as `download_spine.resolve_code` expects.

    Returns:
        A list of item dicts.
    """
    doll_id = doll["normal"]["id"]
    code = resolve_code(doll_id, codes)
    if not code:
        reason = "no gun code"
        return [unresolved_item("art", f"art:{doll_id}", reason, doll_id=doll_id), unresolved_item("spine", f"spine:{doll_id}", reason, doll_id=doll_id)]

    has_mod = doll.get("mod") is not None
    art = f"character_{code}"
    items = [
        resolve_item(index, "art", f"art:{doll_id}", code, [art], ART_ROLES, doll_id=doll_id, code=code),
        spine_item(index, "spine", f"spine:{doll_id}", code, art, doll_id=doll_id),
    ]
    if has_mod:
        mod_code = resolve_code(doll_id, codes, mod=True)
        mod_art = f"character_{mod_code}"
        items.append(resolve_item(index, "mod_art", f"mod_art:{doll_id}", mod_code, [mod_art], ART_ROLES, doll_id=doll_id, code=mod_code))
        items.append(spine_item(index, "mod_spine", f"mod_spine:{doll_id}", mod_code, mod_art, doll_id=doll_id))

    skin_roles = ART_ROLES + ((MOD_CARD_ROLE,) if has_mod else ())
    for skin_id in (doll.get("skins") or {}).get("skin_ids") or []:
        if skin_id is None:
            continue
        stem = f"{code}_{skin_id}"
        skin_art = f"character_{stem}"
        fields = {"doll_id": doll_id, "skin_id": skin_id, "code": stem}
        items.append(resolve_item(index, "skin_art", f"skin_art:{doll_id}:{skin_id}", stem, [skin_art], skin_roles, **fields))
        items.append(spine_item(index, "skin_spine", f"skin_spine:{doll_id}:{skin_id}", stem, skin_art, doll_id=doll_id, skin_id=skin_id))
    return items


def skill_items(index, dolls, guns, skill_codes):
    """Resolve one skill icon item per distinct skill codename.

    Skill 1 comes from the doll's `gun.skill1`, and a Mod's skill 2 from `gun(20000 + id).skill2`. Icons are shared by codename, so each item
    lists the doll slots that use it.

    Args:
        index: The bundle index from `load_index`.
        dolls: Site doll records.
        guns: Gun rows by id.
        skill_codes: Skill codename by skill group id.

    Returns:
        A list of item dicts.
    """
    users = collections.OrderedDict()
    items = []
    for doll in dolls:
        doll_id = doll["normal"]["id"]
        slots = [("skill1", doll_id, "skill1")]
        if doll.get("mod") is not None:
            slots.append(("skill2", MOD_ID_OFFSET + doll_id, "skill2"))
        for slot, gun_id, field in slots:
            code = skill_codes.get((guns.get(gun_id) or {}).get(field))
            if not code:
                items.append(unresolved_item("skill_icon", f"skill_icon:doll:{doll_id}:{slot}", "no skill code", users=[[doll_id, slot]]))
                continue
            users.setdefault(code, []).append([doll_id, slot])
    for code, slots in users.items():
        icon = SKILL_ICON_ALIASES.get(code, code)
        items.append(resolve_item(index, "skill_icon", f"skill_icon:{code}", icon, [SKILL_BUNDLE], SKILL_ROLES, code=code, users=slots))
    return items


def equip_items(index, equipment_ids, equip_codes):
    """Resolve one icon item per equipment id the site shows.

    Args:
        index: The bundle index from `load_index`.
        equipment_ids: Equipment ids from the site data.
        equip_codes: Equipment codename by id.

    Returns:
        A list of item dicts.
    """
    items = []
    for equip_id in equipment_ids:
        code = equip_codes.get(equip_id)
        key = f"equip_icon:{equip_id}"
        if not code:
            items.append(unresolved_item("equip_icon", key, "no equip code", equip_id=equip_id))
            continue
        items.append(resolve_item(index, "equip_icon", key, code, [EQUIP_BUNDLE], EQUIP_ROLES, equip_id=equip_id, code=code))
    return items


def is_expected_gap(item):
    """Tell whether an unresolved item is a known, accepted gap.

    Args:
        item: An unresolved item dict.

    Returns:
        True for the skill codes with no icon, and for skill slots of collaboration dolls that have no `gun` row.
    """
    if item["tier"] != "skill_icon":
        return False
    if item.get("code", "").lower() in EXPECTED_MISSING_SKILL_CODES:
        return True
    return item.get("reason") == "no skill code" and all(doll_id in CODE_OVERRIDES for doll_id, _slot in item["users"])


def summarise(items, index):
    """Total the items per tier and collect the bundles to download.

    Args:
        items: Every resolved or unresolved item.
        index: The bundle index from `load_index`.

    Returns:
        A `(summary, bundles)` pair. `bundles` maps each needed bundle name to its `resname` and `sizeOriginal`.
    """
    tiers = {tier: {"items": 0, "resolved": 0, "partial": 0, "unresolved": 0} for tier in TIERS}
    summary = {"tiers": tiers, "partial": [], "unresolved_expected": [], "unresolved_unexpected": []}
    names = set()
    for item in items:
        tiers[item["tier"]]["items"] += 1
        tiers[item["tier"]][item["status"]] += 1
        names.update(item["bundles"])
        if item["status"] == "partial":
            summary["partial"].append({"key": item["key"], "missing": item["missing"]})
        elif item["status"] == "unresolved":
            entry = {"key": item["key"], "reason": item.get("reason", "no bundle holds the files")}
            summary["unresolved_expected" if is_expected_gap(item) else "unresolved_unexpected"].append(entry)
    bundles = {name: {"resname": index[name]["resname"], "sizeOriginal": index[name]["sizeOriginal"]} for name in sorted(names)}
    summary["bundle_count"] = len(bundles)
    summary["download_bytes"] = sum(bundle["sizeOriginal"] for bundle in bundles.values())
    summary["download_mb"] = round(summary["download_bytes"] / BYTES_PER_MB, 1)
    return summary, bundles


def build_inventory(resdata, dolls, equipment_ids, guns, skill_codes, equip_codes):
    """Resolve every wanted asset against the ResData manifest.

    Args:
        resdata: The parsed `resdata_no_hash.json`.
        dolls: Site doll records.
        equipment_ids: Equipment ids from the site data.
        guns: Gun rows by id.
        skill_codes: Skill codename by skill group id.
        equip_codes: Equipment codename by id.

    Returns:
        The inventory dict with `resVersion`, `resUrl`, `summary`, `bundles` and `items`.
    """
    index, res_url = load_index(resdata)
    codes = {gun_id: row["code"] for gun_id, row in guns.items() if row.get("code")}
    items = []
    for doll in dolls:
        items.extend(doll_items(index, doll, codes))
    items.extend(skill_items(index, dolls, guns, skill_codes))
    items.extend(equip_items(index, equipment_ids, equip_codes))
    summary, bundles = summarise(items, index)
    return {"resVersion": resdata.get("resVison"), "resUrl": res_url, "summary": summary, "bundles": bundles, "items": items}


def inventory_from_paths(resdata_path, gf_data_dir, site_dir):
    """Load every input from disk and build the inventory.

    Args:
        resdata_path: Path to `resdata_no_hash.json`.
        gf_data_dir: The `gf-data-us` checkout.
        site_dir: Directory holding the site's `dolls-*.json` and `equipment.json`.

    Returns:
        The inventory dict from `build_inventory`.
    """
    dolls, equipment_ids = load_site(site_dir)
    return build_inventory(read_json(resdata_path), dolls, equipment_ids, *load_tables(gf_data_dir))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Download


def log_line(message):
    """Print one progress line, safe to call from worker threads.

    Args:
        message: The line to print.
    """
    with LOG_LOCK:
        print(message, flush=True)


def http_fetch(url, dest):
    """Stream one URL to a file with a descriptive User-Agent.

    Args:
        url: The bundle URL.
        dest: The file path to write.

    Raises:
        urllib.error.URLError: On a network or HTTP failure.
    """
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response, open(dest, "wb") as handle:
        shutil.copyfileobj(response, handle, CHUNK_BYTES)


def cached_size(cache_dir, name):
    """Read the size of a cached bundle.

    Args:
        cache_dir: The bundle cache directory.
        name: Bundle name.

    Returns:
        The byte count, or None when the bundle is not cached.
    """
    path = os.path.join(cache_dir, f"{name}.ab")
    return os.path.getsize(path) if os.path.isfile(path) else None


def fetch_bundle(name, bundle, res_url, cache_dir, fetch, sleep):
    """Download one bundle with retries, writing through a `.part` file.

    Args:
        name: Bundle name.
        bundle: Dict with `resname` and `sizeOriginal`.
        res_url: CDN base URL.
        cache_dir: The bundle cache directory.
        fetch: Callable `(url, dest)` that writes the URL to `dest`.
        sleep: Callable used for the backoff delay.

    Returns:
        None on success, or the last error message after `ATTEMPTS` failures.
    """
    url = f"{res_url}{bundle['resname']}.ab"
    final = os.path.join(cache_dir, f"{name}.ab")
    part = f"{final}.part"
    error = None
    for attempt in range(ATTEMPTS):
        if attempt:
            sleep(BACKOFF_SECONDS * 2 ** (attempt - 1))
        try:
            fetch(url, part)
            size = os.path.getsize(part)
            if size != bundle["sizeOriginal"]:
                raise OSError(f"size {size} != expected {bundle['sizeOriginal']}")
            os.replace(part, final)
            return None
        except Exception as exc:
            error = f"attempt {attempt + 1}: {exc}"
            if os.path.exists(part):
                os.remove(part)
    return error


def download_bundles(bundles, res_url, cache_dir, fetch=http_fetch, workers=MAX_WORKERS, sleep=time.sleep, log=log_line):
    """Download every bundle not already cached at its expected size.

    Args:
        bundles: Map of bundle name to `resname` and `sizeOriginal`.
        res_url: CDN base URL.
        cache_dir: The bundle cache directory.
        fetch: Callable `(url, dest)` that writes the URL to `dest`.
        workers: Parallel downloads, capped at `MAX_WORKERS`.
        sleep: Callable used for the backoff delay.
        log: Callable receiving progress lines.

    Returns:
        A dict with `downloaded` and `skipped` name lists, `failed` entries of `{name, error}` and `bytes` downloaded.
    """
    os.makedirs(cache_dir, exist_ok=True)
    skipped = [name for name, bundle in bundles.items() if cached_size(cache_dir, name) == bundle["sizeOriginal"]]
    cached = set(skipped)
    pending = [name for name in bundles if name not in cached]
    total_bytes = sum(bundles[name]["sizeOriginal"] for name in pending)
    log(f"{len(bundles)} bundles: {len(skipped)} cached, {len(pending)} to download ({total_bytes / BYTES_PER_MB:.1f} MB)")

    result = {"downloaded": [], "skipped": skipped, "failed": [], "bytes": 0}
    started = time.monotonic()
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, min(workers, MAX_WORKERS))) as pool:
        futures = {pool.submit(fetch_bundle, name, bundles[name], res_url, cache_dir, fetch, sleep): name for name in pending}
        for done, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            name = futures[future]
            error = future.result()
            if error:
                result["failed"].append({"name": name, "error": error})
                log(f"[{done}/{len(pending)}] FAILED {name}: {error}")
                continue
            result["downloaded"].append(name)
            result["bytes"] += bundles[name]["sizeOriginal"]
            elapsed = time.monotonic() - started
            log(f"[{done}/{len(pending)}] {name} {bundles[name]['sizeOriginal'] / BYTES_PER_MB:.2f} MB, {result['bytes'] / BYTES_PER_MB:.1f} MB in {elapsed:.0f}s")
    result["downloaded"].sort()
    result["failed"].sort(key=lambda entry: entry["name"])
    return result


def verify_cache(bundles, cache_dir):
    """List bundles that are missing from the cache or have the wrong size.

    Args:
        bundles: Map of bundle name to `resname` and `sizeOriginal`.
        cache_dir: The bundle cache directory.

    Returns:
        A list of `{name, expected, actual}` dicts, empty when the cache is complete.
    """
    problems = []
    for name, bundle in sorted(bundles.items()):
        actual = cached_size(cache_dir, name)
        if actual != bundle["sizeOriginal"]:
            problems.append({"name": name, "expected": bundle["sizeOriginal"], "actual": actual})
    return problems


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# CLI


def print_summary(inventory):
    """Print the inventory summary as a short table.

    Args:
        inventory: The inventory dict from `build_inventory`.
    """
    summary = inventory["summary"]
    print(f"resVersion={inventory['resVersion']}  cdn={inventory['resUrl']}")
    print(f"{'TIER':<12}{'ITEMS':>7}{'RESOLVED':>10}{'PARTIAL':>9}{'UNRESOLVED':>12}")
    for tier, counts in summary["tiers"].items():
        print(f"{tier:<12}{counts['items']:>7}{counts['resolved']:>10}{counts['partial']:>9}{counts['unresolved']:>12}")
    print(f"bundles to download: {summary['bundle_count']} ({summary['download_mb']} MB)")
    for label in ("unresolved_expected", "unresolved_unexpected", "partial"):
        entries = summary[label]
        print(f"{label}: {len(entries)}")
        for entry in entries:
            print(f"  {entry['key']}  {entry.get('reason') or ','.join(entry['missing'])}")


def main():
    """Parse arguments and run the requested subcommand."""
    parser = argparse.ArgumentParser(description="Resolve and download the game's asset bundles for the asset rebuild.")
    parser.add_argument("command", choices=("inventory", "download", "verify"))
    parser.add_argument("--gf-data", default=os.environ.get("GF_DATA_DIR"), help="The gf-data-us checkout. Defaults to $GF_DATA_DIR.")
    parser.add_argument("--site-data", default=SITE_DATA_DIR, help="Directory holding the site's dolls-*.json and equipment.json.")
    parser.add_argument("--cache", default=BUNDLE_CACHE_DIR, help="Bundle cache directory.")
    parser.add_argument("--workers", type=int, default=MAX_WORKERS, help=f"Parallel downloads, at most {MAX_WORKERS}.")
    args = parser.parse_args()
    if not args.gf_data:
        sys.exit("pass --gf-data or set GF_DATA_DIR")

    inventory = inventory_from_paths(os.path.join(args.gf_data, "resdata_no_hash.json"), args.gf_data, args.site_data)
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(INVENTORY_PATH, "w", encoding="utf-8") as handle:
        json.dump(inventory, handle, indent=1, ensure_ascii=False)

    if args.command == "inventory":
        print_summary(inventory)
        print(f"wrote {INVENTORY_PATH}")
        return

    bundles = inventory["bundles"]
    if args.command == "download":
        started = time.monotonic()
        result = download_bundles(bundles, inventory["resUrl"], args.cache, workers=args.workers)
        minutes = (time.monotonic() - started) / 60
        print(f"downloaded {len(result['downloaded'])} ({result['bytes'] / BYTES_PER_MB:.1f} MB), skipped {len(result['skipped'])}, failed {len(result['failed'])} in {minutes:.1f} min")
        for entry in result["failed"]:
            print(f"  FAILED {entry['name']}: {entry['error']}")

    problems = verify_cache(bundles, args.cache)
    cached_mb = sum(bundle["sizeOriginal"] for bundle in bundles.values()) / BYTES_PER_MB
    print(f"verify: {len(bundles) - len(problems)}/{len(bundles)} bundles cached at expected size ({cached_mb:.1f} MB expected)")
    for problem in problems:
        print(f"  {problem['name']}: expected {problem['expected']}, found {problem['actual']}")
    if problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
