#!/usr/bin/env python3
"""Stage an asset tree for publishing to one of the GitHub Pages asset repos.

Each Pages site is capped at 1 GB, and the full image tree is roughly 6 GB, so assets have to be
split across repos by tier. This script copies a chosen set of tiers into a staging directory,
writes the matching `assets-manifest.json`, and refuses to produce a tree that would breach the cap.
"""

import argparse
import collections
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import build_manifest


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

# GitHub Pages publishes at most 1 GB per site.
PAGES_LIMIT_BYTES = 1024 * 1024 * 1024

BYTES_PER_MB = 1048576

TIERS = ("cards", "full", "skills", "animations", "spine", "equipment", "ui")

DEFAULT_TIERS = ("cards", "skills", "spine", "equipment", "ui")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Tier matching


def classify(rel_path):
    """Work out which tier a file belongs to.

    Args:
        rel_path: Path relative to the images root, e.g. `tdolls/110/110_card.png`.

    Returns:
        A tier name from `TIERS`, or `None` when the file belongs to no tier.
    """
    parts = rel_path.split(os.sep)
    name = parts[-1]

    if parts[0] == "equipment":
        return "equipment"
    if len(parts) == 1:
        return "ui"
    if parts[0] != "tdolls":
        return None

    if len(parts) >= 3 and parts[2] == "animations":
        return "animations"
    # A Spine bundle sits in its own subdirectory, so any deeper path that is not an animation is Spine.
    if len(parts) >= 4:
        return "spine"

    stem = os.path.splitext(name)[0]
    if stem.endswith(("_card", "_card_d")):
        return "cards"
    if stem.endswith(("_full", "_full_d")):
        return "full"
    if stem.endswith(("_skill1", "_skill2")):
        return "skills"
    return None


def walk_tiers(images_root):
    """Enumerate every file under the images root alongside its tier.

    Args:
        images_root: Directory holding `tdolls/` and `equipment/`.

    Returns:
        A list of `(rel_path, tier, size_bytes)` tuples, with untiered files omitted.
    """
    found = []
    for directory, _, names in os.walk(images_root):
        for name in names:
            absolute = os.path.join(directory, name)
            rel_path = os.path.relpath(absolute, images_root)
            tier = classify(rel_path)
            if tier is not None:
                found.append((rel_path, tier, os.path.getsize(absolute)))
    return found


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Staging


def stage(images_root, out_dir, tiers, dry_run):
    """Copy the selected tiers into the staging directory.

    Args:
        images_root: Directory holding `tdolls/` and `equipment/`.
        out_dir: Staging directory, created if missing.
        tiers: Tier names to include.
        dry_run: When true, report what would be copied without writing anything.

    Returns:
        The total size in bytes of the staged tree.
    """
    selected = set(tiers)
    entries = walk_tiers(images_root)

    sizes = collections.Counter()
    counts = collections.Counter()
    for _, tier, size in entries:
        sizes[tier] += size
        counts[tier] += 1

    print(f"{'TIER':<14}{'FILES':>8}{'SIZE (MB)':>12}   staged")
    print("-" * 48)
    for tier in TIERS:
        mark = "yes" if tier in selected else "-"
        print(f"{tier:<14}{counts[tier]:>8}{sizes[tier] / BYTES_PER_MB:>12.1f}   {mark}")
    print("-" * 48)

    total = sum(size for _, tier, size in entries if tier in selected)
    print(f"{'STAGED TOTAL':<14}{sum(counts[t] for t in selected):>8}{total / BYTES_PER_MB:>12.1f}")
    print(f"{'PAGES LIMIT':<14}{'':>8}{PAGES_LIMIT_BYTES / BYTES_PER_MB:>12.1f}")

    if total > PAGES_LIMIT_BYTES:
        over = (total - PAGES_LIMIT_BYTES) / BYTES_PER_MB
        sys.exit(f"\nrefusing to stage: {over:.1f} MB over the 1 GB Pages limit. Drop a tier or split across repos.")

    if dry_run:
        print("\ndry run, nothing written")
        return total

    for rel_path, tier, _ in entries:
        if tier not in selected:
            continue
        destination = os.path.join(out_dir, rel_path)
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        shutil.copy2(os.path.join(images_root, rel_path), destination)

    manifest_path = os.path.join(out_dir, "assets-manifest.json")
    manifest = build_manifest.build(out_dir)
    with open(manifest_path, "w", encoding="utf-8") as handle:
        import json

        json.dump(manifest, handle, sort_keys=True)
        handle.write("\n")

    print(f"\nstaged into {out_dir}")
    print(f"  manifest covers {manifest['counts']['tdolls']} dolls, {manifest['counts']['forms']} forms")
    return total


def main():
    """Parse arguments and stage the requested tiers."""
    parser = argparse.ArgumentParser(description="Stage asset tiers for a GitHub Pages asset repo.")
    parser.add_argument("--images", default="src/images", help="Directory holding tdolls/ and equipment/.")
    parser.add_argument("--out", required=True, help="Staging directory to write into.")
    parser.add_argument("--tiers", nargs="+", default=list(DEFAULT_TIERS), choices=TIERS, help="Tiers to include.")
    parser.add_argument("--dry-run", action="store_true", help="Report sizes without copying.")
    args = parser.parse_args()

    if not os.path.isdir(args.images):
        sys.exit(f"no such directory: {args.images}")

    stage(args.images, args.out, args.tiers, args.dry_run)


if __name__ == "__main__":
    main()
