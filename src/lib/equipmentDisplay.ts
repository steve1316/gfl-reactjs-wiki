/**
 * Display helpers shared by the Equipment Index tiles, filters and details dialog.
 */

import { searchIndex } from "./data";
import type { EquipmentDoll } from "../types/equipment";

/** One equipment rarity and the game's name for it. */
export interface EquipmentRarity {
	/** The rarity number from the data, 2 to 5. */
	rarity: number;
	/** The game's name for that rarity, such as "Legendary". */
	label: string;
}

/** Every rarity equipment comes in, lowest first. */
export const EQUIPMENT_RARITIES: ReadonlyArray<EquipmentRarity> = [
	{ rarity: 2, label: "General" },
	{ rarity: 3, label: "Rare" },
	{ rarity: 4, label: "Epochal" },
	{ rarity: 5, label: "Legendary" }
];

/** The six weapon classes, in the order the game lists them. */
const WEAPON_CLASSES: ReadonlyArray<string> = ["HG", "SMG", "RF", "AR", "MG", "SG"];

/** Doll names keyed by doll id, built once from the search index. */
const DOLL_NAMES_BY_ID = new Map(searchIndex.map((entry) => [entry.id, entry.name]));

/**
 * The game's name for an equipment rarity.
 *
 * @param rarity The rarity number from the data.
 * @returns The name, such as "Legendary", or "Rarity N" for a number the game does not name.
 */
export function equipmentRarityName(rarity: number): string {
	return EQUIPMENT_RARITIES.find((entry) => entry.rarity === rarity)?.label ?? `Rarity ${rarity}`;
}

/**
 * The display name of a doll an exclusive item belongs to.
 *
 * @param doll The doll entry from the item's `dolls` list.
 * @returns The doll's current name, with " Mod" added when only the Mod can equip the item, or `#id` for an unknown doll.
 */
export function equipmentDollName(doll: EquipmentDoll): string {
	const name = DOLL_NAMES_BY_ID.get(doll.id) ?? `#${doll.id}`;
	return doll.mod ? `${name} Mod` : name;
}

/**
 * A short wording for equipment that most weapon classes can use, since five class badges do not fit a phone-width tile.
 *
 * @param usable The weapon classes that can equip the item.
 * @returns "All classes" or "All but ..." when five or more classes can equip it, otherwise null so the tile shows one badge per class.
 */
export function usableSummary(usable: readonly string[]): string | null {
	if (usable.length < 5) {
		return null;
	}
	const missing = WEAPON_CLASSES.filter((type) => !usable.includes(type));
	return missing.length === 0 ? "All classes" : `All but ${missing.join(", ")}`;
}
