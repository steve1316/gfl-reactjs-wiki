import fs from "node:fs";
import path from "node:path";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Wikidata's API endpoint. */
const API_BASE = "https://www.wikidata.org/w/api.php";

/** Identifies this importer to Wikidata. */
const USER_AGENT = "gfl-reactjs-wiki-importer/1.0 (https://github.com/steve1316/gfl-reactjs-wiki)";

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
 * Wait before the next polite, sequential request.
 *
 * @param {number} ms Milliseconds to wait.
 * @returns {Promise<void>} Resolves after the delay.
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

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
 * Call `action=wbgetentities` and return its parsed JSON body.
 *
 * @param {URLSearchParams} params Query parameters, `action` excluded.
 * @returns {Promise<object>} The response body.
 */
async function callWikidata(params) {
	const query = new URLSearchParams({ action: "wbgetentities", format: "json", ...Object.fromEntries(params) });
	const response = await fetch(`${API_BASE}?${query.toString()}`, { headers: { "User-Agent": USER_AGENT } });
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
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Item-id claims keyed by the
 *   requested title (not necessarily the resolved sitelink title).
 */
async function resolveClaims(titles) {
	const body = await callWikidata(
		new URLSearchParams({
			sites: "enwiki",
			titles: titles.join("|"),
			props: "claims|sitelinks",
			sitefilter: "enwiki",
			redirects: "yes"
		})
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
 * @returns {Promise<Map<string, string>>} English label per id, omitting ids with no English label.
 */
async function resolveLabels(ids) {
	const body = await callWikidata(new URLSearchParams({ ids: ids.join("|"), props: "labels", languages: "en" }));
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
 * Two rounds of batched `wbgetentities` calls: the first resolves each title to its P176 (manufacturer)
 * and P495 (country of origin) item ids, the second resolves those item ids to English labels. Requests are
 * sequential and at least a second apart. Results are cached to `tools/data/.cache/wikidata.json` (or
 * `options.cacheDir`) keyed by title. Set `WIKIDATA_CACHE=reuse` to read that cache back for the requested
 * titles without touching the network (titles missing from the cache are simply omitted); the default
 * always refetches and rewrites the cache, merged with whatever was already there.
 *
 * @param {string[]} titles Enwiki article titles to resolve.
 * @param {object} [options] Options.
 * @param {number} [options.delayMs] Milliseconds between requests, overriding `REQUEST_DELAY_MS`. Exists so
 *   tests can skip the real wait; real callers should leave this at its default.
 * @param {string} [options.cacheDir] Directory the cache file lives in, instead of `tools/data/.cache`.
 *   Tests must set this, so they never touch the real cache the importer relies on.
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Manufacturer and country
 *   labels per title. A title with no Wikidata item, or no claims, is omitted.
 */
export async function fetchWikidataFacts(titles, { delayMs = REQUEST_DELAY_MS, cacheDir = DEFAULT_CACHE_DIR } = {}) {
	const cacheFile = path.join(cacheDir, CACHE_FILENAME);
	const uniqueTitles = [...new Set(titles)];
	const cached = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
	if (process.env.WIKIDATA_CACHE === "reuse") {
		const facts = new Map();
		for (const title of uniqueTitles) {
			if (cached[title]) {
				facts.set(title, cached[title]);
			}
		}
		return facts;
	}

	// One shared flag across both call phases below, so requests to Wikidata stay at least a second apart
	// end to end, without an unnecessary wait before the very first call.
	let first = true;
	const wait = async () => {
		if (!first) {
			await sleep(delayMs);
		}
		first = false;
	};

	const claimsByTitle = new Map();
	for (const titleBatch of chunk(uniqueTitles, BATCH_SIZE)) {
		await wait();
		for (const [title, claims] of await resolveClaims(titleBatch)) {
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
		await wait();
		for (const [id, label] of await resolveLabels(idBatch)) {
			labels.set(id, label);
		}
	}

	const facts = new Map();
	for (const [title, claims] of claimsByTitle) {
		const manufacturer = claims.manufacturer.map((id) => labels.get(id)).filter((label) => Boolean(label));
		const country = claims.country.map((id) => labels.get(id)).filter((label) => Boolean(label));
		facts.set(title, { manufacturer, country });
		cached[title] = { manufacturer, country };
	}
	fs.mkdirSync(cacheDir, { recursive: true });
	fs.writeFileSync(cacheFile, JSON.stringify(cached));
	return facts;
}
