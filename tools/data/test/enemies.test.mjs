import { test } from "node:test";
import assert from "node:assert/strict";

import { buildAssimilation, buildEnemies, canonicalStatRow, findEnemyArtGaps } from "../lib/enemies.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const warnings = [];
const built = buildEnemies(upstream, warnings);
const assimilationWarnings = [];
const assimilation = buildAssimilation(upstream, assimilationWarnings);

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

test("enemy art gaps are only reported once the manifest lists any enemy", () => {
	const enemies = [
		{ id: 2001, name: "Prowler" },
		{ id: 27001, name: "Architect" }
	];
	assert.deepEqual(findEnemyArtGaps(enemies, { dolls: {} }), []);
	assert.deepEqual(findEnemyArtGaps(enemies, { enemies: {} }), []);
	assert.deepEqual(findEnemyArtGaps(enemies, { enemies: { 2001: ["card", "full"], 27001: ["full"] } }), ["Architect"]);
});

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Protocol Assimilation

test("one playable unit is built per capturable enemy family", () => {
	assert.equal(assimilation.units.length, 57);
	const families = new Set(assimilation.units.map((unit) => unit.familyId));
	assert.equal(families.size, assimilation.units.length);
	const capturable = new Set(built.items.filter((item) => item.capturable).map((item) => item.familyId));
	assert.deepEqual(
		[...families].sort((a, b) => a - b),
		[...capturable].sort((a, b) => a - b)
	);
});

test("display-only sangvis rows are left out", () => {
	assert.equal(upstream.stc("sangvis").length, 67);
	assert.ok(assimilation.units.every((unit) => unit.id < 9000));
	// Every unit that ships has at least one skill, which the dropped rows did not.
	assert.ok(assimilation.units.every((unit) => unit.skills.length > 0));
});

test("a class's skill levels keep the zeros that mark a slot it does not have", () => {
	assert.deepEqual(assimilation.constants.classes.Ringleader.skillLevels, [10, 10, 5, 5]);
	assert.deepEqual(assimilation.constants.classes.Elite.skillLevels, [0, 0, 5, 5]);
	assert.deepEqual(assimilation.constants.classes.Basic.skillLevels, [0, 0, 0, 5]);
});

test("classes carry the capture rates the game shows", () => {
	assert.deepEqual(assimilation.classes, ["Ringleader", "Elite", "Basic"]);
	assert.equal(assimilation.constants.classes.Ringleader.captureRate, 25);
	assert.equal(assimilation.constants.classes.Elite.captureRate, 50);
	assert.equal(assimilation.constants.classes.Basic.captureRate, 100);
	for (const name of assimilation.classes) {
		assert.equal(assimilation.constants.classes[name].guaranteedRate, 100);
	}
	const counts = {};
	for (const unit of assimilation.units) {
		counts[unit.className] = (counts[unit.className] ?? 0) + 1;
	}
	assert.deepEqual(counts, { Ringleader: 30, Elite: 17, Basic: 10 });
});

test("growth inputs come from the game's own config", () => {
	assert.equal(assimilation.constants.maxLevel, 100);
	assert.equal(assimilation.constants.baseLevel, 40);
	assert.deepEqual(assimilation.constants.starUnlockLevels, [1, 10, 30, 70, 90]);
	assert.deepEqual(
		assimilation.constants.starRates.map((rate) => rate.hp),
		[80, 90, 100, 110, 120]
	);
});

test("a Ringleader carries its traits, chip slots and all four skills", () => {
	const scarecrow = assimilation.units.find((unit) => unit.name === "Scarecrow");
	assert.equal(scarecrow.className, "Ringleader");
	assert.equal(scarecrow.familyId, 5);
	assert.deepEqual(scarecrow.traits, ["Unarmored", "T-Doll", "Ranged"]);
	assert.deepEqual(scarecrow.ratios, { hp: 95, damage: 95, accuracy: 90, evasion: 120, rateOfFire: 116, armor: 0 });
	assert.equal(scarecrow.chipSlots.length, 3);
	assert.deepEqual(
		scarecrow.skills.map((skill) => skill.slot),
		["skill1", "skill2", "skill3", "skill_advance"]
	);
	assert.equal(scarecrow.skills[0].name, "Battlefield Purge");
});

test("only Ringleaders get strategic chip slots", () => {
	for (const unit of assimilation.units) {
		assert.equal(unit.chipSlots.length > 0, unit.className === "Ringleader", `${unit.name} chip slots`);
	}
	// One of the fourteen upstream chips has no text at all and is dropped.
	assert.equal(assimilation.chips.length, 13);
	for (const chip of assimilation.chips) {
		assert.ok(chip.name !== "" && chip.description !== "");
	}
});

test("a class only has the skill slots its skills_max_lv gives it", () => {
	const aegis = assimilation.units.find((unit) => unit.name === "Aegis");
	assert.equal(aegis.className, "Elite");
	assert.deepEqual(
		aegis.skills.map((skill) => skill.slot),
		["skill3", "skill_advance"]
	);
	const prowler = assimilation.units.find((unit) => unit.name === "Prowler");
	assert.equal(prowler.className, "Basic");
	assert.deepEqual(
		prowler.skills.map((skill) => skill.slot),
		["skill_advance"]
	);
});

test("everything upstream has no text for is reported rather than shipped empty", () => {
	assert.ok(assimilationWarnings.some((warning) => /6 Protocol Assimilation skill slots have no text/.test(warning)));
	assert.ok(assimilationWarnings.some((warning) => /1 strategic chips have no text: 4001/.test(warning)));
	// The skill builder's own warnings reach the caller rather than being dropped into a throwaway array.
	assert.ok(assimilationWarnings.some((warning) => /levels have a different count of numbers/.test(warning)));
});
