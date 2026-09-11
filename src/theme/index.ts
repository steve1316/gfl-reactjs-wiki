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
		// A card is a bordered surface rather than a floating one, since a shadow carries almost no
		// information against a dark ground.
		MuiCard: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: ({ theme }) => ({
					border: `1px solid ${theme.palette.divider}`,
					backgroundImage: "none"
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
