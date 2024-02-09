import { test } from "node:test";
import assert from "node:assert/strict";

import { parseTextTable, stripMarkup, unescapeText } from "../lib/text.mjs";

test("parses CRLF lines, splits on the first comma and strips leading BOMs", () => {
	const table = parseTextTable("\uFEFF\uFEFFgun-10000065,416\r\nbattle_skill_config-310211201,Cooldown: 20s//cDamage Multiplier: 6x\r\n\r\n");
	assert.equal(table.get("gun-10000065"), "416");
	assert.equal(table.get("battle_skill_config-310211201"), "Cooldown: 20s//cDamage Multiplier: 6x");
	assert.equal(table.size, 2);
});

test("unescapes //c and //n", () => {
	assert.equal(unescapeText("NIXOO//cAi Nonaka//nline"), "NIXOO,Ai Nonaka\nline");
});

test("strips color markup but keeps its text", () => {
	assert.equal(stripMarkup("deals <color=#FFA500>6x</color> damage"), "deals 6x damage");
});
