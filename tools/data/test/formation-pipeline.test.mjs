import { test } from "node:test";
import assert from "node:assert/strict";

import { selectReleased } from "../lib/dolls.mjs";
import { buildFormation } from "../lib/formation.mjs";
import { readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { affectionMultiplier, effectiveEchelon, formFor, levelCap, maxModStage } from "../../../src/lib/formation/pipeline.ts";

const upstream = loadUpstream(resolveUpstreamDir());
const { forms, constants } = buildFormation(upstream, selectReleased(upstream, "2099-12-31"), readStatConfig(upstream));
const setup = (overrides) => ({ cell: 4, dollId: 65, modStage: 0, level: 100, links: 1, affection: 0, skill1: 10, skill2: 10, ...overrides });

test("forms, caps and Mod stages", () => {
	assert.equal(formFor({ dollId: 65, modStage: 0 }, forms)?.id, 65);
	assert.equal(formFor({ dollId: 65, modStage: 2 }, forms)?.id, 20065);
	assert.equal(levelCap(0, constants), 100);
	assert.equal(levelCap(3, constants), 120);
	assert.equal(maxModStage(65, forms), 3);
	assert.equal(maxModStage(3, forms), 0);
	assert.equal(affectionMultiplier(2, constants), 0.1);
});

test("a lone HK416 at 100 with 5 links and Oath", () => {
	const [doll] = effectiveEchelon([setup({ links: 5, affection: 2 })], forms, constants);
	assert.equal(doll.base.hp, 121);
	assert.equal(doll.stats.hp, 605);
	assert.equal(doll.stats.dmg, Math.ceil(51 * 1.1));
	assert.equal(doll.stats.acc, Math.ceil(46 * 1.1));
	assert.equal(doll.stats.rof, 76);
	assert.equal(doll.stats.crit, forms["65"].crit);
	assert.deepEqual(
		doll.breakdown.filter((entry) => entry.stat === "hp").map((entry) => [entry.source, entry.amount]),
		[["links", 484]]
	);
});

test("HK416 buffs the SMG in front of it and not the AR behind", () => {
	const [, smg, ar] = effectiveEchelon([setup({ cell: 4 }), setup({ cell: 5, dollId: 16 }), setup({ cell: 3, dollId: 56 })], forms, constants);
	assert.equal(smg.stats.dmg, Math.floor(smg.base.dmg * 1.4));
	assert.deepEqual(smg.breakdown.find((entry) => entry.stat === "dmg" && entry.source === "tiles")?.fromCells, [4]);
	assert.equal(ar.stats.dmg, ar.base.dmg);
});

test("rate of fire stops at the form's cap and says so", () => {
	const capped = { ...forms["65"], id: 99001, dollId: 99001, rofCap: 60 };
	const [doll] = effectiveEchelon([setup({ dollId: 99001 })], { ...forms, 99001: capped }, constants);
	assert.equal(doll.stats.rof, 60);
	assert.equal(doll.rofCapped, true);
	assert.ok(doll.breakdown.some((entry) => entry.stat === "rof" && entry.source === "cap"));
});

test("crit stops at 100 and records the clamp as a cap", () => {
	// A synthetic HK416 whose tile gives every type +5000% crit, pushing the SMG in front of it past 100.
	const buffer = { ...forms["65"], id: 99002, dollId: 99002, tile: { ...forms["65"].tile, effects: [[5, 5000]], targets: [] } };
	const [, smg] = effectiveEchelon([setup({ dollId: 99002 }), setup({ cell: 5, dollId: 16 })], { ...forms, 99002: buffer }, constants);
	const crit = smg.breakdown.filter((entry) => entry.stat === "crit");
	assert.equal(smg.stats.crit, 100);
	assert.deepEqual(
		crit.map((entry) => entry.source),
		["tiles", "cap"]
	);
	assert.ok(smg.base.crit + crit[0].amount > 100);
	assert.ok(crit[1].amount < 0);
	assert.equal(smg.base.crit + crit[0].amount + crit[1].amount, 100);
});

test("setups whose form is missing are skipped", () => {
	assert.deepEqual(effectiveEchelon([setup({ dollId: 123456 })], forms, constants), []);
});
