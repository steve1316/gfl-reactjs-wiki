#!/usr/bin/env python3
"""Build `assets-manifest.json` by scanning the skin-id staging trees.

Cards, skill icons and equipment icons are read from the asset tree and full art from the art tree, and the version 3 manifest records
which of them exist. Every path the app builds is derived from the doll id, form and kind, so only presence is stored. The manifest is
written to the repo root by default, the copy the site bundles.

`build` still scans the retired `src/images` tree for `publish.py`, which Task 6 replaces. The command line only builds version 3.
"""

import argparse
import collections
import json
import os
import re
import sys


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Naming conventions

# Doll assets are `<id>_<form>_<kind>.<ext>`. The naming is asymmetric between the two asset types.
# Animations always spell the form out (`110_normal_attack.gif`), while portraits drop it for the base
# form (`110_card.png`, never `110_normal_card.png`). Matching `normal` here covers the first case, and
# the fallback in `split_form` covers the second.
FORM_RE = re.compile(r"^(?:normal|mod|skin\d+|mod_skin\d+)$")

# The four per-form portrait kinds, mapped to the property names the app uses.
IMAGE_KINDS = {
    "card": "card",
    "card_d": "card_damaged",
    "full": "full",
    "full_d": "full_damaged",
}

# Skill icons hang off the doll rather than a form. `skill1` is the base skill, `skill2` the mod skill.
SKILL_KINDS = ("skill1", "skill2")

# Dorm animations live in the same directory as combat ones and are told apart only by this prefix.
DORM_PREFIX = "dorm_"

SPINE_EXTENSIONS = (".skel", ".atlas", ".png")

# v3 image kinds, in manifest order, with the tree and filename each is read from.
V3_IMAGE_FILES = (("card", "assets", "card.webp"), ("card_damaged", "assets", "card_d.webp"), ("full", "art", "full.webp"), ("full_damaged", "art", "full_d.webp"))
V3_IMAGE_KINDS = [kind for kind, _tree, _name in V3_IMAGE_FILES]

# Folder prefix of skins whose art only the old asset repos hosted, keyed `legacy-<slug>` instead of a skin id.
LEGACY_SKIN_PREFIX = "legacy-"

# Mod-coloured cards of a skin, stored next to the skin's own cards.
V3_MOD_CARD_FILES = (("card", "mod_card.webp"), ("card_damaged", "mod_card_d.webp"))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Parsing helpers


def split_form(stem, doll_id):
    """Split a filename stem into its form and kind.

    Args:
        stem: Filename without extension, e.g. `95_mod_card_d` or `110_normal_attack`.
        doll_id: The doll id the file sits under, used to strip the leading id.

    Returns:
        A `(form, kind)` tuple, or `None` when the stem does not belong to this doll.
    """
    prefix = f"{doll_id}_"
    if not stem.startswith(prefix):
        return None
    rest = stem[len(prefix):]

    # Forms can be two tokens (`mod_skin1`) as well as one (`mod`, `skin1`, `normal`), so the longer
    # candidate is tried first. Splitting on the first underscore alone turns `mod_skin1_card` into the
    # kind `skin1_card`, which matches nothing and drops the file without a word.
    parts = rest.split("_")
    for length in (2, 1):
        if len(parts) > length:
            candidate = "_".join(parts[:length])
            if FORM_RE.match(candidate):
                return candidate, "_".join(parts[length:])
    return "normal", rest


