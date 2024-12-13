import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Container, Divider, Grid } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import FilterChip from "../../components/FilterChip";
import FilterPanel from "../../components/FilterPanel";
import { ChipRow, ChipRowDivider } from "../../components/FilterRows";
import IndexSummaryBar from "../../components/IndexSummaryBar";
import type { ActiveFilter, SortOption } from "../../components/IndexSummaryBar";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import FairyCard from "./FairyCard";

import { FAIRY_MAX_STARS, FAIRY_STAT_KEYS, FAIRY_STAT_LABELS, fairyStats } from "../../lib/fairyStats";
import { matchesAnyName, normaliseName } from "../../lib/nameSearch";
import { useFairies } from "../../lib/useFairies";
import type { Fairy, FairyStatKey, FairyStatValues } from "../../types/fairy";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** The session storage key this page keeps its filters and sort under. */
const STORAGE_KEY = "fairyFilters";

/** The chip value for the source filter, kept apart from the type names it is offered alongside. */
const COLLAB_CHIP = "Collab";

/** What the results can be sorted by. */
type SortKey = "type" | "name" | FairyStatKey;

/** The sort menu's entries, in menu order. */
const SORT_OPTIONS: SortOption<SortKey>[] = [{ value: "type", label: "Type" }, { value: "name", label: "Name" }, ...FAIRY_STAT_KEYS.map((key) => ({ value: key, label: FAIRY_STAT_LABELS[key] }))];

/** Compares names so digits order by value and case is ignored. Built once rather than per comparison. */
const NAME_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** One Fairy placed in the index: the Fairy plus its stats at level 100 and 5 stars and its position in type order. */
interface IndexFairy extends Fairy {
	/** Stats at level 100 and 5 stars, shown on the tile and used by the stat sorts. */
	maxStats: FairyStatValues;
	/** Position in type order then id order, which is the default sort. */
	order: number;
	/** The name passed through `normaliseName`, worked out once per load for the name search. */
	searchKey: string;
}

/** What this page saves to session storage. */
interface SavedFilters {
	/** Type names and, if on, `"Collab"`, whose chips are on. */
	chips: string[];
	/** The name search text. */
	name: string;
	/** What the results are sorted by. */
	sortKey: SortKey;
	/** Whether the sort is reversed. */
	sortDescending: boolean;
}

/** The state a first visit starts from. */
const DEFAULT_FILTERS: SavedFilters = { chips: [], name: "", sortKey: "type", sortDescending: false };

/** The type list before the data loads. Shared so the memoised rows keep a stable dependency. */
const NO_TYPES: string[] = [];

const styles = {
	root: { py: 3 },
	summaryContainer: { pt: 2 },
	cardGrid: { pt: 4, pb: 8 },
	topDivider: { mt: "10px", mb: "25px" }
} satisfies Record<string, SxProps<Theme>>;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers

/**
 * Whether a value is one of the sort keys, for a sort read back from session storage.
 *
 * @param value The stored value.
 * @returns True when it names a sort key.
 */
function isSortKey(value: unknown): value is SortKey {
	return SORT_OPTIONS.some((option) => option.value === value);
}

/**
 * Read the saved filters, keeping only values that are still valid.
 *
 * @returns The saved filters, with defaults for anything missing or unreadable.
 */
function readSavedFilters(): SavedFilters {
	let saved: Record<string, unknown>;
	try {
		const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
		if (typeof parsed !== "object" || parsed === null) {
			return DEFAULT_FILTERS;
		}
		saved = parsed as Record<string, unknown>;
	} catch {
		return DEFAULT_FILTERS;
	}
	return {
		chips: Array.isArray(saved.chips) ? saved.chips.filter((label): label is string => typeof label === "string") : [],
		name: typeof saved.name === "string" ? saved.name : "",
		sortKey: isSortKey(saved.sortKey) ? saved.sortKey : "type",
		sortDescending: saved.sortDescending === true
	};
}

/**
 * Sort the matching Fairies. Ties fall back to type order.
 *
 * @param entries The matching Fairies, left unchanged.
 * @param key What to sort by.
 * @param descending Whether to reverse the order.
 * @returns A sorted copy, or `entries` itself for ascending type order, which it is already in.
 */
