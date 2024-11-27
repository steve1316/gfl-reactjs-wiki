#!/usr/bin/env python3
"""Index the skin-id Spine tree so the app knows what it can render.

`spine/<id>/` holds the base combat and dorm rigs, `mod/` the Mod rigs and `skins/<skinId>/` each skin's rigs, where a skin folder may also
be a `legacy-<slug>` key. The dorm rig is the `R`-prefixed twin of the combat rig and usually shares the combat atlas. Every rig path in
the index is relative to `spine/<id>/`, and `anims` is left empty for `add_spine_animations.mjs` to fill in.

The index is written to `src/data/spine-index.json` by default, the one the site bundles. The version 2 slot-map format is gone.
"""

import argparse
import json
import os
import sys

from build_manifest import skin_dirs


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Skin-id layout (v3)


def index_rig_dir(folder, prefix):
    """Describe the one combat rig, and its dorm twin, in a v3 rig folder.

    The dorm rig is the `R`-prefixed twin of the combat rig. A rig with no atlas of its own uses the combat atlas, which is how the game
    ships most dorm rigs. Names match case-insensitively, as `kord.skel` pairs with `Kord.atlas`.

    Args:
        folder: A folder holding one rig's files, e.g. `spine/65/skins/805`.
        prefix: Path from `spine/<id>/` to the folder, empty or ending in a slash.

    Returns:
        A dict with `combat` and optionally `dorm`, each `{skel, atlas, anims}`, or None when the folder holds no usable rig.
    """
    names = sorted(name for name in os.listdir(folder) if os.path.isfile(os.path.join(folder, name)))
    skeletons = {name[:-5].lower(): name[:-5] for name in names if name.endswith(".skel")}
    atlases = {name[:-6].lower(): name[:-6] for name in names if name.endswith(".atlas")}
    combats = [stem for lowered, stem in skeletons.items() if not (lowered[:1] == "r" and lowered[1:] in skeletons)]
    if not combats:
        return None
    combat = min(combats, key=lambda stem: (len(stem), stem))
    combat_atlas = atlases.get(combat.lower())
    if not combat_atlas:
        return None

    def rig(skel, atlas):
        """Build one rig entry with the folder prefix applied."""
        return {"skel": f"{prefix}{skel}", "atlas": f"{prefix}{atlas}", "anims": []}

    pair = {"combat": rig(combat, combat_atlas)}
    dorm = skeletons.get(f"r{combat.lower()}")
    if dorm:
        pair["dorm"] = rig(dorm, atlases.get(dorm.lower(), combat_atlas))
    return pair


def build_v3(spine_root):
    """Index a v3 Spine tree by doll id, with Mod rigs and skin rigs keyed by skin id.

    Args:
        spine_root: Directory holding `<id>/`, `<id>/mod/` and `<id>/skins/<skinId>/`, where a skin folder may also be a `legacy-<slug>` key.

    Returns:
        The index dict, dolls in numeric order and skins in `build_manifest.skin_dirs` order.
    """
    index = {}
    for doll_id in sorted((name for name in os.listdir(spine_root) if name.isdigit()), key=int):
        doll_dir = os.path.join(spine_root, doll_id)
        if not os.path.isdir(doll_dir):
            continue
        entry = index_rig_dir(doll_dir, "") or {}
        mod_dir = os.path.join(doll_dir, "mod")
        mod = index_rig_dir(mod_dir, "mod/") if os.path.isdir(mod_dir) else None
        if mod:
            entry["mod"] = mod
        skins_dir = os.path.join(doll_dir, "skins")
        skins = {}
        if os.path.isdir(skins_dir):
            for skin_id in skin_dirs(skins_dir):
                pair = index_rig_dir(os.path.join(skins_dir, skin_id), f"skins/{skin_id}/")
                if pair:
                    skins[skin_id] = pair
        if skins:
            entry["skins"] = skins
        if entry:
            index[doll_id] = entry
    return index


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# HOC layout

# A HOC's rigs live flat in `<id>/`, with no dorm, Mod or skin nesting the way a doll's do.


