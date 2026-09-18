"""Unit tests for `merge_indexes`, run with `python3 -m unittest discover tools/assets/tests`."""

import copy
import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import build_manifest  # noqa: E402
import merge_indexes  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fixtures

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MANIFEST_PATH = os.path.join(REPO_ROOT, "assets-manifest.json")
SPINE_INDEX_PATH = os.path.join(REPO_ROOT, "src", "data", "spine-index.json")

# Every this many doll ids, in numeric order, is taken out of the committed files and merged back.
SAMPLE_STEP = 25


def read_text(path):
    """Read a file's exact text, without newline translation.

    Args:
        path: File path.

    Returns:
        The decoded contents.
    """
    with open(path, "rb") as handle:
        return handle.read().decode("utf-8")


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

    def test_new_hoc_joins_in_numeric_order(self):
        """A partial HOC art entry joins the committed hocs dict by numeric id."""
        committed = committed_manifest()
        committed["hocs"] = {"1": ["card", "full"]}
        partial = partial_manifest()
        partial["hocs"] = {"2": ["card"]}
        merged = merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(list(merged["hocs"]), ["1", "2"])
        self.assertEqual(merged["hocs"]["2"], ["card"])

    def test_hoc_conflict_is_refused(self):
        """A HOC id the committed manifest already lists stops the merge."""
        committed = committed_manifest()
        committed["hocs"] = {"1": ["card"]}
        partial = partial_manifest()
        partial["hocs"] = {"1": ["full"]}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(caught.exception.conflicts, ["hoc 1 art"])

    def test_no_hocs_key_when_neither_side_has_one(self):
        """The merged manifest gets no `hocs` key when neither the committed nor the partial manifest has one."""
        merged = merge_indexes.merge_manifest(committed_manifest(), partial_manifest())
        self.assertNotIn("hocs", merged)

    def test_new_captured_unit_joins_in_numeric_order(self):
        """A partial captured unit's skill icon slots join the committed assimilation dict by numeric id."""
        committed = committed_manifest()
        committed["assimilation"] = {"1013": ["skill1"]}
        partial = partial_manifest()
        partial["assimilation"] = {"1022": ["skill1", "skill_advance"]}
        merged = merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(list(merged["assimilation"]), ["1013", "1022"])
        self.assertEqual(merged["assimilation"]["1022"], ["skill1", "skill_advance"])

    def test_captured_unit_conflict_is_refused(self):
        """A captured unit the committed manifest already lists stops the merge, so published icons are never replaced."""
        committed = committed_manifest()
        committed["assimilation"] = {"1013": ["skill1"]}
        partial = partial_manifest()
        partial["assimilation"] = {"1013": ["skill3"]}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(caught.exception.conflicts, ["captured unit 1013 art"])

    def test_new_fairy_joins_in_numeric_order(self):
        """A partial fairy art entry joins the committed fairies dict by numeric id."""
        committed = committed_manifest()
        committed["fairies"] = {"1": ["form1", "form2", "form3"]}
        partial = partial_manifest()
        partial["fairies"] = {"2": ["form1"]}
        merged = merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(list(merged["fairies"]), ["1", "2"])
        self.assertEqual(merged["fairies"]["2"], ["form1"])

    def test_fairy_conflict_is_refused(self):
        """A fairy id the committed manifest already lists stops the merge."""
        committed = committed_manifest()
        committed["fairies"] = {"1": ["form1"]}
        partial = partial_manifest()
        partial["fairies"] = {"1": ["form2"]}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_manifest(committed, partial)
        self.assertEqual(caught.exception.conflicts, ["fairy 1 art"])

    def test_no_fairies_key_when_neither_side_has_one(self):
        """The merged manifest gets no `fairies` key when neither the committed nor the partial manifest has one."""
        merged = merge_indexes.merge_manifest(committed_manifest(), partial_manifest())
        self.assertNotIn("fairies", merged)

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



def hoc_rig(name):
    """Build one minimal HOC rig entry.

    Args:
        name: The skeleton and atlas name.

    Returns:
        A rig dict.
    """
    return {"skel": name, "atlas": name, "anims": ["wait"]}