function sortEntries(entries: IndexFairy[], key: SortKey, descending: boolean): IndexFairy[] {
	if (key === "type" && !descending) {
		return entries;
	}
	const direction = descending ? -1 : 1;
	return [...entries].sort((a, b) => {
		let order: number;
		switch (key) {
			case "type":
				order = a.order - b.order;
				break;
			case "name":
				order = NAME_COLLATOR.compare(a.name, b.name);
				break;
			default:
				order = a.maxStats[key] - b.maxStats[key];
		}
		return direction * order || a.order - b.order;
	});
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Page

/**
 * The Fairy index: every Fairy, filterable by type and source and sortable by any stat.
 *
 * @returns The Fairy index page.
 */
export default function FairyIndex() {
	const { data, loadFailed, retry: handleRetryLoad } = useFairies();

	// Read once, on the first render, so a restored visit never flashes the defaults.
	const [saved] = useState(readSavedFilters);
	const [selectedChips, setSelectedChips] = useState<ReadonlySet<string>>(() => new Set(saved.chips));
	const [nameQuery, setNameQuery] = useState(saved.name);
	const [sortKey, setSortKey] = useState<SortKey>(saved.sortKey);
	const [sortDescending, setSortDescending] = useState(saved.sortDescending);

	const deferredQuery = useDeferredValue(nameQuery);

	const types = data?.types ?? NO_TYPES;
	// The type chips plus the Collab chip, in the order the row renders them.
	const chipOptions = useMemo(() => [...types, COLLAB_CHIP], [types]);

	// Every Fairy in type order, each with its level-100, 5-star stats worked out once per load.
	const entries = useMemo(
		(): IndexFairy[] =>
			data === null
				? []
				: data.types
						.flatMap((label) => data.items.filter((fairy) => fairy.typeName === label))
						.map((fairy, order) => ({
							...fairy,
							maxStats: fairyStats(fairy, data.constants, data.constants.maxLevel, FAIRY_MAX_STARS),
							order,
							searchKey: normaliseName(fairy.name)
						})),
		[data]
	);

	const matches = useMemo(() => {
		const query = normaliseName(deferredQuery);
		// Only types the data still has count, so a type saved from an older dataset cannot silently empty the list.
		const typeOn = types.some((label) => selectedChips.has(label));
		const collabOn = selectedChips.has(COLLAB_CHIP);
		const anyChipOn = typeOn || collabOn;
		return entries.filter((entry) => (!anyChipOn || selectedChips.has(entry.typeName) || (collabOn && entry.source === "Collab")) && matchesAnyName([entry.searchKey], query));
	}, [entries, types, selectedChips, deferredQuery]);

	const sorted = useMemo(() => sortEntries(matches, sortKey, sortDescending), [matches, sortKey, sortDescending]);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Fairy Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of Fairies");
	}, []);

	// Remember everything for the rest of the tab, so coming back from a Fairy page restores the view.
	useEffect(() => {
		const filters: SavedFilters = { chips: [...selectedChips], name: nameQuery, sortKey, sortDescending };
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
		} catch {
			// Storage can be blocked, such as in a locked-down browser. The view is just not remembered then.
		}
	}, [selectedChips, nameQuery, sortKey, sortDescending]);

	const handleToggleChip = useCallback((key?: string | number) => {
		if (typeof key === "string") {
			setSelectedChips((current) => {
				const next = new Set(current);
				if (!next.delete(key)) {
					next.add(key);
				}
				return next;
			});
		}
	}, []);

	const handleClearName = useCallback(() => setNameQuery(""), []);

	const handleToggleSortDirection = useCallback(() => setSortDescending((descending) => !descending), []);

	// Clears the chips and the name search for the panel's Clear all button. The sort is not a filter, so it stays.
	const handleClearAll = useCallback(() => {
		setSelectedChips(new Set());
		setNameQuery("");
	}, []);

	// The active filters, flattened into one list the summary bar renders as removable chips.
	const activeFilters = useMemo(
		(): ActiveFilter[] => [
			...chipOptions.filter((label) => selectedChips.has(label)).map((label) => ({ id: `chip-${label}`, label, onDelete: () => handleToggleChip(label) })),
			...(nameQuery.trim() ? [{ id: "name", label: `"${nameQuery.trim()}"`, onDelete: handleClearName }] : [])
		],
		[chipOptions, selectedChips, nameQuery, handleToggleChip, handleClearName]
	);

	// Built once per filter change rather than per render, so the memoised panel skips renders that only touch the results.
	const filterRows = useMemo(
		() => (
			<>
				<ChipRow>
					{types.map((label) => (
						<li key={label}>
							<FilterChip label={label} selected={selectedChips.has(label)} value={label} onToggle={handleToggleChip} />
						</li>
					))}
				</ChipRow>
				<ChipRowDivider />
				<ChipRow>
					<li>
						<FilterChip label={COLLAB_CHIP} selected={selectedChips.has(COLLAB_CHIP)} value={COLLAB_CHIP} onToggle={handleToggleChip} />
					</li>
				</ChipRow>
			</>
		),
		[types, selectedChips, handleToggleChip]
	);

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Filters and summary bar */}
			<Container maxWidth="lg" sx={styles.summaryContainer}>
				<FilterPanel activeCount={activeFilters.length} onClear={handleClearAll} nameQuery={nameQuery} onNameQueryChange={setNameQuery} nameLabel="Search Fairies by name">
					{filterRows}
				</FilterPanel>

				<IndexSummaryBar
					rangeLabel={matches.length === 0 ? "0" : `1-${matches.length}`}
					total={matches.length}
					activeFilters={activeFilters}
					sortId="fairy-sort"
					sortOptions={SORT_OPTIONS}
					sortKey={sortKey}
					onSortKeyChange={setSortKey}
					sortDescending={sortDescending}
					onToggleSortDirection={handleToggleSortDirection}
				/>
			</Container>

			{/* Fairy list */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<Divider sx={styles.topDivider} />

				{loadFailed && <LoadError what="the Fairies" onRetry={handleRetryLoad} />}

				<Grid container spacing={4}>
					{sorted.map((fairy) => (
						<Grid key={fairy.id} size={{ xs: 6, sm: 4, md: 3 }}>
							<FairyCard id={fairy.id} name={fairy.name} typeName={fairy.typeName} stats={fairy.maxStats} highlight={deferredQuery} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
}
