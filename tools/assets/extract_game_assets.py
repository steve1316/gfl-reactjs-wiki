#!/usr/bin/env python3
"""Extract card art, full art, skill icons, equipment icons and Spine rigs from the cached game bundles into the staging trees.

Reads `tools/assets/.cache/inventory.json` (written by `game_bundles.py`) and the bundles it names, and writes:

- `tools/assets/.staging/assets/`: `tdolls/<id>/card.webp` / `card_d.webp` (plus `mod/` and `skins/<skinId>/`, with `mod_card(_d).webp` for
  Mod-skin cards), `tdolls/<id>/skill1.png` / `skill2.png`, `equipment/<equipId>.png` and the UI images carried over from the current asset repo.
- `tools/assets/.staging/art/`: `tdolls/<id>/full.webp` / `full_d.webp`, with the same `mod/` and `skins/<skinId>/` folders.
- `tools/assets/.staging/assets/spine/<id>/`: the base combat and dorm rigs, with `mod/` and `skins/<skinId>/` folders for the Mod and skin rigs.
- `tools/assets/.staging/extract-report.json`: counts per tier, missing assets, non-standard sizes and bytes per tree.
- `tools/assets/.staging/spine-report.json`: rig counts, missing rigs and bytes per tree after the Spine pass.

Skins listed as `legacy` in `tools/data/extra-skins.json` have no game bundle. Their cards and full art are converted from the old `skinN` PNGs of the
old-layout asset and art repos into `skins/<key>/`. None of them has a Spine rig that clearly belongs to it, so no legacy rigs are copied. The
collaboration dolls 1003-1008 have no skill codename, so their skill icons are carried over from the old asset repo the same way.

Every input from the old-layout repos (legacy skins, collaboration skill icons, UI images, equipment proof icons and a sample of old cards for the
card check) is read from a snapshot in the git-ignored `tools/assets/.cache/legacy/`, so the extractor still runs once the repos are rebuilt.
`snapshot-legacy` writes it from the clones' `main` with `git cat-file`, and `snapshot.json` records the source commits, paths and blob hashes.

Cards are the two halves of the game's 512x512 `pic_<Code>_N` atlas. Equipment icons are composited onto the game's own rarity pattern sprites
from `atlasclips_listequipment`. The exclusive "ONLY" badge is already drawn into the game icon, so no badge sprite is added.

Spine rigs keep the game's own file names (`<Code>.skel`, `R<Code>.skel`, `<Code>.atlas`, page PNGs), as `download_spine.py` wrote them,
so the site's Spine 2.1 runtime reads them unchanged. Atlas page lines that differ from their texture only by case are rewritten, as
`fix_atlas_pages.mjs` does. A dorm rig with no atlas of its own shares the combat atlas.

Subcommands:

- `snapshot-legacy` copies the old-layout inputs from the clones' `main` into `tools/assets/.cache/legacy/`.
- `run` checks 20 snapshot cards against the bundles (skip with `--skip-card-check`), then extracts every image tier with a process pool and
  converts the legacy skins and skill icons.
- `spine` extracts every Spine rig into `assets/spine/`, replacing what was there.
- `verify-cards` runs only the card check.
- `proof-equip` writes side-by-side comparisons of composited and hosted equipment icons.

`run`, `verify-cards` and `proof-equip` read the snapshot. Passing `--reference-clone` and `--art-clone` instead reads the clones' `--legacy-ref`
(default `main`) into a temporary snapshot for that run only. `--staging` picks the output root.
"""

import argparse
import collections
import concurrent.futures
import hashlib
import io
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
import time

from PIL import Image

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS_DIR)

from game_bundles import BUNDLE_CACHE_DIR, BYTES_PER_MB, INVENTORY_PATH, REPO_ROOT, SITE_DATA_DIR, read_json  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

STAGING_DIR = os.path.join(TOOLS_DIR, ".staging")
LEGACY_DIR = os.path.join(TOOLS_DIR, ".cache", "legacy")
LEGACY_MANIFEST_NAME = "snapshot.json"
LEGACY_REF = "main"
EXTRA_SKINS_PATH = os.path.join(REPO_ROOT, "tools", "data", "extra-skins.json")
TREES = ("assets", "art")

CARD_QUALITY = 90
FULL_QUALITY = 85
WEBP_METHOD = 4
FULL_SIZE = (2048, 2048)
CARD_ATLAS_SIZE = (512, 512)
SKILL_SIZE = (100, 100)
EQUIP_SOURCE_SIZE = (256, 256)

WARN_BYTES = 900 * BYTES_PER_MB
LIMIT_BYTES = 1000 * BYTES_PER_MB
MAX_FILE_BYTES = 50 * BYTES_PER_MB

# Equipment frame. The game's list card is 128x98 with the 256px icon drawn at 123px, so the hosted 256x196 icons are that card at 2x.
# Size and offset were fitted against the hosted icons (best match at 246px, offset (6, -24)).
FRAME_BUNDLE = "atlasclips_listequipment"
EQUIP_SIZE = (256, 196)
EQUIP_ICON_SIZE = 246
EQUIP_ICON_OFFSET = (6, -24)
# Rarity -> the game's own sprite name for the white, blue, green and yellow pattern.
RARITY_BACKGROUNDS = {2: "\u5e95\u7eb9_\u767d", 3: "\u5e95\u7eb9_\u84dd", 4: "\u5e95\u7eb9_\u7eff", 5: "\u5e95\u7eb9_\u9ec4"}

# Inventory role -> output tree and names. Cards split into a normal and damaged half, so they carry two names.
ROLE_OUTPUTS = (
    ("card", "assets", ("card.webp", "card_d.webp")),
    ("mod_card", "assets", ("mod_card.webp", "mod_card_d.webp")),
    ("full", "art", ("full.webp",)),
    ("full_d", "art", ("full_d.webp",)),
)
ART_TIERS = ("art", "mod_art", "skin_art")
SPINE_TIERS = ("spine", "mod_spine", "skin_spine")

# Skin rigs the game does not ship at all. Anything else missing fails the Spine pass.
EXPECTED_MISSING_RIGS = frozenset(("skin_spine:95:1809",))

# Report tiers, keyed by inventory tier and role.
REPORT_TIERS = {
    ("art", "card"): "card",
    ("art", "full"): "full",
    ("art", "full_d"): "full",
    ("mod_art", "card"): "mod_card",
    ("mod_art", "full"): "mod_full",
    ("mod_art", "full_d"): "mod_full",
    ("skin_art", "card"): "skin_card",
    ("skin_art", "mod_card"): "skin_mod_card",
    ("skin_art", "full"): "skin_full",
    ("skin_art", "full_d"): "skin_full",
}

# Legacy skin files: `(role, clone, old file name template, output name, required, report tier)`. `{id}` is the doll id, `{slot}` the old slot.
LEGACY_FILES = (
    ("card", "assets", "{id}_skin{slot}_card.png", "card.webp", True, "skin_card"),
    ("card_d", "assets", "{id}_skin{slot}_card_d.png", "card_d.webp", True, "skin_card"),
    ("mod_card", "assets", "{id}_mod_skin{slot}_card.png", "mod_card.webp", False, "skin_mod_card"),
    ("mod_card_d", "assets", "{id}_mod_skin{slot}_card_d.png", "mod_card_d.webp", False, "skin_mod_card"),
    ("full", "art", "{id}_skin{slot}_full.png", "full.webp", True, "skin_full"),
    ("full_d", "art", "{id}_skin{slot}_full_d.png", "full_d.webp", True, "skin_full"),
)
LEGACY_TIERS = {role: tier for role, _clone, _template, _name, _required, tier in LEGACY_FILES}
CARD_SIZE = (256, 512)

# Old path of a collaboration doll's skill icon in the old asset repo. `{slot}` is `skill1` or `skill2`.
LEGACY_SKILL_TEMPLATE = "tdolls/{id}/{id}_{slot}.png"

