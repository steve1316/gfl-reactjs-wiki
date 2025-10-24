#!/usr/bin/env node
/**
 * Check a published asset host by fetching a random sample of the URLs the site can ask for.
 *
 * URLs are derived from the version 3 manifest and Spine index exactly as `src/lib/assets.ts` builds them, grouped into tiers, and the
 * sample is spread across every tier. The top-level UI images come from the `uiUrl("<name>")` calls in the site source. The page images of
 * each sampled atlas are fetched too. Any response other than 200 fails the run.
 *
 * Usage:
 *     node tools/assets/verify_live_assets.mjs <base> [--sample 200] [--seed <n>] [--manifest <file>] [--spine-index <file>]
 *         [--hoc-spine-index <file>] [--src <dir>]
 *
 * The seed is printed, so a failing sample can be fetched again with `--seed`.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Constants

/** Default inputs: the manifest, Spine index and HOC Spine index the site bundles. */
const DEFAULTS = {
	sample: 200,
	manifest: "assets-manifest.json",
	spineIndex: "src/data/spine-index.json",
	hocSpineIndex: "src/data/hoc-spine-index.json",
	src: "src",
	concurrency: 4
};

/** A `uiUrl("<name>")` call in the site source, capturing the file name. */
const UI_URL_CALL = /\buiUrl\(\s*["']([^"']+)["']\s*\)/g;

/** Per-request timeout in milliseconds. */
const TIMEOUT_MS = 30000;

/** Network failures are retried this many times. HTTP error statuses are not. */
const RETRIES = 2;

/** v3 image kind -> filename inside a form folder, as in `src/lib/assets.ts`. Tier is `full` for `full`/`full_damaged`, `cards` otherwise. */
const IMAGE_FILES = { card: "card.webp", card_damaged: "card_d.webp", full: "full.webp", full_damaged: "full_d.webp" };

/** v3 Mod-skin card kind -> filename inside a skin folder. */
const MOD_CARD_FILES = { card: "mod_card.webp", card_damaged: "mod_card_d.webp" };

/** HOC image kind -> filename inside a HOC folder, as in `hocCardUrl` / `hocFullArtUrl` in `src/lib/assets.ts`. Tier is `hocFull` for `full`, `hocCards` for `card`. */
const HOC_IMAGE_FILES = { card: "card.webp", full: "full.webp" };

/** Fairy image kind -> filename inside a fairy's `fairies/<id>/` folder. */
const FAIRY_IMAGE_FILES = { form1: "form1.webp", form2: "form2.webp", form3: "form3.webp" };

/** Live2D fairy form kind -> its model3.json filename inside a fairy's `live2d/fairies/<id>/` folder. */
const LIVE2D_FAIRY_MODEL_FILES = { form1: "form1.model3.json", form2: "form2.model3.json", form3: "form3.model3.json" };

/** Live2D HOC kind -> its model3.json filename inside a HOC's `live2d/hocs/<id>/` folder. */
const LIVE2D_HOC_MODEL_FILES = { model: "model.model3.json" };

/** Live2D T-Doll skin variant model3.json filename, inside a skin's `live2d/tdolls/<id>/<form>/<skin>/<variant>/` folder. */
const LIVE2D_SKIN_MODEL_FILE = "model.model3.json";

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
 * Collect the UI image names the site asks for, from every `uiUrl("<name>")` call in its source.
 *
 * @param {string} srcDir The site's source folder.
 * @returns {string[]} Distinct file names, sorted.
 */
export function uiImageNames(srcDir) {
	const names = new Set();
	for (const entry of fs.readdirSync(srcDir, { recursive: true, withFileTypes: true })) {
		if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
			const text = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf8");
			for (const match of text.matchAll(UI_URL_CALL)) {
				names.add(match[1]);
			}
		}
	}
	return [...names].sort();
}

/**
 * Derive every URL the manifest, Spine index and UI image names imply, grouped by tier.
 *
 * @param {object} manifest The version 3 asset manifest.
 * @param {object} spineIndex The version 3 Spine index.
 * @param {string} base Base URL of the asset host.
 * @param {string[]} [uiNames] Top-level UI image names, as `uiImageNames` finds them.
 * @param {object} [hocSpineIndex] The HOC Spine index, id -> `{combat, crew}` rigs.
 * @returns {Record<string, string[]>} Tier name -> URLs. Tiers are `manifest`, `ui`, `cards`, `modCards`, `full`, `skills`, `equipment`,
 *     `spineSkel`, `spineAtlas`, `hocCards`, `hocFull`, `hocSpineSkel`, `hocSpineAtlas`, `fairyForms`, `live2dFairies`, `live2dHocs` and
 *     `live2dTdolls`.
 */
