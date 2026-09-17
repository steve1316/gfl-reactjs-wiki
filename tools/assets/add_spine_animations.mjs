#!/usr/bin/env node
/**
 * Record each Spine rig's animation names into `spine-index.json`.
 *
 * Without this the app decides which animation tabs to show from the old GIF filenames, which do not
 * agree with the skeletons. Sixty-eight dolls name their skill animation `s` rather than `skill`, so
 * a "Skill" tab appeared and did nothing, and skeletons carry animations the GIF era never had.
 * Reading the names from the skeletons makes the tabs honest.
 *
 * Uses the same `skb.js` the browser does, so the names here are exactly what the runtime will find.
 *
 * `--hoc` and `--enemy` switch to the flat indexes: an entry there is a `combat` rig plus, for a HOC, a `crew` list, instead of a doll's
 * combat, dorm, Mod and skin rigs, so each entry flattens to a different rig list.
 *
 * Usage:
 *     node tools/assets/add_spine_animations.mjs --spine <dir> [--index src/data/spine-index.json]
 *     node tools/assets/add_spine_animations.mjs --spine <hoc-spine dir> --hoc [--index src/data/hoc-spine-index.json]
 *     node tools/assets/add_spine_animations.mjs --spine <enemy-spine dir> --enemy [--index src/data/enemy-spine-index.json]
 */

import fs from "node:fs";
import path from "node:path";

/** Path to the vendored Spine binary reader, reused so parsing matches the browser exactly. */
const SKB = "public/vendor/spine/skb.js";

/**
 * Read the animation names out of one binary skeleton.
 *
 * @param {Function} SkeletonBinary The parser constructor from skb.js.
 * @param {string} file Absolute path to the `.skel`.
 * @returns {string[]} Animation names, empty when the file is missing or unreadable.
 */
function animationNames(SkeletonBinary, file) {
	if (!fs.existsSync(file)) {
		return [];
	}
	try {
		const parser = new SkeletonBinary();
		parser.data = new Uint8Array(fs.readFileSync(file));
		parser.scale = 1;
		parser.initJson();
		return Object.keys(parser.json.animations ?? {}).sort();
	} catch {
		return [];
	}
}

function main() {
	const args = process.argv.slice(2);
	const spineDir = args[args.indexOf("--spine") + 1];
	const isHoc = args.includes("--hoc");
	const isEnemy = args.includes("--enemy");
	// HOC and enemy entries are both flat: one combat rig, plus a crew list only a HOC has.
	const isFlat = isHoc || isEnemy;
	const defaultIndex = isHoc ? "src/data/hoc-spine-index.json" : isEnemy ? "src/data/enemy-spine-index.json" : "src/data/spine-index.json";
	const indexPath = args.includes("--index") ? args[args.indexOf("--index") + 1] : defaultIndex;
	if (!spineDir || !fs.existsSync(spineDir)) {
		const tree = isHoc ? "hoc-spine/<id>/" : isEnemy ? "enemy-spine/<id>/" : "spine/<id>/";
		console.error(`pass --spine <dir> pointing at the published ${tree} tree`);
		process.exit(1);
	}

	const SkeletonBinary = new Function(`${fs.readFileSync(SKB, "utf8")}\nreturn SkeletonBinary;`)();
	const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

	let rigs = 0;
	const vocabulary = new Set();
	/**
	 * Record one rig's animation names, add them to the vocabulary and count the rig.
	 *
	 * @param {{skel: string, anims: string[]}} rig The index rig entry to fill in.
	 * @param {string} folder The entry's folder under `spineDir`.
	 */
	const annotate = (rig, folder) => {
		rig.anims = animationNames(SkeletonBinary, path.join(spineDir, folder, `${rig.skel}.skel`));
		rig.anims.forEach((name) => vocabulary.add(name));
		rigs++;
	};
	for (const [id, entry] of Object.entries(index)) {
		// A HOC has a combat rig and a flat crew list, and an enemy just the combat rig. A doll has its own rigs, then the Mod's, which is a
		// separate chibi with its own animation set, then each skin's combat rig and, usually, a dorm one.
		const entryRigs = isFlat
			? [entry.combat, ...(entry.crew ?? [])]
			: [entry.combat, entry.dorm, entry.mod?.combat, entry.mod?.dorm, ...Object.values(entry.skins ?? {}).flatMap((skin) => Object.values(skin))];
		entryRigs.filter(Boolean).forEach((rig) => annotate(rig, id));
	}

	// Note: JSON.stringify's second argument is a replacer, not a sort. Passing a key array here
	// silently strips every nested property.
	fs.writeFileSync(indexPath, `${JSON.stringify(index)}\n`);
	console.log(`updated ${indexPath} (${(fs.statSync(indexPath).size / 1024).toFixed(0)} KB)`);
	console.log(`  rigs annotated   ${rigs}`);
	console.log(`  distinct names   ${vocabulary.size}`);
}

main();
