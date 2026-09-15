"""Unit tests for the Spine logic in `extract_game_assets`, run with `python3 -m unittest discover tools/assets/tests`.

Bundles are replaced by small fakes built in memory. No test reads a real bundle or touches the network.
"""

import os
import sys
import tempfile
import unittest

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import extract_game_assets as extract  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Fakes

ATLAS_ONE_PAGE = "\nHK416.png\nsize: 4,4\nformat: RGBA8888\nfilter: Linear,Linear\nrepeat: none\nammo\n  rotate: false\n  xy: 0, 0\n  size: 2, 2\n"
ATLAS_TWO_PAGES = "\nX.png\nsize: 4,4\nhead\n  xy: 0, 0\n\nx2.PNG\nsize: 4,4\nleg\n  xy: 0, 0\n"


class FakeData:
    """What `obj.read()` returns for a TextAsset or Texture2D."""

    def __init__(self, name, script=None, image=None):
        """Build the fake.

        Args:
            name: The object's `m_Name`.
            script: TextAsset payload as a string, as UnityPy returns it.
            image: Texture2D decoded image.
        """
        self.m_Name = name
        self.m_Script = script
        self.image = image


class FakeObject:
    """A stand-in for a UnityPy object reader."""

    def __init__(self, kind, data):
        """Build the fake.

        Args:
            kind: Unity type name.
            data: The `FakeData` returned by `read`.
        """
        self.type = type("Type", (), {"name": kind})()
        self.data = data

    def read(self):
        """Return the fake payload.

        Returns:
            The `FakeData`.
        """
        return self.data


class FakeEnv:
    """A stand-in for a loaded UnityPy environment."""

    def __init__(self, container):
        """Build the fake.

        Args:
            container: Map of container path to `FakeObject`.
        """
        self.container = container
        self.objects = list(container.values())


def text(path, name, payload):
    """Build a TextAsset container entry.

    Args:
        path: Container path.
        name: `m_Name`.
        payload: The string payload.

    Returns:
        A `(path, FakeObject)` pair.
    """
    return path, FakeObject("TextAsset", FakeData(name, script=payload))


def texture(path, name, colour=(255, 0, 0, 255)):
    """Build a Texture2D container entry.

    Args:
        path: Container path.
        name: `m_Name`.
        colour: Fill colour of the 4x4 image.

    Returns:
        A `(path, FakeObject)` pair.
    """
    return path, FakeObject("Texture2D", FakeData(name, image=Image.new("RGBA", (4, 4), colour)))


def asset(bundle, path):
    """Build an inventory asset dict.

    Args:
        bundle: Bundle name.
        path: Asset path as ResData records it.

    Returns:
        The asset dict.
    """
    return {"bundle": bundle, "path": path}


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Paths


class RigPathTests(unittest.TestCase):
    """Where each rig's files go, and the prefix the index uses."""

    def test_base_mod_and_skin_folders(self):
        """Base rigs sit in `spine/<id>/`, Mod rigs in `mod/` and skins in `skins/<skinId>/`."""
        self.assertEqual(extract.rig_dir({"tier": "spine", "doll_id": 65}), "spine/65")
        self.assertEqual(extract.rig_dir({"tier": "mod_spine", "doll_id": 65}), "spine/65/mod")
        self.assertEqual(extract.rig_dir({"tier": "skin_spine", "doll_id": 65, "skin_id": 805}), "spine/65/skins/805")

    def test_asset_names(self):
        """TextAsset names keep their extension, and a name without one gets it added."""
        self.assertEqual(extract.spine_file_name("HK416.skel", ".skel"), "HK416.skel")
        self.assertEqual(extract.spine_file_name("HK416", ".atlas"), "HK416.atlas")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Atlas pages


class AtlasPageTests(unittest.TestCase):
    """Reading page names from an atlas and pointing them at the files that exist."""

    def test_pages_are_the_first_line_of_each_block(self):
        """A page starts at the first line and after every blank line, and region names are not pages."""
        self.assertEqual(extract.rewrite_atlas_pages(ATLAS_ONE_PAGE, [])[2], ["HK416.png"])
        self.assertEqual(extract.rewrite_atlas_pages(ATLAS_TWO_PAGES, [])[2], ["X.png", "x2.PNG"])

    def test_windows_line_endings(self):
        """Pages are found and fixed in a CRLF atlas too, keeping the line endings."""
        crlf = ATLAS_TWO_PAGES.replace("\n", "\r\n")
        rewritten, pages, _unresolved = extract.rewrite_atlas_pages(crlf, ["X.png", "X2.png"])
        self.assertEqual((rewritten, pages), (crlf.replace("x2.PNG", "X2.png"), ["X.png", "X2.png"]))

    def test_rewrite_matches_case_and_keeps_everything_else(self):
        """A page differing only by case is rewritten to the real file, exact matches stay byte-identical."""
        rewritten, pages, unresolved = extract.rewrite_atlas_pages(ATLAS_TWO_PAGES, ["X.png", "X2.png"])
        self.assertEqual(rewritten, ATLAS_TWO_PAGES.replace("x2.PNG", "X2.png"))
        self.assertEqual((pages, unresolved), (["X.png", "X2.png"], []))
        same, _pages, _unresolved = extract.rewrite_atlas_pages(ATLAS_ONE_PAGE, ["HK416.png"])
        self.assertEqual(same, ATLAS_ONE_PAGE)

    def test_unresolved_page(self):
        """A page with no texture of any casing is reported."""
        _text, pages, unresolved = extract.rewrite_atlas_pages(ATLAS_ONE_PAGE, ["Other.png"])
        self.assertEqual((pages, unresolved), ([], ["HK416.png"]))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Rig extraction


