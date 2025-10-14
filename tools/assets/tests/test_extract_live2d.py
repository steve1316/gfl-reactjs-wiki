"""Unit tests for `extract_live2d`, run with `python3 -m unittest discover tools/assets/tests`.

Every fixture here is a small synthetic dict, not a real bundle. No test reads a bundle or touches the network.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import extract_live2d  # noqa: E402


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


if __name__ == "__main__":
    unittest.main()
