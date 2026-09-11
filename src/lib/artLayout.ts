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

/** Full art filling a wide band, anchored so the face survives the crop. */
export const heroArtSx: SxProps<Theme> = {
	width: "100%",
	height: "100%",
	objectFit: "cover",
	objectPosition: ART_TOP_ANCHOR,
	display: "block"
};

/**
 * Full art in a tall or unknown-shaped box.
 *
 * A tall box crops horizontally, and these arts sit off-centre sideways: one spans 21% to 76% of the
 * width, another 30% to 82%. Without a per-doll measurement of where the drawing sits, `contain` is
 * honest where a guessed horizontal anchor would slice somebody down the middle. Capped with `max*`
 * rather than forced to `100%`, so a box bigger than the art's natural size does not upscale it.
 */
export const containArtSx: SxProps<Theme> = {
	maxWidth: "100%",
	maxHeight: "100%",
	objectFit: "contain",
	display: "block"
};