HOSTED_CARD_RE = re.compile(r"^\d+_(?:(mod)_)?(?:skin(\d+)_)?card\.png$")
CARD_CHECK_COUNT = 20
CARD_CHECK_SEED = 4
# Old base and Mod cards kept in the legacy snapshot for the card check.
CARD_SNAPSHOT_COUNT = 40
# Hosted icons the equipment proofs compare against, by equipment id. The site data no longer carries hosted icon paths.
PROOF_EQUIP_ICONS = {
    1: "equipment/opticalSight/BM 3-12X40.png",
    2: "equipment/opticalSight/LRA 2-12x50.png",
    3: "equipment/opticalSight/PSO-1.png",
    4: "equipment/opticalSight/VFL 6-24x56.png",
    59: "equipment/armorPiercingAmmo/National Match-Grade Armor-Piercing Ammo.png",
}

# Files at the root of the old asset repo that are not UI images.
UI_SKIP = frozenset(("README.md", "assets-manifest.json", "CNAME", ".nojekyll"))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Image logic


def split_card_atlas(atlas):
    """Split a card atlas into its normal (left) and damaged (right) halves.

    Args:
        atlas: The decoded `pic_<Code>_N` texture.

    Raises:
        ValueError: When the width is odd.

    Returns:
        A `(normal, damaged)` pair of images, each half the width and the full height.
    """
    width, height = atlas.size
    if width % 2:
        raise ValueError(f"card atlas width {width} is odd")
    half = width // 2
    return atlas.crop((0, 0, half, height)), atlas.crop((half, 0, width, height))


def merge_alpha(color, alpha):
    """Merge an `_Alpha` sibling texture into a colour texture.

    Args:
        color: The colour texture.
        alpha: The alpha texture. Its `A` channel is used when it has one, otherwise its single channel. It is resized when smaller.

    Returns:
        A new RGBA image.
    """
    channel = alpha.getchannel("A") if "A" in alpha.getbands() else alpha.convert("L")
    if channel.size != color.size:
        channel = channel.resize(color.size, Image.Resampling.BICUBIC)
    merged = color.convert("RGBA")
    merged.putalpha(channel)
    return merged


def rarity_background(rarity):
    """Name the pattern sprite used behind an equipment icon.

    Args:
        rarity: Equipment rarity from the site data.

    Raises:
        ValueError: For a rarity with no known background.

    Returns:
        The sprite name inside `FRAME_BUNDLE`.
    """
    if rarity not in RARITY_BACKGROUNDS:
        raise ValueError(f"no background for rarity {rarity}")
    return RARITY_BACKGROUNDS[rarity]


def compose_equip_icon(icon, background):
    """Draw an equipment icon over its rarity background at the hosted size.

    Args:
        icon: The RGBA game icon, normally 256x256.
        background: The rarity pattern sprite, normally 127x98.

    Returns:
        A 256x196 RGB image.
    """
    canvas = background.convert("RGBA").resize(EQUIP_SIZE, Image.Resampling.BICUBIC)
    layer = Image.new("RGBA", EQUIP_SIZE, (0, 0, 0, 0))
    layer.paste(icon.convert("RGBA").resize((EQUIP_ICON_SIZE, EQUIP_ICON_SIZE), Image.Resampling.BICUBIC), EQUIP_ICON_OFFSET)
    return Image.alpha_composite(canvas, layer).convert("RGB")


def encode_webp(image, quality):
    """Encode an image as lossy WebP with every encoder option set explicitly.

    Args:
        image: An RGB or RGBA image.
        quality: WebP quality, 0-100.

    Returns:
        The encoded bytes.
    """
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", lossless=False, quality=quality, method=WEBP_METHOD, alpha_quality=100, exact=False)
    return buffer.getvalue()


def encode_png(image):
    """Encode an image as PNG with fixed compression settings.

    Args:
        image: The image to encode.

    Returns:
        The encoded bytes.
    """
    buffer = io.BytesIO()
    image.save(buffer, "PNG", compress_level=9, optimize=False)
    return buffer.getvalue()


def check_file_size(tree, rel, size):
    """Refuse a file over the Pages per-file limit.

    Args:
        tree: `assets` or `art`.
        rel: Path inside the tree.
        size: The file's size in bytes.

    Raises:
        ValueError: When the file is over 50 MB, naming the offending path.
    """
    if size > MAX_FILE_BYTES:
        raise ValueError(f"{tree}/{rel} is {size / BYTES_PER_MB:.1f} MB, over the {MAX_FILE_BYTES // BYTES_PER_MB} MB per-file limit")


def unexpected_missing(missing, expected_keys):
    """Pick the missing entries that are not known, accepted gaps.

    Only whole items the inventory already listed as expected gaps are accepted. Those items are never handed to a worker, so decode
    failures, bundle load failures and worker crashes always count.

    Args:
        missing: Report `missing` entries with `key`, `role` and `reason`.
        expected_keys: Item keys of the inventory's expected gaps.

    Returns:
        The entries that should fail the run.
    """
    return [row for row in missing if not (row["key"] in expected_keys and row["role"] == "*")]


def expected_gap_keys(inventory):
    """Collect the item keys of the inventory's expected gaps.

    Args:
        inventory: The inventory dict.

    Returns:
        A set of item keys.
    """
    return {row["key"] for row in inventory["summary"]["unresolved_expected"]}


def tree_limit_status(total_bytes):
    """Classify a staging tree size against the Pages limits.

    Args:
        total_bytes: Bytes in the tree.

    Returns:
        `ok`, `warn` above 900 MB, or `over` above 1,000 MB.
    """
    if total_bytes > LIMIT_BYTES:
        return "over"
    return "warn" if total_bytes > WARN_BYTES else "ok"


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Paths


def form_dir(item):
    """Build the folder an art item's files live in.

    Args:
        item: An `art`, `mod_art` or `skin_art` inventory item.

    Returns:
        A relative folder such as `tdolls/65/skins/30033`.
    """
    parts = ["tdolls", str(item["doll_id"])]
    if item["tier"] == "mod_art":
        parts.append("mod")
    elif item["tier"] == "skin_art":
        parts.extend(("skins", str(item["skin_id"])))
    return "/".join(parts)


def art_outputs(item):
    """List the files an art item produces, role by role.

    Args:
        item: An `art`, `mod_art` or `skin_art` inventory item.

    Returns:
        A list of `(role, tree, [relative paths])`, in `ROLE_OUTPUTS` order, for the roles the item resolved.
    """
    folder = form_dir(item)
    return [(role, tree, [f"{folder}/{name}" for name in names]) for role, tree, names in ROLE_OUTPUTS if role in item["assets"]]


def skill_outputs(item):
    """List the skill icon files one skill codename is written to.

    Args:
        item: A `skill_icon` inventory item with `users`.

    Returns:
        One `tdolls/<id>/<slot>.png` path per doll slot using the icon.
    """
    return [f"tdolls/{doll_id}/{slot}.png" for doll_id, slot in item["users"]]


def equip_output(item):
    """Build the output path of an equipment icon.

    Args:
        item: An `equip_icon` inventory item.

    Returns:
        The relative path `equipment/<equipId>.png`.
    """
    return f"equipment/{item['equip_id']}.png"


def rig_dir(item):
    """Build the folder a Spine item's files live in, inside the asset tree.

    Args:
        item: A `spine`, `mod_spine` or `skin_spine` inventory item.

    Returns:
        A relative folder such as `spine/65/skins/805`.
    """
    parts = ["spine", str(item["doll_id"])]
    if item["tier"] == "mod_spine":
        parts.append("mod")
    elif item["tier"] == "skin_spine":
        parts.extend(("skins", str(item["skin_id"])))
    return "/".join(parts)


def spine_file_name(name, extension):
    """Turn a TextAsset name into the file name it is published under.

    Args:
        name: The TextAsset `m_Name`, normally already ending in the extension, e.g. `HK416.skel`.
        extension: `.skel` or `.atlas`.

    Returns:
        The file name with the extension exactly once.
    """
    return name if name.endswith(extension) else f"{name}{extension}"


