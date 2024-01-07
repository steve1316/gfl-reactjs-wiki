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
import type { Equipment, RawEquipment } from "../types/equipment";
import type { SpineDollEntry, SpineIndex } from "../types/spine";
import type { RawTDoll, TDoll } from "../types/tdoll";
import { equipmentUrl } from "./assets";
import { processDoll, processDolls } from "./processData";

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
 * The data shards, in id order.
 *
 * `max` is the highest doll id the shard holds. The collaboration dolls sit in the 1000 range, so the
 * last shard catches everything above 400.
 */
const SHARDS: ReadonlyArray<{ max: number; load: () => Promise<{ default: RawTDoll[] }> }> = [
	{ max: 100, load: () => import("../data/tdolls_from_1_to_100") },
	{ max: 200, load: () => import("../data/tdolls_from_101_to_200") },
	{ max: 300, load: () => import("../data/tdolls_from_201_to_300") },
	{ max: 400, load: () => import("../data/tdolls_from_301_to_400") },
	{ max: Number.POSITIVE_INFINITY, load: () => import("../data/tdolls_from_1000_to_1050") }
];

/** Cache of in-flight and settled shard loads, so a shard is fetched and processed at most once. */
const shardCache = new Map<number, Promise<TDoll[]>>();

let equipmentCache: Promise<Record<string, Equipment[]>> | undefined;

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
 * Work out the image filename for a piece of equipment.
 *
 * The data uses a leading `.` or `#` to control sort order in the index, and those characters are not
 * part of the filename. One item also disambiguates two rarities by name. This logic used to sit
 * inline next to the dynamic `require()` in `equipments.js`.
 *
 * @param name Equipment name as written in the data.
 * @param rarity Equipment rarity, used only by the special case.
 * @returns The filename without its extension.
 */
export function equipmentImageName(name: string, rarity: number): string {
	if (name.startsWith(".") || name.startsWith("#")) {
		return name.slice(1);
	}
	if (name === "ILM Hollow Point Ammo") {
		return `${name} (${rarity})`;
	}
	return name;
}

/**
 * Load all equipment, keyed by category.
 *
 * @returns Equipment with icon URLs resolved.
 */
export async function loadEquipment(): Promise<Record<string, Equipment[]>> {
	if (!equipmentCache) {
		equipmentCache = import("../data/equipments").then((module) => {
			const source = module.default as Record<string, RawEquipment[]>;
			const resolved: Record<string, Equipment[]> = {};
			for (const [category, items] of Object.entries(source)) {
				resolved[category] = items.map((item) => ({
					...item,
					image: equipmentUrl(category, equipmentImageName(item.name, item.rarity))
				}));
			}
			return resolved;
		});
	}
	return equipmentCache;
}
