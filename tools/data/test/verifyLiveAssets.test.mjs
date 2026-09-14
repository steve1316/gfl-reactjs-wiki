import assert from "node:assert/strict";
import { test } from "node:test";

import { atlasPageNames, candidateUrls, join, sampleByTier, seededRandom } from "../../assets/verify_live_assets.mjs";

const rig = (skel, atlas = skel) => ({ skel, atlas, anims: ["wait"] });

const manifest = {
	version: 3,
	equipment: [5, 12],
	dolls: {
		65: {
			normal: { images: ["card", "card_damaged", "full", "full_damaged"] },
			mod: { images: ["card", "full"] },
			skins: { 805: { images: ["card", "full_damaged"], modImages: ["card_damaged"] }, "legacy-band": { images: ["full"] } },
			skills: ["skill1", "skill2"]
		}
	}
};

const spineIndex = { 65: { combat: rig("HK416"), dorm: rig("RHK416", "HK416"), mod: { combat: rig("mod/HK416Mod") }, skins: { 805: { combat: rig("skins/805/HK416_805") } } } };

test("URLs are derived per tier on the right host", () => {
	const tiers = candidateUrls(manifest, spineIndex, "https://a.test/assets/", "https://b.test/art");
	assert.deepEqual(tiers.manifest, ["https://a.test/assets/assets-manifest.json"]);
	assert.equal(tiers.cards.length, 4);
	assert.ok(tiers.cards.includes("https://a.test/assets/tdolls/65/skins/805/card.webp"));
	assert.deepEqual(tiers.modCards, ["https://a.test/assets/tdolls/65/skins/805/mod_card_d.webp"]);
	assert.ok(tiers.full.includes("https://b.test/art/tdolls/65/skins/legacy-band/full.webp"));
	assert.equal(tiers.full.length, 5);
	assert.deepEqual(tiers.skills, ["https://a.test/assets/tdolls/65/skill1.png", "https://a.test/assets/tdolls/65/skill2.png"]);
	assert.deepEqual(tiers.equipment, ["https://a.test/assets/equipment/5.png", "https://a.test/assets/equipment/12.png"]);
	assert.equal(tiers.spineSkel.length, 4);
	assert.deepEqual(tiers.spineAtlas, ["https://a.test/assets/spine/65/HK416.atlas", "https://a.test/assets/spine/65/mod/HK416Mod.atlas", "https://a.test/assets/spine/65/skins/805/HK416_805.atlas"]);
});

test("join encodes each path segment like the site", () => {
	assert.equal(join("https://x.test/", "spine/1/a b#.skel"), "https://x.test/spine/1/a%20b%23.skel");
});

test("atlas page names are read from the atlas text", () => {
	assert.deepEqual(atlasPageNames("\nHK416.png\nsize: 512,512\nformat: RGBA8888\nhead\n  rotate: false\nHK416_2.PNG\n"), ["HK416.png", "HK416_2.PNG"]);
});

test("the same seed gives the same sample and a different seed usually does not", () => {
	const tiers = { a: Array.from({ length: 50 }, (_, i) => `a${i}`), b: Array.from({ length: 80 }, (_, i) => `b${i}`) };
	assert.deepEqual(sampleByTier(tiers, 20, 42), sampleByTier(tiers, 20, 42));
	assert.notDeepEqual(sampleByTier(tiers, 20, 42), sampleByTier(tiers, 20, 43));
	assert.deepEqual(Array.from({ length: 3 }, seededRandom(7)), Array.from({ length: 3 }, seededRandom(7)));
});

test("the sample covers every tier, has no repeats, and gives small tiers' spare share to large ones", () => {
	const tiers = { one: ["x"], few: ["f1", "f2", "f3"], empty: [], many: Array.from({ length: 500 }, (_, i) => `m${i}`) };
	const sample = sampleByTier(tiers, 200, 1);
	assert.equal(sample.length, 200);
	const counts = Object.fromEntries(["one", "few", "many"].map((tier) => [tier, sample.filter((entry) => entry.tier === tier).length]));
	assert.deepEqual(counts, { one: 1, few: 3, many: 196 });
	assert.equal(new Set(sample.map((entry) => entry.url)).size, 200);
});

test("a sample larger than every URL takes them all", () => {
	const tiers = { a: ["a1", "a2"], b: ["b1"] };
	assert.equal(sampleByTier(tiers, 200, 9).length, 3);
});
