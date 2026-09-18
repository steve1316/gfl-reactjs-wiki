import type { PaletteOptions } from "@mui/material";

/**
 * The palette, "Warm steel".
 *
 * Warm neutral greys carry the chrome so the artwork keeps all the saturation, with amber as the
 * accent and cyan as a second signal. Every foreground and background pair here clears WCAG AA for
 * normal text, which the old theme did not: it painted rarity stars with the CSS keyword `yellow` and
 * left `background.default` and `background.paper` both at `#121212`, so a card never separated from
 * the page except by its shadow.
 *
 * The site is dark only, so there is one palette and no mode switching.
 */

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Rarity and weapon type

/**
 * Star-rating colours, keyed by the `rarity` field in the doll data.
 *
 * The game numbers these oddly: 2 to 5 run General, Rare, Epochal and Legendary, while 1 means Extra,
 * a separate class rather than the lowest rank. Rarity 6 exists only on Mod dolls and is included so
 * a lookup cannot miss, though `MOD_RARITY_COLOUR` covers those in practice.
 */
export const RARITY_COLOURS = {
	1: "#d79aec",
	2: "#8a92a2",
	3: "#5fd3a0",
	4: "#7fb2f0",
	5: "#ffc44d",
	6: "#ff5d7a"
} as const;

/**
 * The colour a Mod doll's stars take, whatever its rarity.
 *
 * Mods run at rarity 4, 5 and 6, so without this they would be indistinguishable from an ordinary
 * doll of the same rank. Deliberately far from every hue in `RARITY_COLOURS` and from the amber
 * accent, since the point is that a Mod is recognised at a glance.
 */
export const MOD_RARITY_COLOUR = "#ff5d7a";

/** Weapon-class colours, keyed by the `type` field in the doll data. */
export const WEAPON_TYPE_COLOURS = {
	HG: "#d79aec",
	SMG: "#7fb2f0",
	RF: "#e2b06a",
	AR: "#5fd3a0",
	MG: "#e88a90",
	SG: "#63c6db"
} as const;

/**
 * Faction colours for the enemy chips, keyed by the faction name in the enemy data.
 *
 * Sangvis Ferri takes the site's own amber, since it is the faction the archive is mostly about. The green is lighter than a true
 * dark green because `FilterChip` paints an unselected chip's text in this same colour, and a darker one fails contrast against the
 * page. Other is deliberately absent: it is a catch-all, not a faction, so it keeps the default outline.
 */
export const FACTION_COLOURS = {
	"Sangvis Ferri": "#ff8a1f",
	KCCO: "#3f9c67",
	Paradeus: "#eceff4"
} as const;

/**
 * Ingredient colours used inside skill descriptions.
 *
 * These belong to the VA-11 Hall-A collaboration dolls, whose skill text names drink ingredients that
 * the game prints in their own colours. They were five loose hex literals inside a chain of
 * `replaceAll` calls before.
 */
export const INGREDIENT_COLOURS = {
	Adelhyde: "#db3d3d",
	Flanergide: "#70ad47",
	Karmotrine: "#91c1f0",
	"Bronson Ext": "#ffb400",
	"Pwd Delta": "#3a94e8"
} as const;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// The palette

/** The only palette the site has. */
export const darkPalette: PaletteOptions = {
	mode: "dark",
	primary: { main: "#ff8a1f", contrastText: "#0f1114" },
	secondary: { main: "#2fd6d6", contrastText: "#0f1114" },
	background: { default: "#0f1114", paper: "#161920" },
	text: { primary: "#e4e7ec", secondary: "#8a92a2" },
	divider: "#262b35",
	raised: "#1e222b",
	rarity: RARITY_COLOURS,
	weaponType: WEAPON_TYPE_COLOURS,
	ingredient: INGREDIENT_COLOURS,
	tile: { empty: "#2e3440", line: "#5a6373", self: "#e8ecf2", buff: "#2fd6d6" },
	stripe: { dark: "#0d1015", light: "#14181f" }
};