def rewrite_atlas_pages(text, texture_names):
    """Point each atlas page at a texture file that exists, fixing case-only differences.

    A page name is the first non-blank line of the file and the first non-blank line after every blank line. Everything else is untouched.

    Args:
        text: The atlas text.
        texture_names: File names of the textures available, e.g. `HK416.png`.

    Returns:
        A `(text, pages, unresolved)` triple: the atlas text with case fixed, the texture file names the pages use, and page names with no
        texture of any casing.
    """
    by_lower = {name.lower(): name for name in texture_names}
    lines, pages, unresolved, at_page = text.split("\n"), [], [], True
    for number, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            at_page = True
            continue
        if not at_page:
            continue
        at_page = False
        actual = stripped if stripped in texture_names else by_lower.get(stripped.lower())
        if not actual:
            unresolved.append(stripped)
            continue
        pages.append(actual)
        if actual != stripped:
            lines[number] = line.replace(stripped, actual)
    return "\n".join(lines), pages, unresolved


def rig_counts(rigs):
    """Count extracted rigs per tier, dorm rigs, shared atlases and atlas pages.

    Args:
        rigs: Rig records from the Spine workers.

    Returns:
        A dict of counts.
    """
    counts = {tier: 0 for tier in SPINE_TIERS}
    counts.update(dorm=0, shared_atlas=0, pages=0)
    for rig in rigs:
        counts[rig["tier"]] += 1
        counts["dorm"] += rig["dorm"]
        counts["shared_atlas"] += rig["shared_atlas"]
        counts["pages"] += rig["pages"]
    return counts


def parse_hosted_card(filename):
    """Parse a card filename from the current asset repo.

    Args:
        filename: A basename such as `65_mod_skin2_card.png`.

    Returns:
        A `(form, slot)` pair with form `normal`, `mod`, `skin` or `mod_skin` and the 1-based skin slot, or None for anything else.
    """
    match = HOSTED_CARD_RE.match(filename)
    if not match:
        return None
    mod, slot = match.group(1), match.group(2)
    form = ("mod_skin" if mod else "skin") if slot else ("mod" if mod else "normal")
    return form, int(slot) if slot else None


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Bundle access


def unity_load(path):
    """Open one bundle with UnityPy.

    Args:
        path: The `.ab` file.

    Returns:
        The UnityPy environment.
    """
    import UnityPy

    return UnityPy.load(path)


def load_textures(bundle_names, cache_dir, loader=unity_load):
    """Index the `Texture2D` objects of some bundles by bundle name and lowercased container path.

    Keying by bundle as well as path keeps twin bundles that hold the same path from shadowing each other.

    Args:
        bundle_names: Bundle names to open.
        cache_dir: The bundle cache directory.
        loader: Callable opening one `.ab` file, replaceable in tests.

    Returns:
        A dict of `(bundle name, lowercased asset path)` to the UnityPy object reader.
    """
    textures = {}
    for name in bundle_names:
        env = loader(os.path.join(cache_dir, f"{name}.ab"))
        for path, obj in env.container.items():
            if obj.type.name == "Texture2D":
                textures[(name, path.lower())] = obj
    return textures


def load_named_textures(bundle_name, cache_dir, kind):
    """Index one bundle's objects of a kind by name.

    Args:
        bundle_name: Bundle name.
        cache_dir: The bundle cache directory.
        kind: `Texture2D` or `Sprite`.

    Returns:
        A dict of object name to the decoded image.
    """
    import UnityPy

    env = UnityPy.load(os.path.join(cache_dir, f"{bundle_name}.ab"))
    images = {}
    for obj in env.objects:
        if obj.type.name == kind:
            data = obj.read()
            images[data.m_Name] = data.image
    return images


def texture_for(textures, asset):
    """Find the texture of one inventory asset in the bundle it was resolved to.

    Args:
        textures: The index from `load_textures`.
        asset: An inventory asset dict with `bundle` and `path`.

    Raises:
        KeyError: When that bundle holds no texture at that path.

    Returns:
        The UnityPy object reader.
    """
    return textures[(asset["bundle"], asset["path"].lower())]


def decode(textures, asset):
    """Decode one inventory asset from a texture index.

    Args:
        textures: The index from `load_textures`.
        asset: An inventory asset dict with `bundle` and `path`.

    Raises:
        KeyError: When the bundle holds no texture at that path.

    Returns:
        The decoded PIL image.
    """
    return texture_for(textures, asset).read().image


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Workers


def new_result():
    """Build an empty worker result.

    Returns:
        A dict with `files` (tree, path, bytes, report tier), `missing` and `nonstandard` lists.
    """
    return {"files": [], "missing": [], "nonstandard": []}


