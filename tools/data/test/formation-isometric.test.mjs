import { test } from "node:test";
import assert from "node:assert/strict";

import { cellAt, enemyAnchor, stageGeometry, tileCentre } from "../../../src/pages/formation_simulator/isometric.ts";

test("every tile centre hits its own cell at several widths", () => {
	for (const width of [384, 720, 1000]) {
		const geometry = stageGeometry(width);
		for (let cell = 0; cell < 9; cell++) {
			const { x, y } = tileCentre(geometry, cell);
			assert.equal(cellAt(geometry, x, y), cell, `width ${width} cell ${cell}`);
		}
	}
});

test("points outside the grid hit nothing", () => {
	const geometry = stageGeometry(720);
	assert.equal(cellAt(geometry, 0, 0), null);
	assert.equal(cellAt(geometry, geometry.width - 1, geometry.height - 1), null);
});

test("the front column sits right of the back column and the enemy sits right of both", () => {
	const geometry = stageGeometry(720);
	assert.ok(tileCentre(geometry, 5).x > tileCentre(geometry, 3).x);
	assert.ok(enemyAnchor(geometry).x > tileCentre(geometry, 2).x);
	assert.ok(enemyAnchor(geometry).x < geometry.width);
});
