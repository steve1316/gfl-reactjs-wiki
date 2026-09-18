#!/usr/bin/env python3
"""Add the partial asset manifest and Spine index of an `add` staging folder into the committed files.

The scheduled refresh extracts only new dolls, Mods, skins and equipment, builds a manifest and a Spine index from that staging folder alone, and
merges them here. The merge only adds. Anything the committed files already list stops it, so hosted art is never replaced by accident. Both outputs
keep the exact format and key order the full builders write.

The manifest partial's `hocs` key, when it lists any new HOC art, merges the same way. The `fairies` and `enemies` keys merge the same way too. The `live2d`
key merges the same way at one level deeper, by id within its own `fairies` and `hocs` sub-keys, and its `tdolls` sub-key merges one level
deeper still, by skin key within each doll id and form. The HOC Spine index and the Live2D index are
each a separate committed file, merged only when `--hoc-spine-partial` or `--live2d-partial` is passed. The workflow always passes both, but an
empty partial (a refresh that added no HOC rigs or no Live2D models) is a no-op. Either counts as `{}` (or, for the Live2D index, an empty
`fairies`/`hocs`/`tdolls` set) when its committed file does not exist yet, and nothing is written when the merge changes nothing.

The Live2D index's `tdolls` block only lists which models are available - the motions themselves live in one file per doll under
`src/data/live2d-tdolls/`, built by `build_live2d_index.write_tdoll_files`. `--live2d-tdolls-partial` names the directory of those files
built from the `add` staging folder, merged add-only against `--live2d-tdolls-dir` the same way as everything else here: a doll's
form/skin/variant already committed is a conflict, a new one is added, and an untouched one survives unchanged.

Usage:
    python3 tools/assets/merge_indexes.py --manifest-partial <file> --spine-partial <file> [--manifest assets-manifest.json] \
        [--spine-index src/data/spine-index.json] [--hoc-spine-partial <file>] [--hoc-spine src/data/hoc-spine-index.json] \
        [--live2d-partial <file>] [--live2d-index src/data/live2d-index.json] \
        [--live2d-tdolls-partial <dir>] [--live2d-tdolls-dir src/data/live2d-tdolls]
"""

import argparse
import copy
import json
import os
import sys

from build_live2d_index import dump_tdoll_file
from build_manifest import SKILL_KINDS, V3_ENEMY_IMAGE_FILES, dumps, tdoll_skin_sort_key


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Ordering

# Key order of a manifest doll entry and a Spine index entry, as `build_manifest.build_v3` and `build_spine_index.build_v3` write them.
MANIFEST_DOLL_KEYS = ("normal", "mod", "skins", "skills")
SPINE_ENTRY_KEYS = ("combat", "dorm", "mod", "skins")


class MergeConflict(Exception):
    """Entries in a partial file that the committed file already holds."""

    def __init__(self, conflicts):
        """Store the conflicts.

        Args:
            conflicts: One description per conflicting entry.
        """
        super().__init__("; ".join(conflicts))
        self.conflicts = conflicts


def skin_order(key):
    """Sort key for skin folders: numeric skin ids by number, then `legacy-<slug>` keys by name.

    Args:
        key: A skin key.

    Returns:
        A tuple to sort by.
    """
    return (0, int(key), "") if key.isdigit() else (1, 0, key)


def by_id(entries):
    """Order a dict keyed by doll id numerically.

    Args:
        entries: A dict with numeric string keys.

    Returns:
        A new dict in numeric key order.
    """
    return {key: entries[key] for key in sorted(entries, key=int)}


def in_order(entry, keys):
    """Rebuild a dict in a fixed key order, dropping keys it does not have and sorting its skins.

    Args:
        entry: A manifest doll entry or Spine index entry.
        keys: The key order.

    Returns:
        A new dict.
    """
    ordered = {key: entry[key] for key in keys if key in entry}
    if "skins" in ordered:
        ordered["skins"] = {key: ordered["skins"][key] for key in sorted(ordered["skins"], key=skin_order)}
    return ordered


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Merges


