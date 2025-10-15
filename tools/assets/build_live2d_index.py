#!/usr/bin/env python3
"""Index the Live2D motion tree so the site knows what a fairy or HOC model can play.

`live2d/fairies/<id>/motions/` and `live2d/hocs/<id>/motions/` hold one `<name>.motion3.json` per named animation clip - the texture and
per-form moc/model3 files carry no motion metadata of their own. `fairy_live2d_motions_info.json`, one row per clip name, is the only
source for which of those clips is the idle loop, a random wait, or a touch reaction, and for a touch reaction, which body area it is.

That table is not scoped per fairy - the same clip stem (`wait_01`, `motou_01`, ...) is reused by every fairy's own Live2D bundle, and a
handful of fairies swap which stem means which behaviour. `motion_groups` flattens the table into one stem-keyed lookup, keeping the
first row seen for a stem, since the earliest rows in the table use the intuitive naming (`wait_*` clips wait, `motou_*` clips touch) that
most fairies follow. A real motion file whose stem is not a literal key, such as an extra clip a specific fairy ships that no row
describes, falls back to a prefix match and then to a name-based default.

Each motion also carries a `model3Group` field, the literal group name the file actually lives under in the model's own `model3.json`,
computed by `extract_live2d.motion_group_name` rather than re-derived from the table. The table-driven `group` field above is a
different, semantic classification (idle/wait/touch) used only for labelling and touch-area lookup - it can disagree with the file's
real model3 group for an oddly named or misclassified clip, so the site must call `playMotion` with `model3Group`, never `group`.

The index is written to `src/data/live2d-index.json` by default, the one the site bundles.
"""

import argparse
import json
import os
import sys

from build_manifest import numeric_dirs
from extract_live2d import motion_group_name

# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Motion table constants

# fairy_live2d_motions_info.json's `type` column, string-keyed since the cached table reads every field as a string.
MOTION_TYPE_GROUPS = {"1": "idle", "2": "wait", "3": "touch"}

# fairy_live2d_motions_info.json's `touch_area` column for a touch row. A non-touch row's `touch_area` is the string "0", which is not a
# key here, so it correctly maps to no touch area.
TOUCH_AREAS = {"head": "head", "body": "body"}

DEFAULT_MOTIONS_PATH = "tools/data/.cache/gf-data-us/catchdata/fairy_live2d_motions_info.json"
DEFAULT_OUT_PATH = "src/data/live2d-index.json"


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Motion classification


def motion_stem(motion_name):
    """Get a motion table row's file stem from its `motion_name` field.

    Args:
        motion_name: A row's `motion_name`, such as `motions/daiji_idle.mtn`.

    Returns:
        The stem, such as `daiji_idle`.
    """
    return os.path.splitext(os.path.basename(motion_name))[0]


def motion_groups(rows):
    """Flatten the motion table into one stem-keyed classification lookup.

    The table is not scoped per fairy, so the same stem can appear more than once with a different classification across different
    fairies' rows. The first row seen for a stem wins, since the table's earliest rows use the naming most fairies follow.

    Args:
        rows: Rows from `fairy_live2d_motions_info.json`, each with `type`, `motion_name` and `touch_area`.

    Returns:
        A dict of stem to `{"group", "touchArea"}`, `group` one of `idle`, `wait`, `touch` and `touchArea` `head`, `body` or None.
    """
    groups = {}
    for row in rows:
        stem = motion_stem(row["motion_name"])
        if stem in groups:
            continue
        group = MOTION_TYPE_GROUPS[str(row["type"])]
        touch_area = TOUCH_AREAS.get(str(row["touch_area"])) if group == "touch" else None
        groups[stem] = {"group": group, "touchArea": touch_area}
    return groups


def resolve_motion(stem, groups):
    """Classify one real motion file's stem, with the documented fallbacks.

    A stem with no row of its own falls back to a row whose stem it starts with (`daiji_idle_01` against `daiji_idle`), the longest such
    row when more than one matches, and failing that to `idle` for a `daiji_idle`-prefixed stem and `wait` otherwise.

    Args:
        stem: A real motion file's stem, such as `daiji_idle_01`.
        groups: The lookup from `motion_groups`.

    Returns:
        The `{"group", "touchArea"}` classification.
    """
    if stem in groups:
        return groups[stem]
    prefixes = [key for key in groups if stem.startswith(key)]
    if prefixes:
        return groups[max(prefixes, key=len)]
    return {"group": "idle" if stem.startswith("daiji_idle") else "wait", "touchArea": None}


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Staging tree walk


