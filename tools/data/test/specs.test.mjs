import { test } from "node:test";
import assert from "node:assert/strict";

import { parseSpecs, specsFor } from "../lib/specs.mjs";

/**
 * Lay out one spec row the way upstream does: the label padded to the value column, then each continuation line indented to it.
 *
 * @param {string} label Row label.
 * @param {string[]} lines The first value line, then its continuation lines.
 * @returns {string} Sheet text for the row, blank lines between lines as upstream writes them.
 */
function sheetRow(label, lines) {
	return lines.map((line, index) => (index === 0 ? label.padEnd(27) : " ".repeat(27)) + line).join("\n\n");
}

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

test("a line ending in a comma runs on into its continuation with a space, keeping the comma", () => {
	const text = "Cartridge                  .45 Colt, .44-40 WCF,\n                           .32-20 WCF";
	assert.deepEqual(parseSpecs(text), [{ label: "Cartridge", value: ".45 Colt, .44-40 WCF, .32-20 WCF" }]);
});

test("wrapped prose rejoins with spaces while list lines stay separated (doll 53)", () => {
	const crew = sheetRow("Crew", [
		"Two; rifle breaks down into two parts for ",
		"transport and fits into two backpacks",
		"weighing 15kg each, one containing the weapon ",
		"receiver section, while the other contains the ",
		"barrel and ammunition"
	]);
	const feed = sheetRow("Feed system", ["3-round detachable box magazine ", "(20 x 82mm and 14.5 x 114mm)", "Single shot (20 x 110mm)"]);
	assert.deepEqual(parseSpecs(`${crew}\n\n${feed}`), [
		{
			label: "Crew",
			value: "Two; rifle breaks down into two parts for transport and fits into two backpacks weighing 15kg each, one containing the weapon receiver section, while the other contains the barrel and ammunition"
		},
		{ label: "Feed system", value: "3-round detachable box magazine (20 x 82mm and 14.5 x 114mm); Single shot (20 x 110mm)" }
	]);
});

test("a wrapped parenthetical rejoins, and a separate cartridge stays its own item (doll 34)", () => {
	const cartridge = sheetRow("Cartridge", [
		".30-06 Springfield (7.62x63mm)",
		"7.62x51mm NATO (.308 Winchester) ",
		"(Used by the U.S. Navy and some commercial",
		"companies to modernize the M1 and",
		"increase performance)"
	]);
	const sights = sheetRow("Sights", ["Rear sight: adjustable aperture", "front sight: wing protected post"]);
	assert.deepEqual(parseSpecs(`${cartridge}\n\n${sights}`), [
		{
			label: "Cartridge",
			value: ".30-06 Springfield (7.62x63mm); 7.62x51mm NATO (.308 Winchester); (Used by the U.S. Navy and some commercial companies to modernize the M1 and increase performance)"
		},
		{ label: "Sights", value: "Rear sight: adjustable aperture; front sight: wing protected post" }
	]);
});

test("measurement lines stay separate unless the line above breaks off mid-phrase (doll 18)", () => {
	const text = sheetRow("Length", [
		"269 mm (10.7 inches) with stock removed",
		"548 mm (1 foot 9.6 inches) with stock extended",
		"545 mm (1 foot 9.45 inches) with stock retracted",
		"w/suppressor",
		"798 mm (2 feet 7.4 inches) with stock extended with",
		"suppressor"
	]);
	assert.deepEqual(parseSpecs(text), [
		{
			label: "Length",
			value: "269 mm (10.7 inches) with stock removed; 548 mm (1 foot 9.6 inches) with stock extended; 545 mm (1 foot 9.45 inches) with stock retracted w/suppressor; 798 mm (2 feet 7.4 inches) with stock extended with suppressor"
		}
	]);
});

test("a short lowercase line after a complete item starts a new item, and a sentence tail rejoins (dolls 98 and 55)", () => {
	const range = sheetRow("Effective firing range", [
		"in air, 15 to 20 metres",
		"in water,",
		"17 metres (56 ft) at depth of 5 metres (16 ft);",
		"11 metres (36 ft) at depth of 20 metres (66 ft);",
		"6 metres (20 ft) at depth of 40 metres (130 ft)"
	]);
	const feed = sheetRow("Feed system", ["30-round box magazine or other STANAG magazines.", "Other magazines with different ", "capacities also available."]);
	assert.deepEqual(parseSpecs(`${range}\n\n${feed}`), [
		{
			label: "Effective firing range",
			value: "in air, 15 to 20 metres; in water, 17 metres (56 ft) at depth of 5 metres (16 ft); 11 metres (36 ft) at depth of 20 metres (66 ft); 6 metres (20 ft) at depth of 40 metres (130 ft)"
		},
		{ label: "Feed system", value: "30-round box magazine or other STANAG magazines. Other magazines with different capacities also available." }
	]);
});

test("a known two-word label split across the gap is rejoined (doll 19)", () => {
	const text = "Barrel                     length 168 mm\n\nMuzzle                     velocity 380 m/s\n\nBarrels                    1";
	assert.deepEqual(parseSpecs(text), [
		{ label: "Barrel length", value: "168 mm" },
		{ label: "Muzzle velocity", value: "380 m/s" },
		{ label: "Barrels", value: "1" }
	]);
});

test("Title Case labels are sentence-cased, keeping acronyms and bracketed words (dolls 230 and 268)", () => {
	const text = [
		"Rate of Fire: Semi automatic",
		"Max Effective Range: 800 meters",
		"Barrel Length              660mm",
		"Overall Length             Unfolded: 1180mm| Folded: 920mm",
		"Action Type                Bolt Action",
		"G28 E2 (Standard): PMII 3-20x50"
	].join("\n");
	assert.deepEqual(
		parseSpecs(text).map((row) => row.label),
		["Rate of fire", "Max effective range", "Barrel length", "Overall length", "Action type", "G28 E2 (Standard)"]
	);
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
		{ label: "Feed system", value: "20-round detachable box magazine (experimental 25-round magazine)" },
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
		{ label: "Magazine capacity", value: "10 or 20 rounds" }
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
