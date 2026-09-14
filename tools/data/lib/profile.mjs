import { parsePlayableUnit, plainText } from "./iopwiki.mjs";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Global launch month, used for dolls whose US `launch_time` is the 1970 placeholder of the launch roster. */
const GLOBAL_LAUNCH_MONTH = "2018-05";

/** US `launch_time` placeholders that are not real dates: 1970 for the launch roster, 2030 for unreleased rows. */
const PLACEHOLDER_LAUNCH = /^(1970|2030)/;

/** Faction separators: a comma or a spaced slash. */
const FACTION_SEPARATOR = /\s*(?:,|\s\/\s)\s*/y;

/** Manufacturer separators: a comma (swallowing a following "and"), a semicolon or a spaced slash. */
const MANUFACTURER_SEPARATOR = /\s*(?:,(?:\s*and\s)?|;|\s\/\s)\s*/y;

/** Country separators: a comma, a slash, an ampersand or a spaced "and". */
const COUNTRY_SEPARATOR = /\s*(?:[,/&]|\sand\s)\s*/y;

/** Values IOPWiki uses for "no manufacturer". */
const MISSING_VALUE = /^(none|n\/a|unknown)\b/i;

/** Manufacturer fragments that are not maker names, such as "and many others" or "various". */
const NOT_A_MAKER = /\b(others?|various|numerous)\b/i;

/** A company suffix split away from its name by a comma, as in "Smith Enterprise, Inc" or "Defesa, EP (INDEP)". */
const COMPANY_SUFFIX = /^(inc|ltd|llc|co|corp|gmbh|plc|ep)\.?(\s*\([^)]*\))?$/i;

/** Wikidata labels that are not a country or maker name, such as "flag of Nazi Germany". */
const NOT_A_NAME = /^flag of\b/i;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Field splitting

/**
 * Reduce a raw IOPWiki field to plain text, treating a line break as a list separator.
 *
 * @param {string | undefined} raw Raw field value from `parsePlayableUnit`.
 * @returns {string} Plain text, with line breaks turned into commas.
 */
function fieldText(raw) {
	return plainText((raw ?? "").replace(/\s*\n\s*/g, ", "));
}

/**
 * Split text on a separator, ignoring separators inside brackets.
 *
 * @param {string} text Text to split.
 * @param {RegExp} separator Sticky regex matching one separator.
 * @returns {string[]} Trimmed, non-empty parts in order.
 */
function splitTopLevel(text, separator) {
	const parts = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (char === "(" || char === "[") {
			depth++;
		} else if ((char === ")" || char === "]") && depth > 0) {
			depth--;
		} else if (depth === 0) {
			separator.lastIndex = i;
			const match = separator.exec(text);
			if (match) {
				parts.push(text.slice(start, i));
				start = i + match[0].length;
				i = start - 1;
			}
		}
	}
	parts.push(text.slice(start));
	return parts.map((part) => part.trim()).filter(Boolean);
}

/**
 * Drop repeated entries, keeping the first of each.
 *
 * @param {string[]} values Values in order.
 * @returns {string[]} The values without repeats.
 */
function unique(values) {
	return [...new Set(values)];
}

/**
 * Parse IOPWiki's `faction` field.
 *
 * @param {string | undefined} raw Raw field value.
 * @returns {string[]} Faction names in page order.
 */
export function parseFaction(raw) {
	return unique(splitTopLevel(fieldText(raw), FACTION_SEPARATOR));
}

/**
 * Parse IOPWiki's `manufacturer` field. Missing values and fragments such as "and many others" are dropped, a company suffix
 * stays with its name, and "Heckler and Koch" is spelled the way the other pages spell it.
 *
 * @param {string | undefined} raw Raw field value.
 * @returns {string[]} Maker names in page order.
 */
export function parseManufacturer(raw) {
	const text = fieldText(raw).replace(/\bHeckler and Koch\b/g, "Heckler & Koch");
	const names = [];
	for (const part of splitTopLevel(text, MANUFACTURER_SEPARATOR)) {
		if (COMPANY_SUFFIX.test(part) && names.length > 0) {
			names[names.length - 1] = `${names.at(-1)}, ${part}`;
		} else if (!MISSING_VALUE.test(part) && !NOT_A_MAKER.test(part.replace(/\([^)]*\)/g, ""))) {
			names.push(part);
		}
	}
	return unique(names);
}

/**
 * Parse IOPWiki's `nationality` field. Collab dolls hold their franchise name here, which is kept as-is.
 *
 * @param {string | undefined} raw Raw field value.
 * @returns {string[]} Country names in page order.
 */
