import { memo, useCallback, useState } from "react";
import type { SyntheticEvent } from "react";

// MaterialUI imports
import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ExclusiveEquipmentPanel from "./ExclusiveEquipmentPanel";
import type { ExclusiveEquipment, RawForm } from "../../types/tdoll";

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

/** The Stats card's first tab, the stat table. */
const TABLE_TAB = 0;

/** The Stats card's second tab, the exclusive equipment list, present only for a doll with exclusive equipment. */
const EQUIPMENT_TAB = 1;

const styles = {
	tableContainer: {
		width: "100%"
	},
	// With tabs, the card's content is a column so the panel area can take any height the row gives the card on a wide screen.
	tabbed: {
		display: "flex",
		flexDirection: "column"
	},
	tabs: {
		mb: 1.5,
		minHeight: 40,
		"& .MuiTab-root": { minHeight: 40, px: 1, textTransform: "none" }
	},
	// The stat table alone decides this area's height. The equipment list is laid over it and scrolls, so a doll with eight items
	// leaves the card the same size as one with a single item.
	panels: {
		position: "relative",
		flexGrow: 1,
		display: "flex",
		flexDirection: "column"
	},
	tablePanel: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		"& > *": { flexGrow: 1 }
	},
	hiddenPanel: {
		visibility: "hidden"
	},
	equipmentPanel: {
		position: "absolute",
		inset: 0,
		overflowY: "auto",
		pr: 0.5
	},
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.raised
	})
} satisfies Record<string, SxProps<Theme>>;

/** Props for StatsPanel. */
interface StatsPanelProps {
	/** The currently selected form's stats, shown in the stat table. */
	stats: Pick<RawForm, "max_hp" | "max_dmg" | "max_acc" | "max_eva" | "max_rof" | "max_armor">;
	/** The doll's exclusive equipment. When there is any, the card gains a second tab listing it. */
	exclusiveEquipment: ExclusiveEquipment[];
}

/**
 * The doll's stats at max level, and a second tab with its exclusive equipment when it has any.
 *
 * The portrait and the full-art button that used to sit above this table now live in the page's hero,
 * where they no longer repeat artwork the hero was already showing.
 *
 * @param props Component props.
 * @returns The stat table, or the table and equipment tabs.
 */
export default memo(function StatsPanel({ stats, exclusiveEquipment }: StatsPanelProps) {
	const [tab, setTab] = useState(TABLE_TAB);
	const handleTabChange = useCallback((_event: SyntheticEvent, value: number) => setTab(value), []);

	const table = (
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
					{stats.max_armor !== undefined && stats.max_armor > 0 ? (
						<TableRow>
							<TableCell component="th" scope="row">
								Armor
							</TableCell>
							<TableCell align="right">{stats.max_armor}</TableCell>
						</TableRow>
					) : null}
				</TableBody>
			</Table>
		</TableContainer>
	);

	if (exclusiveEquipment.length === 0) {
		return table;
	}

	return (
		<Box sx={styles.tabbed}>
			<Tabs value={tab} onChange={handleTabChange} aria-label="Stats and exclusive equipment" sx={styles.tabs}>
				<Tab label="At max level" id="stats-tab-table" aria-controls="stats-panel-table" />
				<Tab label={`Exclusive equipment (${exclusiveEquipment.length})`} id="stats-tab-equipment" aria-controls="stats-panel-equipment" />
			</Tabs>
			<Box sx={styles.panels}>
				{/* Kept in place while hidden, so the card keeps the table's height on either tab. */}
				<Box
					role="tabpanel"
					id="stats-panel-table"
					aria-labelledby="stats-tab-table"
					hidden={false}
					aria-hidden={tab !== TABLE_TAB}
					sx={[styles.tablePanel, tab !== TABLE_TAB && styles.hiddenPanel]}
				>
					{table}
				</Box>
				{tab === EQUIPMENT_TAB ? (
					<Box role="tabpanel" id="stats-panel-equipment" aria-labelledby="stats-tab-equipment" tabIndex={0} sx={styles.equipmentPanel}>
						<ExclusiveEquipmentPanel items={exclusiveEquipment} />
					</Box>
				) : null}
			</Box>
		</Box>
	);
});
