import { test } from "node:test";
import assert from "node:assert/strict";

import { findMarkup } from "../lib/markup.mjs";

test("spec text may hold inches and a less-than sign, but not wiki links, templates or bold", () => {
	assert.equal(findMarkup("16.5'' (419 mm)", "spec"), null);
	assert.equal(findMarkup("<1 MOA", "spec"), null);
	assert.equal(findMarkup("'''Bold'''", "spec"), "'''");
	assert.equal(findMarkup("[[Link]]", "spec"), "[[");
	assert.equal(findMarkup("{{cite}}", "spec"), "{{");
});

test("profile text rejects italics and HTML as well", () => {
	assert.equal(findMarkup("''Italic''", "profile"), "''");
	assert.equal(findMarkup("A<br/>B", "profile"), "<");
	assert.equal(findMarkup("Heckler & Koch", "profile"), null);
});

test("any undecoded named or numeric entity is found in both kinds, but a bare ampersand or a one-letter name before a joiner is not", () => {
	assert.equal(findMarkup("Smith &amp; Wesson", "profile"), "&amp;");
	assert.equal(findMarkup("7.62&times;39mm", "spec"), "&times;");
	assert.equal(findMarkup("Kitty&#39;s", "spec"), "&#39;");
	assert.equal(findMarkup("&Eacute;tienne", "profile"), "&Eacute;");
	assert.equal(findMarkup(".40 S&W; .45 ACP", "spec"), null);
	assert.equal(findMarkup("AT & T", "spec"), null);
});
