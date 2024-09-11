#!/usr/bin/env python3
"""Back up an asset repo clone and prepare its rebuilt tree for a force-push, without pushing.

`backup` writes a `git bundle` of every ref in a clone and proves it restores. `prepare` resolves the repo's default branch straight
from origin (never from local state), requires the clone's copy of that branch to be exactly in sync with origin, regenerates the
version 3 manifest from the staging trees, requires it to match the repo-root `assets-manifest.json` byte for byte, runs the v3
audit, checks the Pages size limits, and then commits the staging tree onto an orphan branch in the clone with a `.nojekyll` file.
It prints a push command leased to the origin commit it checked, plus the publish runbook, for a person to run, and never runs
them. Pass `--replace-branch` to delete and recreate an existing local `rebuild` branch when re-running prepare; the default branch
itself is never touched.

Usage:
    python3 tools/assets/publish.py backup --clone <path> --out <dir>
    python3 tools/assets/publish.py prepare --repo assets|art --clone <path>
    python3 tools/assets/publish.py prepare --repo assets|art --clone <path> --replace-branch
"""

import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import build_manifest  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Constants

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))

BYTES_PER_MB = 1000 * 1000

# GitHub Pages caps a site at 1 GB. Decimal megabytes keep the check on the strict side.
REFUSE_TOTAL_BYTES = 1000 * BYTES_PER_MB
WARN_TOTAL_BYTES = 900 * BYTES_PER_MB

# GitHub warns above 50 MB per file and rejects above 100 MB.
MAX_FILE_BYTES = 50 * BYTES_PER_MB

# Files a Pages repo may carry that the staging tree does not produce, kept when present in the clone.
KEEP_FILES = ("CNAME", ".nojekyll")

# Written into every rebuilt tree so Pages serves the files as they are, without a Jekyll build.
NOJEKYLL = ".nojekyll"

MANIFEST_NAME = "assets-manifest.json"

BRANCH = "rebuild"

STAGING_TREES = {"assets": "tools/assets/.staging/assets", "art": "tools/assets/.staging/art"}

REPO_TITLES = {"assets": "gfl-wiki-assets", "art": "gfl-wiki-assets-art"}

REPO_CONTENTS = {
    "assets": "Cards, skill icons, equipment icons, UI images and Spine chibis",
    "art": "Full art (normal and damaged) for every doll, Mod and skin",
}


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Pure checks


def check_sizes(files):
    """Check a planned tree against the Pages size limits.

    Args:
        files: `(rel_path, size_bytes)` pairs for every file in the tree.

    Returns:
        A dict with `errors` and `warnings` lists, plus `count`, `total` and `largest` (a `(rel_path, size)` pair or None).
    """
    total = sum(size for _, size in files)
    largest = max(files, key=lambda entry: (entry[1], entry[0])) if files else None
    errors = [f"{rel} is {size / BYTES_PER_MB:.1f} MB, over the {MAX_FILE_BYTES // BYTES_PER_MB} MB file limit" for rel, size in sorted(files) if size > MAX_FILE_BYTES]
    warnings = []
    if total >= REFUSE_TOTAL_BYTES:
        errors.append(f"tree is {total / BYTES_PER_MB:.1f} MB, at or over the {REFUSE_TOTAL_BYTES // BYTES_PER_MB} MB limit")
    elif total > WARN_TOTAL_BYTES:
        warnings.append(f"tree is {total / BYTES_PER_MB:.1f} MB, over the {WARN_TOTAL_BYTES // BYTES_PER_MB} MB warning line")
    return {"errors": errors, "warnings": warnings, "count": len(files), "total": total, "largest": largest}


def compare_manifests(regenerated, committed):
    """Compare a freshly generated manifest with the committed copy.

    Args:
        regenerated: The regenerated manifest file contents.
        committed: The committed manifest file contents.

    Returns:
        None when the two are byte-identical, otherwise a message saying whether the content or only the formatting differs.
    """
    if regenerated == committed:
        return None
    try:
        same_content = json.loads(regenerated) == json.loads(committed)
    except ValueError:
        same_content = False
    if same_content:
        return "the regenerated manifest has the same content but different formatting from the committed one"
    return "the regenerated manifest differs from the committed one. Rebuild it with tools/assets/build_manifest.py and commit it first"


