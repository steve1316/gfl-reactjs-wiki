#!/usr/bin/env python3
"""Trace the published faction marks into SVG path data for `src/data/faction-marks.json`.

The marks are published as images as well, and an enemy's page draws the full emblem from the asset host. A filter chip cannot
afford to: a glyph that depends on a cross-origin fetch fails quietly, and a browser that cached one 404 while the asset host was
still propagating keeps showing an empty chip long after the file is live. Path data ships inside the bundle, takes `currentColor`
so it follows the chip through both of its states, and cannot half-load.

The tracer walks the boundary between opaque and transparent pixels, chains those edges into closed loops, and simplifies each loop
with Douglas-Peucker. The loops go into one path drawn with `fill-rule: evenodd`, so holes need no special handling.

Usage:
    python3 tools/assets/trace_faction_marks.py --marks tools/assets/.staging-ui/assets/factions
"""

import argparse
import json
import os
import sys

import numpy as np
from PIL import Image


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

# The mark file behind each faction name, as the enemy data spells the name.
MARK_FILES = {"Sangvis Ferri": "sangvis-ferri-mark.webp", "KCCO": "kcco-mark.webp", "Paradeus": "paradeus-mark.webp"}

DEFAULT_OUT = "src/data/faction-marks.json"

# The grid the trace runs on. Big enough to keep the shape, small enough that the simplified path stays short.
TRACE_HEIGHT = 160

# How far a point may sit from the simplified line, in grid pixels. Higher drops more points and rounds more corners.
EPSILON = 0.9

# A pixel counts as drawn above this alpha.
ALPHA_CUTOFF = 128

# The square the paths are written into, matching the grid MUI's own icons use.
VIEW = 24

# A loop with fewer points than this is a stray pixel rather than part of the mark.
MIN_LOOP_POINTS = 3


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Tracing


def binary_grid(path):
    """Load a mark and reduce it to a grid of drawn pixels.

    Args:
        path: The mark image's path.

    Returns:
        A 2D bool array, True where the mark is drawn.
    """
    image = Image.open(path).convert("RGBA")
    scale = TRACE_HEIGHT / image.height
    image = image.resize((max(1, round(image.width * scale)), TRACE_HEIGHT), Image.LANCZOS)
    return np.array(image)[:, :, 3] > ALPHA_CUTOFF


def boundary_loops(grid):
    """Chain the edges between drawn and undrawn pixels into closed loops.

    Each drawn pixel contributes one directed edge per side whose neighbour is undrawn, wound so the drawn side is on the left.
    Every loop vertex then has one outgoing edge to follow, which is what lets the chaining be a plain lookup.

    Args:
        grid: A 2D bool array of drawn pixels.

    Returns:
        A list of loops, each a list of (x, y) grid points.
    """
    height, width = grid.shape
    edges = {}
    for y in range(height):
        for x in range(width):
            if not grid[y, x]:
                continue
            if y == 0 or not grid[y - 1, x]:
                edges.setdefault((x, y), []).append((x + 1, y))
            if x + 1 == width or not grid[y, x + 1]:
                edges.setdefault((x + 1, y), []).append((x + 1, y + 1))
            if y + 1 == height or not grid[y + 1, x]:
                edges.setdefault((x + 1, y + 1), []).append((x, y + 1))
            if x == 0 or not grid[y, x - 1]:
                edges.setdefault((x, y + 1), []).append((x, y))

    loops = []
    while edges:
        start = next(iter(edges))
        loop = [start]
        point = start
        while True:
            outgoing = edges.get(point)
            if not outgoing:
                break
            following = outgoing.pop()
            if not outgoing:
                del edges[point]
            if following == start:
                break
            loop.append(following)
            point = following
        if len(loop) > MIN_LOOP_POINTS:
            loops.append(loop)
    return loops


def simplify(points, epsilon):
    """Drop the points of a closed loop that sit within `epsilon` of the line they lie on.

    Args:
        points: The loop's points, as (x, y) tuples.
        epsilon: The largest distance a dropped point may sit from the kept line, in grid pixels.

    Returns:
        The kept points, in order.
    """

    def walk(chunk):
        if len(chunk) < 3:
            return list(chunk)
        first = np.array(chunk[0], dtype=float)
        last = np.array(chunk[-1], dtype=float)
        span = last - first
        length = float(np.hypot(*span))
        middle = np.array(chunk[1:-1], dtype=float)
        distances = np.hypot(*(middle - first).T) if length == 0 else np.abs(np.cross(span, middle - first)) / length
        worst = int(np.argmax(distances))
        if distances[worst] <= epsilon:
            return [chunk[0], chunk[-1]]
        return walk(chunk[: worst + 2])[:-1] + walk(chunk[worst + 1 :])

    # The loop is split at its first point so the recursion has two fixed ends to work between, then the repeat is dropped.
    return walk(list(points) + [points[0]])[:-1]


def to_path(loops, grid_shape):
    """Turn traced loops into one SVG path string, centred on the view square.

    Args:
        loops: The simplified loops, in grid coordinates.
        grid_shape: The trace grid's (height, width).

    Returns:
        The path's `d` attribute.
    """
    height, width = grid_shape
    scale = VIEW / max(height, width)
    offset_x = (VIEW - width * scale) / 2
    offset_y = (VIEW - height * scale) / 2

    parts = []
    for loop in loops:
        drawn = [f"{x * scale + offset_x:.2f} {y * scale + offset_y:.2f}" for x, y in loop]
        parts.append("M" + drawn[0] + "L" + "L".join(drawn[1:]) + "Z")
    return "".join(parts)


def trace(marks_dir):
    """Trace every faction's mark.

    Args:
        marks_dir: The staging tree's `factions` directory, holding the `<slug>-mark.webp` files.

    Returns:
        The path data by faction name.

    Raises:
        SystemExit: When a mark file is missing.
    """
    paths = {}
    for faction, name in MARK_FILES.items():
        source = os.path.join(marks_dir, name)
        if not os.path.isfile(source):
            raise SystemExit(f"{source} is missing. Build the faction marks into a staging tree first.")
        grid = binary_grid(source)
        loops = [simplify(loop, EPSILON) for loop in boundary_loops(grid)]
        paths[faction] = to_path([loop for loop in loops if len(loop) > 2], grid.shape)
        print(f"{faction}: {len(paths[faction])} characters of path data")
    return paths


def main():
    """Trace the marks and write the JSON the site imports."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--marks", required=True, help="The staging tree's factions directory.")
    parser.add_argument("--out", default=DEFAULT_OUT, help="Where to write the traced paths.")
    args = parser.parse_args()

    # The tracer recurses once per kept point, and the eagle keeps a few hundred.
    sys.setrecursionlimit(10000)
    paths = trace(args.marks)
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(paths, handle, indent=1)
        handle.write("\n")
    print(f"wrote {args.out}")


if __name__ == "__main__":
    sys.exit(main())
