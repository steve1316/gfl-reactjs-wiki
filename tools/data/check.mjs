#!/usr/bin/env node
/**
 * Validate generated data before it is committed. The scheduled refresh uses this as its gate.
 *
 * Usage:
 *     node tools/data/check.mjs [--skip-build]
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";

import { loadCnGuns } from "./lib/cnData.mjs";
import { findMarkup } from "./lib/markup.mjs";
import { SHARDS } from "./lib/shards.mjs";
import { findSkinArtGaps } from "./lib/skins.mjs";

/** The v3 asset manifest the site bundles and the skin art check reads. */
const MANIFEST_PATH = "assets-manifest.json";

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

/** Most released dolls allowed to be missing from the pinned gf-data-ch table. More means the CN pin is stale and copied dates go unspotted. */
const MAX_MISSING_FROM_CN = 5;

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
 * Check a release's date has the shape its precision promises: a real day, a `YYYY-MM` month, or null when unknown or unreleased.
 *
 * @param {{ date: unknown, precision: unknown }} release A generated profile release.
 * @returns {boolean} True when the precision is known and the date suits it.
 */
function isValidRelease({ date, precision }) {
	switch (precision) {
		case "day":
			return isIsoDate(date);
		case "month":
		case "launch":
			return typeof date === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(date);
		case "unknown":
		case "unreleased":
			return date === null;
		default:
			return false;
	}
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
 * Read the doll shards and their profile side files, checking the two line up and that the shards carry no profile or spec sheet.
 *
 * @param {(message: string) => void} fail Records a failure.
 * @returns {object[]} Every doll with its profile and spec sheets merged back in, a Mod with no sheet of its own taking the base form's.
 */
function readDolls(fail) {
	const withSpecs = (form, specs) => form && { ...form, specs };
	const dolls = [];
	for (const shard of SHARDS) {
		const records = JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8"));
		const profiles = JSON.parse(fs.readFileSync(`src/data/${shard.profiles}.json`, "utf8"));
		const ids = new Set(records.map((record) => String(record.normal.id)));
		for (const id of Object.keys(profiles).filter((key) => !ids.has(key))) {
			fail(`${shard.profiles}.json has an entry for doll ${id}, which ${shard.file}.json does not hold`);
		}
		for (const record of records) {
			const id = record.normal.id;
			if ("profile" in record || [record.normal, record.mod].some((form) => form && "specs" in form)) {
				fail(`doll ${id} in ${shard.file}.json still carries a profile or spec sheet, which the T-Doll index would download`);
			}
			const details = profiles[String(id)];
			if (!details) {
				fail(`doll ${id} in ${shard.file}.json has no entry in ${shard.profiles}.json`);
				dolls.push(record);
				continue;
			}
			const { normal, mod } = details.specs ?? {};
			if (mod !== null && (!record.mod || !Array.isArray(mod) || JSON.stringify(mod) === JSON.stringify(normal))) {
				fail(`doll ${id} Mod specs must be null when the doll has no Mod or its sheet matches the base form's`);
			}
			dolls.push({ ...record, normal: withSpecs(record.normal, normal), mod: withSpecs(record.mod, mod ?? normal), profile: details.profile });
		}
	}
	return dolls;
}

/**
 * Run every check against the generated data and exit 1 with a failure list if any check fails.
 *
 * @returns {Promise<void>} Resolves once every check has run, or exits the process on a failure.
 */
async function main() {
	const failures = [];
	const fail = (message) => failures.push(message);
	const dolls = readDolls(fail);
	const byId = new Map(dolls.map((doll) => [doll.normal.id, doll]));
	const equipment = JSON.parse(fs.readFileSync("src/data/equipment.json", "utf8"));
	const upstream = JSON.parse(fs.readFileSync("src/data/upstream.json", "utf8"));

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

	const overrideIds = new Set(JSON.parse(fs.readFileSync("tools/data/overrides.json", "utf8")).addDolls.map((doll) => doll.normal.id));
	for (const doll of dolls) {
		const release = doll.profile?.release;
		if (!release || !Array.isArray(doll.profile.faction) || !Array.isArray(doll.profile.manufacturer) || !Array.isArray(doll.profile.country)) {
			fail(`doll ${doll.normal.id} has no profile`);
		} else if (!isValidRelease(release)) {
			fail(`doll ${doll.normal.id} has a release whose date does not suit its precision: ${JSON.stringify(release)}`);
		} else if (release.precision === "unreleased" && !overrideIds.has(doll.normal.id)) {
			fail(`doll ${doll.normal.id} is unreleased but is not an override doll, so it came from the Global gun table`);
		}
		const profile = doll.profile ?? {};
		const profileTexts = [...(profile.faction ?? []), ...(profile.manufacturer ?? []), ...(profile.country ?? []), profile.fullName ?? ""];
		const specTexts = [doll.normal, doll.mod].filter(Boolean).flatMap((form) => (form.specs ?? []).flatMap((row) => [row.label, row.value]));
		const texts = [...profileTexts.map((text) => [text, "profile"]), ...specTexts.map((text) => [text, "spec"])];
		for (const [text, kind] of texts) {
			const token = findMarkup(String(text), kind);
			if (token) {
				fail(`doll ${doll.normal.id} has markup "${token}" left in ${JSON.stringify(text)}`);
			}
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
		!(hk416Profile?.manufacturer ?? []).includes(hk416.manufacturer) ||
		JSON.stringify(hk416Profile?.country) !== JSON.stringify(hk416.country) ||
		JSON.stringify(hk416Profile?.release) !== JSON.stringify(hk416.release)
	) {
		fail(`HK416 profile differs from the pinned profile: ${JSON.stringify(hk416Profile)}`);
	}
	const beowulfRelease = byId.get(beowulf.id)?.profile?.release;
	if (JSON.stringify(beowulfRelease) !== JSON.stringify(beowulf.release)) {
		fail(`Beowulf release differs from the pinned ${JSON.stringify(beowulf.release)}: ${JSON.stringify(beowulfRelease)}`);
	}

	// Unreleased dolls have no Global gun row, so every other doll is a released US doll that the CN table should also hold.
	const cnGuns = await loadCnGuns();
	const missingFromCn = dolls.filter((doll) => doll.profile?.release?.precision !== "unreleased" && !cnGuns.has(doll.normal.id)).map((doll) => doll.normal.id);
	if (missingFromCn.length > MAX_MISSING_FROM_CN) {
		fail(`${missingFromCn.length} released dolls are missing from the pinned gf-data-ch table (${missingFromCn.join(", ")}), so the CN pin is probably stale`);
	}

	let artGaps = null;
	if (!fs.existsSync(MANIFEST_PATH)) {
		fail(`the v3 asset manifest ${MANIFEST_PATH} is missing, so skin art cannot be checked. Run tools/assets/build_manifest.py --v3 first`);
	} else {
		const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
		if (manifest.version !== 3) {
			fail(`${MANIFEST_PATH} is version ${manifest.version}, expected 3`);
		} else {
			artGaps = findSkinArtGaps(dolls, manifest);
			// Every skin key, table id or extra, must have v3 art. A skin with no id is listed by name, since its art cannot be found at all.
			for (const label of artGaps.skinsWithoutArt) {
				fail(`skin ${label} has no v3 art in the manifest`);
			}
			for (const label of artGaps.unlistedArt) {
				fail(`skin art ${label} is in the manifest but the doll's skins do not list it`);
			}
			for (const label of artGaps.artWithoutCard) {
				fail(`skin art ${label} is in the manifest without a card`);
			}
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

	console.log(`released dolls missing from the CN table: ${missingFromCn.length} (at most ${MAX_MISSING_FROM_CN} allowed)`);
	if (artGaps) {
		console.log(
			`skins without art: ${artGaps.skinsWithoutArt.length} (${artGaps.skinsWithoutArt.join(", ")}), dolls without art: ${artGaps.dollsWithoutArt.length} (${artGaps.dollsWithoutArt.join(", ")})`
		);
	}
	if (failures.length > 0) {
		console.error(`check failed (${failures.length}):\n- ${failures.join("\n- ")}`);
		process.exit(1);
	}
	console.log(`check passed: ${dolls.length} dolls, ${items.length} equipment, coverage ${JSON.stringify(coverage)}`);
}

await main();
