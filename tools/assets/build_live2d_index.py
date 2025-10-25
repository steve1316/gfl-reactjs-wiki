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

from build_manifest import numeric_dirs, tdoll_skin_sort_key
from extract_live2d import motion_group_name
from skin_live2d_table import MOD_ID_OFFSET, parse_motion_ids

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

# stc/live2d_motions.json's `type` column, mapped to the index's semantic group. 402 is a touch reaction played on the damaged model
# (`is_hurt=1`), the same way 200 is a touch reaction on the normal model. A type absent here is `other`, which the site labels but does
# not treat specially.
SKIN_MOTION_TYPE_GROUPS = {101: "idle", 401: "idle", 102: "wait", 403: "wait", 200: "touch", 402: "touch", 300: "shake", 301: "shake", 500: "wedding"}

# stc/live2d_motions.json's `touch_area` column for a touch row. Skins add `leg`, which fairies never have.
SKIN_TOUCH_AREAS = {"head": "head", "body": "body", "leg": "leg"}

DEFAULT_SKIN_MOTIONS_PATH = "tools/data/.cache/gf-data-us/stc/live2d_motions.json"
DEFAULT_LIVE2D_TABLE_PATH = "tools/data/.cache/gf-data-us/stc/live2d.json"
DEFAULT_VOICE_PATH = "tools/data/.cache/gf-data-us/asset/profilesconfig/newcharactervoice.txt"


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
# Skin motion classification and dialogue lookup


def dialogue_lines(lines):
    """Index the game's voice table by its `<code>|<KEY>` prefix.

    Args:
        lines: Raw lines from `newcharactervoice.txt`, each `<code>|<KEY>|<text>`.

    Returns:
        A dict of `<code>|<KEY>` to the line's text. A malformed line is skipped.
    """
    table = {}
    for line in lines:
        parts = line.rstrip("\n").split("|", 2)
        if len(parts) == 3:
            table.setdefault(f"{parts[0]}|{parts[1]}", parts[2])
    return table


def dialogue_for(text_code, lines):
    """Resolve a motion row's `text` code to its spoken line.

    A motion row writes the code with a leading `GUN|`, which the voice table does not carry.

    Args:
        text_code: The motion row's `text` value, such as `GUN|G36C|DIALOGUE1`, possibly empty.
        lines: The lookup from `dialogue_lines`.

    Returns:
        The line's text, or None when the row has no code or the code is not in the table.
    """
    if not text_code:
        return None
    key = text_code[4:] if text_code.startswith("GUN|") else text_code
    return lines.get(key)


def normalize_skin_touch_area(touch_area):
    """Map a touch row's `touch_area` to one of the site's three areas, tolerating a numbered variant.

    The table names most touch spots directly (`head`, `body`, `leg`), but a model that has more than one hit region for the same area
    numbers them (`body1`, `body2`, `leg2`, `head2`). Stripping a trailing digit run recovers the base area for those. An area this still
    does not recognise (`arm`, `feetL`, `bodyA`, ...) stays unmapped, since it names a spot the site has no icon or label for.

    Args:
        touch_area: The row's raw `touch_area` value, such as `body1`.

    Returns:
        `head`, `body` or `leg`, or None when the area is not one of those, numbered or not.
    """
    if touch_area in SKIN_TOUCH_AREAS:
        return SKIN_TOUCH_AREAS[touch_area]
    return SKIN_TOUCH_AREAS.get(touch_area.rstrip("0123456789"))


def skin_motion_lookup(rows, motion_ids, variant, lines):
    """Build one skin variant's stem-keyed motion classification.

    A model's rows are the subset of the table its `stc/live2d.json` row names, and `is_hurt` splits those between the two variants: a row
    with `is_hurt` set describes the damaged model, and one without describes the normal model. Stems are lowercased because the table
    writes some clip names in a different case from the files, such as `daiji01_SHOWCACE.mtn` against `daiji01_showcace.motion3.json`.

    Args:
        rows: Rows from `stc/live2d_motions.json`.
        motion_ids: The model's motion ids, from its `stc/live2d.json` row.
        variant: `normal` or `damaged`, picking which `is_hurt` value to keep.
        lines: The lookup from `dialogue_lines`.

    Returns:
        A dict of lowercased stem to `{"group", "touchArea", "line"}`. The first row seen for a stem wins.
    """
    by_id = {row["id"]: row for row in rows}
    hurt = 1 if variant == "damaged" else 0
    lookup = {}
    for motion_id in motion_ids:
        row = by_id.get(motion_id)
        if row is None or int(row.get("is_hurt", 0)) != hurt:
            continue
        stem = motion_stem(row["motion_name"]).lower()
        if stem in lookup:
            continue
        group = SKIN_MOTION_TYPE_GROUPS.get(int(row["type"]), "other")
        touch_area = normalize_skin_touch_area(str(row["touch_area"])) if group == "touch" else None
        lookup[stem] = {"group": group, "touchArea": touch_area, "line": dialogue_for(row.get("text", ""), lines)}
    return lookup


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


