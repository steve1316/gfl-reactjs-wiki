"""Unit tests for the v3 Spine index and v3 asset manifest builders, run with `python3 -m unittest discover tools/assets/tests`.

Each test builds a tiny staging tree of empty files in a temporary directory.
"""

import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import build_live2d_index  # noqa: E402
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


def write_motion3(root, rel, duration):
    """Write a tiny motion3.json file with just the `Meta.Duration` `build_live2d_index` reads.

    Args:
        root: The root directory.
        rel: Relative file path.
        duration: The `Meta.Duration` value.
    """
    path = os.path.join(root, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump({"Meta": {"Duration": duration}}, handle)


def motion_row(row_id, motion_type, motion_name, touch_area="0"):
    """Build one `fairy_live2d_motions_info.json` row, with the fields `build_live2d_index` reads.

    Args:
        row_id: The row's `id`.
        motion_type: The row's `type`: `"1"` idle, `"2"` wait, `"3"` touch.
        motion_name: The row's `motion_name`, such as `motions/daiji_idle.mtn`.
        touch_area: The row's `touch_area`: `"head"`, `"body"` or `"0"`.

    Returns:
        A row dict.
    """
    return {"id": row_id, "type": motion_type, "motion_name": motion_name, "touch_area": touch_area}


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


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Protocol Assimilation skill icons


class AssimilationManifestTests(unittest.TestCase):
    """A captured unit's skill icons are recorded per unit, keyed by the unit's own id rather than any enemy id."""

    def test_manifest_lists_the_slots_a_unit_has_an_icon_for(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "assimilation/1013/skill1.png", "assimilation/1013/skill_advance.png", "assimilation/1001/skill1.png")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["assimilation"], {"1001": ["skill1"], "1013": ["skill1", "skill_advance"]})

    def test_manifest_keeps_the_page_order_rather_than_the_file_order(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "assimilation/1013/skill_advance.png", "assimilation/1013/skill2.png", "assimilation/1013/skill1.png")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["assimilation"], {"1013": ["skill1", "skill2", "skill_advance"]})

    def test_manifest_has_no_units_when_the_folder_is_absent(self):
        with tempfile.TemporaryDirectory() as assets:
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["assimilation"], {})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Faction emblems


class FactionManifestTests(unittest.TestCase):
    """Each faction ships a full emblem and a bare mark, and only the emblem names the manifest lists."""

    def test_manifest_lists_one_slug_per_faction(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "factions/kcco.webp", "factions/kcco-mark.webp", "factions/sangvis-ferri.webp", "factions/sangvis-ferri-mark.webp")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["factions"], ["kcco", "sangvis-ferri"])

    def test_manifest_ignores_anything_that_is_not_a_webp(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "factions/paradeus.webp", "factions/readme.txt")
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["factions"], ["paradeus"])

    def test_manifest_has_no_factions_when_the_folder_is_absent(self):
        with tempfile.TemporaryDirectory() as assets:
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["factions"], [])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Live2D manifest models