class HocSpineMergeTests(unittest.TestCase):
    """Adding partial HOC Spine index entries, one whole HOC id at a time."""

    def test_new_hoc_lands_in_numeric_order(self):
        """A new HOC id is inserted between existing ids by number, not by text."""
        entry = {"combat": hoc_rig("MK153"), "crew": []}
        merged = merge_indexes.merge_hoc_spine_index({"1": entry, "10": entry}, {"2": entry})
        self.assertEqual(list(merged), ["1", "2", "10"])

    def test_conflicts_are_refused(self):
        """A HOC id the committed index already has stops the merge."""
        entry = {"combat": hoc_rig("MK153"), "crew": []}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_hoc_spine_index({"1": entry}, {"1": entry})
        self.assertEqual(caught.exception.conflicts, ["hoc 1 rig"])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Live2D index


class Live2dMergeTests(unittest.TestCase):
    """Adding partial Live2D index entries: fairies and hocs by id, tdolls one level deeper, by doll, form and skin."""

    def test_merge_live2d_index_merges_tdolls_by_doll_form_and_skin(self):
        """A new skin joins an existing doll and form, and a new form or doll is added whole."""
        committed = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["normal"]}}}}
        partial = {
            "fairies": {},
            "hocs": {},
            "tdolls": {"104": {"base": {"3802": ["normal"]}, "mod": {"1202": ["normal"]}}, "65": {"base": {"805": ["normal"]}}},
        }
        merged = merge_indexes.merge_live2d_index(committed, partial)
        self.assertEqual(merged["tdolls"]["104"]["base"], {"1202": ["normal"], "3802": ["normal"]})
        self.assertEqual(merged["tdolls"]["104"]["mod"], {"1202": ["normal"]})
        self.assertEqual(merged["tdolls"]["65"], {"base": {"805": ["normal"]}})

    def test_merge_live2d_index_keeps_a_committed_tdoll_the_partial_does_not_mention(self):
        """A committed tdoll the partial says nothing about is carried through unchanged, its variants in builder (sorted) order."""
        committed = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["damaged", "normal"]}}}}
        merged = merge_indexes.merge_live2d_index(committed, {"fairies": {}, "hocs": {}, "tdolls": {}})
        self.assertEqual(merged["tdolls"], {"104": {"base": {"1202": ["damaged", "normal"]}}})

    def test_no_tdolls_key_when_neither_side_has_one(self):
        """An old committed index that predates `tdolls`, merged against a partial with nothing tdoll-related, gains no `tdolls` key."""
        merged = merge_indexes.merge_live2d_index({"fairies": {}, "hocs": {}}, {"fairies": {}, "hocs": {}})
        self.assertNotIn("tdolls", merged)

    def test_tdoll_skin_gains_a_variant_it_did_not_have_yet(self):
        """A skin that already has `normal` and later gets `damaged` extracted merges the new variant in, rather than conflicting -
        the availability merge must be exactly as fine-grained as the per-doll motion file merge, which already works this way."""
        committed = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["normal"]}}}}
        partial = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["damaged"]}}}}
        merged = merge_indexes.merge_live2d_index(committed, partial)
        self.assertEqual(merged["tdolls"]["104"]["base"]["1202"], ["damaged", "normal"])

    def test_tdoll_variant_conflict_is_refused_instead_of_overwriting(self):
        """A variant already committed to a doll, form and skin stops the merge instead of being silently re-added."""
        committed = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["normal"]}}}}
        partial = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["normal"]}}}}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_live2d_index(committed, partial)
        self.assertEqual(caught.exception.conflicts, ["live2d tdoll 104 base 1202 normal"])

    def test_tdoll_skins_sort_with_base_first_then_numeric(self):
        """A merged doll's skin keys order `base` before numeric skin ids, not as plain strings."""
        committed = {"fairies": {}, "hocs": {}, "tdolls": {}}
        partial = {"fairies": {}, "hocs": {}, "tdolls": {"104": {"base": {"1202": ["normal"], "base": ["normal"], "805": ["normal"]}}}}
        merged = merge_indexes.merge_live2d_index(committed, partial)
        self.assertEqual(list(merged["tdolls"]["104"]["base"]), ["base", "805", "1202"])


