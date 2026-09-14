import { test } from "node:test";
import assert from "node:assert/strict";

import { parseSpecs, specsFor } from "../lib/specs.mjs";

test("label rows split on a 2+ space gap, blank lines are skipped and indented lines continue the row", () => {
	const text = [
		"Type                       Assault rifle",
		"",
		"Length                     690 mm (27.2 in) stock extended ",
		"",
		"                           560 mm (22.0 in) stock collapsed",
		"Cartridge                  5.56x45mm NATO"
	].join("\n");
	assert.deepEqual(parseSpecs(text), [
		{ label: "Type", value: "Assault rifle" },
		{ label: "Length", value: "690 mm (27.2 in) stock extended; 560 mm (22.0 in) stock collapsed" },
		{ label: "Cartridge", value: "5.56x45mm NATO" }
	]);
});

test("Mass, Calibre and Feed are renamed to Weight, Caliber and Feed system", () => {
	const text = "Mass                       7.3 kg\nCalibre                    .303 British\nFeed                       10-round magazine";
	assert.deepEqual(
		parseSpecs(text).map((row) => row.label),
		["Weight", "Caliber", "Feed system"]
	);
});

test("labels and values have whitespace collapsed, including non-breaking spaces and a trailing colon", () => {
	const text = "Rate\u00a0of\u00a0fire       600 rounds/min   \nWeight:        2   kg";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Rate of fire", value: "600 rounds/min" },
		{ label: "Weight", value: "2 kg" }
	]);
});

test("a trailing comma is dropped before a continuation is joined", () => {
	const text = "Cartridge                  .45 Colt, .44-40 WCF,\n                           .32-20 WCF";
	assert.deepEqual(parseSpecs(text), [{ label: "Cartridge", value: ".45 Colt, .44-40 WCF; .32-20 WCF" }]);
});

test("a label alone on its line takes its value from the indented lines below it", () => {
	const text = "Type\n\n                       Battle rifle\n\nFeed system \n\n                       20-round box\n\n                       50-round drum";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Type", value: "Battle rifle" },
		{ label: "Feed system", value: "20-round box; 50-round drum" }
	]);
});

test("a line that does not look like a label continues the row above, even when indented lines follow", () => {
	const text = "Sights                     Rear flip aperture\n513 mm (20.2 in) sight radius\n                           Optical sights";
	assert.deepEqual(parseSpecs(text), [{ label: "Sights", value: "Rear flip aperture; 513 mm (20.2 in) sight radius; Optical sights" }]);
});

test("a value ending in a colon joins its continuation with a space", () => {
	const text = "Feed system                Detachable box magazine; capacities:\n                           15 rounds (9x19mm)\n                           20 rounds";
	assert.deepEqual(parseSpecs(text), [{ label: "Feed system", value: "Detachable box magazine; capacities: 15 rounds (9x19mm); 20 rounds" }]);
});

test("an unindented line with no label gap continues the row above it", () => {
	const text = "Feed system                20-round detachable box magazine\n\n(experimental 25-round magazine)\n\nSights                     Iron sights";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Feed system", value: "20-round detachable box magazine; (experimental 25-round magazine)" },
		{ label: "Sights", value: "Iron sights" }
	]);
});

test("a known label glued to its value, or followed by one space, still starts a row", () => {
	const text = "Muzzle velocity        327 m/s\n\nEffective firing range50 yds (46 m) \n\nRate of fire 500-600 rounds/min";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Muzzle velocity", value: "327 m/s" },
		{ label: "Effective firing range", value: "50 yds (46 m)" },
		{ label: "Rate of fire", value: "500-600 rounds/min" }
	]);
});

test("a capitalised 'Label: value' line starts a row, a lowercase one continues the row above", () => {
	const text = "Sights                     Rear: notched\nfront: fixed blade\nMagazine Capacity: 10 or 20 rounds";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Sights", value: "Rear: notched; front: fixed blade" },
		{ label: "Magazine Capacity", value: "10 or 20 rounds" }
	]);
});

test("empty text and rows with no value give no rows", () => {
	assert.deepEqual(parseSpecs(""), []);
	assert.deepEqual(parseSpecs("   \n\n"), []);
	assert.deepEqual(parseSpecs("Type\nWeight                     3 kg"), [{ label: "Weight", value: "3 kg" }]);
});

test("specsFor falls back to the base text only when the form's own text has no rows", () => {
	const base = "Type                       Rifle";
	assert.deepEqual(specsFor("", base), [{ label: "Type", value: "Rifle" }]);
	assert.deepEqual(specsFor("Type                       Carbine", base), [{ label: "Type", value: "Carbine" }]);
	assert.deepEqual(specsFor("", ""), []);
});
