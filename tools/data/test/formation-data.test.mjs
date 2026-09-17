import { test } from "node:test";
import assert from "node:assert/strict";

import { selectReleased } from "../lib/dolls.mjs";
import { buildFormation } from "../lib/formation.mjs";
import { computeStats, readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { levelStats } from "../../../src/lib/formation/growth.ts";

const upstream = loadUpstream(resolveUpstreamDir());
const config = readStatConfig(upstream);
const released = selectReleased(upstream, "2099-12-31");
const { forms, constants } = buildFormation(upstream, released, config);

test("every released doll and its Mod has a form", () => {
	const guns = new Map(upstream.stc("gun").map((gun) => [gun.id, gun]));
	for (const base of released) {
		assert.ok(forms[String(base.id)], `doll ${base.id}`);
		if (guns.has(base.id + 20000)) {
			assert.equal(forms[String(base.id + 20000)]?.dollId, base.id, `mod of ${base.id}`);
		}
	}
});

test("M4A1 Mod carries its combat fields and tile", () => {
	const form = forms["20055"];
	assert.equal(form.dollId, 55);
	assert.equal(form.mod, true);
	assert.equal(form.type, 4);
	assert.deepEqual([form.crit, form.armorPiercing, form.rofCap, form.clip, form.hasSkill2], [20, 15, 135, 0, true]);
	assert.deepEqual(form.tile.effects, [
		[1, 20],
		[5, 32]
	]);
	assert.deepEqual(form.tile.targets, [4]);
	assert.deepEqual(form.tile.self, [1, 1]);
});

test("HK416 buffs the tile in front of it", () => {
	assert.ok(forms["65"].tile.offsets.some(([row, column]) => row === 0 && column === 1));
});

test("constants hold the tile growth, Mod caps, affection and CD cap", () => {
	assert.deepEqual(constants.hgTileGrowth, [0.75, 0.25]);
	assert.deepEqual(constants.modLevelCaps, [100, 110, 115, 120]);
	assert.deepEqual(constants.affection, { normal: 0, high: 0.05, oath: 0.1 });
	assert.equal(typeof constants.skillCdLimit, "number");
});

test("the shipped growth constants reproduce the importer's stats", () => {
	const gun = upstream.stc("gun").find((row) => row.id === 20055);
	const stats = levelStats(forms["20055"], constants.stats, 120);
	const expected = computeStats(gun, config, 120);
	assert.deepEqual([stats.hp, stats.dmg, stats.acc, stats.eva, stats.rof], [expected.max_hp, expected.max_dmg, expected.max_acc, expected.max_eva, expected.max_rof]);
});
