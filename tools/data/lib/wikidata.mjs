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

/** Where resolved facts are cached, keyed by enwiki title. Git-ignored. */
const CACHE_FILE = path.resolve("tools/data/.cache/wikidata.json");

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
	return response.json();
}

/**
 * Resolve a batch of enwiki titles to their QID and P176/P495 item-id claims.
 *
 * Deviation from the plan: `props=claims` alone does not say which returned QID answers which requested
 * title when several titles are batched together, since a found entity is keyed only by its QID. Adding
 * `sitelinks` (restricted to `enwiki` via `sitefilter`) gives back each entity's own enwiki title so the
 * batch can be split apart again. Verified live against the real API.
 *
 * @param {string[]} titles Up to `BATCH_SIZE` enwiki titles.
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Item-id claims per title.
 */
async function resolveClaims(titles) {
	const body = await callWikidata(
		new URLSearchParams({
			sites: "enwiki",
			titles: titles.join("|"),
			props: "claims|sitelinks",
			sitefilter: "enwiki"
		})
	);
	const claimsByTitle = new Map();
	for (const entity of Object.values(body.entities ?? {})) {
		const title = entity.sitelinks?.enwiki?.title;
		if (!title || !entity.claims) {
			continue;
		}
		const idsFor = (property) => (entity.claims[property] ?? []).map((claim) => claim.mainsnak?.datavalue?.value?.id).filter((id) => typeof id === "string");
		claimsByTitle.set(title, { manufacturer: idsFor(MANUFACTURER_PROPERTY), country: idsFor(COUNTRY_PROPERTY) });
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
 * sequential and at least a second apart. Results are cached to `tools/data/.cache/wikidata.json` keyed by
 * title. Set `WIKIDATA_CACHE=reuse` to read that cache back for the requested titles without touching the
 * network (titles missing from the cache are simply omitted); the default always refetches and rewrites the
 * cache, merged with whatever was already there.
 *
 * @param {string[]} titles Enwiki article titles to resolve.
 * @returns {Promise<Map<string, { manufacturer: string[], country: string[] }>>} Manufacturer and country
 *   labels per title. A title with no Wikidata item, or no claims, is omitted.
 */
export async function fetchWikidataFacts(titles) {
	const uniqueTitles = [...new Set(titles)];
	const cached = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};
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
			await sleep(REQUEST_DELAY_MS);
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
	fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
	fs.writeFileSync(CACHE_FILE, JSON.stringify(cached));
	return facts;
}
