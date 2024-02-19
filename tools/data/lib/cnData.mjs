import fs from "node:fs";
import path from "node:path";

import { readLock } from "./upstream.mjs";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Identifies this importer when reading raw files off GitHub. */
const USER_AGENT = "gfl-reactjs-wiki-importer/1.0 (https://github.com/steve1316/gfl-reactjs-wiki)";

/** Where the fetched CN gun table is cached by default, alongside the sha it was fetched at. Git-ignored. Overridable via `options.cacheDir`. */
const DEFAULT_CACHE_DIR = path.resolve("tools/data/.cache");

/** Cache file name inside whichever cache directory is in effect. */
const CACHE_FILENAME = "gf-data-ch-gun.json";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Fetching

/**
 * Load gf-data-ch's `stc/gun.json` at the pinned CN commit, mapping gun id to its CN `launch_time`.
 *
 * Used to detect gf-data-us rows whose `launch_time` is really just a copied CN release date rather than
 * a true EN date. The pinned commit lives in `tools/data/upstream.lock.json` under `cn`. The fetched table
 * is cached to `tools/data/.cache/gf-data-ch-gun.json` (or `options.cacheDir`) alongside the sha it was
 * fetched at, and is refetched only when that recorded sha no longer matches the pin.
 *
 * @param {object} [options] Options.
 * @param {string} [options.cacheDir] Directory the cache file lives in, instead of `tools/data/.cache`.
 *   Tests must set this, so they never touch the real cache the importer relies on.
 * @returns {Promise<Map<number, string>>} CN `launch_time` (e.g. `"2023-07-25 00:00:00"`) keyed by gun id.
 */
export async function loadCnGuns({ cacheDir = DEFAULT_CACHE_DIR } = {}) {
	const cacheFile = path.join(cacheDir, CACHE_FILENAME);
	const { cn } = readLock();
	let cached = null;
	if (fs.existsSync(cacheFile)) {
		cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
	}
	if (!cached || cached.sha !== cn.sha) {
		const url = `https://raw.githubusercontent.com/${cn.repo}/${cn.sha}/stc/gun.json`;
		const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
		if (!response.ok) {
			throw new Error(`Failed to fetch gf-data-ch gun.json: ${response.status} ${response.statusText}`);
		}
		const rows = await response.json();
		cached = { sha: cn.sha, rows };
		fs.mkdirSync(cacheDir, { recursive: true });
		fs.writeFileSync(cacheFile, JSON.stringify(cached));
	}
	const guns = new Map();
	for (const row of cached.rows) {
		guns.set(row.id, row.launch_time);
	}
	return guns;
}
