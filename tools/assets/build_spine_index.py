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


def main():
    """Scan the Spine tree and write the index."""
    parser = argparse.ArgumentParser(description="Index the skin-id Spine tree by doll id.")
    parser.add_argument("--spine", required=True, help="Directory holding spine/<id>/ subdirectories.")
    parser.add_argument("--out", default="src/data/spine-index.json", help="Where to write the index. Defaults to the one the site bundles.")
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


if __name__ == "__main__":
    main()
