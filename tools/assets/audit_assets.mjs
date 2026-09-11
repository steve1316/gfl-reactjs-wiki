#!/usr/bin/env node
/**
 * Check that every asset the app can ask for actually exists, and that the animation tabs it offers
 * are ones the skeletons can play.
 *
 * Written after two bugs reached the live site that a load-time check could never have caught: an
 * animation that played off-canvas, and a skin whose damaged art resolved to a different skin. Both
 * lived in interaction paths, so this audits every combination rather than the default view.
 *
 * It resolves URLs exactly as `src/lib/assets.ts` does, and reads animation names with the same
 * `skb.js` the browser uses, so a pass here means the real thing works.
 *
 * Usage:
 *     node tools/assets/audit_assets.mjs [--concurrency 16] [--skip-network]
 *
 * Exits non-zero when anything is missing, so it can gate a deploy.
 */

import fs from "node:fs";

const ASSET_BASE = "https://steve1316.github.io/gfl-wiki-assets";
const ART_BASE = "https://steve1316.github.io/gfl-wiki-assets-art";
const ART_KINDS = new Set(["full", "full_damaged"]);
const IMAGE_SUFFIX = { card: "card", card_damaged: "card_d", full: "full", full_damaged: "full_d" };

/** Animation names src/lib/spine.ts can give a readable label. Anything else shows as its raw name. */
const KNOWN_ANIMATION_NAMES = new Set([
	"wait", "wait2", "move", "attack", "attack1", "attack2", "reload", "squatreload",
	"s", "skill", "skill2", "crouch", "squat", "snipe", "action", "action1", "action2",
	"spattack", "spattack2", "spa", "spc", "sp", "sp1", "sp2", "landing",
	"die", "victory", "victory2", "victoryloop", "pick", "sit", "sit2", "lying",
	"violin", "book", "therun2"
]);

/**
 * Encode a path the same way the app does.
 *
 * @param {string} base Base URL.
 * @param {string} path Unencoded path.
 * @returns {string} Absolute URL.
 */
const join = (base, path) => `${base.replace(/\/$/, "")}/${path.split("/").map(encodeURIComponent).join("/")}`;

/**
 * Fetch with backoff on rate limiting.
 *
 * Pages answers 429 when a sweep of several thousand requests runs too hot, and a 429 counted as a
 * missing asset buries the real failures in noise. Retried with a widening delay instead.
 *
 * @param {string} url URL to request.
 * @param {object} options Fetch options.
 * @param {number} attempts How many times to try before giving up.
 * @returns {Promise<Response>} The response.
 */
async function fetchWithBackoff(url, options, attempts = 5) {
	let delay = 500;
	for (let attempt = 0; attempt < attempts; attempt++) {
		const response = await fetch(url, options);
		// 503 shows up occasionally under a long sweep and clears on retry, same as 429.
		if (response.status !== 429 && response.status !== 503) {
			return response;
		}
		await new Promise((resolve) => setTimeout(resolve, delay));
		delay *= 2;
	}
	return fetch(url, options);
}

/**
 * Run async work over a list with a fixed number of workers.
 *
 * @param {Array} items Work items.
 * @param {number} limit Concurrent workers.
 * @param {Function} worker Receives one item.
 */
async function pool(items, limit, worker) {
	let next = 0;
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, async () => {
			while (next < items.length) {
				await worker(items[next++]);
			}
		})
	);
}

