import { test } from "node:test";
import assert from "node:assert/strict";

import { buildEquipment, scaleStat } from "../lib/equipment.mjs";
import { loadUpstream, resolveUpstreamDir } from "../lib/upstream.mjs";

test("scales both ends of a range with integer maths", () => {
	assert.deepEqual(scaleStat("24,24", 1000), ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]);
	assert.deepEqual(scaleStat("2,3", 0).slice(0, 2), ["+2~3", "+2~3"]);
	assert.equal(scaleStat("25,25", 200)[6], "+28");
});

test("negative values never scale and keep upstream order", () => {
	assert.deepEqual(scaleStat("-4,-1", 1000), Array(11).fill("-4~1"));
});

test("builds typed, id-keyed equipment with doll links for exclusive items", () => {
	const upstream = loadUpstream(resolveUpstreamDir());
	const { types, items } = buildEquipment(upstream);
	const all = Object.values(items).flat();
	assert.equal(all.length, 474);
	assert.ok(types.some((type) => type.key === "opticalSight" && type.label === "Optical Sight"));
	const lab = all.find((item) => item.id === 109);
	assert.equal(lab.exclusive, false);
	assert.deepEqual(lab.usable, ["SMG", "RF", "AR", "MG", "SG"]);
	assert.deepEqual(lab.stats.criticalHitRate, ["+24", "+26", "+28", "+31", "+33", "+36", "+38", "+40", "+43", "+45", "+48"]);
	assert.ok(all.every((item) => !("image" in item)));
	const acog = all.find((item) => item.id === 202);
	assert.equal(acog.exclusive, true);
	assert.deepEqual(acog.dolls, [{ id: 1029, mod: false }]);
});
