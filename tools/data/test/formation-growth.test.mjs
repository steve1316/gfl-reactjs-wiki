import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { SHARDS } from "../lib/shards.mjs";
import { readStatConfig, toStatConstants } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";
import { levelStats } from "../../../src/lib/formation/growth.ts";

const upstream = loadUpstream(resolveUpstreamDir());
const constants = toStatConstants(readStatConfig(upstream));
const guns = new Map(upstream.stc("gun").map((gun) => [gun.id, gun]));
const input = (gun) => ({
	type: gun.type,
	eatRatio: gun.eat_ratio,
	ratio: { life: gun.ratio_life, pow: gun.ratio_pow, rate: gun.ratio_rate, hit: gun.ratio_hit, dodge: gun.ratio_dodge, armor: gun.ratio_armor }
});
const shipped = SHARDS.flatMap((shard) => JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8")));

test("level 100 and 120 stats equal every shipped form's max stats", () => {
	let checked = 0;
	for (const doll of shipped) {
		for (const [form, offset, level] of [
			[doll.normal, 0, 100],
			[doll.mod, 20000, 120]
		]) {
			const gun = form && guns.get(doll.normal.id + offset);
			if (!gun) {
				continue;
			}
			const stats = levelStats(input(gun), constants, level);
			assert.deepEqual(
				[stats.hp, stats.dmg, stats.acc, stats.eva, stats.rof, stats.armor],
				[form.max_hp, form.max_dmg, form.max_acc, form.max_eva, form.max_rof, form.max_armor ?? 0],
				`doll ${doll.normal.id} at ${level}`
			);
			checked++;
		}
	}
	assert.ok(checked > 400, `only ${checked} forms checked`);
});

test("stats never shrink as a doll levels up", () => {
	const m4 = input(guns.get(20055));
	let previous = levelStats(m4, constants, 1);
	for (let level = 2; level <= 120; level++) {
		const next = levelStats(m4, constants, level);
		for (const key of ["hp", "dmg", "acc", "eva", "rof", "armor"]) {
			assert.ok(next[key] >= previous[key], `${key} dropped at level ${level}`);
		}
		previous = next;
	}
});

test("an unknown type throws a named error", () => {
	assert.throws(() => levelStats({ ...input(guns.get(65)), type: 99 }, constants, 100), /unknown doll type 99/);
});