def branch_sync_status(clone, branch, counts):
    """Build a refusal message for a local branch that is not exactly in sync with its origin counterpart.

    Args:
        clone: The repository path, used in the message.
        branch: The branch name, used in the message.
        counts: Output of `git rev-list --left-right --count <branch>...origin/<branch>`, as "<ahead> <behind>".

    Returns:
        None when the branch matches `origin/<branch>`, otherwise a message saying whether it is behind, ahead, or diverged.
    """
    ahead, behind = (int(count) for count in counts.split())
    if ahead == 0 and behind == 0:
        return None
    if behind == 0:
        return f"{clone}'s {branch} is {ahead} commit(s) ahead of origin/{branch}"
    if ahead == 0:
        return f"{clone}'s {branch} is {behind} commit(s) behind origin/{branch}"
    return f"{clone}'s {branch} has diverged from origin/{branch} ({ahead} ahead, {behind} behind)"


def parse_symref_head(output):
    """Parse the branch name out of `git ls-remote --symref origin HEAD` output.

    Args:
        output: The command's standard output, e.g. `ref: refs/heads/main\\tHEAD\\n<sha>\\tHEAD`.

    Returns:
        The branch name, or None when no `ref: refs/heads/<name> ... HEAD` line is present.
    """
    for line in output.splitlines():
        match = re.match(r"^ref:\s+refs/heads/(\S+)\s+HEAD$", line.strip())
        if match:
            return match.group(1)
    return None


def push_command(clone, base_branch, lease_sha):
    """Build the force-push command for a prepared clone, leased to the origin commit `prepare` checked.

    Args:
        clone: The clone's path.
        base_branch: The remote's default branch.
        lease_sha: The full sha `origin/<base_branch>` pointed at when `prepare` ran.

    Returns:
        The command line. The push is refused if the remote branch has moved since.
    """
    return f"git -C {clone} push --force-with-lease={base_branch}:{lease_sha} origin {BRANCH}:{base_branch}"


def runbook_text():
    """Build the publish runbook printed after `prepare`.

    Returns:
        The runbook lines, joined with newlines.
    """
    return "\n".join(
        (
            "Publish runbook (back to back, only with explicit confirmation):",
            f"  1. Push {REPO_TITLES['assets']} with its printed command.",
            f"  2. Push {REPO_TITLES['art']} with its printed command.",
            "  3. Push the site's master immediately after, so the new site and the new asset layout go live together.",
            "  4. Wait for all three Pages deploys to finish (`gh api repos/<owner>/<repo>/pages/builds/latest` for each).",
            "  5. Run `node tools/assets/verify_live_assets.mjs <assets base URL> <art base URL>` against the live hosts.",
        )
    )


def readme_text(repo, res_version):
    """Build the README written into a rebuilt asset repo.

    Args:
        repo: Either `assets` or `art`.
        res_version: The game ResData version the tree was extracted from.

    Returns:
        The README contents.
    """
    return (
        f"# {REPO_TITLES[repo]}\n\n"
        f"{REPO_CONTENTS[repo]} for [gfl-reactjs-wiki](https://github.com/steve1316/gfl-reactjs-wiki), served over GitHub Pages.\n\n"
        f"Extracted from the Girls' Frontline game asset bundles (ResData version {res_version}) by `tools/assets/` in the wiki repository.\n\n"
        "© Sunborn/MICA Team, mirrored for fan-wiki use. These assets are **not** covered by the licence of the wiki's source code.\n"
    )


def list_tree(root, skip=()):
    """List every file under a directory with its size.

    Args:
        root: The directory to walk.
        skip: Relative paths to leave out.

    Returns:
        Sorted `(rel_path, size_bytes)` pairs, using forward slashes.
    """
    found = []
    for directory, dirs, names in os.walk(root):
        dirs[:] = [name for name in dirs if name != ".git"]
        for name in names:
            absolute = os.path.join(directory, name)
            rel = os.path.relpath(absolute, root).replace(os.sep, "/")
            if rel not in skip:
                found.append((rel, os.path.getsize(absolute)))
    return sorted(found)


def repo_name(remote_url, clone):
    """Name a repo for its backup file.

    Args:
        remote_url: The clone's `origin` URL, or an empty string.
        clone: The clone's path, used when there is no remote.

    Returns:
        The repo name without a `.git` suffix.
    """
    source = remote_url.rstrip("/") or os.path.abspath(clone)
    name = source.replace(":", "/").rsplit("/", 1)[-1]
    return name[:-4] if name.endswith(".git") else name


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Git helpers


def git(clone, *args, check=True):
    """Run a git command inside a clone.

    Args:
        clone: The repository path.
        *args: Arguments after `git -C <clone>`.
        check: Whether a non-zero exit stops the script.

    Returns:
        The command's stripped standard output.

    Raises:
        SystemExit: When `check` is true and the command fails.
    """
    result = subprocess.run(["git", "-C", clone, *args], capture_output=True, text=True)
    if check and result.returncode != 0:
        sys.exit(f"git {' '.join(args)} failed in {clone}:\n{result.stderr.strip()}")
    return result.stdout.strip()


