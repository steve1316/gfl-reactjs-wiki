"""Unit tests for the `add` path of `extract_game_assets`, run with `python3 -m unittest discover tools/assets/tests`.

No test reads a bundle, the legacy snapshot or the network.
"""

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import extract_game_assets as extract  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fixtures

SITE_DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures", "site")

EMPTY_INVENTORY = {"resVersion": "test", "onlyMissing": True, "items": [], "summary": {"unresolved_expected": []}}


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Guards


class AddGuardTests(unittest.TestCase):
    """`add` refuses inputs that would extract everything or overwrite a staging tree."""

    def test_fresh_folder_and_filtered_inventory_pass(self):
        """A missing or empty staging folder with an only-missing inventory has no problems."""
        with tempfile.TemporaryDirectory() as scratch:
            self.assertEqual(extract.require_add_inputs(EMPTY_INVENTORY, os.path.join(scratch, "new")), [])
            self.assertEqual(extract.require_add_inputs(EMPTY_INVENTORY, scratch), [])

    def test_unfiltered_inventory_is_refused(self):
        """An inventory written without `--only-missing` is refused."""
        with tempfile.TemporaryDirectory() as scratch:
            problems = extract.require_add_inputs({**EMPTY_INVENTORY, "onlyMissing": False}, scratch)
        self.assertEqual(len(problems), 1)
        self.assertIn("--only-missing", problems[0])

    def test_non_empty_staging_is_refused(self):
        """A staging folder that already holds anything is refused."""
        with tempfile.TemporaryDirectory() as scratch:
            open(os.path.join(scratch, "leftover.txt"), "w").close()
            problems = extract.require_add_inputs(EMPTY_INVENTORY, scratch)
        self.assertEqual(len(problems), 1)
        self.assertIn("not empty", problems[0])

    def test_full_rebuild_staging_is_refused(self):
        """The full rebuild's staging folder is refused even when empty."""
        problems = extract.require_add_inputs(EMPTY_INVENTORY, extract.STAGING_DIR)
        self.assertTrue(any("full rebuild" in problem for problem in problems))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Extraction without the legacy snapshot


class LegacyFreeExtractionTests(unittest.TestCase):
    """`run_extraction` runs with no legacy snapshot, no UI images and no workers for empty lists."""

    def test_empty_inventory_writes_empty_trees(self):
        """An empty inventory produces both trees, no UI files and no failures."""
        with tempfile.TemporaryDirectory() as scratch:
            staging = os.path.join(scratch, "staging")
            report = extract.run_extraction(EMPTY_INVENTORY, None, [], SITE_DATA, os.path.join(scratch, "bundles"), staging, 1)
            self.assertTrue(os.path.isdir(os.path.join(staging, "assets")))
            self.assertTrue(os.path.isdir(os.path.join(staging, "art")))
            self.assertEqual(report["tiers"]["ui"]["files"], 0)
            self.assertEqual(extract.failure_reasons(report), [])

    def test_legacy_skill_icons_without_snapshot_are_missing(self):
        """A legacy skill icon cannot be converted without the snapshot, so it is reported rather than silently skipped."""
        item = {
            "key": "skill_icon:doll:1005:skill1",
            "tier": "skill_icon",
            "source": "legacy",
            "status": "legacy",
            "assets": {},
            "missing": [],
            "users": [[1005, "skill1"]],
        }
        inventory = {**EMPTY_INVENTORY, "items": [item]}
        with tempfile.TemporaryDirectory() as scratch:
            report = extract.run_extraction(inventory, None, [], SITE_DATA, os.path.join(scratch, "bundles"), os.path.join(scratch, "staging"), 1)
        self.assertEqual([row["key"] for row in report["unexpected_missing"]], ["skill_icon:doll:1005:skill1"])

    def test_hoc_items_are_routed_to_the_hoc_workers(self):
        """HOC art goes through `run_extraction` and HOC rigs through `run_spine`, so a missing bundle is reported under their keys."""
        base = {"hoc_id": 7, "code": "X", "status": "resolved", "missing": []}
        art = {**base, "key": "hoc_art:7", "tier": "hoc_art", "bundles": ["resource_squads"], "assets": {"bgl": {"bundle": "resource_squads", "path": "X_BGL.jpg"}}}
        rig = {**base, "key": "hoc_spine:7", "tier": "hoc_spine", "crew": 0, "bundles": ["character_x_spine"], "assets": {"skel": {"bundle": "character_x_spine", "path": "X.skel.bytes"}}}
        inventory = {**EMPTY_INVENTORY, "items": [art, rig]}
        self.assertEqual(extract.require_add_inputs(inventory, os.path.join(tempfile.gettempdir(), "hoc-add-never-created")), [])
        with tempfile.TemporaryDirectory() as scratch:
            cache, staging = os.path.join(scratch, "bundles"), os.path.join(scratch, "staging")
            report = extract.run_extraction(inventory, None, [], SITE_DATA, cache, staging, 1)
            spine_report = extract.run_spine(inventory, cache, staging, 1)
        self.assertEqual([row["key"] for row in report["unexpected_missing"]], ["hoc_art:7"])
        self.assertEqual([row["key"] for row in spine_report["unexpected_missing"]], ["hoc_spine:7"])


if __name__ == "__main__":
    unittest.main()