def scan_doll(doll_dir, doll_id, base):
    """Collect every image, animation and Spine file belonging to one doll.

    Args:
        doll_dir: Absolute path to the doll's directory.
        doll_id: The doll's numeric id as a string.
        base: Path prefix to prepend to every emitted path, relative to the asset base URL.

    Returns:
        A dict describing the doll, with `forms`, `skillImages` and `spine` keys.
    """
    forms = collections.defaultdict(lambda: {"images": {}, "animations": {}, "dormAnimations": {}})
    skill_images = {}
    spine = {}

    for name in sorted(os.listdir(doll_dir)):
        path = os.path.join(doll_dir, name)
        stem, ext = os.path.splitext(name)

        if os.path.isdir(path) and name != "animations":
            # A Spine bundle: one directory per skeleton, holding `.skel`, `.atlas` and page PNGs.
            files = {}
            for spine_name in sorted(os.listdir(path)):
                spine_ext = os.path.splitext(spine_name)[1]
                if spine_ext in SPINE_EXTENSIONS:
                    files[spine_ext.lstrip(".")] = f"{base}/{name}/{spine_name}"
            if files:
                spine[name] = files
            continue

        if ext != ".png":
            continue

        if stem in (f"{doll_id}_{kind}" for kind in SKILL_KINDS):
            skill_images[stem.rsplit("_", 1)[1]] = f"{base}/{name}"
            continue

        parsed = split_form(stem, doll_id)
        if parsed is None:
            continue
        form, kind = parsed
        if kind in IMAGE_KINDS:
            forms[form]["images"][IMAGE_KINDS[kind]] = f"{base}/{name}"

    animations_dir = os.path.join(doll_dir, "animations")
    if os.path.isdir(animations_dir):
        for name in sorted(os.listdir(animations_dir)):
            stem, ext = os.path.splitext(name)
            if ext != ".gif":
                continue
            parsed = split_form(stem, doll_id)
            if parsed is None:
                continue
            form, kind = parsed
            bucket = "dormAnimations" if kind.startswith(DORM_PREFIX) else "animations"
            key = kind[len(DORM_PREFIX):] if bucket == "dormAnimations" else kind
            forms[form][bucket][key] = f"{base}/animations/{name}"

    return {
        "skillImages": skill_images,
        "forms": {form: data for form, data in sorted(forms.items())},
        "spine": spine,
    }


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Manifest assembly


def build(images_root):
    """Scan the asset tree and assemble the full manifest.

    Args:
        images_root: Path to the directory holding `tdolls/` and `equipment/`.

    Returns:
        The manifest as a plain dict, ready to serialise.
    """
    tdolls = {}
    tdolls_root = os.path.join(images_root, "tdolls")
    if os.path.isdir(tdolls_root):
        for doll_id in sorted(os.listdir(tdolls_root), key=lambda v: int(v) if v.isdigit() else -1):
            doll_dir = os.path.join(tdolls_root, doll_id)
            if doll_id.isdigit() and os.path.isdir(doll_dir):
                tdolls[doll_id] = scan_doll(doll_dir, doll_id, f"tdolls/{doll_id}")

    equipment = {}
    equipment_root = os.path.join(images_root, "equipment")
    if os.path.isdir(equipment_root):
        for category in sorted(os.listdir(equipment_root)):
            category_dir = os.path.join(equipment_root, category)
            if not os.path.isdir(category_dir):
                continue
            equipment[category] = {
                os.path.splitext(name)[0]: f"equipment/{category}/{name}"
                for name in sorted(os.listdir(category_dir))
                if name.endswith(".png")
            }

    ui = {
        os.path.splitext(name)[0]: name
        for name in sorted(os.listdir(images_root))
        if os.path.isfile(os.path.join(images_root, name))
    }

    animation_names = {key for doll in tdolls.values() for form in doll["forms"].values() for key in form["animations"]}
    return {
        "version": 1,
        "tdolls": tdolls,
        "equipment": equipment,
        "ui": ui,
        "counts": {
            "tdolls": len(tdolls),
            "forms": sum(len(doll["forms"]) for doll in tdolls.values()),
            "spineBundles": sum(len(doll["spine"]) for doll in tdolls.values()),
            "equipmentCategories": len(equipment),
            "equipmentImages": sum(len(items) for items in equipment.values()),
            "distinctAnimations": len(animation_names),
        },
    }


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Skin-id layout (v3)


def numeric_dirs(folder):
    """List the numerically named subfolders of a folder in numeric order.

    Args:
        folder: The folder, which may not exist.

    Returns:
        The subfolder names.
    """
    if not os.path.isdir(folder):
        return []
    return sorted((name for name in os.listdir(folder) if name.isdigit() and os.path.isdir(os.path.join(folder, name))), key=int)


def skin_dirs(*folders):
    """List the skin folders across one or more `skins/` folders: numeric skin ids in numeric order, then `legacy-<slug>` keys by name.

    Args:
        *folders: `skins/` folders, which may not exist.

    Returns:
        The distinct skin folder names.
    """
    names = set()
    for folder in folders:
        if os.path.isdir(folder):
            names.update(name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name)))
    numeric = sorted((name for name in names if name.isdigit()), key=int)
    return numeric + sorted(name for name in names if name.startswith(LEGACY_SKIN_PREFIX))


