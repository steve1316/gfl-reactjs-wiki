#!/usr/bin/env python3
"""Build `assets-manifest.json` by scanning the game asset tree.

The app currently decides which images and animations exist using hardcoded conditionals in
`src/data/processData.js` - flags like `hasSkillAnimation`, plus branches keyed on specific doll ids.
That logic is incomplete. It never accounts for `spattack`, `landing`, `crouch` or `dorm_action`,
which do exist on disk. This script replaces those conditionals with generated data by reporting
exactly what the filesystem holds, so the app can stop guessing.

Every path in the manifest is relative to the asset base URL, never to this repo, so the same
manifest works whether assets are served from a Pages site, a CDN, or a local directory.
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
FORM_RE = re.compile(r"^(?:normal|mod|skin\d+)$")

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

    head, _, tail = rest.partition("_")
    if FORM_RE.match(head) and tail:
        return head, tail
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


def main():
    """Parse arguments, build the manifest and write it to disk."""
    parser = argparse.ArgumentParser(description="Generate assets-manifest.json from the image tree.")
    parser.add_argument("--images", default="src/images", help="Directory holding tdolls/ and equipment/.")
    parser.add_argument("--out", default="assets-manifest.json", help="Where to write the manifest.")
    parser.add_argument("--indent", type=int, default=None, help="JSON indent. Omit for the compact form used in production.")
    args = parser.parse_args()

    if not os.path.isdir(args.images):
        sys.exit(f"no such directory: {args.images}")

    manifest = build(args.images)
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=args.indent, sort_keys=True)
        handle.write("\n")

    counts = manifest["counts"]
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB)")
    for key, value in counts.items():
        print(f"  {key:<22} {value}")


if __name__ == "__main__":
    main()
