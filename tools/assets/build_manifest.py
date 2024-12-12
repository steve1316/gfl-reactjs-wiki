#!/usr/bin/env python3
"""Build `assets-manifest.json` by scanning the skin-id staging trees.

Cards, skill icons and equipment icons are read from the asset tree and full art from the art tree, and the version 3 manifest records
which of them exist. Every path the app builds is derived from the doll id, form and kind, so only presence is stored. The manifest is
written to the repo root by default, the copy the site bundles.
"""

import argparse
import json
import os
import sys


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Naming conventions

# Skill icons hang off the doll rather than a form. `skill1` is the base skill, `skill2` the mod skill.
SKILL_KINDS = ("skill1", "skill2")

# v3 image kinds, in manifest order, with the tree and filename each is read from.
V3_IMAGE_FILES = (("card", "assets", "card.webp"), ("card_damaged", "assets", "card_d.webp"), ("full", "art", "full.webp"), ("full_damaged", "art", "full_d.webp"))
V3_IMAGE_KINDS = [kind for kind, _tree, _name in V3_IMAGE_FILES]

# Folder prefix of skins whose art only the old asset repos hosted, keyed `legacy-<slug>` instead of a skin id.
LEGACY_SKIN_PREFIX = "legacy-"

# Mod-coloured cards of a skin, stored next to the skin's own cards.
V3_MOD_CARD_FILES = (("card", "mod_card.webp"), ("card_damaged", "mod_card_d.webp"))

# HOC image kinds, in manifest order, with the tree and filename each is read from. A HOC has no forms or skins, just a card and full art.
V3_HOC_IMAGE_FILES = (("card", "assets", "card.webp"), ("full", "art", "full.webp"))

# Fairy image kinds, in manifest order, with the tree and filename each is read from. A fairy has three forms and no card or full art, and
# lives only in the asset tree.
V3_FAIRY_IMAGE_FILES = (("form1", "assets", "form1.webp"), ("form2", "assets", "form2.webp"), ("form3", "assets", "form3.webp"))


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
        assets_root: The asset tree, holding `tdolls/` cards and skill icons, `equipment/<id>.png` and `hocs/<id>/card.webp`.
        art_root: The art tree, holding `tdolls/` full art and `hocs/<id>/full.webp`.

    Returns:
        The manifest dict, dolls in numeric order, skins in `skin_dirs` order, and `hocs` and `fairies` (always present, `{}` when none)
        keyed by id in numeric order with each value the image kinds that exist for it.
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

    hoc_ids = sorted(set(numeric_dirs(os.path.join(assets_root, "hocs"))) | set(numeric_dirs(os.path.join(art_root, "hocs"))), key=int)
    hocs = {hoc_id: [kind for kind, tree, name in V3_HOC_IMAGE_FILES if os.path.isfile(os.path.join(roots[tree], "hocs", hoc_id, name))] for hoc_id in hoc_ids}

    fairy_ids = sorted(numeric_dirs(os.path.join(assets_root, "fairies")), key=int)
    fairies = {
        fairy_id: [kind for kind, tree, name in V3_FAIRY_IMAGE_FILES if os.path.isfile(os.path.join(roots[tree], "fairies", fairy_id, name))]
        for fairy_id in fairy_ids
    }

    return {"version": 3, "imageKinds": list(V3_IMAGE_KINDS), "equipment": equipment, "dolls": dolls, "hocs": hocs, "fairies": fairies}


def dumps(manifest, indent=None):
    """Serialise a manifest exactly as it is written to disk.

    Args:
        manifest: The manifest dict from `build_v3`.
        indent: JSON indent, or None for the compact production form.

    Returns:
        The file contents, ending in a newline.
    """
    return json.dumps(manifest, indent=indent) + "\n"


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
        handle.write(dumps(manifest, args.indent))
    dolls = manifest["dolls"].values()
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB, version 3)")
    print(f"  dolls        {len(manifest['dolls'])}")
    print(f"  mods         {sum(1 for doll in dolls if 'mod' in doll)}")
    print(f"  skins        {sum(len(doll.get('skins', {})) for doll in dolls)}")
    print(f"  equipment    {len(manifest['equipment'])}")
    print(f"  hocs         {len(manifest['hocs'])}")
    print(f"  fairies      {len(manifest['fairies'])}")


if __name__ == "__main__":
    main()