def default_branch(clone, run=git):
    """Find the branch the remote serves by default, resolved straight from the remote.

    Never trusts local state: not the currently checked-out branch, not a possibly-stale or unset
    `refs/remotes/origin/HEAD`. Both real clones in this repo have `origin/HEAD` unset, so this always asks the remote.

    Args:
        clone: The repository path.
        run: The command runner, `run(clone, *args, check=...)` returning stdout. Defaults to `git`; tests inject a fake
            to avoid needing a real remote.

    Returns:
        The default branch name.

    Raises:
        SystemExit: When the remote's default branch cannot be resolved.
    """
    branch = parse_symref_head(run(clone, "ls-remote", "--symref", "origin", "HEAD"))
    if not branch:
        sys.exit(f"could not resolve origin's default branch for {clone} from `git ls-remote --symref origin HEAD`")
    return branch


def require_synced_with_origin(clone, branch):
    """Fetch a branch from origin and refuse to continue unless the clone matches it exactly.

    Args:
        clone: The repository path.
        branch: The local branch to check, normally the resolved default branch.

    Raises:
        SystemExit: When the fetch fails, or the local branch is behind, ahead of, or diverged from `origin/<branch>`.
    """
    git(clone, "fetch", "origin", branch)
    counts = git(clone, "rev-list", "--left-right", "--count", f"{branch}...origin/{branch}")
    problem = branch_sync_status(clone, branch, counts)
    if problem:
        sys.exit(f"{problem}. Fetch/push/pull to bring it in sync before preparing")


def ref_map(lines):
    """Parse `<sha> <ref>` lines into a dict.

    Args:
        lines: Output of `git show-ref` or `git bundle list-heads`.

    Returns:
        Map of ref name to sha.
    """
    refs = {}
    for line in lines.splitlines():
        if line.strip():
            sha, ref = line.split(None, 1)
            refs[ref.strip()] = sha
    return refs


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Backup


def backup(clone, out_dir):
    """Bundle every ref of a clone and prove the bundle restores the same HEAD and refs.

    Args:
        clone: The repository path.
        out_dir: Directory to write `<repo>-<date>.bundle` into.

    Returns:
        The bundle path.

    Raises:
        SystemExit: When the bundle already exists or fails verification.
    """
    name = repo_name(git(clone, "remote", "get-url", "origin", check=False), clone)
    bundle = os.path.join(os.path.abspath(out_dir), f"{name}-{datetime.date.today().isoformat()}.bundle")
    if os.path.exists(bundle):
        sys.exit(f"{bundle} already exists, refusing to overwrite a backup")

    git(clone, "bundle", "create", bundle, "--all")
    print(f"wrote {bundle} ({os.path.getsize(bundle) / BYTES_PER_MB:.1f} MB)")
    git(clone, "bundle", "verify", bundle)

    source_head = git(clone, "rev-parse", "HEAD")
    source_refs = ref_map(git(clone, "show-ref"))
    bundle_refs = ref_map(git(clone, "bundle", "list-heads", bundle))
    with tempfile.TemporaryDirectory(prefix="bundle-verify-") as scratch:
        restored = os.path.join(scratch, "restored")
        result = subprocess.run(["git", "clone", "--quiet", "--no-checkout", bundle, restored], capture_output=True, text=True)
        if result.returncode != 0:
            sys.exit(f"cloning the bundle failed:\n{result.stderr.strip()}")
        restored_head = git(restored, "rev-parse", "HEAD")
        git(restored, "fsck", "--connectivity-only")

    problems = [f"{ref} is {sha} in the clone but {bundle_refs.get(ref)} in the bundle" for ref, sha in sorted(source_refs.items()) if bundle_refs.get(ref) != sha]
    if restored_head != source_head:
        problems.append(f"restored HEAD {restored_head} does not match the clone's HEAD {source_head}")
    if problems:
        sys.exit("bundle verification failed:\n  " + "\n  ".join(problems))
    print(f"verified: restored HEAD {restored_head} matches the clone, all {len(source_refs)} refs match, connectivity ok")
    return bundle


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Prepare


