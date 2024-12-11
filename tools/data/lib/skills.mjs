import { stripMarkup } from "./text.mjs";

/** A number, with a trailing `%` or `x` kept as part of the value when no letter follows it. */
const NUMBER = /-?\d+(?:\.\d+)?(?:%|x(?![A-Za-z]))?/g;

/**
 * Words whose plural form changes with the number in front of them. Kept for reference: templating no longer
 * requires the wording to match between levels (see `templateLevels`), only the count of numbers, so this no
 * longer feeds a comparison. Left in place in case a future word-level check needs it again.
 */
const PLURALS = /\b(second|unit|time|stack|round|shot|target|enemy|enemie)s\b/g;

/** The game runs skill timers at 30 frames per second. */
const FRAMES_PER_SECOND = 30;

/** Skill rows by id, built once per upstream. The table is 41 MB, so it is indexed a single time. */
const INDEXES = new WeakMap();

/**
 * Format seconds without a trailing `.0`.
 *
 * @param {number} seconds Seconds, rounded to one decimal.
 * @returns {number} The rounded value.
 */
function roundSeconds(seconds) {
	return Math.round(seconds * 10) / 10;
}

/**
 * Split text into the parts between numbers and the numbers themselves.
 *
 * @param {string} text One level's description.
 * @returns {{ parts: string[], numbers: string[] }} `parts` has one more entry than `numbers`.
 */
function tokenise(text) {
	const numbers = text.match(NUMBER) ?? [];
	const parts = text.split(NUMBER);
	return { parts, numbers };
}

/**
 * Turn ten per-level descriptions into one template and its per-level values.
 *
 * Numbers that differ between levels become `#1`, `#2` ... in order. Numbers that never change stay in the text.
 * The wording around the numbers is allowed to drift between levels (upstream sometimes swaps a word, like
 * "Throw" for "Launch", or has a typo on one level) - only the count of numbers per level has to agree, since that
 * is what lines the per-level values up by position. The level 10 wording is used for the final text.
 *
 * @param {string[]} levels The description at levels 1 to 10.
 * @returns {{ description: string, stats: string[][] } | null} The template, or null when the levels have a different count of numbers.
 */
export function templateLevels(levels) {
	const tokens = levels.map(tokenise);
	const firstCount = tokens[0].numbers.length;
	if (tokens.some((entry) => entry.numbers.length !== firstCount)) {
		return null;
	}
	const last = tokens[tokens.length - 1];
	const stats = [];
	let description = last.parts[0];
	last.numbers.forEach((number, index) => {
		const values = tokens.map((entry) => entry.numbers[index]);
		if (values.every((value) => value === values[0])) {
			description += number;
		} else {
			stats.push(values);
			description += `#${stats.length}`;
		}
		description += last.parts[index + 1];
	});
	return { description, stats };
}

/**
 * Index `battle_skill_config` rows by id.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @returns {Map<number, object>} Rows keyed by id.
 */
function skillRows(upstream) {
	let index = INDEXES.get(upstream);
	if (!index) {
		index = new Map(upstream.stc("battle_skill_config").map((row) => [row.id, row]));
		INDEXES.set(upstream, index);
	}
	return index;
}

/** `mission_skill_config` rows grouped by `skill_group_id`, built once per upstream. */
const MISSION_SKILL_GROUPS = new WeakMap();

/**
 * Group `mission_skill_config` rows by `skill_group_id`, sorted by level.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @returns {Map<number, object[]>} Rows keyed by group id.
 */
function missionSkillGroups(upstream) {
	let index = MISSION_SKILL_GROUPS.get(upstream);
	if (!index) {
		index = new Map();
		for (const row of upstream.stc("mission_skill_config")) {
			const rows = index.get(row.skill_group_id) ?? [];
			rows.push(row);
			index.set(row.skill_group_id, rows);
		}
		for (const rows of index.values()) {
			rows.sort((a, b) => a.level - b.level);
		}
		MISSION_SKILL_GROUPS.set(upstream, index);
	}
	return index;
}

/**
 * Build one strategy fairy skill from its ten level rows in `mission_skill_config`.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {number} group The skill group id from a fairy's `skill_id`, with the leading `*` stripped.
 * @returns {object} The skill in the site's raw shape, with `cost` per level instead of a battle skill's cooldown-driven fields. Has no
 * `initial_cooldown`, since `mission_skill_config` carries no field for it.
 */
export function buildMissionSkill(upstream, group) {
	const rows = missionSkillGroups(upstream).get(group) ?? [];
	if (rows.length !== 10) {
		throw new Error(`mission skill ${group} is missing level rows`);
	}
	const top = rows[9];
	const levels = rows.map((row) => stripMarkup(upstream.t(row.description)).trim());
	const templated = templateLevels(levels);
	const description = templated ? templated.description : levels[9];
	const stats = templated ? templated.stats : [];

	const skill = {
		name: upstream.t(top.name).trim(),
		cooldown: rows.map((row) => row.cd_time),
		cost: rows.map((row) => row.consumption),
		description,
		number_of_stats: stats.length
	};
	stats.forEach((values, index) => {
		skill[`stat${index + 1}`] = values;
	});
	return skill;
}

/**
 * Build one skill from its ten level rows.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {number} groupId The skill id from `gun.skill1` or `gun.skill2`.
 * @param {string[]} warnings Collects a message for each skill that falls back to level-10 text.
 * @returns {object} The skill in the site's raw shape.
 */
export function buildSkill(upstream, groupId, warnings) {
	const byId = skillRows(upstream);
	const rows = Array.from({ length: 10 }, (_v, index) => byId.get(groupId * 100 + index + 1));
	if (rows.some((row) => row === undefined)) {
		throw new Error(`skill ${groupId} is missing level rows`);
	}
	const top = rows[9];
	const passive = top.type !== 1;
	const levels = rows.map((row) => stripMarkup(upstream.t(row.description)).trim());
	const templated = templateLevels(levels);
	if (templated === null) {
		warnings.push(`skill ${groupId}: levels have a different count of numbers, using level 10 text`);
	}
	const description = templated ? templated.description : levels[9];
	const stats = templated ? templated.stats : [];

	const skill = {
		name: upstream.t(top.name).trim(),
		initial_cooldown: passive ? "Passive" : `${roundSeconds(top.start_cd_time / FRAMES_PER_SECOND)}s`
	};
	if (!passive) {
		skill.cooldown = rows.map((row) => roundSeconds(row.cd_time / FRAMES_PER_SECOND));
	}
	skill.description = description;
	skill.number_of_stats = stats.length;
	stats.forEach((values, index) => {
		skill[`stat${index + 1}`] = values;
	});
	return skill;
}
