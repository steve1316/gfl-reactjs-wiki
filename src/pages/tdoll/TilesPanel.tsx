import type { JSX } from "react";
import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the tile-set buff description.

// MaterialUI imports
import { Box, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { RawForm, RawTileSet } from "../../types/tdoll";

/**
 * The stat rows on the doll page, in display order.
 *
 * These were five hand-written table rows differing only by label and field, which is how the header
 * and the rows drifted apart in wording. Listing them keeps the order and the labels in one place.
 */
const STAT_ROWS = [
	{ label: "HP", key: "max_hp" },
	{ label: "Damage", key: "max_dmg" },
	{ label: "Accuracy", key: "max_acc" },
	{ label: "Evasion", key: "max_eva" },
	{ label: "Rate of fire", key: "max_rof" }
] as const;

const styles = {
	cardForTileSet: {
		width: "100%"
	},
	tableContainer: {
		width: "100%"
	},
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.raised
	}),
	title: {
		fontSize: 14
	},
	tableTileSet: (theme: Theme) => ({
		width: 100,
		height: 100,
		borderStyle: "solid",
		borderColor: theme.palette.divider,
		borderSpacing: 0,
		borderWidth: 2
	}),
	blackTile: (theme: Theme) => ({
		backgroundColor: theme.palette.raised,
		width: "33%",
		borderStyle: "solid",
		borderColor: theme.palette.divider,
		borderWidth: 1
	}),
	cyanTile: (theme: Theme) => ({
		backgroundColor: theme.palette.tile.buff,
		width: "33%",
		borderStyle: "solid",
		borderColor: theme.palette.divider,
		borderWidth: 1
	}),
	whiteTile: (theme: Theme) => ({
		backgroundColor: theme.palette.tile.self,
		width: "33%",
		borderStyle: "solid",
		borderColor: theme.palette.divider,
		borderWidth: 1
	}),
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
	/** The currently selected form's stats, shown in the stat table. */
	stats: Pick<RawForm, "max_hp" | "max_dmg" | "max_acc" | "max_eva" | "max_rof">;
}

/**
 * The doll's tile buff grid and its stat table.
 *
 * @param props Component props.
 * @returns The tileset card and the stat table.
 */
export default function TilesPanel({ tileSet, stats }: TilesPanelProps) {
	// This function will return tiles depending on the tile set information in the JSON.
	const createTileSetRow = (tile: number, index: number) => {
		let temp: JSX.Element;
		if (tile === 0) {
			temp = <Box component="td" sx={styles.blackTile} key={index}></Box>;
		} else if (tile === 1) {
			temp = <Box component="td" sx={styles.cyanTile} key={index}></Box>;
		} else {
			temp = <Box component="td" sx={styles.whiteTile} key={index}></Box>;
		}

		return temp;
	};

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
		<>
			{/************** T-Doll's tileset information **************/}
			<Card sx={styles.cardForTileSet}>
				<Box component="div" sx={styles.tileSetDiv}>
					<CardContent sx={styles.content}>
						<Box component="table" sx={styles.tableTileSet} id="tdoll-tileset">
							<tbody>
								<tr>
									{tileSet.row1.map((tile, index) => {
										return createTileSetRow(tile, index);
									})}
								</tr>
								<tr>
									{tileSet.row2.map((tile, index) => {
										return createTileSetRow(tile, index);
									})}
								</tr>
								<tr>
									{tileSet.row3.map((tile, index) => {
										return createTileSetRow(tile, index);
									})}
								</tr>
							</tbody>
						</Box>
					</CardContent>

					<CardContent sx={styles.tileSetInformation}>
						<Typography sx={styles.title} color="textPrimary" gutterBottom>
							{tileSet.targets}
						</Typography>
						<Typography color="textSecondary">{parse(renderTileSetInformation())}</Typography>
					</CardContent>
				</Box>
			</Card>

			<br />

			{/************** T-Doll's stats in table format **************/}
			<TableContainer sx={styles.tableContainer} component={Paper}>
				<Table sx={styles.table} size="small">
					<TableHead>
						<TableRow>
							<TableCell>Stats</TableCell>
							<TableCell align="right">At max level</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{STAT_ROWS.map((stat) => (
							<TableRow key={stat.key}>
								<TableCell component="th" scope="row">
									{stat.label}
								</TableCell>
								<TableCell align="right">{stats[stat.key]}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
