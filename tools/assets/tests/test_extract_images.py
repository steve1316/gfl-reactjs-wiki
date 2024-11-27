"""Unit tests for the image logic in `extract_game_assets`, run with `python3 -m unittest discover tools/assets/tests`.

Every image here is a tiny synthetic one built in memory. No test reads a bundle or touches the network.
"""

import io
import os
import subprocess
import sys
import tempfile
import unittest

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import extract_game_assets as extract  # noqa: E402


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Card atlas


class CardAtlasTests(unittest.TestCase):
    """Splitting the `_N` card atlas into the normal and damaged cards."""

    def test_split_takes_left_and_right_halves(self):
        """The left half is the normal card and the right half the damaged card, each full height."""
        atlas = Image.new("RGB", (8, 16), (10, 20, 30))
        atlas.paste((200, 100, 50), (4, 0, 8, 16))
        normal, damaged = extract.split_card_atlas(atlas)
        self.assertEqual(normal.size, (4, 16))
        self.assertEqual(damaged.size, (4, 16))
        self.assertEqual(set(normal.getdata()), {(10, 20, 30)})
        self.assertEqual(set(damaged.getdata()), {(200, 100, 50)})

    def test_split_of_a_real_sized_atlas_gives_256_by_512_cards(self):
        """A 512x512 atlas yields two 256x512 cards."""
        normal, damaged = extract.split_card_atlas(Image.new("RGB", (512, 512)))
        self.assertEqual((normal.size, damaged.size), ((256, 512), (256, 512)))

    def test_split_rejects_odd_width(self):
        """An atlas that cannot be halved exactly is an error, not a silent off-by-one."""
        with self.assertRaises(ValueError):
            extract.split_card_atlas(Image.new("RGB", (7, 16)))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Alpha merge


class AlphaMergeTests(unittest.TestCase):
    """Merging an `_Alpha` sibling texture into the colour texture."""

    def test_alpha_channel_of_same_size(self):
        """The alpha texture's `A` channel becomes the output alpha, colour untouched."""
        color = Image.new("RGB", (2, 2), (9, 8, 7))
        alpha = Image.new("RGBA", (2, 2), (0, 0, 0, 0))
        alpha.putpixel((1, 0), (0, 0, 0, 255))
        merged = extract.merge_alpha(color, alpha)
        self.assertEqual(merged.mode, "RGBA")
        self.assertEqual(merged.getpixel((0, 0)), (9, 8, 7, 0))
        self.assertEqual(merged.getpixel((1, 0)), (9, 8, 7, 255))

    def test_smaller_alpha_is_resized_to_colour_size(self):
        """A half-resolution alpha is upscaled so it covers the whole colour texture."""
        color = Image.new("RGB", (8, 8), (1, 2, 3))
        alpha = Image.new("L", (4, 4), 255)
        merged = extract.merge_alpha(color, alpha)
        self.assertEqual(merged.size, (8, 8))
        self.assertEqual(merged.getchannel("A").getextrema(), (255, 255))

    def test_luminance_alpha_is_accepted(self):
        """A single-channel alpha texture is used as is."""
        merged = extract.merge_alpha(Image.new("RGB", (2, 2)), Image.new("L", (2, 2), 128))
        self.assertEqual(merged.getpixel((0, 0))[3], 128)


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Equipment frame


class EquipFrameTests(unittest.TestCase):
    """Compositing an equipment icon onto its rarity background."""

    def test_background_name_by_rarity(self):
        """Rarity 2-5 map to the white, blue, green and yellow pattern sprites."""
        self.assertEqual([extract.rarity_background(rarity) for rarity in (2, 3, 4, 5)], ["\u5e95\u7eb9_\u767d", "\u5e95\u7eb9_\u84dd", "\u5e95\u7eb9_\u7eff", "\u5e95\u7eb9_\u9ec4"])

    def test_unknown_rarity_is_an_error(self):
        """A rarity with no known background raises instead of guessing."""
        with self.assertRaises(ValueError):
            extract.rarity_background(6)

    def test_composite_size_and_layout(self):
        """The output is 256x196 RGB, with the scaled icon centred over the stretched background."""
        background = Image.new("RGBA", (127, 98), (0, 0, 255, 255))
        icon = Image.new("RGBA", (256, 256), (255, 0, 0, 255))
        out = extract.compose_equip_icon(icon, background)
        self.assertEqual((out.mode, out.size), ("RGB", (256, 196)))
        self.assertEqual(out.getpixel((128, 98)), (255, 0, 0))
        self.assertEqual(out.getpixel((128, 0)), (255, 0, 0))
        self.assertEqual(out.getpixel((1, 98)), (0, 0, 255))
        self.assertEqual(out.getpixel((254, 98)), (0, 0, 255))

    def test_transparent_icon_shows_only_background(self):
        """Fully transparent icon pixels leave the background visible."""
        background = Image.new("RGBA", (127, 98), (0, 200, 0, 255))
        out = extract.compose_equip_icon(Image.new("RGBA", (256, 256), (255, 0, 0, 0)), background)
        self.assertEqual(set(out.getdata()), {(0, 200, 0)})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Paths


