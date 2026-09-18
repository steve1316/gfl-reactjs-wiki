import { toStatConstants } from "./stats.mjs";
import { TILE_EFFECT_CODES, tileCell } from "./tiles.mjs";

/** Mod rows are the base id plus this offset. */
const MOD_OFFSET = 20000;

/** `game_config_info` names the growth formula reads. Everything else stays out of `constants.json`. */
const GROWTH_PARAM = /^(life|armor)_basic(_after100)?$|^(power|hit|dodge|rate)_(basic|grow)(_after100)?$/;

/**
 * Look up a `game_config_info` constant by name.
 *
 * @param {Map<string, number[]>} params Parsed `game_config_info`.
 * @param {string} name Parameter name.
 * @returns {number[]} The constant's values.
 * @throws {Error} When the parameter is missing.
 */
function requireConfig(params, name) {
	const value = params.get(name);
	if (!value) {
		throw new Error(`missing game_config_info parameter ${name}`);
	}
	return value;
}

/**
 * Build a form's tile buffs in numeric form.
 *
 * Offsets use the same cell mapping as the doll page's tile grid (`buildTiles`), taken relative to the doll's own cell, so placing a doll anywhere
 * on the formation grid shifts its whole pattern with it.
 *
 * @param {object} gun A `stc/gun.json` row.
 * @returns {import("../../../src/types/formation").FormationTile} The tile.
 */
export function buildFormationTile(gun) {
	const center = gun.effect_grid_center;
	const self = tileCell(26 - center);
	const offsets = String(gun.effect_grid_pos)
		.split(",")
		.filter(Boolean)
		.map(Number)
		.map((position) => {
			const [row, column] = tileCell(position - center + 13);
			return [row - self[0], column - self[1]];
		});
	const targets = String(gun.effect_guntype)
		.split(",")
		.map(Number)
		.filter((code) => code !== 0);
	const effects = String(gun.effect_grid_effect)
		.split(";")
		.filter(Boolean)
		.map((pair) => pair.split(",").map(Number))
		.filter(([code]) => TILE_EFFECT_CODES.has(code));
	return { self, offsets, targets, effects };
}

/**
 * Build one form's numeric simulator data.
 *
 * @param {object} gun The form's gun row.
 * @param {number} dollId The base doll id.
 * @returns {import("../../../src/types/formation").FormationForm} The form.
 */
function buildFormationForm(gun, dollId) {
	return {
		id: gun.id,
		dollId,
		mod: gun.id >= MOD_OFFSET,
		type: gun.type,
		ratio: { life: gun.ratio_life, pow: gun.ratio_pow, rate: gun.ratio_rate, hit: gun.ratio_hit, dodge: gun.ratio_dodge, armor: gun.ratio_armor },
		eatRatio: gun.eat_ratio,
		crit: gun.crit,
		armorPiercing: gun.armor_piercing,
		rofCap: gun.atk_speed_max,
		clip: gun.special,
		hasSkill2: Boolean(gun.skill2),
		tile: buildFormationTile(gun)
	};
}

/**
 * Build the opposing side's data: every enemy the archive gives combat stats for, trimmed to what the simulator reads.
 *
 * The enemy archive's own files are not reused here. `enemies.json` carries the rank bars rather than numbers, and
 * `enemy-details.json` is 287 KB of lore and skill text the simulator has no use for, so this is a third, small file the
 * formation route can load on its own.
 *
 * @param {{ items: object[], details: Record<string, object> }} enemies The enemy archive from `buildEnemies`.
 * @returns {object[]} One record per enemy with stats, in archive order.
 */
export function buildFormationEnemies(enemies) {
	return enemies.items.flatMap((enemy) => {
		const stats = enemies.details[enemy.id]?.baseStats;
		// A handful of archive entries are illustrations with no deployment row at all, and there is nothing to fight without one.
		if (!stats) {
			return [];
		}
		return [
			{
				id: enemy.id,
				name: enemy.name,
				code: enemy.code,
				faction: enemy.faction,
				boss: enemy.boss,
				stats: {
					hp: stats.hp,
					dmg: stats.damage,
					acc: stats.accuracy,
					eva: stats.evasion,
					rof: stats.rateOfFire,
					armor: stats.armor,
					armorPiercing: stats.armorPiercing,
					count: stats.number
				}
			}
		];
	});
}

/**
 * Build the formation simulator's data: every released doll's base form and Mod, and the constants the engine reads.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {object[]} baseGuns Released base gun rows, from `selectReleased`.
 * @param {ReturnType<import("./stats.mjs").readStatConfig>} config Parsed stat constants.
 * @returns {{ forms: Record<string, import("../../../src/types/formation").FormationForm>, constants: import("../../../src/types/formation").FormationConstants }} The data.
 */
export function buildFormation(upstream, baseGuns, config) {
	const guns = new Map(upstream.stc("gun").map((gun) => [gun.id, gun]));
	const forms = {};
	for (const base of baseGuns) {
		forms[String(base.id)] = buildFormationForm(base, base.id);
		const mod = guns.get(base.id + MOD_OFFSET);
		if (mod) {
			forms[String(mod.id)] = buildFormationForm(mod, base.id);
		}
	}
	const params = Object.fromEntries([...config.params].filter(([name]) => GROWTH_PARAM.test(name)));
	const constants = {
		stats: { params, types: toStatConstants(config).types },
		hgTileGrowth: requireConfig(config.params, "hg_effect_grow"),
		modLevelCaps: requireConfig(config.params, "gun_max_level"),
		affection: {
			normal: requireConfig(config.params, "favor_attribute_10_89")[0],
			high: requireConfig(config.params, "favor_attribute_90_139")[0],
			oath: requireConfig(config.params, "favor_attribute_140")[0]
		},
		skillCdLimit: requireConfig(config.params, "cd_reduction_limit")[0]
	};
	return { forms, constants };
}