class Live2dIndexTests(unittest.TestCase):
    """Live2D fairy forms, HOC models and T-Doll skin variants land in the manifest's `live2d` block."""

    def test_manifest_lists_live2d_kinds(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(
                assets,
                "live2d/fairies/1/texture.webp",
                "live2d/fairies/1/form1.moc3",
                "live2d/fairies/1/form1.model3.json",
                "live2d/fairies/1/form2.moc3",
                "live2d/fairies/1/form2.model3.json",
                "live2d/fairies/1/form3.moc3",
                "live2d/fairies/1/form3.model3.json",
                "live2d/hocs/5/model.moc3",
                "live2d/hocs/5/model.model3.json",
                "live2d/hocs/5/texture0.webp",
            )
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["live2d"], {"fairies": {"1": ["form1", "form2", "form3"]}, "hocs": {"5": ["model"]}, "tdolls": {}})

    def test_a_fairy_missing_one_forms_moc3_lists_only_the_forms_it_has(self):
        with tempfile.TemporaryDirectory() as assets:
            touch(
                assets,
                "live2d/fairies/1/texture.webp",
                "live2d/fairies/1/form1.moc3",
                "live2d/fairies/1/form1.model3.json",
                "live2d/fairies/1/form2.moc3",
                "live2d/fairies/1/form2.model3.json",
                "live2d/fairies/1/form3.model3.json",
            )
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["live2d"]["fairies"], {"1": ["form1", "form2"]})

    def test_manifest_has_no_live2d_kinds_when_the_folder_is_absent(self):
        with tempfile.TemporaryDirectory() as assets:
            manifest = build_manifest.build_v3(assets)
        self.assertEqual(manifest["live2d"], {"fairies": {}, "hocs": {}, "tdolls": {}})

    def test_build_live2d_scans_the_tdolls_tree(self):
        """A skin variant counts once both its moc3 and model3.json exist, keyed by doll id, form and skin key."""
        with tempfile.TemporaryDirectory() as assets:
            touch(
                assets,
                "live2d/tdolls/104/base/1202/normal/model.moc3",
                "live2d/tdolls/104/base/1202/normal/model.model3.json",
                "live2d/tdolls/104/base/1202/damaged/model.moc3",
                "live2d/tdolls/104/base/1202/damaged/model.model3.json",
                "live2d/tdolls/104/mod/base/normal/model.moc3",
                "live2d/tdolls/104/mod/base/normal/model.model3.json",
            )
            block = build_manifest.build_live2d(assets)
        self.assertEqual(block["tdolls"], {"104": {"base": {"1202": ["damaged", "normal"]}, "mod": {"base": ["normal"]}}})

    def test_build_live2d_skips_stray_files_at_the_form_and_skin_level(self):
        """A stray file sitting where a form or skin folder is expected is skipped instead of crashing the scan."""
        with tempfile.TemporaryDirectory() as assets:
            touch(
                assets,
                "live2d/tdolls/104/.DS_Store",
                "live2d/tdolls/104/base/.DS_Store",
                "live2d/tdolls/104/base/1202/normal/model.moc3",
                "live2d/tdolls/104/base/1202/normal/model.model3.json",
            )
            block = build_manifest.build_live2d(assets)
        self.assertEqual(block["tdolls"], {"104": {"base": {"1202": ["normal"]}}})

    def test_build_live2d_skips_a_variant_with_no_model(self):
        """A variant folder with only a texture and no moc3/model3.json is not counted as present."""
        with tempfile.TemporaryDirectory() as assets:
            touch(assets, "live2d/tdolls/104/base/1202/normal/texture0.webp")
            self.assertEqual(build_manifest.build_live2d(assets)["tdolls"], {})


class MotionGroupsTests(unittest.TestCase):
    """Flattening `fairy_live2d_motions_info.json` rows into a stem-keyed classification lookup."""

    def test_type_1_row_maps_to_idle(self):
        rows = [motion_row("101", "1", "motions/daiji_idle.mtn")]
        self.assertEqual(build_live2d_index.motion_groups(rows), {"daiji_idle": {"group": "idle", "touchArea": None}})

    def test_type_2_row_maps_to_wait(self):
        rows = [motion_row("102", "2", "motions/wait_01.mtn")]
        self.assertEqual(build_live2d_index.motion_groups(rows), {"wait_01": {"group": "wait", "touchArea": None}})

    def test_type_3_row_with_head_touch_area_maps_to_touch_head(self):
        rows = [motion_row("104", "3", "motions/motou_01.mtn", touch_area="head")]
        self.assertEqual(build_live2d_index.motion_groups(rows), {"motou_01": {"group": "touch", "touchArea": "head"}})

    def test_type_3_row_with_body_touch_area_maps_to_touch_body(self):
        rows = [motion_row("106", "3", "motions/motou_03.mtn", touch_area="body")]
        self.assertEqual(build_live2d_index.motion_groups(rows), {"motou_03": {"group": "touch", "touchArea": "body"}})

    def test_duplicate_stem_keeps_the_first_rows_classification(self):
        """The table is not scoped per fairy, so a later row for a stem the table already classified is ignored."""
        rows = [motion_row("102", "2", "motions/wait_01.mtn"), motion_row("132", "3", "motions/wait_01.mtn", touch_area="head")]
        self.assertEqual(build_live2d_index.motion_groups(rows), {"wait_01": {"group": "wait", "touchArea": None}})


