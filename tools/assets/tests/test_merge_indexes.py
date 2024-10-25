"""Unit tests for `merge_indexes`, run with `python3 -m unittest discover tools/assets/tests`."""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import build_manifest  # noqa: E402
import merge_indexes  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fixtures


def committed_manifest():
    """Build a small committed manifest in builder key order.

    Returns:
        A manifest dict.
    """
    return {
        "version": 3,
        "imageKinds": ["card", "card_damaged", "full", "full_damaged"],
        "equipment": [1, 5],
        "dolls": {
            "65": {
                "normal": {"images": ["card", "full"]},
                "skins": {"805": {"images": ["card"]}, "legacy-x": {"images": ["card"]}},
                "skills": ["skill1"],
            },
            "100": {"normal": {"images": ["card"]}, "skills": ["skill1"]},
        },
    }


def partial_manifest(dolls=None, equipment=None):
    """Build a partial manifest as `build_manifest.py` writes it for an `add` staging folder.

    Args:
        dolls: The partial `dolls` dict.
        equipment: The partial equipment ids.

    Returns:
        A manifest dict.
    """
    return {
        "version": 3,
        "imageKinds": ["card", "card_damaged", "full", "full_damaged"],
        "equipment": equipment or [],
        "dolls": dolls or {},
    }


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Manifest


class ManifestMergeTests(unittest.TestCase):
    """Adding partial manifest entries."""

    def test_empty_partial_reproduces_the_committed_bytes(self):
        """Merging nothing writes exactly what was committed."""
        committed = committed_manifest()
        merged = merge_indexes.merge_manifest(committed, partial_manifest())
        self.assertEqual(build_manifest.dumps(merged), build_manifest.dumps(committed))

    def test_new_doll_lands_in_numeric_order(self):
        """A new doll is inserted between existing ids by number, not by text."""
        partial = partial_manifest({"70": {"normal": {"images": ["card"]}, "skills": ["skill1"]}})
        merged = merge_indexes.merge_manifest(committed_manifest(), partial)
        self.assertEqual(list(merged["dolls"]), ["65", "70", "100"])

    def test_new_skin_joins_an_existing_doll(self):
        """A new skin is added in skin order, and the partial's empty base form and skills change nothing."""
        partial = partial_manifest(
            {"65": {"normal": {"images": []}, "skins": {"9001": {"images": ["card", "full"]}}, "skills": []}}
        )
        entry = merge_indexes.merge_manifest(committed_manifest(), partial)["dolls"]["65"]
        self.assertEqual(list(entry["skins"]), ["805", "9001", "legacy-x"])
        self.assertEqual(entry["normal"], {"images": ["card", "full"]})
        self.assertEqual(entry["skills"], ["skill1"])

    def test_new_mod_keeps_builder_key_order(self):
        """A Mod added to an existing doll sits after `normal`, and its skill 2 icon joins in `SKILL_KINDS` order."""
        partial = partial_manifest({"100": {"normal": {"images": []}, "mod": {"images": ["card"]}, "skills": ["skill2"]}})
        entry = merge_indexes.merge_manifest(committed_manifest(), partial)["dolls"]["100"]
        self.assertEqual(list(entry), ["normal", "mod", "skills"])
        self.assertEqual(entry["skills"], ["skill1", "skill2"])

    def test_equipment_union_is_sorted(self):
        """New equipment ids join the list in numeric order."""
        merged = merge_indexes.merge_manifest(committed_manifest(), partial_manifest(equipment=[3, 10]))
        self.assertEqual(merged["equipment"], [1, 3, 5, 10])

    def test_conflicts_are_refused(self):
        """Anything the committed manifest already lists stops the merge, with every conflict named."""
        partial = partial_manifest(
            {
                "65": {
                    "normal": {"images": ["card"]},
                    "skins": {"805": {"images": ["card"]}},
                    "skills": ["skill1"],
                }
            },
            equipment=[5],
        )
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_manifest(committed_manifest(), partial)
        self.assertEqual(caught.exception.conflicts, ["equipment 5", "doll 65 base art", "doll 65 skin 805", "doll 65 skill1 icon"])

    def test_committed_input_is_not_changed(self):
        """The merge works on a copy."""
        committed = committed_manifest()
        merge_indexes.merge_manifest(committed, partial_manifest({"70": {"normal": {"images": ["card"]}, "skills": []}}))
        self.assertEqual(committed, committed_manifest())


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Spine index


def rig(name):
    """Build one rig entry.

    Args:
        name: The skeleton and atlas name.

    Returns:
        A rig dict.
    """
    return {"skel": name, "atlas": name, "anims": ["wait"]}


class SpineMergeTests(unittest.TestCase):
    """Adding partial Spine index entries."""

    def committed(self):
        """Build a small committed index.

        Returns:
            A Spine index dict.
        """
        return {
            "65": {
                "combat": rig("HK416"),
                "dorm": rig("RHK416"),
                "skins": {"805": {"combat": rig("skins/805/HK416_805")}},
            },
            "100": {"combat": rig("Grizzly")},
        }

    def test_empty_partial_reproduces_the_committed_bytes(self):
        """Merging nothing writes exactly what was committed, in the compact format."""
        committed = self.committed()
        merged = merge_indexes.merge_spine_index(committed, {})
        self.assertEqual(
            merge_indexes.dump_spine_index(merged),
            json.dumps(committed, separators=(",", ":"), ensure_ascii=False) + "\n",
        )

    def test_new_doll_mod_and_skin(self):
        """A new doll is inserted by number, a Mod rig lands before skins, and a new skin joins in skin order."""
        partial = {
            "70": {"combat": rig("New")},
            "65": {"mod": {"combat": rig("mod/HK416Mod")}, "skins": {"9001": {"combat": rig("skins/9001/HK416_9001")}}},
        }
        merged = merge_indexes.merge_spine_index(self.committed(), partial)
        self.assertEqual(list(merged), ["65", "70", "100"])
        self.assertEqual(list(merged["65"]), ["combat", "dorm", "mod", "skins"])
        self.assertEqual(list(merged["65"]["skins"]), ["805", "9001"])

    def test_conflicts_are_refused(self):
        """A rig the committed index already has stops the merge."""
        partial = {"100": {"combat": rig("Grizzly")}, "65": {"skins": {"805": {"combat": rig("x")}}}}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_spine_index(self.committed(), partial)
        self.assertEqual(caught.exception.conflicts, ["doll 100 rig", "doll 65 skin 805 rig"])


if __name__ == "__main__":
    unittest.main()
