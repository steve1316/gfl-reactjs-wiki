#!/usr/bin/env node
/**
 * Build the search index the navigation bar uses.
 *
 * The navbar renders on every route and needs only two fields per doll, but it used to import all
 * the generated doll shards to get them: 537 KB raw, 65 KB gzipped, on every page including the 404. This
 * emits just the id and name, which is roughly 9 KB raw and 2.4 KB gzipped.
 *
 * Entries also carry `aliases` from `tools/data/name-aliases.json`: the names the wiki used before the 2026-09-13
 * upstream import renamed dolls (HK416 is now "416"), so readers can still find a doll by its old name.
 *
 * HOCs go to their own small `hoc-search-index.json`, because doll and HOC ids overlap and every doll-keyed reader of the main index would
 * otherwise have to skip them.
 *
 * Usage:
 *     node tools/data/build_search_index.mjs [--data src/data] [--out src/data/search-index.json]
 */

import fs from "node:fs";
import path from "node:path";

import { SHARDS } from "./lib/shards.mjs";

/** Old wiki names keyed by doll id, kept searchable after upstream renamed the dolls. */
const ALIASES_FILE = "tools/data/name-aliases.json";

/**
 * Read one generated doll shard.
 *
 * @param {string} file Path to the shard's JSON.
 * @returns {object[]} Raw doll records.
 */
function readShard(file) {
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * Build the search indexes from the generated doll shards and HOCs, and write them to disk.
 */
function main() {
	const args = process.argv.slice(2);
	const dataDir = args.includes("--data") ? args[args.indexOf("--data") + 1] : "src/data";
	const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "src/data/search-index.json";

	const aliases = JSON.parse(fs.readFileSync(ALIASES_FILE, "utf8"));
	const entries = [];
	for (const shard of SHARDS) {
		for (const doll of readShard(path.join(dataDir, `${shard.file}.json`))) {
			const entry = { id: doll.normal.id, name: doll.normal.name, type: doll.normal.type, rarity: doll.normal.rarity };
			const old = aliases[String(doll.normal.id)];
			entries.push(old?.length ? { ...entry, aliases: old } : entry);
		}
	}
	entries.sort((a, b) => a.id - b.id);

	fs.writeFileSync(out, `${JSON.stringify(entries)}\n`);
	console.log(`wrote ${out} (${(fs.statSync(out).size / 1024).toFixed(1)} KB, ${entries.length} dolls)`);

	const hocs = JSON.parse(fs.readFileSync(path.join(dataDir, "hocs.json"), "utf8")).items.map((hoc) => ({ id: hoc.id, name: hoc.name }));
	const hocOut = path.join(path.dirname(out), "hoc-search-index.json");
	fs.writeFileSync(hocOut, `${JSON.stringify(hocs)}\n`);
	console.log(`wrote ${hocOut} (${hocs.length} HOCs)`);
}

main();
