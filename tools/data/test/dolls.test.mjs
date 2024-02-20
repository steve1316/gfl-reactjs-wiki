import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { buildDoll, selectReleased, splitDetails } from "../lib/dolls.mjs";
import { buildSkins } from "../lib/skins.mjs";
import { readStatConfig } from "../lib/stats.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

const upstream = loadUpstream(resolveUpstreamDir());
const skinAssets = JSON.parse(fs.readFileSync("tools/data/skin-assets.json", "utf8"));
const ctx = { config: readStatConfig(upstream), skinAssets, warnings: [] };

test("release filter keeps 450 dolls on 2026-09-13 and drops NPCs and future dolls", () => {
	const ids = selectReleased(upstream, "2026-09-13").map((gun) => gun.id);
	assert.equal(ids.length, 450);
	assert.ok(!ids.includes(424) && !ids.includes(9001) && !ids.includes(20065));
	assert.ok(ids.includes(423) && ids.includes(1046));
});

test("HK416 assembles with its Mod, skins in art-slot order first", () => {
	const gun = upstream.stc("gun").find((row) => row.id === 65);
	const doll = buildDoll(upstream, gun, ctx);
	assert.equal(doll.normal.id, 65);
	assert.equal(doll.normal.type, "AR");
	assert.equal(doll.normal.rarity, 5);
	assert.equal(doll.mod.id, 65);
	assert.equal(doll.mod.rarity, 6);
	assert.equal(doll.mod.name, `${doll.normal.name} Mod`);
	assert.equal(doll.mod.skill2.initial_cooldown, "Passive");
	assert.deepEqual(doll.skins.skin_ids.slice(0, skinAssets["65"].length), skinAssets["65"]);
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
	assert.equal(buildSkins(upstream, 68, undefined), null);
});

test("named slots keep their art position with a null id", () => {
	const skins = buildSkins(upstream, 162, [2408, { name: "Marching Band" }, 3203]);
	assert.deepEqual(skins.skin_ids.slice(0, 3), [2408, null, 3203]);
	assert.equal(skins.skin_names[1], "Marching Band");
});

test("a mapped id that is not a visible upstream skin fails loudly", () => {
	assert.throws(() => buildSkins(upstream, 65, [999999]), /not a visible upstream skin/);
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