class PathTests(unittest.TestCase):
    """Output file naming in the skin-id layout."""

    def test_base_art_outputs(self):
        """Base cards go to the asset tree and full art to the art tree, both under `tdolls/<id>/`."""
        item = {"tier": "art", "doll_id": 65, "assets": {"card": {}, "full": {}, "full_d": {}}}
        self.assertEqual(
            extract.art_outputs(item),
            [
                ("card", "assets", ["tdolls/65/card.webp", "tdolls/65/card_d.webp"]),
                ("full", "art", ["tdolls/65/full.webp"]),
                ("full_d", "art", ["tdolls/65/full_d.webp"]),
            ],
        )

    def test_mod_art_outputs(self):
        """Mod art lives under `tdolls/<id>/mod/`."""
        item = {"tier": "mod_art", "doll_id": 65, "assets": {"card": {}, "full": {}}}
        self.assertEqual(
            extract.art_outputs(item),
            [("card", "assets", ["tdolls/65/mod/card.webp", "tdolls/65/mod/card_d.webp"]), ("full", "art", ["tdolls/65/mod/full.webp"])],
        )

    def test_skin_outputs_include_mod_card(self):
        """Skin files sit under `skins/<skinId>/`, and a Mod-skin card becomes `mod_card(_d).webp`."""
        item = {"tier": "skin_art", "doll_id": 65, "skin_id": 30033, "assets": {"card": {}, "mod_card": {}, "full_d": {}}}
        self.assertEqual(
            extract.art_outputs(item),
            [
                ("card", "assets", ["tdolls/65/skins/30033/card.webp", "tdolls/65/skins/30033/card_d.webp"]),
                ("mod_card", "assets", ["tdolls/65/skins/30033/mod_card.webp", "tdolls/65/skins/30033/mod_card_d.webp"]),
                ("full_d", "art", ["tdolls/65/skins/30033/full_d.webp"]),
            ],
        )

    def test_skill_and_equipment_paths(self):
        """Skill icons are per doll slot and equipment icons are keyed by equipment id."""
        item = {"users": [[65, "skill1"], [20, "skill2"]]}
        self.assertEqual(extract.skill_outputs(item), ["tdolls/65/skill1.png", "tdolls/20/skill2.png"])
        self.assertEqual(extract.equip_output({"equip_id": 120}), "equipment/120.png")

    def test_hosted_card_names(self):
        """Hosted card names parse into a form and skin slot, damaged variants and non-cards are ignored."""
        self.assertEqual(extract.parse_hosted_card("65_card.png"), ("normal", None))
        self.assertEqual(extract.parse_hosted_card("65_mod_card.png"), ("mod", None))
        self.assertEqual(extract.parse_hosted_card("65_skin3_card.png"), ("skin", 3))
        self.assertEqual(extract.parse_hosted_card("65_mod_skin12_card.png"), ("mod_skin", 12))
        self.assertIsNone(extract.parse_hosted_card("65_card_d.png"))
        self.assertIsNone(extract.parse_hosted_card("65_skill1.png"))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Encoding and limits


