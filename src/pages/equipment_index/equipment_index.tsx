import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Button, Container, Divider, Grid, Slider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import FilterPanel from "../../components/FilterPanel";
import IndexSummaryBar from "../../components/IndexSummaryBar";
import type { ActiveFilter, SortOption } from "../../components/IndexSummaryBar";
import type { RarityFilterEntry } from "../../components/FilterRows";
import EquipmentFilterRows from "./EquipmentFilterRows";
import EquipmentCard from "./EquipmentCard";

import { loadEquipment, searchIndex } from "../../lib/data";
import { EQUIPMENT_RARITIES } from "../../lib/equipmentDisplay";
import { matchesAnyName, normaliseName } from "../../lib/nameSearch";
import { formatBuildTimeQuery, isIncompleteBuildTime, matchesBuildTime, parseBuildTime } from "../../lib/buildTime";
import type { Equipment, EquipmentType } from "../../types/equipment";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How many tiles one page of results holds. */
const PAGE_SIZE = 30;

/** The session storage key this page keeps its filters, sort and level under. The T-Doll Index uses `filters`. */
const STORAGE_KEY = "equipmentFilters";

/** The lowest level the stat slider shows. Stat arrays also hold level 0, which the page never shows. */
const MIN_LEVEL = 1;

/** The highest level the stat slider shows. */
const MAX_LEVEL = 10;

/** What the results can be sorted by. */
type SortKey = "type" | "name" | "rarity" | "buildTime";

/** The sort menu's entries, in menu order. */
const SORT_OPTIONS: SortOption<SortKey>[] = [
	{ value: "type", label: "Type" },
	{ value: "name", label: "Name" },
	{ value: "rarity", label: "Rarity" },
	{ value: "buildTime", label: "Build time" }
];

/** Compares names so digits order by value and case is ignored. Built once rather than per comparison. */
const NAME_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Each doll's current and old names by id, so an exclusive item can be found by the doll it belongs to. */
const DOLL_NAMES_BY_ID = new Map(searchIndex.map((entry) => [entry.id, [entry.name, ...(entry.aliases ?? [])]]));

/** One equipment item placed in the index: the item plus its type and its position in the data's order. */
interface IndexEquipment extends Equipment {
	/** Key of the type the item is listed under. */
	typeKey: string;
	/** Display name of that type. */
	typeLabel: string;
	/** Position in type order then data order, which is the default sort. */
	order: number;
}

/** What this page saves to session storage. */
interface SavedFilters {
	/** Rarities whose chips are on. */
	rarities: number[];
	/** Keys of the types whose chips are on. */
	types: string[];
	/** Whether only exclusive equipment is shown. */
	exclusive: boolean;
	/** The name search text. */
	name: string;
	/** The build time search text. */
	buildTime: string;
	/** What the results are sorted by. */
	sortKey: SortKey;
	/** Whether the sort is reversed. */
	sortDescending: boolean;
	/** The level whose stats are shown. */
	level: number;
}

/** The state a first visit starts from. */
const DEFAULT_FILTERS: SavedFilters = { rarities: [], types: [], exclusive: false, name: "", buildTime: "", sortKey: "type", sortDescending: false, level: MIN_LEVEL };

