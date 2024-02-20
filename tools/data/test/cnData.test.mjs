import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadCnGuns } from "../lib/cnData.mjs";

const sampleRows = JSON.parse(fs.readFileSync("tools/data/test/fixtures/gf-data-ch-gun-sample.json", "utf8"));
const PINNED_SHA = "77f0379cbc504753c864d1a9a6091bbfd0536215";

// Every test gets its own throwaway cache directory, never the real tools/data/.cache the importer uses.
let cacheDir;

test.beforeEach(() => {
	cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "gfl-cndata-test-"));
});

test.afterEach(() => {
	fs.rmSync(cacheDir, { recursive: true, force: true });
});

test("fetches gun.json at the pinned sha and maps id to launch_time", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => sampleRows });
	try {
		const guns = await loadCnGuns({ cacheDir });
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
		assert.equal(guns.get(393), "2023-07-25 00:00:00");
		assert.ok(fs.existsSync(path.join(cacheDir, "gf-data-ch-gun.json")));
	} finally {
		globalThis.fetch = original;
	}
});

test("reuses the cache and never calls fetch when its recorded sha matches the pin", async () => {
	fs.writeFileSync(path.join(cacheDir, "gf-data-ch-gun.json"), JSON.stringify({ sha: PINNED_SHA, rows: sampleRows }));
	const original = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error("network should not be called when the cached sha matches");
	};
	try {
		const guns = await loadCnGuns({ cacheDir });
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
});

test("refetches when the cached file's recorded sha differs from the pin", async () => {
	fs.writeFileSync(path.join(cacheDir, "gf-data-ch-gun.json"), JSON.stringify({ sha: "stale-sha", rows: [] }));
	const original = globalThis.fetch;
	let called = false;
	globalThis.fetch = async () => {
		called = true;
		return { ok: true, status: 200, json: async () => sampleRows };
	};
	try {
		const guns = await loadCnGuns({ cacheDir });
		assert.equal(called, true);
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
});

test("a failed fetch is retried once, and a second failure rejects", async () => {
	const original = globalThis.fetch;
	const answers = [new TypeError("fetch failed"), { ok: true, status: 200, json: async () => sampleRows }];
	globalThis.fetch = async () => {
		const answer = answers.shift();
		if (answer instanceof Error) {
			throw answer;
		}
		return answer;
	};
	try {
		assert.equal((await loadCnGuns({ cacheDir, wait: async () => {} })).get(65), "2016-05-20 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
	fs.rmSync(path.join(cacheDir, "gf-data-ch-gun.json"));
	globalThis.fetch = async () => ({ ok: false, status: 502, statusText: "Bad Gateway", json: async () => ({}) });
	try {
		await assert.rejects(loadCnGuns({ cacheDir, wait: async () => {} }), /502/);
	} finally {
		globalThis.fetch = original;
	}
});
