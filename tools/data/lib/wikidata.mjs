import fs from "node:fs";
import path from "node:path";

import { fetchWithRetry, sleep } from "./http.mjs";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Wikidata's API endpoint. */
const API_BASE = "https://www.wikidata.org/w/api.php";

/** Identifies this importer to Wikidata. */
const USER_AGENT = "gfl-archive-importer/1.0 (https://github.com/steve1316/gfl-archive)";

/** Minimum gap between sequential Wikidata requests, matching IOPWiki's politeness convention. */
const REQUEST_DELAY_MS = 1000;

/** `wbgetentities` accepts at most this many titles or ids in one call. */
const BATCH_SIZE = 50;

/** Manufacturer property. */
const MANUFACTURER_PROPERTY = "P176";

/** Country of origin property. */
const COUNTRY_PROPERTY = "P495";

/** Where resolved facts are cached by default, keyed by enwiki title. Git-ignored. Overridable via `options.cacheDir`. */
const DEFAULT_CACHE_DIR = path.resolve("tools/data/.cache");

/** Cache file name inside whichever cache directory is in effect. */
const CACHE_FILENAME = "wikidata.json";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Fetching

/**
 * Split a list into chunks of at most `size` items.
 *
 * @param {unknown[]} items Items to split.
 * @param {number} size Maximum chunk size.
 * @returns {unknown[][]} The chunks, in order.
 */
