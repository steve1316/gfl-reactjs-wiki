/** The equipment data model. */

/**
 * Per-level stat values.
 *
 * Values are formatted strings rather than numbers, since the source data writes them as `"+24"` and
 * ranges such as `"+3~5"`.
 */
export type EquipmentStats = Record<string, string[]>;

/** One piece of equipment, exactly as written in `src/data/equipments.js`. */
export interface RawEquipment {
	name: string;
	rarity: number;
	/** True for equipment restricted to a single T-Doll. */
	exclusive: boolean;
	/** T-Doll types that can equip it, such as `SMG` or `AR`. */
	usable: string[];
	description: string;
	stats: EquipmentStats;
}

/** Equipment with its icon URL resolved. */
export interface Equipment extends RawEquipment {
	image: string;
}
