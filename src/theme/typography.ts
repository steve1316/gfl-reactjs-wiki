import type { ThemeOptions } from "@mui/material";

/**
 * Seven type steps, replacing MUI's thirteen.
 *
 * The old theme never set typography at all, so `h1` was MUI's stock 6rem and no page could use it:
 * the titles borrowed `h5` instead. These sizes are what the site actually renders, each given a
 * mobile value and a larger desktop one through `@media`.
 *
 * No web font is loaded. The stack resolves to Roboto on Android, Segoe UI on Windows and the system
 * face elsewhere, which costs nothing to download and cannot flash on first paint. `styles.css` asked
 * for Roboto for years without ever loading it, so this is the first time the declared face is the
 * one that renders.
 */

/** Breakpoint at which the larger sizes take over. Matches MUI's `sm`. */
const DESKTOP = "@media (min-width:600px)";

/** Fonts present on every platform the site is read on, in preference order. */
export const FONT_STACK = ['Roboto', '"Segoe UI"', "system-ui", "-apple-system", '"Helvetica Neue"', "Arial", "sans-serif"].join(", ");

/**
 * Build one step of the scale.
 *
 * @param mobile Size in pixels below the `sm` breakpoint.
 * @param desktop Size in pixels at `sm` and above.
 * @param weight Font weight.
 * @param extra Any further declarations for this step.
 * @returns A typography variant.
 */
function step(mobile: number, desktop: number, weight: number, extra: Record<string, unknown> = {}) {
	return {
		fontSize: `${mobile / 16}rem`,
		fontWeight: weight,
		[DESKTOP]: { fontSize: `${desktop / 16}rem` },
		...extra
	};
}

/**
 * The type scale, mapped onto the variants the pages actually ask for.
 *
 * The variants are not used the way MUI intends them: `h3` is the doll name, while `h5` and `h6` are
 * page and card titles. A theme cannot rename a call site, so the sizes are hung on the variants as
 * they are used rather than on the names MUI gives them. `h1` and `h2` stay defined and unused, so a
 * future page has something larger to reach for.
 */
export const typography: ThemeOptions["typography"] = {
	fontFamily: FONT_STACK,
	h1: step(40, 48, 700, { lineHeight: 1.05, letterSpacing: "-0.015em" }),
	h2: step(34, 40, 700, { lineHeight: 1.08, letterSpacing: "-0.01em" }),
	// The doll name, the single largest thing the site renders today.
	h3: step(30, 38, 700, { lineHeight: 1.1, letterSpacing: "-0.01em" }),
	h4: step(24, 28, 700, { lineHeight: 1.2 }),
	// Page titles and card titles both land here.
	h5: step(19, 22, 650, { lineHeight: 1.3 }),
	// The bar title and the index page headings.
	h6: step(16, 18, 650, { lineHeight: 1.35 }),
	subtitle1: step(14, 15, 500, { lineHeight: 1.5 }),
	subtitle2: step(13, 13.5, 500, { lineHeight: 1.45 }),
	body1: step(14, 15, 400, { lineHeight: 1.6 }),
	body2: step(13, 14, 400, { lineHeight: 1.55 }),
	caption: step(12.5, 13, 400, { lineHeight: 1.45 }),
	overline: step(11, 11.5, 700, { lineHeight: 1.4, letterSpacing: "0.1em", textTransform: "uppercase" }),
	button: { textTransform: "none", fontWeight: 650 }
};
