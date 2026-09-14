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


def make_fixture(root):
    """Build a tiny pair of staging trees, their manifest, a Spine index, and a clone of the old repo.

    Args:
        root: Temporary directory to build in.

    Returns:
        A dict of the paths the tests pass to `prepare`.
    """
    assets, art, clone = (os.path.join(root, name) for name in ("assets", "art", "clone"))
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

    os.makedirs(clone)
    run_git(clone, "init", "--quiet", "--initial-branch", "main")
    write(clone, "old/110_card.png", b"old")
    write(clone, "CNAME", b"assets.example.com\n")
    write(clone, ".nojekyll", b"")
    run_git(clone, "add", "--all")
    run_git(clone, "commit", "--quiet", "-m", "Old layout")
    return {"assets_root": assets, "art_root": art, "manifest_path": manifest, "spine_index_path": spine_index, "clone": clone}


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
        args = dict(self.paths, repo=repo, res_version="2026082516", replace_branch=False)
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


@mock.patch.dict(os.environ, GIT_IDENTITY)
class BackupTests(unittest.TestCase):
    """The verified bundle backup."""

    def test_bundle_restores_every_ref(self):
        """The bundle restores HEAD and every ref, and an existing bundle is never overwritten."""
        with tempfile.TemporaryDirectory() as tmp:
            clone = make_fixture(tmp)["clone"]
            run_git(clone, "branch", "side")
            bundle, output = quiet(publish.backup, clone, tmp)
            self.assertTrue(os.path.basename(bundle).startswith("clone-"))
            self.assertIn("all 2 refs match", output)
            with self.assertRaises(SystemExit):
                quiet(publish.backup, clone, tmp)


if __name__ == "__main__":
    unittest.main()