function chunk(items, size) {
	const chunks = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

/**
 * Call `action=wbgetentities` and return its parsed JSON body. The request times out and is retried once, see `fetchWithRetry`.
 *
 * @param {URLSearchParams} params Query parameters, `action` excluded.
 * @param {(ms: number) => Promise<void>} wait Waits before a retry.
 * @returns {Promise<object>} The response body.
 */
async function callWikidata(params, wait) {
	const query = new URLSearchParams({ action: "wbgetentities", format: "json", ...Object.fromEntries(params) });
	const response = await fetchWithRetry(`${API_BASE}?${query.toString()}`, { headers: { "User-Agent": USER_AGENT } }, { wait });
	if (!response.ok) {
		throw new Error(`Wikidata API request failed: ${response.status} ${response.statusText}`);
	}
	const body = await response.json();
	if (body.error) {
		throw new Error(`Wikidata API error ${body.error.code ?? "unknown"}: ${body.error.info ?? JSON.stringify(body.error)}`);
	}
	if (!body.entities) {
		throw new Error(`Wikidata API response is missing "entities": ${JSON.stringify(body)}`);
	}
	return body;
}

/**
 * Reduce a title to a loose, case- and underscore-insensitive form for matching two spellings of the same
 * page title against each other.
 *
 * @param {string} title A page title.
 * @returns {string} The title, lowercased, with underscores turned into spaces, and trimmed.
 */
function looseTitleKey(title) {
	return title.toLowerCase().replaceAll("_", " ").trim();
}

/**
 * Build a map from every title Wikidata actually resolved (the request as normalised, and again as
 * redirected) back to the title we originally asked for.
 *
 * `wbgetentities` reports both steps as `{from, to}` pairs under `normalized` (MediaWiki title
 * normalisation, e.g. case or spacing) and `redirects` (page redirects), each keyed by an arbitrary index
 * rather than the title itself. Chaining both lets a heavily-redirected title (e.g. requesting "Tommy gun"
 * and getting back the "Thompson submachine gun" article) still resolve to the title we asked for.
 *
 * @param {object} body The `wbgetentities` response body.
 * @param {string[]} requestedTitles Titles as passed to `resolveClaims`.
 * @returns {Map<string, string>} Resolved title (as it appears in `entity.sitelinks.enwiki.title`) to
 *   requested title.
 */
function buildTitleMap(body, requestedTitles) {
	const resolvedToRequested = new Map(requestedTitles.map((title) => [title, title]));
	for (const key of ["normalized", "redirects"]) {
		for (const step of Object.values(body[key] ?? {})) {
			const requested = resolvedToRequested.get(step.from);
			if (requested !== undefined) {
				resolvedToRequested.set(step.to, requested);
			}
		}
	}
	return resolvedToRequested;
}

/**
 * Resolve a batch of enwiki titles to their QID and P176/P495 item-id claims.
 *
 * Deviation from the plan: `props=claims` alone does not say which returned QID answers which requested
 * title when several titles are batched together, since a found entity is keyed only by its QID. Adding
 * `sitelinks` (restricted to `enwiki` via `sitefilter`) gives back each entity's own enwiki title so the
 * batch can be split apart again. Verified live against the real API.
 *
 * That resolved sitelink title can still differ from what was requested (case or underscores), which would
 * otherwise silently drop the doll and poison the reuse cache under the wrong key. Any `normalized` or
 * `redirects` steps the response reports are resolved via `buildTitleMap`, and a case/underscore-insensitive
 * match against the request list is the fallback. `normalize=1` is not sent: Wikidata rejects it with
 * `params-illegal` unless exactly one title is given. A batched title that is an enwiki page redirect comes
 * back missing, so that doll gets no Wikidata facts.
 *
 * @param {string[]} titles Up to `BATCH_SIZE` enwiki titles.
 * @param {(ms: number) => Promise<void>} wait Waits before a retry.
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Item-id claims keyed by the
 *   requested title (not necessarily the resolved sitelink title).
 */
async function resolveClaims(titles, wait) {
	const body = await callWikidata(
		new URLSearchParams({
			sites: "enwiki",
			titles: titles.join("|"),
			props: "claims|sitelinks",
			sitefilter: "enwiki",
			redirects: "yes"
		}),
		wait
	);
	const titleMap = buildTitleMap(body, titles);
	const looseTitles = new Map(titles.map((title) => [looseTitleKey(title), title]));
	const claimsByTitle = new Map();
	for (const entity of Object.values(body.entities ?? {})) {
		const resolvedTitle = entity.sitelinks?.enwiki?.title;
		if (!resolvedTitle || !entity.claims) {
			continue;
		}
		const requestedTitle = titleMap.get(resolvedTitle) ?? looseTitles.get(looseTitleKey(resolvedTitle)) ?? resolvedTitle;
		const idsFor = (property) => (entity.claims[property] ?? []).map((claim) => claim.mainsnak?.datavalue?.value?.id).filter((id) => typeof id === "string");
		claimsByTitle.set(requestedTitle, { manufacturer: idsFor(MANUFACTURER_PROPERTY), country: idsFor(COUNTRY_PROPERTY) });
	}
	return claimsByTitle;
}

/**
 * Resolve a batch of Wikidata item ids to their English label.
 *
 * @param {string[]} ids Up to `BATCH_SIZE` QIDs.
 * @param {(ms: number) => Promise<void>} wait Waits before a retry.
 * @returns {Promise<Map<string, string>>} English label per id, omitting ids with no English label.
 */
async function resolveLabels(ids, wait) {
	const body = await callWikidata(new URLSearchParams({ ids: ids.join("|"), props: "labels", languages: "en" }), wait);
	const labels = new Map();
	for (const [id, entity] of Object.entries(body.entities ?? {})) {
		const label = entity.labels?.en?.value;
		if (label) {
			labels.set(id, label);
		}
	}
	return labels;
}

/**
 * Resolve manufacturer and country of origin for a set of enwiki titles via Wikidata.
 *
 * Two rounds of batched `wbgetentities` calls: the first resolves each title to its P176 (manufacturer) and P495 (country of origin) item
 * ids, the second resolves those item ids to English labels. Requests are sequential, at least a second apart, and retried once on a network
 * error, 429 or 5xx. Results are cached to `tools/data/.cache/wikidata.json` (or `options.cacheDir`) keyed by title, including titles that
 * yielded no facts, so a reuse run can tell "no facts" from "never fetched". Set `WIKIDATA_CACHE=reuse` to read that cache back without
 * touching the network. It fails when the cache file is missing or a requested title was never fetched. The default always refetches and
 * rewrites the cache, merged with whatever was already there.
 *
 * @param {string[]} titles Enwiki article titles to resolve.
 * @param {object} [options] Options.
 * @param {string} [options.cacheDir] Directory the cache file lives in, instead of `tools/data/.cache`.
 *   Tests must set this, so they never touch the real cache the importer relies on.
 * @param {(ms: number) => Promise<void>} [options.wait] Waits between requests and before a retry. Tests pass a stub so they do not sleep.
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Manufacturer and country
 *   labels for every requested title. A title with no Wikidata item, or no claims, has empty lists.
 * @throws {Error} In reuse mode, when the cache file is missing or does not hold a requested title.
 */
export async function fetchWikidataFacts(titles, { cacheDir = DEFAULT_CACHE_DIR, wait = sleep } = {}) {
	const cacheFile = path.join(cacheDir, CACHE_FILENAME);
	const uniqueTitles = [...new Set(titles)];
	if (process.env.WIKIDATA_CACHE === "reuse" && !fs.existsSync(cacheFile)) {
		throw new Error(`WIKIDATA_CACHE=reuse but there is no cache file at ${cacheFile}. Run once without it to fetch from Wikidata.`);
	}
	const cached = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
	if (process.env.WIKIDATA_CACHE === "reuse") {
		const unfetched = uniqueTitles.filter((title) => !Object.hasOwn(cached, title));
		if (unfetched.length > 0) {
			throw new Error(`WIKIDATA_CACHE=reuse but ${cacheFile} was never fetched for: ${unfetched.join(", ")}. Run once without it.`);
		}
		return new Map(uniqueTitles.map((title) => [title, cached[title]]));
	}

	// One shared flag across both call phases below, so requests to Wikidata stay at least a second apart
	// end to end, without an unnecessary wait before the very first call.
	let first = true;
	const pause = async () => {
		if (!first) {
			await wait(REQUEST_DELAY_MS);
		}
		first = false;
	};

	const claimsByTitle = new Map();
	for (const titleBatch of chunk(uniqueTitles, BATCH_SIZE)) {
		await pause();
		for (const [title, claims] of await resolveClaims(titleBatch, wait)) {
			claimsByTitle.set(title, claims);
		}
	}

	const itemIds = new Set();
	for (const claims of claimsByTitle.values()) {
		claims.manufacturer.forEach((id) => itemIds.add(id));
		claims.country.forEach((id) => itemIds.add(id));
	}
	const labels = new Map();
	for (const idBatch of chunk([...itemIds], BATCH_SIZE)) {
		await pause();
		for (const [id, label] of await resolveLabels(idBatch, wait)) {
			labels.set(id, label);
		}
	}

	const facts = new Map();
	for (const title of uniqueTitles) {
		const claims = claimsByTitle.get(title) ?? { manufacturer: [], country: [] };
		const manufacturer = claims.manufacturer.map((id) => labels.get(id)).filter((label) => Boolean(label));
		const country = claims.country.map((id) => labels.get(id)).filter((label) => Boolean(label));
		facts.set(title, { manufacturer, country });
		cached[title] = { manufacturer, country };
	}
	fs.mkdirSync(cacheDir, { recursive: true });
	fs.writeFileSync(cacheFile, JSON.stringify(cached));
	return facts;
}
