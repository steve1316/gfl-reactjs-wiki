#!/usr/bin/env node
/**
 * Build the search index the navigation bar uses.
 *
 * The navbar renders on every route and needs only two fields per doll, but it used to import all
 * five data modules to get them: 537 KB raw, 65 KB gzipped, on every page including the 404. This
 * emits just the id and name, which is roughly 9 KB raw and 2.4 KB gzipped.
 *
 * Usage:
 *     node tools/data/build_search_index.mjs [--data src/data] [--out src/data/search-index.json]
 */

import fs from "node:fs";
import path from "node:path";

const SHARDS = [
	"tdolls_from_1_to_100",
	"tdolls_from_101_to_200",
	"tdolls_from_201_to_300",
	"tdolls_from_301_to_400",
	"tdolls_from_1000_to_1050"
];

/**
 * Read one data module without importing it.
 *
 * The modules are ES modules that export a literal, so the export statement is rewritten into a
 * return and the body evaluated. That avoids depending on the app's module graph or its types.
 *
 * @param {string} file Absolute path to the module.
 * @returns {object[]} The raw doll records.
 */
function readShard(file) {
	const source = fs.readFileSync(file, "utf8").replace("export default tdolls;", "return tdolls;");
	return new Function(source)();
}

function main() {
	const args = process.argv.slice(2);
	const dataDir = args.includes("--data") ? args[args.indexOf("--data") + 1] : "src/data";
	const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "src/data/search-index.json";

	const entries = [];
	for (const shard of SHARDS) {
		for (const doll of readShard(path.join(dataDir, `${shard}.js`))) {
			entries.push({ id: doll.normal.id, name: doll.normal.name, type: doll.normal.type, rarity: doll.normal.rarity });
		}
	}
	entries.sort((a, b) => a.id - b.id);

	fs.writeFileSync(out, `${JSON.stringify(entries)}\n`);
	console.log(`wrote ${out} (${(fs.statSync(out).size / 1024).toFixed(1)} KB, ${entries.length} dolls)`);
}

main();
