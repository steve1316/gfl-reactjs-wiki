#!/usr/bin/env node
/**
 * Generate the site's doll and equipment data from gf-data-us.
 *
 * Writes the doll shards, equipment.json, upstream.json and the search index under src/data. Output is deterministic
 * for a given upstream commit and set of released dolls, so a scheduled run only commits when something really changed.
 * The search index keeps the pre-2026-09-13 wiki names from `tools/data/name-aliases.json` as aliases for renamed dolls.
 * The run date only selects which dolls are released and is not written out, so an unchanged import produces no diff.
 * Doll profiles come from IOPWiki, with Wikidata filling empty makers and countries and gf-data-ch spotting copied CN dates.
 * Profile fields can be corrected through `overrides.json` `fields` with paths such as `profile.manufacturer`.
 *
 * Usage:
 *     node tools/data/import.mjs [--date YYYY-MM-DD]
 *     GF_DATA_DIR=/path/to/gf-data-us node tools/data/import.mjs
 *     IOPWIKI_CACHE=reuse WIKIDATA_CACHE=reuse node tools/data/import.mjs   (reuse the fetched profile sources)
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";

import { loadCnGuns } from "./lib/cnData.mjs";
import { buildDoll, selectReleased } from "./lib/dolls.mjs";
import { buildEquipment } from "./lib/equipment.mjs";
import { fetchIopwikiPages, parseEnRelease, wikipediaTitle } from "./lib/iopwiki.mjs";
import { buildProfile, fillFromWikidata, indexPages, releaseFor } from "./lib/profile.mjs";
import { SHARDS } from "./lib/shards.mjs";
import { readStatConfig } from "./lib/stats.mjs";
import { loadUpstream, readLock, resolveUpstreamDir } from "./lib/upstream.mjs";
import { fetchWikidataFacts } from "./lib/wikidata.mjs";

/** Where generated data is written. */
const OUT_DIR = "src/data";

/** Fewer dolls than this joining an IOPWiki page means the page fetch or parse went wrong. */
const MIN_PROFILE_PAGES = 400;

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
 * Attach a profile to every doll: its IOPWiki fields, its Global release date, and Wikidata labels for a maker or country
 * that IOPWiki leaves empty.
 *
 * @param {object[]} dolls Built dolls, override dolls included. Each gains a `profile`.
 * @param {ReturnType<typeof loadUpstream>} upstream Upstream readers.
 * @returns {Promise<{ joined: number, wikidata: number }>} How many dolls joined an IOPWiki page, and how many Wikidata filled.
 */
async function attachProfiles(dolls, upstream) {
	const pages = indexPages(await fetchIopwikiPages());
	const cnGuns = await loadCnGuns();
	if (cnGuns.size === 0) {
		throw new Error("gf-data-ch gun.json has no rows, so copied CN release dates cannot be spotted");
	}
	const usGuns = new Map(upstream.stc("gun").map((gun) => [gun.id, gun]));
	const lookups = [];
	for (const doll of dolls) {
		const id = doll.normal.id;
		const page = pages.get(id);
		const gun = usGuns.get(id);
		// Override dolls have no US row, so their release stays unknown.
		const release = releaseFor(gun?.launch_time, cnGuns.get(id), gun ? parseEnRelease(page?.fields.releasedon) : null);
		doll.profile = buildProfile(page, release);
		const title = page ? wikipediaTitle(page.fields) : null;
		if (title && (doll.profile.manufacturer.length === 0 || doll.profile.country.length === 0)) {
			lookups.push({ doll, title });
		}
	}
	const joined = dolls.filter((doll) => doll.profile.iopwikiTitle).length;
	if (joined < MIN_PROFILE_PAGES) {
		throw new Error(`only ${joined} dolls joined an IOPWiki page, expected at least ${MIN_PROFILE_PAGES}`);
	}
	const facts = lookups.length > 0 ? await fetchWikidataFacts(lookups.map((lookup) => lookup.title)) : new Map();
	for (const { doll, title } of lookups) {
		doll.profile = fillFromWikidata(doll.profile, facts.get(title), [doll.normal.name, doll.profile.fullName, title]);
	}
	return { joined, wikidata: dolls.filter((doll) => doll.profile.sources.includes("wikidata")).length };
}

/**
 * Run the importer: read upstream, the reviewed asset maps and the profile sources, build every doll and equipment item,
 * apply the overrides, and write the generated files under `src/data`.
 *
 * @returns {Promise<void>} Resolves once every file is written.
 */
async function main() {
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
	const profiles = await attachProfiles(dolls, upstream);
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
	writeJson(`${OUT_DIR}/upstream.json`, { repo, sha, counts });

	execFileSync("node", ["tools/data/build_search_index.mjs"], { stdio: "inherit" });

	for (const warning of ctx.warnings) {
		console.warn(`warning: ${warning}`);
	}
	console.log(`dolls ${counts.dolls}, mods ${counts.mods}, equipment ${counts.equipment}, skill text fallbacks ${ctx.warnings.length}`);
	console.log(`profiles: ${profiles.joined} joined an IOPWiki page, ${profiles.wikidata} filled from Wikidata`);
}

await main();