def form_images(roots, rel):
    """List the image kinds present for one form folder.

    Args:
        roots: Map of `assets` and `art` to their tree roots.
        rel: The form folder inside both trees, e.g. `tdolls/65/skins/805`.

    Returns:
        Image kinds in `V3_IMAGE_KINDS` order.
    """
    return [kind for kind, tree, name in V3_IMAGE_FILES if os.path.isfile(os.path.join(roots[tree], rel, name))]


def build_v3(assets_root, art_root):
    """Scan both staging trees and assemble the version 3 manifest.

    Args:
        assets_root: The asset tree, holding `tdolls/` cards and skill icons and `equipment/<id>.png`.
        art_root: The art tree, holding `tdolls/` full art.

    Returns:
        The manifest dict, dolls in numeric order and skins in `skin_dirs` order.
    """
    roots = {"assets": assets_root, "art": art_root}
    doll_ids = sorted(set(numeric_dirs(os.path.join(assets_root, "tdolls"))) | set(numeric_dirs(os.path.join(art_root, "tdolls"))), key=int)
    dolls = {}
    for doll_id in doll_ids:
        base = f"tdolls/{doll_id}"
        record = {"normal": {"images": form_images(roots, base)}}
        if any(os.path.isdir(os.path.join(root, base, "mod")) for root in roots.values()):
            record["mod"] = {"images": form_images(roots, f"{base}/mod")}
        skin_ids = skin_dirs(os.path.join(assets_root, base, "skins"), os.path.join(art_root, base, "skins"))
        skins = {}
        for skin_id in skin_ids:
            rel = f"{base}/skins/{skin_id}"
            skin = {"images": form_images(roots, rel)}
            mod_images = [kind for kind, name in V3_MOD_CARD_FILES if os.path.isfile(os.path.join(assets_root, rel, name))]
            if mod_images:
                skin["modImages"] = mod_images
            skins[skin_id] = skin
        if skins:
            record["skins"] = skins
        record["skills"] = [skill for skill in SKILL_KINDS if os.path.isfile(os.path.join(assets_root, base, f"{skill}.png"))]
        dolls[doll_id] = record

    equipment_dir = os.path.join(assets_root, "equipment")
    names = os.listdir(equipment_dir) if os.path.isdir(equipment_dir) else []
    equipment = sorted(int(name[:-4]) for name in names if name.endswith(".png") and name[:-4].isdigit())
    return {"version": 3, "imageKinds": list(V3_IMAGE_KINDS), "equipment": equipment, "dolls": dolls}


def main():
    """Parse arguments, build the version 3 manifest and write it to disk."""
    parser = argparse.ArgumentParser(description="Generate the version 3 assets-manifest.json from the staging trees.")
    parser.add_argument("--assets", default="tools/assets/.staging/assets", help="The asset staging tree.")
    parser.add_argument("--art", default="tools/assets/.staging/art", help="The art staging tree.")
    parser.add_argument("--out", default="assets-manifest.json", help="Where to write the manifest. Defaults to the repo root copy the site bundles.")
    parser.add_argument("--indent", type=int, default=None, help="JSON indent. Omit for the compact form used in production.")
    parser.add_argument("--v3", action="store_true", help="Ignored. Version 3 is the only format.")
    args = parser.parse_args()

    if not (os.path.isdir(args.assets) and os.path.isdir(args.art)):
        sys.exit(f"the staging trees {args.assets} and {args.art} must both exist. Run tools/assets/extract_game_assets.py first")

    manifest = build_v3(args.assets, args.art)
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=args.indent)
        handle.write("\n")
    dolls = manifest["dolls"].values()
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB, version 3)")
    print(f"  dolls        {len(manifest['dolls'])}")
    print(f"  mods         {sum(1 for doll in dolls if 'mod' in doll)}")
    print(f"  skins        {sum(len(doll.get('skins', {})) for doll in dolls)}")
    print(f"  equipment    {len(manifest['equipment'])}")


if __name__ == "__main__":
    main()
