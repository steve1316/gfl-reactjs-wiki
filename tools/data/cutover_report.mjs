#!/usr/bin/env node
/**
 * One-time comparison of generated dolls against the hand-written shards, before those are deleted.
 *
 * Writes tools/data/.cache/cutover-report.md with expected, suspicious and missing differences.
 *
 * This ran once before the hand-written shards were deleted and now only works from a checkout before that commit.
 *
 * Usage:
 *     node tools/data/cutover_report.mjs
 */

import fs from "node:fs";

import { SHARDS } from "./lib/shards.mjs";

/** Hand-written shards being replaced. */
const LEGACY_SHARDS = ["tdolls_from_1_to_100", "tdolls_from_101_to_200", "tdolls_from_201_to_300", "tdolls_from_301_to_400", "tdolls_from_1000_to_1050"];

/** Relative stat change above which a difference is flagged as suspicious. */
const SUSPICIOUS_RATIO = 0.1;

/** Stats compared per form. */
const STATS = ["max_hp", "max_dmg", "max_acc", "max_eva", "max_rof", "max_armor"];

/**
 * Compare every legacy hand-written doll against the generated doll and sort each difference into a bucket.
 */
function main() {
	const legacy = LEGACY_SHARDS.flatMap((shard) => new Function(fs.readFileSync(`src/data/${shard}.js`, "utf8").replace("export default tdolls;", "return tdolls;"))());
	const generated = new Map(SHARDS.flatMap((shard) => JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8"))).map((doll) => [doll.normal.id, doll]));
	const buckets = { expected: [], suspicious: [], missing: [] };

	for (const old of legacy) {
		const id = old.normal.id;
		const now = generated.get(id);
		if (!now) {
			buckets.missing.push(`${id} ${old.normal.name}: not generated`);
			continue;
		}
		if (old.mod && !now.mod) {
			buckets.suspicious.push(`${id} ${old.normal.name}: Mod missing`);
		}
		for (const form of ["normal", "mod"]) {
			const a = old[form];
			const b = now[form];
			if (!a || !b) {
				continue;
			}
			if (a.name !== b.name) {
				buckets.expected.push(`${id} ${form} name: "${a.name}" -> "${b.name}"`);
			}
			if (a.type !== b.type) {
				buckets.suspicious.push(`${id} ${form} type: ${a.type} -> ${b.type}`);
			}
			if (a.rarity !== b.rarity) {
				buckets.suspicious.push(`${id} ${form} rarity: ${a.rarity} -> ${b.rarity}`);
			}
			for (const stat of STATS) {
				const before = a[stat] ?? 0;
				const after = b[stat] ?? 0;
				if (before !== after) {
					const bucket = Math.abs(after - before) > Math.max(1, before) * SUSPICIOUS_RATIO ? buckets.suspicious : buckets.expected;
					bucket.push(`${id} ${form} ${stat}: ${before} -> ${after}`);
				}
			}
			const oldGrid = JSON.stringify([a.tile_set.row1, a.tile_set.row2, a.tile_set.row3]);
			const newGrid = JSON.stringify([b.tile_set.row1, b.tile_set.row2, b.tile_set.row3]);
			if (oldGrid !== newGrid) {
				buckets.suspicious.push(`${id} ${form} tile grid: ${oldGrid} -> ${newGrid}`);
			}
			for (const key of ["skill", "skill2"]) {
				if (a[key] && b[key] && a[key].number_of_stats !== b[key].number_of_stats) {
					buckets.suspicious.push(`${id} ${form} ${key} "${b[key].name}": ${a[key].number_of_stats} values -> ${b[key].number_of_stats}`);
				} else if (a[key] && b[key] && a[key].description !== b[key].description) {
					buckets.expected.push(`${id} ${form} ${key} text reworded`);
				}
			}
		}
		const oldSkins = old.skins?.number_of_skins ?? 0;
		const newSkins = now.skins?.number_of_skins ?? 0;
		if (newSkins < oldSkins) {
			buckets.suspicious.push(`${id} skins: ${oldSkins} -> ${newSkins}`);
		}
	}

	fs.mkdirSync("tools/data/.cache", { recursive: true });
	const report = Object.entries(buckets)
		.map(([name, lines]) => `## ${name} (${lines.length})\n\n${lines.map((line) => `- ${line}`).join("\n")}\n`)
		.join("\n");
	fs.writeFileSync("tools/data/.cache/cutover-report.md", `# Cutover report\n\n${report}`);
	console.log(`expected ${buckets.expected.length}, suspicious ${buckets.suspicious.length}, missing ${buckets.missing.length}`);
	console.log("written to tools/data/.cache/cutover-report.md");
}

main();
