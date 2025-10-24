"""Unit tests for `extract_live2d`, run with `python3 -m unittest discover tools/assets/tests`.

Most fixtures here are small synthetic dicts, not real bundles. The `build_skin_live2d` end-to-end tests are the exception - they read the
real cached spike bundles under `~/.cache/gfl-gun-spike/` when present, and skip when they are not.
"""

import json
import os
import sys
import unittest

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import extract_live2d  # noqa: E402
import game_bundles  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# curve_to_segments


class CurveToSegmentsTests(unittest.TestCase):
    """Unity Hermite keyframes to a motion3 flat `Segments` list."""

    def test_two_keys_become_one_bezier_segment(self):
        keys = [{"time": 0.0, "value": 0.0, "inSlope": 0.0, "outSlope": 0.0}, {"time": 0.3, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0}]
        self.assertEqual(extract_live2d.curve_to_segments(keys), [0.0, 0.0, 1, 0.1, 0.0, 0.2, 1.0, 0.3, 1.0])

    def test_infinite_slope_becomes_a_stepped_segment(self):
        keys = [{"time": 0.0, "value": 0.0, "inSlope": 0.0, "outSlope": float("inf")}, {"time": 0.1, "value": 1.0, "inSlope": float("inf"), "outSlope": 0.0}]
        self.assertEqual(extract_live2d.curve_to_segments(keys), [0.0, 0.0, 2, 0.1, 1.0])

    def test_three_keys_chain_two_bezier_segments(self):
        """A curve with more than two keys emits one segment per consecutive pair, not just the first."""
        keys = [
            {"time": 0.0, "value": 0.0, "inSlope": 0.0, "outSlope": 0.0},
            {"time": 0.3, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0},
            {"time": 0.6, "value": 0.0, "inSlope": 0.0, "outSlope": 0.0},
        ]
        segments = extract_live2d.curve_to_segments(keys)
        self.assertEqual(segments[:9], [0.0, 0.0, 1, 0.1, 0.0, 0.2, 1.0, 0.3, 1.0])
        self.assertEqual(segments[9:], [1, 0.4, 1.0, 0.5, 0.0, 0.6, 0.0])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# motion_group_name


class MotionGroupNameTests(unittest.TestCase):
    """Grouping one motion's name for model3's `FileReferences.Motions`."""

    def test_idle_name_groups_under_idle(self):
        self.assertEqual(extract_live2d.motion_group_name("daiji_idle_01"), "Idle")

    def test_wait_name_is_its_own_group(self):
        self.assertEqual(extract_live2d.motion_group_name("wait_01"), "wait_01")

    def test_touch_name_is_its_own_group(self):
        self.assertEqual(extract_live2d.motion_group_name("motou_01"), "motou_01")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# fade_to_motion3

FADE = {
    "MotionLength": 1.5,
    "FadeInTime": 0.5,
    "FadeOutTime": 0.3,
    "ParameterIds": ["ParamAngleX", "PartArmA", "ParamUnknownOpacity"],
    "ParameterCurves": [
        {"m_Curve": [{"time": 0.0, "value": 0.0, "inSlope": 0.0, "outSlope": 0.0}, {"time": 1.0, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0}]},
        {"m_Curve": [{"time": 0.0, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0}, {"time": 1.0, "value": 0.0, "inSlope": 0.0, "outSlope": 0.0}]},
        {"m_Curve": [{"time": 0.0, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0}, {"time": 1.0, "value": 1.0, "inSlope": 0.0, "outSlope": 0.0}]},
    ],
    "ParameterFadeInTimes": [0.1, 0.2, 0.0],
    "ParameterFadeOutTimes": [0.1, 0.2, 0.0],
}
PARAM_IDS = ["ParamAngleX"]
PART_IDS = ["PartArmA"]


