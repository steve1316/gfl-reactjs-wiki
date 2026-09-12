// MaterialUI imports
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

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
	tableContainer: {
		width: "100%"
	},
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.raised
	})
} satisfies Record<string, SxProps<Theme>>;

/** Props for StatsPanel. */
interface StatsPanelProps {
	/** The currently selected form's stats, shown in the stat table. */
	stats: Pick<RawForm, "max_hp" | "max_dmg" | "max_acc" | "max_eva" | "max_rof">;
}

/**
 * The doll's stats at max level.
 *
 * The portrait and the full-art button that used to sit above this table now live in the page's hero,
 * where they no longer repeat artwork the hero was already showing.
 *
 * @param props Component props.
 * @returns The stat table.
 */
export default function StatsPanel({ stats }: StatsPanelProps) {
	return (
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
	);
}
