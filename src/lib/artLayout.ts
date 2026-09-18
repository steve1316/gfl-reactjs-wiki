import type { SxProps, Theme } from "@mui/material";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Measured facts about the published art

/**
 * Card art is 256x512 in every case.
 *
 * Checked across 15 dolls spanning every rarity, weapon class and release era, and all 15 are identical.
 * Forcing any other height overflows the box, and the browser then splits the overflow evenly between
 * top and bottom, which is what removes the head.
 */
export const CARD_ASPECT = "1 / 2";

/** HOC cards are 224x399. */
export const HOC_CARD_ASPECT = "224 / 399";

/** Enemy cards are square: the game ships them as a single 512x512 image rather than the dolls' two-half 256x512 atlas. */
export const ENEMY_CARD_ASPECT = "1 / 1";

/**
 * The enemy page's portrait card is a little taller than its art is square.
 *
 * Measured against the trimmed hero art, whose drawing is a median 0.84 wide for its height across all 232 that have it. A card at
 * that shape is filled by the usual enemy and only mattes the outliers, where a square card mattes almost every one of them.
 */
export const ENEMY_HERO_CARD_ASPECT = "5 / 6";

/**
 * Full art draws from the very top of its canvas.
 *
 * Measured across 15 dolls, the first non-transparent pixel falls between 0.1% and 4.8% down the
 * 1024x1024 canvas, and the drawing then runs down 77% to 99.6% of the height. Anchoring a wide crop to
 * the top therefore keeps the face on every doll. Centring keeps the face on none of them.
 */
export const ART_TOP_ANCHOR = "50% 0%";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Shared style fragments

/** Card art at its own shape, never cropped and never stretched. */
export const cardArtSx: SxProps<Theme> = {
	width: "100%",
	aspectRatio: CARD_ASPECT,
	objectFit: "cover",
	display: "block"
};

/** A box in place of card art that is not hosted yet, at the card art's 1:2 shape. */
export const PLACEHOLDER_SX: SxProps<Theme> = { ...cardArtSx, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover" };

/** Full art filling a wide band, anchored so the face survives the crop. */
export const heroArtSx: SxProps<Theme> = {
	width: "100%",
	height: "100%",
	objectFit: "cover",
	objectPosition: ART_TOP_ANCHOR,
	display: "block"
};

/**
 * Full art filling a positioned box of any shape, letterboxed rather than cropped.
 *
 * A tall box crops horizontally, and these arts sit off-centre sideways: one spans 21% to 76% of the
 * width, another 30% to 82%. Without a per-doll measurement of where the drawing sits, `contain` is
 * honest where a guessed horizontal anchor would slice somebody down the middle. The element is pinned to
 * the box rather than capped with `max*`, since a percentage max height never resolves in a box that sizes
 * to its content, and the 2048px art then drew at full size with its top and bottom cut off.
 */
export const containArtSx: SxProps<Theme> = {
	position: "absolute",
	inset: 0,
	width: "100%",
	height: "100%",
	objectFit: "contain",
	display: "block"
};

/** The small full art button pinned to the bottom right corner of a positioned art box. */
export const FAB_EXPAND_SX: SxProps<Theme> = { position: "absolute", right: 8, bottom: 8, height: 40, width: 40, opacity: 0.85 };