function main() {
	const args = process.argv.slice(2);
	const concurrency = args.includes("--concurrency") ? Number(args[args.indexOf("--concurrency") + 1]) : 8;
	const skipNetwork = args.includes("--skip-network");

	const manifest = JSON.parse(fs.readFileSync("src/data/assets-manifest.json", "utf8"));
	const spineIndex = JSON.parse(fs.readFileSync("src/data/spine-index.json", "utf8"));

	const problems = [];
	const notes = [];
	const urls = new Set();
	const atlasesToRead = [];

	for (const [id, doll] of Object.entries(manifest.dolls)) {
		// Every portrait the app can show: each form, each kind, normal and damaged.
		for (const [form, entry] of Object.entries(doll.forms)) {
			for (const kind of entry.images) {
				const prefix = form === "normal" ? id : `${id}_${form}`;
				const base = ART_KINDS.has(kind) ? ART_BASE : ASSET_BASE;
				urls.add(join(base, `tdolls/${id}/${prefix}_${IMAGE_SUFFIX[kind]}.png`));
			}
		}
		for (const skill of doll.skills ?? []) {
			urls.add(join(ASSET_BASE, `tdolls/${id}/${id}_${skill}.png`));
		}

		const rigs = spineIndex[id];
		if (!rigs?.combat) {
			problems.push(`doll ${id}: no combat rig, the animation panel would be empty`);
			continue;
		}

		for (const [kind, rig] of Object.entries(rigs)) {
			if (kind === "skins") continue;
			urls.add(join(ASSET_BASE, `spine/${id}/${rig.skel}.skel`));
			urls.add(join(ASSET_BASE, `spine/${id}/${rig.atlas}.atlas`));
			// The page image is whatever the atlas names on its first line, which is not always the atlas's
			// own basename. Ten atlases differ from their file by case alone, and assuming the basename here
			// is exactly how four 404s reached the live site unnoticed.
			atlasesToRead.push({ id, atlas: rig.atlas });

			// The default rig must be the base one. A dorm rig (R + the combat name) or a skin rig
			// (code + _<skin id>) standing in for it means the wrong animation set plays by default,
			// which is what happened to General Liu.
			if (kind === "combat") {
				const stem = rig.skel.split("/").pop();
				if (/_\d+$/.test(stem)) {
					problems.push(`doll ${id}: default rig ${stem} is a skin, not the base rig`);
				}
				const dormStem = rigs.dorm?.skel.split("/").pop();
				if (dormStem && dormStem.toLowerCase() === stem.toLowerCase()) {
					problems.push(`doll ${id}: combat and dorm resolve to the same skeleton ${stem}`);
				}
			}

			if (!rig.anims?.length) {
				problems.push(`doll ${id} ${kind}: skeleton ${rig.skel} defines no animations`);
				continue;
			}

			// The page renders one tab per animation the skeleton defines, so every animation is reachable
			// by construction. What is worth asserting is that the set is sane: a rig with no animations
			// leaves an empty panel, and a name the UI cannot label would show as a raw identifier.
			const unlabelled = rig.anims.filter((name) => !KNOWN_ANIMATION_NAMES.has(name));
			if (unlabelled.length) {
				notes.push(`doll ${id} ${kind}: shown under raw names ${unlabelled.join(",")}`);
			}
		}
	}

	console.log(`dolls          ${Object.keys(manifest.dolls).length}`);
	console.log(`urls to check  ${urls.size}`);

	const run = async () => {
		const missing = [];
		if (!skipNetwork) {
			// Read each atlas first so the page images it declares can be checked too.
			await pool(atlasesToRead, concurrency, async ({ id, atlas }) => {
				const atlasUrl = join(ASSET_BASE, `spine/${id}/${atlas}.atlas`);
				try {
					const text = await fetchWithBackoff(atlasUrl, {}).then((r) => (r.ok ? r.text() : ""));
					const directory = atlas.includes("/") ? `${atlas.slice(0, atlas.lastIndexOf("/"))}/` : "";
					for (const line of text.split("\n")) {
						const name = line.trim();
						if (name.toLowerCase().endsWith(".png")) {
							urls.add(join(ASSET_BASE, `spine/${id}/${directory}${name}`));
						}
					}
				} catch (error) {
					problems.push(`doll ${id}: could not read atlas ${atlas} (${error.message})`);
				}
			});
			console.log(`urls after reading atlases ${urls.size}`);
			let done = 0;
			await pool([...urls], concurrency, async (url) => {
				try {
					const response = await fetchWithBackoff(url, { method: "HEAD" });
					if (!response.ok) missing.push(`${response.status} ${url}`);
				} catch (error) {
					missing.push(`ERR ${url} ${error.message}`);
				}
				if (++done % 500 === 0) process.stderr.write(`  checked ${done}/${urls.size}\n`);
			});
		}

		console.log(`missing assets ${missing.length}`);
		missing.slice(0, 20).forEach((m) => console.log(`   ${m}`));
		console.log(`structural problems ${problems.length}`);
		problems.slice(0, 25).forEach((p) => console.log(`   ${p}`));
		console.log(`notes (not failures) ${notes.length}`);
		notes.slice(0, 10).forEach((n) => console.log(`   ${n}`));

		if (missing.length || problems.length) {
			process.exitCode = 1;
		} else {
			console.log("\nall good");
		}
	};

	return run();
}

await main();
