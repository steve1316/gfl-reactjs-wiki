import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { parseEnRelease, parsePlayableUnit } from "../lib/iopwiki.mjs";
import { buildProfile, fillFromWikidata, indexPages, parseCountry, parseFaction, parseManufacturer, releaseFor } from "../lib/profile.mjs";

const hk416 = { title: "HK416", wikitext: fs.readFileSync("tools/data/test/fixtures/iopwiki-hk416.wikitext", "utf8") };
const beowulf = { title: "Beowulf", wikitext: fs.readFileSync("tools/data/test/fixtures/iopwiki-beowulf.wikitext", "utf8") };
const dorothy = { title: "Dorothy", wikitext: fs.readFileSync("tools/data/test/fixtures/iopwiki-dorothy.wikitext", "utf8") };

/** The release every test profile below uses when release is not what the test is about. */
const UNKNOWN = { date: null, precision: "unknown" };

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Field splitting

test("faction strips links and spoilers, splits on commas and slashes, and drops empty and repeated entries", () => {
	assert.deepEqual(parseFaction("[[Squad 404]]"), ["Squad 404"]);
	assert.deepEqual(parseFaction("[[AR Team]], [[Griffin & Kryuger]], {{spoiler|[[DEFY]]}}"), ["AR Team", "Griffin & Kryuger"]);
	assert.deepEqual(parseFaction("AR Team / DEFY, AR Team,"), ["AR Team", "DEFY"]);
	assert.deepEqual(parseFaction(undefined), []);
});

test("manufacturer treats None, N/A, Unknown and empty as missing", () => {
	for (const value of ["None", "none", "N/A", "Unknown", "", undefined]) {
		assert.deepEqual(parseManufacturer(value), [], String(value));
	}
});

test("manufacturer splits on commas, semicolons, spaced slashes, line breaks and ', and', dropping 'others' and 'various' fragments", () => {
	assert.deepEqual(parseManufacturer("Tula, Izhevsk, Remington Arms Company, and many others"), ["Tula", "Izhevsk", "Remington Arms Company"]);
	assert.deepEqual(parseManufacturer("Rheinmetall, and various other licensed manufacturers."), ["Rheinmetall"]);
	assert.deepEqual(parseManufacturer("The Birmingham Small Arms Company Limited, unnamed others manufacturers"), ["The Birmingham Small Arms Company Limited"]);
	assert.deepEqual(parseManufacturer("Heckler & Koch / FABARM; Colt"), ["Heckler & Koch", "FABARM", "Colt"]);
	assert.deepEqual(parseManufacturer("Steyr Mannlicher\nThales Australia\nSME Ordnance"), ["Steyr Mannlicher", "Thales Australia", "SME Ordnance"]);
	assert.deepEqual(parseManufacturer('Heckler & Koch<ref name="hk">[[wikipedia:Heckler_%26_Koch|Heckler & Koch]]</ref>'), ["Heckler & Koch"]);
});

test("manufacturer keeps names that hold 'and', an unspaced slash, a company suffix or a comma in brackets whole", () => {
	assert.deepEqual(parseManufacturer("Main Missile and Artillery Directorate (GRAU)"), ["Main Missile and Artillery Directorate (GRAU)"]);
	assert.deepEqual(parseManufacturer("Izhmash/Kalashnikov Concern"), ["Izhmash/Kalashnikov Concern"]);
	assert.deepEqual(parseManufacturer("Springfield Armory, Smith Enterprise, Inc, Dornaus & Dixon Enterprises, Inc."), [
		"Springfield Armory",
		"Smith Enterprise, Inc",
		"Dornaus & Dixon Enterprises, Inc."
	]);
	assert.deepEqual(parseManufacturer("Industrias Nacionais de Defesa, EP (INDEP)"), ["Industrias Nacionais de Defesa, EP (INDEP)"]);
	assert.deepEqual(parseManufacturer("ST Kinetics (previously known as CIS, Chartered Industries of Singapore)"), ["ST Kinetics (previously known as CIS, Chartered Industries of Singapore)"]);
});

test("manufacturer spells 'Heckler and Koch' as 'Heckler & Koch' instead of splitting it", () => {
	assert.deepEqual(parseManufacturer("Heckler and Koch"), ["Heckler & Koch"]);
});

test("country splits only on commas and slashes, keeping 'and', '&' and bracketed qualifiers inside a name", () => {
	assert.deepEqual(parseCountry("Germany"), ["Germany"]);
	assert.deepEqual(parseCountry("Belgium/United States"), ["Belgium", "United States"]);
	assert.deepEqual(parseCountry("United States / Belgium, United States"), ["United States", "Belgium"]);
	assert.deepEqual(parseCountry("Bosnia and Herzegovina"), ["Bosnia and Herzegovina"]);
	assert.deepEqual(parseCountry("Trinidad & Tobago"), ["Trinidad & Tobago"]);
	assert.deepEqual(parseCountry("Germany (Weimar Republic)"), ["Germany (Weimar Republic)"]);
	assert.deepEqual(parseCountry('Germany<ref name="hk"/>'), ["Germany"]);
	assert.deepEqual(parseCountry(""), []);
});

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Release precision

test("a US date that differs from CN is a day-precision Global date", () => {
	assert.deepEqual(releaseFor("2023-07-25 00:00:00", "2022-01-10 00:00:00", { year: 2024, month: 9 }), { date: "2023-07-25", precision: "day" });
});

