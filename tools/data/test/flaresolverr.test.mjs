import { test } from "node:test";
import assert from "node:assert/strict";

import { createFlareSolverrClient, decodeEntities, jsonFromPage } from "../lib/flaresolverr.mjs";

test("decodeEntities decodes named and numeric entities once", () => {
	assert.equal(decodeEntities("&lt;br&gt; &amp;amp; &quot;x&quot; &#39;y&#39; &#x41;"), `<br> &amp; "x" 'y' A`);
	assert.equal(decodeEntities("&unknown; stays"), "&unknown; stays");
});

test("jsonFromPage reads the JSON a browser wraps in <pre>, and plain JSON as-is", () => {
	const page = `<html><head><meta charset="utf-8"></head><body><pre>{"text":"&lt;ref&gt;A &amp;amp; B&lt;/ref&gt;"}</pre></body></html>`;
	assert.deepEqual(jsonFromPage(page), { text: "<ref>A &amp; B</ref>" });
	assert.deepEqual(jsonFromPage(`{"a":1}`), { a: 1 });
});

/**
 * Build a fake FlareSolverr endpoint that records every command it receives.
 *
 * @param {(payload: object) => object} answer Returns the JSON body for one command.
 * @returns {{ calls: object[], fetchImpl: Function }} The recorded commands and a fetch stand-in.
 */
function fakeSolver(answer) {
	const calls = [];
	const fetchImpl = async (url, init) => {
		const payload = JSON.parse(init.body);
		calls.push({ url, payload });
		return { json: async () => answer(payload) };
	};
	return { calls, fetchImpl };
}

test("createFlareSolverrClient opens one session, reuses it for every request and destroys it on close", async () => {
	const { calls, fetchImpl } = fakeSolver((payload) =>
		payload.cmd === "request.get" ? { status: "ok", solution: { status: 200, response: `<pre>{"ok":true}</pre>` } } : { status: "ok", session: "s1" }
	);
	const client = await createFlareSolverrClient("http://localhost:8191/", { fetchImpl });
	const response = await client.get("https://iopwiki.com/api.php?a=1");
	assert.equal(response.ok, true);
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { ok: true });
	await client.close();
	assert.deepEqual(
		calls.map((call) => [call.url, call.payload.cmd, call.payload.session]),
		[
			["http://localhost:8191/v1", "sessions.create", undefined],
			["http://localhost:8191/v1", "request.get", "s1"],
			["http://localhost:8191/v1", "sessions.destroy", "s1"]
		]
	);
	assert.equal(calls[1].payload.url, "https://iopwiki.com/api.php?a=1");
});

test("createFlareSolverrClient rejects with FlareSolverr's message when a request fails", async () => {
	const { fetchImpl } = fakeSolver((payload) => (payload.cmd === "request.get" ? { status: "error", message: "Error: Challenge not solved" } : { status: "ok", session: "s1" }));
	const client = await createFlareSolverrClient("http://localhost:8191", { fetchImpl });
	await assert.rejects(client.get("https://iopwiki.com/api.php"), /FlareSolverr request\.get failed: Error: Challenge not solved/);
});