def index_motions(motions_dir, groups):
    """Classify every motion file in one model's `motions/` folder.

    Args:
        motions_dir: A `live2d/fairies/<id>/motions` or `live2d/hocs/<id>/motions` folder.
        groups: The lookup from `motion_groups`.

    Returns:
        A list of `{"name", "group", "model3Group", "seconds", "touchArea"}` dicts, in file name order.
    """
    suffix = ".motion3.json"
    names = sorted(name for name in os.listdir(motions_dir) if name.endswith(suffix))
    motions = []
    for name in names:
        stem = name[: -len(suffix)]
        classification = resolve_motion(stem, groups)
        with open(os.path.join(motions_dir, name), encoding="utf-8") as handle:
            data = json.load(handle)
        motions.append(
            {
                "name": stem,
                "group": classification["group"],
                "model3Group": motion_group_name(stem),
                "seconds": round(data["Meta"]["Duration"], 2),
                "touchArea": classification["touchArea"],
            }
        )
    return motions


def index_kind(root, groups):
    """Index every id folder under one `live2d/fairies` or `live2d/hocs` root.

    Args:
        root: The `fairies` or `hocs` folder, which may not exist.
        groups: The lookup from `motion_groups`.

    Returns:
        A dict of id to `{"motions": [...]}`, in numeric id order. An id folder with no `motions/` folder is skipped.
    """
    entries = {}
    for item_id in numeric_dirs(root):
        motions_dir = os.path.join(root, item_id, "motions")
        if not os.path.isdir(motions_dir):
            continue
        entries[item_id] = {"motions": index_motions(motions_dir, groups)}
    return entries


def build_index(staging_root, motion_rows):
    """Index every fairy's and HOC's motions in a Live2D staging tree.

    Args:
        staging_root: The asset staging tree, holding `live2d/fairies/<id>/` and `live2d/hocs/<id>/`.
        motion_rows: Rows from `fairy_live2d_motions_info.json`.

    Returns:
        The index dict: `{"fairies": {"<id>": {"motions": [...]}}, "hocs": {...}}`.
    """
    groups = motion_groups(motion_rows)
    live2d_root = os.path.join(staging_root, "live2d")
    return {"fairies": index_kind(os.path.join(live2d_root, "fairies"), groups), "hocs": index_kind(os.path.join(live2d_root, "hocs"), groups)}


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Command line


def dumps(index):
    """Serialise a Live2D index in the compact production form.

    Args:
        index: The index dict from `build_index`.

    Returns:
        The file contents, ending in a newline.
    """
    return json.dumps(index, separators=(",", ":"), ensure_ascii=False) + "\n"


def main():
    """Parse arguments, build the Live2D index and write it to disk."""
    parser = argparse.ArgumentParser(description="Index the Live2D motion tree by fairy and HOC id.")
    parser.add_argument("--staging", required=True, help="The asset staging tree, holding live2d/fairies/<id>/ and live2d/hocs/<id>/.")
    parser.add_argument("--motions", default=DEFAULT_MOTIONS_PATH, help="fairy_live2d_motions_info.json. Defaults to the checked-out gf-data-us cache.")
    parser.add_argument("--out", default=DEFAULT_OUT_PATH, help="Where to write the index. Defaults to the one the site bundles.")
    args = parser.parse_args()

    if not os.path.isdir(args.staging):
        sys.exit(f"no such directory: {args.staging}")
    if not os.path.isfile(args.motions):
        sys.exit(f"no such file: {args.motions}")

    with open(args.motions, encoding="utf-8") as handle:
        motion_rows = json.load(handle)

    index = build_index(args.staging, motion_rows)
    with open(args.out, "w", encoding="utf-8") as handle:
        handle.write(dumps(index))
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.1f} KB)")
    print(f"  fairies  {len(index['fairies'])}")
    print(f"  hocs     {len(index['hocs'])}")


if __name__ == "__main__":
    main()