class FadeToMotion3Tests(unittest.TestCase):
    """Converting a `CubismFadeMotionData` typetree dict into a motion3 dict."""

    def test_fade_dict_converts_to_motion3(self):
        motion = extract_live2d.fade_to_motion3(FADE, PARAM_IDS, PART_IDS)
        self.assertEqual(motion["Version"], 3)
        self.assertEqual(motion["Meta"]["Duration"], 1.5)
        self.assertEqual(motion["Meta"]["Fps"], 30)
        self.assertTrue(motion["Meta"]["Loop"])
        self.assertFalse(motion["Meta"]["AreBeziersRestricted"])
        self.assertEqual(motion["Meta"]["CurveCount"], 2)
        self.assertEqual(motion["Meta"]["TotalSegmentCount"], 2)
        self.assertEqual(motion["Meta"]["TotalPointCount"], 8)
        self.assertEqual(motion["Meta"]["FadeInTime"], 0.5)
        self.assertEqual(motion["Meta"]["FadeOutTime"], 0.3)
        self.assertEqual(len(motion["Curves"]), 2)

    def test_parameter_id_gets_parameter_target(self):
        motion = extract_live2d.fade_to_motion3(FADE, PARAM_IDS, PART_IDS)
        self.assertEqual(motion["Curves"][0]["Target"], "Parameter")
        self.assertEqual(motion["Curves"][0]["Id"], "ParamAngleX")
        self.assertEqual(motion["Curves"][0]["FadeInTime"], 0.1)
        self.assertEqual(motion["Curves"][0]["FadeOutTime"], 0.1)

    def test_part_id_gets_part_opacity_target(self):
        """A curve id that appears in the prefab's parts list is classed `PartOpacity`, not `Parameter`."""
        motion = extract_live2d.fade_to_motion3(FADE, PARAM_IDS, PART_IDS)
        self.assertEqual(motion["Curves"][1]["Target"], "PartOpacity")
        self.assertEqual(motion["Curves"][1]["Id"], "PartArmA")

    def test_model_opacity_id_is_skipped(self):
        """A curve id that is neither a parameter nor a part (the model opacity id) is dropped, not written as a third curve."""
        motion = extract_live2d.fade_to_motion3(FADE, PARAM_IDS, PART_IDS)
        ids = [curve["Id"] for curve in motion["Curves"]]
        self.assertNotIn("ParamUnknownOpacity", ids)

    def test_empty_curve_is_skipped(self):
        """A parameter id with no keyframes at all contributes no curve."""
        fade = {**FADE, "ParameterCurves": [{"m_Curve": []}, FADE["ParameterCurves"][1], FADE["ParameterCurves"][2]]}
        motion = extract_live2d.fade_to_motion3(fade, PARAM_IDS, PART_IDS)
        self.assertEqual(motion["Meta"]["CurveCount"], 1)
        self.assertEqual(motion["Curves"][0]["Id"], "PartArmA")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# model3


class Model3Tests(unittest.TestCase):
    """Building the model3.json dict."""

    def test_model3_lists_moc_textures_motion_groups_and_hit_areas(self):
        motion_groups = {"Idle": [{"File": "motions/daiji_idle_01.motion3.json", "FadeInTime": 0.5, "FadeOutTime": 0.0}]}
        hit_areas = [{"Id": "HitAreaHead", "Name": "Head"}]
        model = extract_live2d.model3("form1.moc3", ["texture.webp"], motion_groups, (["ParamEyeLOpen", "ParamEyeROpen"], ["ParamMouthOpenY"]), hit_areas)
        self.assertEqual(model["Version"], 3)
        self.assertEqual(model["FileReferences"]["Moc"], "form1.moc3")
        self.assertEqual(model["FileReferences"]["Textures"], ["texture.webp"])
        self.assertEqual(model["FileReferences"]["Motions"], motion_groups)
        self.assertEqual(model["Groups"][0], {"Target": "Parameter", "Name": "EyeBlink", "Ids": ["ParamEyeLOpen", "ParamEyeROpen"]})
        self.assertEqual(model["Groups"][1], {"Target": "Parameter", "Name": "LipSync", "Ids": ["ParamMouthOpenY"]})
        self.assertEqual(model["HitAreas"], hit_areas)

    def test_model3_with_two_textures_and_no_groups(self):
        """A HOC with two textures and no eye-blink/mouth parameters still gets empty (not missing) group id lists."""
        model = extract_live2d.model3("model.moc3", ["texture0.webp", "texture1.webp"], {}, ([], []), [])
        self.assertEqual(model["FileReferences"]["Textures"], ["texture0.webp", "texture1.webp"])
        self.assertEqual(model["Groups"][0]["Ids"], [])
        self.assertEqual(model["Groups"][1]["Ids"], [])
        self.assertEqual(model["HitAreas"], [])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# extract_live2d_items


