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

/** Lines of combined stdout+stderr kept in the failure message when `pnpm build` fails. */
const BUILD_FAILURE_LOG_LINES = 40;

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

/** Fewest dolls that must have a non-empty faction, manufacturer and base-form spec sheet. */
const MIN_COVERAGE = { faction: 400, manufacturer: 380, specs: 380 };

/** Pinned profile fields. HK416 is on the launch roster, Beowulf's US date is a copied CN date so IOPWiki's EN month wins. */
const REFERENCE_PROFILES = {
	hk416: { id: 65, faction: ["Squad 404"], manufacturer: "Heckler & Koch", country: ["Germany"], release: { date: "2018-05", precision: "launch" } },
	beowulf: { id: 393, release: { date: "2024-09", precision: "month" } }
};

/**
 * Check a `YYYY-MM-DD` string is a real calendar date.
 *
 * @param {unknown} date Value to check.
 * @returns {boolean} True when the value is a valid ISO date.
 */
function isIsoDate(date) {
	return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().startsWith(date);
}

/**
 * Read the counts from the last committed upstream.json, if there is one.
 *
 * A missing file at HEAD means "first run" and returns null. Git being unavailable, HEAD not resolving, or a
 * committed file that fails to parse are real failures, not a first run, and throw instead.
 *
 * @returns {{ dolls: number, mods: number, equipment: number } | null} Previous counts, or null on a first run.
 */
function previousCounts() {
	try {
		execFileSync("git", ["cat-file", "-e", "HEAD:src/data/upstream.json"], { stdio: "ignore" });
	} catch {
		try {
			execFileSync("git", ["rev-parse", "--verify", "HEAD"], { stdio: "ignore" });
		} catch {
			throw new Error("git is unavailable or HEAD could not be resolved");
		}
		return null;
	}
	const text = execFileSync("git", ["show", "HEAD:src/data/upstream.json"], { encoding: "utf8" });
	try {
		return JSON.parse(text).counts;
	} catch (error) {
		throw new Error(`HEAD:src/data/upstream.json is committed but is not valid JSON: ${error.message}`);
	}
}

/**
 * Run every check against the generated data and exit 1 with a failure list if any check fails.
 */
function main() {
	const failures = [];
	const fail = (message) => failures.push(message);
	const dolls = SHARDS.flatMap((shard) => JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8")));
	const byId = new Map(dolls.map((doll) => [doll.normal.id, doll]));
	const equipment = JSON.parse(fs.readFileSync("src/data/equipment.json", "utf8"));
	const upstream = JSON.parse(fs.readFileSync("src/data/upstream.json", "utf8"));
	const skinAssets = JSON.parse(fs.readFileSync("tools/data/skin-assets.json", "utf8"));

	let previous = null;
	try {
		previous = previousCounts();
	} catch (error) {
		fail(error.message);
	}
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
			if (!form.name || !form.type || !form.rarity || !form.skill || !form.tile_set || !Array.isArray(form.specs)) {
				fail(`doll ${doll.normal.id} ${form.name || "(no name)"} is missing a required field`);
			}
			for (const skill of [form.skill, form.skill2].filter(Boolean)) {
				if (!Number.isInteger(skill.number_of_stats) || skill.number_of_stats < 0) {
					fail(`doll ${doll.normal.id} skill "${skill.name}" has an invalid number_of_stats: ${skill.number_of_stats}`);
					continue;
				}
				for (let index = 1; index <= skill.number_of_stats; index++) {
					if (!skill.description.includes(`#${index}`) || !Array.isArray(skill[`stat${index}`])) {
						fail(`doll ${doll.normal.id} skill "${skill.name}" has no #${index} or stat${index}`);
					}
				}
			}
		}
	}

	for (const doll of dolls) {
		const release = doll.profile?.release;
		if (!release || !Array.isArray(doll.profile.faction) || !Array.isArray(doll.profile.manufacturer) || !Array.isArray(doll.profile.country)) {
			fail(`doll ${doll.normal.id} has no profile`);
		} else if (release.precision === "day" && !isIsoDate(release.date)) {
			fail(`doll ${doll.normal.id} has a day-precision release that is not a valid date: ${release.date}`);
		}
	}
	const coverage = {
		faction: dolls.filter((doll) => doll.profile?.faction?.length > 0).length,
		manufacturer: dolls.filter((doll) => doll.profile?.manufacturer?.length > 0).length,
		specs: dolls.filter((doll) => doll.normal.specs?.length > 0).length
	};
	for (const [key, minimum] of Object.entries(MIN_COVERAGE)) {
		if (coverage[key] < minimum) {
			fail(`only ${coverage[key]} dolls have a ${key}, expected at least ${minimum}`);
		}
	}
	const { hk416, beowulf } = REFERENCE_PROFILES;
	const hk416Profile = byId.get(hk416.id)?.profile;
	if (
		JSON.stringify(hk416Profile?.faction) !== JSON.stringify(hk416.faction) ||
		!hk416Profile?.manufacturer.includes(hk416.manufacturer) ||
		JSON.stringify(hk416Profile?.country) !== JSON.stringify(hk416.country) ||
		JSON.stringify(hk416Profile?.release) !== JSON.stringify(hk416.release)
	) {
		fail(`HK416 profile differs from the pinned profile: ${JSON.stringify(hk416Profile)}`);
	}
	const beowulfRelease = byId.get(beowulf.id)?.profile?.release;
	if (JSON.stringify(beowulfRelease) !== JSON.stringify(beowulf.release)) {
		fail(`Beowulf release differs from the pinned ${JSON.stringify(beowulf.release)}: ${JSON.stringify(beowulfRelease)}`);
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
			execFileSync("pnpm", ["build"], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
		} catch (error) {
			const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
			const lastLines = output.split("\n").slice(-BUILD_FAILURE_LOG_LINES).join("\n");
			fail(`pnpm build failed:\n${lastLines}`);
		}
	}

	if (failures.length > 0) {
		console.error(`check failed (${failures.length}):\n- ${failures.join("\n- ")}`);
		process.exit(1);
	}
	console.log(`check passed: ${dolls.length} dolls, ${items.length} equipment, coverage ${JSON.stringify(coverage)}`);
}

main();
