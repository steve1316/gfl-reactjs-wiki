import { test } from "node:test";
import assert from "node:assert/strict";

import { selectReleased } from "../lib/dolls.mjs";
import { buildFormation } from "../lib/formation.mjs";
import { readStatConfig } from "../lib/stats.mjs";
import { buildTiles } from "../lib/tiles.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { appliesTo, cellOf, renderTileGrid, rowColumn, tileGrowthMultiplier, tileReach, tileSources, tileTotals } from "../../../src/lib/formation/tiles.ts";

const upstream = loadUpstream(resolveUpstreamDir());
const { forms, constants } = buildFormation(upstream, selectReleased(upstream, "2099-12-31"), readStatConfig(upstream));
const guns = new Map(upstream.stc("gun").map((gun) => [gun.id, gun]));

test("numeric tiles render the same grid and values as the doll page for every form", () => {
	for (const form of Object.values(forms)) {
		const shipped = buildTiles(guns.get(form.id));
		assert.deepEqual(renderTileGrid(form.tile), [shipped.row1, shipped.row2, shipped.row3], `form ${form.id} grid`);
		const values = form.tile.effects.map(([, value]) => `${value * tileGrowthMultiplier(form.type, 5, constants)}%`);
		assert.deepEqual(values, shipped.stat2, `form ${form.id} values`);
	}
});

test("cells and rows round-trip", () => {
	for (let cell = 0; cell < 9; cell++) {
		const [row, column] = rowColumn(cell);
		assert.equal(cellOf(row, column), cell);
	}
});

test("HK416 in the centre buffs the SMG tile in front of it", () => {
	const sources = tileSources([{ cell: 4, form: forms["65"], links: 5 }], constants);
	const front = sources[5];
	assert.equal(front.length, 1);
	assert.deepEqual([front[0].fromCell, front[0].code, front[0].value], [4, 1, 40]);
	assert.equal(appliesTo(front[0], 2), true);
	assert.equal(appliesTo(front[0], 4), false);
	assert.equal(sources[4].length, 0, "a doll never buffs its own tile");
});

test("handgun tile values grow with links", () => {
	assert.equal(tileGrowthMultiplier(1, 1, constants), 1);
	assert.equal(tileGrowthMultiplier(1, 5, constants), 2);
	assert.equal(tileGrowthMultiplier(4, 1, constants), 1);
	const one = tileSources([{ cell: 4, form: forms["2"], links: 1 }], constants).flat();
	const five = tileSources([{ cell: 4, form: forms["2"], links: 5 }], constants).flat();
	assert.equal(five[0].value, one[0].value * 2);
});

test("offsets that fall off the grid are dropped", () => {
	const form = { ...forms["65"], tile: { self: [1, 1], offsets: [[0, 1]], targets: [], effects: [[1, 10]] } };
	const sources = tileSources([{ cell: 5, form, links: 1 }], constants);
	assert.equal(sources.flat().length, 0);
});

test("tile reach lists the cells a tile covers from where the doll stands, without its own cell or cells off the grid", () => {
	const tile = {
		self: [1, 1],
		offsets: [
			[-1, 0],
			[0, 0],
			[0, 1],
			[1, 1]
		],
		targets: [],
		effects: [[1, 10]]
	};
	assert.deepEqual(tileReach(tile, cellOf(1, 1)), [cellOf(0, 1), cellOf(1, 2), cellOf(2, 2)]);
	assert.deepEqual(tileReach(tile, cellOf(2, 2)), [cellOf(1, 2)]);
});

test("totals sum each stat in display order", () => {
	const sources = [
		{ fromCell: 0, formId: 1, code: 3, value: 25, targets: [] },
		{ fromCell: 1, formId: 2, code: 1, value: 12, targets: [] },
		{ fromCell: 2, formId: 3, code: 1, value: 10, targets: [] }
	];
	assert.deepEqual(tileTotals(sources), [
		{ code: 1, total: 22 },
		{ code: 3, total: 25 }
	]);
});