class ExtractLive2dItemsTests(unittest.TestCase):
    """The worker's own error handling, independent of the UnityPy typetree walk."""

    def test_bundle_load_failure_becomes_a_missing_row_not_an_exception(self):
        def failing_loader(_path):
            raise OSError("no such file")

        item = {"key": "live2d:fairy:1", "kind": "fairy", "id": 1, "code": "fighting", "bundles": ["live2dnew_fairy_fighting"], "assets": {}}
        result = extract_live2d.extract_live2d_items([item], "/nonexistent/cache", "/nonexistent/staging", loader=failing_loader)
        self.assertEqual(result["files"], [])
        self.assertEqual(len(result["missing"]), 1)
        self.assertEqual(result["missing"][0]["key"], "live2d:fairy:1")

    def test_one_item_crashing_does_not_stop_the_others(self):
        def failing_loader(_path):
            raise OSError("no such file")

        items = [
            {"key": "live2d:fairy:1", "kind": "fairy", "id": 1, "code": "fighting", "bundles": ["a"], "assets": {}},
            {"key": "live2d:hoc:1", "kind": "hoc", "id": 1, "code": "bgm-71", "bundles": ["b"], "assets": {}},
        ]
        result = extract_live2d.extract_live2d_items(items, "/nonexistent/cache", "/nonexistent/staging", loader=failing_loader)
        self.assertEqual(len(result["missing"]), 2)
        self.assertEqual({row["key"] for row in result["missing"]}, {"live2d:fairy:1", "live2d:hoc:1"})

    def test_an_unrecognised_kind_becomes_a_missing_row_not_a_batch_abort(self):
        """The builder lookup itself can raise (an unknown `kind`), not just the builder call, so the lookup must sit inside the same
        try/except as the call - otherwise one bad item's KeyError would abort every other item in the batch.
        """

        def failing_loader(_path):
            raise OSError("no such file")

        items = [
            {"key": "live2d:bogus:1", "kind": "nonsense", "id": 1, "code": "x", "bundles": ["a"], "assets": {}},
            {"key": "live2d:hoc:1", "kind": "hoc", "id": 1, "code": "bgm-71", "bundles": ["b"], "assets": {}},
        ]
        result = extract_live2d.extract_live2d_items(items, "/nonexistent/cache", "/nonexistent/staging", loader=failing_loader)
        self.assertEqual(len(result["missing"]), 2)
        self.assertEqual({row["key"] for row in result["missing"]}, {"live2d:bogus:1", "live2d:hoc:1"})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# physics3


def physics_rig():
    """Build a one-sub-rig CubismPhysicsController payload in Unity's own shape.

    Returns:
        The `_rig` typetree dict.
    """
    return {
        "Gravity": {"x": 0.0, "y": -1.0},
        "Wind": {"x": 0.5, "y": 0.0},
        "SubRigs": [
            {
                "Input": [{"SourceId": "ParamAngleX", "ScaleOfTranslation": {"x": 0.0, "y": 0.0}, "AngleScale": 0.0, "Weight": 70.0, "SourceComponent": 2, "IsInverted": 0}],
                "Output": [{"DestinationId": "ParamHairFront", "ParticleIndex": 1, "TranslationScale": {"x": 0.0, "y": 0.0}, "AngleScale": 1.5, "Weight": 100.0, "SourceComponent": 2, "IsInverted": 1}],
                "Particles": [
                    {"InitialPosition": {"x": 0.0, "y": 0.0}, "Mobility": 1.0, "Delay": 1.0, "Acceleration": 1.0, "Radius": 0.0},
                    {"InitialPosition": {"x": 0.0, "y": 5.0}, "Mobility": 0.95, "Delay": 0.8, "Acceleration": 1.2, "Radius": 5.0},
                ],
                "Normalization": {"Position": {"Maximum": 10.0, "Minimum": -10.0, "Default": 0.0}, "Angle": {"Maximum": 10.0, "Minimum": -10.0, "Default": 0.0}},
            }
        ],
    }


