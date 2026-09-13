#!/usr/bin/env node
/**
 * Draft `equipment-assets.json`: which existing equipment icon belongs to each upstream equipment id.
 *
 * Icons are stored by old category and old name, so upstream items are matched on loose name plus rarity against the
 * manifest's equipment entries and the old data. Unmatched old items are printed for review.
 *
 * This ran once before the hand-written equipment data was deleted and now only works from a checkout before that commit.
 *
 * Usage:
 *     node tools/data/draft_equipment_assets.mjs [--out tools/data/equipment-assets.json]
 */

import fs from "node:fs";

import { loadUpstream, resolveUpstreamDir } from "./lib/upstream.mjs";

/**
 * Reduce a name for loose comparison.
 *
 * @param {string} name An equipment name.
 * @returns {string} Lowercase letters and digits only.
 */
function loose(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * The icon file name the old data used for an item. Mirrors `equipmentImageName` in `src/lib/data.ts`.
 *
 * @param {string} name Old item name.
 * @param {number} rarity Old item rarity.
 * @returns {string} File name without extension.
 */
function legacyImageName(name, rarity) {
	if (name.startsWith(".") || name.startsWith("#")) {
		return name.slice(1);
	}
	return name === "ILM Hollow Point Ammo" ? `${name} (${rarity})` : name;
}

function main() {
	const args = process.argv.slice(2);
	const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "tools/data/equipment-assets.json";
	const upstream = loadUpstream(resolveUpstreamDir());
	const manifest = JSON.parse(fs.readFileSync("assets-manifest.json", "utf8"));
	const legacy = new Function(fs.readFileSync("src/data/equipments.js", "utf8").replace("export default equipments;", "return equipments;"))();

	const byNameRarity = new Map();
	for (const [category, list] of Object.entries(legacy)) {
		for (const item of list) {
			const path = manifest.equipment?.[category]?.[legacyImageName(item.name, item.rarity)];
			if (path) {
				byNameRarity.set(`${loose(item.name)}|${item.rarity}`, { path, item });
			}
		}
	}

	const result = {};
	const used = new Set();
	for (const row of upstream.stc("equip")) {
		const hit = byNameRarity.get(`${loose(upstream.t(row.name))}|${row.rank}`);
		if (row.is_show === 1 && hit) {
			result[String(row.id)] = hit.path;
			used.add(hit.path);
		}
	}
	fs.writeFileSync(out, `${JSON.stringify(result, null, "\t")}\n`);
	const unmatched = [...byNameRarity.values()].filter((entry) => !used.has(entry.path));
	console.log(`wrote ${out}: ${Object.keys(result).length} matched, ${unmatched.length} old icons unmatched`);
	for (const entry of unmatched) {
		console.log(JSON.stringify({ name: entry.item.name, rarity: entry.item.rarity, usable: entry.item.usable, path: entry.path }));
	}
}

main();
