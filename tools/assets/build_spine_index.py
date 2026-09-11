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

    # The dorm rig is named after the combat rig with an `R` in front, so the pair identifies itself.
    # Guessing by "does it start with R" instead is wrong in both directions: RPD, RO635, R93, RPK16
    # and RFB are real doll codes, while Ribeyrolles and RexZero1 pair with RRibeyrolles and
    # RRexZero1. Where every skeleton began with R the old rule fell back to alphabetical order and
    # picked the dorm rig as the default, which is what showed the wrong animations.
    lookup = {s.lower(): s for s in skeletons}

    def dorm_of(skeleton):
        """Return the dorm counterpart of a skeleton, if one was published."""
        directory, _, stem = skeleton.rpartition("/")
        prefix = f"{directory}/" if directory else ""
        return lookup.get(f"{prefix}R{stem}".lower())

    paired = [s for s in skeletons if dorm_of(s)]
    if paired:
        combat = min(paired, key=len)
    else:
        # Nothing pairs up, so fall back to the shortest name that is not obviously a dorm rig.
        unpaired = [s for s in skeletons if s.rpartition("/")[2].lower() not in
                    {other.rpartition("/")[2].lower()[1:] for other in skeletons if len(other.rpartition("/")[2]) > 1}]
        combat = min(unpaired or skeletons, key=len)
    dorm = dorm_of(combat)

    entry = {}
    for label, skeleton in (("combat", combat), ("dorm", dorm)):
        if skeleton and atlas_for(skeleton):
            entry[label] = {"skel": skeleton, "atlas": atlas_for(skeleton)}

    # Skins carry their own combat and dorm rigs, the latter prefixed with R exactly like the base one.
    skins = {}
    for skeleton in skeletons:
        stem = skeleton.rpartition("/")[2]
        if skeleton in (combat, dorm) or stem.startswith("R") or "_" not in stem:
            continue
        atlas = atlas_for(skeleton)
        if not atlas:
            continue
        skin_id = stem.split("_", 1)[1]
        record = {"combat": {"skel": skeleton, "atlas": atlas}}
        skin_dorm = dorm_of(skeleton)
        if skin_dorm and atlas_for(skin_dorm):
            record["dorm"] = {"skel": skin_dorm, "atlas": atlas_for(skin_dorm)}
        skins[skin_id] = record
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
