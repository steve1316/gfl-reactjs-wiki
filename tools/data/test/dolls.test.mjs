import { test } from "node:test";
import assert from "node:assert/strict";

import { buildDoll, productionOf, selectReleased, splitDetails } from "../lib/dolls.mjs";
import fs from "node:fs";

import { addExtraSkins, buildSkins, findSkinArtGaps, validateExtraSkins } from "../lib/skins.mjs";
import { readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const ctx = { config: readStatConfig(upstream), warnings: [] };

test("release filter keeps 450 dolls on 2026-09-13 and drops NPCs and future dolls", () => {
	const ids = selectReleased(upstream, "2026-09-13").map((gun) => gun.id);
	assert.equal(ids.length, 450);
	assert.ok(!ids.includes(424) && !ids.includes(9001) && !ids.includes(20065));
	assert.ok(ids.includes(423) && ids.includes(1046));
});

test("HK416 assembles with its Mod, skins in skin-id order", () => {
	const gun = upstream.stc("gun").find((row) => row.id === 65);
	const doll = buildDoll(upstream, gun, ctx);
	assert.equal(doll.normal.id, 65);
	assert.equal(doll.normal.type, "AR");
	assert.equal(doll.normal.rarity, 5);
	assert.equal(doll.mod.id, 65);
	assert.equal(doll.mod.rarity, 6);
	assert.equal(doll.mod.name, `${doll.normal.name} Mod`);
	assert.equal(doll.mod.skill2.initial_cooldown, "Passive");
	assert.deepEqual(doll.skins.skin_ids, [537, 548, 557, 581, 805, 3401, 6505, 10203, 30033]);
	assert.equal(doll.skins.number_of_skins, doll.skins.skin_names.length);
	assert.ok(doll.skins.skin_ids.includes(537) && !doll.skins.skin_ids.includes(5024));
	assert.equal(doll.released, undefined);
});

test("each form carries its spec sheet rows, and a collab doll with no spec text has none", () => {
	const byId = new Map(upstream.stc("gun").map((row) => [row.id, row]));
	const hk416 = buildDoll(upstream, byId.get(65), ctx);
	assert.deepEqual(hk416.normal.specs[0], { label: "Type", value: "Assault rifle" });
	assert.ok(hk416.mod.specs.length > 0);
	assert.deepEqual(buildDoll(upstream, byId.get(1002), ctx).normal.specs, []);
});

test("collab dolls use the Extra rarity", () => {
	const gun = upstream.stc("gun").find((row) => row.id === 1002);
	assert.equal(buildDoll(upstream, gun, ctx).normal.rarity, 1);
});

test("a doll with no skins has null skins", () => {
	assert.equal(buildSkins(upstream, 68), null);
});

test("skins list every visible upstream skin in id order with no named entries", () => {
	const skins = buildSkins(upstream, 162);
	assert.deepEqual(skins.skin_ids, [2408, 3203, 10103, 30034]);
	assert.equal(skins.number_of_skins, 4);
	assert.ok(!skins.skin_names.includes("Marching Band"));
});

test("skin art gaps report artless skins and dolls, unlisted art, art without a card, and null ids", () => {
	const card = { images: ["card", "card_damaged"] };
	const manifest = {
		dolls: {
			1: { normal: card, skins: { 10: card, 11: card, 12: { images: ["full"] }, "legacy-a": card, "legacy-z": card } },
			2: { normal: { images: [] } }
		}
	};
	const doll = (id, skins) => ({ normal: { id }, skins });
	const dolls = [
		doll(1, { number_of_skins: 5, skin_names: ["A", "B", "C", "L", "M"], skin_ids: [10, 12, 13, "legacy-a", "legacy-b"] }),
		doll(2, { number_of_skins: 1, skin_names: ["Named"], skin_ids: [null] }),
		doll(3, null)
	];
	assert.deepEqual(findSkinArtGaps(dolls, manifest), {
		skinsWithoutArt: ["1:13", "1:legacy-b", "2:Named"],
		dollsWithoutArt: [2, 3],
		unlistedArt: ["1:11", "1:legacy-z"],
		artWithoutCard: ["1:12"],
		nullIds: [{ doll: 2, name: "Named" }]
	});
});

const extras = JSON.parse(fs.readFileSync("tools/data/extra-skins.json", "utf8"));

test("extra skins follow the table skins: game extras in id order, then legacy extras in file order", () => {
	const list = [
		{ doll: 1, key: "legacy-b", name: "Legacy B", source: "legacy", legacySlot: 2, reason: "r" },
		{ doll: 1, key: 9, name: "Game 9", source: "game", reason: "r" },
		{ doll: 1, key: "legacy-a", name: "Legacy A", source: "legacy", legacySlot: 1, reason: "r" },
		{ doll: 1, key: 4, name: "Game 4", source: "game", reason: "r" },
		{ doll: 2, key: 5, name: "Other doll", source: "game", reason: "r" }
	];
	const table = { number_of_skins: 1, skin_names: ["Table"], skin_ids: [700] };
	assert.deepEqual(addExtraSkins(table, 1, list), {
		number_of_skins: 5,
		skin_names: ["Table", "Game 4", "Game 9", "Legacy B", "Legacy A"],
		skin_ids: [700, 4, 9, "legacy-b", "legacy-a"]
	});
	assert.deepEqual(table.skin_ids, [700]);
	assert.deepEqual(addExtraSkins(null, 2, list), { number_of_skins: 1, skin_names: ["Other doll"], skin_ids: [5] });
	assert.equal(addExtraSkins(null, 3, list), null);
});

test("extra skin validation rejects table rows, bad keys and duplicates", () => {
	const fake = { stc: () => [{ id: 700, fit_gun: 1 }] };
	const game = (key) => ({ doll: 1, key, name: "N", source: "game", reason: "r" });
	assert.doesNotThrow(() => validateExtraSkins([game(4), { doll: 1, key: "legacy-x", name: "X", source: "legacy", legacySlot: 1, reason: "r" }], fake));
	assert.throws(() => validateExtraSkins([game(700)], fake), /skin.json/);
	assert.throws(() => validateExtraSkins([game("4")], fake), /numeric/);
	assert.throws(() => validateExtraSkins([{ doll: 1, key: "x", name: "X", source: "legacy", legacySlot: 1, reason: "r" }], fake), /legacy-/);
	assert.throws(() => validateExtraSkins([{ doll: 1, key: "legacy-x", name: "X", source: "legacy", reason: "r" }], fake), /legacySlot/);
	assert.throws(() => validateExtraSkins([game(4), game(4)], fake), /twice/);
	assert.throws(() => validateExtraSkins([{ ...game(4), source: "other" }], fake), /source/);
});

test("the committed extra skins are valid and game extras carry their skin.txt names", () => {
	validateExtraSkins(extras, upstream);
	for (const extra of extras.filter((entry) => entry.source === "game")) {
		assert.equal(upstream.t(`skin-${10000000 + extra.key}`), extra.name);
	}
	assert.deepEqual(
		extras.filter((entry) => entry.source === "game").map((entry) => [entry.doll, entry.key]),
		[
			[44, 502],
			[1003, 506],
			[1005, 507],
			[1008, 508]
		]
	);
});

test("SV-98 lists its table skin before the game extra", () => {
	assert.deepEqual(addExtraSkins(buildSkins(upstream, 44), 44, extras).skin_ids, [1906, 502]);
	assert.deepEqual(addExtraSkins(buildSkins(upstream, 275), 275, extras), { number_of_skins: 1, skin_names: ["Slipper Orchid"], skin_ids: ["legacy-slipper-orchid"] });
});

test("splitDetails moves the profile, exclusive equipment and spec sheets out of the record, keeping Mod specs only when they differ", () => {
	const release = { date: "2018-05", precision: "launch" };
	const profile = { faction: ["Squad 404"], release };
	const form = (name, specs) => ({ id: 65, name, tile_set: {}, specs });
	const sheet = [{ label: "Type", value: "Assault rifle" }];
	const exclusiveEquipment = [{ id: 159, name: "Tactical Headwear", rarity: 5, mod: false, stats: { damage: "+25" } }];
	const same = splitDetails({ normal: form("HK416", sheet), mod: form("HK416 Mod", [...sheet]), skins: null, profile, exclusiveEquipment });
	assert.deepEqual(same.record, { normal: { id: 65, name: "HK416", tile_set: {} }, mod: { id: 65, name: "HK416 Mod", tile_set: {} }, skins: null, release });
	assert.deepEqual(same.details, { profile, specs: { normal: sheet, mod: null }, exclusiveEquipment });
	const modSheet = [{ label: "Type", value: "Carbine" }];
	assert.deepEqual(splitDetails({ normal: form("A", sheet), mod: form("A Mod", modSheet), skins: null, profile, exclusiveEquipment: [] }).details.specs, { normal: sheet, mod: modSheet });
	const noMod = splitDetails({ normal: form("B", []), mod: null, skins: null, profile, exclusiveEquipment: [] });
	assert.equal(noMod.record.mod, null);
	assert.deepEqual(noMod.details.specs, { normal: [], mod: null });
});

test("productionOf reads the build time and the standard and heavy production pools", () => {
	const gun = (id) => upstream.stc("gun").find((row) => row.id === id);
	assert.deepEqual(productionOf(gun(65)), { seconds: 14100, standard: true, heavy: true });
	assert.equal(productionOf(gun(229)), null);
	assert.deepEqual(productionOf({ develop_duration: 600, obtain_ids: "2" }), { seconds: 600, standard: false, heavy: true });
	assert.deepEqual(productionOf({ develop_duration: 600, obtain_ids: "1,3" }), { seconds: 600, standard: true, heavy: false });
	const released = selectReleased(upstream, "2026-09-13");
	const buildable = released.map(productionOf).filter(Boolean);
	assert.equal(buildable.length, 258);
	assert.ok(buildable.every((production) => production.seconds > 0));
});

test("buildDoll carries the doll's production", () => {
	const gun = upstream.stc("gun").find((row) => row.id === 65);
	assert.deepEqual(buildDoll(upstream, gun, ctx).production, { seconds: 14100, standard: true, heavy: true });
});
