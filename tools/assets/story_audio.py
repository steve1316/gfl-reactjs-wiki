"""Build the story player's audio: resolve the cues the scripts name, fetch their containers, and encode each one for the web.

Audio is distributed differently from art, which is why it does not go through `game_bundles.py`. It is listed in ResData's third
top-level list, `bytesData`, rather than the asset bundle lists, it is served with a `.dat` extension rather than `.ab`, and each file
is a ZIP wrapping a CriWare ACB container. The ACB is decoded with vgmstream and re-encoded to Opus, which for these tracks comes out
smaller than the ACB it came from.

A cue is resolved three ways, in order:

- a container named after the cue, such as `BGM_Frontline` for the cue of the same name,
- a subsong inside the shared `AVG` container, which holds hundreds of short sound effects,
- the container the game's own `audiotemplate.txt` names for that cue.

Cues that resolve none of those ways are music from retired events that the current build no longer ships. They are reported and
skipped, and the player simply stays quiet for them.

Usage:
    python3 tools/assets/story_audio.py plan --gf-data <dir> --site-data src/data
    python3 tools/assets/story_audio.py build --gf-data <dir> --site-data src/data --staging <dir>
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import urllib.request
import zipfile

# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Module constants

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))

#: Where downloaded and unpacked containers are kept between runs.
CACHE_DIR = os.path.join(TOOLS_DIR, ".cache", "audio")

#: The vgmstream binary, fetched separately and kept out of git.
VGMSTREAM = os.path.join(TOOLS_DIR, ".tools", "vgmstream", "vgmstream-cli")

#: The shared container holding the story's sound effects as subsongs.
SFX_CONTAINER = "AVG"

#: Opus bitrates. Music is a loop playing under dialogue rather than focused listening, so it is given less than the effects.
BGM_BITRATE = "64k"
SFX_BITRATE = "96k"

#: How the site asks for a cue, and so what each file is named.
TREE = "assets"

USER_AGENT = "gfl-archive-asset-rebuild/1.0 (fan site asset pipeline; https://github.com/steve1316/gfl-archive)"


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Reading the inputs


def read_json(path):
    """Read one JSON file.

    Args:
        path: The file to read.

    Returns:
        The parsed contents.
    """
    with open(path, encoding="utf-8") as handle:
        return json.load(handle)


def story_cues(site_dir):
    """Collect every music and sound cue the generated story data names.

    Args:
        site_dir: Directory holding the generated data, whose `story/scenes` folder the story build writes.

    Returns:
        A `(bgm, sfx)` pair of dicts, each mapping a cue name to how many times the scripts use it.
    """
    bgm, sfx = {}, {}
    scenes = os.path.join(site_dir, "story", "scenes")
    if not os.path.isdir(scenes):
        return bgm, sfx
    for name in sorted(os.listdir(scenes)):
        if not name.endswith(".json"):
            continue
        for beat in read_json(os.path.join(scenes, name)).get("beats", []):
            for op in beat.get("ops", []):
                value = op.get("value")
                if not value:
                    continue
                if op.get("type") == "bgm":
                    bgm[value] = bgm.get(value, 0) + 1
                elif op.get("type") == "sfx":
                    sfx[value] = sfx.get(value, 0) + 1
    return bgm, sfx


def audio_index(resdata):
    """Index the audio files ResData lists, by filename.

    Args:
        resdata: The parsed `resdata_no_hash.json`.

    Returns:
        A dict of lowercased filename without its extension to its `{resname, sizeOriginal}` entry.
    """
    found = {}
    for entry in resdata.get("bytesData", []):
        name = (entry.get("fileName") or "").split("/")[-1]
        if name.lower().endswith(".acb"):
            found[name[: -len(".acb")].lower()] = entry
    return found


def cue_containers(gf_data_dir):
    """Read the game's own cue table, which names the container each cue plays from.

    Args:
        gf_data_dir: The `gf-data-us` checkout.

    Returns:
        A dict of lowercased cue name to container name. Empty when the table is absent.
    """
    path = os.path.join(gf_data_dir, "asset", "textdata", "audiotemplate.txt")
    if not os.path.exists(path):
        return {}
    found = {}
    with open(path, encoding="utf-8", errors="replace") as handle:
        for line in handle:
            parts = line.rstrip("\n").split("|")
            if len(parts) < 4:
                continue
            for key in (parts[1], parts[2]):
                if key:
                    found.setdefault(key.lower(), parts[3])
    return found


def subsong_names(acb_path):
    """List the subsongs inside one container, in the order vgmstream indexes them.

    A container such as `AVG` packs hundreds of short effects, each addressable by index. The names are what the scripts refer to.

    Args:
        acb_path: The unpacked `.acb` file.

    Returns:
        A dict of lowercased subsong name to its 1-based index. Empty when the container holds a single stream.
    """
    found = {}
    total = None
    for index in range(1, 4000):
        result = subprocess.run([VGMSTREAM, "-m", "-s", str(index), acb_path], capture_output=True, text=True)
        if result.returncode != 0:
            break
        name = None
        for line in result.stdout.splitlines():
            if line.startswith("stream count:") and total is None:
                total = int(line.split(":", 1)[1])
            elif line.startswith("stream name:"):
                name = line.split(":", 1)[1].strip()
        if name:
            found.setdefault(name.lower(), index)
        if total is not None and index >= total:
            break
    return found


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fetching


def fetch_container(entry, res_url, name):
    """Download one audio container and unpack it, unless it is already cached.

    The CDN serves these with a `.dat` extension and each one is a ZIP wrapping the real `.acb`, which is why the asset bundle
    downloader cannot be reused for them.

    Args:
        entry: The `bytesData` entry, holding `resname` and `sizeOriginal`.
        res_url: The CDN base from ResData.
        name: The container name, used for the cached filename.

    Returns:
        The path to the unpacked `.acb`.

    Raises:
        RuntimeError: When the download is not a ZIP, or unpacks to no `.acb`.
    """
    os.makedirs(CACHE_DIR, exist_ok=True)
    unpacked = os.path.join(CACHE_DIR, f"{name}.acb")
    if os.path.exists(unpacked) and os.path.getsize(unpacked) == entry.get("sizeOriginal", 0):
        return unpacked
    archive = os.path.join(CACHE_DIR, f"{name}.dat")
    request = urllib.request.Request(f"{res_url}{entry['resname']}.dat", headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response, open(archive, "wb") as handle:
        shutil.copyfileobj(response, handle)
    if not zipfile.is_zipfile(archive):
        raise RuntimeError(f"{name}: downloaded file is not a ZIP")
    with zipfile.ZipFile(archive) as bundle:
        inner = next((member for member in bundle.namelist() if member.lower().endswith((".acb", ".acb.bytes"))), None)
        if inner is None:
            raise RuntimeError(f"{name}: archive holds no .acb")
        with bundle.open(inner) as source, open(unpacked, "wb") as handle:
            shutil.copyfileobj(source, handle)
    os.remove(archive)
    return unpacked


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Encoding


def encode_cue(acb_path, subsong, out_path, bitrate):
    """Decode one cue and encode it for the web.

    Args:
        acb_path: The unpacked container.
        subsong: The 1-based subsong index, or None for a single-stream container.
        out_path: Where to write the `.opus` file.
        bitrate: The Opus bitrate, such as `64k`.

    Returns:
        True when the file was written, False when either tool refused the input.
    """
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    wav = f"{out_path}.wav"
    decode = [VGMSTREAM, "-o", wav] + (["-s", str(subsong)] if subsong else []) + [acb_path]
    if subprocess.run(decode, capture_output=True).returncode != 0 or not os.path.exists(wav):
        return False
    encode = ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-c:a", "libopus", "-b:a", bitrate, out_path]
    ok = subprocess.run(encode, capture_output=True).returncode == 0
    os.remove(wav)
    return ok and os.path.exists(out_path)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Resolving


def cue_file(cue):
    """The filename stem a cue is published under.

    Args:
        cue: The cue name a script uses.

    Returns:
        The stem, lowercased so the site can build the URL from the script's own text.
    """
    return cue.lower()


def resolve(cues, files, templates, subsongs, kind):
    """Work out where each cue's audio comes from.

    Args:
        cues: Cue names mapped to how often the scripts use them.
        files: The index from `audio_index`.
        templates: The cue table from `cue_containers`.
        subsongs: Subsong names inside the shared effects container, from `subsong_names`.
        kind: `bgm` or `sfx`, which decides the bitrate.

    Returns:
        A `(plan, missing)` pair. Each plan entry is `{cue, container, subsong, kind}`; `missing` lists the cues nothing ships for.
    """
    plan, missing = [], []
    for cue in sorted(cues, key=str.lower):
        key = cue.lower()
        if key in files:
            plan.append({"cue": cue, "container": cue, "subsong": None, "kind": kind})
            continue
        index = subsongs.get(key) or subsongs.get(f"{SFX_CONTAINER.lower()}_{key}")
        if index:
            plan.append({"cue": cue, "container": SFX_CONTAINER, "subsong": index, "kind": kind})
            continue
        named = templates.get(key)
        if named and named.lower() in files:
            plan.append({"cue": cue, "container": named, "subsong": None, "kind": kind})
            continue
        missing.append(cue)
    return plan, missing


def build_plan(gf_data_dir, site_dir, res_url_out=None):
    """Resolve every story cue against what the game ships.

    Args:
        gf_data_dir: The `gf-data-us` checkout.
        site_dir: Directory holding the generated story data.
        res_url_out: Optional list the CDN base is appended to, for the caller to reuse.

    Returns:
        A `(plan, missing, files)` triple.
    """
    resdata = read_json(os.path.join(gf_data_dir, "resdata_no_hash.json"))
    if res_url_out is not None:
        res_url_out.append(resdata.get("resUrl", ""))
    files = audio_index(resdata)
    templates = cue_containers(gf_data_dir)
    bgm, sfx = story_cues(site_dir)

    subsongs = {}
    if SFX_CONTAINER.lower() in files:
        shared = fetch_container(files[SFX_CONTAINER.lower()], resdata.get("resUrl", ""), SFX_CONTAINER)
        subsongs = subsong_names(shared)

    bgm_plan, bgm_missing = resolve(bgm, files, templates, subsongs, "bgm")
    sfx_plan, sfx_missing = resolve(sfx, files, templates, subsongs, "sfx")
    return bgm_plan + sfx_plan, {"bgm": bgm_missing, "sfx": sfx_missing}, files


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Entry point


def main():
    """Run the planner or the builder.

    Raises:
        SystemExit: When vgmstream is missing, which the build cannot proceed without.
    """
    parser = argparse.ArgumentParser(description=__doc__.split("\n", maxsplit=1)[0])
    parser.add_argument("command", choices=["plan", "build"])
    parser.add_argument("--gf-data", required=True, help="The gf-data-us checkout.")
    parser.add_argument("--site-data", default="src/data", help="Directory holding the generated story data.")
    parser.add_argument("--staging", help="Output root, whose assets/story/audio folder the files are written into.")
    parser.add_argument("--manifest", help="The committed manifest, so already published cues are skipped.")
    args = parser.parse_args()

    if not os.path.exists(VGMSTREAM):
        raise SystemExit(f"vgmstream is not at {VGMSTREAM}. Fetch it first; it is deliberately not committed.")

    res_url = []
    plan, missing, files = build_plan(args.gf_data, args.site_data, res_url)
    published = set()
    if args.manifest and os.path.exists(args.manifest):
        published = {name.lower() for name in read_json(args.manifest).get("story", {}).get("audio", [])}
    todo = [entry for entry in plan if cue_file(entry["cue"]) not in published]

    print(f"cues resolved {len(plan)}, already published {len(plan) - len(todo)}, to build {len(todo)}")
    print(f"  missing: {len(missing['bgm'])} music, {len(missing['sfx'])} effects")
    if args.command == "plan":
        for kind in ("bgm", "sfx"):
            if missing[kind]:
                print(f"  no {kind} shipped for: {', '.join(sorted(missing[kind])[:12])}")
        return

    if not args.staging:
        raise SystemExit("build needs --staging")
    out_root = os.path.join(args.staging, TREE, "story", "audio")
    done, failed = 0, []
    for index, entry in enumerate(todo, start=1):
        try:
            acb = fetch_container(files[entry["container"].lower()], res_url[0] if res_url else "", entry["container"])
        except Exception as error:
            failed.append(f"{entry['cue']}: {error}")
            continue
        bitrate = BGM_BITRATE if entry["kind"] == "bgm" else SFX_BITRATE
        if encode_cue(acb, entry["subsong"], os.path.join(out_root, f"{cue_file(entry['cue'])}.opus"), bitrate):
            done += 1
        else:
            failed.append(f"{entry['cue']}: decode or encode refused it")
        if index % 25 == 0 or index == len(todo):
            print(f"[{index}/{len(todo)}] {done} written", flush=True)
    print(f"written {done}, failed {len(failed)}")
    for line in failed[:15]:
        print(f"  {line}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
