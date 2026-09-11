import { createTheme } from "@mui/material";

import { darkPalette } from "./palette";
import { typography } from "./typography";

/**
 * The application theme.
 *
 * Component defaults live here rather than in each page's `sx`, so a card looks the same on the doll
 * page as it does on the equipment index without either file saying so.
 */
export const theme = createTheme({
	palette: darkPalette,
	typography,
	shape: { borderRadius: 8 },
	components: {
		// Stat figures have to line up down a column, and proportional digits do not.
		MuiTableCell: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderBottomColor: theme.palette.divider,
					fontVariantNumeric: "tabular-nums"
				})
			}
		},
		// A card lifts off the page rather than being outlined. On a dark ground a shadow alone reads
		// weakly, so most of the lift comes from the lighter surface and the shadow only softens the
		// edge. Pages used to pass `elevation={12}` at every call site, which stacked MUI's heaviest
		// shadow on top of whatever the theme said.
		MuiCard: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundColor: theme.palette.raised,
					backgroundImage: "none",
					boxShadow: "0 2px 5px rgba(0, 0, 0, 0.4), 0 8px 18px rgba(0, 0, 0, 0.3)"
				})
			}
		},
		// MUI lightens dark surfaces with an overlay gradient as elevation rises, which fights a palette
		// that already says what each surface should be.
		MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
		MuiChip: { styleOverrides: { root: { fontWeight: 650 } } },
		MuiTooltip: {
			styleOverrides: {
				tooltip: ({ theme }) => ({
					backgroundColor: theme.palette.raised,
					color: theme.palette.text.primary,
					border: `1px solid ${theme.palette.divider}`,
					fontSize: "0.78rem"
				})
			}
		},
		MuiAppBar: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundColor: theme.palette.raised,
					backgroundImage: "none",
					borderBottom: `1px solid ${theme.palette.divider}`,
					color: theme.palette.text.primary
				})
			}
		}
	}
});

export { FONT_STACK } from "./typography";
export { INGREDIENT_COLOURS } from "./palette";
