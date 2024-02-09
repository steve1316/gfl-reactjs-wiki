import { test } from "node:test";
import assert from "node:assert/strict";

import { buildTiles } from "../lib/tiles.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const gun = (id) => upstream.stc("gun").find((row) => row.id === id);
const grid = (tiles) => [tiles.row1, tiles.row2, tiles.row3];

test("HK416 and its Mod", () => {
	const base = buildTiles(gun(65));
	assert.deepEqual(grid(base), [
		[0, 0, 0],
		[0, 2, 1],
		[0, 0, 0]
	]);
	assert.equal(base.targets, "Buffs SMG");
	assert.deepEqual([base.stat1, base.stat2], [["Damage by "], ["40%"]]);
	const mod = buildTiles(gun(20065));
	assert.deepEqual(grid(mod), [
		[0, 0, 1],
		[0, 2, 1],
		[0, 0, 0]
	]);
	assert.deepEqual(mod.stat2, ["45%"]);
});

test("M1911 handgun values are shown at five links", () => {
	const tiles = buildTiles(gun(2));
	assert.deepEqual(grid(tiles), [
		[0, 1, 0],
		[1, 2, 1],
		[0, 1, 0]
	]);
	assert.equal(tiles.targets, "Buffs All Types");
	assert.deepEqual(new Set(tiles.stat2), new Set(["20%", "50%"]));
});

test("re-centred grids: MG5 and M1887", () => {
	assert.deepEqual(grid(buildTiles(gun(109))), [
		[0, 0, 1],
		[2, 0, 0],
		[0, 0, 1]
	]);
	assert.deepEqual(grid(buildTiles(gun(151))), [
		[0, 0, 0],
		[1, 0, 2],
		[0, 0, 0]
	]);
	assert.equal(buildTiles(gun(151)).targets, "Buffs MG");
});

test("multi-type targets read naturally", () => {
	assert.equal(buildTiles({ ...gun(65), effect_guntype: "2,4" }).targets, "Buffs SMG and AR");
	assert.equal(buildTiles({ ...gun(65), effect_guntype: "2,4,6" }).targets, "Buffs SMG, AR and SG");
});
