#!/usr/bin/env node
/**
 * Check a published pair of asset hosts by fetching a random sample of the URLs the site can ask for.
 *
 * URLs are derived from the version 3 manifest and Spine index exactly as `src/lib/assets.ts` builds them, grouped into tiers, and the
 * sample is spread across every tier. The page images of each sampled atlas are fetched too. Any response other than 200 fails the run.
 *
 * Usage:
 *     node tools/assets/verify_live_assets.mjs <assetsBase> <artBase> [--sample 200] [--seed <n>] [--manifest <file>] [--spine-index <file>]
 *
 * The seed is printed, so a failing sample can be fetched again with `--seed`.
 */

import fs from "node:fs";
import { pathToFileURL } from "node:url";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Constants

/** Default inputs: the manifest and Spine index the site bundles. */
const DEFAULTS = { sample: 200, manifest: "assets-manifest.json", spineIndex: "src/data/spine-index.json", concurrency: 4 };

/** Per-request timeout in milliseconds. */
const TIMEOUT_MS = 30000;

/** Network failures are retried this many times. HTTP error statuses are not. */
const RETRIES = 2;

/** v3 image kind -> host and filename inside a form folder, as in `src/lib/assets.ts`. */
const IMAGE_FILES = { card: ["assets", "card.webp"], card_damaged: ["assets", "card_d.webp"], full: ["art", "full.webp"], full_damaged: ["art", "full_d.webp"] };

/** v3 Mod-skin card kind -> filename inside a skin folder. */
const MOD_CARD_FILES = { card: "mod_card.webp", card_damaged: "mod_card_d.webp" };

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// URL derivation

/**
 * Join a path onto a base URL, encoding each segment the way `src/lib/assets.ts` does.
 *
 * @param {string} base Base URL, with or without a trailing slash.
 * @param {string} path Unencoded path relative to the base.
 * @returns {string} The absolute URL.
 */
