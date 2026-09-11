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
 * Usage:
 *     node tools/assets/add_spine_animations.mjs --spine <dir> [--index src/data/spine-index.json]
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
	const indexPath = args.includes("--index") ? args[args.indexOf("--index") + 1] : "src/data/spine-index.json";
	if (!spineDir || !fs.existsSync(spineDir)) {
		console.error("pass --spine <dir> pointing at the published spine/<id>/ tree");
		process.exit(1);
	}

	const SkeletonBinary = new Function(`${fs.readFileSync(SKB, "utf8")}\nreturn SkeletonBinary;`)();
	const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

	let rigs = 0;
	const vocabulary = new Set();
	for (const [id, entry] of Object.entries(index)) {
		for (const kind of ["combat", "dorm"]) {
			const rig = entry[kind];
			if (!rig) continue;
			rig.anims = animationNames(SkeletonBinary, path.join(spineDir, id, `${rig.skel}.skel`));
			rig.anims.forEach((name) => vocabulary.add(name));
			rigs++;
		}
		for (const rig of Object.values(entry.skins ?? {})) {
			rig.anims = animationNames(SkeletonBinary, path.join(spineDir, id, `${rig.skel}.skel`));
			rig.anims.forEach((name) => vocabulary.add(name));
			rigs++;
		}
	}

	// Note: JSON.stringify's second argument is a replacer, not a sort. Passing a key array here
	// silently strips every nested property.
	fs.writeFileSync(indexPath, `${JSON.stringify(index)}\n`);
	console.log(`updated ${indexPath} (${(fs.statSync(indexPath).size / 1024).toFixed(0)} KB)`);
	console.log(`  rigs annotated   ${rigs}`);
	console.log(`  distinct names   ${vocabulary.size}`);
}

main();