class EncodingTests(unittest.TestCase):
    """Deterministic encoders and the tree size guard."""

    def make_image(self, mode):
        """Build a small image with a gradient so the encoder has real work to do.

        Args:
            mode: `RGB` or `RGBA`.

        Returns:
            A 32x24 image.
        """
        image = Image.new(mode, (32, 24))
        image.putdata([(x * 8, y * 10, (x + y) * 4, 255 - x * 4)[: len(mode)] for y in range(24) for x in range(32)])
        return image

    def test_webp_is_deterministic_and_lossy(self):
        """Encoding the same image twice gives identical bytes, and the result decodes at the same size."""
        for mode in ("RGB", "RGBA"):
            image = self.make_image(mode)
            first = extract.encode_webp(image, 85)
            self.assertEqual(first, extract.encode_webp(image.copy(), 85))
            decoded = Image.open(io.BytesIO(first))
            self.assertEqual((decoded.format, decoded.size, decoded.mode), ("WEBP", (32, 24), mode))

    def test_webp_quality_changes_output(self):
        """The quality setting reaches the encoder."""
        image = self.make_image("RGB")
        self.assertNotEqual(extract.encode_webp(image, 90), extract.encode_webp(image, 10))

    def test_png_is_deterministic_and_lossless(self):
        """PNG output is byte-stable and round-trips the pixels exactly."""
        image = self.make_image("RGBA")
        first = extract.encode_png(image)
        self.assertEqual(first, extract.encode_png(image.copy()))
        self.assertEqual(list(Image.open(io.BytesIO(first)).getdata()), list(image.getdata()))

    def test_tree_limit(self):
        """Trees warn above 900 MB and fail above 1,000 MB."""
        mb = 1048576
        self.assertEqual(extract.tree_limit_status(899 * mb), "ok")
        self.assertEqual(extract.tree_limit_status(950 * mb), "warn")
        self.assertEqual(extract.tree_limit_status(1001 * mb), "over")


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Failure reporting


class ExitDecisionTests(unittest.TestCase):
    """Which missing entries fail the run."""

    def test_known_gaps_do_not_fail(self):
        """Missing entries for the inventory's expected gaps are accepted."""
        missing = [{"key": "skill_icon:ma", "role": "*", "reason": "no bundle holds the files"}]
        self.assertEqual(extract.unexpected_missing(missing, {"skill_icon:ma"}), [])

    def test_decode_failures_and_worker_crashes_fail(self):
        """A decode failure on a known item, or any entry outside the gap list, is unexpected."""
        missing = [
            {"key": "skill_icon:ma", "role": "*", "reason": "no bundle holds the files"},
            {"key": "art:65", "role": "full", "reason": "decode failed"},
            {"key": "worker:equip_icon", "role": "*", "reason": "crashed"},
        ]
        self.assertEqual([row["key"] for row in extract.unexpected_missing(missing, {"skill_icon:ma"})], ["art:65", "worker:equip_icon"])

    def test_expected_gap_keys_come_from_the_inventory(self):
        """The gap list is the inventory summary's expected unresolved keys."""
        inventory = {"summary": {"unresolved_expected": [{"key": "skill_icon:ma"}], "unresolved_unexpected": [{"key": "art:1"}]}}
        self.assertEqual(extract.expected_gap_keys(inventory), {"skill_icon:ma"})

    def test_failure_reasons(self):
        """A clean report passes, and unexpected gaps, oversized files or an over-limit tree each fail it."""
        clean = {"trees": {"assets": {"status": "warn"}}, "oversized": [], "unexpected_missing": []}
        self.assertEqual(extract.failure_reasons(clean), [])
        self.assertEqual(len(extract.failure_reasons({**clean, "unexpected_missing": [{"key": "art:65"}]})), 1)
        self.assertIn("assets/spine/1/X.png", extract.failure_reasons({**clean, "oversized": ["assets/spine/1/X.png"]})[0])
        self.assertEqual(len(extract.failure_reasons({**clean, "trees": {"art": {"status": "over"}}})), 1)

    def test_icon_worker_reports_bundle_load_failure_per_item(self):
        """A bundle that fails to load marks every icon item missing instead of crashing the pool."""

        def loader(_path):
            raise OSError("truncated")

        items = [{"key": "skill_icon:a", "bundles": ["sprites_ui"], "assets": {}, "users": []}, {"key": "skill_icon:b", "bundles": ["sprites_ui"], "assets": {}, "users": []}]
        result = extract.extract_skill_icons(items, "/nonexistent", "/nonexistent", loader=loader)
        self.assertEqual([row["key"] for row in result["missing"]], ["skill_icon:a", "skill_icon:b"])
        self.assertTrue(all("bundle load failed" in row["reason"] for row in result["missing"]))


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Legacy skins