def write_file(staging, tree, rel, data, tier, result):
    """Write one output file and record it.

    Args:
        staging: The staging root.
        tree: `assets` or `art`.
        rel: Path inside the tree.
        data: Encoded bytes.
        tier: Report tier the file counts under.
        result: The worker result to append to.

    Raises:
        ValueError: When the data is over the per-file limit. Nothing is written.
    """
    check_file_size(tree, rel, len(data))
    path = os.path.join(staging, tree, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(data)
    result["files"].append([tree, rel, len(data), tier])


def extract_art_item(item, cache_dir, staging):
    """Extract the cards and full art of one doll, Mod or skin.

    Args:
        item: An art inventory item.
        cache_dir: The bundle cache directory.
        staging: The staging root.

    Returns:
        A worker result.
    """
    result = new_result()
    try:
        textures = load_textures(item["bundles"], cache_dir)
    except Exception as exc:
        result["missing"].append({"key": item["key"], "role": "*", "reason": f"bundle load failed: {exc}"})
        return result
    for role, tree, paths in art_outputs(item):
        tier = REPORT_TIERS[(item["tier"], role)]
        try:
            image = decode(textures, item["assets"][role])
        except Exception as exc:
            result["missing"].append({"key": item["key"], "role": role, "reason": f"decode failed: {exc!r}"})
            continue
        expected = CARD_ATLAS_SIZE if tree == "assets" else FULL_SIZE
        if image.size != expected:
            result["nonstandard"].append({"key": item["key"], "role": role, "size": list(image.size), "expected": list(expected)})
        try:
            if tree == "assets":
                for rel, half in zip(paths, split_card_atlas(image.convert("RGB"))):
                    write_file(staging, tree, rel, encode_webp(half, CARD_QUALITY), tier, result)
            else:
                full = image if image.mode in ("RGB", "RGBA") else image.convert("RGBA")
                write_file(staging, tree, paths[0], encode_webp(full, FULL_QUALITY), tier, result)
        except Exception as exc:
            result["missing"].append({"key": item["key"], "role": role, "reason": f"encode or write failed: {exc}"})
    return result


def load_failure(items, exc):
    """Build a worker result that marks every item missing because its shared bundles failed to load.

    Args:
        items: The inventory items the worker was given.
        exc: The load error.

    Returns:
        A worker result.
    """
    result = new_result()
    result["missing"].extend({"key": item["key"], "role": "*", "reason": f"bundle load failed: {exc!r}"} for item in items)
    return result


def extract_skill_icons(items, cache_dir, staging, loader=unity_load):
    """Extract every skill icon from the skill bundle.

    Args:
        items: Resolved `skill_icon` inventory items.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file, replaceable in tests.

    Returns:
        A worker result.
    """
    try:
        textures = load_textures(sorted({name for item in items for name in item["bundles"]}), cache_dir, loader)
    except Exception as exc:
        return load_failure(items, exc)
    result = new_result()
    for item in items:
        try:
            image = decode(textures, item["assets"]["icon"])
            if image.size != SKILL_SIZE:
                result["nonstandard"].append({"key": item["key"], "role": "icon", "size": list(image.size), "expected": list(SKILL_SIZE)})
            data = encode_png(image)
            for rel in skill_outputs(item):
                write_file(staging, "assets", rel, data, "skill_icon", result)
        except Exception as exc:
            result["missing"].append({"key": item["key"], "role": "icon", "reason": f"failed: {exc!r}"})
    return result


def build_equip_icon(textures, backgrounds, item, rarity):
    """Composite one equipment icon.

    Args:
        textures: Texture index of the equipment bundle.
        backgrounds: Rarity sprites by name, from `FRAME_BUNDLE`.
        item: An `equip_icon` inventory item.
        rarity: The item's rarity from the site data.

    Returns:
        A `(composite, source size)` pair.
    """
    icon = decode(textures, item["assets"]["icon"])
    if "alpha" in item["assets"]:
        icon = merge_alpha(icon, decode(textures, item["assets"]["alpha"]))
    return compose_equip_icon(icon, backgrounds[rarity_background(rarity)]), icon.size


def extract_equip_icons(items, rarities, cache_dir, staging):
    """Extract and composite every equipment icon.

    Args:
        items: Resolved `equip_icon` inventory items.
        rarities: Rarity by equipment id.
        cache_dir: The bundle cache directory.
        staging: The staging root.

    Returns:
        A worker result.
    """
    try:
        textures = load_textures(sorted({name for item in items for name in item["bundles"]}), cache_dir)
        backgrounds = load_named_textures(FRAME_BUNDLE, cache_dir, "Sprite")
    except Exception as exc:
        return load_failure(items, exc)
    result = new_result()
    for item in items:
        try:
            image, source_size = build_equip_icon(textures, backgrounds, item, rarities[item["equip_id"]])
            if source_size != EQUIP_SOURCE_SIZE:
                result["nonstandard"].append({"key": item["key"], "role": "icon", "size": list(source_size), "expected": list(EQUIP_SOURCE_SIZE)})
            write_file(staging, "assets", equip_output(item), encode_png(image), "equip_icon", result)
        except Exception as exc:
            result["missing"].append({"key": item["key"], "role": "icon", "reason": f"failed: {exc!r}"})
    return result


def text_bytes(data):
    """Recover the raw bytes of a TextAsset.

    UnityPy returns the payload as a string decoded with surrogateescape, so encoding it back the same way restores binary skeletons exactly.

    Args:
        data: The read TextAsset.

    Returns:
        The payload bytes.
    """
    raw = data.m_Script
    return raw.encode("utf-8", "surrogateescape") if isinstance(raw, str) else bytes(raw)


def extract_spine_item(item, cache_dir, staging, loader=unity_load):
    """Extract one base, Mod or skin rig: combat skeleton, atlas and pages, plus the dorm skeleton and its atlas when it has one.

    Args:
        item: A Spine inventory item.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        loader: Callable opening one `.ab` file, replaceable in tests.

    Returns:
        A worker result with an extra `rigs` list holding one `{key, tier, dorm, shared_atlas, pages}` record when the rig was written.
    """
    result = new_result()
    result["rigs"] = []
    key, folder, tier = item["key"], rig_dir(item), f"{item['tier']}_rig"
    try:
        objects, textures = {}, {}
        for name in item["bundles"]:
            for path, obj in loader(os.path.join(cache_dir, f"{name}.ab")).container.items():
                objects[(name, path.lower())] = obj
                if obj.type.name == "Texture2D":
                    texture_name = obj.read().m_Name
                    textures[(name, texture_name.lower())] = (texture_name, obj)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "*", "reason": f"bundle load failed: {exc!r}"})
        return result

    def read_text(role):
        """Read one TextAsset role as `(file name, bytes)`."""
        data = objects[(item["assets"][role]["bundle"], item["assets"][role]["path"].lower())].read()
        return data.m_Name, text_bytes(data)

    outputs, names, pages_written = {}, {}, set()
    try:
        for role, extension in (("skel", ".skel"), ("atlas", ".atlas"), ("dorm_skel", ".skel"), ("dorm_atlas", ".atlas")):
            if role not in item["assets"]:
                continue
            name, data = read_text(role)
            names[role] = name = spine_file_name(name, extension)
            if extension == ".atlas":
                bundle = item["assets"][role]["bundle"]
                available = [f"{texture_name}.png" for (owner, _lowered), (texture_name, _obj) in textures.items() if owner == bundle]
                text, pages, unresolved = rewrite_atlas_pages(data.decode("utf-8"), available)
                for page in unresolved:
                    result["missing"].append({"key": key, "role": "page", "reason": f"{name} names {page}, which no texture in {bundle} matches"})
                data = text.encode("utf-8")
                for page in set(pages) - pages_written:
                    outputs[page] = encode_png(textures[(bundle, page[:-4].lower())][1].read().image)
                    pages_written.add(page)
            outputs[name] = data
    except Exception as exc:
        result["missing"].append({"key": key, "role": "*", "reason": f"read failed: {exc!r}"})
        return result
    if any(row["key"] == key for row in result["missing"]):
        return result

    try:
        for name, data in sorted(outputs.items()):
            write_file(staging, "assets", f"{folder}/{name}", data, tier, result)
    except Exception as exc:
        result["missing"].append({"key": key, "role": "*", "reason": f"write failed: {exc}"})
        return result
    has_dorm = "dorm_skel" in item["assets"]
    if has_dorm and names["dorm_skel"].lower() != f"r{names['skel']}".lower():
        result["nonstandard"].append({"key": key, "role": "dorm_skel", "size": names["dorm_skel"], "expected": f"R{names['skel']}"})
    result["rigs"].append({"key": key, "tier": item["tier"], "dorm": has_dorm, "shared_atlas": has_dorm and "dorm_atlas" not in item["assets"], "pages": len(pages_written)})
    return result


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Legacy skins


def load_legacy_skins(path=EXTRA_SKINS_PATH):
    """Read the `legacy` entries of the extra skins file.

    Args:
        path: The extra skins file.

    Returns:
        The legacy entries in file order, each with `doll`, `key` and `legacySlot`.
    """
    return [extra for extra in read_json(path) if extra["source"] == "legacy"]


def legacy_skin_paths(extra):
    """List a legacy skin's old slot files, relative to their old-layout repo.

    Args:
        extra: A legacy entry with `doll`, `key` and `legacySlot`.

    Returns:
        A list of `(role, tree, old path, output name, required)`, in `LEGACY_FILES` order.
    """
    doll_id = extra["doll"]
    return [(role, tree, f"tdolls/{doll_id}/{template.format(id=doll_id, slot=extra['legacySlot'])}", name, required) for role, tree, template, name, required, _tier in LEGACY_FILES]


def legacy_outputs(extra, assets_root, art_root):
    """Map a legacy skin's old slot files to their outputs in the skin-id layout.

    Args:
        extra: A legacy entry with `doll`, `key` and `legacySlot`.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot, holding the old cards.
        art_root: The old art repo files, normally the `art` folder of the legacy snapshot, holding the old full art.

    Returns:
        A list of `(role, source path, tree, output path, required)`, in `LEGACY_FILES` order.
    """
    roots = {"assets": assets_root, "art": art_root}
    folder = f"tdolls/{extra['doll']}/skins/{extra['key']}"
    return [(role, os.path.join(roots[tree], *rel.split("/")), tree, f"{folder}/{name}", required) for role, tree, rel, name, required in legacy_skin_paths(extra)]


def legacy_skill_paths(item):
    """List the old and new paths of a legacy skill icon item, one pair per doll slot using it.

    Args:
        item: A `skill_icon` inventory item with `source` of `legacy` and `users`.

    Returns:
        A list of `(old path, output path)`.
    """
    return [(LEGACY_SKILL_TEMPLATE.format(id=doll_id, slot=slot), f"tdolls/{doll_id}/{slot}.png") for doll_id, slot in item["users"]]


