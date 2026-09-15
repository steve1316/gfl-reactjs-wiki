"""Unit tests for the v3 Spine index and v3 asset manifest builders, run with `python3 -m unittest discover tools/assets/tests`.

Each test builds a tiny staging tree of empty files in a temporary directory.
"""

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import build_manifest  # noqa: E402
import build_spine_index  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Helpers


def touch(root, *paths):
    """Create empty files under a root, making folders as needed.

    Args:
        root: The root directory.
        *paths: Relative file paths.
    """
    for rel in paths:
        path = os.path.join(root, rel)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "wb").close()


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Spine index v3


class SpineIndexV3Tests(unittest.TestCase):
    """The skin-id keyed Spine index."""

    def test_rig_folder_pairs_combat_and_dorm(self):
        """The dorm rig is the R-prefixed twin, and each rig uses its own atlas when it has one."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "HK416.skel", "HK416.atlas", "HK416.png", "RHK416.skel", "RHK416.atlas", "RHK416.png")
            self.assertEqual(
                build_spine_index.index_rig_dir(root, ""),
                {"combat": {"skel": "HK416", "atlas": "HK416", "anims": []}, "dorm": {"skel": "RHK416", "atlas": "RHK416", "anims": []}},
            )

    def test_dorm_rig_shares_the_combat_atlas(self):
        """A dorm rig with no atlas of its own points at the combat atlas."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "92typeMod.skel", "92typeMod.atlas", "92typeMod.png", "R92typeMod.skel")
            pair = build_spine_index.index_rig_dir(root, "mod/")
            self.assertEqual(pair["dorm"], {"skel": "mod/R92typeMod", "atlas": "mod/92typeMod", "anims": []})
            self.assertEqual(pair["combat"]["atlas"], "mod/92typeMod")

    def test_code_starting_with_r_is_not_a_dorm_rig(self):
        """`RO635` is a combat rig, `RRO635` its dorm twin, and a lone `RFB` is a combat rig."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "a/RO635.skel", "a/RO635.atlas", "a/RRO635.skel", "b/RFB.skel", "b/RFB.atlas")
            self.assertEqual(build_spine_index.index_rig_dir(os.path.join(root, "a"), "")["dorm"]["skel"], "RRO635")
            self.assertEqual(build_spine_index.index_rig_dir(os.path.join(root, "b"), ""), {"combat": {"skel": "RFB", "atlas": "RFB", "anims": []}})

    def test_atlas_match_ignores_case(self):
        """A skeleton pairs with an atlas that differs only by case."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "kord.skel", "Kord.atlas")
            self.assertEqual(build_spine_index.index_rig_dir(root, "")["combat"]["atlas"], "Kord")

    def test_folder_without_rig(self):
        """A folder with no skeleton, or no atlas for its combat rig, yields nothing."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "a/X.png", "b/X.skel")
            self.assertIsNone(build_spine_index.index_rig_dir(os.path.join(root, "a"), ""))
            self.assertIsNone(build_spine_index.index_rig_dir(os.path.join(root, "b"), ""))

    def test_whole_tree(self):
        """Base, Mod and skin rigs land under one doll entry with paths relative to `spine/<id>/`."""
        with tempfile.TemporaryDirectory() as root:
            touch(
                root,
                "65/HK416.skel",
                "65/HK416.atlas",
                "65/RHK416.skel",
                "65/mod/HK416Mod.skel",
                "65/mod/HK416Mod.atlas",
                "65/skins/805/HK416_805.skel",
                "65/skins/805/HK416_805.atlas",
                "65/skins/805/RHK416_805.skel",
                "65/skins/30033/HK416_30033.skel",
                "65/skins/30033/HK416_30033.atlas",
                "65/skins/legacy-old/HK416_old.skel",
                "65/skins/legacy-old/HK416_old.atlas",
                "65/skins/stray/HK416_x.skel",
                "65/skins/stray/HK416_x.atlas",
                "7/A.skel",
                "7/A.atlas",
                "notes.txt",
            )
            index = build_spine_index.build_v3(root)
        self.assertEqual(list(index), ["7", "65"])
        entry = index["65"]
        self.assertEqual(entry["dorm"], {"skel": "RHK416", "atlas": "HK416", "anims": []})
        self.assertEqual(entry["mod"], {"combat": {"skel": "mod/HK416Mod", "atlas": "mod/HK416Mod", "anims": []}})
        self.assertEqual(list(entry["skins"]), ["805", "30033", "legacy-old"])
        self.assertEqual(entry["skins"]["legacy-old"]["combat"], {"skel": "skins/legacy-old/HK416_old", "atlas": "skins/legacy-old/HK416_old", "anims": []})
        self.assertEqual(entry["skins"]["805"]["dorm"], {"skel": "skins/805/RHK416_805", "atlas": "skins/805/HK416_805", "anims": []})
        self.assertNotIn("dorm", entry["skins"]["30033"])
        self.assertNotIn("mod", index["7"])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Manifest v3


class ManifestV3Tests(unittest.TestCase):
    """The skin-id keyed asset manifest."""

    def test_manifest_shape(self):
        """Cards and full art come from the one tree, Mod-skin cards become `modImages`, skills and equipment ids are listed."""
        with tempfile.TemporaryDirectory() as tmp:
            assets = os.path.join(tmp, "assets")
            touch(
                assets,
                "tdolls/65/card.webp",
                "tdolls/65/card_d.webp",
                "tdolls/65/full.webp",
                "tdolls/65/full_d.webp",
                "tdolls/65/skill1.png",
                "tdolls/65/skill2.png",
                "tdolls/65/mod/card.webp",
                "tdolls/65/mod/full.webp",
                "tdolls/65/skins/805/card.webp",
                "tdolls/65/skins/805/card_d.webp",
                "tdolls/65/skins/805/full.webp",
                "tdolls/65/skins/805/mod_card.webp",
                "tdolls/65/skins/805/mod_card_d.webp",
                "tdolls/65/skins/30033/card.webp",
                "tdolls/65/skins/legacy-b/card.webp",
                "tdolls/65/skins/legacy-a/card.webp",
                "tdolls/65/skins/legacy-a/full.webp",
                "tdolls/65/skins/notes/card.webp",
                "tdolls/100/card.webp",
                "tdolls/9/full.webp",
                "equipment/120.png",
                "equipment/3.png",
                "equipment/readme.txt",
                "spine/65/HK416.skel",
            )
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["version"], 3)
        self.assertEqual(manifest["imageKinds"], ["card", "card_damaged", "full", "full_damaged"])
        self.assertEqual(manifest["equipment"], [3, 120])
        self.assertEqual(list(manifest["dolls"]), ["9", "65", "100"])
        self.assertEqual(
            manifest["dolls"]["65"],
            {
                "normal": {"images": ["card", "card_damaged", "full", "full_damaged"]},
                "mod": {"images": ["card", "full"]},
                "skins": {
                    "805": {"images": ["card", "card_damaged", "full"], "modImages": ["card", "card_damaged"]},
                    "30033": {"images": ["card"]},
                    "legacy-a": {"images": ["card", "full"]},
                    "legacy-b": {"images": ["card"]},
                },
                "skills": ["skill1", "skill2"],
            },
        )
        self.assertEqual(list(manifest["dolls"]["65"]["skins"]), ["805", "30033", "legacy-a", "legacy-b"])
        self.assertEqual(manifest["dolls"]["9"], {"normal": {"images": ["full"]}, "skills": []})

    def test_full_art_is_read_from_the_assets_tree(self):
        """A doll's full art next to its card lists both kinds."""
        with tempfile.TemporaryDirectory() as scratch:
            assets = os.path.join(scratch, "assets")
            for name in ("card.webp", "full.webp"):
                touch(assets, os.path.join("tdolls", "7", name))
            self.assertEqual(build_manifest.build_v3(assets)["dolls"]["7"]["normal"], {"images": ["card", "full"]})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# HOC Spine index and manifest art