def index_skin_motions(motions_dir, lookup):
    """Classify every motion file in one skin variant's `motions/` folder.

    Args:
        motions_dir: A `live2d/tdolls/<id>/<form>/<skin>/<variant>/motions` folder.
        lookup: The variant's lookup from `skin_motion_lookup`.

    Returns:
        A list of `{"name", "group", "model3Group", "seconds", "touchArea", "line"}` dicts, in file name order. A file the table does not
        describe is grouped `other` with no touch area and no line.
    """
    suffix = ".motion3.json"
    motions = []
    for name in sorted(name for name in os.listdir(motions_dir) if name.endswith(suffix)):
        stem = name[: -len(suffix)]
        entry = lookup.get(stem.lower(), {"group": "other", "touchArea": None, "line": None})
        with open(os.path.join(motions_dir, name), encoding="utf-8") as handle:
            data = json.load(handle)
        motions.append(
            {
                "name": stem,
                "group": entry["group"],
                "model3Group": motion_group_name(stem),
                "seconds": round(data["Meta"]["Duration"], 2),
                "touchArea": entry["touchArea"],
                "line": entry["line"],
            }
        )
    return motions


def index_tdolls(tdolls_root, table_rows, motion_rows, lines):
    """Index every skin Live2D model's motions under `live2d/tdolls`.

    Rows are joined directly here rather than through `skin_live2d_table.skin_live2d_models`, since that helper filters by bundle name and
    doll id, neither of which the index has or needs - calling it with empty filter sets would drop every row.

    A stray file sitting where a form or skin folder is expected is skipped rather than crashing the walk, mirroring
    `build_manifest.scan_live2d_tdolls`.

    Args:
        tdolls_root: The `live2d/tdolls` folder, which may not exist.
        table_rows: Rows from `stc/live2d.json`, naming each model's motion ids.
        motion_rows: Rows from `stc/live2d_motions.json`.
        lines: The lookup from `dialogue_lines`.

    Returns:
        A dict of doll id to form to skin key to variant to `{"motions": [...]}`, in numeric doll id order.
    """
    entries = {}
    if not os.path.isdir(tdolls_root):
        return entries

    ids_by_key = {}
    for row in table_rows:
        if row["fit_gun"] <= 0:
            continue
        is_mod = row["fit_gun"] > MOD_ID_OFFSET
        key = (
            row["fit_gun"] - MOD_ID_OFFSET if is_mod else row["fit_gun"],
            "mod" if is_mod else "base",
            "base" if row["skin"] == 0 else str(row["skin"]),
        )
        ids_by_key.setdefault(key, parse_motion_ids(row.get("motions", "")))

    for doll_id in numeric_dirs(tdolls_root):
        forms = {}
        for form in sorted(os.listdir(os.path.join(tdolls_root, doll_id))):
            form_root = os.path.join(tdolls_root, doll_id, form)
            if not os.path.isdir(form_root):
                continue
            skins = {}
            skin_names = sorted((name for name in os.listdir(form_root) if os.path.isdir(os.path.join(form_root, name))), key=tdoll_skin_sort_key)
            for skin in skin_names:
                skin_root = os.path.join(form_root, skin)
                variants = {}
                for variant in sorted(os.listdir(skin_root)):
                    variant_root = os.path.join(skin_root, variant)
                    # Same presence rule as build_manifest.scan_live2d_tdolls: moc3 and model3.json both exist. Checking the motions
                    # folder instead let a variant whose model3 write failed still get indexed and offered, 404ing when played.
                    if not os.path.isfile(os.path.join(variant_root, "model.moc3")) or not os.path.isfile(os.path.join(variant_root, "model.model3.json")):
                        continue
                    motions_dir = os.path.join(variant_root, "motions")
                    motion_ids = ids_by_key.get((int(doll_id), form, skin), [])
                    motions = index_skin_motions(motions_dir, skin_motion_lookup(motion_rows, motion_ids, variant, lines)) if os.path.isdir(motions_dir) else []
                    variants[variant] = {"motions": motions}
                if variants:
                    skins[skin] = variants
            if skins:
                forms[form] = skins
        if forms:
            entries[doll_id] = forms
    return entries


