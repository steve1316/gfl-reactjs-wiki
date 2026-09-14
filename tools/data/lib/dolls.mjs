import { buildSkill } from "./skills.mjs";
import { buildSkins } from "./skins.mjs";
import { specsFor } from "./specs.mjs";
import { computeStats } from "./stats.mjs";
import { cleanName } from "./text.mjs";
import { TYPE_NAMES, buildTiles } from "./tiles.mjs";

/** Base form and Mod levels the site shows stats at. */
const BASE_LEVEL = 100;
const MOD_LEVEL = 120;

/** Mod rows are the base id plus this offset. */
const MOD_OFFSET = 20000;

/** Upstream `rank_display` for collaboration dolls, which the site files under rarity 1 ("Extra"). */
const COLLAB_RANK_DISPLAY = 7;

/**
 * Pick released, playable base dolls.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {string} cutoff Release cutoff date, `YYYY-MM-DD`. Dolls released later are left out.
 * @returns {object[]} `stc/gun.json` rows, id ascending.
 */
export function selectReleased(upstream, cutoff) {
	const limit = `${cutoff} 23:59:59`;
	return upstream
		.stc("gun")
		.filter((gun) => gun.id < 2000 && gun.launch_time <= limit && gun.obtain_ids !== "0" && gun.obtain_ids !== "" && upstream.t(gun.name).trim() !== "")
		.sort((a, b) => a.id - b.id);
}

/**
 * Build one form from its gun row.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {object} gun The form's gun row.
 * @param {object} base The base doll's gun row, whose id and name the Mod shares.
 * @param {{ config: object, warnings: string[] }} ctx Shared build context.
 * @returns {object} The form in the site's raw shape.
 */
function buildForm(upstream, gun, base, ctx) {
	const isMod = gun.id >= MOD_OFFSET;
	const name = cleanName(upstream.t(base.name));
	const form = {
		id: base.id,
		name: isMod ? `${name} Mod` : name,
		type: TYPE_NAMES[gun.type],
		rarity: gun.rank_display === COLLAB_RANK_DISPLAY ? 1 : gun.rank,
		...computeStats(gun, ctx.config, isMod ? MOD_LEVEL : BASE_LEVEL),
		skill: buildSkill(upstream, gun.skill1, ctx.warnings)
	};
	if (gun.skill2) {
		form.skill2 = buildSkill(upstream, gun.skill2, ctx.warnings);
	}
	form.tile_set = buildTiles(gun);
	form.specs = specsFor(upstream.t(gun.en_introduce), isMod ? upstream.t(base.en_introduce) : "");
	return form;
}

/**
 * Build a whole doll: base form, Mod and skins.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {object} gun The base doll's gun row.
 * @param {{ config: object, skinAssets: Record<string, (number | { name: string })[]>, warnings: string[] }} ctx Shared build context.
 * @returns {object} The doll in the site's raw shape.
 */
export function buildDoll(upstream, gun, ctx) {
	const modGun = upstream.stc("gun").find((row) => row.id === gun.id + MOD_OFFSET);
	return {
		normal: buildForm(upstream, gun, gun, ctx),
		mod: modGun ? buildForm(upstream, modGun, gun, ctx) : null,
		skins: buildSkins(upstream, gun.id, ctx.skinAssets[String(gun.id)]),
		released: gun.launch_time.slice(0, 10)
	};
}
