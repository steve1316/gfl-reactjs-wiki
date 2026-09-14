/**
 * The single place the app reads doll and equipment data.
 *
 * Shards are loaded through dynamic imports so a route pays only for what it renders. Viewing one
 * doll fetches the shard holding it rather than all five, and the navbar, which renders on every
 * route, reads the small search index instead of the full dataset. That split is only possible
 * because the data modules no longer run `processData` at import time.
 */

import searchIndexJson from "../data/search-index.json";
import spineIndexJson from "../data/spine-index.json";
import type { Equipment, EquipmentType, RawEquipment } from "../types/equipment";
import type { SpineDollEntry, SpineIndex } from "../types/spine";
import type { DollDetails, RawTDoll, TDoll, TDollWithDetails } from "../types/tdoll";
import { equipmentIconUrl } from "./assets";
import { hasDollArt, hasEquipmentIcon, processDoll, processDolls } from "./processData";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Types and module state

/** One entry in the lightweight search index. */
export interface SearchEntry {
	/** Doll id, shared by the base form and its Mod. */
	id: number;
	/** The base form's current name. */
	name: string;
	/** Doll type, such as "AR" or "HG". */
	type: string;
	/** Base form rarity, with 1 meaning the collaboration "Extra" rarity. */
	rarity: number;
	/** Names the wiki used before the 2026-09-13 upstream import renamed the doll, kept searchable. Absent when the name did not change. */
	aliases?: string[];
}

/** One generated shard: the doll records every doll list reads, and the profile side file only the doll page reads. */
interface Shard {
	/** Highest doll id the shard holds. */
	max: number;
	/** Loads the shard's doll records. */
	load: () => Promise<{ default: RawTDoll[] }>;
	/** Loads the shard's profiles and spec sheets, keyed by doll id. */
	loadDetails: () => Promise<{ default: Record<string, DollDetails> }>;
}

/**
 * Every doll's id and name, for search and navigation.
 *
 * Small enough to load eagerly on every route, unlike the full dataset.
 */
export const searchIndex: SearchEntry[] = searchIndexJson as SearchEntry[];

/**
 * Which Spine rigs exist for each doll.
 *
 * Small enough to ship with the app. Paths inside it are relative to the doll's Spine directory and are turned into URLs by `src/lib/assets.ts`.
 */
const spineIndex: SpineIndex = spineIndexJson as SpineIndex;

/**
 * Look up a doll's Spine rigs.
 *
 * @param id Doll id.
 * @returns The doll's rigs, or undefined when nothing was published for it.
 */
export function spineFor(id: number): SpineDollEntry | undefined {
	return spineIndex[String(id)];
}

/**
 * The generated data shards, in id order. This table mirrors `tools/data/lib/shards.mjs`.
 *
 * The collaboration dolls sit in the 1000 range, so the last shard catches everything above 999.
 */
const SHARDS: ReadonlyArray<Shard> = [
	{
		max: 100,
		load: () => import("../data/dolls-1-100.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-1-100.json") as Promise<{ default: Record<string, DollDetails> }>
	},
	{
		max: 200,
		load: () => import("../data/dolls-101-200.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-101-200.json") as Promise<{ default: Record<string, DollDetails> }>
	},
	{
		max: 300,
		load: () => import("../data/dolls-201-300.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-201-300.json") as Promise<{ default: Record<string, DollDetails> }>
	},
	{
		max: 400,
		load: () => import("../data/dolls-301-400.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-301-400.json") as Promise<{ default: Record<string, DollDetails> }>
	},
	{
		max: 999,
		load: () => import("../data/dolls-401-999.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-401-999.json") as Promise<{ default: Record<string, DollDetails> }>
	},
	{
		max: Number.POSITIVE_INFINITY,
		load: () => import("../data/dolls-1000-1999.json") as Promise<{ default: RawTDoll[] }>,
		loadDetails: () => import("../data/profiles-1000-1999.json") as Promise<{ default: Record<string, DollDetails> }>
	}
];

/** Cache of in-flight and settled shard loads, so a shard is fetched and processed at most once. */
const shardCache = new Map<number, Promise<TDoll[]>>();

/** Cache of in-flight and settled profile side file loads, so each is fetched at most once. */
const detailsCache = new Map<number, Promise<Record<string, DollDetails>>>();

/** Cache of the in-flight or settled equipment load. */
let equipmentCache: Promise<{ types: EquipmentType[]; items: Record<string, Equipment[]> }> | undefined;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Dolls

