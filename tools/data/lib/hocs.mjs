import { buildSkill } from "./skills.mjs";
import { cleanName, stripMarkup } from "./text.mjs";

/** Upstream stat fields to the site's HOC stat keys, in display order. */
const STAT_FIELDS = {
	assist_damage: "lethality",
	assist_def_break: "pierce",
	assist_hit: "precision",
	assist_reload: "reload"
};

/** `squad_type` ids of the three classes a player can own. Assist and Coalition units are event allies. */
const PLAYABLE_TYPES = [1, 2, 3];

/** How many star ranks a HOC has. */
const STAR_RANKS = 5;

/**
 * Read one `game_config_info` value as a number.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string} name The parameter name, such as `squad_basic_lv`.
 * @returns {number} The value.
 * @throws {Error} When the parameter is missing.
 */
function configNumber(upstream, name) {
	const row = upstream.catchdata("game_config_info").find((entry) => entry.parameter_name === name);
	if (!row) {
		throw new Error(`game_config_info has no ${name}`);
	}
	return Number(row.parameter_value);
}

/**
 * Build every released, obtainable HOC and the constants its stats are worked out from.
 *
 * Stats ship as the game's inputs rather than as numbers, and `src/lib/hocStats.ts` turns them into a stat at any level and star rank.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string} cutoff Release cutoff date, `YYYY-MM-DD`. HOCs released later are left out.
 * @returns {{ constants: object, classes: string[], items: object[] }} The stat constants, class names in `squad_type` order, and HOCs by id.
 * @throws {Error} When a HOC's name, class or description text is missing.
 */
export function buildHocs(upstream, cutoff) {
	const limit = `${cutoff} 23:59:59`;
	const types = new Map(upstream.stc("squad_type").map((row) => [row.type_id, row]));
	const standard = new Map(upstream.stc("squad_standard_attribution").map((row) => [row.attribute_type, row]));
	const ranks = new Map(upstream.stc("squad_rank").map((row) => [row.star_id, row]));

	const constants = {
		baseLevel: configNumber(upstream, "squad_basic_lv"),
		maxLevel: configNumber(upstream, "squad_lv_max"),
		stats: Object.fromEntries(Object.entries(STAT_FIELDS).map(([field, key]) => [key, { basicRate: standard.get(field).basic_rate, cpuRate: standard.get(field).cpu_rate }])),
		starCpuRates: Array.from({ length: STAR_RANKS }, (_v, index) => ranks.get(index + 1).cpu_rate)
	};

	const items = upstream
		.stc("squad")
		.filter((row) => row.is_show === 1 && PLAYABLE_TYPES.includes(row.type) && row.launch_time <= limit)
		.sort((a, b) => a.id - b.id)
		.map((row) => {
			const type = types.get(row.type);
			const name = cleanName(upstream.t(row.en_name));
			const className = cleanName(upstream.t(type.en_name));
			const description = stripMarkup(upstream.t(row.introduce)).trim();
			if (name === "" || className === "" || description === "") {
				throw new Error(`HOC ${row.id} is missing its name, class or description text`);
			}
			return {
				id: row.id,
				name,
				className,
				description,
				released: row.launch_time.slice(0, 10),
				productionSeconds: row.develop_duration,
				range: Math.max(...String(row.battle_assist_range).split(",").map(Number)),
				basicRate: row.basic_rate,
				cpuRate: row.cpu_rate,
				// The game multiplies these three factors before any level scaling, in this order.
				attributes: Object.fromEntries(Object.entries(STAT_FIELDS).map(([field, key]) => [key, row[field] * type[field] * standard.get(field).standard_attribute])),
				skills: [row.skill1, row.skill2, row.skill3].map((id) => buildSkill(upstream, id, []))
			};
		});

	const classes = PLAYABLE_TYPES.map((id) => cleanName(upstream.t(types.get(id).en_name))).filter((label) => items.some((hoc) => hoc.className === label));
	return { constants, classes, items };
}