class ResolveMotionTests(unittest.TestCase):
    """Classifying one real motion file's stem, with the documented fallbacks."""

    def test_stem_with_a_direct_row_uses_it(self):
        groups = build_live2d_index.motion_groups([motion_row("101", "1", "motions/daiji_idle.mtn")])
        self.assertEqual(build_live2d_index.resolve_motion("daiji_idle", groups), {"group": "idle", "touchArea": None})

    def test_stem_with_no_row_falls_back_to_a_prefix_match(self):
        """`daiji_idle_01` has no row of its own here, so it resolves through the `daiji_idle` row."""
        groups = build_live2d_index.motion_groups([motion_row("101", "1", "motions/daiji_idle.mtn")])
        self.assertEqual(build_live2d_index.resolve_motion("daiji_idle_01", groups), {"group": "idle", "touchArea": None})

    def test_unknown_stem_falls_back_to_wait(self):
        self.assertEqual(build_live2d_index.resolve_motion("wait_09", {}), {"group": "wait", "touchArea": None})

    def test_unknown_daiji_idle_stem_falls_back_to_idle(self):
        self.assertEqual(build_live2d_index.resolve_motion("daiji_idle_99", {}), {"group": "idle", "touchArea": None})


class BuildLive2dIndexTests(unittest.TestCase):
    """Walking a Live2D staging tree into the documented index shape."""

    def test_build_index_shape(self):
        with tempfile.TemporaryDirectory() as root:
            write_motion3(root, "live2d/fairies/1/motions/daiji_idle.motion3.json", 3.5)
            write_motion3(root, "live2d/fairies/1/motions/wait_01.motion3.json", 2.333)
            write_motion3(root, "live2d/hocs/5/motions/daiji_idle_01.motion3.json", 1.2)
            rows = [motion_row("101", "1", "motions/daiji_idle.mtn"), motion_row("102", "2", "motions/wait_01.mtn")]
            index = build_live2d_index.build_index(root, rows)
        self.assertEqual(
            index,
            {
                "fairies": {
                    "1": {
                        "motions": [
                            {"name": "daiji_idle", "group": "idle", "model3Group": "Idle", "seconds": 3.5, "touchArea": None},
                            {"name": "wait_01", "group": "wait", "model3Group": "wait_01", "seconds": 2.33, "touchArea": None},
                        ]
                    }
                },
                "hocs": {
                    "5": {"motions": [{"name": "daiji_idle_01", "group": "idle", "model3Group": "Idle", "seconds": 1.2, "touchArea": None}]}
                },
                "tdolls": {},
            },
        )

    def test_model3_group_matches_the_extractors_rule_even_when_the_table_disagrees(self):
        """A stem the table misclassifies as `wait` still gets the extractor's own `Idle` model3 group when it is `daiji_idle`-prefixed."""
        with tempfile.TemporaryDirectory() as root:
            write_motion3(root, "live2d/fairies/1/motions/daiji_idle_01.motion3.json", 3.5)
            rows = [motion_row("101", "2", "motions/daiji_idle_01.mtn")]
            index = build_live2d_index.build_index(root, rows)
        motion = index["fairies"]["1"]["motions"][0]
        self.assertEqual(motion["group"], "wait")
        self.assertEqual(motion["model3Group"], "Idle")

    def test_id_with_no_motions_folder_is_skipped(self):
        with tempfile.TemporaryDirectory() as root:
            touch(root, "live2d/fairies/1/texture.webp")
            index = build_live2d_index.build_index(root, [])
        self.assertEqual(index, {"fairies": {}, "hocs": {}, "tdolls": {}})

    def test_missing_fairies_and_hocs_folders_yield_an_empty_index(self):
        with tempfile.TemporaryDirectory() as root:
            index = build_live2d_index.build_index(root, [])
        self.assertEqual(index, {"fairies": {}, "hocs": {}, "tdolls": {}})

    def test_build_index_tdolls_block_is_availability_only(self):
        """The top-level index's `tdolls` block lists only variant names, with no motions, matching what `build_manifest` scans."""
        with tempfile.TemporaryDirectory() as root:
            touch(
                root,
                "live2d/tdolls/104/base/1202/normal/model.moc3",
                "live2d/tdolls/104/base/1202/normal/model.model3.json",
                "live2d/tdolls/104/base/1202/damaged/model.moc3",
                "live2d/tdolls/104/base/1202/damaged/model.model3.json",
            )
            index = build_live2d_index.build_index(root, [])
            manifest_block = build_manifest.build_live2d(root)["tdolls"]
        self.assertEqual(index["tdolls"], {"104": {"base": {"1202": ["damaged", "normal"]}}})
        self.assertEqual(index["tdolls"], manifest_block)


