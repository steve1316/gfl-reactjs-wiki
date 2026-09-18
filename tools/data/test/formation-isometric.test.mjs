import { test } from "node:test";
import assert from "node:assert/strict";

import { cellAt, cellAtSide, stageGeometry, tileCentre } from "../../../src/pages/formation_simulator/isometric.ts";

test("every tile centre hits its own cell on both sides at several widths", () => {
	for (const width of [384, 720, 1000]) {
		const geometry = stageGeometry(width);
		for (const side of ["player", "enemy"]) {
			for (let cell = 0; cell < 9; cell++) {
				const { x, y } = tileCentre(geometry, cell, side);
				assert.deepEqual(cellAt(geometry, x, y), { side, cell }, `width ${width} ${side} cell ${cell}`);
			}
		}
	}
});

test("points outside both grids hit nothing", () => {
	const geometry = stageGeometry(720);
	assert.equal(cellAt(geometry, 0, 0), null);
	assert.equal(cellAt(geometry, geometry.width - 1, geometry.height - 1), null);
});

test("a side only answers for its own grid", () => {
	const geometry = stageGeometry(720);
	const playerMiddle = tileCentre(geometry, 4, "player");
	assert.equal(cellAtSide(geometry, playerMiddle.x, playerMiddle.y, "player"), 4);
	assert.equal(cellAtSide(geometry, playerMiddle.x, playerMiddle.y, "enemy"), null);
	const enemyMiddle = tileCentre(geometry, 4, "enemy");
	assert.equal(cellAtSide(geometry, enemyMiddle.x, enemyMiddle.y, "enemy"), 4);
	assert.equal(cellAtSide(geometry, enemyMiddle.x, enemyMiddle.y, "player"), null);
});

test("the front column sits right of the back column and the enemy grid sits right of the echelon", () => {
	const geometry = stageGeometry(720);
	assert.ok(tileCentre(geometry, 5, "player").x > tileCentre(geometry, 3, "player").x);
	assert.ok(tileCentre(geometry, 0, "enemy").x > tileCentre(geometry, 2, "player").x);
});

test("both grids fit inside the stage at every width", () => {
	for (const width of [384, 720, 1000, 1600]) {
		const geometry = stageGeometry(width);
		// The left corner of the echelon's grid and the right corner of the enemy's are the extremes of the whole field.
		const leftMost = tileCentre(geometry, 6, "player").x - geometry.tileWidth / 2;
		const rightMost = tileCentre(geometry, 2, "enemy").x + geometry.tileWidth / 2;
		assert.ok(leftMost >= 0, `width ${width} left corner at ${leftMost}`);
		assert.ok(rightMost <= width, `width ${width} right corner at ${rightMost}`);
	}
});
