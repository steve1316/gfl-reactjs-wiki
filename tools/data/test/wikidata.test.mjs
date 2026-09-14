import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { fetchWikidataFacts } from "../lib/wikidata.mjs";

const sample = JSON.parse(fs.readFileSync("tools/data/test/fixtures/wikidata-sample.json", "utf8"));
const CACHE_FILE = path.resolve("tools/data/.cache/wikidata.json");

test.beforeEach(() => {
	fs.rmSync(CACHE_FILE, { force: true });
});

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

/**
 * Replace global fetch with a stub that always answers the same raw response shape, `ok`/`status` included.
 *
 * @param {{ ok: boolean, status: number, statusText?: string, body: object }} response The response to answer with.
 * @returns {() => void} Restores the original global fetch.
 */
function stubFetchRaw(response) {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: response.ok, status: response.status, statusText: response.statusText ?? "", json: async () => response.body });
	return () => {
		globalThis.fetch = original;
	};
}

test("resolves manufacturer and country labels for a found title, and skips a missing one", async () => {
	const restore = stubFetch([sample.entitiesResponse, sample.labelsResponse]);
	try {
		const facts = await fetchWikidataFacts(["Test Rifle", "Unknown Weapon"], { delayMs: 0 });
		assert.deepEqual(facts.get("Test Rifle"), { manufacturer: ["Test Arms Co"], country: ["Testland"] });
		assert.equal(facts.has("Unknown Weapon"), false);
	} finally {
		restore();
	}
});

test("WIKIDATA_CACHE=reuse reads the cache file and never calls fetch", async () => {
	fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
	fs.writeFileSync(CACHE_FILE, JSON.stringify({ "Cached Rifle": { manufacturer: ["Cached Co"], country: ["Cacheland"] } }));
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

test("rejects with the API's error code when Wikidata answers 200 with an error body", async () => {
	const restore = stubFetchRaw({ ok: true, status: 200, body: { error: { code: "no-such-entity", info: "Could not find such an entity" } } });
	try {
		await assert.rejects(fetchWikidataFacts(["Anything"], { delayMs: 0 }), /no-such-entity/);
	} finally {
		restore();
	}
});

test("rejects when Wikidata answers with an HTTP 500", async () => {
	const restore = stubFetchRaw({ ok: false, status: 500, statusText: "Internal Server Error", body: {} });
	try {
		await assert.rejects(fetchWikidataFacts(["Anything"], { delayMs: 0 }));
	} finally {
		restore();
	}
});

test("rejects when the response has no entities object", async () => {
	const restore = stubFetchRaw({ ok: true, status: 200, body: { success: 1 } });
	try {
		await assert.rejects(fetchWikidataFacts(["Anything"], { delayMs: 0 }), /entities/);
	} finally {
		restore();
	}
});

test("joins results back to the requested title across a case difference and a redirect", async () => {
	const entitiesResponse = {
		normalized: { n: { from: "Tommy gun", to: "Thompson submachine gun" } },
		entities: {
			Q1: {
				id: "Q1",
				claims: { P176: [{ mainsnak: { datavalue: { value: { id: "Q10" } } } }], P495: [{ mainsnak: { datavalue: { value: { id: "Q11" } } } }] },
				// Sitelink title differs only in case from the requested "walther p38" - resolved via the loose fallback match.
				sitelinks: { enwiki: { site: "enwiki", title: "Walther P38" } }
			},
			Q2: {
				id: "Q2",
				claims: { P176: [{ mainsnak: { datavalue: { value: { id: "Q12" } } } }], P495: [] },
				// Sitelink title is a real redirect target, unrelated by spelling - resolved via `normalized`.
				sitelinks: { enwiki: { site: "enwiki", title: "Thompson submachine gun" } }
			}
		}
	};
	const labelsResponse = {
		entities: {
			Q10: { id: "Q10", labels: { en: { value: "Carl Walther GmbH" } } },
			Q11: { id: "Q11", labels: { en: { value: "Germany" } } },
			Q12: { id: "Q12", labels: { en: { value: "Auto-Ordnance Company" } } }
		}
	};
	const restore = stubFetch([entitiesResponse, labelsResponse]);
	try {
		const facts = await fetchWikidataFacts(["walther p38", "Tommy gun"], { delayMs: 0 });
		assert.deepEqual(facts.get("walther p38"), { manufacturer: ["Carl Walther GmbH"], country: ["Germany"] });
		assert.deepEqual(facts.get("Tommy gun"), { manufacturer: ["Auto-Ordnance Company"], country: [] });
	} finally {
		restore();
	}
});