def save_png(root, rel, size, mode="RGB"):
    """Write a solid PNG into a fake clone.

    Args:
        root: The clone root.
        rel: Path inside the clone.
        size: Image size.
        mode: Image mode.
    """
    path = os.path.join(root, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.new(mode, size, (40, 80, 120) if mode == "RGB" else (40, 80, 120, 200)).save(path)


class LegacySkinTests(unittest.TestCase):
    """Skins whose art only the old asset repos host, converted from their `skinN` PNGs."""

    EXTRA = {"doll": 103, "key": "legacy-winter-journey", "name": "Winter Journey", "source": "legacy", "legacySlot": 3, "reason": "r"}

    def test_legacy_extras_are_read_from_the_extras_file(self):
        """Only `legacy` entries are returned, in file order."""
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "extra-skins.json")
            with open(path, "w", encoding="utf-8") as handle:
                handle.write('[{"doll": 44, "key": 502, "source": "game"}, {"doll": 2, "key": "legacy-b", "source": "legacy", "legacySlot": 1}, {"doll": 1, "key": "legacy-a", "source": "legacy", "legacySlot": 2}]')
            self.assertEqual([extra["key"] for extra in extract.load_legacy_skins(path)], ["legacy-b", "legacy-a"])

    def test_sources_map_old_slot_files_to_the_skin_key_folder(self):
        """Cards, Mod cards and full art in slot N land under `skins/<key>/` in their trees."""
        rows = extract.legacy_outputs(self.EXTRA, "/assets", "/art")
        self.assertEqual(
            rows,
            [
                ("card", "/assets/tdolls/103/103_skin3_card.png", "assets", "tdolls/103/skins/legacy-winter-journey/card.webp", True),
                ("card_d", "/assets/tdolls/103/103_skin3_card_d.png", "assets", "tdolls/103/skins/legacy-winter-journey/card_d.webp", True),
                ("mod_card", "/assets/tdolls/103/103_mod_skin3_card.png", "assets", "tdolls/103/skins/legacy-winter-journey/mod_card.webp", False),
                ("mod_card_d", "/assets/tdolls/103/103_mod_skin3_card_d.png", "assets", "tdolls/103/skins/legacy-winter-journey/mod_card_d.webp", False),
                ("full", "/art/tdolls/103/103_skin3_full.png", "art", "tdolls/103/skins/legacy-winter-journey/full.webp", True),
                ("full_d", "/art/tdolls/103/103_skin3_full_d.png", "art", "tdolls/103/skins/legacy-winter-journey/full_d.webp", True),
            ],
        )

    def test_conversion_writes_webp_at_native_size(self):
        """Cards stay 256x512, full art keeps its native size and alpha, and an absent Mod card is skipped."""
        with tempfile.TemporaryDirectory() as tmp:
            assets, art, staging = (os.path.join(tmp, name) for name in ("assets", "art", "staging"))
            save_png(assets, "tdolls/103/103_skin3_card.png", (256, 512))
            save_png(assets, "tdolls/103/103_skin3_card_d.png", (256, 512))
            save_png(art, "tdolls/103/103_skin3_full.png", (1024, 1024), "RGBA")
            save_png(art, "tdolls/103/103_skin3_full_d.png", (1024, 1024), "RGBA")
            result = extract.extract_legacy_skin(self.EXTRA, assets, art, staging)
            self.assertEqual(result["missing"], [])
            self.assertEqual(result["nonstandard"], [])
            self.assertEqual(sorted(row[1] for row in result["files"]), sorted(["tdolls/103/skins/legacy-winter-journey/" + name for name in ("card.webp", "card_d.webp", "full.webp", "full_d.webp")]))
            self.assertEqual({row[3] for row in result["files"]}, {"skin_card", "skin_full"})
            with Image.open(os.path.join(staging, "assets/tdolls/103/skins/legacy-winter-journey/card.webp")) as card:
                self.assertEqual((card.format, card.size), ("WEBP", (256, 512)))
            with Image.open(os.path.join(staging, "art/tdolls/103/skins/legacy-winter-journey/full.webp")) as full:
                self.assertEqual((full.format, full.size, full.mode), ("WEBP", (1024, 1024), "RGBA"))

    def test_missing_required_files_are_reported(self):
        """A missing card or full art is a missing entry keyed `legacy_skin:<doll>:<key>`, and an odd card size is non-standard."""
        with tempfile.TemporaryDirectory() as tmp:
            assets, art, staging = (os.path.join(tmp, name) for name in ("assets", "art", "staging"))
            save_png(assets, "tdolls/103/103_skin3_card.png", (200, 400))
            result = extract.extract_legacy_skin(self.EXTRA, assets, art, staging)
        self.assertEqual([(row["key"], row["role"]) for row in result["missing"]], [("legacy_skin:103:legacy-winter-journey", role) for role in ("card_d", "full", "full_d")])
        self.assertEqual([row["role"] for row in result["nonstandard"]], ["card"])


