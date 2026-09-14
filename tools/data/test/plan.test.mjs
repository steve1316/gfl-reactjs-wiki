import { test } from "node:test";
import assert from "node:assert/strict";

import { planRefresh } from "../lib/plan.mjs";
import { setLockShas } from "../lib/upstream.mjs";

const OLD_US = "73364c85a916f3136cfd03aa0f79bad60faa231b";
const OLD_CN = "77f0379cbc504753c864d1a9a6091bbfd0536215";
const NEW_US = "1111111111111111111111111111111111111111";
const NEW_CN = "2222222222222222222222222222222222222222";
const LOCK_TEXT = `{\n\t"repo": "gf-data-tools/gf-data-us",\n\t"sha": "${OLD_US}",\n\t"cn": { "repo": "gf-data-tools/gf-data-ch", "sha": "${OLD_CN}" }\n}\n`;

test("planRefresh has no work when the pin is current and the released dolls match, ignoring hand-added dolls", () => {
	const plan = planRefresh({ lockedSha: OLD_US, latestSha: OLD_US, releasedIds: [1, 2, 3], committedIds: [1, 2, 3, 1003], extraIds: [1003] });
	assert.deepEqual(plan, { work: false, upstream: { locked: OLD_US, latest: OLD_US }, released: { added: [], removed: [] } });
});

test("planRefresh has work when a doll crosses its release date", () => {
	const plan = planRefresh({ lockedSha: OLD_US, latestSha: OLD_US, releasedIds: [424, 1, 2], committedIds: [1, 2], extraIds: [] });
	assert.equal(plan.work, true);
	assert.deepEqual(plan.released, { added: [424], removed: [] });
});

test("planRefresh has work when upstream moved, even with the same dolls", () => {
	const plan = planRefresh({ lockedSha: OLD_US, latestSha: NEW_US, releasedIds: [1], committedIds: [1], extraIds: [] });
	assert.equal(plan.work, true);
	assert.deepEqual(plan.upstream, { locked: OLD_US, latest: NEW_US });
});

test("planRefresh lists committed dolls that are no longer released", () => {
	const plan = planRefresh({ lockedSha: OLD_US, latestSha: OLD_US, releasedIds: [1], committedIds: [1, 5], extraIds: [] });
	assert.equal(plan.work, true);
	assert.deepEqual(plan.released.removed, [5]);
});

test("setLockShas swaps both pins and keeps the file's layout", () => {
	const expected = `{\n\t"repo": "gf-data-tools/gf-data-us",\n\t"sha": "${NEW_US}",\n\t"cn": { "repo": "gf-data-tools/gf-data-ch", "sha": "${NEW_CN}" }\n}\n`;
	assert.equal(setLockShas(LOCK_TEXT, { us: NEW_US, cn: NEW_CN }), expected);
});

test("setLockShas leaves an unmoved pin alone and moves the other", () => {
	const next = setLockShas(LOCK_TEXT, { us: OLD_US, cn: NEW_CN });
	assert.ok(next.includes(`"sha": "${OLD_US}"`) && next.includes(`"sha": "${NEW_CN}"`));
});

test("setLockShas rejects anything but a full commit sha", () => {
	assert.throws(() => setLockShas(LOCK_TEXT, { us: "HEAD", cn: OLD_CN }), /not a full commit sha/);
	assert.throws(() => setLockShas(LOCK_TEXT, { us: OLD_US, cn: OLD_US.slice(0, 8) }), /not a full commit sha/);
});
