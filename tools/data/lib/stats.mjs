/** gun_type_info columns per stat. Every value in that file is a string. */
const TYPE_COLUMNS = {
	life: "basic_attribute_life",
	pow: "basic_attribute_pow",
	rate: "basic_attribute_rate",
	hit: "basic_attribute_hit",
	dodge: "basic_attribute_dodge",
	armor: "basic_attribute_armor"
};

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
 * Look up a constant, switching to its `_after100` variant above level 100.
 *
 * @param {Map<string, number[]>} params Parsed game_config_info.
 * @param {string} name Parameter name without the suffix.
 * @param {number} level Doll level.
 * @returns {number[]} The constant's values.
 */
function param(params, name, level) {
	const value = params.get(level > 100 ? `${name}_after100` : name);
	if (!value) {
		throw new Error(`missing game_config_info parameter ${name}`);
	}
	return value;
}

/**
 * Compute a doll form's stats at a level, as the game does.
 *
 * HP and armour grow linearly. Damage, accuracy, evasion and rate of fire add a base part and a grown part that
 * scales with `eat_ratio`. Verified against 340 hand-written base forms, with the misses being later balance changes.
 *
 * @param {object} gun A `stc/gun.json` row.
 * @param {ReturnType<typeof readStatConfig>} config Parsed constants.
 * @param {number} level 100 for base forms, 120 for Mods.
 * @returns {{ max_hp: number, max_dmg: number, max_acc: number, max_eva: number, max_rof: number, max_armor?: number }} Stats.
 */
export function computeStats(gun, config, level) {
	const type = config.types.get(gun.type);
	if (!type) {
		throw new Error(`gun ${gun.id} has unknown type ${gun.type}`);
	}
	const { params } = config;
	const linear = (name, multiplier, ratio) => {
		const [base, perLevel, divisor] = param(params, name, level);
		return Math.ceil(((base + (level - 1) * perLevel) * multiplier * ratio) / divisor);
	};
	const grown = (name, multiplier, ratio) => {
		const [basic, basicDivisor] = params.get(`${name}_basic`);
		const [grow, divisorA, divisorB, constant] = param(params, `${name}_grow`, level);
		return Math.ceil((basic * multiplier * ratio) / basicDivisor) + Math.ceil(((grow * (level - 1) + constant) * multiplier * ratio * gun.eat_ratio) / divisorA / divisorB);
	};
	const stats = {
		max_hp: linear("life_basic", type.life, gun.ratio_life),
		max_dmg: grown("power", type.pow, gun.ratio_pow),
		max_acc: grown("hit", type.hit, gun.ratio_hit),
		max_eva: grown("dodge", type.dodge, gun.ratio_dodge),
		max_rof: grown("rate", type.rate, gun.ratio_rate)
	};
	const armor = linear("armor_basic", type.armor, gun.ratio_armor);
	return armor > 0 ? { ...stats, max_armor: armor } : stats;
}