test("a doll missing from the CN table never gets day precision from its US date, falling through to the EN month, launch or unknown", () => {
	assert.deepEqual(releaseFor("2019-08-06 00:00:00", undefined, { year: 2019, month: 8 }), { date: "2019-08", precision: "month" });
	assert.deepEqual(releaseFor("1970-01-01 08:00:00", undefined, null), { date: "2018-05", precision: "launch" });
	assert.deepEqual(releaseFor("2019-08-06 00:00:00", undefined, null), UNKNOWN);
});

test("a US date copied from CN falls back to the IOPWiki EN month, zero-padded", () => {
	const enRelease = parseEnRelease(parsePlayableUnit(beowulf.wikitext).releasedon);
	assert.deepEqual(releaseFor("2023-07-25 00:00:00", "2023-07-25 00:00:00", enRelease), { date: "2024-09", precision: "month" });
	assert.deepEqual(releaseFor("2023-12-06 00:00:00", "2023-12-06 12:00:00", { year: 2024, month: 8 }), { date: "2024-08", precision: "month" });
});

test("the 1970 placeholder is the Global launch month when IOPWiki has no EN month", () => {
	assert.deepEqual(releaseFor("1970-01-01 08:00:00", "1970-01-01 08:00:00", null), { date: "2018-05", precision: "launch" });
	assert.deepEqual(releaseFor("1970-01-01 08:00:00", "2016-05-20 00:00:00", null), { date: "2018-05", precision: "launch" });
});

test("a copied CN date with no EN month, a 2030 placeholder or no US row at all is unknown", () => {
	assert.deepEqual(releaseFor("2025-01-01 00:00:00", "2025-01-01 00:00:00", null), UNKNOWN);
	assert.deepEqual(releaseFor("2030-12-31 00:00:00", "2020-01-01 00:00:00", null), UNKNOWN);
	assert.deepEqual(releaseFor(undefined, "2017-11-16 00:00:00", null), UNKNOWN);
});

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Profiles

test("pages are indexed by their numeric doll index, skipping pages with none", () => {
	const pages = indexPages([hk416, dorothy, { title: "K7", wikitext: "{{PlayableUnit\n|index = \n|nationality = Republic of Korea}}" }]);
	assert.deepEqual([...pages.keys()], [65, 1019]);
	assert.equal(pages.get(65).title, "HK416");
});

test("two pages with the same doll index fail loudly", () => {
	assert.throws(() => indexPages([hk416, { title: "HK416 copy", wikitext: hk416.wikitext }]), /65/);
});

test("HK416's profile comes from its IOPWiki page", () => {
	const page = indexPages([hk416]).get(65);
	assert.deepEqual(buildProfile(page, { date: "2018-05", precision: "launch" }), {
		faction: ["Squad 404"],
		manufacturer: ["Heckler & Koch"],
		country: ["Germany"],
		release: { date: "2018-05", precision: "launch" },
		fullName: "Heckler & Koch HK416",
		iopwikiTitle: "HK416",
		sources: ["iopwiki"]
	});
});

test("a collab doll keeps its franchise as the country and has no manufacturer", () => {
	const profile = buildProfile(indexPages([dorothy]).get(1019), UNKNOWN);
	assert.deepEqual(profile.country, ["VA-11 Hall-A"]);
	assert.deepEqual(profile.manufacturer, []);
	assert.deepEqual(profile.sources, ["iopwiki"]);
});

test("a doll with no page gets empty fields, a null title and no sources", () => {
	assert.deepEqual(buildProfile(undefined, UNKNOWN), {
		faction: [],
		manufacturer: [],
		country: [],
		release: UNKNOWN,
		fullName: null,
		iopwikiTitle: null,
		sources: []
	});
});

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Wikidata fallback

test("Wikidata fills only the empty fields and adds its source", () => {
	const profile = { ...buildProfile(undefined, UNKNOWN), country: ["Germany"], sources: ["iopwiki"] };
	const filled = fillFromWikidata(profile, { manufacturer: ["Carl Walther GmbH", "Mauser"], country: ["Nazi Germany"] }, []);
	assert.deepEqual(filled.manufacturer, ["Carl Walther GmbH", "Mauser"]);
	assert.deepEqual(filled.country, ["Germany"]);
	assert.deepEqual(filled.sources, ["iopwiki", "wikidata"]);
});

test("Wikidata labels that are flags or the gun's own name are ignored, and nothing usable leaves the profile alone", () => {
	const profile = { ...buildProfile(undefined, UNKNOWN), sources: ["iopwiki"] };
	const filled = fillFromWikidata(profile, { manufacturer: ["Walther P38"], country: ["flag of Nazi Germany", "Nazi Germany", "Nazi Germany"] }, ["P38", "Walther P38"]);
	assert.deepEqual(filled.manufacturer, []);
	assert.deepEqual(filled.country, ["Nazi Germany"]);
	assert.deepEqual(filled.sources, ["iopwiki", "wikidata"]);
	assert.deepEqual(fillFromWikidata(profile, { manufacturer: ["walther p38"], country: ["Flag of Germany"] }, ["Walther P38"]), profile);
	assert.deepEqual(fillFromWikidata(profile, undefined, []), profile);
});