def merge_manifest(committed, partial):
    """Add a partial manifest's new dolls, Mods, skins, skill icons and equipment into the committed manifest.

    A partial entry for a hosted doll carries an empty base form and skill list when only a skin or Mod is new, and those empty lists are ignored.

    Args:
        committed: The committed manifest.
        partial: The manifest built from the `add` staging folder.

    A partial's `hocs` entry is a plain list of image kinds, keyed by HOC id. A HOC id is either entirely new or entirely already
    committed, there is nothing to merge piecemeal within one. A partial's `fairies` entry merges the same way, and so does
    `assimilation`, keyed by captured unit id and listing that unit's skill icon slots. `enemies` merges one kind at a time, since an
    enemy's trimmed hero portrait is derived from its full art and published after it.
    A partial's `live2d` entry merges the same way too, one level deeper: its `fairies` and `hocs` sub-keys each merge by id.

    Returns:
        A merged copy. `committed` is not changed.

    Raises:
        MergeConflict: When the partial lists anything the committed manifest already lists.
    """
    merged = copy.deepcopy(committed)
    conflicts = [f"equipment {equip_id}" for equip_id in partial["equipment"] if equip_id in set(merged["equipment"])]
    merged["equipment"] = sorted(set(merged["equipment"]) | set(partial["equipment"]))
    for doll_id, record in partial["dolls"].items():
        entry = merged["dolls"].get(doll_id)
        if entry is None:
            merged["dolls"][doll_id] = in_order(copy.deepcopy(record), MANIFEST_DOLL_KEYS)
            continue
        if record["normal"]["images"]:
            conflicts.append(f"doll {doll_id} base art")
        if "mod" in record:
            if "mod" in entry:
                conflicts.append(f"doll {doll_id} Mod art")
            else:
                entry["mod"] = record["mod"]
        for skin_id, skin in record.get("skins", {}).items():
            skins = entry.setdefault("skins", {})
            if skin_id in skins:
                conflicts.append(f"doll {doll_id} skin {skin_id}")
            else:
                skins[skin_id] = skin
        conflicts.extend(f"doll {doll_id} {skill} icon" for skill in record["skills"] if skill in entry["skills"])
        entry["skills"] = [skill for skill in SKILL_KINDS if skill in entry["skills"] or skill in record["skills"]]
        merged["dolls"][doll_id] = in_order(entry, MANIFEST_DOLL_KEYS)
    for key, label in (("hocs", "hoc"), ("fairies", "fairy"), ("assimilation", "captured unit")):
        if key in partial or key in merged:
            entries = dict(merged.get(key, {}))
            for entry_id, kinds in partial.get(key, {}).items():
                if entry_id in entries:
                    conflicts.append(f"{label} {entry_id} art")
                else:
                    entries[entry_id] = kinds
            merged[key] = by_id(entries)
    # Enemies merge a kind at a time rather than all or nothing. An enemy gains art in more than one pass: its card and full art are
    # published when the enemy is, and its trimmed hero portrait is derived from that full art afterwards. Adding a kind the
    # committed manifest does not list is an add like any other, while a kind it already lists is still a conflict.
    if "enemies" in partial or "enemies" in merged:
        entries = {entry_id: list(kinds) for entry_id, kinds in merged.get("enemies", {}).items()}
        for entry_id, kinds in partial.get("enemies", {}).items():
            listed = entries.setdefault(entry_id, [])
            conflicts.extend(f"enemy {entry_id} {kind} art" for kind in kinds if kind in listed)
            entries[entry_id] = [kind for kind, _name in V3_ENEMY_IMAGE_FILES if kind in listed or kind in kinds]
        merged["enemies"] = by_id(entries)
    # Faction emblems are a fixed set with no ids to merge, so a partial that carries them simply replaces what is there.
    if partial.get("factions"):
        merged["factions"] = list(partial["factions"])
    if "live2d" in partial or "live2d" in merged:
        try:
            merged["live2d"] = merge_live2d_index(merged.get("live2d", {}), partial.get("live2d", {}))
        except MergeConflict as error:
            conflicts.extend(error.conflicts)
    # Story art merges as three flat sets: a sprite or background is published once, and the dialogue chrome is a single yes or no.
    if "story" in partial or "story" in merged:
        story = {"sprites": [], "backgrounds": [], "ui": False, **copy.deepcopy(merged.get("story", {}))}
        incoming = partial.get("story", {})
        for key, label in (("sprites", "story sprite"), ("backgrounds", "story background")):
            listed = set(story.get(key, []))
            conflicts.extend(f"{label} {name}" for name in incoming.get(key, []) if name in listed)
            story[key] = sorted(listed | set(incoming.get(key, [])))
        if incoming.get("ui"):
            if story.get("ui"):
                conflicts.append("story dialogue chrome")
            story["ui"] = True
        merged["story"] = story
    if conflicts:
        raise MergeConflict(conflicts)
    merged["dolls"] = by_id(merged["dolls"])
    return merged


