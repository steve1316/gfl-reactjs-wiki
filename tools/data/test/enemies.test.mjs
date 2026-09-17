import { test } from "node:test";
import assert from "node:assert/strict";

import { buildEnemies, canonicalStatRow, findEnemyArtGaps, toSimulationEnemies } from "../lib/enemies.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const warnings = [];
const built = buildEnemies(upstream, warnings);

/** Pinned enemies: `[id, name, faction, boss, capturable]`, one per faction plus a Ringleader. */
const PINNED = [
	[2001, "Prowler", "Sangvis Ferri", false, true],
	[27001, "Architect", "Sangvis Ferri", true, true],
	[38001, "Cyclops_SG", "KCCO", false, false],
	[46001, "Strelet", "Paradeus", false, false]
];

/**
 * Find one built enemy by id.
 *
 * @param {number} id The enemy's `sub_id`.
 * @returns {object} The enemy record.
 */
function enemy(id) {
	const found = built.items.find((item) => item.id === id);
	assert.ok(found, `enemy ${id} is missing`);
	return found;
}

test("every enemy in the archive is built, keyed by sub_id", () => {
	assert.equal(built.items.length, upstream.stc("enemy_illustration").length);
	assert.equal(new Set(built.items.map((item) => item.id)).size, built.items.length);
});

test("enemies carry the faction their forces value names", () => {
	assert.deepEqual(built.factions, ["Sangvis Ferri", "KCCO", "Paradeus", "Other"]);
	const counts = {};
	for (const item of built.items) {
		counts[item.faction] = (counts[item.faction] ?? 0) + 1;
	}
	assert.deepEqual(counts, { "Sangvis Ferri": 88, KCCO: 39, Paradeus: 77, Other: 147 });
});

test("pinned enemies keep their name, faction, boss tier and capturability", () => {
	for (const [id, ...expected] of PINNED) {
		const item = enemy(id);
		assert.deepEqual([item.name, item.faction, item.boss, item.capturable], expected);
	}
});

test("capturable marks exactly the families Protocol Assimilation has a unit for", () => {
	const fromSangvis = new Set(upstream.stc("sangvis").map((row) => row.illustration_id));
	const marked = new Set(built.items.filter((item) => item.capturable).map((item) => item.familyId));
	assert.deepEqual(
		[...marked].sort((a, b) => a - b),
		[...fromSangvis].sort((a, b) => a - b)
	);
	assert.equal(marked.size, 57);
});

test("every enemy has a details entry and every details entry has an enemy", () => {
	for (const item of built.items) {
		assert.ok(built.details[item.id], `enemy ${item.id} has no details`);
	}
	for (const id of Object.keys(built.details)) {
		assert.ok(
			built.items.some((item) => String(item.id) === id),
			`details ${id} has no enemy`
		);
	}
});

test("details carry the archive's lore, counter text and skills", () => {
	const architect = built.details[27001];
	assert.match(architect.introduce, /Sangvis/);
	assert.match(architect.counter, /splash damage/);
	assert.equal(architect.voiceActor, "Yuka Ootsuba");
	assert.equal(architect.organisation, "Isolated Testing Ground");
	assert.ok(architect.skills.length >= 2);
	for (const skill of architect.skills) {
		assert.ok(skill.name !== "" && skill.description !== "");
	}
	// Prowler is a plain mob: it has counter text but no named skills of its own.
	assert.deepEqual(built.details[2001].skills, []);
});

test("base stats come from the archive-level row", () => {
	assert.deepEqual(built.details[2001].baseStats, { hp: 397, damage: 11, accuracy: 23, evasion: 15, rateOfFire: 30, armor: 0, armorPiercing: 0, range: 4, speed: 30, number: 1 });
	assert.equal(built.details[2001].baseStatsLevel, 100);
	assert.equal(built.details[27001].baseStats.hp, 40000);
	assert.equal(built.details[46001].baseStats.hp, 1050);
});

test("rank bars come straight from the archive", () => {
	assert.deepEqual(enemy(2001).ranks, { power: 1, health: 1, accuracy: 1, evasion: 1, rateOfFire: 3, armor: 0, speed: 2, range: 2, tenacity: 0 });
	// Cyclops_SG is the shielded KCCO unit, so its armor bar is the one that has to be non-zero.
	assert.equal(enemy(38001).ranks.armor, 4);
});

test("the six enemies with no stat row are reported rather than dropped", () => {
	const withoutStats = built.items.filter((item) => built.details[item.id].baseStats === null);
	assert.equal(withoutStats.length, 6);
	assert.ok(warnings.some((warning) => warning.includes("have no stat row")));
	assert.ok(warnings.some((warning) => warning.includes("enemy_illustration_sub_id that does not exist")));
});

test("canonicalStatRow prefers the lowest-numbered row at the archive level", () => {
	const rows = [
		{ id: 11025, level: 30100 },
		{ id: 10025, level: 100 },
		{ id: 10026, level: 100 }
	];
	assert.equal(canonicalStatRow(rows).id, 10025);
	assert.equal(
		canonicalStatRow([
			{ id: 20001, level: 10100 },
			{ id: 30001, level: 30100 }
		]).id,
		20001
	);
	assert.equal(canonicalStatRow([]), null);
});

test("the simulation extract keeps only enemies that have stats", () => {
	const simulation = toSimulationEnemies(built);
	assert.equal(simulation.length, built.items.length - 6);
	assert.deepEqual(
		simulation.find((entry) => entry.id === 2001),
		{ id: 2001, name: "Prowler", faction: "Sangvis Ferri", boss: false, stats: built.details[2001].baseStats, level: 100 }
	);
});

test("enemy art gaps are only reported once the manifest lists any enemy", () => {
	const enemies = [
		{ id: 2001, name: "Prowler" },
		{ id: 27001, name: "Architect" }
	];
	assert.deepEqual(findEnemyArtGaps(enemies, { dolls: {} }), []);
	assert.deepEqual(findEnemyArtGaps(enemies, { enemies: {} }), []);
	assert.deepEqual(findEnemyArtGaps(enemies, { enemies: { 2001: ["card", "full"], 27001: ["full"] } }), ["Architect"]);
});
