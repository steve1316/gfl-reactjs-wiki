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

test("round trip keeps every setting", () => {
	const setups = [setup(), setup({ cell: 0, dollId: 1002, modStage: 0, level: 57, links: 3, affection: 1, skill1: 4, skill2: 1 })];
	const text = encodeFormation(setups);
	assert.match(text, /^[A-Za-z0-9_-]+$/);
	assert.deepEqual(decodeFormation(text, forms, constants), setups);
});

test("an empty echelon encodes to an empty string", () => {
	assert.equal(encodeFormation([]), "");
	assert.deepEqual(decodeFormation("", forms, constants), []);
});

test("garbage and unknown versions decode to nothing", () => {
	for (const text of ["!!!", "AAAA", "not-base64", encodeFormation([setup()]).replace(/^A/, "C")]) {
		assert.deepEqual(decodeFormation(text, forms, constants), []);
	}
});

test("out-of-range values are clamped and bad entries dropped", () => {
	const text = encodeFormation([
		setup({ level: 200, links: 9, affection: 7, skill1: 0, skill2: 30 }),
		setup({ cell: 4, dollId: 2 }),
		setup({ cell: 5, dollId: 65 }),
		setup({ cell: 1, dollId: 65000 }),
		setup({ cell: 12, dollId: 2 }),
		setup({ cell: 7, dollId: 3, modStage: 3 })
	]);
	assert.deepEqual(decodeFormation(text, forms, constants), [setup({ level: 120, links: 5, affection: 2, skill1: 1, skill2: 10 }), setup({ cell: 7, dollId: 3, modStage: 0, level: 100 })]);
});