def merge_spine_index(committed, partial):
    """Add a partial Spine index's new doll, Mod and skin rigs into the committed index.

    Args:
        committed: The committed Spine index.
        partial: The index built and annotated from the `add` staging folder.

    Returns:
        A merged copy. `committed` is not changed.

    Raises:
        MergeConflict: When the partial has a rig the committed index already has.
    """
    merged = copy.deepcopy(committed)
    conflicts = []
    for doll_id, entry in partial.items():
        current = merged.get(doll_id)
        if current is None:
            merged[doll_id] = in_order(copy.deepcopy(entry), SPINE_ENTRY_KEYS)
            continue
        if "combat" in entry:
            if "combat" in current:
                conflicts.append(f"doll {doll_id} rig")
            else:
                current.update({key: entry[key] for key in ("combat", "dorm") if key in entry})
        if "mod" in entry:
            if "mod" in current:
                conflicts.append(f"doll {doll_id} Mod rig")
            else:
                current["mod"] = entry["mod"]
        for skin_id, pair in entry.get("skins", {}).items():
            skins = current.setdefault("skins", {})
            if skin_id in skins:
                conflicts.append(f"doll {doll_id} skin {skin_id} rig")
            else:
                skins[skin_id] = pair
        merged[doll_id] = in_order(current, SPINE_ENTRY_KEYS)
    if conflicts:
        raise MergeConflict(conflicts)
    return by_id(merged)


def merge_hoc_spine_index(committed, partial):
    """Add a partial HOC Spine index's new HOC ids into the committed index.

    Unlike a doll's rigs, a HOC's combat and crew rigs are not merged piecemeal: a HOC id is either entirely new or entirely already
    committed.

    Args:
        committed: The committed HOC Spine index.
        partial: The index built and annotated from the `add` staging folder.

    Returns:
        A merged copy. `committed` is not changed.

    Raises:
        MergeConflict: When the partial has a HOC id the committed index already has.
    """
    merged = copy.deepcopy(committed)
    conflicts = [f"hoc {hoc_id} rig" for hoc_id in partial if hoc_id in merged]
    if conflicts:
        raise MergeConflict(conflicts)
    for hoc_id, entry in partial.items():
        merged[hoc_id] = copy.deepcopy(entry)
    return by_id(merged)


def merge_enemy_spine_index(committed, partial):
    """Add a partial enemy Spine index's new enemy ids into the committed index.

    Like a HOC's, an enemy's rig is not merged piecemeal: an enemy id is either entirely new or entirely already committed.

    Args:
        committed: The committed enemy Spine index.
        partial: The index built and annotated from the `add` staging folder.

    Returns:
        A merged copy. `committed` is not changed.

    Raises:
        MergeConflict: When the partial has an enemy id the committed index already has.
    """
    merged = copy.deepcopy(committed)
    conflicts = [f"enemy {enemy_id} rig" for enemy_id in partial if enemy_id in merged]
    if conflicts:
        raise MergeConflict(conflicts)
    for enemy_id, entry in partial.items():
        merged[enemy_id] = copy.deepcopy(entry)
    return by_id(merged)


