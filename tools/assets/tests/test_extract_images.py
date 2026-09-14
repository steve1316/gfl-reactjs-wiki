"""Unit tests for the image logic in `extract_game_assets`, run with `python3 -m unittest discover tools/assets/tests`.

Every image here is a tiny synthetic one built in memory. No test reads a bundle or touches the network.
"""

import io
import os
import sys
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
        self.assertEqual([extract.rarity_background(rarity) for rarity in (2, 3, 4, 5)], ["底纹_白", "底纹_蓝", "底纹_绿", "底纹_黄"])

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


if __name__ == "__main__":
    unittest.main()
