import { test } from "node:test";
import assert from "node:assert/strict";

import { computeStats, readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const config = readStatConfig(upstream);
const gun = (id) => upstream.stc("gun").find((row) => row.id === id);

const CASES = [
	[65, 100, [121, 51, 46, 44, 76, 0]],
	[20065, 120, [124, 55, 51, 47, 79, 0]],
	[56, 100, [110, 50, 49, 44, 78, 0]],
	[20056, 120, [113, 52, 51, 46, 79, 0]],
	[2, 100, [73, 27, 50, 74, 57, 0]],
	[16, 100, [238, 31, 12, 56, 82, 0]],
	[46, 100, [84, 135, 78, 41, 34, 0]],
	[109, 100, [198, 85, 27, 27, 120, 0]],
	[151, 100, [275, 39, 12, 12, 22, 22]],
	[68, 100, [94, 46, 43, 43, 78, 0]],
	[1002, 100, [275, 36, 13, 9, 28, 23]]
];

for (const [id, level, [hp, dmg, acc, eva, rof, armor]] of CASES) {
	test(`stats for gun ${id} at level ${level}`, () => {
		const stats = computeStats(gun(id), config, level);
		assert.deepEqual([stats.max_hp, stats.max_dmg, stats.max_acc, stats.max_eva, stats.max_rof, stats.max_armor ?? 0], [hp, dmg, acc, eva, rof, armor]);
		assert.equal("max_armor" in stats, armor > 0);
	});
}

test("a missing _basic parameter throws a named error", () => {
	const params = new Map(config.params);
	params.delete("power_basic");
	assert.throws(() => computeStats(gun(65), { ...config, params }, 100), /missing game_config_info parameter power_basic/);
});