def merge_live2d_index(committed, partial):
    """Add a partial Live2D index's new fairy, HOC and T-Doll skin entries into the committed index.

    Like a HOC's Spine rigs, a fairy's or HOC's motions are not merged piecemeal: an id is either entirely new or entirely already committed.
    `tdolls` nests two levels deeper than `fairies` and `hocs`, keyed by doll id then form, so it is merged separately, by variant within
    each doll, form and skin key - not by skin key alone, since a skin can gain a variant it did not have yet (its `damaged` model added in
    a later refresh, say) without that being a conflict with the `normal` variant it already has. An already-present doll/form/skin/variant
    is a conflict, exactly like a fairy or HOC id the committed index already has, so a partial re-run of one variant can never silently
    drop the committed record of another. Every skin's variant list is written back sorted, matching the alphabetical order
    `build_manifest.scan_live2d_tdolls` and `build_live2d_index.index_tdolls` both write it in from a fresh directory walk, so a merge and a
    full rebuild of the same data always agree on file bytes. `tdolls` is only written to the merged result when the committed or partial
    index already has it, mirroring how `merge_manifest` only carries `hocs`, `fairies` and `live2d` forward when one side already has them
    - so merging an old committed index that predates `tdolls` against a partial with nothing tdoll-related reproduces the old shape
    exactly, instead of growing an empty `tdolls` key no caller asked for.

    Args:
        committed: The committed Live2D index, `{"fairies": {...}, "hocs": {...}}`, optionally with a `tdolls` key too.
        partial: The index built from the `add` staging folder, the same shape.

    Returns:
        A merged copy. `committed` is not changed.

    Raises:
        MergeConflict: When the partial has a fairy or HOC id, or a tdoll doll/form/skin/variant, the committed index already has.
    """
    conflicts = []
    merged = {}
    for sub_key, label in (("fairies", "live2d fairy"), ("hocs", "live2d hoc")):
        entries = dict(committed.get(sub_key, {}))
        for entry_id, entry in partial.get(sub_key, {}).items():
            if entry_id in entries:
                conflicts.append(f"{label} {entry_id}")
            else:
                entries[entry_id] = copy.deepcopy(entry)
        merged[sub_key] = entries
    result = {"fairies": by_id(merged["fairies"]), "hocs": by_id(merged["hocs"])}
    if "tdolls" in committed or "tdolls" in partial:
        committed_tdolls = copy.deepcopy(committed.get("tdolls", {}))
        for doll_id, forms in partial.get("tdolls", {}).items():
            doll = committed_tdolls.setdefault(doll_id, {})
            for form, skins in forms.items():
                existing = doll.setdefault(form, {})
                for skin_key, variants in skins.items():
                    existing_variants = existing.setdefault(skin_key, [])
                    for variant in variants:
                        if variant in existing_variants:
                            conflicts.append(f"live2d tdoll {doll_id} {form} {skin_key} {variant}")
                        else:
                            existing_variants.append(variant)
        result["tdolls"] = {
            doll_id: {
                form: {skin_key: sorted(variants) for skin_key, variants in sorted(skins.items(), key=lambda pair: tdoll_skin_sort_key(pair[0]))}
                for form, skins in sorted(forms.items())
            }
            for doll_id, forms in sorted(committed_tdolls.items(), key=lambda pair: int(pair[0]))
        }
    if conflicts:
        raise MergeConflict(conflicts)
    return result


def merge_live2d_tdoll_file(committed, partial):
    """Add one doll's partial Live2D motions into its committed per-doll file, add-only.

    A form/skin/variant already in the committed file is a conflict, exactly like `merge_live2d_index`'s availability merge - a partial
    re-run can never silently replace an already-published variant's motions.

    Args:
        committed: The doll's committed `{"<form>": {"<skinKey>": {"<variant>": {"motions": [...]}}}}` dict, `{}` when the doll has no
            file yet.
        partial: The doll's partial dict, the same shape, from the `add` staging folder.

    Returns:
        A merged copy, with forms, skin keys and variants sorted the same way `build_live2d_index.index_tdolls` writes them.
        `committed` is not changed.

    Raises:
        MergeConflict: When the partial names a form/skin/variant the committed file already has.
    """
    conflicts = []
    merged = copy.deepcopy(committed)
    for form, skins in partial.items():
        existing_skins = merged.setdefault(form, {})
        for skin_key, variants in skins.items():
            existing_variants = existing_skins.setdefault(skin_key, {})
            for variant, entry in variants.items():
                if variant in existing_variants:
                    conflicts.append(f"{form}/{skin_key}/{variant}")
                else:
                    existing_variants[variant] = copy.deepcopy(entry)
    if conflicts:
        raise MergeConflict(conflicts)
    return {
        form: {
            skin_key: {variant: variants[variant] for variant in sorted(variants)}
            for skin_key, variants in sorted(skins.items(), key=lambda pair: tdoll_skin_sort_key(pair[0]))
        }
        for form, skins in sorted(merged.items())
    }


