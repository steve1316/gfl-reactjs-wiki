import { test } from "node:test";
import assert from "node:assert/strict";

import { findEquipmentMentions, normaliseWithPositions } from "../lib/mentions.mjs";

const item = (id, name) => ({ id, name, rarity: 5, mod: false, stats: {} });

test("normaliseWithPositions keeps lowercase letters and digits and where each came from", () => {
	assert.deepEqual(normaliseWithPositions("Mk Q-1"), { normal: "mkq1", positions: [0, 1, 3, 5] });
});

test("an exact name is found with its original wording", () => {
	const text = 'Gain a shield. (When equipped with "Patrol Helmet", cooldown is reduced.)';
	assert.deepEqual(findEquipmentMentions(text, [item(191, "Patrol Helmet")], []), [{ text: "Patrol Helmet", id: 191 }]);
});

test("spacing, case and punctuation differences still match, and the description's own wording is kept", () => {
	const text = "(When equipped with Mk Q Light Exoskeleton, additionally gain 120 points of shield.)";
	assert.deepEqual(findEquipmentMentions(text, [item(150, "MkQ Light Exoskeleton")], []), [{ text: "Mk Q Light Exoskeleton", id: 150 }]);
});

test("an alias matches wording the normaliser cannot reach", () => {
	const text = "(When equipped with Type 64 Sniper Scope, damage increases.)";
	const aliases = [{ doll: 243, equipment: 200, text: "Type 64 Sniper Scope", reason: "Skill uses the Type 64 name" }];
	assert.deepEqual(findEquipmentMentions(text, [item(200, "64 Shiki Sniper Scope")], aliases), [{ text: "Type 64 Sniper Scope", id: 200 }]);
});

test("no mention is recorded when nothing matches, or only part of a word does", () => {
	assert.deepEqual(findEquipmentMentions("Increase damage by #1.", [item(1, "Scope")], []), []);
	assert.deepEqual(findEquipmentMentions("Telescope vision.", [item(1, "Scope")], []), []);
});

test("a longer name wins over a name it contains, and repeats are recorded once", () => {
	const text = "Adelhyde and Big Adelhyde Extract, then Adelhyde again.";
	const found = findEquipmentMentions(text, [item(1, "Adelhyde"), item(2, "Big Adelhyde Extract")], []);
	assert.deepEqual(found, [
		{ text: "Adelhyde", id: 1 },
		{ text: "Big Adelhyde Extract", id: 2 }
	]);
});

test("when two items share a name, the wording is recorded once under the lower id", () => {
	const found = findEquipmentMentions("Adelhyde, then Adelhyde.", [item(137, "Adelhyde"), item(139, "Adelhyde")], []);
	assert.deepEqual(found, [{ text: "Adelhyde", id: 137 }]);
});
