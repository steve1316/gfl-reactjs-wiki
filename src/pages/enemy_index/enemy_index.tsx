import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Button, Container, Divider, Grid } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import FactionIcon from "../../components/FactionIcon";
import FilterChip from "../../components/FilterChip";
import FilterPanel from "../../components/FilterPanel";
import { ChipRow, ChipRowDivider } from "../../components/FilterRows";
import IndexSummaryBar from "../../components/IndexSummaryBar";
import type { ActiveFilter, SortOption } from "../../components/IndexSummaryBar";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import EnemyCard from "./EnemyCard";

import { ENEMY_RANK_LABELS } from "../../lib/enemyRanks";
import { FACTION_COLOURS } from "../../theme/palette";
import { matchesAnyName, normaliseName } from "../../lib/nameSearch";
import { useEnemies } from "../../lib/useEnemies";
import type { Enemy, EnemyRankKey } from "../../types/enemy";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** The session storage key this page keeps its filters and sort under. */
const STORAGE_KEY = "enemyFilters";

/** How many tiles a page shows, and how many more the button adds. The archive is 351 enemies, far more than the other indexes. */
const PAGE_SIZE = 30;

/** What the results can be sorted by. */
type SortKey = "archive" | "name" | "faction" | EnemyRankKey;

/** The sort menu's entries, in menu order. The rank sorts follow the archive's own order. */
const SORT_OPTIONS: SortOption<SortKey>[] = [
	{ value: "archive", label: "Archive order" },
	{ value: "name", label: "Name" },
	{ value: "faction", label: "Faction" },
	{ value: "power", label: ENEMY_RANK_LABELS.power },
	{ value: "health", label: ENEMY_RANK_LABELS.health },
	{ value: "accuracy", label: ENEMY_RANK_LABELS.accuracy },
	{ value: "evasion", label: ENEMY_RANK_LABELS.evasion },
	{ value: "rateOfFire", label: ENEMY_RANK_LABELS.rateOfFire },
	{ value: "armor", label: ENEMY_RANK_LABELS.armor }
];

/** Compares names so digits order by value and case is ignored. Built once rather than per comparison. */
const NAME_COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** One enemy placed in the index: the enemy plus its position in archive order and its searchable name. */
interface IndexEnemy extends Enemy {
	/** Position in the archive, which is the default sort. */
	order: number;
	/** Position of the enemy's faction in `factions`, which the faction sort uses. */
	factionOrder: number;
	/** The name passed through `normaliseName`, worked out once per load for the name search. */
	searchKey: string;
}

/** What this page saves to session storage. */
interface SavedFilters {
	/** Faction names whose chips are on. */
	factions: string[];
	/** Whether the Boss chip is on. */
	boss: boolean;
	/** Whether the Capturable chip is on. */
	capturable: boolean;
	/** The name search text. */
	name: string;
	/** What the results are sorted by. */
	sortKey: SortKey;
	/** Whether the sort is reversed. */
	sortDescending: boolean;
}

/** The state a first visit starts from. */
const DEFAULT_FILTERS: SavedFilters = { factions: [], boss: false, capturable: false, name: "", sortKey: "archive", sortDescending: false };

/** The faction list before the data loads. Shared so the memoised rows keep a stable dependency. */
const NO_FACTIONS: string[] = [];

const styles = {
	root: { py: 3 },
	summaryContainer: { pt: 2 },
	cardGrid: { pt: 4, pb: 8 },
	topDivider: { mt: "10px", mb: "25px" },
	loadMore: { display: "flex", justifyContent: "center", mt: 4 }
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
		factions: Array.isArray(saved.factions) ? saved.factions.filter((label): label is string => typeof label === "string") : [],
		boss: saved.boss === true,
		capturable: saved.capturable === true,
		name: typeof saved.name === "string" ? saved.name : "",
		sortKey: isSortKey(saved.sortKey) ? saved.sortKey : "archive",
		sortDescending: saved.sortDescending === true
	};
}

/**
 * Sort the matching enemies. Ties fall back to archive order.
 *
 * @param entries The matching enemies, left unchanged.
 * @param key What to sort by.
 * @param descending Whether to reverse the order.
 * @returns A sorted copy, or `entries` itself for ascending archive order, which it is already in.
 */
