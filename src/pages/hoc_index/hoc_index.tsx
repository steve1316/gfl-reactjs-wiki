import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Container, Divider, Grid } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import FilterChip from "../../components/FilterChip";
import FilterPanel from "../../components/FilterPanel";
import { ChipRow } from "../../components/FilterRows";
import IndexSummaryBar from "../../components/IndexSummaryBar";
import type { ActiveFilter, SortOption } from "../../components/IndexSummaryBar";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import HocCard from "./HocCard";

import { useHocs } from "../../lib/useHocs";
import { hocStats } from "../../lib/hocStats";
import { matchesAnyName, normaliseName } from "../../lib/nameSearch";
import type { Hoc, HocStatValues } from "../../types/hoc";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** The session storage key this page keeps its filters and sort under. */
const STORAGE_KEY = "hocFilters";

/** What the results can be sorted by. */
type SortKey = "class" | "name" | "released" | "lethality" | "pierce" | "precision" | "reload";

/** The sort menu's entries, in menu order. */
const SORT_OPTIONS: SortOption<SortKey>[] = [
	{ value: "class", label: "Class" },
	{ value: "name", label: "Name" },
	{ value: "released", label: "Release date" },
	{ value: "lethality", label: "Lethality" },
	{ value: "pierce", label: "Pierce" },
	{ value: "precision", label: "Precision" },
	{ value: "reload", label: "Reload" }
];

/** Compares names so digits order by value and case is ignored. Built once rather than per comparison. */
const NAME_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** One HOC placed in the index: the HOC plus its stats at the highest level and its position in class order. */
interface IndexHoc extends Hoc {
	/** Base stats at the highest level, shown on the tile and used by the stat sorts. */
	maxStats: HocStatValues;
	/** Position in class order then id order, which is the default sort. */
	order: number;
	/** The name passed through `normaliseName`, worked out once per load for the name search. */
	searchKey: string;
}

/** What this page saves to session storage. */
interface SavedFilters {
	/** Class names whose chips are on. */
	classes: string[];
	/** The name search text. */
	name: string;
	/** What the results are sorted by. */
	sortKey: SortKey;
	/** Whether the sort is reversed. */
	sortDescending: boolean;
}

/** The state a first visit starts from. */
const DEFAULT_FILTERS: SavedFilters = { classes: [], name: "", sortKey: "class", sortDescending: false };

/** The class list before the data loads. Shared so the memoised rows keep a stable dependency. */
const NO_CLASSES: string[] = [];

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
		classes: Array.isArray(saved.classes) ? saved.classes.filter((label): label is string => typeof label === "string") : [],
		name: typeof saved.name === "string" ? saved.name : "",
		sortKey: isSortKey(saved.sortKey) ? saved.sortKey : "class",
		sortDescending: saved.sortDescending === true
	};
}

/**
 * Sort the matching HOCs. Ties fall back to class order.
 *
 * @param entries The matching HOCs, left unchanged.
 * @param key What to sort by.
 * @param descending Whether to reverse the order.
 * @returns A sorted copy, or `entries` itself for ascending class order, which it is already in.
 */
