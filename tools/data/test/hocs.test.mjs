import { test } from "node:test";
import assert from "node:assert/strict";

import { buildHocs, findHocArtGaps } from "../lib/hocs.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { hocChipStats, hocStats } from "../../../src/lib/hocStats.ts";

/** Level 1 and level 100 stats from each HOC's IOPWiki page, as `[lethality, pierce, precision, reload]`. L9A1's page lists none. */
const IOPWIKI_STATS = {
	"BGM-71": [
		[52, 135, 118, 28],
		[155, 402, 349, 83]
	],
	"AGS-30": [
		[27, 49, 67, 130],
		[78, 144, 198, 386]
	],
	"2B14": [
		[51, 20, 46, 54],
		[152, 58, 135, 160]
	],
	M2: [
		[38, 17, 40, 61],
		[113, 49, 119, 182]
	],
	AT4: [
		[38, 88, 96, 45],
		[113, 261, 284, 134]
	],
	"QLZ-04": [
		[26, 46, 63, 112],
		[77, 136, 188, 331]
	],
	"Mk 153": [
		[36, 75, 79, 36],
		[107, 224, 233, 107]
	],
	"PP-93": [
		[47, 23, 61, 56],
		[138, 67, 182, 166]
	],
	"Mk 47": [
		[27, 48, 66, 105],
		[80, 142, 196, 313]
	],
	"RPG-29": [
		[44, 106, 83, 31],
		[130, 314, 247, 90]
	]
};

/** The built HOCs, loaded once for every test. */
const built = buildHocs(loadUpstream(resolveUpstreamDir()), "2026-09-15");

/**
 * A stats object as the `[lethality, pierce, precision, reload]` order the fixtures use.
 *
 * @param {{ lethality: number, pierce: number, precision: number, reload: number }} stats The stats.
 * @returns {number[]} The four values.
 */
function ordered(stats) {
	return [stats.lethality, stats.pierce, stats.precision, stats.reload];
}

test("keeps only the 11 obtainable HOCs, in id order", () => {
	assert.deepEqual(
		built.items.map((hoc) => hoc.name),
		["BGM-71", "AGS-30", "2B14", "M2", "AT4", "QLZ-04", "Mk 153", "PP-93", "Mk 47", "RPG-29", "L9A1"]
	);
	assert.deepEqual(built.classes, ["Anti-Tank Weapon", "Mortar", "Grenade Launcher"]);
});

test("leaves out HOCs released after the cutoff", () => {
	const early = buildHocs(loadUpstream(resolveUpstreamDir()), "2024-01-01");
	assert.equal(
		early.items.some((hoc) => hoc.name === "L9A1"),
		false
	);
});

test("builds each HOC's facts and three skills", () => {
	const bgm = built.items[0];
	assert.equal(bgm.id, 1);
	assert.equal(bgm.className, "Anti-Tank Weapon");
	assert.equal(bgm.released, "2020-01-07");
	assert.equal(bgm.productionSeconds, 28800);
	assert.equal(bgm.range, 2);
	assert.equal(bgm.code, "TOW");
	assert.match(bgm.description, /^A group of four who love tabletop games/);
	assert.deepEqual(
		bgm.skills.map((skill) => skill.name),
		["Charged Missile", "Reload Procedure", "Thrill of the Hunt"]
	);
	assert.equal(bgm.skills[1].stat1[9], "8%");
});

test("base stats match IOPWiki at levels 1 and 100 for every HOC it lists", () => {
	for (const [name, [low, high]] of Object.entries(IOPWIKI_STATS)) {
		const hoc = built.items.find((entry) => entry.name === name);
		assert.deepEqual(ordered(hocStats(hoc, built.constants, 1)), low, `${name} at level 1`);
		assert.deepEqual(ordered(hocStats(hoc, built.constants, 100)), high, `${name} at level 100`);
	}
});

test("the chip board's maximum grows with stars", () => {
	const bgm = built.items[0];
	const one = ordered(hocChipStats(bgm, built.constants, 100, 1));
	const five = ordered(hocChipStats(bgm, built.constants, 100, 5));
	assert.deepEqual(five, [190, 329, 191, 46]);
	assert.ok(one.every((value, index) => value < five[index]));
});

test("every HOC carries the game code its asset bundles are named after", () => {
	assert.deepEqual(
		built.items.map((hoc) => hoc.code),
		["TOW", "AGS30", "2B14", "M2", "AT4", "QLZ04", "MK153", "PP93", "MK47", "RPG29", "L9A1"]
	);
});

test("HOC art gaps are only reported once the manifest lists any HOC", () => {
	const hocs = [
		{ id: 1, name: "BGM-71" },
		{ id: 2, name: "AGS-30" }
	];
	assert.deepEqual(findHocArtGaps(hocs, { dolls: {} }), []);
	assert.deepEqual(findHocArtGaps(hocs, { hocs: {} }), []);
	assert.deepEqual(findHocArtGaps(hocs, { hocs: { 1: ["card", "full"], 2: ["card"] } }), ["AGS-30"]);
});