export function parseCountry(raw) {
	return unique(splitTopLevel(fieldText(raw), COUNTRY_SEPARATOR));
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Release date

/**
 * Work out a doll's Global release date and how precise it is.
 *
 * gf-data-us copies some CN dates, so its date only counts when it differs from gf-data-ch. Otherwise IOPWiki's EN month is
 * used, then the Global launch month for the 1970 launch-roster placeholder.
 *
 * @param {string | undefined} usLaunch gf-data-us `launch_time` for the base doll, or undefined when it has no row.
 * @param {string | undefined} cnLaunch gf-data-ch `launch_time` for the same id, or undefined when CN has no row.
 * @param {{ year: number, month: number } | null} enRelease IOPWiki's EN release year and month, from `parseEnRelease`.
 * @returns {{ date: string | null, precision: "day" | "month" | "launch" | "unknown" }} The release date at its precision.
 */
export function releaseFor(usLaunch, cnLaunch, enRelease) {
	if (usLaunch && !PLACEHOLDER_LAUNCH.test(usLaunch) && usLaunch.slice(0, 10) !== cnLaunch?.slice(0, 10)) {
		return { date: usLaunch.slice(0, 10), precision: "day" };
	}
	if (enRelease) {
		return { date: `${enRelease.year}-${String(enRelease.month).padStart(2, "0")}`, precision: "month" };
	}
	if (usLaunch?.startsWith("1970")) {
		return { date: GLOBAL_LAUNCH_MONTH, precision: "launch" };
	}
	return { date: null, precision: "unknown" };
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Profiles

/**
 * Parse IOPWiki doll pages and key them by the doll id in their `index` field. Pages with no numeric index are skipped.
 *
 * @param {{ title: string, wikitext: string }[]} pages Pages from `fetchIopwikiPages`.
 * @returns {Map<number, { title: string, fields: Record<string, string> }>} Parsed pages keyed by doll id.
 * @throws {Error} When two pages claim the same doll id.
 */
export function indexPages(pages) {
	const byId = new Map();
	for (const { title, wikitext } of pages) {
		const fields = parsePlayableUnit(wikitext);
		const index = fields?.index?.trim() ?? "";
		if (!/^\d+$/.test(index)) {
			continue;
		}
		const id = Number(index);
		if (byId.has(id)) {
			throw new Error(`IOPWiki pages "${byId.get(id).title}" and "${title}" both claim doll ${id}`);
		}
		byId.set(id, { title, fields });
	}
	return byId;
}

/**
 * Build a doll's profile from its IOPWiki page.
 *
 * @param {{ title: string, fields: Record<string, string> } | undefined} page The doll's parsed page, or undefined when it has none.
 * @param {{ date: string | null, precision: string }} release The doll's release, from `releaseFor`.
 * @returns {object} The profile in the site's raw shape.
 */
export function buildProfile(page, release) {
	if (!page) {
		return { faction: [], manufacturer: [], country: [], release, fullName: null, iopwikiTitle: null, sources: [] };
	}
	const { fields, title } = page;
	return {
		faction: parseFaction(fields.faction),
		manufacturer: parseManufacturer(fields.manufacturer),
		country: parseCountry(fields.nationality),
		release,
		fullName: plainText(fields.fullname ?? "") || null,
		iopwikiTitle: title,
		sources: ["iopwiki"]
	};
}

/**
 * Fill a profile's empty manufacturer and country from Wikidata. Flag labels and the gun's own names are ignored.
 *
 * @param {object} profile A profile from `buildProfile`.
 * @param {{ manufacturer: string[], country: string[] } | undefined} facts Wikidata labels for the doll's Wikipedia article.
 * @param {(string | null)[]} ownNames The doll's own names (doll name, full name, article title), which are never a maker or country.
 * @returns {object} A new profile with the filled fields and "wikidata" in `sources`, or the same profile when nothing was filled.
 */
export function fillFromWikidata(profile, facts, ownNames) {
	if (!facts) {
		return profile;
	}
	const own = new Set(ownNames.filter(Boolean).map((name) => name.toLowerCase()));
	const usable = (labels) => unique((labels ?? []).map((label) => label.trim()).filter((label) => label && !NOT_A_NAME.test(label) && !own.has(label.toLowerCase())));
	const filled = { ...profile };
	let used = false;
	for (const key of ["manufacturer", "country"]) {
		const labels = profile[key].length === 0 ? usable(facts[key]) : [];
		if (labels.length > 0) {
			filled[key] = labels;
			used = true;
		}
	}
	if (!used) {
		return profile;
	}
	filled.sources = unique([...profile.sources, "wikidata"]);
	return filled;
}
