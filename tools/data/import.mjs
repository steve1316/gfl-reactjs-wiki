#!/usr/bin/env node
/**
 * Generate the site's doll and equipment data from gf-data-us.
 *
 * Writes the doll shards, equipment.json, upstream.json and the search index under src/data. Output is deterministic
 * for a given upstream commit and cutoff date, so a scheduled run only commits when something really changed.
 *
 * Usage:
 *     node tools/data/import.mjs [--date YYYY-MM-DD]
 *     GF_DATA_DIR=/path/to/gf-data-us node tools/data/import.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";

import { buildDoll, selectReleased } from "./lib/dolls.mjs";
import { buildEquipment } from "./lib/equipment.mjs";
import { SHARDS } from "./lib/shards.mjs";
import { readStatConfig } from "./lib/stats.mjs";
import { loadUpstream, readLock, resolveUpstreamDir } from "./lib/upstream.mjs";

/** Where generated data is written. */
const OUT_DIR = "src/data";

/**
 * Set a value at a dotted path such as `normal.skill.description`. The full path, including the last
 * segment, must already exist, so a typo'd field name fails loudly instead of silently adding a new key.
 *
 * @param {object} target Object to change.
 * @param {string} path Dotted path.
 * @param {unknown} value New value.
 */
function setPath(target, path, value) {
	const keys = path.split(".");
	const last = keys.pop();
	const parent = keys.reduce((node, key) => node?.[key], target);
	if (!parent || !last || !Object.hasOwn(parent, last)) {
		throw new Error(`override path ${path} does not exist`);
	}
	parent[last] = value;
}

/**
 * Write JSON with a trailing newline.
 *
 * @param {string} file Output path.
 * @param {unknown} data Value to write.
 */
function writeJson(file, data) {
	fs.writeFileSync(file, `${JSON.stringify(data)}\n`);
}

/**
 * Run the importer: read upstream and the reviewed asset maps, build every doll and equipment item, apply the
 * overrides, and write the generated files under `src/data`.
 */
function main() {
	const args = process.argv.slice(2);
	const cutoff = args.includes("--date") ? args[args.indexOf("--date") + 1] : new Date().toISOString().slice(0, 10);
	const upstream = loadUpstream(resolveUpstreamDir());
	const skinAssets = JSON.parse(fs.readFileSync("tools/data/skin-assets.json", "utf8"));
	const equipmentAssets = JSON.parse(fs.readFileSync("tools/data/equipment-assets.json", "utf8"));
	const overrides = JSON.parse(fs.readFileSync("tools/data/overrides.json", "utf8"));
	const ctx = { config: readStatConfig(upstream), skinAssets, warnings: [] };

	const dolls = selectReleased(upstream, cutoff).map((gun) => buildDoll(upstream, gun, ctx));
	for (const extra of overrides.addDolls) {
		if (!dolls.some((doll) => doll.normal.id === extra.normal.id)) {
			dolls.push(extra);
		}
	}
	for (const fix of overrides.fields) {
		const doll = dolls.find((entry) => entry.normal.id === fix.doll);
		if (!doll) {
			throw new Error(`override for missing doll ${fix.doll}`);
		}
		setPath(doll, fix.path, fix.value);
	}
	dolls.sort((a, b) => a.normal.id - b.normal.id);

	for (const shard of SHARDS) {
		writeJson(
			`${OUT_DIR}/${shard.file}.json`,
			dolls.filter((doll) => doll.normal.id >= shard.min && doll.normal.id <= shard.max)
		);
	}
	const equipment = buildEquipment(upstream, equipmentAssets);
	writeJson(`${OUT_DIR}/equipment.json`, equipment);

	const { repo, sha } = readLock();
	const counts = { dolls: dolls.length, mods: dolls.filter((doll) => doll.mod).length, equipment: Object.values(equipment.items).flat().length };
	writeJson(`${OUT_DIR}/upstream.json`, { repo, sha, cutoff, counts });

	execFileSync("node", ["tools/data/build_search_index.mjs"], { stdio: "inherit" });

	for (const warning of ctx.warnings) {
		console.warn(`warning: ${warning}`);
	}
	console.log(`dolls ${counts.dolls}, mods ${counts.mods}, equipment ${counts.equipment}, skill text fallbacks ${ctx.warnings.length}`);
}

main();
