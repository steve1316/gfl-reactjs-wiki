import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { fetchWikidataFacts } from "../lib/wikidata.mjs";

const sample = JSON.parse(fs.readFileSync("tools/data/test/fixtures/wikidata-sample.json", "utf8"));

/**
 * Replace global fetch with a stub that answers a fixed sequence of JSON bodies, in call order.
 *
 * @param {object[]} responses One response body per expected fetch call.
 * @returns {() => void} Restores the original global fetch.
 */
function stubFetch(responses) {
	const original = globalThis.fetch;
	let call = 0;
	globalThis.fetch = async (url) => {
		const body = responses[call];
		call++;
		if (!body) {
			throw new Error(`unexpected extra fetch call: ${url}`);
		}
		return { ok: true, status: 200, json: async () => body };
	};
	return () => {
		globalThis.fetch = original;
	};
}

test("resolves manufacturer and country labels for a found title, and skips a missing one", async () => {
	const restore = stubFetch([sample.entitiesResponse, sample.labelsResponse]);
	try {
		const facts = await fetchWikidataFacts(["Test Rifle", "Unknown Weapon"]);
		assert.deepEqual(facts.get("Test Rifle"), { manufacturer: ["Test Arms Co"], country: ["Testland"] });
		assert.equal(facts.has("Unknown Weapon"), false);
	} finally {
		restore();
	}
});

test("WIKIDATA_CACHE=reuse reads the cache file and never calls fetch", async () => {
	const cacheFile = path.resolve("tools/data/.cache/wikidata.json");
	fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
	fs.writeFileSync(cacheFile, JSON.stringify({ "Cached Rifle": { manufacturer: ["Cached Co"], country: ["Cacheland"] } }));
	const original = globalThis.fetch;
	globalThis.fetch = async () => {
		throw new Error("network should not be called in reuse mode");
	};
	process.env.WIKIDATA_CACHE = "reuse";
	try {
		const facts = await fetchWikidataFacts(["Cached Rifle"]);
		assert.deepEqual(facts.get("Cached Rifle"), { manufacturer: ["Cached Co"], country: ["Cacheland"] });
	} finally {
		delete process.env.WIKIDATA_CACHE;
		globalThis.fetch = original;
	}
});