def test_physics3_maps_the_unity_rig_one_to_one():
    doc = extract_live2d.physics3(physics_rig())
    assert doc["Version"] == 3
    assert doc["Meta"]["PhysicsSettingCount"] == 1
    assert doc["Meta"]["TotalInputCount"] == 1
    assert doc["Meta"]["TotalOutputCount"] == 1
    assert doc["Meta"]["VertexCount"] == 2
    assert doc["Meta"]["EffectiveForces"] == {"Gravity": {"X": 0.0, "Y": -1.0}, "Wind": {"X": 0.5, "Y": 0.0}}
    assert doc["Meta"]["PhysicsDictionary"] == [{"Id": "PhysicsSetting1", "Name": "PhysicsSetting1"}]

    setting = doc["PhysicsSettings"][0]
    assert setting["Id"] == "PhysicsSetting1"
    assert setting["Input"] == [{"Source": {"Target": "Parameter", "Id": "ParamAngleX"}, "Weight": 70.0, "Type": "Angle", "Reflect": False}]
    assert setting["Output"] == [
        {"Destination": {"Target": "Parameter", "Id": "ParamHairFront"}, "VertexIndex": 1, "Scale": 1.5, "Weight": 100.0, "Type": "Angle", "Reflect": True}
    ]
    assert setting["Vertices"][1] == {"Position": {"X": 0.0, "Y": 5.0}, "Mobility": 0.95, "Delay": 0.8, "Acceleration": 1.2, "Radius": 5.0}
    assert setting["Normalization"] == {
        "Position": {"Minimum": -10.0, "Maximum": 10.0, "Default": 0.0},
        "Angle": {"Minimum": -10.0, "Maximum": 10.0, "Default": 0.0},
    }


def test_physics3_output_scale_follows_the_source_component():
    rig = physics_rig()
    rig["SubRigs"][0]["Output"][0]["SourceComponent"] = 0
    rig["SubRigs"][0]["Output"][0]["TranslationScale"] = {"x": 2.5, "y": 7.0}
    doc = extract_live2d.physics3(rig)
    assert doc["PhysicsSettings"][0]["Output"][0]["Type"] == "X"
    assert doc["PhysicsSettings"][0]["Output"][0]["Scale"] == 2.5
    rig["SubRigs"][0]["Output"][0]["SourceComponent"] = 1
    doc = extract_live2d.physics3(rig)
    assert doc["PhysicsSettings"][0]["Output"][0]["Type"] == "Y"
    assert doc["PhysicsSettings"][0]["Output"][0]["Scale"] == 7.0


def test_physics3_returns_none_for_an_empty_rig():
    assert extract_live2d.physics3({"Gravity": {"x": 0.0, "y": -1.0}, "Wind": {"x": 0.0, "y": 0.0}, "SubRigs": []}) is None
    assert extract_live2d.physics3(None) is None


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# texture_output_names


def test_skin_textures_are_named_by_index_not_by_basename():
    # ak12mod ships a nested normal/model/ folder, so two different textures share the basename texture_00.png.
    # Naming by basename would write texture_00.webp twice and lose one, so the namer must use the container order index.
    paths = ["root/normal/model.2048/texture_00.png", "root/normal/model/model.2048/texture_00.png"]
    assert extract_live2d.texture_output_names(paths) == ["texture0.webp", "texture1.webp"]


def test_skin_texture_names_follow_container_order():
    paths = ["root/normal/model.2048/texture_01.png", "root/normal/model.2048/texture_00.png"]
    assert extract_live2d.texture_output_names(sorted(paths)) == ["texture0.webp", "texture1.webp"]


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# build_skin_variant texture failure


class FailingTexture:
    """A container entry whose `read()` always raises, standing in for a texture that fails to decode."""

    def read(self):
        raise ValueError("decode boom")


