import { useCallback } from "react";
import type { ChangeEvent } from "react";

// MaterialUI imports
import { Box, Chip, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const styles = {
	summaryRow: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 1,
		mt: 2
	},
	summaryStart: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 1
	},
	sortControls: {
		display: "flex",
		alignItems: "center",
		gap: 0.5
	},
	sortSelect: {
		minWidth: 160
	},
	activeChipList: {
		display: "flex",
		flexWrap: "wrap",
		gap: 0.5
	}
} satisfies Record<string, SxProps<Theme>>;

/** One active filter, shown as a removable chip. */
export interface ActiveFilter {
	/** Stable id, unique within the list. */
	id: string;
	/** The chip's text. */
	label: string;
	/** Clears just this filter. */
	onDelete: () => void;
}

/** One entry in the Sort by menu. */
export interface SortOption<K extends string> {
	/** The sort key this entry selects. */
	value: K;
	/** The menu text. */
	label: string;
}

/** Props for IndexSummaryBar. */
interface IndexSummaryBarProps<K extends string> {
	/** The shown range, such as "1-30", or "0" when nothing matches. */
	rangeLabel: string;
	/** How many results match the filters. */
	total: number;
	/** The active filters, each rendered as a removable chip. */
	activeFilters: ActiveFilter[];
	/** The sort select's element id, unique on the page. */
	sortId: string;
	/** The Sort by menu's entries, in menu order. */
	sortOptions: ReadonlyArray<SortOption<K>>;
	/** The current sort key. */
	sortKey: K;
	/** Called with the chosen sort key. */
	onSortKeyChange: (key: K) => void;
	/** Whether the order is reversed. */
	sortDescending: boolean;
	/** Flips the sort direction. */
	onToggleSortDirection: () => void;
}

/**
 * The line above an index's results: how many are shown, the active filters as removable chips, and the sort controls.
 *
 * @param props Component props.
 * @returns The summary bar.
 */
export default function IndexSummaryBar<K extends string>({
	rangeLabel,
	total,
	activeFilters,
	sortId,
	sortOptions,
	sortKey,
	onSortKeyChange,
	sortDescending,
	onToggleSortDirection
}: IndexSummaryBarProps<K>) {
	// The select reports a plain string, so it is matched back to one of the options before it reaches the page.
	const handleSortKeyChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const option = sortOptions.find((entry) => entry.value === event.target.value);
			if (option) {
				onSortKeyChange(option.value);
			}
		},
		[sortOptions, onSortKeyChange]
	);

	return (
		<Box sx={styles.summaryRow}>
			<Box sx={styles.summaryStart}>
				<Typography variant="body1" color="textSecondary">
					Showing {rangeLabel} of {total}
				</Typography>

				{/* The active chips stay on screen even while the panel is collapsed on a phone, so a
				    narrowed result set never looks like a bug. */}
				{activeFilters.length > 0 && (
					<Box sx={styles.activeChipList}>
						{activeFilters.map((filter) => (
							<Chip key={filter.id} label={filter.label} onDelete={filter.onDelete} size="small" />
						))}
					</Box>
				)}
			</Box>

			<Box sx={styles.sortControls}>
				<TextField id={sortId} select size="small" label="Sort by" value={sortKey} onChange={handleSortKeyChange} sx={styles.sortSelect}>
					{sortOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>
				<Tooltip title={sortDescending ? "Descending" : "Ascending"}>
					<IconButton onClick={onToggleSortDirection} aria-label="Descending order" aria-pressed={sortDescending}>
						{sortDescending ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}