/**
 * Load and process one shard, reusing an earlier load when there is one.
 *
 * @param index Position in `SHARDS`.
 * @returns The shard's dolls, with assets resolved.
 */
function loadShard(index: number): Promise<TDoll[]> {
	const cached = shardCache.get(index);
	if (cached) {
		return cached;
	}
	const shard = SHARDS[index];
	if (!shard) {
		return Promise.resolve([]);
	}
	const pending = shard.load().then((module) => processDolls(module.default));
	shardCache.set(index, pending);
	return pending;
}

/**
 * Load one shard's profiles and spec sheets, reusing an earlier load when there is one.
 *
 * @param index Position in `SHARDS`.
 * @returns The shard's details, keyed by doll id.
 */
function loadShardDetails(index: number): Promise<Record<string, DollDetails>> {
	const cached = detailsCache.get(index);
	if (cached) {
		return cached;
	}
	const shard = SHARDS[index];
	if (!shard) {
		return Promise.resolve({});
	}
	const pending = shard.loadDetails().then((module) => module.default);
	detailsCache.set(index, pending);
	return pending;
}

/**
 * Find which shard holds a doll.
 *
 * @param id Doll id.
 * @returns The index into `SHARDS`.
 */
function shardIndexFor(id: number): number {
	const found = SHARDS.findIndex((shard) => id <= shard.max);
	return found === -1 ? SHARDS.length - 1 : found;
}

/**
 * Load a single doll without its profile or spec sheets, for places such as the home carousel and the art viewer.
 *
 * Only the shard containing it is fetched, so opening one doll's page does not pull the other 250.
 *
 * @param id Doll id.
 * @returns The doll, or `undefined` when no doll has that id.
 */
export async function loadDoll(id: number): Promise<TDoll | undefined> {
	const dolls = await loadShard(shardIndexFor(id));
	return dolls.find((doll) => doll.normal.id === id);
}

/**
 * Load a single doll with its profile and spec sheets, for the doll page.
 *
 * The shard and its profile side file are fetched in parallel. Both are cached, so a later `loadDoll` or `loadAllDolls` reuses the shard.
 *
 * @param id Doll id.
 * @returns The doll with its details attached, or `undefined` when no doll has that id.
 * @throws When the doll exists but its side file has no entry for it, which `tools/data/check.mjs` guards against.
 */
export async function loadDollDetails(id: number): Promise<TDollWithDetails | undefined> {
	const index = shardIndexFor(id);
	const [dolls, details] = await Promise.all([loadShard(index), loadShardDetails(index)]);
	const doll = dolls.find((entry) => entry.normal.id === id);
	if (!doll) {
		return undefined;
	}
	const entry = details[String(id)];
	if (!entry) {
		throw new Error(`doll ${id} has no profile entry`);
	}
	return { ...doll, ...entry };
}

/**
 * Load every doll.
 *
 * Used by the index page, which genuinely renders all of them. Other routes should not call this. Profiles and spec sheets are left out.
 *
 * @returns Every doll, in shard order.
 */
export async function loadAllDolls(): Promise<TDoll[]> {
	const shards = await Promise.all(SHARDS.map((_, index) => loadShard(index)));
	return shards.flat();
}

/**
 * Ids of dolls whose art is hosted, for places that should only show dolls with artwork.
 *
 * @returns Doll ids whose base card is in the asset manifest.
 */
export function dollIdsWithArt(): number[] {
	return searchIndex.map((entry) => entry.id).filter((id) => hasDollArt(id));
}

/**
 * Process a raw doll without going through a shard.
 *
 * @param raw A raw doll record.
 * @returns The doll with assets resolved.
 */
export { processDoll };

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Equipment

/**
 * Load all equipment and its types.
 *
 * @returns Equipment types in display order, and items keyed by type key with icon URLs resolved.
 */
export async function loadEquipment(): Promise<{ types: EquipmentType[]; items: Record<string, Equipment[]> }> {
	if (!equipmentCache) {
		equipmentCache = import("../data/equipment.json").then((module) => {
			const source = module.default as unknown as { types: EquipmentType[]; items: Record<string, RawEquipment[]> };
			const items: Record<string, Equipment[]> = {};
			for (const [key, list] of Object.entries(source.items)) {
				items[key] = list.map((item) => ({ ...item, image: hasEquipmentIcon(item.id) ? equipmentIconUrl(item.id) : null }));
			}
			return { types: source.types, items };
		});
	}
	return equipmentCache;
}