def test_skin_motion_rows_classify_by_type_and_hurt_flag():
    rows = [
        {"id": 1, "type": 101, "motion_name": "motions/daiji_idle_01.mtn", "touch_area": "0", "hold_time": "0", "is_hurt": 0, "text": ""},
        {"id": 2, "type": 200, "motion_name": "motions/touch_1.mtn", "touch_area": "head", "hold_time": "0", "is_hurt": 0, "text": "GUN|G36C|DIALOGUE1"},
        {"id": 3, "type": 402, "motion_name": "motions/broken.mtn", "touch_area": "head", "hold_time": "0", "is_hurt": 1, "text": "GUN|G36C|BREAK"},
    ]
    lines = {"G36C|DIALOGUE1": "Commander, is there something bothering you?"}
    normal = build_live2d_index.skin_motion_lookup(rows, [1, 2, 3], "normal", lines)
    damaged = build_live2d_index.skin_motion_lookup(rows, [1, 2, 3], "damaged", lines)

    assert normal["daiji_idle_01"]["group"] == "idle"
    assert normal["touch_1"] == {"group": "touch", "touchArea": "head", "line": "Commander, is there something bothering you?"}
    # is_hurt rows belong to the damaged variant only, so the normal lookup must not carry them.
    assert "broken" not in normal
    # type 402 is the damaged model's touch reaction, same family as 200 on the normal model.
    assert damaged["broken"] == {"group": "touch", "touchArea": "head", "line": None}
    assert "touch_1" not in damaged


def test_skin_motion_lookup_matches_stems_case_insensitively():
    rows = [{"id": 1, "type": 102, "motion_name": "motions/daiji01_SHOWCACE.mtn", "touch_area": "0", "hold_time": "12,30", "is_hurt": 0, "text": ""}]
    lookup = build_live2d_index.skin_motion_lookup(rows, [1], "normal", {})
    assert lookup["daiji01_showcace"]["group"] == "wait"


def test_skin_touch_area_normalizes_a_numbered_area_to_its_base():
    rows = [
        {"id": 1, "type": 200, "motion_name": "motions/touch_body2.mtn", "touch_area": "body2", "hold_time": "0", "is_hurt": 0, "text": ""},
        {"id": 2, "type": 402, "motion_name": "motions/touch_leg2.mtn", "touch_area": "leg2", "hold_time": "0", "is_hurt": 1, "text": ""},
        {"id": 3, "type": 402, "motion_name": "motions/touch_head2.mtn", "touch_area": "head2", "hold_time": "0", "is_hurt": 1, "text": ""},
    ]
    normal = build_live2d_index.skin_motion_lookup(rows, [1, 2, 3], "normal", {})
    damaged = build_live2d_index.skin_motion_lookup(rows, [1, 2, 3], "damaged", {})
    assert normal["touch_body2"]["touchArea"] == "body"
    assert damaged["touch_leg2"]["touchArea"] == "leg"
    assert damaged["touch_head2"]["touchArea"] == "head"


def test_skin_touch_area_stays_unmapped_for_a_genuinely_unknown_area():
    rows = [{"id": 1, "type": 402, "motion_name": "motions/touch_arm.mtn", "touch_area": "arm2", "hold_time": "0", "is_hurt": 1, "text": ""}]
    damaged = build_live2d_index.skin_motion_lookup(rows, [1], "damaged", {})
    assert damaged["touch_arm"]["touchArea"] is None


def test_dialogue_lines_drop_the_gun_prefix():
    lines = build_live2d_index.dialogue_lines(["G36C|DIALOGUE1|Hello there", "G36C|ATTACK|Advance"])
    assert lines["G36C|DIALOGUE1"] == "Hello there"
    assert build_live2d_index.dialogue_for("GUN|G36C|DIALOGUE1", lines) == "Hello there"
    assert build_live2d_index.dialogue_for("", lines) is None
    assert build_live2d_index.dialogue_for("GUN|G36C|NOPE", lines) is None


def test_index_tdolls_walks_doll_form_skin_and_variant(tmp_path):
    variant_dir = tmp_path / "live2d" / "tdolls" / "104" / "base" / "1202" / "normal"
    motions_dir = variant_dir / "motions"
    motions_dir.mkdir(parents=True)
    (motions_dir / "touch_1.motion3.json").write_text(json.dumps({"Meta": {"Duration": 2.345}}))
    (variant_dir / "model.moc3").write_bytes(b"")
    (variant_dir / "model.model3.json").write_text("{}")
    table = [{"code": "G36C_1202", "fit_gun": 104, "skin": 1202, "motions": "2"}]
    rows = [{"id": 2, "type": 200, "motion_name": "motions/touch_1.mtn", "touch_area": "body", "hold_time": "0", "is_hurt": 0, "text": "GUN|G36C|DIALOGUE1"}]
    index = build_live2d_index.index_tdolls(str(tmp_path / "live2d" / "tdolls"), table, rows, {"G36C|DIALOGUE1": "Hi"})
    motion = index["104"]["base"]["1202"]["normal"]["motions"][0]
    assert motion == {"name": "touch_1", "group": "touch", "model3Group": "touch_1", "seconds": 2.35, "touchArea": "body", "line": "Hi"}