class LegacySkillIconTests(unittest.TestCase):
    """Skill icons of collaboration dolls, carried from the old asset repo."""

    ITEM = {"key": "skill_icon:doll:1003:skill1", "tier": "skill_icon", "source": "legacy", "status": "legacy", "users": [[1003, "skill1"]]}

    def test_paths_map_the_old_icon_to_the_skin_id_layout(self):
        """`tdolls/<id>/<id>_skill1.png` becomes `tdolls/<id>/skill1.png`."""
        self.assertEqual(extract.legacy_skill_paths(self.ITEM), [("tdolls/1003/1003_skill1.png", "tdolls/1003/skill1.png")])

    def test_icons_are_written_as_png_and_a_missing_one_fails(self):
        """A present icon is re-encoded as PNG under the skill icon tier, and a missing one is a missing entry under the item key."""
        other = {**self.ITEM, "key": "skill_icon:doll:1004:skill1", "users": [[1004, "skill1"]]}
        with tempfile.TemporaryDirectory() as tmp:
            assets, staging = os.path.join(tmp, "assets"), os.path.join(tmp, "staging")
            save_png(assets, "tdolls/1003/1003_skill1.png", (100, 100), "RGBA")
            result = extract.extract_legacy_skill_icons([self.ITEM, other], assets, staging)
            self.assertEqual([row[1:] for row in result["files"]], [["tdolls/1003/skill1.png", result["files"][0][2], "skill_icon"]])
            with Image.open(os.path.join(staging, "assets/tdolls/1003/skill1.png")) as icon:
                self.assertEqual((icon.format, icon.size, icon.mode), ("PNG", (100, 100), "RGBA"))
        self.assertEqual([(row["key"], row["role"]) for row in result["missing"]], [("skill_icon:doll:1004:skill1", "icon")])
        self.assertEqual(result["nonstandard"], [])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Legacy snapshot


def git(repo, *args):
    """Run git in a throwaway repo with a fixed identity.

    Args:
        repo: The repository path.
        *args: Arguments after `git -C <repo>`.

    Returns:
        The stripped standard output.
    """
    env = {**os.environ, "GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@t", "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@t"}
    return subprocess.run(["git", "-C", repo, *args], check=True, capture_output=True, text=True, env=env).stdout.strip()


