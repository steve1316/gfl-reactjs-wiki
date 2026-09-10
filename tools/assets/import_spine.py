#!/usr/bin/env python3
"""Collect Spine chibi data for each doll id and stage it for publishing.

The game ships Spine 2.1 skeletons, but the CDN serves them inside Unity asset bundles that need
unpacking. Two sources avoid that work, and this script merges them, keyed by doll id:

1. `gf-spine-simulator`, which holds pre-extracted skeletons for 323 dolls as a July 2022 snapshot.
2. The Spine bundles already committed to this repo, which cover a handful the snapshot lacks.

Neither source names its directories by doll id. They use the weapon codename (`FG42`, `Type62`),
so the id is recovered through the `code` field in `gf-data-us`'s `gun.hjson`.

Coverage is partial by construction. The 2022 snapshot predates every doll above roughly id 200, so
those keep their animation GIFs until someone unpacks the bundles from the CDN.
"""

import argparse
import json
import os
import re
import shutil
import sys


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

SPINE_EXTENSIONS = (".skel", ".atlas", ".png")

# Top-level records in `gun.hjson` open at a two-space indent and their fields sit at four.
RECORD_OPEN = "  {"
RECORD_CLOSE = ("  },", "  }")
FIELD_RE = re.compile(r"^    (id|code|en_name): (.*)$")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Parsing


def parse_guns(path):
    """Read `gun.hjson` and map each doll id to its weapon codename.

    A plain line scan is used rather than a real hjson parser, because only three flat fields are
    needed and the file's shape is stable. Values may be quoted, as with the code `"357"`, so quotes
    are stripped.

    Args:
        path: Path to `formatted/gun.hjson` from `gf-data-us`.

    Returns:
        A dict mapping integer doll id to codename.
    """
    codes = {}
    current = None
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.rstrip("\n")
            if line == RECORD_OPEN:
                current = {}
            elif line in RECORD_CLOSE:
                if current and current.get("id", "").isdigit() and current.get("code"):
                    codes[int(current["id"])] = current["code"]
                current = None
            elif current is not None:
                match = FIELD_RE.match(line)
                if match:
                    current.setdefault(match.group(1), match.group(2).strip().strip('"').strip("'"))
    return codes


def index_simulator(character_dir):
    """Index the simulator's character directories by lowercased codename.

    Args:
        character_dir: Path to `character/` inside a `gf-spine-simulator` checkout.

    Returns:
        A dict mapping lowercased directory name to the real directory name.
    """
    if not os.path.isdir(character_dir):
        return {}
    return {name.lower(): name for name in os.listdir(character_dir) if os.path.isdir(os.path.join(character_dir, name))}


def index_repo_spine(tdolls_dir):
    """Find Spine bundles already committed under this repo's doll directories.

    Args:
        tdolls_dir: Path to `src/images/tdolls`.

    Returns:
        A dict mapping integer doll id to a list of bundle directory names.
    """
    found = {}
    if not os.path.isdir(tdolls_dir):
        return found
    for doll_id in os.listdir(tdolls_dir):
        if not doll_id.isdigit():
            continue
        doll_dir = os.path.join(tdolls_dir, doll_id)
        bundles = [
            name for name in sorted(os.listdir(doll_dir))
            if name != "animations" and os.path.isdir(os.path.join(doll_dir, name))
        ]
        if bundles:
            found[int(doll_id)] = bundles
    return found


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Staging


def copy_bundle(source_dir, target_dir):
    """Copy the Spine files out of one bundle directory.

    Args:
        source_dir: Directory holding `.skel`, `.atlas` and page PNGs.
        target_dir: Destination directory, created if missing.

    Returns:
        The number of bytes copied.
    """
    copied = 0
    for name in sorted(os.listdir(source_dir)):
        if not name.endswith(SPINE_EXTENSIONS):
            continue
        os.makedirs(target_dir, exist_ok=True)
        source = os.path.join(source_dir, name)
        shutil.copy2(source, os.path.join(target_dir, name))
        copied += os.path.getsize(source)
    return copied


def main():
    """Merge both Spine sources into a staging tree keyed by doll id."""
    parser = argparse.ArgumentParser(description="Stage Spine chibi data keyed by doll id.")
    parser.add_argument("--guns", required=True, help="Path to gun.hjson from gf-data-us.")
    parser.add_argument("--simulator", help="Path to a gf-spine-simulator checkout.")
    parser.add_argument("--tdolls", default="src/images/tdolls", help="This repo's doll image tree.")
    parser.add_argument("--out", required=True, help="Staging directory to write spine/<id>/ into.")
    parser.add_argument("--dry-run", action="store_true", help="Report coverage without copying.")
    args = parser.parse_args()

    codes = parse_guns(args.guns)
    simulator = index_simulator(os.path.join(args.simulator, "character")) if args.simulator else {}
    repo = index_repo_spine(args.tdolls)

    doll_ids = sorted(int(name) for name in os.listdir(args.tdolls) if name.isdigit())
    staged, total_bytes, missing = {}, 0, []

    for doll_id in doll_ids:
        target = os.path.join(args.out, "spine", str(doll_id))
        bundles, source = [], None

        code = codes.get(doll_id, "")
        if code.lower() in simulator:
            source = "gf-spine-simulator"
            bundle_dir = os.path.join(args.simulator, "character", simulator[code.lower()])
            if not args.dry_run:
                total_bytes += copy_bundle(bundle_dir, target)
            bundles.append(simulator[code.lower()])

        for name in repo.get(doll_id, []):
            source = source or "this repo"
            if not args.dry_run:
                total_bytes += copy_bundle(os.path.join(args.tdolls, str(doll_id), name), os.path.join(target, name))
            bundles.append(name)

        if bundles:
            staged[str(doll_id)] = {"code": code, "source": source, "bundles": bundles}
        else:
            missing.append(doll_id)

    print(f"dolls            : {len(doll_ids)}")
    print(f"staged with spine: {len(staged)}  ({100 * len(staged) / len(doll_ids):.0f}%)")
    print(f"missing          : {len(missing)}  (all id >= {min(missing) if missing else 0})")
    if not args.dry_run:
        print(f"bytes copied     : {total_bytes / 1048576:.1f} MB")
        index_path = os.path.join(args.out, "spine", "index.json")
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
        with open(index_path, "w", encoding="utf-8") as handle:
            json.dump({"dolls": staged, "missing": missing}, handle, indent=1, sort_keys=True)
        print(f"wrote            : {index_path}")


if __name__ == "__main__":
    main()