def extract_legacy_skill_icons(items, assets_root, staging):
    """Carry the skill icons of collaboration dolls over from the old asset repo, re-encoded as PNG like every other skill icon.

    Args:
        items: `skill_icon` inventory items with `source` of `legacy`.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        staging: The staging root.

    Returns:
        A worker result. A missing old icon is a `missing` entry under the item's key, which fails the run.
    """
    result = new_result()
    for item in items:
        for old, rel in legacy_skill_paths(item):
            source = os.path.join(assets_root, *old.split("/"))
            if not os.path.isfile(source):
                result["missing"].append({"key": item["key"], "role": "icon", "reason": f"no old file {old}"})
                continue
            try:
                with Image.open(source) as image:
                    if image.size != SKILL_SIZE:
                        result["nonstandard"].append({"key": item["key"], "role": "icon", "size": list(image.size), "expected": list(SKILL_SIZE)})
                    data = encode_png(image)
                write_file(staging, "assets", rel, data, "skill_icon", result)
            except Exception as exc:
                result["missing"].append({"key": item["key"], "role": "icon", "reason": f"convert failed: {exc!r}"})
    return result


def extract_legacy_skin(extra, assets_root, art_root, staging):
    """Convert one legacy skin's old PNGs: cards to WebP at `CARD_QUALITY`, full art to WebP at `FULL_QUALITY` at its native size.

    Args:
        extra: A legacy entry with `doll`, `key` and `legacySlot`.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        art_root: The old art repo files, normally the `art` folder of the legacy snapshot.
        staging: The staging root.

    Returns:
        A worker result. Missing required files are `missing` entries keyed `legacy_skin:<doll>:<key>`.
    """
    result = new_result()
    key = f"legacy_skin:{extra['doll']}:{extra['key']}"
    for role, source, tree, rel, required in legacy_outputs(extra, assets_root, art_root):
        if not os.path.isfile(source):
            if required:
                result["missing"].append({"key": key, "role": role, "reason": f"no old file {source}"})
            continue
        try:
            with Image.open(source) as image:
                if tree == "assets":
                    if image.size != CARD_SIZE:
                        result["nonstandard"].append({"key": key, "role": role, "size": list(image.size), "expected": list(CARD_SIZE)})
                    data = encode_webp(image.convert("RGB"), CARD_QUALITY)
                else:
                    data = encode_webp(image if image.mode in ("RGB", "RGBA") else image.convert("RGBA"), FULL_QUALITY)
            write_file(staging, tree, rel, data, LEGACY_TIERS[role], result)
        except Exception as exc:
            result["missing"].append({"key": key, "role": role, "reason": f"convert failed: {exc!r}"})
    return result


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Verification against the hosted assets


def load_rarities(site_dir):
    """Read equipment rarity by id from the site data.

    Args:
        site_dir: Directory holding `equipment.json`.

    Returns:
        A dict of rarity keyed by equipment id.
    """
    items = [item for group in read_json(os.path.join(site_dir, "equipment.json"))["items"].values() for item in group]
    return {item["id"]: item["rarity"] for item in items}


def mean_abs_diff(first, second):
    """Mean absolute per-channel difference of two same-sized images.

    Args:
        first: An image.
        second: An image of the same size, compared in the first image's mode.

    Returns:
        The mean difference on a 0-255 scale.
    """
    from PIL import ImageChops, ImageStat

    diff = ImageChops.difference(first, second.convert(first.mode))
    return sum(ImageStat.Stat(diff).mean) / len(diff.getbands())


def hosted_card_targets(inventory, paths):
    """Map every old base and Mod card among some old asset repo paths to the inventory asset it should match.

    Old skin cards sit in positional `skinN` slots, and the slot map that tied them to skin ids is retired, so they are left out. A card whose
    damaged twin is not among the paths is left out too.

    Args:
        inventory: The inventory dict.
        paths: Paths relative to the old asset repo root, such as `tdolls/65/65_card.png`.

    Returns:
        A list of `(old path, item, role)` sorted by path.
    """
    items = {item["key"]: item for item in inventory["items"]}
    present = set(paths)
    targets = []
    for rel in sorted(present):
        parts = rel.split("/")
        if len(parts) != 3 or parts[0] != "tdolls":
            continue
        parsed = parse_hosted_card(parts[2])
        if not parsed or parsed[1] or rel.replace("_card.png", "_card_d.png") not in present:
            continue
        item = items.get(f"art:{parts[1]}" if parsed[0] == "normal" else f"mod_art:{parts[1]}")
        if item and "card" in item["assets"]:
            targets.append((rel, item, "card"))
    return targets


def relative_files(root):
    """List every file under a folder as forward-slash paths relative to it.

    Args:
        root: The folder, which may not exist.

    Returns:
        Sorted relative paths.
    """
    found = []
    for folder, _dirs, names in os.walk(root):
        found.extend(os.path.relpath(os.path.join(folder, name), root).replace(os.sep, "/") for name in names)
    return sorted(found)


def verify_hosted_cards(inventory, assets_root, cache_dir, count=CARD_CHECK_COUNT, seed=CARD_CHECK_SEED):
    """Check that atlas halves match a random sample of old cards pixel for pixel.

    Args:
        inventory: The inventory dict.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        cache_dir: The bundle cache directory.
        count: How many old cards to sample, capped at the number available.
        seed: Random seed, so the sample is repeatable.

    Returns:
        A list of `{hosted, key, role, diff_card, diff_card_d}` rows.
    """
    targets = hosted_card_targets(inventory, relative_files(assets_root))
    rows = []
    for hosted, item, role in random.Random(seed).sample(targets, min(count, len(targets))):
        textures = load_textures(item["bundles"], cache_dir)
        normal, damaged = split_card_atlas(decode(textures, item["assets"][role]).convert("RGB"))
        paths = [os.path.join(assets_root, *rel.split("/")) for rel in (hosted, hosted.replace("_card.png", "_card_d.png"))]
        diffs = [mean_abs_diff(half, Image.open(path)) for half, path in zip((normal, damaged), paths)]
        rows.append({"hosted": hosted, "key": item["key"], "role": role, "diff_card": diffs[0], "diff_card_d": diffs[1]})
    return rows


def proof_equip(inventory, assets_root, site_dir, cache_dir, out_dir):
    """Write side-by-side proofs of composited against hosted equipment icons.

    Each proof is our icon, the hosted icon and their difference amplified 4x, left to right.

    Args:
        inventory: The inventory dict.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        site_dir: Directory holding `equipment.json`.
        cache_dir: The bundle cache directory.
        out_dir: Where to write the proof PNGs.

    Returns:
        A list of `{equip_id, rarity, hosted, diff, proof}` rows.
    """
    from PIL import ImageChops

    rarities = load_rarities(site_dir)
    items = {item["equip_id"]: item for item in inventory["items"] if item["tier"] == "equip_icon"}
    textures = load_textures(sorted({name for item in items.values() for name in item["bundles"]}), cache_dir)
    backgrounds = load_named_textures(FRAME_BUNDLE, cache_dir, "Sprite")
    os.makedirs(out_dir, exist_ok=True)
    rows = []
    for equip_id, hosted_path in PROOF_EQUIP_ICONS.items():
        ours, _size = build_equip_icon(textures, backgrounds, items[equip_id], rarities[equip_id])
        hosted = Image.open(os.path.join(assets_root, *hosted_path.split("/"))).convert("RGB")
        diff = ImageChops.difference(ours, hosted).point(lambda value: min(255, value * 4))
        sheet = Image.new("RGB", (EQUIP_SIZE[0] * 3, EQUIP_SIZE[1]))
        for column, image in enumerate((ours, hosted, diff)):
            sheet.paste(image, (column * EQUIP_SIZE[0], 0))
        proof = os.path.join(out_dir, f"proof_equip_{equip_id}.png")
        sheet.save(proof)
        rows.append({"equip_id": equip_id, "rarity": rarities[equip_id], "hosted": hosted_path, "diff": mean_abs_diff(ours, hosted), "proof": proof})
    return rows


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Legacy snapshot