class LegacySnapshotTests(unittest.TestCase):
    """Choosing, copying and checking the old-layout inputs kept in `tools/assets/.cache/legacy/`."""

    INVENTORY = {
        "items": [
            {"key": "art:65", "tier": "art", "assets": {"card": {"bundle": "b", "path": "p"}}},
            {"key": "mod_art:65", "tier": "mod_art", "assets": {"card": {"bundle": "b", "path": "p"}}},
            {"key": "art:66", "tier": "art", "assets": {}},
            {"key": "skill_icon:doll:1003:skill1", "tier": "skill_icon", "source": "legacy", "users": [[1003, "skill1"]]},
        ]
    }
    EXTRA = {"doll": 103, "key": "legacy-winter-journey", "source": "legacy", "legacySlot": 3}
    ASSETS = [
        "README.md",
        "assets-manifest.json",
        "logo.png",
        "tdolls/65/65_card.png",
        "tdolls/65/65_card_d.png",
        "tdolls/65/65_mod_card.png",
        "tdolls/65/65_mod_card_d.png",
        "tdolls/65/65_skin1_card.png",
        "tdolls/65/65_skin1_card_d.png",
        "tdolls/66/66_card.png",
        "tdolls/66/66_card_d.png",
        "tdolls/67/67_card.png",
        "tdolls/103/103_skin3_card.png",
        "tdolls/103/103_skin3_card_d.png",
        "tdolls/1003/1003_skill1.png",
    ] + list(extract.PROOF_EQUIP_ICONS.values())
    ART = ["tdolls/103/103_skin3_full.png", "tdolls/103/103_skin3_full_d.png"]

    def test_card_targets_need_an_inventory_card_and_a_damaged_twin(self):
        """Base and Mod cards with both halves are targets. Skin slots, dolls without a card asset and lone halves are not."""
        targets = extract.hosted_card_targets(self.INVENTORY, self.ASSETS)
        self.assertEqual([(rel, item["key"]) for rel, item, _role in targets], [("tdolls/65/65_card.png", "art:65"), ("tdolls/65/65_mod_card.png", "mod_art:65")])

    def test_wanted_files_cover_every_legacy_input(self):
        """UI images, legacy skins, collaboration skill icons, proof icons and sampled cards are wanted, and a missing required file is absent."""
        wanted, absent = extract.legacy_wanted(self.INVENTORY, [self.EXTRA], self.ASSETS, self.ART[:1])
        self.assertEqual(absent, ["art/tdolls/103/103_skin3_full_d.png"])
        expected = {("assets", rel) for rel in self.ASSETS if rel not in ("README.md", "assets-manifest.json", "tdolls/65/65_skin1_card.png", "tdolls/65/65_skin1_card_d.png")}
        expected -= {("assets", "tdolls/66/66_card.png"), ("assets", "tdolls/66/66_card_d.png"), ("assets", "tdolls/67/67_card.png")}
        self.assertEqual(set(wanted), expected | {("art", "tdolls/103/103_skin3_full.png")})
        self.assertEqual(wanted, sorted(wanted))

    def test_snapshot_reads_the_ref_not_the_working_tree_and_detects_tampering(self):
        """Files come from the ref even when another branch is checked out, the manifest records commits and blobs, and edits are caught."""
        with tempfile.TemporaryDirectory() as tmp:
            clones = {tree: os.path.join(tmp, tree) for tree in ("assets", "art")}
            for tree, names in (("assets", self.ASSETS), ("art", self.ART)):
                git(tmp, "init", "--quiet", "-b", "main", clones[tree])
                for index, rel in enumerate(names):
                    path = os.path.join(clones[tree], rel)
                    os.makedirs(os.path.dirname(path), exist_ok=True)
                    with open(path, "wb") as handle:
                        handle.write(f"{tree}:{index}".encode())
                git(clones[tree], "add", "--all")
                git(clones[tree], "commit", "--quiet", "-m", "old layout")
                git(clones[tree], "checkout", "--quiet", "--orphan", "rebuild")
                git(clones[tree], "rm", "-r", "-f", "--quiet", ".")
            out = os.path.join(tmp, "legacy")
            manifest = extract.snapshot_legacy(self.INVENTORY, [self.EXTRA], clones, "main", out)
            self.assertEqual(manifest["sources"]["art"]["commit"], git(clones["art"], "rev-parse", "main"))
            with open(os.path.join(out, "assets", "tdolls", "1003", "1003_skill1.png"), "rb") as handle:
                self.assertEqual(handle.read(), f"assets:{self.ASSETS.index('tdolls/1003/1003_skill1.png')}".encode())
            self.assertEqual(extract.check_legacy_snapshot(out)[1], [])
            with open(os.path.join(out, "art", "tdolls", "103", "103_skin3_full.png"), "wb") as handle:
                handle.write(b"changed")
            os.remove(os.path.join(out, "assets", "logo.png"))
            problems = extract.check_legacy_snapshot(out)[1]
            self.assertEqual(len(problems), 2)
            self.assertIn("assets/logo.png is missing", problems)
            self.assertIsNone(extract.check_legacy_snapshot(os.path.join(tmp, "nowhere"))[0])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# Texture lookup


class FakeObject:
    """A stand-in for a UnityPy object reader."""

    def __init__(self, kind, label):
        """Build the fake.

        Args:
            kind: Unity type name such as `Texture2D`.
            label: A value identifying which bundle the object came from.
        """
        self.type = type("Type", (), {"name": kind})()
        self.label = label


class FakeEnv:
    """A stand-in for a loaded UnityPy environment."""

    def __init__(self, container):
        """Build the fake.

        Args:
            container: Map of container path to `FakeObject`.
        """
        self.container = container