def resolve_res_version(explicit):
    """Find the ResData version the staging trees were extracted from.

    Args:
        explicit: A version passed on the command line, or None.

    Returns:
        The version string.

    Raises:
        SystemExit: When no source records it.
    """
    if explicit:
        return explicit
    inventory = os.path.join(TOOLS_DIR, ".cache", "inventory.json")
    if os.path.isfile(inventory):
        with open(inventory, encoding="utf-8") as handle:
            version = json.load(handle).get("resVersion")
        if version:
            return str(version)
    sys.exit("no ResData version found in tools/assets/.cache/inventory.json. Pass --res-version")


def verify_staging(assets_root, art_root, manifest_path, spine_index_path):
    """Regenerate the manifest, require it to match the committed copy, and run the v3 audit.

    Args:
        assets_root: The asset staging tree.
        art_root: The art staging tree.
        manifest_path: The committed repo-root manifest.
        spine_index_path: The Spine index the site bundles.

    Returns:
        The regenerated manifest file contents.

    Raises:
        SystemExit: When the manifests differ or the audit fails.
    """
    regenerated = build_manifest.dumps(build_manifest.build_v3(assets_root, art_root))
    with open(manifest_path, encoding="utf-8") as handle:
        committed = handle.read()
    difference = compare_manifests(regenerated, committed)
    if difference:
        sys.exit(difference)
    print(f"manifest: regenerated from the staging trees, byte-identical to {manifest_path} ({len(regenerated)} bytes)")

    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as handle:
        handle.write(regenerated)
        regenerated_path = handle.name
    try:
        command = ["node", os.path.join(TOOLS_DIR, "audit_assets.mjs"), "--assets", assets_root, "--art", art_root]
        command += ["--manifest", regenerated_path, "--spine-index", spine_index_path]
        result = subprocess.run(command, capture_output=True, text=True)
    finally:
        os.unlink(regenerated_path)
    print("audit:\n" + "\n".join(f"  {line}" if line else "" for line in result.stdout.strip().splitlines()))
    if result.returncode != 0:
        sys.exit(f"the v3 audit failed with exit code {result.returncode}. {result.stderr.strip()}")
    return regenerated


def print_stats(label, stats):
    """Print a size summary.

    Args:
        label: What the numbers describe.
        stats: The dict from `check_sizes`.
    """
    largest = stats["largest"]
    summary = f"{label}: {stats['count']} files, {stats['total'] / BYTES_PER_MB:.1f} MB"
    if largest:
        summary += f", largest {largest[0]} ({largest[1] / BYTES_PER_MB:.2f} MB)"
    print(summary)