def merge_live2d_tdoll_files(committed_dir, partial_dir):
    """Add every doll's partial Live2D motion file into the committed per-doll files, add-only.

    Only dolls the partial directory names are touched - a doll with no partial file is left alone entirely, since `add-only` here
    means nothing to merge for it, not an empty result to write.

    Args:
        committed_dir: The committed per-doll files directory (`src/data/live2d-tdolls`), which may not exist yet.
        partial_dir: The partial per-doll files directory built from the `add` staging folder.

    Returns:
        A dict of doll id to its merged content, for every doll the partial touches. Nothing is written to disk here.

    Raises:
        MergeConflict: When a partial doll file names a form/skin/variant its committed file already has. Conflicts from different
            dolls are collected together before raising, so one run reports every conflict at once.
    """
    conflicts = []
    merged = {}
    for name in sorted(os.listdir(partial_dir)):
        if not name.endswith(".json"):
            continue
        doll_id = name[: -len(".json")]
        committed_path = os.path.join(committed_dir, name)
        committed = read_json(committed_path) if os.path.isfile(committed_path) else {}
        try:
            merged[doll_id] = merge_live2d_tdoll_file(committed, read_json(os.path.join(partial_dir, name)))
        except MergeConflict as error:
            conflicts.extend(f"live2d tdoll {doll_id} {conflict}" for conflict in error.conflicts)
    if conflicts:
        raise MergeConflict(conflicts)
    return merged


def dump_spine_index(index):
    """Serialise a Spine index exactly as `add_spine_animations.mjs` writes it.

    Args:
        index: The Spine index dict.

    Returns:
        Compact JSON ending in a newline.
    """
    return json.dumps(index, separators=(",", ":"), ensure_ascii=False) + "\n"


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Command line


