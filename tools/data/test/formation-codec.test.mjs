import { test } from "node:test";
import assert from "node:assert/strict";

import { selectReleased } from "../lib/dolls.mjs";
import { buildFormation } from "../lib/formation.mjs";
import { readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { decodeFormation, encodeFormation } from "../../../src/lib/formation/codec.ts";

const upstream = loadUpstream(resolveUpstreamDir());
const { forms, constants } = buildFormation(upstream, selectReleased(upstream, "2099-12-31"), readStatConfig(upstream));
const setup = (overrides) => ({ cell: 4, dollId: 65, modStage: 3, level: 120, links: 5, affection: 2, skill1: 10, skill2: 8, ...overrides });
/** A formation link with the two newer sections empty, which is what most of these cases care about. */
const link = (setups, overrides = {}) => ({ setups, enemies: [], fairy: null, ...overrides });
const enemyIds = new Set([5001, 2001, 27001]);
const decode = (text) => decodeFormation(text, forms, constants, enemyIds);

test("round trip keeps every setting", () => {
	const setups = [setup(), setup({ cell: 0, dollId: 1002, modStage: 0, level: 57, links: 3, affection: 1, skill1: 4, skill2: 1 })];
	const text = encodeFormation(link(setups));
	assert.match(text, /^[A-Za-z0-9_-]+$/);
	assert.deepEqual(decode(text), link(setups));
});

test("an empty formation encodes to an empty string", () => {
	assert.equal(encodeFormation(link([])), "");
	assert.deepEqual(decode(""), link([]));
});

test("garbage and unknown versions decode to nothing", () => {
	for (const text of ["!!!", "AAAA", "not-base64", encodeFormation(link([setup()])).replace(/^A/, "C")]) {
		assert.deepEqual(decode(text), link([]));
	}
});

test("out-of-range values are clamped and bad entries dropped", () => {
	const text = encodeFormation(
		link([
			setup({ level: 200, links: 9, affection: 7, skill1: 0, skill2: 30 }),
			setup({ cell: 4, dollId: 2 }),
			setup({ cell: 5, dollId: 65 }),
			setup({ cell: 1, dollId: 65000 }),
			setup({ cell: 12, dollId: 2 }),
			setup({ cell: 7, dollId: 3, modStage: 3 })
		])
	);
	assert.deepEqual(decode(text), link([setup({ level: 120, links: 5, affection: 2, skill1: 1, skill2: 10 }), setup({ cell: 7, dollId: 3, modStage: 0, level: 100 })]));
});

test("the enemy squad and the fairy round trip", () => {
	const original = {
		setups: [setup()],
		enemies: [
			{ cell: 0, enemyId: 5001 },
			{ cell: 8, enemyId: 2001 }
		],
		fairy: { fairyId: 1, level: 100, stars: 5 }
	};
	assert.deepEqual(decode(encodeFormation(original)), original);
});

test("an enemy squad or a fairy alone still encodes", () => {
	const enemiesOnly = { setups: [], enemies: [{ cell: 4, enemyId: 27001 }], fairy: null };
	assert.deepEqual(decode(encodeFormation(enemiesOnly)), enemiesOnly);
	const fairyOnly = { setups: [], enemies: [], fairy: { fairyId: 7, level: 42, stars: 3 } };
	assert.deepEqual(decode(encodeFormation(fairyOnly)), fairyOnly);
});

test("enemies the data does not have, repeated cells and off-grid cells are dropped", () => {
	const text = encodeFormation({
		setups: [],
		enemies: [
			{ cell: 0, enemyId: 5001 },
			{ cell: 0, enemyId: 2001 },
			{ cell: 9, enemyId: 2001 },
			{ cell: 3, enemyId: 999999 }
		],
		fairy: null
	});
	assert.deepEqual(decode(text), { setups: [], enemies: [{ cell: 0, enemyId: 5001 }], fairy: null });
});

test("a fairy's level and stars are clamped", () => {
	const text = encodeFormation({ setups: [], enemies: [], fairy: { fairyId: 3, level: 250, stars: 9 } });
	assert.deepEqual(decode(text).fairy, { fairyId: 3, level: 100, stars: 5 });
});

test("a version 1 link still decodes its echelon", () => {
	// Version 1 carried the echelon alone: the header, then nine bytes per doll and nothing after them.
	const setups = [setup()];
	const current = encodeFormation(link(setups));
	const bytes = Uint8Array.from(atob(current.replace(/-/g, "+").replace(/_/g, "/")), (char) => char.charCodeAt(0));
	const older = bytes.slice(0, 2 + setups.length * 9);
	older[0] = 1;
	const text = btoa(String.fromCharCode(...older))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
	assert.deepEqual(decode(text), link(setups));
});
