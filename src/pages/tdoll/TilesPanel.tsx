import { memo, useMemo } from "react";
import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the tile-set buff description.

// MaterialUI imports
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import TileGrid from "../../components/TileGrid";
import type { RawTileSet } from "../../types/tdoll";

const styles = {
	// The card is stretched to match the Stats and Skills cards beside it on a wide screen, so its content is
	// centred both ways rather than left parked in the top-left corner of the extra space.
	cardForTileSet: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	title: {
		fontSize: 14
	},
	tileSetDiv: {
		display: "flex",
		alignItems: "center"
	},
	content: {
		flex: "0 1 auto"
	},
	tileSetInformation: {
		display: "flex",
		flexDirection: "column"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for TilesPanel. */
interface TilesPanelProps {
	/** The currently selected form's 3x3 tile buff grid and buff description. */
	tileSet: RawTileSet;
}

/**
 * The doll's tile buff grid.
 *
 * @param props Component props.
 * @returns The tileset card.
 */
export default memo(function TilesPanel({ tileSet }: TilesPanelProps) {
	// The buff text with HTML span tags inserted for visual clarity. Derived once per tile set rather than on every render.
	const tileSetInformation = useMemo(() => {
		var number_of_stats = tileSet.number_of_stats;
		var tempStat = "";
		switch (number_of_stats) {
			case 1:
				tempStat = tileSet.stat1[0] + '<span style="color: yellow;"><ins>' + tileSet.stat2[0] + "</ins></span>";
				break;
			case 2:
				tempStat =
					tileSet.stat1[0] +
					'<span style="color: yellow;"><ins>' +
					tileSet.stat2[0] +
					"</ins></span> <br />" +
					tileSet.stat1[1] +
					'<span style="color: yellow;"><ins>' +
					tileSet.stat2[1] +
					"</ins></span>";
				break;
			default:
		}

		return tempStat;
	}, [tileSet]);

	// A new array each render would re-render the memoised TileGrid every time.
	const rows = useMemo(() => [tileSet.row1, tileSet.row2, tileSet.row3], [tileSet]);

	return (
		// T-Doll's tileset information.
		<Card sx={styles.cardForTileSet}>
			<Box component="div" sx={styles.tileSetDiv}>
				<CardContent sx={styles.content}>
					<TileGrid rows={rows} />
				</CardContent>

				<CardContent sx={styles.tileSetInformation}>
					<Typography sx={styles.title} color="textPrimary" gutterBottom>
						{tileSet.targets}
					</Typography>
					<Typography color="textSecondary">{parse(tileSetInformation)}</Typography>
				</CardContent>
			</Box>
		</Card>
	);
});
