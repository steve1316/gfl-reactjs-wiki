import assert from "node:assert/strict";
import { test } from "node:test";

import { findLive2dArtGaps, findLive2dTdollFileGaps } from "../lib/live2d.mjs";

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

test("a tdoll skin with no variant is reported, a populated one is not", () => {
	const manifest = { live2d: { fairies: {}, hocs: {}, tdolls: { 104: { base: { 1202: [] } } } } };
	assert.deepEqual(findLive2dArtGaps(manifest), ["tdoll 104 base 1202"]);
	const populated = { live2d: { fairies: {}, hocs: {}, tdolls: { 104: { base: { 1202: ["normal"] } } } } };
	assert.deepEqual(findLive2dArtGaps(populated), []);
});

test("no gaps when both the availability list and the per-doll files are empty", () => {
	assert.deepEqual(findLive2dTdollFileGaps({}, {}), []);
});

test("no gaps when a doll's availability and per-doll file agree on every variant", () => {
	const availability = { 104: { base: { 1202: ["damaged", "normal"] } } };
	const tdollFiles = { 104: { base: { 1202: { damaged: { motions: [] }, normal: { motions: [] } } } } };
	assert.deepEqual(findLive2dTdollFileGaps(availability, tdollFiles), []);
});

test("a variant listed as available with no matching per-doll file entry is reported", () => {
	const availability = { 104: { base: { 1202: ["damaged", "normal"] } } };
	const tdollFiles = { 104: { base: { 1202: { normal: { motions: [] } } } } };
	assert.deepEqual(findLive2dTdollFileGaps(availability, tdollFiles), ["tdoll 104 base 1202 damaged (listed as available with no matching per-doll file entry)"]);
});

test("a per-doll file entry not listed as available is reported", () => {
	const availability = { 104: { base: { 1202: ["normal"] } } };
	const tdollFiles = { 104: { base: { 1202: { normal: { motions: [] }, damaged: { motions: [] } } } } };
	assert.deepEqual(findLive2dTdollFileGaps(availability, tdollFiles), ["tdoll 104 base 1202 damaged (has a per-doll file entry but is not listed as available)"]);
});

test("a doll missing entirely from one side is still reported, not only mismatched skins within a shared doll", () => {
	const availability = { 104: { base: { 1202: ["normal"] } } };
	const tdollFiles = { 65: { base: { 805: { normal: { motions: [] } } } } };
	const gaps = findLive2dTdollFileGaps(availability, tdollFiles);
	assert.ok(gaps.includes("tdoll 104 base 1202 normal (listed as available with no matching per-doll file entry)"));
	assert.ok(gaps.includes("tdoll 65 base 805 normal (has a per-doll file entry but is not listed as available)"));
});

test("a missing per-doll directory with an empty availability block passes", () => {
	assert.deepEqual(findLive2dTdollFileGaps({}, {}), []);
	// A doll with no Live2D model at all has neither an availability entry nor a per-doll file - not a gap.
	const availability = { 104: { base: { 1202: ["normal"] } } };
	const tdollFiles = { 104: { base: { 1202: { normal: { motions: [] } } } } };
	assert.deepEqual(findLive2dTdollFileGaps(availability, tdollFiles), []);
});
