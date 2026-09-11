#!/usr/bin/env python3
"""Index the published Spine tree so the app knows what it can render.

Each doll directory holds one or more skeletons. Naming follows the game's own convention:

    FG42.skel        combat rig
    RFG42.skel       dorm rig, an `R` prefix on the same code
    M1873_2105.skel  a skin, the code plus the skin's id
    G3Mod.skel       the Mod rig, `Mod` appended to the code, with its own RG3Mod dorm counterpart

Atlases are not one per skeleton. The dorm rig usually shares the combat atlas, and some skins do
too, so each skeleton is paired with the closest atlas that actually exists rather than an assumed
one. Getting that wrong shows up as an invisible doll, since the regions fail to resolve.
"""

import argparse
import json
import os
import re
import sys


def split_skeleton(skeleton):
    """Split a skeleton name into the subdirectory prefix it sits under and its bare stem.

    Args:
        skeleton: A skeleton name, optionally prefixed with `<subdirectory>/`.

    Returns:
        A tuple of the prefix (empty when the file is flat, otherwise ending in a slash) and the stem.
    """
    directory, _, stem = skeleton.rpartition("/")
    return (f"{directory}/" if directory else "", stem)


def index_doll(doll_dir):
    """Describe one doll's skeletons.

    Args:
        doll_dir: Directory holding that doll's Spine files.

    Returns:
        A dict with `combat`, `dorm`, `mod` and `skins` entries, each naming a skeleton and its atlas.
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
        prefix, stem = split_skeleton(skeleton)
        base = stem.split("_")[0]

        # Names are tried in this order: the skeleton's own, then the combat rig a dorm rig drops its
        # leading R to share, then the base code a skin was derived from, then that base code's own
        # combat rig. The R tests ignore case, since the subdirectory copies of these files are
        # lowercased throughout and a case-sensitive test left every one of their dorm rigs without an atlas.
        candidates = [stem]
        if stem[:1] in ("R", "r"):
            candidates.append(stem[1:])
        candidates.append(base)
        if base[:1] in ("R", "r"):
            candidates.append(base[1:])

        for candidate in candidates:
            found = atlases.get(f"{prefix}{candidate}".lower())
            if found:
                return found
        return None

    # The dorm rig is named after the combat rig with an `R` in front, so the pair identifies itself.
    # Guessing by "does it start with R" instead is wrong in both directions: RPD, RO635, R93, RPK16
    # and RFB are real doll codes, while Ribeyrolles and RexZero1 pair with RRibeyrolles and
    # RRexZero1. Where every skeleton began with R the old rule fell back to alphabetical order and
    # picked the dorm rig as the default, which is what showed the wrong animations.
    skeleton_by_name = {s.lower(): s for s in skeletons}

    def dorm_of(skeleton):
        """Return the dorm counterpart of a skeleton, if one was published."""
        prefix, stem = split_skeleton(skeleton)
        return skeleton_by_name.get(f"{prefix}R{stem}".lower())

    def is_dorm(skeleton):
        """True when this skeleton is the R-prefixed counterpart of another one here."""
        prefix, stem = split_skeleton(skeleton)
        return stem[:1] in ("R", "r") and f"{prefix}{stem[1:]}".lower() in skeleton_by_name

    def is_skin(skeleton):
        """True when the name carries a trailing skin id, as in `HK21_2701`."""
        return re.search(r"_\d+$", split_skeleton(skeleton)[1]) is not None

    # Prefer a rig that is neither a dorm counterpart nor a skin. Ranking by paired-ness first put
    # `HK21_2701` ahead of `HK21`, which has no dorm rig of its own, and ranking by full path length
    # put `Type62_2908` ahead of `type62/type62` because the subdirectory made the real one longer.
    not_dorm = [s for s in skeletons if not is_dorm(s)]
    base = [s for s in not_dorm if not is_skin(s)]
    ranked = base or not_dorm or skeletons
    combat = min(ranked, key=lambda s: (len(split_skeleton(s)[1]), s))
    dorm = dorm_of(combat)

    def rig_pair(skeleton):
        """Describe a combat skeleton and its dorm counterpart, skipping either if it has no atlas."""
        pair = {}
        atlas = atlas_for(skeleton) if skeleton else None
        if atlas:
            pair["combat"] = {"skel": skeleton, "atlas": atlas}
        counterpart = dorm_of(skeleton) if skeleton else None
        dorm_atlas = atlas_for(counterpart) if counterpart else None
        if dorm_atlas:
            pair["dorm"] = {"skel": counterpart, "atlas": dorm_atlas}
        return pair

    entry = rig_pair(combat)

    # A Mod doll is a different chibi with its own animations, so it needs its own rig. It is filed
    # next to the combat rig with `Mod` appended, and carries an R-prefixed dorm counterpart like any
    # other rig. Mod skins do not exist: a Mod doll wearing a skin shows the skin's own chibi.
    prefix, stem = split_skeleton(combat)
    mod = skeleton_by_name.get(f"{prefix}{stem}Mod".lower())
    mod_pair = rig_pair(mod) if mod else {}
    if mod_pair:
        entry["mod"] = mod_pair

    # Skins carry their own combat and dorm rigs, the latter prefixed with R exactly like the base one.
    # Dorm rigs are recognised by `is_dorm` rather than by a leading R, for the same reason the base
    # rig is: `RO635_4501` is a skin of a doll whose code starts with R, not a dorm rig, and the
    # lowercased subdirectory copies would slip past a case-sensitive test and register as skins.
    skins = {}
    for skeleton in skeletons:
        stem = split_skeleton(skeleton)[1]
        if skeleton in (combat, dorm) or is_dorm(skeleton) or "_" not in stem:
            continue
        atlas = atlas_for(skeleton)
        if not atlas:
            continue
        skin_id = stem.split("_", 1)[1]
        record = {"combat": {"skel": skeleton, "atlas": atlas}}
        skin_dorm = dorm_of(skeleton)
        dorm_atlas = atlas_for(skin_dorm) if skin_dorm else None
        if dorm_atlas:
            record["dorm"] = {"skel": skin_dorm, "atlas": dorm_atlas}
        # Twenty dolls carry the same skin twice, once flat and once in a lowercased subdirectory,
        # because the CDN download landed alongside an earlier import. They are the same rig, so the
        # more complete copy is kept rather than whichever happened to be read last.
        if len(record) >= len(skins.get(skin_id, {})):
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
    with_mod = sum(1 for entry in index.values() if "mod" in entry)
    with_skins = sum(1 for entry in index.values() if "skins" in entry)
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.0f} KB)")
    print(f"  dolls        {len(index)}")
    print(f"  with dorm    {with_dorm}")
    print(f"  with mod     {with_mod}")
    print(f"  with skins   {with_skins}")


if __name__ == "__main__":
    main()
