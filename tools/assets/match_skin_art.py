#!/usr/bin/env python3
"""Work out which Spine rig belongs to each of a doll's skins by comparing artwork.

Matching skins to rigs by name alone does not work. The wiki's skin names were written in 2021 and the
game's English names have been revised since, often with no words in common: General Liu's
`Fox's Shadow of Drooping Branches` is now `Willow Foxfire`. Matching by position does not work
either, because skin ids are not release order and the wiki lists only the skins that existed in
2021.

The artwork settles it. Every skin has a `<id>_skin<n>_wait.gif` in the old repo, rendered from the
very rig that needs naming, and every candidate rig has an atlas page holding its texture. The
same outfit shares a palette across both, so a colour histogram picks the right rig outright. On
General Liu the correct rig scores 0.94 against her skin and 0.66 against her base art.

The GIFs come from git history, since they were dropped from the working tree. Once this has run,
the mapping is baked into `spine-index.json` and the GIFs are no longer needed.

Artwork is good but not infallible. Two skins of one doll can be close enough in palette to swap
places, which is why each match carries the margin it won by, and why `map_skin_rigs.mjs` treats an
exact name match as the stronger evidence where it has one.

Writes `{"<doll id>": {"<position>": {"skin": <id>, "score": <float>, "margin": <float>}}}`.

Requires `Pillow`.

Usage:
    python3 tools/assets/match_skin_art.py --spine <dir> --out <json> [--rev HEAD] [--report <json>]
"""

import argparse
import json
import math
import os
import re
import subprocess
import sys
from collections import defaultdict
from io import BytesIO

from PIL import Image


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

# Colour is quantised to this many levels per channel. Coarse enough to survive the difference
# between a lit, assembled chibi and its flat sprite sheet, fine enough to tell two outfits apart.
LEVELS = 5
BINS = LEVELS**3

# Pixels below this alpha are background. Both the GIFs and the atlas pages are transparent outside
# the artwork, so this drops the padding rather than weighting it as a colour.
ALPHA_FLOOR = 200

# Images are shrunk before counting pixels. The histogram is a proportion, so resolution buys
# nothing beyond this and costs real time across a few thousand files.
THUMBNAIL = (160, 160)

# Animations are tried in this order. `wait` is the idle pose and shows the whole outfit, the rest
# are fallbacks for the handful of skins that have no idle GIF.
PREFERRED_ANIMATIONS = ("wait", "move", "victory", "attack", "dorm_wait")

# How many frames to average over. One frame can catch a pose that hides half the outfit.
FRAME_SAMPLES = 3

# A match must beat the runner-up by at least this much to be worth reporting at all. Two skins of
# the same doll share her hair and skin tone and so score within a whisker of each other, and below
# this the comparison is noise. The margin is written out with each match so the caller can demand
# more: `map_skin_rigs.mjs` only lets artwork overrule a name when the margin is comfortably clear.
MIN_MARGIN = 0.005

GIF_RE = re.compile(r"tdolls/(\d+)/animations/\1_skin(\d+)_(.+)\.gif$")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Histograms


