import assert from "node:assert/strict";
import { test } from "node:test";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { atlasPageNames, candidateUrls, join, sampleByTier, seededRandom, uiImageNames } from "../../assets/verify_live_assets.mjs";

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
	},
	hocs: { 6: ["card", "full"] },
	fairies: { 3: ["form1", "form2", "form3"] },
	live2d: { fairies: { 3: ["form1", "form2"] }, hocs: { 6: ["model"] } }
};

const spineIndex = { 65: { combat: rig("HK416"), dorm: rig("RHK416", "HK416"), mod: { combat: rig("mod/HK416Mod") }, skins: { 805: { combat: rig("skins/805/HK416_805") } } } };

const hocSpineIndex = { 6: { combat: rig("QLZ04"), crew: [rig("QLZ04 A"), rig("QLZ04 B")] } };

test("URLs are derived per tier on the right host", () => {
	const tiers = candidateUrls(manifest, spineIndex, "https://a.test/assets/");
	assert.deepEqual(tiers.manifest, ["https://a.test/assets/assets-manifest.json"]);
	assert.equal(tiers.cards.length, 4);
	assert.ok(tiers.cards.includes("https://a.test/assets/tdolls/65/skins/805/card.webp"));
	assert.deepEqual(tiers.modCards, ["https://a.test/assets/tdolls/65/skins/805/mod_card_d.webp"]);
	assert.ok(tiers.full.includes("https://a.test/assets/tdolls/65/skins/legacy-band/full.webp"));
	assert.equal(tiers.full.length, 5);
	assert.deepEqual(tiers.skills, ["https://a.test/assets/tdolls/65/skill1.png", "https://a.test/assets/tdolls/65/skill2.png"]);
	assert.deepEqual(tiers.equipment, ["https://a.test/assets/equipment/5.png", "https://a.test/assets/equipment/12.png"]);
	assert.equal(tiers.spineSkel.length, 4);
	assert.deepEqual(tiers.spineAtlas, ["https://a.test/assets/spine/65/HK416.atlas", "https://a.test/assets/spine/65/mod/HK416Mod.atlas", "https://a.test/assets/spine/65/skins/805/HK416_805.atlas"]);
	assert.deepEqual(tiers.hocCards, ["https://a.test/assets/hocs/6/card.webp"]);
	assert.deepEqual(tiers.hocFull, ["https://a.test/assets/hocs/6/full.webp"]);
	assert.deepEqual(tiers.fairyForms, ["https://a.test/assets/fairies/3/form1.webp", "https://a.test/assets/fairies/3/form2.webp", "https://a.test/assets/fairies/3/form3.webp"]);
	assert.deepEqual(tiers.live2dFairies, ["https://a.test/assets/live2d/fairies/3/form1.model3.json", "https://a.test/assets/live2d/fairies/3/form2.model3.json"]);
	assert.deepEqual(tiers.live2dHocs, ["https://a.test/assets/live2d/hocs/6/model.model3.json"]);
});

test("HOC Spine URLs are derived on the asset host, with rig names URL-encoded", () => {
	const tiers = candidateUrls(manifest, spineIndex, "https://a.test/assets/", [], hocSpineIndex);
	assert.deepEqual(tiers.hocSpineSkel.sort(), [
		"https://a.test/assets/hoc-spine/6/QLZ04%20A.skel",
		"https://a.test/assets/hoc-spine/6/QLZ04%20B.skel",
		"https://a.test/assets/hoc-spine/6/QLZ04.skel"
	]);
	assert.deepEqual(tiers.hocSpineAtlas.sort(), [
		"https://a.test/assets/hoc-spine/6/QLZ04%20A.atlas",
		"https://a.test/assets/hoc-spine/6/QLZ04%20B.atlas",
		"https://a.test/assets/hoc-spine/6/QLZ04.atlas"
	]);
});

test("UI images are read from uiUrl calls and sampled on the asset host", () => {
	const src = fs.mkdtempSync(path.join(os.tmpdir(), "verify-ui-"));
	fs.mkdirSync(path.join(src, "pages", "home"), { recursive: true });
	fs.writeFileSync(path.join(src, "pages", "home", "home.tsx"), 'const a = uiUrl("mod.png");\nconst b = uiUrl( "logo name.jpg" );\n');
	fs.writeFileSync(path.join(src, "Navbar.ts"), 'const c = uiUrl(\'mod.png\'); const d = spineUrl(1, "x", "png");\n');
	fs.writeFileSync(path.join(src, "notes.md"), 'uiUrl("ignored.png")\n');
	try {
		const names = uiImageNames(src);
		assert.deepEqual(names, ["logo name.jpg", "mod.png"]);
		assert.deepEqual(candidateUrls(manifest, spineIndex, "https://a.test/assets/", names).ui, ["https://a.test/assets/logo%20name.jpg", "https://a.test/assets/mod.png"]);
		assert.deepEqual(candidateUrls(manifest, spineIndex, "https://a.test/assets/").ui, []);
	} finally {
		fs.rmSync(src, { recursive: true, force: true });
	}
});

test("the site's own UI images are all found", () => {
	assert.ok(uiImageNames("src").length >= 14);
});

test("join encodes each path segment like the site", () => {
	assert.equal(join("https://x.test/", "spine/1/a b#.skel"), "https://x.test/spine/1/a%20b%23.skel");
});

test("atlas page names are block-aware and skip a region named foo.png", () => {
	const atlas = [
		"HK416.png",
		"size: 2048,2048",
		"format: RGBA8888",
		"filter: Linear,Linear",
		"repeat: none",
		"foo.png",
		"  rotate: false",
		"  xy: 2, 2",
		"  size: 512, 512",
		"  orig: 512, 512",
		"  offset: 0, 0",
		"  index: -1",
		"",
		"HK416_2.PNG",
		"size: 1024,1024",
		"format: RGBA8888",
		"filter: Linear,Linear",
		"repeat: none",
		"bar",
		"  rotate: false",
		""
	].join("\n");
	assert.deepEqual(atlasPageNames(atlas), ["HK416.png", "HK416_2.PNG"]);
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
