import { test } from "node:test";
import assert from "node:assert/strict";

import { buildSkill, templateLevels } from "../lib/skills.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

test("numbers that change across levels become placeholders, with % and x kept on the value", () => {
	const levels = Array.from({ length: 10 }, (_v, i) => `Deals ${6 + i}x damage for ${i + 1} second${i === 0 ? "" : "s"} within 1.5 units, +${10 + i}% crit.`);
	const result = templateLevels(levels);
	assert.equal(result.description, "Deals #1 damage for #2 seconds within 1.5 units, +#3 crit.");
	assert.deepEqual(result.stats[0], ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"]);
	assert.deepEqual(result.stats[1], ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
	assert.deepEqual(result.stats[2], ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%"]);
});

test("levels that differ in wording but agree on the count of numbers template by position", () => {
	const levels = Array.from({ length: 10 }, (_v, i) =>
		i < 5 ? `Throws a flashbang dealing ${i + 1}x damage for ${i + 2} seconds.` : `Launches a stun grenade dealing ${i + 1}x damage for ${i + 2} seconds.`
	);
	const result = templateLevels(levels);
	assert.equal(result.description, "Launches a stun grenade dealing #1 damage for #2 seconds.");
	assert.deepEqual(result.stats[0], ["1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x"]);
	assert.deepEqual(result.stats[1], ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]);
});

test("levels with a different count of numbers fall back to null", () => {
	const levels = Array.from({ length: 10 }, (_v, i) => (i < 5 ? `Throws a flashbang for ${i}s.` : `Throws a stun grenade for ${i}s and gains ${i} ammo.`));
	assert.equal(templateLevels(levels), null);
});

test("HK416 skill 1 and Mod skill 2 from upstream", () => {
	const upstream = loadUpstream(resolveUpstreamDir());
	const warnings = [];
	const skill = buildSkill(upstream, 102112, warnings);
	assert.equal(skill.initial_cooldown, "8s");
	assert.deepEqual(skill.cooldown, [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16]);
	assert.equal(skill.description, "Launch a grenade that deals #1 damage to enemies within a radius of 1.5.");
	assert.equal(skill.number_of_stats, 1);
	assert.deepEqual(skill.stat1, ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"]);
	assert.ok(skill.name.length > 0);

	const mod2 = buildSkill(upstream, 802902, warnings);
	assert.equal(mod2.initial_cooldown, "Passive");
	assert.equal("cooldown" in mod2, false);
	assert.deepEqual(warnings, []);
});

test("M3's Hand Grenade skill templates by position despite upstream wording drift (Throw vs Launch)", () => {
	const upstream = loadUpstream(resolveUpstreamDir());
	const warnings = [];
	const skill = buildSkill(upstream, 102101, warnings);
	assert.ok(skill.number_of_stats >= 1);
	assert.equal(skill.stat1[0], "1.8x");
	assert.equal(skill.stat1[skill.stat1.length - 1], "5.5x");
	assert.deepEqual(warnings, []);
});
