import { test } from "node:test";
import assert from "node:assert/strict";

import { buildFairies } from "../lib/fairies.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { effectiveStars, fairyForm, fairyStats } from "../../../src/lib/fairyStats.ts";

/** IOPWiki level-1 / 1-star and level-100 / 5-star values as [damage, accuracy, evasion, armor]. Command Fairy's level-1 damage is left out: IOPWiki lists 8.4, which is its crit value. */
const IOPWIKI = {
	"Warrior Fairy": [
		[4.8, 16, 8, 2],
		[25, 80, 40, 10]
	],
	"Armor Fairy": [
		[4.4, 0, 0, 5.2],
		[22, 0, 0, 25]
	],
	"Airstrike Fairy": [
		[4.8, 8, 6.4, 1.6],
		[30, 50, 40, 10]
	],
	"Golden Fairy": [
		[2, 6, 4.8, 1.2],
		[20, 62, 50, 12]
	],
	"Anna Graem": [
		[5.2, 6.8, 14.4, 1.6],
		[25, 30, 65, 8]
	],
	"Reinforcement Fairy": [
		[2, 0, 14, 2],
		[12, 0, 88, 12]
	]
};

const built = buildFairies(loadUpstream(resolveUpstreamDir()));
const four = (s) => [s.damage, s.accuracy, s.evasion, s.armor];

test("keeps the 47 obtainable fairies with their types", () => {
	assert.equal(built.items.length, 47);
	assert.deepEqual([built.items[0].id, built.items[40].id, built.items[41].id, built.items[46].id], [1, 41, 1004, 1009]);
	assert.deepEqual(built.types, ["Support", "Buff", "Defense", "Rampage", "Reinforce", "Battle"]);
	const warrior = built.items[0];
	assert.equal(warrior.name, "Warrior Fairy");
	assert.equal(warrior.code, "fighting");
	assert.equal(warrior.typeName, "Buff");
	assert.equal(warrior.source, "Production");
	assert.equal(warrior.productionSeconds, 16200);
	assert.equal(built.items.find((f) => f.id === 1007).source, "Collab");
	assert.equal(built.items.find((f) => f.id === 18).source, "Event");
});

test("builds battle and strategy skills", () => {
	const warrior = built.items[0];
	assert.equal(warrior.strategy, false);
	assert.equal(warrior.skill.name, "Combat Efficiency");
	assert.equal(warrior.skill.stat1[9], "20%");
	const reinforce = built.items.find((f) => f.id === 10);
	assert.equal(reinforce.strategy, true);
	assert.match(reinforce.skill.description, /dummy/);
	assert.equal(reinforce.skill.cost.length, 10);
});

test("lists every talent with its effect", () => {
	assert.equal(built.talents.length, 37);
	const assault = built.talents.find((t) => t.name === "Assault");
	assert.equal(assault.rank, 1);
	assert.match(assault.description, /ARs' damage by 10%/);
});

test("stats match IOPWiki at level 1 / 1 star and level 100 / 5 stars", () => {
	for (const [name, [low, high]] of Object.entries(IOPWIKI)) {
		const fairy = built.items.find((f) => f.name === name);
		assert.deepEqual(four(fairyStats(fairy, built.constants, 1, 1)), low, `${name} low`);
		assert.deepEqual(four(fairyStats(fairy, built.constants, 100, 5)), high, `${name} high`);
	}
	const command = built.items.find((f) => f.name === "Command Fairy");
	assert.deepEqual(four(fairyStats(command, built.constants, 100, 5)), [36, 0, 32, 8]);
});

test("stars are capped by level and map to forms", () => {
	assert.equal(effectiveStars(built.constants, 1, 5), 1);
	assert.equal(effectiveStars(built.constants, 70, 5), 4);
	assert.equal(effectiveStars(built.constants, 100, 5), 5);
	assert.deepEqual(
		[1, 2, 3, 4, 5].map((stars) => fairyForm(built.constants, stars)),
		[1, 1, 2, 2, 3]
	);
});
