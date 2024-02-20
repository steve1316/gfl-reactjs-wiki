import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { fetchIopwikiPages } from "../lib/iopwiki.mjs";
import { fetchWikidataFacts } from "../lib/wikidata.mjs";
import { loadCnGuns } from "../lib/cnData.mjs";

// This file is the one place in the suite that looks at the real tools/data/.cache, and only to prove the
// three readers' `cacheDir` option keeps them away from it - it never uses that path as an active cache for
// a call under test. Every call below is pointed at its own throwaway directory instead.
const REAL_CACHE_DIR = path.resolve("tools/data/.cache");
const REAL_CACHE_FILENAMES = ["iopwiki-pages.json", "wikidata.json", "gf-data-ch-gun.json"];

/**
 * Snapshot whether each real cache file exists and, if so, its size and last-modified time.
 *
 * @returns {Record<string, { size: number, mtimeMs: number } | null>} One entry per tracked filename, null when absent.
 */
function snapshotRealCache() {
	const snapshot = {};
	for (const filename of REAL_CACHE_FILENAMES) {
		const file = path.join(REAL_CACHE_DIR, filename);
		snapshot[filename] = fs.existsSync(file) ? { size: fs.statSync(file).size, mtimeMs: fs.statSync(file).mtimeMs } : null;
	}
	return snapshot;
}

test("fetchIopwikiPages, fetchWikidataFacts and loadCnGuns never touch the real tools/data/.cache when given a cacheDir", async () => {
	const before = snapshotRealCache();
	const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "gfl-cache-isolation-test-"));
	const originalFetch = globalThis.fetch;
	try {
		globalThis.fetch = async () => ({
			ok: true,
			status: 200,
			json: async () => ({ query: { pages: [{ title: "Test", revisions: [{ slots: { main: { content: "{{PlayableUnit|index=1}}" } } }] }] } })
		});
		await fetchIopwikiPages({ cacheDir });

		globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ entities: {} }) });
		await fetchWikidataFacts(["Anything"], { cacheDir, wait: async () => {} });

		globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => [] });
		await loadCnGuns({ cacheDir });

		// Every reader must have written into the temp directory instead of the real one.
		for (const filename of REAL_CACHE_FILENAMES) {
			assert.ok(fs.existsSync(path.join(cacheDir, filename)), `expected ${filename} to be written under the temp cacheDir`);
		}
		assert.deepEqual(snapshotRealCache(), before, "the real tools/data/.cache files must be unchanged");
	} finally {
		globalThis.fetch = originalFetch;
		fs.rmSync(cacheDir, { recursive: true, force: true });
	}
});