def read_json(path):
    """Read one JSON file.

    Args:
        path: File path.

    Returns:
        The parsed value.
    """
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def main():
    """Merge the partial files into the committed ones and print what was added."""
    parser = argparse.ArgumentParser(description="Add the partial manifest and Spine index of an add staging folder into the committed files.")
    parser.add_argument("--manifest-partial", required=True, help="Manifest built from the add staging folder.")
    parser.add_argument("--spine-partial", required=True, help="Spine index built and annotated from the add staging folder.")
    parser.add_argument("--manifest", default="assets-manifest.json", help="The committed manifest to update.")
    parser.add_argument("--spine-index", default="src/data/spine-index.json", help="The committed Spine index to update.")
    parser.add_argument("--hoc-spine-partial", help="HOC Spine index built and annotated from the add staging folder. An empty partial (no new HOC rigs) is a no-op.")
    parser.add_argument("--hoc-spine", default="src/data/hoc-spine-index.json", help="The committed HOC Spine index to update.")
    parser.add_argument("--enemy-spine-partial", help="Enemy Spine index built and annotated from the add staging folder. An empty partial (no new enemy rigs) is a no-op.")
    parser.add_argument("--enemy-spine", default="src/data/enemy-spine-index.json", help="The committed enemy Spine index to update.")
    parser.add_argument("--live2d-partial", help="Live2D index built from the add staging folder. An empty partial (no new Live2D models) is a no-op.")
    parser.add_argument("--live2d-index", default="src/data/live2d-index.json", help="The committed Live2D index to update.")
    parser.add_argument(
        "--live2d-tdolls-partial",
        help="Directory of per-doll T-Doll skin Live2D motion files built from the add staging folder. Absent when the refresh added no T-Doll skin motions.",
    )
    parser.add_argument("--live2d-tdolls-dir", default="src/data/live2d-tdolls", help="The committed per-doll Live2D motion files directory to update.")
    args = parser.parse_args()

    manifest_partial, spine_partial = read_json(args.manifest_partial), read_json(args.spine_partial)
    hoc_spine_partial = read_json(args.hoc_spine_partial) if args.hoc_spine_partial else None
    committed_hoc_spine = read_json(args.hoc_spine) if os.path.isfile(args.hoc_spine) else {}
    enemy_spine_partial = read_json(args.enemy_spine_partial) if args.enemy_spine_partial else None
    committed_enemy_spine = read_json(args.enemy_spine) if os.path.isfile(args.enemy_spine) else {}
    live2d_partial = read_json(args.live2d_partial) if args.live2d_partial else None
    committed_live2d = read_json(args.live2d_index) if os.path.isfile(args.live2d_index) else {"fairies": {}, "hocs": {}, "tdolls": {}}
    try:
        manifest = merge_manifest(read_json(args.manifest), manifest_partial)
        spine_index = merge_spine_index(read_json(args.spine_index), spine_partial)
        hoc_spine_index = merge_hoc_spine_index(committed_hoc_spine, hoc_spine_partial) if hoc_spine_partial is not None else None
        enemy_spine_index = merge_enemy_spine_index(committed_enemy_spine, enemy_spine_partial) if enemy_spine_partial is not None else None
        live2d_index = merge_live2d_index(committed_live2d, live2d_partial) if live2d_partial is not None else None
        live2d_tdoll_files = (
            merge_live2d_tdoll_files(args.live2d_tdolls_dir, args.live2d_tdolls_partial)
            if args.live2d_tdolls_partial and os.path.isdir(args.live2d_tdolls_partial)
            else None
        )
    except MergeConflict as conflict:
        sys.exit("the partial files list assets that are already hosted:\n  " + "\n  ".join(conflict.conflicts))

    with open(args.manifest, "w", encoding="utf-8") as handle:
        handle.write(dumps(manifest))
    with open(args.spine_index, "w", encoding="utf-8") as handle:
        handle.write(dump_spine_index(spine_index))
    print(f"merged {len(manifest_partial['dolls'])} manifest doll entries and {len(manifest_partial['equipment'])} equipment ids into {args.manifest}")
    print(f"merged {len(spine_partial)} Spine index entries into {args.spine_index}")

    if hoc_spine_index is not None and hoc_spine_index != committed_hoc_spine:
        with open(args.hoc_spine, "w", encoding="utf-8") as handle:
            handle.write(dump_spine_index(hoc_spine_index))
        print(f"merged {len(hoc_spine_partial)} HOC Spine index entries into {args.hoc_spine}")

    if enemy_spine_index is not None and enemy_spine_index != committed_enemy_spine:
        with open(args.enemy_spine, "w", encoding="utf-8") as handle:
            handle.write(dump_spine_index(enemy_spine_index))
        print(f"merged {len(enemy_spine_partial)} enemy Spine index entries into {args.enemy_spine}")

    if live2d_index is not None and live2d_index != committed_live2d:
        with open(args.live2d_index, "w", encoding="utf-8") as handle:
            handle.write(dump_spine_index(live2d_index))
        merged_count = len(live2d_partial.get("fairies", {})) + len(live2d_partial.get("hocs", {}))
        print(f"merged {merged_count} Live2D index entries into {args.live2d_index}")

    if live2d_tdoll_files:
        os.makedirs(args.live2d_tdolls_dir, exist_ok=True)
        for doll_id, forms in live2d_tdoll_files.items():
            with open(os.path.join(args.live2d_tdolls_dir, f"{doll_id}.json"), "w", encoding="utf-8") as handle:
                handle.write(dump_tdoll_file(forms))
        print(f"merged {len(live2d_tdoll_files)} T-Doll skin motion files into {args.live2d_tdolls_dir}")


if __name__ == "__main__":
    main()
