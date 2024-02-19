import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { fetchIopwikiPages, parseEnRelease, parsePlayableUnit, plainText, wikipediaTitle } from "../lib/iopwiki.mjs";

const hk416 = fs.readFileSync("tools/data/test/fixtures/iopwiki-hk416.wikitext", "utf8");
const beowulf = fs.readFileSync("tools/data/test/fixtures/iopwiki-beowulf.wikitext", "utf8");
const dorothy = fs.readFileSync("tools/data/test/fixtures/iopwiki-dorothy.wikitext", "utf8");

// Only the fetchIopwikiPages tests below touch a cache directory. Each gets its own throwaway one, never
// the real tools/data/.cache the importer uses.
let cacheDir;

test.beforeEach(() => {
	cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "gfl-iopwiki-test-"));
});

test.afterEach(() => {
	fs.rmSync(cacheDir, { recursive: true, force: true });
});

test("parses HK416's index, faction, manufacturer and nationality", () => {
	const fields = parsePlayableUnit(hk416);
	assert.equal(fields.index, "65");
	assert.equal(plainText(fields.faction), "Squad 404");
	assert.equal(plainText(fields.manufacturer), "Heckler & Koch");
	assert.equal(plainText(fields.nationality), "Germany");
});

test("nested {{artist name|...}} templates and their pipes do not split the artist parameter or hide the next one", () => {
	const fields = parsePlayableUnit(hk416);
	assert.match(fields.artist, /NIXOO/);
	assert.match(fields.artist, /White Negroni/);
	assert.equal(fields.fullname, "Heckler & Koch HK416");
});

test("a [[wikipedia:Title|text]] link inside a <ref> still resolves as the doll's Wikipedia title", () => {
	const fields = parsePlayableUnit(hk416);
	assert.equal(wikipediaTitle(fields), "Heckler & Koch HK416");
});

test("returns null when the wikitext has no PlayableUnit template", () => {
	assert.equal(parsePlayableUnit("Just some prose, no template here."), null);
});

test("Beowulf's EN release parses to year 2024, month 9", () => {
	const fields = parsePlayableUnit(beowulf);
	assert.deepEqual(parseEnRelease(fields.releasedon), { year: 2024, month: 9 });
});

test("a releasedon with no EN year or month parses to null", () => {
	const fields = parsePlayableUnit(hk416);
	assert.equal(parseEnRelease(fields.releasedon), null);
});

test("parses a collab doll (Dorothy), including an empty parameter", () => {
	const fields = parsePlayableUnit(dorothy);
	assert.equal(fields.index, "1019");
	assert.equal(fields.classification, "SMG");
	assert.equal(fields.rarity, "EXTRA");
	assert.equal(fields.voiceactor, "");
});

test("plainText drops a {{spoiler|...}} template, keeping the rest of the value", () => {
	const value = "Unknown Manufacturer\n{{spoiler|Modified into a T-Doll by [[Dier]]}}";
	assert.equal(plainText(value), "Unknown Manufacturer");
});

test("plainText removes <ref>...</ref> and self-closing <ref .../> tags", () => {
	assert.equal(plainText("Germany<ref>[[wikipedia:Foo|bar]]</ref>"), "Germany");
	assert.equal(plainText('Text<ref name="x" />More'), "TextMore");
});

test("plainText resolves [[a|b]] to b and [[a]] to a", () => {
	assert.equal(plainText("[[Griffin & Kryuger]]"), "Griffin & Kryuger");
	assert.equal(plainText("[[wikipedia:Kar98k|Wikipedia entry]]"), "Wikipedia entry");
});

test("plainText resolves another template's last positional argument, when it is plain text", () => {
	assert.equal(plainText("{{artist name|NIXOO}}"), "NIXOO");
	assert.equal(plainText("{{doll_server_alias|server=EN|alias=416}}"), "");
});

test("plainText turns <br/> into a comma-space and strips other HTML tags", () => {
	assert.equal(plainText("A<br/>B"), "A, B");
	assert.equal(plainText('<div class="spoiler">Neural Upgrade</div>'), "Neural Upgrade");
});

test("plainText decodes HTML entities and collapses whitespace", () => {
	assert.equal(plainText("Smith &amp; Wesson"), "Smith & Wesson");
	assert.equal(plainText("A&nbsp;&nbsp;B   C"), "A B C");
});

test("wikipediaTitle normalises underscores to spaces", () => {
	const fields = { weaponinfo: "See [[wikipedia:Karabiner_98k|Kar98k]] for details." };
	assert.equal(wikipediaTitle(fields), "Karabiner 98k");
});

test("wikipediaTitle returns null when no field has a wikipedia link", () => {
	assert.equal(wikipediaTitle({ nationality: "Germany", faction: "[[Squad 404]]" }), null);
});

test("an HTML comment between two real parameters (as on the Beowulf fixture) does not corrupt either field", () => {
	const fields = parsePlayableUnit(beowulf);
	assert.equal(fields.max_hp, "121");
	assert.equal(fields.min_dmg, "23");
	assert.equal(fields.fix_min, undefined);
	assert.equal(fields.fix_max, undefined);
	for (const value of Object.values(fields)) {
		assert.doesNotMatch(value, /<!--/);
	}
});

test("a comment containing pipes and braces is stripped before parameter splitting, not treated as syntax", () => {
	const wikitext = "{{PlayableUnit\n|a=1<!-- comment | with {{braces}} and a pipe -->\n|b=2}}";
	assert.deepEqual(parsePlayableUnit(wikitext), { a: "1", b: "2" });
});

test("plainText strips HTML comments, including a multi-line one with an embedded >", () => {
	assert.equal(plainText("Before <!-- hidden --> After"), "Before After");
	assert.equal(plainText("Before <!-- a\nmulti-line > comment --> After"), "Before After");
});

test("fetchIopwikiPages rejects with the API's error code when IOPWiki answers 200 with an error body", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ error: { code: "badtitle", info: "Bad title" } }) });
	try {
		await assert.rejects(fetchIopwikiPages({ cacheDir }), /badtitle/);
	} finally {
		globalThis.fetch = original;
	}
});

test("fetchIopwikiPages rejects when IOPWiki answers with an HTTP 500", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: false, status: 500, statusText: "Internal Server Error", json: async () => ({}) });
	try {
		await assert.rejects(fetchIopwikiPages({ cacheDir }));
	} finally {
		globalThis.fetch = original;
	}
});

test("fetchIopwikiPages rejects when the response has no query object", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ batchcomplete: true }) });
	try {
		await assert.rejects(fetchIopwikiPages({ cacheDir }), /query/);
	} finally {
		globalThis.fetch = original;
	}
});

test("fetchIopwikiPages writes its cache under the given cacheDir, not the real tools/data/.cache", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = async () => ({
		ok: true,
		status: 200,
		json: async () => ({ query: { pages: [{ title: "Test", revisions: [{ slots: { main: { content: "{{PlayableUnit|index=1}}" } } }] }] } })
	});
	try {
		const pages = await fetchIopwikiPages({ cacheDir });
		assert.deepEqual(pages, [{ title: "Test", wikitext: "{{PlayableUnit|index=1}}" }]);
		assert.ok(fs.existsSync(path.join(cacheDir, "iopwiki-pages.json")));
	} finally {
		globalThis.fetch = original;
	}
});
