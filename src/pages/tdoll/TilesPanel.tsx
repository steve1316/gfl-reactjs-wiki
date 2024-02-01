import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the tile-set buff description.

// MaterialUI imports
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import TileGrid from "../../components/TileGrid";
import type { RawTileSet } from "../../types/tdoll";

const styles = {
	cardForTileSet: {
		width: "100%"
	},
	title: {
		fontSize: 14
	},
	tileSetDiv: {
		display: "flex"
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
export default function TilesPanel({ tileSet }: TilesPanelProps) {
	// This will create a string with HTML span tags inserted into them for visual clarity.
	const renderTileSetInformation = () => {
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
	};

	return (
		// T-Doll's tileset information.
		<Card sx={styles.cardForTileSet}>
			<Box component="div" sx={styles.tileSetDiv}>
				<CardContent sx={styles.content}>
					<TileGrid rows={[tileSet.row1, tileSet.row2, tileSet.row3]} />
				</CardContent>

				<CardContent sx={styles.tileSetInformation}>
					<Typography sx={styles.title} color="textPrimary" gutterBottom>
						{tileSet.targets}
					</Typography>
					<Typography color="textSecondary">{parse(renderTileSetInformation())}</Typography>
				</CardContent>
			</Box>
		</Card>
	);
}
