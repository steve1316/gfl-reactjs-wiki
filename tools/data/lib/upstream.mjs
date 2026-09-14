import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { parseTextTable, unescapeText } from "./text.mjs";

/** Where the pinned upstream checkout is cached between runs. Git-ignored. */
const CACHE_DIR = path.resolve("tools/data/.cache/gf-data-us");

/** The upstream repository. */
const REPO_URL = "https://github.com/gf-data-tools/gf-data-us.git";

/** The lock file recording which upstream commit to build from. */
export const LOCK_FILE = path.resolve("tools/data/upstream.lock.json");

/**
 * Run git in a directory and return its trimmed output.
 *
 * @param {string} dir Working directory.
 * @param {string[]} args Git arguments.
 * @returns {string} Standard output.
 */
function git(dir, args) {
	return execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
}

/**
 * Read the pinned upstream commits: gf-data-us at the top level, and gf-data-ch under `cn` for spotting copied CN release dates.
 *
 * @returns {{ repo: string, sha: string, cn: { repo: string, sha: string } }} The lock file contents.
 */
export function readLock() {
	return JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
}

/**
 * Move the pinned gf-data-us and gf-data-ch commits in the lock file's text, keeping its formatting.
 *
 * Only the two sha strings are replaced, so the Prettier layout of the file survives and an unmoved pin leaves its line untouched.
 *
 * @param {string} text The current contents of `upstream.lock.json`.
 * @param {{ us: string, cn: string }} shas The full commit shas to pin for gf-data-us and gf-data-ch.
 * @returns {string} The new file contents.
 * @throws {Error} When a sha is not a full 40-character commit sha, or a current pin does not appear exactly once in the text.
 */
export function setLockShas(text, { us, cn }) {
	for (const sha of [us, cn]) {
		if (!/^[0-9a-f]{40}$/.test(sha)) {
			throw new Error(`not a full commit sha: ${sha}`);
		}
	}
	const lock = JSON.parse(text);
	const swap = (source, from, to) => {
		const needle = `"sha": "${from}"`;
		if (source.split(needle).length !== 2) {
			throw new Error(`upstream.lock.json does not hold ${needle} exactly once`);
		}
		return source.replace(needle, `"sha": "${to}"`);
	};
	const withUs = lock.sha === us ? text : swap(text, lock.sha, us);
	return lock.cn.sha === cn ? withUs : swap(withUs, lock.cn.sha, cn);
}

/**
 * Find the upstream checkout to read, fetching the pinned commit into the cache when needed.
 *
 * `GF_DATA_DIR` points at an existing checkout instead, which skips the network entirely.
 *
 * @returns {string} Absolute path to a checkout at the locked commit.
 */
export function resolveUpstreamDir() {
	if (process.env.GF_DATA_DIR) {
		return path.resolve(process.env.GF_DATA_DIR);
	}
	const { sha } = readLock();
	if (!fs.existsSync(path.join(CACHE_DIR, ".git"))) {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
		git(CACHE_DIR, ["init", "-q"]);
		git(CACHE_DIR, ["remote", "add", "origin", REPO_URL]);
	}
	let head = "";
	try {
		head = git(CACHE_DIR, ["rev-parse", "HEAD"]);
	} catch {
		head = "";
	}
	if (head !== sha) {
		git(CACHE_DIR, ["fetch", "-q", "--depth", "1", "origin", sha]);
		git(CACHE_DIR, ["checkout", "-q", "--detach", sha]);
	}
	return CACHE_DIR;
}

/**
 * Open an upstream checkout for reading. Every table is parsed at most once.
 *
 * @param {string} dir Path to the checkout.
 * @returns {{ dir: string, stc: (name: string) => object[], catchdata: (name: string) => object[], text: (table: string) => Map<string, string>, t: (key: string) => string }} Readers.
 */
export function loadUpstream(dir) {
	const cache = new Map();
	const once = (key, load) => {
		if (!cache.has(key)) {
			cache.set(key, load());
		}
		return cache.get(key);
	};
	const stc = (name) => once(`stc/${name}`, () => JSON.parse(fs.readFileSync(path.join(dir, "stc", `${name}.json`), "utf8")));
	const catchdata = (name) => once(`catchdata/${name}`, () => JSON.parse(fs.readFileSync(path.join(dir, "catchdata", `${name}.json`), "utf8")));
	const text = (table) => once(`text/${table}`, () => parseTextTable(fs.readFileSync(path.join(dir, "asset", "table", `${table}.txt`), "utf8")));
	const t = (key) => {
		if (typeof key !== "string" || !key.includes("-")) {
			return "";
		}
		const value = text(key.slice(0, key.lastIndexOf("-"))).get(key);
		return value === undefined ? "" : unescapeText(value);
	};
	return { dir, stc, catchdata, text, t };
}
