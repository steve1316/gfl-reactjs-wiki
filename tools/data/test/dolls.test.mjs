import { test } from "node:test";
import assert from "node:assert/strict";

import { buildDoll, selectReleased, splitDetails } from "../lib/dolls.mjs";
import { buildSkins, findSkinArtGaps } from "../lib/skins.mjs";
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
			1: { normal: card, skins: { 10: card, 11: card, 12: { images: ["full"] } } },
			2: { normal: { images: [] } }
		}
	};
	const doll = (id, skins) => ({ normal: { id }, skins });
	const dolls = [doll(1, { number_of_skins: 3, skin_names: ["A", "B", "C"], skin_ids: [10, 12, 13] }), doll(2, { number_of_skins: 1, skin_names: ["Named"], skin_ids: [null] }), doll(3, null)];
	assert.deepEqual(findSkinArtGaps(dolls, manifest), {
		skinsWithoutArt: ["1:13", "2:Named"],
		dollsWithoutArt: [2, 3],
		unlistedArt: ["1:11"],
		artWithoutCard: ["1:12"],
		nullIds: [{ doll: 2, name: "Named" }]
	});
});

test("splitDetails moves the profile and spec sheets out of the record, keeping Mod specs only when they differ", () => {
	const profile = { faction: ["Squad 404"] };
	const form = (name, specs) => ({ id: 65, name, tile_set: {}, specs });
	const sheet = [{ label: "Type", value: "Assault rifle" }];
	const same = splitDetails({ normal: form("HK416", sheet), mod: form("HK416 Mod", [...sheet]), skins: null, profile });
	assert.deepEqual(same.record, { normal: { id: 65, name: "HK416", tile_set: {} }, mod: { id: 65, name: "HK416 Mod", tile_set: {} }, skins: null });
	assert.deepEqual(same.details, { profile, specs: { normal: sheet, mod: null } });
	const modSheet = [{ label: "Type", value: "Carbine" }];
	assert.deepEqual(splitDetails({ normal: form("A", sheet), mod: form("A Mod", modSheet), skins: null, profile }).details.specs, { normal: sheet, mod: modSheet });
	const noMod = splitDetails({ normal: form("B", []), mod: null, skins: null, profile });
	assert.equal(noMod.record.mod, null);
	assert.deepEqual(noMod.details.specs, { normal: [], mod: null });
});
