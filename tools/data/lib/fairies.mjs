import { buildMissionSkill, buildSkill } from "./skills.mjs";
import { cleanName, stripMarkup } from "./text.mjs";

/** Upstream fairy stat fields to the site's fairy stat keys, in display order. */
const STAT_FIELDS = {
	pow: "damage",
	hit: "accuracy",
	dodge: "evasion",
	armor: "armor",
	critical_harm_rate: "critDamage"
};

/** The highest level a fairy reaches. */
const MAX_LEVEL = 100;

/**
 * Read one `game_config_info` value's raw string.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string} name The parameter name, such as `fairy_pow_grow`.
 * @returns {string} The raw `parameter_value`.
 * @throws {Error} When the parameter is missing.
 */
function configValue(upstream, name) {
	const row = upstream.catchdata("game_config_info").find((entry) => entry.parameter_name === name);
	if (!row) {
		throw new Error(`game_config_info has no ${name}`);
	}
	return row.parameter_value;
}

/**
 * Parse a `rank:value,rank:value` string into values ordered by ascending rank.
 *
 * @param {string} value The raw string, such as `1:1,2:20,3:40,4:70,5:100`.
 * @returns {number[]} The values in rank order.
 */
function parseRankedList(value) {
	return value
		.split(",")
		.map((part) => {
			const [rank, entry] = part.split(":");
			return { rank: Number(rank), value: Number(entry) };
		})
		.sort((a, b) => a.rank - b.rank)
		.map((entry) => entry.value);
}

/**
 * Parse `fairy_image_type`'s `form:rank,rank;form:rank,rank` string into star ranks grouped by form, ordered by ascending form number.
 *
 * @param {string} value The raw string, such as `1:1,2;2:3,4;3:5`.
 * @returns {number[][]} Star ranks per form.
 */
function parseForms(value) {
	return value
		.split(";")
		.map((group) => {
			const [form, ranks] = group.split(":");
			return { form: Number(form), ranks: ranks.split(",").map(Number) };
		})
		.sort((a, b) => a.form - b.form)
		.map((entry) => entry.ranks);
}

/**
 * Read a growth curve's first two numbers.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string} field Upstream stat field, such as `pow`.
 * @returns {[number, number]} `[atLevelOne, perLevel]`.
 */
function growPair(upstream, field) {
	const [atLevelOne, perLevel] = configValue(upstream, `fairy_${field}_grow`).split(",").map(Number);
	return [atLevelOne, perLevel];
}

/**
 * Look up a fairy's type name, matching its `typeId` against the `fairy_type` table.
 *
 * @param {Map<number, string>} types Type names by `fairy_type` id.
 * @param {{ id: number, typeId: number }} item The fairy's id and its upstream `fairy_type` id.
 * @returns {string} The matching type name.
 * @throws {Error} When the type id has no matching `fairy_type` name.
 */
export function typeNameFor(types, item) {
	const typeName = types.get(item.typeId);
	if (typeName === undefined) {
		throw new Error(`fairy ${item.id} has no fairy_type name for type id ${item.typeId}`);
	}
	return typeName;
}

/**
 * Build every obtainable fairy, its talents and the constants its stats are worked out from.
 *
 * Stats ship as the game's inputs rather than as numbers, and `src/lib/fairyStats.ts` turns them into a stat at any level and star rank.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @returns {{ constants: object, types: string[], talents: object[], items: object[] }} The stat constants, type names, talents and fairies.
 * @throws {Error} When a fairy or talent's name, text or skill is missing, fewer than 47 fairies are selected, or a fairy's type id has no
 * matching `fairy_type` name.
 */
export function buildFairies(upstream) {
	const constants = {
		maxLevel: MAX_LEVEL,
		grow: Object.fromEntries(Object.entries(STAT_FIELDS).map(([field, key]) => [key, growPair(upstream, field)])),
		starLevels: parseRankedList(configValue(upstream, "fairy_quality_need_level")),
		forms: parseForms(configValue(upstream, "fairy_image_type"))
	};

	const types = new Map(upstream.stc("fairy_type").map((row) => [row.id, cleanName(upstream.t(row.name))]));

	const items = upstream
		.stc("fairy")
		.filter((row) => row.id < 90000 && upstream.t(row.name).trim() !== "")
		.sort((a, b) => a.id - b.id)
		.map((row) => {
			const name = upstream.t(row.name).trim();
			const tagline = stripMarkup(upstream.t(row.description)).trim();
			const introduce = stripMarkup(upstream.t(row.introduce)).trim();
			if (name === "" || tagline === "" || introduce === "") {
				throw new Error(`fairy ${row.id} is missing its name, tagline or introduce text`);
			}
			const strategy = String(row.skill_id).startsWith("*");
			const skill = strategy ? buildMissionSkill(upstream, Number(String(row.skill_id).slice(1))) : buildSkill(upstream, Number(row.skill_id), []);
			const inProduction = String(row.obtain_ids).split(",").includes("39");
			const source = inProduction ? "Production" : row.id >= 1000 ? "Collab" : "Event";
			return {
				id: row.id,
				name,
				code: row.code,
				typeName: typeNameFor(types, { id: row.id, typeId: row.type }),
				strategy,
				tagline,
				introduce,
				productionSeconds: inProduction ? row.develop_duration : null,
				source,
				stats: Object.fromEntries(Object.entries(STAT_FIELDS).map(([field, key]) => [key, row[field]])),
				grow: row.grow,
				proportion: parseRankedList(row.proportion),
				skill
			};
		});

	if (items.length < 47) {
		throw new Error(`expected at least 47 obtainable fairies, found ${items.length}`);
	}

	const typeNames = Array.from(types.keys())
		.sort((a, b) => a - b)
		.map((id) => types.get(id))
		.filter((label) => items.some((item) => item.typeName === label));

	const talents = upstream.stc("fairy_talent").map((row) => {
		const name = cleanName(upstream.t(row.name));
		const effectRows = upstream
			.stc("battle_skill_config")
			.filter((skillRow) => skillRow.skill_group_id === row.id)
			.sort((a, b) => a.level - b.level);
		if (effectRows.length === 0) {
			throw new Error(`talent ${row.id} has no battle_skill_config effect text`);
		}
		const description = stripMarkup(upstream.t(effectRows[0].description)).trim();
		if (name === "" || description === "") {
			throw new Error(`talent ${row.id} is missing its name or description text`);
		}
		return { id: row.id, name, rank: row.rank, description };
	});

	return { constants, types: typeNames, talents, items };
}

/**
 * Compare the fairies with the v3 asset manifest's `fairies` key. An absent or empty `fairies` key means the manifest has not
 * been extended for fairy art yet, so nothing is reported.
 *
 * @param {{ id: number, name: string }[]} fairies Generated fairy records.
 * @param {{ fairies?: Record<string, string[]> }} manifest The v3 asset manifest.
 * @returns {string[]} Names of fairies missing any of the three forms, once the manifest lists any fairy.
 */
export function findFairyArtGaps(fairies, manifest) {
	const entries = manifest.fairies ?? {};
	if (Object.keys(entries).length === 0) {
		return [];
	}
	return fairies.filter((fairy) => !["form1", "form2", "form3"].every((kind) => (entries[String(fairy.id)] ?? []).includes(kind))).map((fairy) => fairy.name);
}