class TextureLookupTests(unittest.TestCase):
    """Textures are looked up by the bundle the inventory resolved, not by path alone."""

    def test_twin_bundles_with_the_same_path_do_not_shadow_each_other(self):
        """Two bundles holding the same path each return their own texture."""
        path = "Assets/Characters/X/pic_X.png"
        envs = {"a.ab": FakeEnv({path.lower(): FakeObject("Texture2D", "a")}), "b.ab": FakeEnv({path.lower(): FakeObject("Texture2D", "b")})}
        textures = extract.load_textures(["a", "b"], "", loader=lambda file: envs[os.path.basename(file)])
        self.assertEqual(textures[("a", path.lower())].label, "a")
        self.assertEqual(textures[("b", path.lower())].label, "b")
        self.assertEqual(extract.texture_for(textures, {"bundle": "a", "path": path}).label, "a")
        self.assertEqual(extract.texture_for(textures, {"bundle": "b", "path": path}).label, "b")

    def test_missing_texture_raises(self):
        """An asset whose bundle does not hold the path is a `KeyError`."""
        with self.assertRaises(KeyError):
            extract.texture_for({}, {"bundle": "a", "path": "x.png"})


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# File size limit


class FileSizeTests(unittest.TestCase):
    """The 50 MB per-file limit."""

    def test_limit_names_the_offending_path(self):
        """A file over 50 MB raises with its tree and path, one at the limit passes."""
        extract.check_file_size("assets", "spine/1/X.png", 50 * 1048576)
        with self.assertRaises(ValueError) as caught:
            extract.check_file_size("art", "tdolls/1/full.webp", 50 * 1048576 + 1)
        self.assertIn("art/tdolls/1/full.webp", str(caught.exception))

    def test_write_file_refuses_oversized_data(self):
        """`write_file` checks the size before writing anything."""
        with tempfile.TemporaryDirectory() as staging:
            with self.assertRaises(ValueError):
                extract.write_file(staging, "assets", "big.bin", bytearray(50 * 1048576 + 1), "x", extract.new_result())
            self.assertFalse(os.path.exists(os.path.join(staging, "assets", "big.bin")))

    def test_oversized_files_scan(self):
        """The tree scan lists files over the limit, with a lowered limit for the test."""
        with tempfile.TemporaryDirectory() as root:
            os.makedirs(os.path.join(root, "a"))
            for name, size in (("a/small.bin", 3), ("a/large.bin", 9)):
                with open(os.path.join(root, name), "wb") as handle:
                    handle.write(b"x" * size)
            self.assertEqual(extract.oversized_files(root, limit=5), ["a/large.bin"])


# //////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////
# HOC art


class FakeTexture:
    """A Texture2D reader whose `read()` returns an object holding a decoded image."""

    def __init__(self, image):
        """Build the fake.

        Args:
            image: The decoded image `read().image` returns.
        """
        self.type = type("Type", (), {"name": "Texture2D"})()
        self.data = type("Data", (), {"image": image})()

    def read(self):
        """Return the fake payload.

        Returns:
            An object with an `image` attribute.
        """
        return self.data


class HocFullArtTests(unittest.TestCase):
    """The HOC scene is two background halves with masked character layers on top."""

    def test_layers_use_the_mask_alpha_channel_resized_and_sit_on_their_half(self):
        """Each layer takes its alpha from its resized mask, the left layer over `bgl` and the right one over `bgr`."""
        bgl = Image.new("RGB", (8, 8), (0, 0, 255))
        bgr = Image.new("RGB", (8, 8), (0, 255, 0))
        left = Image.new("RGBA", (8, 8), (255, 0, 0, 255))
        right = Image.new("RGBA", (8, 8), (255, 255, 0, 255))
        # Masks hold their shape in alpha with zero RGB, at half size like the game's 512px masks.
        left_alpha = Image.new("RGBA", (4, 4), (0, 0, 0, 0))
        left_alpha.paste((0, 0, 0, 255), (0, 0, 2, 4))
        right_alpha = Image.new("RGBA", (4, 4), (0, 0, 0, 0))
        full = extract.compose_hoc_full(bgl, bgr, left, left_alpha, right, right_alpha)
        self.assertEqual((full.mode, full.size), ("RGB", (16, 8)))
        self.assertEqual(full.getpixel((1, 4)), (255, 0, 0))
        self.assertEqual(full.getpixel((6, 4)), (0, 0, 255))
        self.assertEqual(full.getpixel((12, 4)), (0, 255, 0))


