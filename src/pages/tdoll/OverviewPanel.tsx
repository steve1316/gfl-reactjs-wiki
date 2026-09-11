import { Link } from "react-router-dom";

// MaterialUI imports
import { Card, CardActionArea, CardMedia, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { cardArtSx } from "../../lib/artLayout";
import type { RawForm } from "../../types/tdoll";

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
	cardForImage: {
		...cardArtSx,
		// Capped at the artwork's own 256px rather than stretched, since upscaling a bitmap that is
		// already undersampled at this pixel ratio only makes it softer.
		maxWidth: 256,
		mx: "auto",
		marginBottom: "10px",
		// Anchors fabExpand, which is clipped by this card's inherited overflow: hidden otherwise.
		position: "relative"
	},
	fabExpand: {
		position: "absolute",
		right: 8,
		bottom: 8,
		height: 40,
		width: 40,
		opacity: 0.85
	},
	tableContainer: {
		width: "100%",
		mt: 2
	},
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.raised
	})
} satisfies Record<string, SxProps<Theme>>;

/** Props for OverviewPanel. */
interface OverviewPanelProps {
	/** URL of the portrait currently on screen. */
	tdollImage: string | undefined;
	/** Called when the portrait is clicked, toggling the damaged art. */
	onCardImageClick: () => void;
	/** Name of the form currently selected, used as the portrait's title. */
	dollName: string;
	/** The doll's base id, used to link to its full art page. */
	normalId: number;
	/** The currently selected form's stats, shown in the stat table. */
	stats: Pick<RawForm, "max_hp" | "max_dmg" | "max_acc" | "max_eva" | "max_rof">;
}

/**
 * The doll's portrait card, its stat table, and the full-art floating button.
 *
 * The skin tabs and the Mod toggle that used to live here now live in the page's hero, so this card
 * is left with only the card art and the one floating button the hero does not carry.
 *
 * @param props Component props.
 * @returns The portrait card and the stat table.
 */
export default function OverviewPanel({ tdollImage, onCardImageClick, dollName, normalId, stats }: OverviewPanelProps) {
	return (
		<>
			<Card sx={styles.cardForImage}>
				<CardActionArea onClick={onCardImageClick}>
					<CardMedia component="img" sx={styles.cardForImage} image={tdollImage} title={dollName} />
				</CardActionArea>

				{/************** Floating Action Button overlayed over image at the bottom right **************/}
				<Fab color="primary" component={Link} to={`/tdoll/${normalId}/art`} sx={styles.fabExpand} aria-label="view full art">
					<ZoomOutMapIcon />
				</Fab>
			</Card>

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
