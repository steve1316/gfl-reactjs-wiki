import { cleanName, stripMarkup } from "./text.mjs";

/** Faction names by `enemy_illustration.forces`, in the order the index lists them. Anything with no faction is grouped as Other. */
const FACTIONS = [
	{ forces: 1, name: "Sangvis Ferri" },
	{ forces: 2, name: "KCCO" },
	{ forces: 3, name: "Paradeus" },
	{ forces: 0, name: "Other" }
];

/** Upstream rank fields to the site's rank keys, in display order. Each one is a bar the game's archive draws, not a real stat. */
const RANK_FIELDS = {
	pow_rank: "power",
	life_rank: "health",
	hit_rank: "accuracy",
	dodge_rank: "evasion",
	rate_rank: "rateOfFire",
	armor_rank: "armor",
	speed_rank: "speed",
	range_rank: "range",
	tenacity_rank: "tenacity"
};

/** Upstream `enemy_character_type` fields to the site's stat keys, in display order. */
const STAT_FIELDS = {
	maxlife: "hp",
	pow: "damage",
	hit: "accuracy",
	dodge: "evasion",
	rate: "rateOfFire",
	armor: "armor",
	armor_piercing: "armorPiercing",
	range: "range",
	speed: "speed",
	number: "number"
};

/** The `enemy_illustration.type` that marks the named boss and Ringleader tier. The other values are mob tiers the game never gives names to. */
const BOSS_TYPE = 1;

/**
 * The level a canonical archive row carries. The same enemy also has per-mode deployment rows whose `level` is an encoded marker
 * such as 10100 or 30100, and training targets with rows that only differ in HP. Those are not what the archive shows.
 */
const ARCHIVE_LEVEL = 100;

/** Fewer enemies than this means the archive table or the join went wrong. */
const MIN_ENEMIES = 300;

/**
 * Pick the stat row that stands for one enemy. Preference goes to the lowest-numbered row at the archive level, which for regular
 * mobs is the 10000-series base unit. Anything else falls back to the lowest-numbered row of any level.
 *
 * These are base deployment values, not the numbers a player meets on a map. The same enemy also has per-mode rows that scale them,
 * so the archive's own rank bars are the honest way to compare two enemies and these numbers are only a starting point.
 *
 * @param {object[]} rows The `enemy_character_type` rows joined to this enemy, in any order.
 * @returns {object | null} The canonical row, or null when the enemy has no stat row at all.
 */
export function canonicalStatRow(rows) {
	if (rows.length === 0) {
		return null;
	}
	const atArchiveLevel = rows.filter((row) => row.level === ARCHIVE_LEVEL);
	return (atArchiveLevel.length > 0 ? atArchiveLevel : rows).reduce((best, row) => (row.id < best.id ? row : best));
}

/**
 * Build every enemy in the game's archive, split into the records the index needs and the details only a page needs.
 *
 * Enemies are keyed by `sub_id` rather than `id`, since that is what is unique across the table and what the stat rows join on.
 * A family such as Scarecrow carries several sub ids, one per variant, and each becomes its own record.
 *
 * Every enemy ships. `enemy_illustration.launch_time` looks like a release date but only ever holds the game's launch date or a
 * 2035 placeholder, so it says nothing about whether an enemy is live and is not used as a filter.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string[]} warnings Collected warnings, appended to in place.
 * @returns {{ factions: string[], items: object[], details: Record<string, object> }} Faction names in display order, the index records, and the page details by id.
 * @throws {Error} When an enemy has no name, or fewer than `MIN_ENEMIES` enemies are built.
 */