def histogram(image):
    """Reduce an image to a normalised colour histogram over its opaque pixels.

    Args:
        image: A Pillow image.

    Returns:
        A list of `BINS` floats summing to 1, or all zeroes when the image is fully transparent.
    """
    image = image.convert("RGBA")
    image.thumbnail(THUMBNAIL)
    bins = [0.0] * BINS
    total = 0
    for red, green, blue, alpha in image.getdata():
        if alpha < ALPHA_FLOOR:
            continue
        index = (red * LEVELS // 256) * LEVELS**2 + (green * LEVELS // 256) * LEVELS + (blue * LEVELS // 256)
        bins[index] += 1
        total += 1
    return [value / total for value in bins] if total else bins


def similarity(left, right):
    """Bhattacharyya coefficient between two histograms, 1 for identical and 0 for disjoint.

    Args:
        left: First histogram.
        right: Second histogram.

    Returns:
        A float between 0 and 1.
    """
    return sum(math.sqrt(a * b) for a, b in zip(left, right))


def gif_histogram(data):
    """Average the histograms of a few frames spread through an animated GIF.

    Args:
        data: Raw GIF bytes.

    Returns:
        A histogram, or None when no frame held any opaque pixels.
    """
    image = Image.open(BytesIO(data))
    count = getattr(image, "n_frames", 1)
    frames = sorted({max(0, count * step // (FRAME_SAMPLES + 1)) for step in range(1, FRAME_SAMPLES + 1)})
    totals = [0.0] * BINS
    used = 0
    for frame in frames:
        image.seek(frame)
        bins = histogram(image)
        if any(bins):
            totals = [a + b for a, b in zip(totals, bins)]
            used += 1
    return [value / used for value in totals] if used else None


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Inputs


def list_skin_gifs(rev):
    """Find every skin animation GIF in the repository history.

    Args:
        rev: The revision to read the old image tree from.

    Returns:
        A dict of doll id to skin position to animation name to git path.

    Raises:
        SystemExit: When the revision holds no skin GIFs, which means the history was already rewritten.
    """
    listing = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", rev, "--", "src/images/tdolls"],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    found = defaultdict(lambda: defaultdict(dict))
    for path in listing.splitlines():
        match = GIF_RE.search(path)
        if match:
            found[match.group(1)][int(match.group(2))][match.group(3)] = path
    if not found:
        sys.exit(f"no skin GIFs under {rev}, so the artwork cannot be compared")
    return found


def candidate_atlases(doll_dir):
    """Collect the atlas pages a doll publishes, keyed by the skin each one belongs to.

    A page named `GeneralLiu_5101.png` belongs to skin 5101, and `RGeneralLiu_5101.png` is the dorm
    rig for the same skin. Anything without a trailing id is the doll's base artwork, which is kept
    as a candidate so a skin with no rig of its own can be recognised instead of forced onto one.

    Args:
        doll_dir: Directory holding one doll's Spine files.

    Returns:
        A dict of skin id (or None for the base artwork) to a list of PNG paths.
    """
    pages = []
    for entry in sorted(os.listdir(doll_dir)):
        full = os.path.join(doll_dir, entry)
        if os.path.isdir(full):
            pages.extend(os.path.join(full, child) for child in sorted(os.listdir(full)) if child.endswith(".png"))
        elif entry.endswith(".png"):
            pages.append(full)

    grouped = defaultdict(list)
    for page in pages:
        stem = os.path.basename(page)[:-4]
        match = re.search(r"_(\d+)$", stem)
        grouped[match.group(1) if match else None].append(page)
    return grouped


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Matching


def score_candidates(target, grouped, cache):
    """Score one skin's artwork against every candidate rig.

    Each skin is scored by its closest atlas page, since a skin's combat and dorm rigs can sit on
    separate pages that crop the outfit differently.

    Args:
        target: Histogram taken from the skin's GIF.
        grouped: Candidate atlas pages keyed by skin id, as from `candidate_atlases`.
        cache: Dict used to avoid re-reading a page that several skins fall back to.

    Returns:
        A dict of skin id (None for the base artwork) to its best score.
    """

    def page_histogram(page):
        if page not in cache:
            cache[page] = histogram(Image.open(page))
        return cache[page]

    scores = {}
    for skin_id, pages in grouped.items():
        scores[skin_id] = max(similarity(target, page_histogram(page)) for page in pages)
    return scores


def assign(targets, grouped, cache):
    """Decide which rig each of a doll's skins gets, allowing no two skins to claim the same rig.

    Scoring each skin on its own picks the same rig twice and reports a tiny margin, because a
    doll's skins share her hair and skin tone and so score close to each other on every page. Taking
    the strongest pairs first and removing both sides settles those cases: a skin that loses its
    first choice to a better claim moves on to the rig only it wants.

    A skin keeps no rig unless it resembles its rig more than it resembles the doll's base artwork,
    which is how a skin the game never gave a rig ends up falling back to the default.

    Args:
        targets: Histograms keyed by the skin's position in the wiki's list.
        grouped: Candidate atlas pages keyed by skin id, as from `candidate_atlases`.
        cache: Dict used to avoid re-reading a page.

    Returns:
        A dict of position to `(skin id, score, margin)`, holding only the positions that matched.
    """
    scores = {position: score_candidates(target, grouped, cache) for position, target in targets.items()}
    pairs = sorted(
        ((score, position, skin_id) for position, row in scores.items() for skin_id, score in row.items() if skin_id),
        reverse=True,
    )

    chosen, taken = {}, set()
    for score, position, skin_id in pairs:
        if position in chosen or skin_id in taken:
            continue
        if score <= scores[position].get(None, 0):
            continue
        # The runner-up is whatever this skin could still have had, so a rig already claimed by a
        # stronger match does not count against it.
        rivals = [value for other, value in scores[position].items() if other != skin_id and other not in taken]
        chosen[position] = (int(skin_id), score, score - max(rivals, default=0.0))
        taken.add(skin_id)
    return chosen


def main():
    """Match every skin to a rig by artwork and write the mapping."""
    parser = argparse.ArgumentParser(description="Match skins to Spine rigs by comparing artwork.")
    parser.add_argument("--spine", required=True, help="Directory holding spine/<id>/ subdirectories.")
    parser.add_argument("--out", required=True, help="Where to write the position-to-skin-id mapping.")
    parser.add_argument("--rev", default="HEAD", help="Revision to read the old GIF tree from.")
    parser.add_argument("--report", help="Optional path to dump every skin's score, for checking the threshold.")
    args = parser.parse_args()

    if not os.path.isdir(args.spine):
        sys.exit(f"no such directory: {args.spine}")

    gifs = list_skin_gifs(args.rev)
    mapping = defaultdict(dict)
    report = []
    matched, base_won, too_close, no_rigs = 0, 0, 0, 0

    for doll_id in sorted(gifs, key=int):
        doll_dir = os.path.join(args.spine, doll_id)
        if not os.path.isdir(doll_dir):
            continue
        grouped = candidate_atlases(doll_dir)
        if not any(skin_id is not None for skin_id in grouped):
            no_rigs += len(gifs[doll_id])
            continue

        cache, targets = {}, {}
        for position, animations in sorted(gifs[doll_id].items()):
            path = next((animations[name] for name in PREFERRED_ANIMATIONS if name in animations), None)
            if path is None:
                path = next(iter(animations.values()))
            data = subprocess.run(["git", "show", f"{args.rev}:{path}"], capture_output=True, check=True).stdout
            target = gif_histogram(data)
            if target is not None:
                targets[position] = target

        chosen = assign(targets, grouped, cache)
        for position in sorted(targets):
            if position not in chosen:
                base_won += 1
                report.append({"doll": doll_id, "position": position, "skin": None})
                continue
            skin_id, score, margin = chosen[position]
            record = {"skin": skin_id, "score": round(score, 4), "margin": round(margin, 4)}
            report.append({"doll": doll_id, "position": position, **record})
            if margin < MIN_MARGIN:
                too_close += 1
                print(f"  doll {doll_id} skin {position}: {skin_id} at {score:.3f} only beats the next by {margin:.3f}")
            else:
                mapping[doll_id][str(position)] = record
                matched += 1

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(mapping, handle, indent=1, sort_keys=True)
        handle.write("\n")

    if args.report:
        with open(args.report, "w", encoding="utf-8") as handle:
            json.dump(report, handle, indent=1)
            handle.write("\n")

    print(f"\nwrote {args.out}")
    clear = sum(1 for doll in mapping.values() for match in doll.values() if match["margin"] >= 0.05)
    print(f"  skins matched to a rig   {matched}")
    print(f"    of those, clearly      {clear}")
    print(f"  base artwork won         {base_won}")
    print(f"  too close to call        {too_close}")
    print(f"  doll publishes no skins  {no_rigs}")


if __name__ == "__main__":
    main()
