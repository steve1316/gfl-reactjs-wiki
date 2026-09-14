import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

import { findSpineIndexProblems } from "../lib/spineIndex.mjs";

const rig = (skel) => ({ skel, atlas: skel, anims: ["wait"] });

test("a v3 spine index has no problems", () => {
	const index = { 65: { combat: rig("HK416"), dorm: rig("RHK416"), mod: { combat: rig("mod/HK416Mod") }, skins: { 805: { combat: rig("skins/805/HK416_805") } } } };
	assert.deepEqual(findSpineIndexProblems(index), []);
});

test("a v2 or malformed spine index is reported", () => {
	const index = {
		1: { combat: rig("M1873"), skinRigs: [null, { combat: rig("M1873_301") }] },
		2: { dorm: rig("RX") },
		3: { combat: rig("C"), mod: {}, skins: [{ combat: rig("C_1") }] },
		4: { combat: rig("D"), skins: { 9: { dorm: rig("RD_9") } } }
	};
	assert.deepEqual(findSpineIndexProblems(index), [
		"doll 1 has a version 2 skinRigs list",
		"doll 2 has no combat rig",
		"doll 3 Mod has no combat rig",
		"doll 3 skins is not a map keyed by skin id",
		"doll 4 skin 9 has no combat rig"
	]);
	assert.deepEqual(findSpineIndexProblems([]), ["the spine index is not an object keyed by doll id"]);
});

test("the committed spine index is v3-shaped", () => {
	assert.deepEqual(findSpineIndexProblems(JSON.parse(fs.readFileSync("src/data/spine-index.json", "utf8"))), []);
});