def test_index_tdolls_skips_a_variant_missing_its_model3(tmp_path):
    """A variant whose model3.json write failed is not indexed, even though its motions folder exists - matching
    `build_manifest.scan_live2d_tdolls`'s presence rule, so the manifest and the index never disagree about what is playable."""
    variant_dir = tmp_path / "live2d" / "tdolls" / "104" / "base" / "1202" / "normal"
    motions_dir = variant_dir / "motions"
    motions_dir.mkdir(parents=True)
    (motions_dir / "touch_1.motion3.json").write_text(json.dumps({"Meta": {"Duration": 2.345}}))
    (variant_dir / "model.moc3").write_bytes(b"")
    # model.model3.json deliberately missing.
    table = [{"code": "G36C_1202", "fit_gun": 104, "skin": 1202, "motions": "2"}]
    rows = [{"id": 2, "type": 200, "motion_name": "motions/touch_1.mtn", "touch_area": "body", "hold_time": "0", "is_hurt": 0, "text": "GUN|G36C|DIALOGUE1"}]
    index = build_live2d_index.index_tdolls(str(tmp_path / "live2d" / "tdolls"), table, rows, {"G36C|DIALOGUE1": "Hi"})
    assert index == {}


def test_index_tdolls_skips_stray_files_at_the_form_and_skin_level(tmp_path):
    """A stray file sitting where a form or skin folder is expected is skipped instead of crashing the walk."""
    tdolls_root = tmp_path / "live2d" / "tdolls"
    variant_dir = tdolls_root / "104" / "base" / "1202" / "normal"
    motions_dir = variant_dir / "motions"
    motions_dir.mkdir(parents=True)
    (motions_dir / "touch_1.motion3.json").write_text(json.dumps({"Meta": {"Duration": 2.345}}))
    (variant_dir / "model.moc3").write_bytes(b"")
    (variant_dir / "model.model3.json").write_text("{}")
    (tdolls_root / "104" / ".DS_Store").write_text("")
    (tdolls_root / "104" / "base" / ".DS_Store").write_text("")
    table = [{"code": "G36C_1202", "fit_gun": 104, "skin": 1202, "motions": "2"}]
    rows = [{"id": 2, "type": 200, "motion_name": "motions/touch_1.mtn", "touch_area": "body", "hold_time": "0", "is_hurt": 0, "text": "GUN|G36C|DIALOGUE1"}]
    index = build_live2d_index.index_tdolls(str(tdolls_root), table, rows, {"G36C|DIALOGUE1": "Hi"})
    assert list(index["104"].keys()) == ["base"]
    assert list(index["104"]["base"].keys()) == ["1202"]
    assert index["104"]["base"]["1202"]["normal"]["motions"][0]["name"] == "touch_1"


def test_write_tdoll_files_writes_one_file_per_doll(tmp_path):
    """Each doll's motions land in their own file, shaped exactly like `index_tdolls`'s per-doll value."""
    tdoll_motions = {
        "104": {"base": {"1202": {"normal": {"motions": [{"name": "touch_1", "group": "touch", "model3Group": "touch_1", "seconds": 2.35, "touchArea": "body", "line": "Hi"}]}}}},
        "65": {"mod": {"base": {"normal": {"motions": []}}}},
    }
    out_dir = tmp_path / "live2d-tdolls"
    build_live2d_index.write_tdoll_files(str(out_dir), tdoll_motions)
    assert sorted(p.name for p in out_dir.iterdir()) == ["104.json", "65.json"]
    assert json.loads((out_dir / "104.json").read_text()) == tdoll_motions["104"]
    assert json.loads((out_dir / "65.json").read_text()) == tdoll_motions["65"]


def test_write_tdoll_files_creates_the_output_directory(tmp_path):
    """The output directory is created when it does not already exist, so a first run does not need it pre-made."""
    out_dir = tmp_path / "nested" / "live2d-tdolls"
    build_live2d_index.write_tdoll_files(str(out_dir), {"104": {}})
    assert (out_dir / "104.json").is_file()


if __name__ == "__main__":
    unittest.main()
