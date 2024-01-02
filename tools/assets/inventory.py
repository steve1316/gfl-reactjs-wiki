#!/usr/bin/env python3
"""Report the size of every GFL asset tier, using the ResData manifest alone.

`gf-resource-downloader` reads `resdata/<region>_resdata.json`, published as an 8.4 MB `resdata.zip`
on that project's ResData release. The manifest lists every asset bundle with a per-bundle
`sizeOriginal`, so the whole inventory is measurable from metadata. Nothing is fetched from the game
CDN, which turns a multi-gigabyte download into an 8 MB one.

Use it to decide how assets shard across hosts, since each GitHub Pages site is capped at 1 GB.
"""

import argparse
import collections
import json
import os
import sys
import urllib.request
import zipfile


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

RESDATA_URL = "https://github.com/gf-data-tools/gf-resource-downloader/releases/download/ResData/resdata.zip"

REGIONS = ("us", "ch", "tw", "kr", "jp")

# Asset bundles carrying game content. The remaining top-level keys are Unity scaffolding.
BUNDLE_KEYS = ("BaseAssetBundles", "AddAssetBundles")

BYTES_PER_MB = 1048576


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Classification


def bundle_tier(name):
    """Classify an asset bundle by what the wiki would use it for.

    Args:
        name: The `assetBundleName`, e.g. `character_06typesmg_spine`.

    Returns:
        A human-readable tier name.
    """
    lowered = name.lower()
    if lowered.startswith("character"):
        return "Chibi Spine" if lowered.endswith("_spine") else "Character art (cards/full/skins)"
    if lowered.startswith("live2dnew"):
        return "Live2D full art"
    if lowered.startswith("avgpicprefabs"):
        return "VN story sprites"
    if "avgtexture" in lowered:
        return "VN backgrounds"
    if lowered.startswith("battlebackground"):
        return "Battle backgrounds"
    return "UI / icons / misc"


def audio_tier(name):
    """Classify a `bytesData` entry, which mixes audio banks with cutscene video.

    Args:
        name: The `fileName`, e.g. `UMP45Mod.acb` or `202509Activity_ED1.usm`.

    Returns:
        A human-readable tier name.
    """
    lowered = name.lower()
    if lowered.endswith(".usm"):
        return "Video .usm (out of scope)"
    if lowered.startswith("avg"):
        return "AVG story dialogue"
    if lowered.startswith(("battle", "ui", "amb")):
        return "SE / ambient"
    if lowered.startswith(("gf_", "m_va", "bgm_", "op_", "djmax")):
        return "Music / BGM"
    return "Per-doll voice + misc BGM"


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Manifest loading


def load_resdata(region, path):
    """Load one region's ResData, downloading the zip when it is not already present.

    Args:
        region: One of the values in `REGIONS`.
        path: Local path to the zip, used as both cache and download target.

    Raises:
        KeyError: If the zip holds no manifest for the requested region.

    Returns:
        The parsed ResData object.
    """
    if not os.path.exists(path):
        print(f"fetching {RESDATA_URL}", file=sys.stderr)
        urllib.request.urlretrieve(RESDATA_URL, path)
    with zipfile.ZipFile(path) as archive:
        return json.loads(archive.read(f"{region}_resdata.json"))


def summarise(resdata):
    """Total the byte counts per tier.

    Args:
        resdata: A parsed ResData object.

    Returns:
        A `(sizes, counts)` pair of counters keyed by tier name.
    """
    sizes = collections.Counter()
    counts = collections.Counter()
    for key in BUNDLE_KEYS:
        for bundle in resdata.get(key, []):
            tier = bundle_tier(bundle["assetBundleName"])
            sizes[tier] += bundle.get("sizeOriginal", 0)
            counts[tier] += 1
    for entry in resdata.get("bytesData", []):
        tier = audio_tier(entry["fileName"])
        sizes[tier] += entry.get("sizeOriginal", 0)
        counts[tier] += 1
    return sizes, counts


def main():
    """Parse arguments, summarise the manifest and print the per-tier table."""
    parser = argparse.ArgumentParser(description="Size every GFL asset tier from the ResData manifest.")
    parser.add_argument("--region", default="us", choices=REGIONS, help="Server region to inventory.")
    parser.add_argument("--resdata", default="resdata.zip", help="Path to resdata.zip, downloaded if absent.")
    args = parser.parse_args()

    resdata = load_resdata(args.region, args.resdata)
    sizes, counts = summarise(resdata)

    print(f"region={args.region}  resVison={resdata.get('resVison')}  cdn={resdata.get('resUrl')}")
    print()
    print(f"{'TIER':<36}{'FILES':>8}{'SIZE (MB)':>12}")
    print("-" * 56)
    for tier, total in sizes.most_common():
        print(f"{tier:<36}{counts[tier]:>8}{total / BYTES_PER_MB:>12.1f}")
    print("-" * 56)
    print(f"{'TOTAL':<36}{sum(counts.values()):>8}{sum(sizes.values()) / BYTES_PER_MB:>12.1f}")


if __name__ == "__main__":
    main()