def git_blob_sha(data):
    """Hash bytes the way git names a blob, so snapshot files can be checked against the commit they came from.

    Args:
        data: The file contents.

    Returns:
        The blob's SHA-1 hex digest.
    """
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def git_output(clone, *args):
    """Run a read-only git command in a clone and return its raw output.

    Args:
        clone: The repository path.
        *args: Arguments after `git -C <clone>`.

    Raises:
        SystemExit: When the command fails.

    Returns:
        The standard output as bytes.
    """
    result = subprocess.run(["git", "-C", clone, *args], capture_output=True)
    if result.returncode != 0:
        sys.exit(f"git {' '.join(args)} failed in {clone}: {result.stderr.decode('utf-8', 'replace').strip()}")
    return result.stdout


def legacy_wanted(inventory, legacy_skins, assets_paths, art_paths):
    """Choose the old-layout files the pipeline still needs.

    Args:
        inventory: The inventory dict.
        legacy_skins: Legacy entries from `load_legacy_skins`.
        assets_paths: Every path in the old asset repo.
        art_paths: Every path in the old art repo.

    Returns:
        A `(wanted, absent)` pair. `wanted` is a sorted list of `(tree, path)`. `absent` lists required `tree/path` entries neither repo has.
    """
    present = {"assets": set(assets_paths), "art": set(art_paths)}
    wanted, absent = set(), []

    def want(tree, rel, required=True):
        """Add one file, noting it when a required one is absent."""
        if rel in present[tree]:
            wanted.add((tree, rel))
        elif required:
            absent.append(f"{tree}/{rel}")

    for rel in present["assets"]:
        if "/" not in rel and rel not in UI_SKIP and not rel.startswith("."):
            want("assets", rel)
    for extra in legacy_skins:
        for _role, tree, rel, _name, required in legacy_skin_paths(extra):
            want(tree, rel, required)
    for item in inventory["items"]:
        if item["tier"] == "skill_icon" and item.get("source") == "legacy":
            for old, _rel in legacy_skill_paths(item):
                want("assets", old)
    for rel in PROOF_EQUIP_ICONS.values():
        want("assets", rel)
    targets = hosted_card_targets(inventory, present["assets"])
    for rel, _item, _role in random.Random(CARD_CHECK_SEED).sample(targets, min(CARD_SNAPSHOT_COUNT, len(targets))):
        want("assets", rel)
        want("assets", rel.replace("_card.png", "_card_d.png"))
    return sorted(wanted), sorted(absent)


