#!/usr/bin/env python3
"""Add the partial asset manifest and Spine index of an `add` staging folder into the committed files.

The scheduled refresh extracts only new dolls, Mods, skins and equipment, builds a manifest and a Spine index from that staging folder alone, and
merges them here. The merge only adds. Anything the committed files already list stops it, so hosted art is never replaced by accident. Both outputs
keep the exact format and key order the full builders write.

Usage:
    python3 tools/assets/merge_indexes.py --manifest-partial <file> --spine-partial <file> [--manifest assets-manifest.json] [--spine-index src/data/spine-index.json]
"""

import argparse
import copy
import json
import sys

from build_manifest import SKILL_KINDS, dumps


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
    """Merge both partial files into the committed ones and print what was added."""
    parser = argparse.ArgumentParser(description="Add the partial manifest and Spine index of an add staging folder into the committed files.")
    parser.add_argument("--manifest-partial", required=True, help="Manifest built from the add staging folder.")
    parser.add_argument("--spine-partial", required=True, help="Spine index built and annotated from the add staging folder.")
    parser.add_argument("--manifest", default="assets-manifest.json", help="The committed manifest to update.")
    parser.add_argument("--spine-index", default="src/data/spine-index.json", help="The committed Spine index to update.")
    args = parser.parse_args()

    manifest_partial, spine_partial = read_json(args.manifest_partial), read_json(args.spine_partial)
    try:
        manifest = merge_manifest(read_json(args.manifest), manifest_partial)
        spine_index = merge_spine_index(read_json(args.spine_index), spine_partial)
    except MergeConflict as conflict:
        sys.exit("the partial files list assets that are already hosted:\n  " + "\n  ".join(conflict.conflicts))

    with open(args.manifest, "w", encoding="utf-8") as handle:
        handle.write(dumps(manifest))
    with open(args.spine_index, "w", encoding="utf-8") as handle:
        handle.write(dump_spine_index(spine_index))
    print(f"merged {len(manifest_partial['dolls'])} manifest doll entries and {len(manifest_partial['equipment'])} equipment ids into {args.manifest}")
    print(f"merged {len(spine_partial)} Spine index entries into {args.spine_index}")


if __name__ == "__main__":
    main()