def test_a_failing_texture_aborts_the_variant_instead_of_shifting_slots(tmp_path):
    """A texture that fails to encode must not be silently dropped: that would compact the remaining names and shift every later
    drawable onto the wrong index-based texture slot, so the whole variant is recorded as missing and no model3.json is written instead.
    """
    item = {
        "key": "live2d:skin:1:base:base",
        "assets": {
            "normal_moc": {"bundle": "x", "path": "unused"},
            "normal_prefab": {"bundle": "x", "path": "unused"},
            "normal_textures": {"bundle": "x", "path": "root/normal/"},
        },
    }
    container = {"root/normal/texture_00.png": FailingTexture()}
    result = extract_live2d.new_result()
    extract_live2d.build_skin_variant(item, container, {}, "normal", "live2d/tdolls/1/base/base/normal", str(tmp_path), result)

    assert result["files"] == []
    assert len(result["missing"]) == 1
    assert result["missing"][0]["role"] == "normal_texture:texture0.webp"
    assert not (tmp_path / "assets" / "live2d" / "tdolls" / "1" / "base" / "base" / "normal" / "model.model3.json").exists()


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# build_skin_live2d end-to-end

GUN_BUNDLE = os.path.join(os.path.expanduser("~"), ".cache", "gfl-gun-spike", "live2dnew_gun_g36c_1202.ab")
HK433_BUNDLE = os.path.join(os.path.expanduser("~"), ".cache", "gfl-gun-spike", "live2dnew_gun_hk433_8502.ab")


@pytest.mark.skipif(not os.path.isfile(GUN_BUNDLE), reason="the sample gun bundle is not cached locally")
def test_build_skin_live2d_writes_both_variants(tmp_path):
    index = {"live2dnew_gun_g36c_1202": {"files": [], "sizeOriginal": 0}}
    # Build the item from the real bundle's own file list so the roles carry real paths.
    import UnityPy

    env = UnityPy.load(GUN_BUNDLE)
    index["live2dnew_gun_g36c_1202"]["files"] = [(key, key) for key in env.container]
    model = {"doll_id": 104, "form": "base", "skin_key": "1202", "bundle": "live2dnew_gun_g36c_1202", "motion_ids": []}
    item = game_bundles.skin_live2d_item(index, model)
    result = extract_live2d.build_skin_live2d(item, os.path.dirname(GUN_BUNDLE), str(tmp_path), UnityPy.load)

    assert result["missing"] == []
    # write_file always writes under the staging root's own "assets" tree, so the check path needs that segment too.
    root = tmp_path / "assets" / "live2d" / "tdolls" / "104" / "base" / "1202"
    for variant in ("normal", "damaged"):
        assert (root / variant / "model.moc3").exists()
        assert (root / variant / "model.model3.json").exists()
        assert (root / variant / "texture0.webp").exists()
        assert list((root / variant / "motions").glob("*.motion3.json"))
    # Both of g36c's variants carry a physics rig, so both get a physics3.json and a Physics key.
    for variant in ("normal", "damaged"):
        assert (root / variant / "model.physics3.json").exists()
        doc = json.loads((root / variant / "model.model3.json").read_text())
        assert doc["FileReferences"]["Physics"] == "model.physics3.json"


@pytest.mark.skipif(not os.path.isfile(HK433_BUNDLE), reason="the sample hk433 bundle is not cached locally")
def test_build_skin_live2d_omits_physics_when_rig_is_absent(tmp_path):
    """hk433_8502's damaged variant has no `CubismPhysicsController` rig, so `physics3` returns None for it and no file is written."""
    index = {"live2dnew_gun_hk433_8502": {"files": [], "sizeOriginal": 0}}
    import UnityPy

    env = UnityPy.load(HK433_BUNDLE)
    index["live2dnew_gun_hk433_8502"]["files"] = [(key, key) for key in env.container]
    model = {"doll_id": 105, "form": "base", "skin_key": "8502", "bundle": "live2dnew_gun_hk433_8502", "motion_ids": []}
    item = game_bundles.skin_live2d_item(index, model)
    result = extract_live2d.build_skin_live2d(item, os.path.dirname(HK433_BUNDLE), str(tmp_path), UnityPy.load)

    assert result["missing"] == []
    root = tmp_path / "assets" / "live2d" / "tdolls" / "105" / "base" / "8502"
    assert (root / "normal" / "model.physics3.json").exists()
    assert not (root / "damaged" / "model.physics3.json").exists()
    doc = json.loads((root / "damaged" / "model.model3.json").read_text())
    assert "Physics" not in doc["FileReferences"]


if __name__ == "__main__":
    unittest.main()