def motion_entry(name):
    """Build one minimal motion entry for the per-doll Live2D file tests.

    Args:
        name: The motion's file name stem.

    Returns:
        A `{"motions": [...]}` dict.
    """
    return {"motions": [{"name": name, "group": "idle", "model3Group": "Idle", "seconds": 1.0, "touchArea": None, "line": None}]}


class Live2dTdollFileMergeTests(unittest.TestCase):
    """Adding partial per-doll Live2D motion files, add-only, mirroring the availability merge's rules."""

    def test_merge_live2d_tdoll_file_adds_a_new_skin_and_form(self):
        """A new skin joins an existing form, and a new form is added whole."""
        committed = {"base": {"1202": {"normal": motion_entry("idle_01")}}}
        partial = {"base": {"3802": {"normal": motion_entry("idle_02")}}, "mod": {"base": {"normal": motion_entry("idle_03")}}}
        merged = merge_indexes.merge_live2d_tdoll_file(committed, partial)
        self.assertEqual(set(merged["base"]), {"1202", "3802"})
        self.assertEqual(merged["mod"]["base"]["normal"], motion_entry("idle_03"))

    def test_merge_live2d_tdoll_file_adds_a_variant_to_an_existing_skin(self):
        """A skin that already has `normal` and gains `damaged` merges the new variant in alongside the existing one, matching the
        availability merge's own granularity - the two must never disagree about what counts as a conflict."""
        committed = {"base": {"1202": {"normal": motion_entry("idle_01")}}}
        partial = {"base": {"1202": {"damaged": motion_entry("hurt_01")}}}
        merged = merge_indexes.merge_live2d_tdoll_file(committed, partial)
        self.assertEqual(merged["base"]["1202"], {"normal": motion_entry("idle_01"), "damaged": motion_entry("hurt_01")})

    def test_merge_live2d_tdoll_file_conflict_is_refused(self):
        """A form/skin/variant already committed stops the merge instead of replacing its motions."""
        committed = {"base": {"1202": {"normal": motion_entry("idle_01")}}}
        partial = {"base": {"1202": {"normal": motion_entry("idle_99")}}}
        with self.assertRaises(merge_indexes.MergeConflict) as caught:
            merge_indexes.merge_live2d_tdoll_file(committed, partial)
        self.assertEqual(caught.exception.conflicts, ["base/1202/normal"])

    def test_merge_live2d_tdoll_file_preserves_an_untouched_variant(self):
        """A committed variant the partial says nothing about survives the merge unchanged."""
        committed = {"base": {"1202": {"normal": motion_entry("idle_01"), "damaged": motion_entry("hurt_01")}}}
        merged = merge_indexes.merge_live2d_tdoll_file(committed, {"base": {"1202": {}}})
        self.assertEqual(merged["base"]["1202"], {"normal": motion_entry("idle_01"), "damaged": motion_entry("hurt_01")})

    def test_merge_live2d_tdoll_file_sorts_skins_and_variants(self):
        """A merged doll's skin keys order `base` first then numeric, and variants sort alphabetically."""
        partial = {
            "base": {
                "3802": {"normal": motion_entry("a")},
                "base": {"damaged": motion_entry("b"), "normal": motion_entry("c")},
                "1202": {"normal": motion_entry("d")},
            }
        }
        merged = merge_indexes.merge_live2d_tdoll_file({}, partial)
        self.assertEqual(list(merged["base"]), ["base", "1202", "3802"])
        self.assertEqual(list(merged["base"]["base"]), ["damaged", "normal"])

    def test_merge_live2d_tdoll_files_writes_only_touched_dolls(self):
        """Only dolls the partial directory names are merged and returned; an untouched committed doll's file is left alone."""
        with tempfile.TemporaryDirectory() as committed_dir, tempfile.TemporaryDirectory() as partial_dir:
            with open(os.path.join(committed_dir, "104.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"1202": {"normal": motion_entry("idle_01")}}}, handle)
            with open(os.path.join(partial_dir, "104.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"3802": {"normal": motion_entry("idle_02")}}}, handle)
            with open(os.path.join(partial_dir, "65.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"805": {"normal": motion_entry("idle_03")}}}, handle)
            merged = merge_indexes.merge_live2d_tdoll_files(committed_dir, partial_dir)
        self.assertEqual(set(merged), {"104", "65"})
        self.assertEqual(set(merged["104"]["base"]), {"1202", "3802"})
        self.assertEqual(merged["65"]["base"]["805"], {"normal": motion_entry("idle_03")})

    def test_merge_live2d_tdoll_files_conflict_is_refused(self):
        """A conflict in one doll's file is reported with the doll id, and does not stop other dolls' conflicts from being collected."""
        with tempfile.TemporaryDirectory() as committed_dir, tempfile.TemporaryDirectory() as partial_dir:
            with open(os.path.join(committed_dir, "104.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"1202": {"normal": motion_entry("idle_01")}}}, handle)
            with open(os.path.join(partial_dir, "104.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"1202": {"normal": motion_entry("idle_99")}}}, handle)
            with self.assertRaises(merge_indexes.MergeConflict) as caught:
                merge_indexes.merge_live2d_tdoll_files(committed_dir, partial_dir)
        self.assertEqual(caught.exception.conflicts, ["live2d tdoll 104 base/1202/normal"])

    def test_merge_live2d_tdoll_files_creates_a_file_for_a_doll_with_no_committed_file(self):
        """A doll the committed directory has no file for yet merges against an empty starting point."""
        with tempfile.TemporaryDirectory() as committed_dir, tempfile.TemporaryDirectory() as partial_dir:
            with open(os.path.join(partial_dir, "104.json"), "w", encoding="utf-8") as handle:
                json.dump({"base": {"1202": {"normal": motion_entry("idle_01")}}}, handle)
            merged = merge_indexes.merge_live2d_tdoll_files(committed_dir, partial_dir)
        self.assertEqual(merged["104"]["base"]["1202"], {"normal": motion_entry("idle_01")})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Committed files


class CommittedRoundTripTests(unittest.TestCase):
    """Taking a doll out of the real committed files and merging it back reproduces them byte for byte."""

    @classmethod
    def setUpClass(cls):
        """Read the committed manifest and Spine index once and pick the sample doll ids."""
        cls.manifest_text = read_text(MANIFEST_PATH)
        cls.spine_text = read_text(SPINE_INDEX_PATH)
        cls.manifest = json.loads(cls.manifest_text)
        cls.spine_index = json.loads(cls.spine_text)
        ids = sorted(cls.manifest["dolls"], key=int)
        cls.sample = list(dict.fromkeys(ids[::SAMPLE_STEP] + [ids[-1]]))

    def test_manifest_round_trip(self):
        """Each sampled doll merged back into a manifest without it gives the committed file text."""
        for doll_id in self.sample:
            with self.subTest(doll_id=doll_id):
                committed = copy.deepcopy(self.manifest)
                entry = committed["dolls"].pop(doll_id)
                partial = {"version": 3, "imageKinds": list(self.manifest["imageKinds"]), "equipment": [], "dolls": {doll_id: entry}}
                merged = merge_indexes.merge_manifest(committed, partial)
                self.assertEqual(build_manifest.dumps(merged), self.manifest_text)

    def test_spine_index_round_trip(self):
        """Each sampled doll merged back into a Spine index without it gives the committed file text."""
        for doll_id in self.sample:
            with self.subTest(doll_id=doll_id):
                committed = copy.deepcopy(self.spine_index)
                partial = {doll_id: committed.pop(doll_id)} if doll_id in committed else {}
                merged = merge_indexes.merge_spine_index(committed, partial)
                self.assertEqual(merge_indexes.dump_spine_index(merged), self.spine_text)


if __name__ == "__main__":
    unittest.main()
