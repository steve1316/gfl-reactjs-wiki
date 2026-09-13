#!/usr/bin/env node
/**
 * Build the search index the navigation bar uses.
 *
 * The navbar renders on every route and needs only two fields per doll, but it used to import all
 * the generated doll shards to get them: 537 KB raw, 65 KB gzipped, on every page including the 404. This
 * emits just the id and name, which is roughly 9 KB raw and 2.4 KB gzipped.
 *
 * Usage:
 *     node tools/data/build_search_index.mjs [--data src/data] [--out src/data/search-index.json]
 */

import fs from "node:fs";
import path from "node:path";

import { SHARDS } from "./lib/shards.mjs";

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
 * Build the search index from every generated doll shard and write it to disk.
 */
function main() {
	const args = process.argv.slice(2);
	const dataDir = args.includes("--data") ? args[args.indexOf("--data") + 1] : "src/data";
	const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "src/data/search-index.json";

	const entries = [];
	for (const shard of SHARDS) {
		for (const doll of readShard(path.join(dataDir, `${shard.file}.json`))) {
			entries.push({ id: doll.normal.id, name: doll.normal.name, type: doll.normal.type, rarity: doll.normal.rarity });
		}
	}
	entries.sort((a, b) => a.id - b.id);

	fs.writeFileSync(out, `${JSON.stringify(entries)}\n`);
	console.log(`wrote ${out} (${(fs.statSync(out).size / 1024).toFixed(1)} KB, ${entries.length} dolls)`);
}

main();
