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
import type { RawTDoll, TDoll } from "../types/tdoll";
import { equipmentAssetUrl } from "./assets";
import { hasDollArt, processDoll, processDolls } from "./processData";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Types and module state

/** One entry in the lightweight search index. */
export interface SearchEntry {
	id: number;
	name: string;
	type: string;
	rarity: number;
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
 * Small enough to ship with the app: 45 KB raw, under 8 KB gzipped. Paths inside it are relative to
 * the doll's Spine directory and are turned into URLs by `src/lib/assets.ts`.
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
 * `max` is the highest doll id the shard holds. The collaboration dolls sit in the 1000 range, so the last shard catches everything above 999.
 */
const SHARDS: ReadonlyArray<{ max: number; load: () => Promise<{ default: RawTDoll[] }> }> = [
	{ max: 100, load: () => import("../data/dolls-1-100.json") as Promise<{ default: RawTDoll[] }> },
	{ max: 200, load: () => import("../data/dolls-101-200.json") as Promise<{ default: RawTDoll[] }> },
	{ max: 300, load: () => import("../data/dolls-201-300.json") as Promise<{ default: RawTDoll[] }> },
	{ max: 400, load: () => import("../data/dolls-301-400.json") as Promise<{ default: RawTDoll[] }> },
	{ max: 999, load: () => import("../data/dolls-401-999.json") as Promise<{ default: RawTDoll[] }> },
	{ max: Number.POSITIVE_INFINITY, load: () => import("../data/dolls-1000-1999.json") as Promise<{ default: RawTDoll[] }> }
];

/** Cache of in-flight and settled shard loads, so a shard is fetched and processed at most once. */
const shardCache = new Map<number, Promise<TDoll[]>>();

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
 * Load a single doll.
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
 * Load every doll.
 *
 * Used by the index page, which genuinely renders all of them. Other routes should not call this.
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
 * @returns Doll ids present in the asset manifest.
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
				items[key] = list.map((item) => ({ ...item, image: item.image ? equipmentAssetUrl(item.image) : null }));
			}
			return { types: source.types, items };
		});
	}
	return equipmentCache;
}
