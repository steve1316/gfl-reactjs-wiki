import assert from "node:assert/strict";
import { test } from "node:test";

import { findLive2dArtGaps } from "../lib/live2d.mjs";

test("no gaps when the live2d block is absent or empty", () => {
	assert.deepEqual(findLive2dArtGaps({}), []);
	assert.deepEqual(findLive2dArtGaps({ live2d: { fairies: {}, hocs: {} } }), []);
});

test("a fairy missing a form is reported, a complete fairy is not", () => {
	const manifest = { live2d: { fairies: { 1: ["form1", "form2"], 3: ["form1", "form2", "form3"] }, hocs: {} } };
	assert.deepEqual(findLive2dArtGaps(manifest), ["fairy 1 (missing form3)"]);
});

test("a hoc missing its model is reported, a complete hoc is not", () => {
	const manifest = { live2d: { fairies: {}, hocs: { 6: ["model"], 7: [] } } };
	assert.deepEqual(findLive2dArtGaps(manifest), ["hoc 7 (missing model)"]);
});
