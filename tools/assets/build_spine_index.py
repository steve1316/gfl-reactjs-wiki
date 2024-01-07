#!/usr/bin/env python3
"""Index the published Spine tree so the app knows what it can render.

Each doll directory holds one or more skeletons. Naming follows the game's own convention:

    FG42.skel        combat rig
    RFG42.skel       dorm rig, an `R` prefix on the same code
    M1873_2105.skel  a skin, the code plus the skin's id

Atlases are not one per skeleton. The dorm rig usually shares the combat atlas, and some skins do
too, so each skeleton is paired with the closest atlas that actually exists rather than an assumed
one. Getting that wrong shows up as an invisible doll, since the regions fail to resolve.
"""

import argparse
import json
import os
import sys


def index_doll(doll_dir):
    """Describe one doll's skeletons.

    Args:
        doll_dir: Directory holding that doll's Spine files.

    Returns:
        A dict with `combat`, `dorm` and `skins` entries, each naming a skeleton and its atlas.
    """
    # Some dolls keep their Spine files in a subdirectory rather than flat, so one level is walked.
    names = []
    for entry in sorted(os.listdir(doll_dir)):
        full = os.path.join(doll_dir, entry)
        if os.path.isdir(full):
            names.extend(f"{entry}/{child}" for child in sorted(os.listdir(full)))
        else:
            names.append(entry)

    skeletons = sorted(name[:-5] for name in names if name.endswith(".skel"))
    # Keyed by lowercase because at least one doll pairs `kord.skel` with `Kord.atlas`.
    atlases = {name[:-6].lower(): name[:-6] for name in names if name.endswith(".atlas")}
    if not skeletons:
        return None

    def atlas_for(skeleton):
        """Pick the atlas a skeleton should use, falling back to the rig it was derived from."""
        directory, _, stem = skeleton.rpartition("/")
        prefix = f"{directory}/" if directory else ""

        def lookup(candidate):
            return atlases.get(f"{prefix}{candidate}".lower())

        found = lookup(stem)
        if found:
            return found
        # Dorm rigs drop the leading R to share the combat atlas.
        if stem.startswith("R") and lookup(stem[1:]):
            return lookup(stem[1:])
        # Skins fall back to their base code.
        base = stem.split("_")[0]
        if lookup(base):
            return lookup(base)
        if base.startswith("R") and lookup(base[1:]):
            return lookup(base[1:])
        return None

    # The shortest non-R skeleton is the base combat rig; everything else hangs off it.
    plain = [s for s in skeletons if not s.rpartition("/")[2].startswith("R")]
    combat = min(plain, key=len) if plain else skeletons[0]
    combat_dir, _, combat_stem = combat.rpartition("/")
    combat_prefix = f"{combat_dir}/" if combat_dir else ""
    dorm = next((s for s in skeletons if s.lower() == f"{combat_prefix}R{combat_stem}".lower()), None)

    entry = {}
    for label, skeleton in (("combat", combat), ("dorm", dorm)):
        if skeleton and atlas_for(skeleton):
            entry[label] = {"skel": skeleton, "atlas": atlas_for(skeleton)}

    skins = {}
    for skeleton in skeletons:
        stem = skeleton.rpartition("/")[2]
        if skeleton in (combat, dorm) or stem.startswith("R") or "_" not in stem:
            continue
        atlas = atlas_for(skeleton)
        if atlas:
            skins[stem.split("_", 1)[1]] = {"skel": skeleton, "atlas": atlas}
    if skins:
        entry["skins"] = skins

    return entry or None


def main():
    """Scan the Spine tree and write the index."""
    parser = argparse.ArgumentParser(description="Index published Spine data by doll id.")
    parser.add_argument("--spine", required=True, help="Directory holding spine/<id>/ subdirectories.")
    parser.add_argument("--out", required=True, help="Where to write spine-index.json.")
    args = parser.parse_args()

    if not os.path.isdir(args.spine):
        sys.exit(f"no such directory: {args.spine}")

    index = {}
    for doll_id in sorted(os.listdir(args.spine), key=lambda v: int(v) if v.isdigit() else -1):
        doll_dir = os.path.join(args.spine, doll_id)
        if not doll_id.isdigit() or not os.path.isdir(doll_dir):
            continue
        entry = index_doll(doll_dir)
        if entry:
            index[doll_id] = entry

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(index, handle, sort_keys=True)
        handle.write("\n")

    with_dorm = sum(1 for entry in index.values() if "dorm" in entry)
    with_skins = sum(1 for entry in index.values() if "skins" in entry)
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB)")
    print(f"  dolls        {len(index)}")
    print(f"  with dorm    {with_dorm}")
    print(f"  with skins   {with_skins}")


if __name__ == "__main__":
    main()