function sortEntries(entries: IndexHoc[], key: SortKey, descending: boolean): IndexHoc[] {
	if (key === "class" && !descending) {
		return entries;
	}
	const direction = descending ? -1 : 1;
	return [...entries].sort((a, b) => {
		let order: number;
		switch (key) {
			case "class":
				order = a.order - b.order;
				break;
			case "name":
				order = NAME_COLLATOR.compare(a.name, b.name);
				break;
			case "released":
				order = a.released.localeCompare(b.released);
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
 * The HOC index: every Heavy Ordnance Corps unit, filterable by class and name and sortable by any stat.
 *
 * @returns The HOC index page.
 */
export default function HOCIndex() {
	const { data, loadFailed, retry: handleRetryLoad } = useHocs();

	// Read once, on the first render, so a restored visit never flashes the defaults.
	const [saved] = useState(readSavedFilters);
	const [selectedClasses, setSelectedClasses] = useState<ReadonlySet<string>>(() => new Set(saved.classes));
	const [nameQuery, setNameQuery] = useState(saved.name);
	const [sortKey, setSortKey] = useState<SortKey>(saved.sortKey);
	const [sortDescending, setSortDescending] = useState(saved.sortDescending);

	const deferredQuery = useDeferredValue(nameQuery);

	const classes = data?.classes ?? NO_CLASSES;

	// Every HOC in class order, each with its top-level stats worked out once per load.
	const entries = useMemo(
		(): IndexHoc[] =>
			data === null
				? []
				: data.classes
						.flatMap((label) => data.items.filter((hoc) => hoc.className === label))
						.map((hoc, order) => ({ ...hoc, maxStats: hocStats(hoc, data.constants, data.constants.maxLevel), order, searchKey: normaliseName(hoc.name) })),
		[data]
	);

	const matches = useMemo(() => {
		const query = normaliseName(deferredQuery);
		// Only classes the data still has count, so a class saved from an older dataset cannot silently empty the list.
		const classOn = classes.some((label) => selectedClasses.has(label));
		return entries.filter((entry) => (!classOn || selectedClasses.has(entry.className)) && matchesAnyName([entry.searchKey], query));
	}, [entries, classes, selectedClasses, deferredQuery]);

	const sorted = useMemo(() => sortEntries(matches, sortKey, sortDescending), [matches, sortKey, sortDescending]);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "HOC Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of Heavy Ordnance Corps units");
	}, []);

	// Remember everything for the rest of the tab, so coming back from a HOC page restores the view.
	useEffect(() => {
		const filters: SavedFilters = { classes: [...selectedClasses], name: nameQuery, sortKey, sortDescending };
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
		} catch {
			// Storage can be blocked, such as in a locked-down browser. The view is just not remembered then.
		}
	}, [selectedClasses, nameQuery, sortKey, sortDescending]);

	const handleToggleClass = useCallback((key?: string | number) => {
		if (typeof key === "string") {
			setSelectedClasses((current) => {
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

	// Clears the class chips and the name search for the panel's Clear all button. The sort is not a filter, so it stays.
	const handleClearAll = useCallback(() => {
		setSelectedClasses(new Set());
		setNameQuery("");
	}, []);

	// The active filters, flattened into one list the summary bar renders as removable chips.
	const activeFilters = useMemo(
		(): ActiveFilter[] => [
			...classes.filter((label) => selectedClasses.has(label)).map((label) => ({ id: `class-${label}`, label, onDelete: () => handleToggleClass(label) })),
			...(nameQuery.trim() ? [{ id: "name", label: `"${nameQuery.trim()}"`, onDelete: handleClearName }] : [])
		],
		[classes, selectedClasses, nameQuery, handleToggleClass, handleClearName]
	);

	// Built once per filter change rather than per render, so the memoised panel skips renders that only touch the results.
	const filterRows = useMemo(
		() => (
			<ChipRow>
				{classes.map((label) => (
					<li key={label}>
						<FilterChip label={label} selected={selectedClasses.has(label)} value={label} onToggle={handleToggleClass} />
					</li>
				))}
			</ChipRow>
		),
		[classes, selectedClasses, handleToggleClass]
	);

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Filters and summary bar */}
			<Container maxWidth="lg" sx={styles.summaryContainer}>
				<FilterPanel activeCount={activeFilters.length} onClear={handleClearAll} nameQuery={nameQuery} onNameQueryChange={setNameQuery} nameLabel="Search HOCs by name">
					{filterRows}
				</FilterPanel>

				<IndexSummaryBar
					rangeLabel={matches.length === 0 ? "0" : `1-${matches.length}`}
					total={matches.length}
					activeFilters={activeFilters}
					sortId="hoc-sort"
					sortOptions={SORT_OPTIONS}
					sortKey={sortKey}
					onSortKeyChange={setSortKey}
					sortDescending={sortDescending}
					onToggleSortDirection={handleToggleSortDirection}
				/>
			</Container>

			{/* HOC list */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<Divider sx={styles.topDivider} />

				{loadFailed && <LoadError what="the HOCs" onRetry={handleRetryLoad} />}

				<Grid container spacing={4}>
					{sorted.map((hoc) => (
						<Grid key={hoc.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
							<HocCard id={hoc.id} name={hoc.name} className={hoc.className} stats={hoc.maxStats} highlight={deferredQuery} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
}
