#!/usr/bin/env node
/**
 * Make each atlas's declared page filename match the file that is actually published.
 *
 * A Spine atlas names its page image on the first line. In ten of the game's atlases that name
 * differs from the file only by case, for example `fp6.atlas` asking for `FP6.png` next to a file
 * called `fp6.png`. That works on the case-insensitive filesystems the art was authored on and 404s
 * over HTTP, which shows up as a doll that never appears while everything else looks healthy.
 *
 * Rewriting the text reference is preferred over renaming the image, since the `.skel` and the index
 * both key off the existing filenames.
 *
 * Usage:
 *     node tools/assets/fix_atlas_pages.mjs --spine <dir> [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";

function main() {
	const args = process.argv.slice(2);
	const spineDir = args[args.indexOf("--spine") + 1];
	const dryRun = args.includes("--dry-run");
	if (!spineDir || !fs.existsSync(spineDir)) {
		console.error("pass --spine <dir> pointing at the published spine/<id>/ tree");
		process.exit(1);
	}

	let scanned = 0;
	const fixed = [];
	const unresolved = [];

	for (const doll of fs.readdirSync(spineDir).sort()) {
		const dollDir = path.join(spineDir, doll);
		if (!/^\d+$/.test(doll) || !fs.statSync(dollDir).isDirectory()) continue;

		const walk = (dir) => {
			const entries = fs.readdirSync(dir);
			const present = new Set(entries.filter((e) => fs.statSync(path.join(dir, e)).isFile()));
			for (const entry of entries) {
				const full = path.join(dir, entry);
				if (fs.statSync(full).isDirectory()) {
					walk(full);
					continue;
				}
				if (!entry.endsWith(".atlas")) continue;
				scanned++;

				const text = fs.readFileSync(full, "utf8");
				const lines = text.split("\n");
				let changed = false;
				for (let i = 0; i < lines.length; i++) {
					const name = lines[i].trim();
					if (!name.toLowerCase().endsWith(".png") || present.has(name)) continue;
					const actual = [...present].find((p) => p.toLowerCase() === name.toLowerCase());
					if (actual) {
						lines[i] = lines[i].replace(name, actual);
						changed = true;
						fixed.push(`doll ${doll} ${entry}: ${name} -> ${actual}`);
					} else {
						unresolved.push(`doll ${doll} ${entry}: ${name} has no file of any casing`);
					}
				}
				if (changed && !dryRun) {
					fs.writeFileSync(full, lines.join("\n"));
				}
			}
		};
		walk(dollDir);
	}

	console.log(`atlases scanned ${scanned}`);
	console.log(`${dryRun ? "would fix" : "fixed"}        ${fixed.length}`);
	fixed.forEach((f) => console.log(`   ${f}`));
	if (unresolved.length) {
		console.log(`unresolved      ${unresolved.length}`);
		unresolved.forEach((u) => console.log(`   ${u}`));
		process.exitCode = 1;
	}
}

main();
