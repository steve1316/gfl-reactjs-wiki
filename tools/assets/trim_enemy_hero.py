#!/usr/bin/env python3
"""Derive each enemy's hero portrait by trimming its full art down to the drawing.

The game draws every enemy on a square canvas, 1024 or 2048 a side, and most of that canvas is transparent: the drawing itself is
usually much taller than it is wide, a median of 0.78 across a sample and as narrow as 0.27. A page that shows the canvas has to
matte it to fit a portrait card, which is what left a band of empty space above and below the art.

Trimming to the drawing lets the card take the art's own shape instead, so it fills the card at whatever height the page gives it.
The step runs over an extracted staging tree, next to the `full.webp` it reads, so it is repeatable from the pipeline rather than a
one-off edit of published files.

Usage:
    python3 tools/assets/trim_enemy_hero.py --assets tools/assets/.staging-enemies/assets --out tools/assets/.staging-hero/assets
"""

import argparse
import os
import sys

import numpy as np
from PIL import Image


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

# A pixel counts as drawn above this alpha. Above zero, so the feathered edge of a glow does not count as artwork.
ALPHA_CUTOFF = 8

# Breathing room left around the drawing, as a share of its longest side, so the art does not touch the card's edges.
PADDING = 0.03

# Longest side of a published hero image. The card draws it at about 630 tall at most, so this still has room on a 1.5x display.
MAX_SIDE = 1000

WEBP_QUALITY = 82


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Trimming


def drawn_box(image):
    """Find the box the artwork actually occupies inside its canvas.

    Args:
        image: An RGBA image.

    Returns:
        A `(left, top, right, bottom)` box, or None when the image is entirely transparent.
    """
    alpha = np.array(image)[:, :, 3]
    cols = np.where(alpha.max(axis=0) > ALPHA_CUTOFF)[0]
    rows = np.where(alpha.max(axis=1) > ALPHA_CUTOFF)[0]
    if len(cols) == 0 or len(rows) == 0:
        return None
    return int(cols.min()), int(rows.min()), int(cols.max()) + 1, int(rows.max()) + 1


def trim(image):
    """Crop an image to its artwork, with a little padding around it.

    Args:
        image: An RGBA image.

    Returns:
        The cropped image, or None when the image is entirely transparent.
    """
    box = drawn_box(image)
    if box is None:
        return None
    left, top, right, bottom = box
    pad = round(max(right - left, bottom - top) * PADDING)
    cropped = image.crop((max(0, left - pad), max(0, top - pad), min(image.width, right + pad), min(image.height, bottom + pad)))
    if max(cropped.size) > MAX_SIDE:
        cropped.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return cropped


def run(assets_root, out_root):
    """Write a trimmed hero image for every enemy in a staging tree that has full art.

    Args:
        assets_root: An extracted assets tree holding `enemies/<id>/full.webp`.
        out_root: The assets tree to write `enemies/<id>/hero.webp` into.

    Returns:
        A `(written, skipped)` pair of counts.

    Raises:
        SystemExit: When the tree holds no enemy art at all.
    """
    enemies_dir = os.path.join(assets_root, "enemies")
    if not os.path.isdir(enemies_dir):
        raise SystemExit(f"{enemies_dir} does not exist. Extract the enemy art first.")

    written = 0
    skipped = 0
    ratios = []
    for enemy_id in sorted(os.listdir(enemies_dir), key=lambda name: int(name) if name.isdigit() else 0):
        source = os.path.join(enemies_dir, enemy_id, "full.webp")
        if not os.path.isfile(source):
            # The enemy has only its square card, whose drawing really is about as wide as it is tall, so there is nothing to gain.
            skipped += 1
            continue
        cropped = trim(Image.open(source).convert("RGBA"))
        if cropped is None:
            skipped += 1
            continue
        target = os.path.join(out_root, "enemies", enemy_id)
        os.makedirs(target, exist_ok=True)
        cropped.save(os.path.join(target, "hero.webp"), "WEBP", quality=WEBP_QUALITY, method=6)
        ratios.append(cropped.width / cropped.height)
        written += 1

    if ratios:
        ratios.sort()
        print(f"drawn shape: median {ratios[len(ratios) // 2]:.2f} wide for its height, {sum(1 for r in ratios if r > 1)} of {len(ratios)} wider than tall")
    return written, skipped


def main():
    """Trim every enemy's full art into a hero portrait."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--assets", required=True, help="An extracted assets tree holding enemies/<id>/full.webp.")
    parser.add_argument("--out", required=True, help="The assets tree to write enemies/<id>/hero.webp into.")
    args = parser.parse_args()

    written, skipped = run(args.assets, args.out)
    print(f"wrote {written} hero images, skipped {skipped} enemies with no full art")


if __name__ == "__main__":
    sys.exit(main())