def prepare(repo, clone, assets_root, art_root, manifest_path, spine_index_path, res_version, replace_branch):
    """Commit a verified staging tree onto an orphan branch in a clone and print the push command.

    Args:
        repo: Either `assets` or `art`.
        clone: The local clone of that repo.
        assets_root: The asset staging tree.
        art_root: The art staging tree.
        manifest_path: The committed repo-root manifest.
        spine_index_path: The Spine index the site bundles.
        res_version: The ResData version, for the commit message and README.
        replace_branch: Whether an existing `rebuild` branch may be deleted first.

    Raises:
        SystemExit: When any check fails: a dirty tree, a clone whose default branch is not exactly in sync with origin, an
            existing `rebuild` branch without `--replace-branch`, a manifest mismatch, an audit failure, or a size-limit
            breach. Nothing in the clone changes before every check has passed.
    """
    clone = os.path.abspath(clone)
    staging = assets_root if repo == "assets" else art_root
    if git(clone, "status", "--porcelain"):
        sys.exit(f"{clone} has uncommitted changes")
    base_branch = default_branch(clone)
    if base_branch == BRANCH:
        sys.exit(f"{clone} is on {BRANCH}. Check out the default branch first")
    require_synced_with_origin(clone, base_branch)
    lease_sha = git(clone, "rev-parse", "--verify", f"refs/remotes/origin/{base_branch}")
    if git(clone, "rev-parse", "--verify", "--quiet", f"refs/heads/{BRANCH}", check=False) and not replace_branch:
        sys.exit(f"{clone} already has a {BRANCH} branch. Pass --replace-branch to rebuild it")

    regenerated = verify_staging(assets_root, art_root, manifest_path, spine_index_path)

    kept = {}
    for name in KEEP_FILES:
        if os.path.isfile(os.path.join(clone, name)):
            with open(os.path.join(clone, name), "rb") as handle:
                kept[name] = handle.read()
    kept.setdefault(NOJEKYLL, b"")
    readme = readme_text(repo, res_version)
    planned = list_tree(staging, skip={MANIFEST_NAME})
    planned += [(name, len(data)) for name, data in kept.items()] + [("README.md", len(readme.encode("utf-8")))]
    if repo == "assets":
        planned.append((MANIFEST_NAME, len(regenerated.encode("utf-8"))))
    stats = check_sizes(planned)
    print_stats("planned tree", stats)
    for warning in stats["warnings"]:
        print(f"WARNING: {warning}")
    if stats["errors"]:
        sys.exit("refusing to prepare:\n  " + "\n  ".join(stats["errors"]))

    git(clone, "checkout", "--quiet", base_branch)
    if replace_branch:
        git(clone, "branch", "-D", BRANCH, check=False)
    git(clone, "checkout", "--quiet", "--orphan", BRANCH)
    git(clone, "rm", "-r", "-f", "--quiet", "--ignore-unmatch", ".")
    git(clone, "clean", "-f", "-d", "-x", "--quiet")

    for directory, _, names in os.walk(staging):
        rel_dir = os.path.relpath(directory, staging)
        os.makedirs(os.path.join(clone, rel_dir), exist_ok=True)
        for name in names:
            if rel_dir == "." and name == MANIFEST_NAME:
                continue
            shutil.copyfile(os.path.join(directory, name), os.path.join(clone, rel_dir, name))
    for name, data in kept.items():
        with open(os.path.join(clone, name), "wb") as handle:
            handle.write(data)
    with open(os.path.join(clone, "README.md"), "w", encoding="utf-8") as handle:
        handle.write(readme)
    if repo == "assets":
        with open(os.path.join(clone, MANIFEST_NAME), "w", encoding="utf-8") as handle:
            handle.write(regenerated)

    git(clone, "add", "--all")
    git(clone, "commit", "--quiet", "-m", f"Rebuild assets from game data ({res_version})")

    committed = []
    for line in filter(None, git(clone, "ls-tree", "-r", "-l", "-z", "HEAD").split("\0")):
        meta, rel = line.split("\t", 1)
        committed.append((rel, int(meta.split()[3])))
    final = check_sizes(committed)
    if final["errors"]:
        sys.exit("the committed tree breaks the size limits:\n  " + "\n  ".join(final["errors"]))
    if sorted(committed) != sorted(planned):
        sys.exit("the committed tree does not match the planned tree")

    print(f"\ncommitted {git(clone, 'rev-parse', '--short', 'HEAD')} on orphan branch {BRANCH} in {clone}")
    print_stats("committed tree", final)
    for warning in final["warnings"]:
        print(f"WARNING: {warning}")
    print(f"\nNot pushed. origin/{base_branch} was {lease_sha} when checked. To publish, run:")
    print(f"  {push_command(clone, base_branch, lease_sha)}")
    print(f"\n{runbook_text()}")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Entry point


def main():
    """Parse arguments and run `backup` or `prepare`."""
    parser = argparse.ArgumentParser(description="Back up and prepare the GitHub Pages asset repos. Never pushes.")
    commands = parser.add_subparsers(dest="command", required=True)

    backup_parser = commands.add_parser("backup", help="Bundle every ref of a clone and verify the bundle.")
    backup_parser.add_argument("--clone", required=True, help="Local clone of the asset repo.")
    backup_parser.add_argument("--out", required=True, help="Directory to write the bundle into.")

    prepare_parser = commands.add_parser("prepare", help="Commit the verified staging tree onto an orphan branch.")
    prepare_parser.add_argument("--repo", required=True, choices=("assets", "art"), help="Which asset repo the clone is.")
    prepare_parser.add_argument("--clone", required=True, help="Local clone of that repo.")
    prepare_parser.add_argument("--assets", default=STAGING_TREES["assets"], help="The asset staging tree.")
    prepare_parser.add_argument("--art", default=STAGING_TREES["art"], help="The art staging tree.")
    prepare_parser.add_argument("--manifest", default=MANIFEST_NAME, help="The committed repo-root manifest the regenerated one must match.")
    prepare_parser.add_argument("--spine-index", default="src/data/spine-index.json", help="The Spine index the audit checks.")
    prepare_parser.add_argument("--res-version", help="ResData version. Defaults to the one in tools/assets/.cache/inventory.json.")
    prepare_parser.add_argument("--replace-branch", action="store_true", help="Delete an existing rebuild branch first.")
    args = parser.parse_args()

    if args.command == "backup":
        if not os.path.isdir(args.out):
            sys.exit(f"no such directory: {args.out}")
        backup(args.clone, args.out)
        return

    for tree in (args.assets, args.art):
        if not os.path.isdir(tree):
            sys.exit(f"no such staging tree: {tree}")
    prepare(args.repo, args.clone, args.assets, args.art, args.manifest, args.spine_index, resolve_res_version(args.res_version), args.replace_branch)


if __name__ == "__main__":
    main()
