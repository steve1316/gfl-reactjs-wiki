#!/usr/bin/env node
/**
 * Validate generated data before it is committed. The scheduled refresh uses this as its gate.
 *
 * Usage:
 *     node tools/data/check.mjs [--skip-build]
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";

import { SHARDS } from "./lib/shards.mjs";

/** Pinned stats: [doll id, form, hp, dmg, acc, eva, rof, armor]. Verified against the game formulas and the old data. */
const REFERENCE_STATS = [
	[65, "normal", 121, 51, 46, 44, 76, 0],
	[65, "mod", 124, 55, 51, 47, 79, 0],
	[56, "normal", 110, 50, 49, 44, 78, 0],
	[56, "mod", 113, 52, 51, 46, 79, 0],
	[2, "normal", 73, 27, 50, 74, 57, 0],
	[16, "normal", 238, 31, 12, 56, 82, 0],
	[46, "normal", 84, 135, 78, 41, 34, 0],
	[109, "normal", 198, 85, 27, 27, 120, 0],
	[151, "normal", 275, 39, 12, 12, 22, 22],
	[68, "normal", 94, 46, 43, 43, 78, 0]
];

/** Pinned tile grids: [doll id, form, row1, row2, row3]. */
const REFERENCE_GRIDS = [
	[65, "normal", [0, 0, 0], [0, 2, 1], [0, 0, 0]],
	[65, "mod", [0, 0, 1], [0, 2, 1], [0, 0, 0]],
	[2, "normal", [0, 1, 0], [1, 2, 1], [0, 1, 0]],
	[109, "normal", [0, 0, 1], [2, 0, 0], [0, 0, 1]]
];

/**
 * Read the counts from the last committed upstream.json, if there is one.
 *
 * @returns {{ dolls: number, mods: number, equipment: number } | null} Previous counts.
 */
function previousCounts() {
	try {
		return JSON.parse(execFileSync("git", ["show", "HEAD:src/data/upstream.json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).counts;
	} catch {
		return null;
	}
}

/**
 * Run every check against the generated data and exit 1 with a failure list if any check fails.
 *
 * @returns {void}
 */
function main() {
	const failures = [];
	const fail = (message) => failures.push(message);
	const dolls = SHARDS.flatMap((shard) => JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8")));
	const byId = new Map(dolls.map((doll) => [doll.normal.id, doll]));
	const equipment = JSON.parse(fs.readFileSync("src/data/equipment.json", "utf8"));
	const upstream = JSON.parse(fs.readFileSync("src/data/upstream.json", "utf8"));
	const skinAssets = JSON.parse(fs.readFileSync("tools/data/skin-assets.json", "utf8"));

	const previous = previousCounts();
	if (previous) {
		for (const key of ["dolls", "mods", "equipment"]) {
			if (upstream.counts[key] < previous[key]) {
				fail(`${key} dropped from ${previous[key]} to ${upstream.counts[key]}`);
			}
		}
	}

	for (const [id, form, ...expected] of REFERENCE_STATS) {
		const f = byId.get(id)?.[form];
		const actual = f ? [f.max_hp, f.max_dmg, f.max_acc, f.max_eva, f.max_rof, f.max_armor ?? 0] : null;
		if (JSON.stringify(actual) !== JSON.stringify(expected)) {
			fail(`stats ${id} ${form}: expected ${expected}, got ${actual}`);
		}
	}
	for (const [id, form, ...rows] of REFERENCE_GRIDS) {
		const t = byId.get(id)?.[form]?.tile_set;
		if (JSON.stringify(t ? [t.row1, t.row2, t.row3] : null) !== JSON.stringify(rows)) {
			fail(`tile grid ${id} ${form} differs from the pinned grid`);
		}
	}

	for (const doll of dolls) {
		for (const form of [doll.normal, doll.mod].filter(Boolean)) {
			if (!form.name || !form.type || !form.rarity || !form.skill || !form.tile_set) {
				fail(`doll ${doll.normal.id} ${form.name || "(no name)"} is missing a required field`);
			}
			for (const skill of [form.skill, form.skill2].filter(Boolean)) {
				for (let index = 1; index <= skill.number_of_stats; index++) {
					if (!skill.description.includes(`#${index}`) || !Array.isArray(skill[`stat${index}`])) {
						fail(`doll ${doll.normal.id} skill "${skill.name}" has no #${index} or stat${index}`);
					}
				}
			}
		}
	}

	const overrideIds = new Set(JSON.parse(fs.readFileSync("tools/data/overrides.json", "utf8")).addDolls.map((doll) => doll.normal.id));
	for (const [id, slots] of Object.entries(skinAssets)) {
		if (overrideIds.has(Number(id))) {
			continue;
		}
		const ids = byId.get(Number(id))?.skins?.skin_ids ?? [];
		const expected = slots.map((slot) => (typeof slot === "number" ? slot : null));
		if (JSON.stringify(ids.slice(0, slots.length)) !== JSON.stringify(expected)) {
			fail(`doll ${id} skins no longer line up with their art slots`);
		}
	}

	const items = Object.values(equipment.items).flat();
	if (items.some((item) => !item.id || !item.name || !Array.isArray(item.usable))) {
		fail("an equipment item is missing id, name or usable");
	}

	if (!process.argv.includes("--skip-build")) {
		try {
			execFileSync("pnpm", ["build"], { stdio: "ignore" });
		} catch {
			fail("pnpm build failed");
		}
	}

	if (failures.length > 0) {
		console.error(`check failed (${failures.length}):\n- ${failures.join("\n- ")}`);
		process.exit(1);
	}
	console.log(`check passed: ${dolls.length} dolls, ${items.length} equipment`);
}

main();
