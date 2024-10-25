import { sleep } from "./http.mjs";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** How long FlareSolverr may take to load one page, challenge included. */
const MAX_TIMEOUT_MS = 90_000;

/** Extra time the HTTP call to FlareSolverr itself gets on top of its own page timeout. */
const CALL_MARGIN_MS = 30_000;

/** Wait before the retry when a FlareSolverr request fails. */
const RETRY_WAIT_MS = 5_000;

/** Named entities a browser writes when it serialises text inside a page. */
const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Page decoding

/**
 * Decode the HTML entities a browser writes into serialised text, in one pass so `&amp;lt;` becomes `&lt;` and not `<`.
 *
 * @param {string} text Serialised text.
 * @returns {string} The text with named and numeric entities decoded. Unknown named entities are left as they are.
 */
export function decodeEntities(text) {
	return text.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (whole, name) => {
		if (name[0] !== "#") {
			return NAMED_ENTITIES[name] ?? whole;
		}
		const code = name[1] === "x" || name[1] === "X" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
		return Number.isNaN(code) ? whole : String.fromCodePoint(code);
	});
}

/**
 * Read the JSON body out of the page FlareSolverr returns. A browser shows a JSON response as text inside `<pre>`, so the page's `<pre>`
 * content is decoded and parsed. A body with no `<pre>` is parsed as it is.
 *
 * @param {string} page The page HTML or raw body from FlareSolverr's `solution.response`.
 * @returns {unknown} The parsed JSON.
 * @throws {SyntaxError} When the content is not JSON.
 */
export function jsonFromPage(page) {
	const match = /<pre[^>]*>([\s\S]*)<\/pre>/i.exec(page);
	return JSON.parse(match ? decodeEntities(match[1]) : page);
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Client

/**
 * Open a FlareSolverr browser session for a run of requests.
 *
 * IOPWiki's Cloudflare challenges datacenter addresses such as GitHub's runners, so the scheduled refresh loads its API pages in a real
 * browser instead. One session keeps the solved challenge for every request of the run.
 *
 * @param {string} endpoint FlareSolverr's base URL, such as `http://localhost:8191`.
 * @param {object} [options] Options.
 * @param {typeof fetch} [options.fetchImpl] Fetch used to call FlareSolverr. Tests pass a fake.
 * @param {(ms: number) => Promise<void>} [options.wait] Waits before a retry. Tests pass a stub so they do not sleep.
 * @returns {Promise<{ get: (url: string) => Promise<{ ok: boolean, status: number, statusText: string, json: () => Promise<unknown> }>, close: () => Promise<void> }>}
 *   A client whose `get` retries once on a thrown FlareSolverr error or a 429/5xx solution status, and whose `close` destroys the session.
 * @throws {Error} When FlareSolverr cannot create the session.
 */
export async function createFlareSolverrClient(endpoint, { fetchImpl = fetch, wait = sleep } = {}) {
	const url = `${endpoint.replace(/\/$/, "")}/v1`;
	const call = async (payload) => {
		const response = await fetchImpl(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(MAX_TIMEOUT_MS + CALL_MARGIN_MS)
		});
		const body = await response.json();
		if (body.status !== "ok") {
			throw new Error(`FlareSolverr ${payload.cmd} failed: ${body.message ?? "no message"}`);
		}
		return body;
	};
	const { session } = await call({ cmd: "sessions.create" });
	const request = async (target) => {
		const { solution } = await call({ cmd: "request.get", url: target, session, maxTimeout: MAX_TIMEOUT_MS });
		return {
			ok: solution.status >= 200 && solution.status < 300,
			status: solution.status,
			statusText: "via FlareSolverr",
			json: async () => jsonFromPage(solution.response)
		};
	};
	return {
		async get(target) {
			let response;
			try {
				response = await request(target);
			} catch (error) {
				console.warn(`warning: FlareSolverr request for ${target} failed (${error.message}), retrying once`);
				await wait(RETRY_WAIT_MS);
				return request(target);
			}
			if (response.status !== 429 && response.status < 500) {
				return response;
			}
			console.warn(`warning: FlareSolverr request for ${target} failed (status ${response.status}), retrying once`);
			await wait(RETRY_WAIT_MS);
			return request(target);
		},
		async close() {
			await call({ cmd: "sessions.destroy", session });
		}
	};
}
