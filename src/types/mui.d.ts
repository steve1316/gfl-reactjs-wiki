import type { INGREDIENT_COLOURS, RARITY_COLOURS, WEAPON_TYPE_COLOURS } from "../theme/palette";

/**
 * Extra palette slots this site needs.
 *
 * Rarity, weapon type and the collaboration ingredient colours are driven by the doll data rather
 * than by a component's state, so they belong in the palette instead of being written inline at each
 * use. Declaring them here makes `theme.palette.rarity[5]` typed rather than a string lookup.
 */
declare module "@mui/material/styles" {
	interface Palette {
		/** One step above `background.paper`, for panels that sit on top of a card. */
		raised: string;
		/** Star colours keyed by the doll's `rarity` value, where 1 means Extra rather than lowest. */
		rarity: Record<keyof typeof RARITY_COLOURS, string>;
		/** Weapon-class colours keyed by the doll's `type` value. */
		weaponType: Record<keyof typeof WEAPON_TYPE_COLOURS, string>;
		/** Drink-ingredient colours named in the VA-11 Hall-A collaboration skill text. */
		ingredient: Record<keyof typeof INGREDIENT_COLOURS, string>;
		/** The formation tile grid: an unused square, the doll's own square, and a buffed one. */
		tile: { empty: string; self: string; buff: string };
		/** The two tones of the diagonal stripe behind the animation panel. */
		stripe: { dark: string; light: string };
	}

	interface PaletteOptions {
		/** One step above `background.paper`, for panels that sit on top of a card. */
		raised?: string;
		/** Star colours keyed by the doll's `rarity` value, where 1 means Extra rather than lowest. */
		rarity?: Record<keyof typeof RARITY_COLOURS, string>;
		/** Weapon-class colours keyed by the doll's `type` value. */
		weaponType?: Record<keyof typeof WEAPON_TYPE_COLOURS, string>;
		/** Drink-ingredient colours named in the VA-11 Hall-A collaboration skill text. */
		ingredient?: Record<keyof typeof INGREDIENT_COLOURS, string>;
		/** The formation tile grid: an unused square, the doll's own square, and a buffed one. */
		tile?: { empty: string; self: string; buff: string };
		/** The two tones of the diagonal stripe behind the animation panel. */
		stripe?: { dark: string; light: string };
	}
}
