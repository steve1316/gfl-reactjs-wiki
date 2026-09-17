import { levelStats } from "../../../src/lib/formation/growth.ts";

/** gun_type_info columns per stat. Every value in that file is a string. */
const TYPE_COLUMNS = {
	life: "basic_attribute_life",
	pow: "basic_attribute_pow",
	rate: "basic_attribute_rate",
	hit: "basic_attribute_hit",
	dodge: "basic_attribute_dodge",
	armor: "basic_attribute_armor"
};

/** Converted constants per parsed config, so the conversion runs once per import rather than once per form. */
const constantsCache = new WeakMap();

/**
 * Read the growth constants and per-type multipliers the stat formulas need.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @returns {{ params: Map<string, number[]>, types: Map<number, Record<string, number>> }} Parsed constants.
 */
export function readStatConfig(upstream) {
	const params = new Map(upstream.catchdata("game_config_info").map((row) => [row.parameter_name, String(row.parameter_value).split(",").map(Number)]));
	const types = new Map(upstream.catchdata("gun_type_info").map((row) => [Number(row.id), Object.fromEntries(Object.entries(TYPE_COLUMNS).map(([stat, column]) => [stat, Number(row[column])]))]));
	return { params, types };
}

/**
 * Convert a parsed config into the plain objects the shared growth formula reads.
 *
 * @param {ReturnType<typeof readStatConfig>} config Parsed constants.
 * @returns {import("../../../src/types/formation").FormationStatConstants} Growth parameters by name and type multipliers keyed by type id.
 */
export function toStatConstants(config) {
	let constants = constantsCache.get(config);
	if (!constants) {
		constants = { params: Object.fromEntries(config.params), types: Object.fromEntries([...config.types].map(([id, multipliers]) => [String(id), multipliers])) };
		constantsCache.set(config, constants);
	}
	return constants;
}

/**
 * Compute a doll form's stats at a level, as the game does, through the growth formula the site shares.
 *
 * Verified against 340 hand-written base forms, with the misses being later balance changes.
 *
 * @param {object} gun A `stc/gun.json` row.
 * @param {ReturnType<typeof readStatConfig>} config Parsed constants.
 * @param {number} level 100 for base forms, 120 for Mods.
 * @returns {{ max_hp: number, max_dmg: number, max_acc: number, max_eva: number, max_rof: number, max_armor?: number }} Stats.
 */
export function computeStats(gun, config, level) {
	if (!config.types.has(gun.type)) {
		throw new Error(`gun ${gun.id} has unknown type ${gun.type}`);
	}
	const ratio = { life: gun.ratio_life, pow: gun.ratio_pow, rate: gun.ratio_rate, hit: gun.ratio_hit, dodge: gun.ratio_dodge, armor: gun.ratio_armor };
	const stats = levelStats({ type: gun.type, eatRatio: gun.eat_ratio, ratio }, toStatConstants(config), level);
	const result = { max_hp: stats.hp, max_dmg: stats.dmg, max_acc: stats.acc, max_eva: stats.eva, max_rof: stats.rof };
	return stats.armor > 0 ? { ...result, max_armor: stats.armor } : result;
}