def build_hoc_index(hoc_spine_root):
    """Index a HOC Spine tree by HOC id: one combat rig plus any crew rigs.

    The combat rig is, among the skeletons that have a same-stem atlas (case-insensitive), the one with the shortest stem, ties broken by
    name. Every other skeleton is a crew rig, in case-insensitive name order, using its own same-stem atlas when it has one and the combat
    atlas otherwise, since some crew skeletons ship with no atlas of their own.

    Args:
        hoc_spine_root: Directory holding `<id>/` subdirectories, or absent.

    Returns:
        The index dict, `{"<id>": {"combat": rig, "crew": [rig, ...]}}` in numeric id order. A folder with no combat rig is skipped, and
        `{}` is returned when `hoc_spine_root` does not exist.
    """
    if not os.path.isdir(hoc_spine_root):
        return {}
    index = {}
    for hoc_id in sorted((name for name in os.listdir(hoc_spine_root) if name.isdigit()), key=int):
        folder = os.path.join(hoc_spine_root, hoc_id)
        if not os.path.isdir(folder):
            continue
        names = sorted(name for name in os.listdir(folder) if os.path.isfile(os.path.join(folder, name)))
        skeletons = {name[:-5].lower(): name[:-5] for name in names if name.endswith(".skel")}
        atlases = {name[:-6].lower(): name[:-6] for name in names if name.endswith(".atlas")}
        combats = [stem for lowered, stem in skeletons.items() if lowered in atlases]
        if not combats:
            continue
        combat = min(combats, key=lambda stem: (len(stem), stem))
        combat_atlas = atlases[combat.lower()]

        def rig(stem):
            """Build one rig entry, using the stem's own atlas or the combat atlas."""
            return {"skel": stem, "atlas": atlases.get(stem.lower(), combat_atlas), "anims": []}

        crew = sorted((stem for lowered, stem in skeletons.items() if stem != combat), key=str.lower)
        index[hoc_id] = {"combat": rig(combat), "crew": [rig(stem) for stem in crew]}
    return index


def main():
    """Scan the Spine tree and write the index, and the HOC Spine tree and its index when `--hoc-spine` is passed."""
    parser = argparse.ArgumentParser(description="Index the skin-id Spine tree by doll id, and optionally the HOC Spine tree by HOC id.")
    parser.add_argument("--spine", required=True, help="Directory holding spine/<id>/ subdirectories.")
    parser.add_argument("--out", default="src/data/spine-index.json", help="Where to write the index. Defaults to the one the site bundles.")
    parser.add_argument("--hoc-spine", help="Directory holding hoc-spine/<id>/ subdirectories. Omit to skip the HOC index.")
    parser.add_argument("--hoc-out", default="src/data/hoc-spine-index.json", help="Where to write the HOC index. Defaults to the one the site bundles.")
    parser.add_argument("--v3", action="store_true", help="Ignored. The skin-id layout is the only format.")
    args = parser.parse_args()

    if not os.path.isdir(args.spine):
        sys.exit(f"no such directory: {args.spine}")

    index = build_v3(args.spine)
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(index, handle)
        handle.write("\n")
    entries = index.values()
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB)")
    print(f"  dolls        {len(index)}")
    print(f"  with dorm    {sum(1 for entry in entries if 'dorm' in entry)}")
    print(f"  mod rigs     {sum(1 for entry in entries if 'mod' in entry)}")
    print(f"  skin rigs    {sum(len(entry.get('skins', {})) for entry in entries)}")

    if args.hoc_spine:
        hoc_index = build_hoc_index(args.hoc_spine)
        with open(args.hoc_out, "w", encoding="utf-8") as handle:
            json.dump(hoc_index, handle)
            handle.write("\n")
        print(f"wrote {args.hoc_out} ({os.path.getsize(args.hoc_out) / 1024:.0f} KB)")
        print(f"  hocs         {len(hoc_index)}")
        print(f"  crew rigs    {sum(len(entry.get('crew', [])) for entry in hoc_index.values())}")


if __name__ == "__main__":
    main()
