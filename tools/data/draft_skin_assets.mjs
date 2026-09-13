#!/usr/bin/env node
/**
 * Draft `skin-assets.json`: which upstream skin id sits in each existing art slot (`skin1`, `skin2` ...).
 *
 * Spine rig names are `<code>_<skinId>`, which gives an exact id for almost every slot. Slots without a rig are matched
 * by name against the old hand-written skin names and printed for review. Anything still unknown is written as null.
 * Hosted skins with no upstream record (merch-only or China-only skins) are recorded by hand afterwards as `{ "name": ... }` entries.
 *
 * This ran once before the hand-written doll shards were deleted and now only works from a checkout before that commit.
 *
 * Usage:
 *     node tools/data/draft_skin_assets.mjs [--out tools/data/skin-assets.json]
 */

import fs from "node:fs";

import { loadUpstream, resolveUpstreamDir } from "./lib/upstream.mjs";

/** Hand-written doll shards, read only for their old skin names. */
const LEGACY_SHARDS = ["tdolls_from_1_to_100", "tdolls_from_101_to_200", "tdolls_from_201_to_300", "tdolls_from_301_to_400", "tdolls_from_1000_to_1050"];

/**
 * Reduce a name for loose comparison.
 *
 * @param {string} name A skin name.
 * @returns {string} Lowercase letters and digits only.
 */
function loose(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Read every hand-written doll.
 *
 * @returns {object[]} Raw legacy doll records.
 */
function legacyDolls() {
	return LEGACY_SHARDS.flatMap((shard) => new Function(fs.readFileSync(`src/data/${shard}.js`, "utf8").replace("export default tdolls;", "return tdolls;"))());
}

/** Drafts `skin-assets.json` from the spine rig names and upstream skin table, printing any slot left for manual review. */
function main() {
	const args = process.argv.slice(2);
	const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : "tools/data/skin-assets.json";
	const upstream = loadUpstream(resolveUpstreamDir());
	const spine = JSON.parse(fs.readFileSync("src/data/spine-index.json", "utf8"));
	const legacy = new Map(legacyDolls().map((doll) => [doll.normal.id, doll]));
	const skinsByDoll = new Map();
	for (const skin of upstream.stc("skin")) {
		if (skin.is_hidden === 0) {
			const list = skinsByDoll.get(skin.fit_gun) ?? [];
			list.push({ id: skin.id, name: upstream.t(skin.name) });
			skinsByDoll.set(skin.fit_gun, list);
		}
	}

	const upstreamIds = new Set(upstream.stc("gun").map((gun) => gun.id));
	const result = {};
	const review = [];
	for (const [key, entry] of Object.entries(spine)) {
		const dollId = Number(key);
		const rigs = entry.skinRigs ?? [];
		// Dolls missing from the US data (collabs 1003-1008) keep their old skins through overrides.json instead.
		if (rigs.length === 0 || !upstreamIds.has(dollId)) {
			continue;
		}
		const oldNames = legacy.get(dollId)?.skins?.skin_names ?? [];
		const candidates = skinsByDoll.get(dollId) ?? [];
		result[key] = rigs.map((rig, index) => {
			const match = rig?.combat?.skel ? /_(\d+)$/.exec(rig.combat.skel) : null;
			const fromRig = match ? Number(match[1]) : null;
			if (fromRig !== null && candidates.some((skin) => skin.id === fromRig)) {
				return fromRig;
			}
			const byName = candidates.find((skin) => loose(skin.name) === loose(oldNames[index] ?? ""));
			review.push({
				doll: dollId,
				slot: `skin${index + 1}`,
				oldName: oldNames[index] ?? "",
				guess: byName ? `${byName.id} ${byName.name}` : null,
				candidates: candidates.map((skin) => `${skin.id} ${skin.name}`)
			});
			return byName ? byName.id : null;
		});
	}

	fs.writeFileSync(out, `${JSON.stringify(result, null, "\t")}\n`);
	console.log(`wrote ${out}: ${Object.keys(result).length} dolls, ${review.length} slots need review`);
	for (const item of review) {
		console.log(JSON.stringify(item));
	}
}

main();