export function candidateUrls(manifest, spineIndex, base, uiNames = [], hocSpineIndex = {}) {
	const tiers = {
		manifest: [join(base, "assets-manifest.json")],
		ui: uiNames.map((name) => join(base, name)),
		cards: [],
		modCards: [],
		full: [],
		skills: [],
		equipment: [],
		spineSkel: [],
		spineAtlas: [],
		hocCards: [],
		hocFull: [],
		hocSpineSkel: [],
		hocSpineAtlas: [],
		fairyForms: [],
		live2dFairies: [],
		live2dHocs: [],
		live2dTdolls: []
	};
	for (const [id, doll] of Object.entries(manifest.dolls ?? {})) {
		const forms = [[`tdolls/${id}`, doll.normal], [`tdolls/${id}/mod`, doll.mod], ...Object.entries(doll.skins ?? {}).map(([skinId, skin]) => [`tdolls/${id}/skins/${skinId}`, skin])];
		for (const [folder, form] of forms) {
			if (!form) continue;
			for (const kind of form.images ?? []) {
				const tier = kind.startsWith("full") ? "full" : "cards";
				tiers[tier].push(join(base, `${folder}/${IMAGE_FILES[kind]}`));
			}
			for (const kind of form.modImages ?? []) {
				tiers.modCards.push(join(base, `${folder}/${MOD_CARD_FILES[kind]}`));
			}
		}
		for (const skill of doll.skills ?? []) {
			tiers.skills.push(join(base, `tdolls/${id}/${skill}.png`));
		}
	}
	for (const equipId of manifest.equipment ?? []) {
		tiers.equipment.push(join(base, `equipment/${equipId}.png`));
	}
	for (const [id, entry] of Object.entries(spineIndex)) {
		const rigs = [entry.combat, entry.dorm, entry.mod?.combat, entry.mod?.dorm, ...Object.values(entry.skins ?? {}).flatMap((pair) => [pair.combat, pair.dorm])];
		const skels = new Set();
		const atlases = new Set();
		for (const rig of rigs.filter(Boolean)) {
			skels.add(join(base, `spine/${id}/${rig.skel}.skel`));
			atlases.add(join(base, `spine/${id}/${rig.atlas}.atlas`));
		}
		tiers.spineSkel.push(...skels);
		tiers.spineAtlas.push(...atlases);
	}
	for (const [id, kinds] of Object.entries(manifest.hocs ?? {})) {
		for (const kind of kinds) {
			const tier = kind === "full" ? "hocFull" : "hocCards";
			tiers[tier].push(join(base, `hocs/${id}/${HOC_IMAGE_FILES[kind]}`));
		}
	}
	for (const [id, kinds] of Object.entries(manifest.fairies ?? {})) {
		for (const kind of kinds) {
			tiers.fairyForms.push(join(base, `fairies/${id}/${FAIRY_IMAGE_FILES[kind]}`));
		}
	}
	for (const [id, kinds] of Object.entries(manifest.live2d?.fairies ?? {})) {
		for (const kind of kinds) {
			tiers.live2dFairies.push(join(base, `live2d/fairies/${id}/${LIVE2D_FAIRY_MODEL_FILES[kind]}`));
		}
	}
	for (const [id, kinds] of Object.entries(manifest.live2d?.hocs ?? {})) {
		for (const kind of kinds) {
			tiers.live2dHocs.push(join(base, `live2d/hocs/${id}/${LIVE2D_HOC_MODEL_FILES[kind]}`));
		}
	}
	for (const [id, forms] of Object.entries(manifest.live2d?.tdolls ?? {})) {
		for (const [form, skins] of Object.entries(forms)) {
			for (const [skin, variants] of Object.entries(skins)) {
				for (const variant of variants) {
					tiers.live2dTdolls.push(join(base, `live2d/tdolls/${id}/${form}/${skin}/${variant}/${LIVE2D_SKIN_MODEL_FILE}`));
				}
			}
		}
	}
	for (const [id, entry] of Object.entries(hocSpineIndex)) {
		const rigs = [entry.combat, ...(entry.crew ?? [])].filter(Boolean);
		const skels = new Set();
		const atlases = new Set();
		for (const rig of rigs) {
			skels.add(join(base, `hoc-spine/${id}/${rig.skel}.skel`));
			atlases.add(join(base, `hoc-spine/${id}/${rig.atlas}.atlas`));
		}
		tiers.hocSpineSkel.push(...skels);
		tiers.hocSpineAtlas.push(...atlases);
	}
	return tiers;
}

/**
 * List the page image names an atlas refers to. The Spine atlas format is block-aware: a page name is the first non-empty
 * line of the file and the first non-empty line after each blank line, with the page's attribute lines and its regions'
 * name/attribute lines following inside the same block. A region can be named anything, including something ending in
 * `.png`, so only a block's first line is ever treated as a page name.
 *
 * @param {string} text Atlas file contents.
 * @returns {string[]} Page filenames, relative to the atlas's folder.
 */
export function atlasPageNames(text) {
	const pages = [];
	let atBlockStart = true;
	for (const rawLine of text.split("\n")) {
		const line = rawLine.trim();
		if (line === "") {
			atBlockStart = true;
			continue;
		}
		if (atBlockStart) {
			pages.push(line);
			atBlockStart = false;
		}
	}
	return pages;
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
	const valued = new Set(["--sample", "--seed", "--manifest", "--spine-index", "--hoc-spine-index", "--src", "--concurrency"]);
	const positional = args.filter((arg, i) => !arg.startsWith("--") && !valued.has(args[i - 1]));
	if (positional.length !== 1) {
		console.error("usage: node tools/assets/verify_live_assets.mjs <base> [--sample 200] [--seed <n>]");
		process.exitCode = 2;
		return;
	}
	const [base] = positional;
	const size = Number(option(args, "--sample", DEFAULTS.sample));
	const seed = Number(option(args, "--seed", Math.floor(Math.random() * 2 ** 31)));
	const concurrency = Number(option(args, "--concurrency", DEFAULTS.concurrency));
	const manifest = JSON.parse(fs.readFileSync(option(args, "--manifest", DEFAULTS.manifest), "utf8"));
	const spineIndex = JSON.parse(fs.readFileSync(option(args, "--spine-index", DEFAULTS.spineIndex), "utf8"));
	const hocSpineIndex = JSON.parse(fs.readFileSync(option(args, "--hoc-spine-index", DEFAULTS.hocSpineIndex), "utf8"));

	const tiers = candidateUrls(manifest, spineIndex, base, uiImageNames(option(args, "--src", DEFAULTS.src)), hocSpineIndex);
	const sample = sampleByTier(tiers, size, seed);
	console.log(`assets ${base}`);
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
