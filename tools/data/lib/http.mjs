// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** How long one request may take before it is abandoned. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Wait before the retry when the server gives no usable `Retry-After`. */
const DEFAULT_RETRY_WAIT_MS = 5_000;

/** Longest `Retry-After` honoured, so a server asking for an hour does not stall the importer. */
const MAX_RETRY_WAIT_MS = 60_000;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Fetching

/**
 * Wait for a number of milliseconds.
 *
 * @param {number} ms Milliseconds to wait.
 * @returns {Promise<void>} Resolves after the delay.
 */
export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Work out how long to wait before retrying a response, from its `Retry-After` header in seconds.
 *
 * @param {{ headers?: { get?: (name: string) => string | null } }} response The response that asked for a retry.
 * @returns {number} Milliseconds to wait, capped at `MAX_RETRY_WAIT_MS`.
 */
function retryWaitFor(response) {
	const header = response.headers?.get?.("retry-after");
	const seconds = header && /^\d+$/.test(header.trim()) ? Number(header.trim()) : null;
	return seconds === null ? DEFAULT_RETRY_WAIT_MS : Math.min(seconds * 1000, MAX_RETRY_WAIT_MS);
}

/**
 * Fetch a URL with a per-request timeout, retrying once on a network error, a timeout, a 429 or a 5xx.
 *
 * The retry waits for the response's `Retry-After` (in seconds, capped) or `DEFAULT_RETRY_WAIT_MS`. A second network error is thrown,
 * and a second bad status is returned for the caller's own `ok` check, so a failure is still loud.
 *
 * @param {string} url URL to fetch.
 * @param {RequestInit} [init] Fetch options, such as headers. Any `signal` is replaced by the timeout.
 * @param {object} [options] Options.
 * @param {(ms: number) => Promise<void>} [options.wait] Waits before the retry. Tests pass a stub so they do not sleep.
 * @returns {Promise<Response>} The last attempt's response.
 * @throws {Error} When the retry also fails with a network error or a timeout.
 */
export async function fetchWithRetry(url, init = {}, { wait = sleep } = {}) {
	const attempt = () => fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
	let response;
	try {
		response = await attempt();
	} catch (error) {
		console.warn(`warning: ${url} failed (${error.message}), retrying once`);
		await wait(DEFAULT_RETRY_WAIT_MS);
		return attempt();
	}
	if (response.status !== 429 && response.status < 500) {
		return response;
	}
	const delay = retryWaitFor(response);
	console.warn(`warning: ${url} answered ${response.status}, retrying once in ${delay} ms`);
	await wait(delay);
	return attempt();
}
