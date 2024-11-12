import { memo, useCallback, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup } from "@mui/material";
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

/** The Stats card's first view, the stat table. */
const TABLE_VIEW = 0;

/** The Stats card's second view, the exclusive equipment list, offered only for a doll with exclusive equipment. */
const EQUIPMENT_VIEW = 1;

const styles = {
	tableContainer: {
		width: "100%"
	},
	// With the view toggle, the card's content is a column so the panel area can take any height the row gives the card on a wide screen.
	switchable: {
		display: "flex",
		flexDirection: "column"
	},
	// The same full-width toggle the Abilities card uses to switch skills. ToggleButtonGroup is already bundled, where Tabs added 4.7 KB gzip.
	viewToggle: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": { flex: 1 }
	},
	wideOnly: {
		display: { xs: "none", sm: "inline" }
	},
	narrowOnly: {
		display: { xs: "inline", sm: "none" }
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
 * The doll's stats at max level, and a toggle to its exclusive equipment when it has any.
 *
 * The portrait and the full-art button that used to sit above this table now live in the page's hero,
 * where they no longer repeat artwork the hero was already showing.
 *
 * @param props Component props.
 * @returns The stat table, or the table and equipment views with their toggle.
 */
export default memo(function StatsPanel({ stats, exclusiveEquipment }: StatsPanelProps) {
	const [view, setView] = useState(TABLE_VIEW);
	// A click on the already selected button reports null, which keeps the current view rather than clearing it.
	const handleViewChange = useCallback((_event: MouseEvent<HTMLElement>, value: number | null) => {
		if (value !== null) {
			setView(value);
		}
	}, []);

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
		<Box sx={styles.switchable}>
			<ToggleButtonGroup value={view} exclusive onChange={handleViewChange} sx={styles.viewToggle} aria-label="stats view">
				<ToggleButton value={TABLE_VIEW}>At max level</ToggleButton>
				<ToggleButton value={EQUIPMENT_VIEW}>
					{/* The full label wraps onto two lines in a phone-width card, so a phone gets the short one. */}
					<Box component="span" sx={styles.wideOnly}>
						Exclusive equipment
					</Box>
					<Box component="span" sx={styles.narrowOnly}>
						Equipment
					</Box>
					&nbsp;({exclusiveEquipment.length})
				</ToggleButton>
			</ToggleButtonGroup>
			<Box sx={styles.panels}>
				{/* Kept in place while hidden, so the card keeps the table's height in either view. */}
				<Box aria-hidden={view !== TABLE_VIEW} sx={[styles.tablePanel, view !== TABLE_VIEW && styles.hiddenPanel]}>
					{table}
				</Box>
				{view === EQUIPMENT_VIEW ? (
					<Box role="region" aria-label="Exclusive equipment" tabIndex={0} sx={styles.equipmentPanel}>
						<ExclusiveEquipmentPanel items={exclusiveEquipment} />
					</Box>
				) : null}
			</Box>
		</Box>
	);
});