class HocCardTests(unittest.TestCase):
    """A HOC with no vertical card gets one cropped from its full art around the character layers."""

    def test_derived_card_is_centred_on_the_opaque_mask_pixels(self):
        """Mask pixels at x 12..13 of a 16x8 scene centre the 4px crop on columns 11..14. The right mask sits after `bgl`, not `left`."""
        bgl = Image.new("RGB", (8, 8))
        left = Image.new("RGBA", (6, 8))
        right = Image.new("RGBA", (8, 8))
        left_alpha = Image.new("RGBA", (8, 8), (0, 0, 0, 0))
        right_alpha = Image.new("RGBA", (8, 8), (0, 0, 0, 0))
        right_alpha.paste((0, 0, 0, 255), (4, 0, 6, 8))
        full = Image.new("RGB", (16, 8), (0, 0, 255))
        full.paste((255, 0, 0), (11, 0, 15, 8))
        card = extract.derive_hoc_card(bgl, left, left_alpha, right, right_alpha, full)
        self.assertEqual(card.size, extract.HOC_CARD_SIZE)
        for x in (0, card.width // 2, card.width - 1):
            red, _green, blue = card.convert("RGB").getpixel((x, card.height // 2))
            self.assertGreater(red, 200)
            self.assertLess(blue, 50)

    def test_worker_writes_card_and_full_art_and_derives_a_missing_card(self):
        """The worker writes `hocs/<id>/card.webp` and `full.webp`, flagging the derived card and off-size layers."""
        bundle = "resource_squads"
        roles = {
            "bgl": Image.new("RGB", (8, 8), (0, 0, 255)),
            "bgr": Image.new("RGB", (8, 8), (0, 255, 0)),
            "left": Image.new("RGBA", (8, 8), (255, 0, 0, 255)),
            "left_alpha": Image.new("RGBA", (8, 8), (0, 0, 0, 255)),
            "right": Image.new("RGBA", (8, 8), (255, 255, 0, 255)),
            "right_alpha": Image.new("RGBA", (8, 8), (0, 0, 0, 0)),
        }
        container = {f"assets/{role}.png": FakeTexture(image) for role, image in roles.items()}
        item = {
            "key": "hoc_art:7",
            "tier": "hoc_art",
            "hoc_id": 7,
            "code": "RPG29",
            "bundles": [bundle],
            "assets": {role: {"bundle": bundle, "path": f"Assets/{role}.png"} for role in roles},
        }
        with tempfile.TemporaryDirectory() as staging:
            result = extract.extract_hoc_art_item(item, "", staging, loader=lambda _file: FakeEnv(container))
            self.assertEqual(result["missing"], [])
            self.assertEqual(sorted((row[0], row[1], row[3]) for row in result["files"]), [("art", "hocs/7/full.webp", "hoc_full"), ("assets", "hocs/7/card.webp", "hoc_card")])
            with Image.open(os.path.join(staging, "assets", "hocs", "7", "card.webp")) as card:
                self.assertEqual(card.size, extract.HOC_CARD_SIZE)
            with Image.open(os.path.join(staging, "art", "hocs", "7", "full.webp")) as full:
                self.assertEqual(full.size, (16, 8))
        rows = {row["role"]: row for row in result["nonstandard"]}
        self.assertEqual(rows["card"], {"key": "hoc_art:7", "role": "card", "size": "derived", "expected": list(extract.HOC_CARD_SIZE)})
        self.assertEqual(sorted(rows), ["bgl", "bgr", "card", "left", "right"])

    def test_worker_reports_an_undecodable_layer_and_writes_nothing(self):
        """A scene layer the bundle does not hold is a missing row, and no file is written."""
        item = {"key": "hoc_art:8", "tier": "hoc_art", "hoc_id": 8, "code": "X", "bundles": ["b"], "assets": {role: {"bundle": "b", "path": f"{role}.png"} for role in extract.HOC_SCENE_ROLES}}
        with tempfile.TemporaryDirectory() as staging:
            result = extract.extract_hoc_art_item(item, "", staging, loader=lambda _file: FakeEnv({}))
        self.assertEqual(result["files"], [])
        self.assertEqual(sorted(row["role"] for row in result["missing"]), sorted(extract.HOC_SCENE_ROLES))


if __name__ == "__main__":
    unittest.main()