class RigExtractionTests(unittest.TestCase):
    """Extracting a whole rig from a fake bundle."""

    def extract_with(self, item, container):
        """Run the Spine worker against one fake bundle.

        Args:
            item: The inventory item.
            container: Container entries of the fake bundle.

        Returns:
            A `(result, staging dir, TemporaryDirectory)` triple. The caller cleans up the directory.
        """
        tmp = tempfile.TemporaryDirectory()
        envs = {f"{bundle}.ab": FakeEnv(dict(container)) for bundle in item["bundles"]}
        result = extract.extract_spine_item(item, "", tmp.name, loader=lambda file: envs[os.path.basename(file)])
        return result, tmp.name, tmp

    def test_base_rig_with_its_own_dorm_atlas(self):
        """Combat and dorm rigs are written with their game names, and every atlas page becomes a PNG."""
        bundle = "character_hk416_spine"
        base = "assets/characters/hk416/spine/"
        item = {
            "key": "spine:65",
            "tier": "spine",
            "doll_id": 65,
            "bundles": [bundle],
            "assets": {
                "skel": asset(bundle, base + "HK416.skel.bytes"),
                "atlas": asset(bundle, base + "HK416.atlas.txt"),
                "texture": asset(bundle, base + "HK416.png"),
                "dorm_skel": asset(bundle, base + "RHK416.skel.bytes"),
                "dorm_atlas": asset(bundle, base + "RHK416.atlas.txt"),
                "dorm_texture": asset(bundle, base + "RHK416.png"),
            },
        }
        container = [
            text(base + "hk416.skel.bytes", "HK416.skel", "\x00skel\udc80"),
            text(base + "hk416.atlas.txt", "HK416.atlas", ATLAS_ONE_PAGE),
            texture(base + "hk416.png", "HK416"),
            text(base + "rhk416.skel.bytes", "RHK416.skel", "dorm"),
            text(base + "rhk416.atlas.txt", "RHK416.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "RHK416.png")),
            texture(base + "rhk416.png", "RHK416", (0, 255, 0, 255)),
        ]
        result, staging, tmp = self.extract_with(item, container)
        with tmp:
            written = sorted(row[0] for row in result["files"])
            self.assertEqual(written, [f"spine/65/{name}" for name in ("HK416.atlas", "HK416.png", "HK416.skel", "RHK416.atlas", "RHK416.png", "RHK416.skel")])
            with open(os.path.join(staging, "assets/spine/65/HK416.skel"), "rb") as handle:
                self.assertEqual(handle.read(), b"\x00skel\x80")
            self.assertEqual(Image.open(os.path.join(staging, "assets/spine/65/RHK416.png")).getpixel((0, 0)), (0, 255, 0, 255))
            self.assertEqual(result["missing"], [])
            self.assertEqual(result["rigs"], [{"key": "spine:65", "tier": "spine", "dorm": True, "shared_atlas": False, "pages": 2}])

    def test_dorm_rig_sharing_the_combat_atlas(self):
        """A dorm rig with no atlas of its own writes only its skeleton and counts as sharing the combat atlas."""
        bundle = "character_92typemod_spine"
        base = "assets/characters/92typemod/spine/"
        item = {
            "key": "mod_spine:13",
            "tier": "mod_spine",
            "doll_id": 13,
            "bundles": [bundle],
            "assets": {
                "skel": asset(bundle, base + "92typeMod.skel.bytes"),
                "atlas": asset(bundle, base + "92typeMod.atlas.txt"),
                "texture": asset(bundle, base + "92typeMod.png"),
                "dorm_skel": asset(bundle, base + "R92typeMod.skel.bytes"),
            },
        }
        container = [
            text(base + "92typemod.skel.bytes", "92typeMod.skel", "c"),
            text(base + "92typemod.atlas.txt", "92typeMod.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "92typeMod.png")),
            texture(base + "92typemod.png", "92typeMod"),
            text(base + "r92typemod.skel.bytes", "R92typeMod.skel", "d"),
        ]
        result, _staging, tmp = self.extract_with(item, container)
        with tmp:
            self.assertEqual(sorted(row[0] for row in result["files"]), ["spine/13/mod/92typeMod.atlas", "spine/13/mod/92typeMod.png", "spine/13/mod/92typeMod.skel", "spine/13/mod/R92typeMod.skel"])
            self.assertEqual(result["rigs"][0]["shared_atlas"], True)
            self.assertEqual(result["missing"], [])

    def test_multi_page_atlas_and_case_fix(self):
        """Every page of a multi-page atlas is extracted, and a page named with the wrong case is rewritten."""
        bundle = "character_x_805_spine"
        base = "assets/characters/x_805/spine/"
        item = {
            "key": "skin_spine:1:805",
            "tier": "skin_spine",
            "doll_id": 1,
            "skin_id": 805,
            "bundles": [bundle],
            "assets": {"skel": asset(bundle, base + "X.skel.bytes"), "atlas": asset(bundle, base + "X.atlas.txt"), "texture": asset(bundle, base + "X.png")},
        }
        container = [text(base + "x.skel.bytes", "X.skel", "c"), text(base + "x.atlas.txt", "X.atlas", ATLAS_TWO_PAGES), texture(base + "x.png", "X"), texture(base + "x2.png", "X2")]
        result, staging, tmp = self.extract_with(item, container)
        with tmp:
            self.assertIn("spine/1/skins/805/X2.png", [row[0] for row in result["files"]])
            with open(os.path.join(staging, "assets/spine/1/skins/805/X.atlas"), encoding="utf-8") as handle:
                self.assertIn("\nX2.png\n", handle.read())
            self.assertEqual(result["rigs"][0]["pages"], 2)

    def test_missing_page_texture_is_reported(self):
        """An atlas page with no texture in the bundle is a missing entry, not a silent gap."""
        bundle = "b"
        item = {"key": "spine:2", "tier": "spine", "doll_id": 2, "bundles": [bundle], "assets": {"skel": asset(bundle, "p/A.skel.bytes"), "atlas": asset(bundle, "p/A.atlas.txt")}}
        container = [text("p/a.skel.bytes", "A.skel", "c"), text("p/a.atlas.txt", "A.atlas", ATLAS_ONE_PAGE)]
        result, _staging, tmp = self.extract_with(item, container)
        with tmp:
            self.assertEqual([(row["key"], row["role"]) for row in result["missing"]], [("spine:2", "page")])

    def test_bundle_load_failure(self):
        """A bundle that cannot be opened marks the whole rig missing."""

        def loader(_file):
            raise OSError("bad bundle")

        item = {"key": "spine:3", "tier": "spine", "doll_id": 3, "bundles": ["b"], "assets": {}}
        with tempfile.TemporaryDirectory() as staging:
            result = extract.extract_spine_item(item, "", staging, loader=loader)
        self.assertEqual([(row["key"], row["role"]) for row in result["missing"]], [("spine:3", "*")])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# HOC rigs


class HocRigExtractionTests(unittest.TestCase):
    """Extracting a HOC's combat rig and its crew skeletons from a fake bundle."""

    def extract_with(self, item, container):
        """Run the HOC Spine worker against one fake bundle.

        Args:
            item: The inventory item.
            container: Container entries of the fake bundle.

        Returns:
            A `(result, staging dir, TemporaryDirectory)` triple. The caller cleans up the directory.
        """
        tmp = tempfile.TemporaryDirectory()
        envs = {f"{bundle}.ab": FakeEnv(dict(container)) for bundle in item["bundles"]}
        result = extract.extract_hoc_spine_item(item, "", tmp.name, loader=lambda file: envs[os.path.basename(file)])
        return result, tmp.name, tmp

    def test_combat_rig_and_crew_with_and_without_their_own_atlas(self):
        """Every skeleton, atlas and page lands in `hoc-spine/<id>/`, and a crew with no atlas counts as sharing the combat atlas."""
        bundle = "character_mk153_spine"
        base = "assets/characters/mk153/spine/"
        item = {
            "key": "hoc_spine:7",
            "tier": "hoc_spine",
            "hoc_id": 7,
            "code": "MK153",
            "crew": 2,
            "bundles": [bundle],
            "assets": {
                "skel": asset(bundle, base + "MK153.skel.bytes"),
                "atlas": asset(bundle, base + "MK153.atlas.txt"),
                "texture": asset(bundle, base + "MK153.png"),
                "crew1_skel": asset(bundle, base + "RMK153A.skel.bytes"),
                "crew2_skel": asset(bundle, base + "RMK153B.skel.bytes"),
                "crew2_atlas": asset(bundle, base + "RMK153B.atlas.txt"),
                "crew2_texture": asset(bundle, base + "RMK153B.png"),
            },
        }
        container = [
            text(base + "mk153.skel.bytes", "MK153.skel", "c"),
            text(base + "mk153.atlas.txt", "MK153.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "MK153.png")),
            texture(base + "mk153.png", "MK153"),
            text(base + "rmk153a.skel.bytes", "RMK153A.skel", "a"),
            text(base + "rmk153b.skel.bytes", "RMK153B.skel", "b"),
            text(base + "rmk153b.atlas.txt", "RMK153B.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "RMK153B.png")),
            texture(base + "rmk153b.png", "RMK153B", (0, 255, 0, 255)),
        ]
        result, staging, tmp = self.extract_with(item, container)
        with tmp:
            expected = ["MK153.atlas", "MK153.png", "MK153.skel", "RMK153A.skel", "RMK153B.atlas", "RMK153B.png", "RMK153B.skel"]
            self.assertEqual(sorted(os.listdir(os.path.join(staging, "assets", "hoc-spine", "7"))), expected)
            self.assertEqual({row[2] for row in result["files"]}, {"hoc_spine_rig"})
        self.assertEqual(result["missing"], [])
        self.assertIs(result["rigs"][0]["shared_atlas"], True)
        self.assertEqual(result["rigs"], [{"key": "hoc_spine:7", "tier": "hoc_spine", "dorm": False, "shared_atlas": True, "pages": 2}])

    def test_crew_atlas_page_with_no_texture_is_missing_and_nothing_is_written(self):
        """A crew atlas naming a page no texture matches is a `page` missing row, and the rig writes no files."""
        bundle = "b"
        item = {
            "key": "hoc_spine:8",
            "tier": "hoc_spine",
            "hoc_id": 8,
            "code": "A",
            "crew": 1,
            "bundles": [bundle],
            "assets": {
                "skel": asset(bundle, "p/A.skel.bytes"),
                "atlas": asset(bundle, "p/A.atlas.txt"),
                "crew1_skel": asset(bundle, "p/RA.skel.bytes"),
                "crew1_atlas": asset(bundle, "p/RA.atlas.txt"),
            },
        }
        container = [
            text("p/a.skel.bytes", "A.skel", "c"),
            text("p/a.atlas.txt", "A.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "A.png")),
            texture("p/a.png", "A"),
            text("p/ra.skel.bytes", "RA.skel", "r"),
            text("p/ra.atlas.txt", "RA.atlas", ATLAS_ONE_PAGE.replace("HK416.png", "Nope.png")),
        ]
        result, staging, tmp = self.extract_with(item, container)
        with tmp:
            self.assertEqual([(row["key"], row["role"]) for row in result["missing"]], [("hoc_spine:8", "page")])
            self.assertEqual(result["files"], [])
            self.assertFalse(os.path.exists(os.path.join(staging, "assets", "hoc-spine")))
        self.assertEqual(result["rigs"], [])

    def test_rig_counts_include_hoc_rigs(self):
        """HOC rigs are counted under their own tier."""
        counts = extract.rig_counts([{"tier": "hoc_spine", "dorm": False, "shared_atlas": True, "pages": 2}])
        self.assertEqual((counts["hoc_spine"], counts["shared_atlas"], counts["pages"]), (1, 1, 2))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Gaps and counts


class SpineGapTests(unittest.TestCase):
    """Which rigs may be absent, and the rig counts in the report."""

    def test_known_skin_rig_gap_is_expected(self):
        """The skin with no rig in the game is an expected gap, any other unresolved rig is not."""
        self.assertIn("skin_spine:95:1809", extract.EXPECTED_MISSING_RIGS)
        missing = [{"key": "skin_spine:95:1809", "role": "*", "reason": "no bundle holds the files"}, {"key": "spine:1", "role": "*", "reason": "no bundle holds the files"}]
        self.assertEqual([row["key"] for row in extract.unexpected_missing(missing, extract.EXPECTED_MISSING_RIGS)], ["spine:1"])

    def test_rig_counts(self):
        """Counts split rigs per tier and count dorm rigs and shared atlases."""
        rigs = [
            {"tier": "spine", "dorm": True, "shared_atlas": False, "pages": 2},
            {"tier": "mod_spine", "dorm": True, "shared_atlas": True, "pages": 1},
            {"tier": "skin_spine", "dorm": False, "shared_atlas": False, "pages": 1},
        ]
        self.assertEqual(
            extract.rig_counts(rigs), {"spine": 1, "mod_spine": 1, "skin_spine": 1, "dorm": 2, "shared_atlas": 1, "pages": 4}
        )


if __name__ == "__main__":
    unittest.main()