function sortEntries(entries: IndexEnemy[], key: SortKey, descending: boolean): IndexEnemy[] {
	if (key === "archive" && !descending) {
		return entries;
	}
	const direction = descending ? -1 : 1;
	return [...entries].sort((a, b) => {
		let order: number;
		switch (key) {
			case "archive":
				order = a.order - b.order;
				break;
			case "name":
				order = NAME_COLLATOR.compare(a.name, b.name);
				break;
			case "faction":
				order = a.factionOrder - b.factionOrder;
				break;
			default:
				order = a.ranks[key] - b.ranks[key];
		}
		return direction * order || a.order - b.order;
	});
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Page

/**
 * The Enemy Index: every enemy in the game's archive, filterable by faction, boss tier and whether Protocol Assimilation can
 * capture it, and sortable by any of the archive's rank bars.
 *
 * @returns The Enemy Index page.
 */
export default function EnemyIndex() {
	const { data, loadFailed, retry: handleRetryLoad } = useEnemies();

	// Read once, on the first render, so a restored visit never flashes the defaults.
	const [saved] = useState(readSavedFilters);
	const [selectedFactions, setSelectedFactions] = useState<ReadonlySet<string>>(() => new Set(saved.factions));
	const [bossFilter, setBossFilter] = useState(saved.boss);
	const [capturableFilter, setCapturableFilter] = useState(saved.capturable);
	const [nameQuery, setNameQuery] = useState(saved.name);
	const [sortKey, setSortKey] = useState<SortKey>(saved.sortKey);
	const [sortDescending, setSortDescending] = useState(saved.sortDescending);
	const [shown, setShown] = useState(PAGE_SIZE);

	const deferredQuery = useDeferredValue(nameQuery);

	const factions = data?.factions ?? NO_FACTIONS;

	// One card per family, in archive order. A family's extra records are the same enemy at a harder tier: they share its art and rig
	// and differ only in stats and skills, so they are pills on its page rather than cards of their own.
	const entries = useMemo((): IndexEnemy[] => {
		if (data === null) {
			return [];
		}
		const seen = new Set<number>();
		return data.items
			.filter((enemy) => {
				if (seen.has(enemy.familyId)) {
					return false;
				}
				seen.add(enemy.familyId);
				return true;
			})
			.map((enemy, order) => ({ ...enemy, order, factionOrder: data.factions.indexOf(enemy.faction), searchKey: normaliseName(enemy.name) }));
	}, [data]);

	const matches = useMemo(() => {
		const query = normaliseName(deferredQuery);
		// Only factions the data still has count, so a faction saved from an older dataset cannot silently empty the list.
		const factionOn = factions.some((label) => selectedFactions.has(label));
		return entries.filter(
			(entry) => (!factionOn || selectedFactions.has(entry.faction)) && (!bossFilter || entry.boss) && (!capturableFilter || entry.capturable) && matchesAnyName([entry.searchKey], query)
		);
	}, [entries, factions, selectedFactions, bossFilter, capturableFilter, deferredQuery]);

	const sorted = useMemo(() => sortEntries(matches, sortKey, sortDescending), [matches, sortKey, sortDescending]);

	const visible = useMemo(() => sorted.slice(0, shown), [sorted, shown]);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Enemy Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of every enemy in Girls' Frontline");
	}, []);

	// Remember everything for the rest of the tab, so coming back from an enemy's page restores the view.
	useEffect(() => {
		setShown(PAGE_SIZE);
		const filters: SavedFilters = { factions: [...selectedFactions], boss: bossFilter, capturable: capturableFilter, name: nameQuery, sortKey, sortDescending };
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
		} catch {
			// Storage can be blocked, such as in a locked-down browser. The view is just not remembered then.
		}
	}, [selectedFactions, bossFilter, capturableFilter, nameQuery, sortKey, sortDescending]);

	const handleToggleFaction = useCallback((key?: string | number) => {
		if (typeof key === "string") {
			setSelectedFactions((current) => {
				const next = new Set(current);
				if (!next.delete(key)) {
					next.add(key);
				}
				return next;
			});
		}
	}, []);

	const handleClearName = useCallback(() => setNameQuery(""), []);

	const handleToggleBoss = useCallback(() => setBossFilter((current) => !current), []);

	const handleToggleCapturable = useCallback(() => setCapturableFilter((current) => !current), []);

	const handleToggleSortDirection = useCallback(() => setSortDescending((descending) => !descending), []);

	const handleShowMore = useCallback(() => setShown((current) => current + PAGE_SIZE), []);

	// Clears the chips and the name search for the panel's Clear all button. The sort is not a filter, so it stays.
	const handleClearAll = useCallback(() => {
		setSelectedFactions(new Set());
		setBossFilter(false);
		setCapturableFilter(false);
		setNameQuery("");
	}, []);

	// The active filters, flattened into one list the summary bar renders as removable chips.
	const activeFilters = useMemo(
		(): ActiveFilter[] => [
			...factions.filter((label) => selectedFactions.has(label)).map((label) => ({ id: `faction-${label}`, label, onDelete: () => handleToggleFaction(label) })),
			...(bossFilter ? [{ id: "boss", label: "Boss", onDelete: handleToggleBoss }] : []),
			...(capturableFilter ? [{ id: "capturable", label: "Capturable", onDelete: handleToggleCapturable }] : []),
			...(nameQuery.trim() ? [{ id: "name", label: `"${nameQuery.trim()}"`, onDelete: handleClearName }] : [])
		],
		[factions, selectedFactions, bossFilter, capturableFilter, nameQuery, handleToggleFaction, handleToggleBoss, handleToggleCapturable, handleClearName]
	);

	// Built once per filter change rather than per render, so the memoised panel skips renders that only touch the results.
	const filterRows = useMemo(
		() => (
			<>
				<ChipRow>
					{factions.map((label) => {
						// Other is a catch-all rather than a faction, so it carries neither a colour nor a mark.
						const colour = FACTION_COLOURS[label as keyof typeof FACTION_COLOURS];
						return (
							<li key={label}>
								<FilterChip
									label={label}
									selected={selectedFactions.has(label)}
									value={label}
									onToggle={handleToggleFaction}
									colour={colour}
									icon={colour === undefined ? undefined : <FactionIcon faction={label} />}
								/>
							</li>
						);
					})}
				</ChipRow>
				<ChipRowDivider />
				<ChipRow>
					<li>
						<FilterChip label="Boss" selected={bossFilter} onToggle={handleToggleBoss} />
					</li>
					<li>
						<FilterChip label="Capturable" selected={capturableFilter} onToggle={handleToggleCapturable} />
					</li>
				</ChipRow>
			</>
		),
		[factions, selectedFactions, bossFilter, capturableFilter, handleToggleFaction, handleToggleBoss, handleToggleCapturable]
	);

	const remaining = sorted.length - visible.length;

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Filters and summary bar */}
			<Container maxWidth="lg" sx={styles.summaryContainer}>
				<FilterPanel activeCount={activeFilters.length} onClear={handleClearAll} nameQuery={nameQuery} onNameQueryChange={setNameQuery} nameLabel="Search enemies by name">
					{filterRows}
				</FilterPanel>

				<IndexSummaryBar
					rangeLabel={visible.length === 0 ? "0" : `1-${visible.length}`}
					total={sorted.length}
					activeFilters={activeFilters}
					sortId="enemy-sort"
					sortOptions={SORT_OPTIONS}
					sortKey={sortKey}
					onSortKeyChange={setSortKey}
					sortDescending={sortDescending}
					onToggleSortDirection={handleToggleSortDirection}
				/>
			</Container>

			{/* Enemy list */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<Divider sx={styles.topDivider} />

				{loadFailed && <LoadError what="the enemies" onRetry={handleRetryLoad} />}

				<Grid container spacing={4}>
					{visible.map((enemy) => (
						<Grid key={enemy.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
							<EnemyCard id={enemy.id} name={enemy.name} faction={enemy.faction} boss={enemy.boss} capturable={enemy.capturable} ranks={enemy.ranks} highlight={deferredQuery} />
						</Grid>
					))}
				</Grid>

				{remaining > 0 && (
					<Box sx={styles.loadMore}>
						<Button variant="outlined" onClick={handleShowMore}>
							Load {Math.min(remaining, PAGE_SIZE)} more
						</Button>
					</Box>
				)}
			</Container>
		</Box>
	);
}
