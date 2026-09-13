import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { loadCnGuns } from "../lib/cnData.mjs";

const sampleRows = JSON.parse(fs.readFileSync("tools/data/test/fixtures/gf-data-ch-gun-sample.json", "utf8"));
const CACHE_FILE = path.resolve("tools/data/.cache/gf-data-ch-gun.json");
const PINNED_SHA = "77f0379cbc504753c864d1a9a6091bbfd0536215";

test.beforeEach(() => {
	fs.rmSync(CACHE_FILE, { force: true });
});

test("fetches gun.json at the pinned sha and maps id to launch_time", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => sampleRows });
	try {
		const guns = await loadCnGuns();
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
		assert.equal(guns.get(393), "2023-07-25 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
});

test("reuses the cache and never calls fetch when its recorded sha matches the pin", async () => {
	fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
	fs.writeFileSync(CACHE_FILE, JSON.stringify({ sha: PINNED_SHA, rows: sampleRows }));
	const original = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error("network should not be called when the cached sha matches");
	};
	try {
		const guns = await loadCnGuns();
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
});

test("refetches when the cached file's recorded sha differs from the pin", async () => {
	fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
	fs.writeFileSync(CACHE_FILE, JSON.stringify({ sha: "stale-sha", rows: [] }));
	const original = globalThis.fetch;
	let called = false;
	globalThis.fetch = async () => {
		called = true;
		return { ok: true, status: 200, json: async () => sampleRows };
	};
	try {
		const guns = await loadCnGuns();
		assert.equal(called, true);
		assert.equal(guns.get(65), "2016-05-20 00:00:00");
	} finally {
		globalThis.fetch = original;
	}
});