export function buildEnemies(upstream, warnings) {
	const organisations = new Map(upstream.stc("organization").map((row) => [row.id, cleanName(upstream.t(row.name))]));
	const skills = new Map(upstream.stc("enemy_illustration_skill").map((row) => [row.id, { name: cleanName(upstream.t(row.name)), description: stripMarkup(upstream.t(row.description)).trim() }]));

	// Captured units come from `sangvis`, which points back at an enemy family. `if_capture` says the same thing, and the two are
	// cross-checked below rather than one being trusted on its own.
	const capturedFamilies = new Set(upstream.stc("sangvis").map((row) => row.illustration_id));

	const illustrations = upstream.stc("enemy_illustration");
	const knownSubIds = new Set(illustrations.map((row) => row.sub_id));

	const statRows = new Map();
	let orphanStatRows = 0;
	for (const row of upstream.stc("enemy_character_type")) {
		const subId = row.enemy_illustration_sub_id;
		if (!subId) {
			continue;
		}
		if (!knownSubIds.has(subId)) {
			orphanStatRows += 1;
			continue;
		}
		if (!statRows.has(subId)) {
			statRows.set(subId, []);
		}
		statRows.get(subId).push(row);
	}
	if (orphanStatRows > 0) {
		warnings.push(`enemy_character_type has ${orphanStatRows} rows pointing at an enemy_illustration_sub_id that does not exist`);
	}

	const flaggedFamilies = new Set(illustrations.filter((row) => row.if_capture === 1).map((row) => row.id));
	const disagreements = [...flaggedFamilies].filter((id) => !capturedFamilies.has(id)).concat([...capturedFamilies].filter((id) => !flaggedFamilies.has(id)));
	if (disagreements.length > 0) {
		warnings.push(`enemy_illustration if_capture and sangvis disagree on ${disagreements.length} families: ${disagreements.join(", ")}`);
	}

	const items = [];
	const details = {};
	for (const row of illustrations) {
		const name = cleanName(upstream.t(row.name));
		if (name === "") {
			throw new Error(`enemy ${row.sub_id} is missing its name text`);
		}
		const statRow = canonicalStatRow(statRows.get(row.sub_id) ?? []);
		const subName = cleanName(upstream.t(row.sub_name));
		items.push({
			id: row.sub_id,
			familyId: row.id,
			name,
			code: row.code,
			faction: FACTIONS.find((entry) => entry.forces === row.forces)?.name ?? "Other",
			boss: row.type === BOSS_TYPE,
			capturable: capturedFamilies.has(row.id),
			ranks: Object.fromEntries(Object.entries(RANK_FIELDS).map(([field, key]) => [key, row[field] ?? 0]))
		});
		details[row.sub_id] = {
			// Only worth carrying when it differs from the name, which it usually does not.
			subName: subName === name ? null : subName,
			introduce: stripMarkup(upstream.t(row.introduce)).trim(),
			counter: stripMarkup(upstream.t(row.counter)).trim(),
			// `extra` holds the voice actor wrapped in separators, which `unescapeText` has already turned into commas.
			voiceActor: cleanName(upstream.t(row.extra).replaceAll(",", " ")),
			organisation: organisations.get(row.org_id) ?? null,
			baseStats: statRow === null ? null : Object.fromEntries(Object.entries(STAT_FIELDS).map(([field, key]) => [key, statRow[field] ?? 0])),
			baseStatsLevel: statRow?.level ?? null,
			skills: String(row.enemy_skill ?? "")
				.split(",")
				.map((id) => skills.get(Number(id)))
				.filter((skill) => skill !== undefined && skill.name !== "")
		};
	}

	if (items.length < MIN_ENEMIES) {
		throw new Error(`expected at least ${MIN_ENEMIES} enemies, found ${items.length}`);
	}

	const withoutStats = items.filter((item) => details[item.id].baseStats === null);
	if (withoutStats.length > 0) {
		warnings.push(`${withoutStats.length} enemies have no stat row: ${withoutStats.map((item) => item.name).join(", ")}`);
	}

	const factions = FACTIONS.map((entry) => entry.name).filter((label) => items.some((item) => item.faction === label));
	return { factions, items, details };
}

/**
 * Reduce the enemies to what a battle simulation needs. Kept here so the `enemy_illustration` to `enemy_character_type` join is
 * written once, rather than again by whatever consumes it.
 *
 * @param {{ items: object[], details: Record<string, object> }} enemies The built enemies.
 * @returns {object[]} One entry per enemy that has stats, with its name, faction and canonical stat block.
 */
export function toSimulationEnemies(enemies) {
	return enemies.items
		.filter((item) => enemies.details[item.id].baseStats !== null)
		.map((item) => ({ id: item.id, name: item.name, faction: item.faction, boss: item.boss, stats: enemies.details[item.id].baseStats, level: enemies.details[item.id].baseStatsLevel }));
}

/**
 * Compare the enemies with the v3 asset manifest's `enemies` key. An absent or empty `enemies` key means the manifest has not
 * been extended for enemy art yet, so nothing is reported.
 *
 * @param {{ id: number, name: string }[]} enemies Generated enemy records.
 * @param {{ enemies?: Record<string, string[]> }} manifest The v3 asset manifest.
 * @returns {string[]} Names of enemies missing their card art, once the manifest lists any enemy.
 */
export function findEnemyArtGaps(enemies, manifest) {
	const entries = manifest.enemies ?? {};
	if (Object.keys(entries).length === 0) {
		return [];
	}
	return enemies.filter((enemy) => !(entries[String(enemy.id)] ?? []).includes("card")).map((enemy) => enemy.name);
}