const styles = {
	root: { py: 3 },
	summaryContainer: { pt: 2 },
	level: {
		display: "flex",
		alignItems: "center",
		gap: 2,
		pt: 1.5,
		px: 0.5
	},
	levelLabel: { whiteSpace: "nowrap" },
	slider: { flex: 1, minWidth: 0 },
	levelValue: { fontWeight: 700, minWidth: 48, textAlign: "right" },
	cardGrid: {
		pt: 4,
		pb: 8,
		minWidth: "70%"
	},
	loadMore: { display: "flex", justifyContent: "center", mt: 3 },
	topDividerForCards: {
		marginTop: "10px",
		marginBottom: "25px"
	},
	bottomDividerForCards: {
		marginTop: "25px",
		marginBottom: "10px"
	}
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
 * The slider's value as text for screen readers.
 *
 * @param value The level.
 * @returns The level as words.
 */
function levelText(value: number): string {
	return `Level ${value}`;
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
	const level = saved.level;
	return {
		rarities: Array.isArray(saved.rarities) ? saved.rarities.filter((rarity): rarity is number => EQUIPMENT_RARITIES.some((entry) => entry.rarity === rarity)) : [],
		types: Array.isArray(saved.types) ? saved.types.filter((key): key is string => typeof key === "string") : [],
		exclusive: saved.exclusive === true,
		name: typeof saved.name === "string" ? saved.name : "",
		buildTime: typeof saved.buildTime === "string" ? saved.buildTime : "",
		sortKey: isSortKey(saved.sortKey) ? saved.sortKey : "type",
		sortDescending: saved.sortDescending === true,
		level: typeof level === "number" && Number.isInteger(level) && level >= MIN_LEVEL && level <= MAX_LEVEL ? level : MIN_LEVEL
	};
}

/**
 * A copy of a set with one value added or removed.
 *
 * @param set The current set, left unchanged.
 * @param value The value to flip.
 * @returns A new set without `value` if it was there, or with it if it was not.
 */
function toggled<T>(set: ReadonlySet<T>, value: T): ReadonlySet<T> {
	const next = new Set(set);
	if (next.has(value)) {
		next.delete(value);
	} else {
		next.add(value);
	}
	return next;
}

/**
 * Sort the matching equipment. Ties fall back to type order, and items with no build time stay last in either direction.
 *
 * @param entries The matching items, left unchanged.
 * @param key What to sort by.
 * @param descending Whether to reverse the order.
 * @returns A sorted copy, or `entries` itself for ascending type order, which it is already in.
 */
function sortEntries(entries: IndexEquipment[], key: SortKey, descending: boolean): IndexEquipment[] {
	if (key === "type" && !descending) {
		return entries;
	}
	const direction = descending ? -1 : 1;
	return [...entries].sort((a, b) => {
		let order: number;
		switch (key) {
			case "name":
				order = NAME_COLLATOR.compare(a.name, b.name);
				break;
			case "rarity":
				order = a.rarity - b.rarity;
				break;
			case "buildTime": {
				// Decided before the direction applies, so items Equipment Productions never gives stay last either way.
				const missing = Number(a.buildSeconds === null) - Number(b.buildSeconds === null);
				if (missing !== 0) {
					return missing;
				}
				order = (a.buildSeconds ?? 0) - (b.buildSeconds ?? 0);
				break;
			}
			case "type":
				order = a.order - b.order;
				break;
		}
		return direction * order || a.order - b.order;
	});
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Page

/**
 * The equipment index: every piece of equipment, filterable, sortable and paged, with stats at a chosen level.
 *
 * @returns The equipment index page.
 */
export default function EquipmentIndex() {
	const [equipment, setEquipment] = useState<{ types: EquipmentType[]; items: Record<string, Equipment[]> }>({ types: [], items: {} });
	// True when the equipment file failed to load, which swaps the results for a retry notice.
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by the retry button to load the equipment again.
	const [loadAttempt, setLoadAttempt] = useState(0);

	// Read once, on the first render, so a restored visit never flashes the defaults.
	const [saved] = useState(readSavedFilters);
	const [selectedRarities, setSelectedRarities] = useState<ReadonlySet<number>>(() => new Set(saved.rarities));
	const [selectedTypes, setSelectedTypes] = useState<ReadonlySet<string>>(() => new Set(saved.types));
	const [exclusiveOnly, setExclusiveOnly] = useState(saved.exclusive);
	const [nameQuery, setNameQuery] = useState(saved.name);
	const [buildTimeText, setBuildTimeText] = useState(saved.buildTime);
	const [sortKey, setSortKey] = useState<SortKey>(saved.sortKey);
	const [sortDescending, setSortDescending] = useState(saved.sortDescending);
	const [currentLevel, setCurrentLevel] = useState(saved.level);
	// How many results are on screen. Raised by the load-more button rather than by paging.
	const [shown, setShown] = useState(PAGE_SIZE);

	// The tiles read a deferred level and query, so the slider thumb and the search box keep up while tiles catch up behind them.
	const deferredLevel = useDeferredValue(currentLevel);
	const deferredQuery = useDeferredValue(nameQuery);

	// Parsed once per keystroke rather than per item.
	const buildTimeQuery = useMemo(() => parseBuildTime(buildTimeText), [buildTimeText]);
	// True once the typed text cannot become a build time, so the field shows a hint. A time still being typed, such as `0:4`, is left unflagged.
	const buildTimeInvalid = buildTimeText.trim() !== "" && buildTimeQuery === null && !isIncompleteBuildTime(buildTimeText);

	// Every item in type order, each tagged with its type and position.
	const entries = useMemo(
		(): IndexEquipment[] =>
			equipment.types.flatMap((type) => (equipment.items[type.key] ?? []).map((item) => ({ ...item, typeKey: type.key, typeLabel: type.label }))).map((item, order) => ({ ...item, order })),
		[equipment]
	);

	// Every item's searchable names, normalised once per load: its own name, plus the names of the dolls an exclusive item belongs to.
	const searchKeys = useMemo(() => new Map(entries.map((entry) => [entry.id, [entry.name, ...entry.dolls.flatMap((doll) => DOLL_NAMES_BY_ID.get(doll.id) ?? [])].map(normaliseName)])), [entries]);

	const rarityEntries = useMemo(
		(): RarityFilterEntry[] => EQUIPMENT_RARITIES.map((entry) => ({ key: entry.rarity, label: entry.label, rarity: entry.rarity, selected: selectedRarities.has(entry.rarity) })),
		[selectedRarities]
	);

	const matches = useMemo(() => {
		const query = normaliseName(deferredQuery);
		const rarityOn = selectedRarities.size > 0;
		// Only keys the data still has count, so a type saved from an older dataset cannot silently empty the list.
		const typeOn = equipment.types.some((type) => selectedTypes.has(type.key));
		return entries.filter(
			(entry) =>
				(!rarityOn || selectedRarities.has(entry.rarity)) &&
				(!typeOn || selectedTypes.has(entry.typeKey)) &&
				(!exclusiveOnly || entry.exclusive) &&
				(buildTimeQuery === null || (entry.buildSeconds !== null && matchesBuildTime(entry.buildSeconds, buildTimeQuery))) &&
				matchesAnyName(searchKeys.get(entry.id) ?? [], query)
		);
	}, [entries, searchKeys, equipment.types, selectedRarities, selectedTypes, exclusiveOnly, buildTimeQuery, deferredQuery]);

	const sorted = useMemo(() => sortEntries(matches, sortKey, sortDescending), [matches, sortKey, sortDescending]);

	// The slice of sorted matches actually rendered, grown by PAGE_SIZE each time the load-more button is clicked.
	const visible = useMemo(() => sorted.slice(0, shown), [sorted, shown]);

	const rangeLabel = matches.length === 0 ? "0" : `1-${visible.length}`;

	// Equipment is fetched once, on mount, rather than pulled in at module scope. A failed load is fetched again from the retry button.
	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadEquipment().then(
			(loaded) => active && setEquipment(loaded),
			() => active && setLoadFailed(true)
		);
		return () => {
			active = false;
		};
	}, [loadAttempt]);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of sortable equipment");
	}, []);

	// A narrower filter or a new order starts again from the first page. The level only changes what tiles show, so it keeps the page.
	useEffect(() => {
		setShown(PAGE_SIZE);
	}, [selectedRarities, selectedTypes, exclusiveOnly, nameQuery, buildTimeText, sortKey, sortDescending]);

	// Remember everything for the rest of the tab, so coming back from a doll page restores the view.
	useEffect(() => {
		const filters: SavedFilters = {
			rarities: [...selectedRarities],
			types: [...selectedTypes],
			exclusive: exclusiveOnly,
			name: nameQuery,
			buildTime: buildTimeText,
			sortKey,
			sortDescending,
			level: currentLevel
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
	}, [selectedRarities, selectedTypes, exclusiveOnly, nameQuery, buildTimeText, sortKey, sortDescending, currentLevel]);

	// Every handler below is stable across renders, so the memoised panel, rows and tiles skip renders they have no part in.
	const handleToggleRarity = useCallback((key?: string | number) => {
		if (typeof key === "number") {
			setSelectedRarities((current) => toggled(current, key));
		}
	}, []);

	const handleToggleType = useCallback((key?: string | number) => {
		if (typeof key === "string") {
			setSelectedTypes((current) => toggled(current, key));
		}
	}, []);

	const handleToggleExclusive = useCallback(() => setExclusiveOnly((current) => !current), []);

	const handleClearName = useCallback(() => setNameQuery(""), []);

	const handleClearBuildTime = useCallback(() => setBuildTimeText(""), []);

	const handleToggleSortDirection = useCallback(() => setSortDescending((descending) => !descending), []);

	const handleLoadMore = useCallback(() => setShown((current) => current + PAGE_SIZE), []);

	const handleRetryLoad = useCallback(() => setLoadAttempt((current) => current + 1), []);

	const handleSlider = useCallback((_event: Event, value: number | number[]) => {
		setCurrentLevel(Array.isArray(value) ? (value[0] ?? MIN_LEVEL) : value);
	}, []);

	// Clears the filters and both searches for the panel's Clear all button. The sort and level are not filters, so they stay.
	const handleClearAll = useCallback(() => {
		setSelectedRarities(new Set());
		setSelectedTypes(new Set());
		setExclusiveOnly(false);
		setNameQuery("");
		setBuildTimeText("");
	}, []);

	// The active filters, flattened into one list the summary bar renders as removable chips.
	const activeFilters = useMemo(
		(): ActiveFilter[] => [
			...EQUIPMENT_RARITIES.filter((entry) => selectedRarities.has(entry.rarity)).map((entry) => ({
				id: `rarity-${entry.rarity}`,
				label: entry.label,
				onDelete: () => handleToggleRarity(entry.rarity)
			})),
			...equipment.types.filter((type) => selectedTypes.has(type.key)).map((type) => ({ id: `type-${type.key}`, label: type.label, onDelete: () => handleToggleType(type.key) })),
			...(exclusiveOnly ? [{ id: "exclusive", label: "Exclusive", onDelete: handleToggleExclusive }] : []),
			...(nameQuery.trim() ? [{ id: "name", label: `"${nameQuery.trim()}"`, onDelete: handleClearName }] : []),
			...(buildTimeQuery ? [{ id: "build-time", label: `Build time ${formatBuildTimeQuery(buildTimeQuery)}`, onDelete: handleClearBuildTime }] : [])
		],
		[selectedRarities, equipment.types, selectedTypes, exclusiveOnly, nameQuery, buildTimeQuery, handleToggleRarity, handleToggleType, handleToggleExclusive, handleClearName, handleClearBuildTime]
	);

	// Built once per filter change rather than per render, so the memoised panel skips renders that only touch the results.
	const filterRows = useMemo(
		() => (
			<EquipmentFilterRows
				rarities={rarityEntries}
				types={equipment.types}
				selectedTypes={selectedTypes}
				exclusiveOnly={exclusiveOnly}
				onToggleRarity={handleToggleRarity}
				onToggleType={handleToggleType}
				onToggleExclusive={handleToggleExclusive}
			/>
		),
		[rarityEntries, equipment.types, selectedTypes, exclusiveOnly, handleToggleRarity, handleToggleType, handleToggleExclusive]
	);

	// Sits in the panel's footer, so it stays on screen on a phone while the chip rows are collapsed.
	const levelSlider = useMemo(
		() => (
			<Box sx={styles.level}>
				<Typography id="equipment-level-label" variant="body2" color="text.secondary" sx={styles.levelLabel}>
					Stats at level
				</Typography>
				<Slider
					aria-labelledby="equipment-level-label"
					value={currentLevel}
					onChange={handleSlider}
					getAriaValueText={levelText}
					step={1}
					marks
					min={MIN_LEVEL}
					max={MAX_LEVEL}
					valueLabelDisplay="auto"
					sx={styles.slider}
				/>
				<Typography variant="body2" sx={styles.levelValue}>
					Lvl {currentLevel}
				</Typography>
			</Box>
		),
		[currentLevel, handleSlider]
	);

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Filters and summary bar */}
			<Container maxWidth="lg" sx={styles.summaryContainer}>
				<FilterPanel
					activeCount={activeFilters.length}
					onClear={handleClearAll}
					nameQuery={nameQuery}
					onNameQueryChange={setNameQuery}
					nameLabel="Search equipment by name"
					buildTimeQuery={buildTimeText}
					onBuildTimeQueryChange={setBuildTimeText}
					buildTimeInvalid={buildTimeInvalid}
					buildTimeExample="0:45"
					buildTimeLabel="Search equipment by build time"
					footer={levelSlider}
				>
					{filterRows}
				</FilterPanel>

				<IndexSummaryBar
					rangeLabel={rangeLabel}
					total={matches.length}
					activeFilters={activeFilters}
					sortId="equipment-sort"
					sortOptions={SORT_OPTIONS}
					sortKey={sortKey}
					onSortKeyChange={setSortKey}
					sortDescending={sortDescending}
					onToggleSortDirection={handleToggleSortDirection}
				/>
			</Container>

			{/* Equipment list */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<Divider sx={styles.topDividerForCards} />

				{loadFailed && <LoadError what="the equipment" onRetry={handleRetryLoad} />}

				<Grid container spacing={4}>
					{visible.map((item) => (
						<Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
							<EquipmentCard equipment={item} level={deferredLevel} />
						</Grid>
					))}
				</Grid>

				{visible.length < matches.length && (
					<Box sx={styles.loadMore}>
						<Button variant="outlined" onClick={handleLoadMore}>
							Load {Math.min(PAGE_SIZE, matches.length - visible.length)} more
						</Button>
					</Box>
				)}

				<Divider sx={styles.bottomDividerForCards} />
			</Container>
		</Box>
	);
}