def build_index(staging_root, motion_rows, table_rows=(), skin_motion_rows=(), lines=None):
    """Index every fairy's, HOC's and T-Doll skin's motions in a Live2D staging tree.

    Args:
        staging_root: The asset staging tree, holding `live2d/fairies/<id>/`, `live2d/hocs/<id>/` and `live2d/tdolls/<id>/`.
        motion_rows: Rows from `fairy_live2d_motions_info.json`.
        table_rows: Rows from `stc/live2d.json`, naming each T-Doll skin model's motion ids. Defaults to none.
        skin_motion_rows: Rows from `stc/live2d_motions.json`. Defaults to none.
        lines: The lookup from `dialogue_lines`. Defaults to none.

    Returns:
        The index dict: `{"fairies": {"<id>": {"motions": [...]}}, "hocs": {...}, "tdolls": {...}}`.
    """
    groups = motion_groups(motion_rows)
    live2d_root = os.path.join(staging_root, "live2d")
    return {
        "fairies": index_kind(os.path.join(live2d_root, "fairies"), groups),
        "hocs": index_kind(os.path.join(live2d_root, "hocs"), groups),
        "tdolls": index_tdolls(os.path.join(live2d_root, "tdolls"), table_rows, skin_motion_rows, lines or {}),
    }


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
    parser = argparse.ArgumentParser(description="Index the Live2D motion tree by fairy, HOC and T-Doll skin id.")
    parser.add_argument("--staging", required=True, help="The asset staging tree, holding live2d/fairies/<id>/, live2d/hocs/<id>/ and live2d/tdolls/<id>/.")
    parser.add_argument("--motions", default=DEFAULT_MOTIONS_PATH, help="fairy_live2d_motions_info.json. Defaults to the checked-out gf-data-us cache.")
    parser.add_argument("--live2d-table", default=DEFAULT_LIVE2D_TABLE_PATH, help="stc/live2d.json. Defaults to the checked-out gf-data-us cache.")
    parser.add_argument("--skin-motions", default=DEFAULT_SKIN_MOTIONS_PATH, help="stc/live2d_motions.json. Defaults to the checked-out gf-data-us cache.")
    parser.add_argument("--voice", default=DEFAULT_VOICE_PATH, help="newcharactervoice.txt. Defaults to the checked-out gf-data-us cache.")
    parser.add_argument("--out", default=DEFAULT_OUT_PATH, help="Where to write the index. Defaults to the one the site bundles.")
    args = parser.parse_args()

    if not os.path.isdir(args.staging):
        sys.exit(f"no such directory: {args.staging}")
    if not os.path.isfile(args.motions):
        sys.exit(f"no such file: {args.motions}")

    with open(args.motions, encoding="utf-8") as handle:
        motion_rows = json.load(handle)

    # An older data checkout may not carry the T-Doll skin tables yet, so a missing file is treated as empty rather than exiting.
    table_rows = []
    if os.path.isfile(args.live2d_table):
        with open(args.live2d_table, encoding="utf-8") as handle:
            table_rows = json.load(handle)

    skin_motion_rows = []
    if os.path.isfile(args.skin_motions):
        with open(args.skin_motions, encoding="utf-8") as handle:
            skin_motion_rows = json.load(handle)

    lines = {}
    if os.path.isfile(args.voice):
        with open(args.voice, encoding="utf-8") as handle:
            lines = dialogue_lines(handle)

    index = build_index(args.staging, motion_rows, table_rows, skin_motion_rows, lines)
    with open(args.out, "w", encoding="utf-8") as handle:
        handle.write(dumps(index))
    print(f"wrote {args.out} ({os.path.getsize(args.out) / 1024:.1f} KB)")
    print(f"  fairies  {len(index['fairies'])}")
    print(f"  hocs     {len(index['hocs'])}")
    print(f"  tdolls   {len(index['tdolls'])}")


if __name__ == "__main__":
    main()