export function join(base, path) {
	return `${base.replace(/\/$/, "")}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Derive every URL the manifest and Spine index imply, grouped by tier.
 *
 * @param {object} manifest The version 3 asset manifest.
 * @param {object} spineIndex The version 3 Spine index.
 * @param {string} assetsBase Base URL of the asset host.
 * @param {string} artBase Base URL of the art host.
 * @returns {Record<string, string[]>} Tier name -> URLs. Tiers are `manifest`, `cards`, `modCards`, `full`, `skills`, `equipment`,
 *     `spineSkel` and `spineAtlas`.
 */
export function candidateUrls(manifest, spineIndex, assetsBase, artBase) {
	const bases = { assets: assetsBase, art: artBase };
	const tiers = { manifest: [join(assetsBase, "assets-manifest.json")], cards: [], modCards: [], full: [], skills: [], equipment: [], spineSkel: [], spineAtlas: [] };
	for (const [id, doll] of Object.entries(manifest.dolls ?? {})) {
		const forms = [[`tdolls/${id}`, doll.normal], [`tdolls/${id}/mod`, doll.mod], ...Object.entries(doll.skins ?? {}).map(([skinId, skin]) => [`tdolls/${id}/skins/${skinId}`, skin])];
		for (const [folder, form] of forms) {
			if (!form) continue;
			for (const kind of form.images ?? []) {
				const [host, name] = IMAGE_FILES[kind];
				tiers[host === "art" ? "full" : "cards"].push(join(bases[host], `${folder}/${name}`));
			}
			for (const kind of form.modImages ?? []) {
				tiers.modCards.push(join(assetsBase, `${folder}/${MOD_CARD_FILES[kind]}`));
			}
		}
		for (const skill of doll.skills ?? []) {
			tiers.skills.push(join(assetsBase, `tdolls/${id}/${skill}.png`));
		}
	}
	for (const equipId of manifest.equipment ?? []) {
		tiers.equipment.push(join(assetsBase, `equipment/${equipId}.png`));
	}
	for (const [id, entry] of Object.entries(spineIndex)) {
		const rigs = [entry.combat, entry.dorm, entry.mod?.combat, entry.mod?.dorm, ...Object.values(entry.skins ?? {}).flatMap((pair) => [pair.combat, pair.dorm])];
		const skels = new Set();
		const atlases = new Set();
		for (const rig of rigs.filter(Boolean)) {
			skels.add(join(assetsBase, `spine/${id}/${rig.skel}.skel`));
			atlases.add(join(assetsBase, `spine/${id}/${rig.atlas}.atlas`));
		}
		tiers.spineSkel.push(...skels);
		tiers.spineAtlas.push(...atlases);
	}
	return tiers;
}

/**
 * List the page image names an atlas refers to.
 *
 * @param {string} text Atlas file contents.
 * @returns {string[]} Page filenames, relative to the atlas's folder.
 */
export function atlasPageNames(text) {
	return text
		.split("\n")
		.map((line) => line.trim())
		.filter((name) => name.toLowerCase().endsWith(".png"));
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Sampling

/**
 * A small seeded random number generator (mulberry32).
 *
 * @param {number} seed Any 32-bit integer.
 * @returns {() => number} A function returning floats in [0, 1).
 */
export function seededRandom(seed) {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Pick a sample spread across tiers. Smaller tiers are filled first so their unused share flows to the larger ones.
 *
 * @param {Record<string, string[]>} tiers Tier name -> URLs.
 * @param {number} size How many URLs to pick in total.
 * @param {number} seed Seed for the random choice, so the same seed gives the same sample.
 * @returns {Array<{tier: string, url: string}>} The sample, grouped by tier.
 */
export function sampleByTier(tiers, size, seed) {
	const random = seededRandom(seed);
	const ordered = Object.entries(tiers)
		.filter(([, urls]) => urls.length)
		.sort(([nameA, a], [nameB, b]) => a.length - b.length || nameA.localeCompare(nameB));
	let remaining = size;
	const picked = [];
	ordered.forEach(([tier, urls], position) => {
		const quota = Math.min(urls.length, Math.floor(remaining / (ordered.length - position)));
		const pool = [...urls];
		// Partial Fisher-Yates: the first `quota` slots end up a uniform random choice.
		for (let i = 0; i < quota; i++) {
			const j = i + Math.floor(random() * (pool.length - i));
			[pool[i], pool[j]] = [pool[j], pool[i]];
			picked.push({ tier, url: pool[i] });
		}
		remaining -= quota;
	});
	return picked;
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Fetching

/**
 * Fetch one URL and read its whole body.
 *
 * @param {string} url The URL.
 * @param {boolean} wantText Whether to return the body as text.
 * @returns {Promise<{status: number | string, text?: string}>} The HTTP status, or `error: <message>` when the request never completed.
 */
async function fetchOne(url, wantText) {
	let lastError = "";
	for (let attempt = 0; attempt <= RETRIES; attempt++) {
		try {
			const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
			if (wantText && response.status === 200) {
				return { status: response.status, text: await response.text() };
			}
			await response.arrayBuffer();
			return { status: response.status };
		} catch (error) {
			lastError = error.cause?.code ?? error.message;
		}
	}
	return { status: `error: ${lastError}` };
}

/**
 * Run an async function over items with bounded concurrency.
 *
 * @param {Array<any>} items The items.
 * @param {number} limit Maximum calls in flight.
 * @param {(item: any) => Promise<any>} worker The async function.
 * @returns {Promise<Array<any>>} Results in item order.
 */
async function mapLimited(items, limit, worker) {
	const results = new Array(items.length);
	let next = 0;
	const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (next < items.length) {
			const index = next++;
			results[index] = await worker(items[index]);
		}
	});
	await Promise.all(lanes);
	return results;
}

/**
 * Read a command-line option value.
 *
 * @param {string[]} args Command-line arguments.
 * @param {string} name Option name including the dashes.
 * @param {string | number} fallback Value when the option is absent.
 * @returns {string | number} The option value.
 */
const option = (args, name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);

/**
 * Parse arguments, sample, fetch and report. Sets a non-zero exit code on any non-200 response.
 *
 * @param {string[]} args Command-line arguments.
 */
async function main(args) {
	const valued = new Set(["--sample", "--seed", "--manifest", "--spine-index", "--concurrency"]);
	const positional = args.filter((arg, i) => !arg.startsWith("--") && !valued.has(args[i - 1]));
	if (positional.length !== 2) {
		console.error("usage: node tools/assets/verify_live_assets.mjs <assetsBase> <artBase> [--sample 200] [--seed <n>]");
		process.exitCode = 2;
		return;
	}
	const [assetsBase, artBase] = positional;
	const size = Number(option(args, "--sample", DEFAULTS.sample));
	const seed = Number(option(args, "--seed", Math.floor(Math.random() * 2 ** 31)));
	const concurrency = Number(option(args, "--concurrency", DEFAULTS.concurrency));
	const manifest = JSON.parse(fs.readFileSync(option(args, "--manifest", DEFAULTS.manifest), "utf8"));
	const spineIndex = JSON.parse(fs.readFileSync(option(args, "--spine-index", DEFAULTS.spineIndex), "utf8"));

	const tiers = candidateUrls(manifest, spineIndex, assetsBase, artBase);
	const sample = sampleByTier(tiers, size, seed);
	console.log(`assets ${assetsBase}`);
	console.log(`art    ${artBase}`);
	console.log(`seed   ${seed}   sample ${sample.length} of ${Object.values(tiers).reduce((sum, urls) => sum + urls.length, 0)} URLs`);

	const results = await mapLimited(sample, concurrency, async (entry) => ({ ...entry, ...(await fetchOne(entry.url, entry.tier === "spineAtlas")) }));
	const pages = results.flatMap((result) =>
		result.text ? atlasPageNames(result.text).map((name) => ({ tier: "spinePages", url: `${result.url.slice(0, result.url.lastIndexOf("/"))}/${encodeURIComponent(name)}` })) : []
	);
	const pageResults = await mapLimited(pages, concurrency, async (entry) => ({ ...entry, ...(await fetchOne(entry.url, false)) }));
	const all = [...results, ...pageResults];

	const byTier = {};
	const byStatus = {};
	for (const { tier, status } of all) {
		byTier[tier] ??= { fetched: 0, ok: 0 };
		byTier[tier].fetched++;
		if (status === 200) byTier[tier].ok++;
		byStatus[status] = (byStatus[status] ?? 0) + 1;
	}
	console.log("\ntier          fetched      ok");
	for (const [tier, counts] of Object.entries(byTier)) {
		console.log(`${tier.padEnd(12)}${String(counts.fetched).padStart(9)}${String(counts.ok).padStart(8)}`);
	}
	console.log(`\nstatus counts ${JSON.stringify(byStatus)}`);
	const failures = all.filter((result) => result.status !== 200);
	console.log(`sampled ${results.length}, atlas pages ${pageResults.length}, ok ${all.length - failures.length}, failed ${failures.length}`);
	failures.slice(0, 20).forEach((failure) => console.log(`   ${failure.status} ${failure.url}`));
	if (failures.length) {
		process.exitCode = 1;
	} else {
		console.log("\nall good");
	}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
	await main(process.argv.slice(2));
}