class HocIndexTests(unittest.TestCase):
    """HOC rigs index as one combat rig plus crew rigs, and HOC art lands in the manifest."""

    def test_combat_and_crew_with_shared_and_own_atlases(self):
        with tempfile.TemporaryDirectory() as root:
            touch(root, "7/MK153.skel", "7/MK153.atlas", "7/MK153.png", "7/RMK153A.skel", "7/RMK153B.skel", "7/RMK153B.atlas", "7/RMK153B.png")
            index = build_spine_index.build_hoc_index(root)
        self.assertEqual(index, {"7": {
            "combat": {"skel": "MK153", "atlas": "MK153", "anims": []},
            "crew": [{"skel": "RMK153A", "atlas": "MK153", "anims": []}, {"skel": "RMK153B", "atlas": "RMK153B", "anims": []}],
        }})

    def test_crew_named_with_a_space(self):
        with tempfile.TemporaryDirectory() as root:
            touch(root, "6/QLZ04.skel", "6/QLZ04.atlas", "6/QLZ04 A.skel")
            self.assertEqual(build_spine_index.build_hoc_index(root)["6"]["crew"], [{"skel": "QLZ04 A", "atlas": "QLZ04", "anims": []}])

    def test_no_combat_atlas_skips_the_hoc(self):
        """A folder whose only atlas belongs to no skeleton has no combat rig, so the HOC is skipped."""
        with tempfile.TemporaryDirectory() as root:
            touch(root, "5/TOW.skel", "5/OTHER.atlas")
            self.assertEqual(build_spine_index.build_hoc_index(root), {})

    def test_missing_folder_yields_an_empty_index(self):
        with tempfile.TemporaryDirectory() as root:
            self.assertEqual(build_spine_index.build_hoc_index(os.path.join(root, "absent")), {})

    def test_manifest_lists_hoc_kinds(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "hocs/1/card.webp", "hocs/2/card.webp", "hocs/1/full.webp")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["hocs"], {"1": ["card", "full"], "2": ["card"]})

    def test_manifest_has_no_hocs_when_the_folder_is_absent(self):
        with tempfile.TemporaryDirectory() as assets:
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["hocs"], {})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fairy manifest art


class FairyIndexTests(unittest.TestCase):
    """Fairy art lands in the manifest. Fairies have no Spine rigs, only the three forms in the asset tree."""

    def test_manifest_lists_fairy_forms(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "fairies/1/form1.webp", "fairies/1/form2.webp", "fairies/2/form1.webp")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["fairies"], {"1": ["form1", "form2"], "2": ["form1"]})

    def test_manifest_has_no_fairies_when_the_folder_is_absent(self):
        with tempfile.TemporaryDirectory() as assets:
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["fairies"], {})


if __name__ == "__main__":
    unittest.main()
