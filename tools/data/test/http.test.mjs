import { test } from "node:test";
import assert from "node:assert/strict";

import { fetchWithRetry } from "../lib/http.mjs";

/**
 * Replace global fetch with a stub that plays back a fixed sequence of outcomes, in call order.
 *
 * @param {({ status: number, retryAfter?: string } | Error)[]} outcomes One response or thrown error per expected call.
 * @returns {{ calls: () => number, restore: () => void }} The call count and a restore function.
 */
function stubFetch(outcomes) {
	const original = globalThis.fetch;
	let call = 0;
	globalThis.fetch = async (url, init) => {
		assert.ok(init.signal instanceof AbortSignal, "every request carries a timeout signal");
		const outcome = outcomes[call];
		call++;
		if (!outcome) {
			throw new Error(`unexpected extra fetch call: ${url}`);
		}
		if (outcome instanceof Error) {
			throw outcome;
		}
		return { ok: outcome.status < 400, status: outcome.status, headers: new Headers(outcome.retryAfter ? { "Retry-After": outcome.retryAfter } : {}) };
	};
	return {
		calls: () => call,
		restore: () => {
			globalThis.fetch = original;
		}
	};
}

test("a 503 with Retry-After is retried once after that many seconds, then succeeds", async () => {
	const stub = stubFetch([{ status: 503, retryAfter: "2" }, { status: 200 }]);
	const waits = [];
	try {
		const response = await fetchWithRetry("https://example.test/a", {}, { wait: async (ms) => waits.push(ms) });
		assert.equal(response.status, 200);
		assert.equal(stub.calls(), 2);
		assert.deepEqual(waits, [2000]);
	} finally {
		stub.restore();
	}
});

test("a network error is retried once, and a huge Retry-After on a 429 is capped", async () => {
	const stub = stubFetch([new TypeError("fetch failed"), { status: 200 }]);
	const waits = [];
	try {
		assert.equal((await fetchWithRetry("https://example.test/b", {}, { wait: async (ms) => waits.push(ms) })).status, 200);
	} finally {
		stub.restore();
	}
	const capped = stubFetch([{ status: 429, retryAfter: "3600" }, { status: 200 }]);
	try {
		assert.equal((await fetchWithRetry("https://example.test/c", {}, { wait: async (ms) => waits.push(ms) })).status, 200);
	} finally {
		capped.restore();
	}
	assert.deepEqual(waits, [5000, 60000]);
});

test("a second network error is thrown and a second 5xx is returned for the caller to fail on", async () => {
	const stub = stubFetch([new TypeError("fetch failed"), new TypeError("fetch failed again")]);
	try {
		await assert.rejects(fetchWithRetry("https://example.test/d", {}, { wait: async () => {} }), /fetch failed again/);
		assert.equal(stub.calls(), 2);
	} finally {
		stub.restore();
	}
	const bad = stubFetch([{ status: 500 }, { status: 502 }]);
	try {
		assert.equal((await fetchWithRetry("https://example.test/e", {}, { wait: async () => {} })).status, 502);
	} finally {
		bad.restore();
	}
});

test("a 404 is returned at once without a retry", async () => {
	const stub = stubFetch([{ status: 404 }]);
	try {
		assert.equal((await fetchWithRetry("https://example.test/f", {}, { wait: async () => assert.fail("should not wait") })).status, 404);
		assert.equal(stub.calls(), 1);
	} finally {
		stub.restore();
	}
});
