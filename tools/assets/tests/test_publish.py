"""Unit tests for `publish.py`, run with `python3 -m unittest discover tools/assets/tests`.

The size and manifest checks are tested directly. `prepare` and `backup` run against throwaway git repos in a temporary directory, with
no remote and no network.
"""

import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import build_manifest  # noqa: E402
import publish  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Helpers

MB = publish.BYTES_PER_MB

GIT_IDENTITY = {"GIT_AUTHOR_NAME": "test", "GIT_AUTHOR_EMAIL": "test@example.com", "GIT_COMMITTER_NAME": "test", "GIT_COMMITTER_EMAIL": "test@example.com"}


def write(root, rel, data=b"x"):
    """Write one file under a root, making folders as needed.

    Args:
        root: The root directory.
        rel: Relative file path.
        data: File contents as bytes.
    """
    path = os.path.join(root, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(data)


def run_git(repo, *args):
    """Run a git command in a test repo.

    Args:
        repo: The repository path.
        *args: Arguments after `git -C <repo>`.

    Returns:
        The stripped standard output.
    """
    return subprocess.run(["git", "-C", repo, *args], check=True, capture_output=True, text=True).stdout.strip()


def git_verify(repo, ref):
    """Check whether a ref exists in a test repo.

    Args:
        repo: The repository path.
        ref: The ref to check, e.g. "refs/heads/rebuild".

    Returns:
        True when the ref exists.
    """
    return subprocess.run(["git", "-C", repo, "rev-parse", "--verify", "--quiet", ref], capture_output=True).returncode == 0


def make_fixture(root):
    """Build a tiny pair of staging trees, their manifest, a Spine index, and a clone tracking a local origin.

    The clone is built with `remote add` + `fetch`, the same way the real asset-repo clones came to be, rather than
    `git clone` -- that leaves `refs/remotes/origin/HEAD` unset locally, reproducing the exact condition
    `default_branch` must not depend on and that `prepare` must still resolve and sync-check correctly.

    Args:
        root: Temporary directory to build in.

    Returns:
        A dict of the paths the tests pass to `prepare`, plus `origin`.
    """
    assets, art, origin, clone = (os.path.join(root, name) for name in ("assets", "art", "origin", "clone"))
    write(assets, "tdolls/1/card.webp")
    write(assets, "tdolls/1/card_d.webp")
    write(assets, "tdolls/1/skill1.png")
    write(assets, "spine/1/A.skel")
    write(assets, "spine/1/A.atlas", b"\nA.png\nsize: 2,2\n")
    write(assets, "spine/1/A.png")
    write(assets, "equipment/5.png")
    write(assets, "logo.png")
    write(assets, "assets-manifest.json", b"stale copy that must not be published")
    write(art, "tdolls/1/full.webp", b"full")
    write(art, "tdolls/1/full_d.webp", b"full_d")

    manifest = os.path.join(root, "assets-manifest.json")
    with open(manifest, "w", encoding="utf-8") as handle:
        handle.write(build_manifest.dumps(build_manifest.build_v3(assets, art)))
    spine_index = os.path.join(root, "spine-index.json")
    with open(spine_index, "w", encoding="utf-8") as handle:
        json.dump({"1": {"combat": {"skel": "A", "atlas": "A", "anims": ["wait"]}}}, handle)

    os.makedirs(origin)
    run_git(origin, "init", "--quiet", "--initial-branch", "main")
    write(origin, "old/110_card.png", b"old")
    write(origin, "CNAME", b"assets.example.com\n")
    write(origin, ".nojekyll", b"")
    run_git(origin, "add", "--all")
    run_git(origin, "commit", "--quiet", "-m", "Old layout")

    os.makedirs(clone)
    run_git(clone, "init", "--quiet", "--initial-branch", "main")
    run_git(clone, "remote", "add", "origin", origin)
    run_git(clone, "fetch", "--quiet", "origin")
    run_git(clone, "checkout", "--quiet", "-b", "main", "origin/main")
    return {"assets_root": assets, "art_root": art, "manifest_path": manifest, "spine_index_path": spine_index, "clone": clone, "origin": origin}


def quiet(function, *args, **kwargs):
    """Call a function with its standard output swallowed.

    Args:
        function: The function to call.
        *args: Positional arguments.
        **kwargs: Keyword arguments.

    Returns:
        A `(result, output)` pair.
    """
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        result = function(*args, **kwargs)
    return result, buffer.getvalue()


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Pure checks


class CheckSizesTests(unittest.TestCase):
    """The Pages size limits."""

    def test_small_tree_passes_with_stats(self):
        """A small tree passes and reports count, total and largest file."""
        stats = publish.check_sizes([("a.png", 10), ("b/c.webp", 30), ("d.png", 20)])
        self.assertEqual(stats["errors"], [])
        self.assertEqual(stats["warnings"], [])
        self.assertEqual((stats["count"], stats["total"], stats["largest"]), (3, 60, ("b/c.webp", 30)))

    def test_total_over_900_mb_warns(self):
        """A tree just over 900 MB warns without failing."""
        stats = publish.check_sizes([(f"f{i}", 45 * MB) for i in range(20)] + [("one-more-byte", 1)])
        self.assertEqual(stats["errors"], [])
        self.assertEqual(len(stats["warnings"]), 1)

    def test_total_at_1000_mb_is_refused(self):
        """A tree of exactly 1,000 MB is refused."""
        stats = publish.check_sizes([(f"f{i}", 40 * MB) for i in range(25)])
        self.assertEqual(stats["warnings"], [])
        self.assertEqual(len(stats["errors"]), 1)
        self.assertIn("1000 MB", stats["errors"][0])

    def test_file_over_50_mb_is_refused(self):
        """A file of 50 MB passes and one byte more is refused."""
        stats = publish.check_sizes([("ok.png", 50 * MB), ("big.png", 50 * MB + 1)])
        self.assertEqual(len(stats["errors"]), 1)
        self.assertIn("big.png", stats["errors"][0])

    def test_empty_tree(self):
        """An empty tree has no largest file."""
        self.assertIsNone(publish.check_sizes([])["largest"])


class CompareManifestsTests(unittest.TestCase):
    """The byte-identity check between the regenerated and committed manifests."""

    def test_identical_bytes(self):
        """Byte-identical manifests pass."""
        text = build_manifest.dumps({"version": 3, "dolls": {}})
        self.assertIsNone(publish.compare_manifests(text, text))

    def test_formatting_only_difference_still_fails(self):
        """The same content with different formatting is still a failure."""
        manifest = {"version": 3, "dolls": {}}
        message = publish.compare_manifests(build_manifest.dumps(manifest), build_manifest.dumps(manifest, indent=2))
        self.assertIn("formatting", message)

    def test_content_difference_fails(self):
        """Different content fails."""
        message = publish.compare_manifests(build_manifest.dumps({"equipment": [1]}), build_manifest.dumps({"equipment": [1, 2]}))
        self.assertIn("differs", message)

    def test_unparsable_committed_copy_fails(self):
        """A committed copy that is not JSON fails."""
        self.assertIn("differs", publish.compare_manifests("{}\n", "not json"))


class NamingTests(unittest.TestCase):
    """Backup file names and the README."""

    def test_repo_name_from_remote_or_folder(self):
        """The name comes from the remote URL, or the folder when there is no remote."""
        self.assertEqual(publish.repo_name("https://github.com/o/gfl-wiki-assets.git", "/x/clone"), "gfl-wiki-assets")
        self.assertEqual(publish.repo_name("git@github.com:o/gfl-wiki-assets-art.git", "/x/clone"), "gfl-wiki-assets-art")
        self.assertEqual(publish.repo_name("", "/x/assets-probe"), "assets-probe")

    def test_readme_names_source_and_rights(self):
        """The README names the repo, the ResData version and the rights holder."""
        text = publish.readme_text("art", "2026082516")
        self.assertIn("gfl-wiki-assets-art", text)
        self.assertIn("2026082516", text)
        self.assertIn("© Sunborn/MICA Team, mirrored for fan-wiki use", text)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Git round trips


@mock.patch.dict(os.environ, GIT_IDENTITY)
class PrepareTests(unittest.TestCase):
    """The orphan-branch commit in a clone."""

    def setUp(self):
        """Build the fixture in a temporary directory."""
        self.tmp = tempfile.TemporaryDirectory()
        self.paths = make_fixture(self.tmp.name)

    def tearDown(self):
        """Remove the fixture."""
        self.tmp.cleanup()

    def prepare(self, repo, **overrides):
        """Run `prepare` on the fixture with its output swallowed.

        Args:
            repo: Either `assets` or `art`.
            **overrides: Arguments to replace.

        Returns:
            The captured output.
        """
        args = {key: value for key, value in self.paths.items() if key != "origin"}
        args.update(repo=repo, res_version="2026082516", replace_branch=False)
        args.update(overrides)
        return quiet(publish.prepare, **args)[1]

    def test_assets_repo_gets_orphan_commit_with_kept_files_and_fresh_manifest(self):
        """The asset repo gets one parentless commit with CNAME, .nojekyll, a README and the committed manifest, and the old files are gone."""
        output = self.prepare("assets")
        clone = self.paths["clone"]
        self.assertEqual(run_git(clone, "rev-parse", "--abbrev-ref", "HEAD"), "rebuild")
        self.assertEqual(run_git(clone, "rev-list", "--count", "HEAD"), "1")
        self.assertEqual(run_git(clone, "log", "-1", "--format=%s"), "Rebuild assets from game data (2026082516)")
        files = set(run_git(clone, "ls-tree", "-r", "--name-only", "HEAD").splitlines())
        self.assertNotIn("old/110_card.png", files)
        self.assertTrue({"CNAME", ".nojekyll", "README.md", "assets-manifest.json", "spine/1/A.png", "logo.png"} <= files)
        with open(self.paths["manifest_path"], encoding="utf-8") as handle:
            self.assertEqual(run_git(clone, "show", "HEAD:assets-manifest.json") + "\n", handle.read())
        self.assertEqual(run_git(clone, "show", "HEAD:CNAME"), "assets.example.com")
        self.assertIn("git -C", output)
        self.assertIn("push --force origin rebuild:main", output)
        self.assertEqual(run_git(clone, "status", "--porcelain"), "")

    def test_nojekyll_is_written_when_the_clone_has_none(self):
        """A clone without `.nojekyll` still gets an empty one, so Pages skips its Jekyll build."""
        run_git(self.paths["origin"], "rm", "--quiet", ".nojekyll")
        run_git(self.paths["origin"], "commit", "--quiet", "-m", "Drop nojekyll")
        run_git(self.paths["clone"], "pull", "--quiet", "--ff-only", "origin", "main")
        self.prepare("art")
        files = set(run_git(self.paths["clone"], "ls-tree", "-r", "--name-only", "HEAD").splitlines())
        self.assertIn(".nojekyll", files)
        self.assertEqual(run_git(self.paths["clone"], "cat-file", "-s", "HEAD:.nojekyll"), "0")

    def test_art_repo_holds_only_art(self):
        """The art repo holds only the art tree plus the kept files and README."""
        self.prepare("art")
        files = set(run_git(self.paths["clone"], "ls-tree", "-r", "--name-only", "HEAD").splitlines())
        self.assertEqual(files, {"CNAME", ".nojekyll", "README.md", "tdolls/1/full.webp", "tdolls/1/full_d.webp"})

    def test_manifest_mismatch_stops_before_touching_the_clone(self):
        """A staging tree that no longer matches the committed manifest stops before any git change."""
        write(self.paths["art_root"], "tdolls/2/full.webp")
        with self.assertRaises(SystemExit) as caught:
            self.prepare("assets")
        self.assertIn("differs", str(caught.exception.code))
        self.assertEqual(run_git(self.paths["clone"], "rev-parse", "--abbrev-ref", "HEAD"), "main")

    def test_audit_failure_stops_before_touching_the_clone(self):
        """A missing atlas page fails the audit before any git change."""
        os.remove(os.path.join(self.paths["assets_root"], "spine/1/A.png"))
        with self.assertRaises(SystemExit) as caught:
            self.prepare("assets")
        self.assertIn("audit failed", str(caught.exception.code))
        self.assertEqual(run_git(self.paths["clone"], "rev-parse", "--abbrev-ref", "HEAD"), "main")

    def test_existing_rebuild_branch_needs_replace_flag(self):
        """An existing rebuild branch is only replaced when asked."""
        self.prepare("art")
        run_git(self.paths["clone"], "checkout", "--quiet", "main")
        with self.assertRaises(SystemExit):
            self.prepare("art")
        self.prepare("art", replace_branch=True)
        self.assertEqual(run_git(self.paths["clone"], "rev-list", "--count", "rebuild"), "1")

    def test_clone_behind_origin_stops_before_touching_the_clone(self):
        """When origin has moved on and the clone has not, prepare refuses before any git change."""
        origin = self.paths["origin"]
        write(origin, "extra.txt", b"new upstream commit")
        run_git(origin, "add", "--all")
        run_git(origin, "commit", "--quiet", "-m", "Upstream moves on")
        with self.assertRaises(SystemExit) as caught:
            self.prepare("assets")
        self.assertIn("behind", str(caught.exception.code))
        self.assertEqual(run_git(self.paths["clone"], "rev-parse", "--abbrev-ref", "HEAD"), "main")
        self.assertFalse(git_verify(self.paths["clone"], f"refs/heads/{publish.BRANCH}"))

    def test_clone_ahead_of_origin_stops_before_touching_the_clone(self):
        """A clone with a local commit origin has never seen refuses before any git change."""
        write(self.paths["clone"], "local-only.txt", b"oops")
        run_git(self.paths["clone"], "add", "--all")
        run_git(self.paths["clone"], "commit", "--quiet", "-m", "Local-only commit")
        with self.assertRaises(SystemExit) as caught:
            self.prepare("assets")
        self.assertIn("ahead", str(caught.exception.code))
        self.assertEqual(run_git(self.paths["clone"], "rev-parse", "--abbrev-ref", "HEAD"), "main")
        self.assertFalse(git_verify(self.paths["clone"], f"refs/heads/{publish.BRANCH}"))

    def test_size_limit_stops_before_touching_the_clone(self):
        """A planned tree over the size limit refuses before any git change, like the manifest and audit stops."""
        with mock.patch.object(publish, "REFUSE_TOTAL_BYTES", 10):
            with self.assertRaises(SystemExit) as caught:
                self.prepare("assets")
        self.assertIn("MB", str(caught.exception.code))
        self.assertEqual(run_git(self.paths["clone"], "rev-parse", "--abbrev-ref", "HEAD"), "main")
        self.assertFalse(git_verify(self.paths["clone"], f"refs/heads/{publish.BRANCH}"))


class ParseSymrefHeadTests(unittest.TestCase):
    """The pure `git ls-remote --symref origin HEAD` parser."""

    def test_parses_the_default_branch(self):
        """A normal ls-remote --symref response yields the branch name."""
        output = "ref: refs/heads/main\tHEAD\n036ddf31e2c3ac827c2360ebb4bc3fd0c3b41811\tHEAD\n"
        self.assertEqual(publish.parse_symref_head(output), "main")

    def test_parses_a_non_main_default_branch(self):
        """A repo defaulting to a differently named branch is read correctly."""
        self.assertEqual(publish.parse_symref_head("ref: refs/heads/develop\tHEAD\nabc123\tHEAD\n"), "develop")

    def test_no_symref_line_returns_none(self):
        """Output without a `ref:` line for HEAD (e.g. a detached HEAD on the remote) yields None."""
        self.assertIsNone(publish.parse_symref_head("036ddf31e2c3ac827c2360ebb4bc3fd0c3b41811\tHEAD\n"))

    def test_empty_output_returns_none(self):
        """No output at all yields None."""
        self.assertIsNone(publish.parse_symref_head(""))


class DefaultBranchTests(unittest.TestCase):
    """`default_branch` resolves from the remote through an injected command runner, never from local state."""

    def test_resolves_from_ls_remote_symref(self):
        """The branch comes from `ls-remote --symref origin HEAD`, run through the injected runner."""
        calls = []

        def fake_run(clone, *args, **kwargs):
            calls.append((clone, args))
            return "ref: refs/heads/main\tHEAD\n036ddf3\tHEAD\n"

        self.assertEqual(publish.default_branch("/some/clone", run=fake_run), "main")
        self.assertEqual(calls, [("/some/clone", ("ls-remote", "--symref", "origin", "HEAD"))])

    def test_unresolvable_default_branch_exits(self):
        """When the remote gives no symref for HEAD, default_branch fails loudly instead of guessing from local state."""
        with self.assertRaises(SystemExit) as caught:
            publish.default_branch("/some/clone", run=lambda *a, **k: "")
        self.assertIn("could not resolve", str(caught.exception.code))


class BranchSyncStatusTests(unittest.TestCase):
    """The ahead/behind/diverged comparison against origin, from injected `rev-list --left-right --count` output."""

    def test_even_is_none(self):
        """Matching counts mean no problem."""
        self.assertIsNone(publish.branch_sync_status("/c", "main", "0\t0"))

    def test_behind(self):
        """Zero ahead, some behind: the local branch is behind."""
        message = publish.branch_sync_status("/c", "main", "0\t3")
        self.assertIn("behind", message)
        self.assertIn("3", message)

    def test_ahead(self):
        """Some ahead, zero behind: the local branch is ahead."""
        message = publish.branch_sync_status("/c", "main", "2\t0")
        self.assertIn("ahead", message)
        self.assertIn("2", message)

    def test_diverged(self):
        """Both ahead and behind: the branches have diverged."""
        message = publish.branch_sync_status("/c", "main", "2\t3")
        self.assertIn("diverged", message)
        self.assertIn("2 ahead", message)
        self.assertIn("3 behind", message)

    def test_message_names_the_clone_and_branch(self):
        """The message names the clone path and branch so the refusal is actionable."""
        message = publish.branch_sync_status("/x/clone", "main", "0\t1")
        self.assertIn("/x/clone", message)
        self.assertIn("main", message)


@mock.patch.dict(os.environ, GIT_IDENTITY)
class BackupTests(unittest.TestCase):
    """The verified bundle backup."""

    def test_bundle_restores_every_ref(self):
        """The bundle restores HEAD and every ref, and an existing bundle is never overwritten."""
        with tempfile.TemporaryDirectory() as tmp:
            clone = make_fixture(tmp)["clone"]
            run_git(clone, "branch", "side")
            bundle, output = quiet(publish.backup, clone, tmp)
            self.assertTrue(os.path.basename(bundle).startswith("origin-"))
            self.assertIn("all 3 refs match", output)
            with self.assertRaises(SystemExit):
                quiet(publish.backup, clone, tmp)


if __name__ == "__main__":
    unittest.main()