def snapshot_legacy(inventory, legacy_skins, clones, ref, out_dir):
    """Copy the old-layout inputs out of the clones' `ref` into a snapshot folder, replacing any previous snapshot.

    The working trees are never read, so the clones can sit on any branch. Files land at `<out_dir>/<tree>/<old path>` and `snapshot.json`
    records the ref, source commits, card sample settings and each file's size and blob hash.

    Args:
        inventory: The inventory dict.
        legacy_skins: Legacy entries from `load_legacy_skins`.
        clones: Map of `assets` and `art` to the old-layout clones.
        ref: The ref holding the old layout, normally `main`.
        out_dir: The snapshot folder.

    Raises:
        SystemExit: When a git command fails or a required file is absent at `ref`.

    Returns:
        The snapshot manifest dict.
    """
    sources, paths = {}, {}
    for tree in TREES:
        clone = os.path.abspath(clones[tree])
        sources[tree] = {"clone": clone, "commit": git_output(clone, "rev-parse", "--verify", f"{ref}^{{commit}}").decode().strip()}
        paths[tree] = [rel for rel in git_output(clone, "ls-tree", "-r", "--name-only", "-z", sources[tree]["commit"]).decode("utf-8").split("\0") if rel]
    wanted, absent = legacy_wanted(inventory, legacy_skins, paths["assets"], paths["art"])
    if absent:
        sys.exit(f"the old layout at {ref} lacks required files: {', '.join(absent)}")

    staging = f"{out_dir.rstrip(os.sep)}.partial"
    shutil.rmtree(staging, ignore_errors=True)
    files = []
    for tree, rel in wanted:
        data = git_output(sources[tree]["clone"], "cat-file", "blob", f"{sources[tree]['commit']}:{rel}")
        path = os.path.join(staging, tree, *rel.split("/"))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as handle:
            handle.write(data)
        files.append({"tree": tree, "path": rel, "bytes": len(data), "blob": git_blob_sha(data)})
    manifest = {"ref": ref, "sources": sources, "cardSample": {"count": CARD_SNAPSHOT_COUNT, "seed": CARD_CHECK_SEED}, "files": files}
    with open(os.path.join(staging, LEGACY_MANIFEST_NAME), "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=1)
        handle.write("\n")
    shutil.rmtree(out_dir, ignore_errors=True)
    os.replace(staging, out_dir)
    return manifest


def check_legacy_snapshot(legacy_dir):
    """Confirm a legacy snapshot is complete and unchanged since it was written.

    Args:
        legacy_dir: The snapshot folder.

    Returns:
        A `(manifest, problems)` pair: the snapshot manifest, or None when there is none, and a list of problem messages.
    """
    manifest_path = os.path.join(legacy_dir, LEGACY_MANIFEST_NAME)
    if not os.path.isfile(manifest_path):
        return None, [f"no legacy snapshot at {legacy_dir}. Run `snapshot-legacy --reference-clone <assets clone> --art-clone <art clone>` first"]
    manifest = read_json(manifest_path)
    problems = []
    for entry in manifest["files"]:
        path = os.path.join(legacy_dir, entry["tree"], *entry["path"].split("/"))
        if not os.path.isfile(path):
            problems.append(f"{entry['tree']}/{entry['path']} is missing")
            continue
        with open(path, "rb") as handle:
            if git_blob_sha(handle.read()) != entry["blob"]:
                problems.append(f"{entry['tree']}/{entry['path']} does not match blob {entry['blob']}")
    return manifest, problems


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Run


def tree_size(root):
    """Total the bytes and files under a directory.

    Args:
        root: The directory.

    Returns:
        A `(bytes, files)` pair, zeros when the directory does not exist.
    """
    total, files = 0, 0
    for folder, _dirs, names in os.walk(root):
        for name in names:
            total += os.path.getsize(os.path.join(folder, name))
            files += 1
    return total, files


def oversized_files(root, limit=MAX_FILE_BYTES):
    """List the files under a directory that are over the per-file limit.

    Args:
        root: The directory.
        limit: Largest allowed size in bytes.

    Returns:
        Sorted paths relative to `root`.
    """
    found = []
    for folder, _dirs, names in os.walk(root):
        for name in names:
            path = os.path.join(folder, name)
            if os.path.getsize(path) > limit:
                found.append(os.path.relpath(path, root).replace(os.sep, "/"))
    return sorted(found)


def reset_staging(staging):
    """Remove previous outputs of this extractor, leaving other staged folders such as `spine/` alone.

    Args:
        staging: The staging root.
    """
    for rel in ("assets/tdolls", "assets/equipment", "art/tdolls"):
        shutil.rmtree(os.path.join(staging, rel), ignore_errors=True)
    for tree in TREES:
        os.makedirs(os.path.join(staging, tree), exist_ok=True)


def copy_ui(assets_root, staging):
    """Copy the UI images at the root of the old asset repo into the asset tree unchanged.

    Args:
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        staging: The staging root.

    Returns:
        The copied filenames.
    """
    names = sorted(name for name in os.listdir(assets_root) if os.path.isfile(os.path.join(assets_root, name)) and name not in UI_SKIP and not name.startswith("."))
    for name in names:
        check_file_size("assets", name, os.path.getsize(os.path.join(assets_root, name)))
        shutil.copyfile(os.path.join(assets_root, name), os.path.join(staging, "assets", name))
    return names


def tier_counts(files):
    """Total the written files and bytes per report tier.

    Args:
        files: Worker `files` rows of `(tree, path, bytes, tier)`.

    Returns:
        An ordered dict of tier to `{tree, files, bytes}`, tiers sorted by name.
    """
    counts = collections.OrderedDict()
    for tree, _rel, size, tier in sorted(files, key=lambda row: (row[3], row[1])):
        entry = counts.setdefault(tier, {"tree": tree, "files": 0, "bytes": 0})
        entry["files"] += 1
        entry["bytes"] += size
    return counts


def run_extraction(inventory, legacy_dir, legacy_skins, site_dir, cache_dir, staging, workers):
    """Extract every image tier, the legacy skins and the legacy skill icons into the staging trees and write the report.

    Args:
        inventory: The inventory dict.
        legacy_dir: The legacy snapshot folder, holding the old UI images, cards and skill icons under `assets/` and full art under `art/`.
        legacy_skins: Legacy entries from `load_legacy_skins`.
        site_dir: Directory holding `equipment.json`.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        workers: Process pool size.

    Returns:
        The report dict.
    """
    started = time.monotonic()
    legacy_assets, legacy_art = os.path.join(legacy_dir, "assets"), os.path.join(legacy_dir, "art")
    reset_staging(staging)
    ui_files = copy_ui(legacy_assets, staging)
    rarities = load_rarities(site_dir)

    report = {"resVersion": inventory["resVersion"], "missing": [], "nonstandard": []}
    art_items, skill_items, equip_items, legacy_skill_items = [], [], [], []
    for item in inventory["items"]:
        wanted = item["tier"] in ART_TIERS or item["tier"] in ("skill_icon", "equip_icon")
        if not wanted:
            continue
        if item["tier"] == "skill_icon" and item.get("source") == "legacy":
            legacy_skill_items.append(item)
            continue
        if item["status"] != "resolved" and not item["assets"]:
            report["missing"].append({"key": item["key"], "role": "*", "reason": item.get("reason", "no bundle holds the files")})
            continue
        report["missing"].extend({"key": item["key"], "role": role, "reason": "not in any bundle"} for role in item["missing"])
        {"skill_icon": skill_items, "equip_icon": equip_items}.get(item["tier"], art_items).append(item)

    files, done = [], 0
    with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(extract_skill_icons, skill_items, cache_dir, staging): "worker:skill_icon"}
        futures[pool.submit(extract_equip_icons, equip_items, rarities, cache_dir, staging)] = "worker:equip_icon"
        futures.update({pool.submit(extract_art_item, item, cache_dir, staging): item["key"] for item in art_items})
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
            except Exception as exc:
                result = new_result()
                result["missing"].append({"key": futures[future], "role": "*", "reason": f"worker crashed: {exc!r}"})
            files.extend(result["files"])
            report["missing"].extend(result["missing"])
            report["nonstandard"].extend(result["nonstandard"])
            done += 1
            if done % 100 == 0 or done == len(futures):
                print(f"[{done}/{len(futures)}] {len(files)} files, {time.monotonic() - started:.0f}s", flush=True)

    legacy_results = [extract_legacy_skin(extra, legacy_assets, legacy_art, staging) for extra in legacy_skins]
    legacy_results.append(extract_legacy_skill_icons(legacy_skill_items, legacy_assets, staging))
    for result in legacy_results:
        files.extend(result["files"])
        report["missing"].extend(result["missing"])
        report["nonstandard"].extend(result["nonstandard"])
    print(f"legacy skins: {len(legacy_skins)}, legacy skill icons: {len(legacy_skill_items)}", flush=True)

    counts = tier_counts(files)
    counts["ui"] = {"tree": "assets", "files": len(ui_files), "bytes": sum(os.path.getsize(os.path.join(staging, "assets", name)) for name in ui_files)}
    report["tiers"] = counts
    report["missing"].sort(key=lambda row: (row["key"], row["role"]))
    report["nonstandard"].sort(key=lambda row: (row["key"], row["role"]))
    finish_report(report, expected_gap_keys(inventory), staging)
    report["seconds"] = round(time.monotonic() - started, 1)
    with open(os.path.join(staging, "extract-report.json"), "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=1, ensure_ascii=False)
    return report


def finish_report(report, expected_keys, staging):
    """Add the tree sizes, oversized files and unexpected gaps to a report.

    Args:
        report: The report dict, with `missing` filled in.
        expected_keys: Item keys of the accepted gaps.
        staging: The staging root.
    """
    report["unexpected_missing"] = unexpected_missing(report["missing"], expected_keys)
    report["trees"], report["oversized"] = {}, []
    for tree in TREES:
        root = os.path.join(staging, tree)
        size, count = tree_size(root)
        report["trees"][tree] = {"files": count, "bytes": size, "mb": round(size / BYTES_PER_MB, 1), "status": tree_limit_status(size)}
        report["oversized"].extend(f"{tree}/{rel}" for rel in oversized_files(root))


def failure_reasons(report):
    """Explain why a finished report should fail the run.

    Args:
        report: A report finished by `finish_report`.

    Returns:
        A list of reasons, empty when the run passed.
    """
    reasons = []
    over = [tree for tree, entry in report["trees"].items() if entry["status"] == "over"]
    if over:
        reasons.append(f"{', '.join(over)} over {LIMIT_BYTES // BYTES_PER_MB} MB")
    if report["oversized"]:
        reasons.append(f"files over {MAX_FILE_BYTES // BYTES_PER_MB} MB: {', '.join(report['oversized'])}")
    if report["unexpected_missing"]:
        reasons.append(f"{len(report['unexpected_missing'])} unexpected missing assets")
    return reasons


def run_spine(inventory, cache_dir, staging, workers):
    """Extract every Spine rig into `assets/spine/` and write the Spine report.

    Args:
        inventory: The inventory dict.
        cache_dir: The bundle cache directory.
        staging: The staging root.
        workers: Process pool size.

    Returns:
        The report dict.
    """
    started = time.monotonic()
    spine_root = os.path.join(staging, "assets", "spine")
    shutil.rmtree(spine_root, ignore_errors=True)
    os.makedirs(spine_root)

    report = {"resVersion": inventory["resVersion"], "missing": [], "nonstandard": []}
    items = []
    for item in inventory["items"]:
        if item["tier"] not in SPINE_TIERS:
            continue
        if not item["assets"]:
            report["missing"].append({"key": item["key"], "role": "*", "reason": item.get("reason", "no bundle holds the files")})
            continue
        report["missing"].extend({"key": item["key"], "role": role, "reason": "not in any bundle"} for role in item["missing"])
        items.append(item)

    files, rigs = [], []
    with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(extract_spine_item, item, cache_dir, staging): item["key"] for item in items}
        for done, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            try:
                result = future.result()
            except Exception as exc:
                result = {**new_result(), "rigs": [], "missing": [{"key": futures[future], "role": "*", "reason": f"worker crashed: {exc!r}"}]}
            files.extend(result["files"])
            rigs.extend(result["rigs"])
            report["missing"].extend(result["missing"])
            report["nonstandard"].extend(result["nonstandard"])
            if done % 200 == 0 or done == len(futures):
                print(f"[{done}/{len(futures)}] {len(files)} files, {time.monotonic() - started:.0f}s", flush=True)

    report["rigs"] = rig_counts(rigs)
    report["tiers"] = tier_counts(files)
    report["missing"].sort(key=lambda row: (row["key"], row["role"]))
    report["nonstandard"].sort(key=lambda row: (row["key"], row["role"]))
    finish_report(report, EXPECTED_MISSING_RIGS, staging)
    report["seconds"] = round(time.monotonic() - started, 1)
    with open(os.path.join(staging, "spine-report.json"), "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=1, ensure_ascii=False)
    return report


def print_report(report):
    """Print the extraction report summary.

    Args:
        report: The report dict from `run_extraction`.
    """
    print(f"{'TIER':<16}{'TREE':<8}{'FILES':>7}{'MB':>9}")
    for tier, entry in report["tiers"].items():
        print(f"{tier:<16}{entry['tree']:<8}{entry['files']:>7}{entry['bytes'] / BYTES_PER_MB:>9.1f}")
    if "rigs" in report:
        print("rigs: " + ", ".join(f"{name} {count}" for name, count in report["rigs"].items()))
    for tree, entry in report["trees"].items():
        print(f"tree {tree}: {entry['files']} files, {entry['mb']} MB ({entry['status']})")
    print(f"missing: {len(report['missing'])} ({len(report['unexpected_missing'])} unexpected), non-standard sizes: {len(report['nonstandard'])}, {report['seconds']}s")
    for row in report["missing"]:
        print(f"  missing {row['key']} {row['role']}: {row['reason']}")
    for row in report["nonstandard"]:
        print(f"  size {row['key']} {row['role']}: {row['size']} (expected {row['expected']})")


def check_cards(inventory, assets_root, cache_dir, allow_diffs=False):
    """Run the card check and stop the program when any card differs.

    Args:
        inventory: The inventory dict.
        assets_root: The old asset repo files, normally the `assets` folder of the legacy snapshot.
        cache_dir: The bundle cache directory.
        allow_diffs: Print differing cards but carry on. Only for runs where the differences were inspected and are art revisions.
    """
    rows = verify_hosted_cards(inventory, assets_root, cache_dir)
    if not rows:
        sys.exit("card check found no old cards to compare. Refresh the legacy snapshot, or pass --skip-card-check")
    for row in rows:
        print(f"card check {row['hosted']} <- {row['key']} {row['role']}: diff {row['diff_card']:.4f} / {row['diff_card_d']:.4f}")
    bad = [row for row in rows if row["diff_card"] or row["diff_card_d"]]
    if bad and not allow_diffs:
        sys.exit(f"card check failed on {len(bad)} of {len(rows)} hosted cards")
    if bad:
        print(f"card check: {len(bad)} of {len(rows)} hosted cards differ, continuing because --allow-card-diffs was passed")
        return
    print(f"card check passed: {len(rows)} hosted cards match their atlas halves exactly")


def run_with_legacy(args, inventory):
    """Run `run`, `verify-cards` or `proof-equip` against the legacy snapshot, or against a temporary one read from the clones when both are given.

    Args:
        args: Parsed command-line arguments.
        inventory: The inventory dict.

    Raises:
        SystemExit: When the inputs are incomplete or the command fails.
    """
    if args.reference_clone or args.art_clone:
        if not (args.reference_clone and args.art_clone):
            sys.exit("reading the old layout from clones needs both --reference-clone and --art-clone")
        with tempfile.TemporaryDirectory(prefix="legacy-snapshot-") as scratch:
            legacy_dir = os.path.join(scratch, "legacy")
            manifest = snapshot_legacy(inventory, load_legacy_skins(), {"assets": args.reference_clone, "art": args.art_clone}, args.legacy_ref, legacy_dir)
            print(f"read {len(manifest['files'])} old-layout files from {args.legacy_ref} of the clones into a temporary snapshot", flush=True)
            run_legacy_command(args, inventory, legacy_dir)
        return
    manifest, problems = check_legacy_snapshot(args.legacy)
    if problems:
        sys.exit("legacy snapshot problems:\n  " + "\n  ".join(problems))
    commits = ", ".join(f"{tree} {source['commit'][:7]}" for tree, source in manifest["sources"].items())
    print(f"legacy snapshot {args.legacy}: {len(manifest['files'])} files from {manifest['ref']} ({commits})", flush=True)
    run_legacy_command(args, inventory, args.legacy)


def run_legacy_command(args, inventory, legacy_dir):
    """Run `run`, `verify-cards` or `proof-equip` with a checked legacy snapshot.

    Args:
        args: Parsed command-line arguments.
        inventory: The inventory dict.
        legacy_dir: The snapshot folder.

    Raises:
        SystemExit: When a command fails.
    """
    legacy_assets = os.path.join(legacy_dir, "assets")
    if args.command == "proof-equip":
        if not args.out_dir:
            sys.exit("proof-equip needs --out-dir")
        for row in proof_equip(inventory, legacy_assets, args.site_data, args.cache, args.out_dir):
            print(f"equip {row['equip_id']} rarity {row['rarity']} ({row['hosted']}): mean abs diff {row['diff']:.2f} -> {row['proof']}")
        return

    if args.command == "verify-cards" or not args.skip_card_check:
        check_cards(inventory, legacy_assets, args.cache, args.allow_card_diffs)
    else:
        print("card check skipped because --skip-card-check was passed", flush=True)
    if args.command == "verify-cards":
        return

    print(f"extracting with {args.workers} workers into {args.staging}", flush=True)
    report = run_extraction(inventory, legacy_dir, load_legacy_skins(), args.site_data, args.cache, args.staging, args.workers)
    print_report(report)
    reasons = failure_reasons(report)
    if reasons:
        sys.exit(f"extraction failed: {'; '.join(reasons)}")


def main():
    """Parse arguments and run the requested subcommand."""
    parser = argparse.ArgumentParser(description="Extract card art, full art, icons and Spine rigs from the cached game bundles into the staging trees.")
    parser.add_argument("command", choices=("snapshot-legacy", "run", "spine", "verify-cards", "proof-equip"))
    parser.add_argument("--legacy", default=LEGACY_DIR, help="The legacy snapshot folder read by `run`, `verify-cards` and `proof-equip`.")
    parser.add_argument("--reference-clone", help="Old-layout gfl-wiki-assets clone. Needed by `snapshot-legacy`, otherwise read instead of the snapshot.")
    parser.add_argument("--art-clone", help="Old-layout gfl-wiki-assets-art clone. Needed by `snapshot-legacy`, otherwise read instead of the snapshot.")
    parser.add_argument("--legacy-ref", default=LEGACY_REF, help="Ref holding the old layout in the clones.")
    parser.add_argument("--skip-card-check", action="store_true", help="Skip the card check before `run` extracts.")
    parser.add_argument("--site-data", default=SITE_DATA_DIR, help="Directory holding the site's equipment.json.")
    parser.add_argument("--cache", default=BUNDLE_CACHE_DIR, help="Bundle cache directory.")
    parser.add_argument("--staging", default=STAGING_DIR, help="Output root holding the assets and art trees.")
    parser.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) - 1), help="Process pool size, defaults to cores - 1.")
    parser.add_argument("--out-dir", help="Output folder for proof-equip.")
    parser.add_argument("--allow-card-diffs", action="store_true", help="Report hosted cards that differ from the game atlas instead of stopping.")
    args = parser.parse_args()
    inventory = read_json(INVENTORY_PATH)

    if args.command == "spine":
        print(f"extracting Spine rigs with {args.workers} workers into {args.staging}", flush=True)
        report = run_spine(inventory, args.cache, args.staging, args.workers)
        print_report(report)
        reasons = failure_reasons(report)
        if reasons:
            sys.exit(f"Spine extraction failed: {'; '.join(reasons)}")
        return
    if args.command == "snapshot-legacy":
        if not (args.reference_clone and args.art_clone):
            sys.exit("snapshot-legacy needs --reference-clone and --art-clone")
        manifest = snapshot_legacy(inventory, load_legacy_skins(), {"assets": args.reference_clone, "art": args.art_clone}, args.legacy_ref, args.legacy)
        for tree, source in manifest["sources"].items():
            count = sum(1 for entry in manifest["files"] if entry["tree"] == tree)
            print(f"{tree}: {count} files from {source['clone']} at {args.legacy_ref} ({source['commit']})")
        print(f"wrote {args.legacy} ({sum(entry['bytes'] for entry in manifest['files']) / BYTES_PER_MB:.1f} MB)")
        return
    run_with_legacy(args, inventory)


if __name__ == "__main__":
    main()
