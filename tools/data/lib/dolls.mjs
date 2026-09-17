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

/** Obtain id of dolls built in standard production, from `asset/table/gun_obtain.txt`. */
const STANDARD_PRODUCTION = "1";

/** Obtain id of dolls built in heavy production. */
const HEAVY_PRODUCTION = "2";

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
		name: isMod ? `${name} MOD` : name,
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
 * Read a doll's build time and the production pools it can come from.
 *
 * `develop_duration` is set for event and reward dolls too, so the obtain ids decide whether the doll is buildable at all.
 *
 * @param {{ develop_duration: number, obtain_ids: string }} gun The doll's base gun row.
 * @returns {{ seconds: number, standard: boolean, heavy: boolean } | null} The build time and pools, or null when production never gives the doll.
 */
export function productionOf(gun) {
	const obtain = String(gun.obtain_ids).split(",");
	const standard = obtain.includes(STANDARD_PRODUCTION);
	const heavy = obtain.includes(HEAVY_PRODUCTION);
	return standard || heavy ? { seconds: gun.develop_duration, standard, heavy } : null;
}

/**
 * Build a whole doll: base form, Mod, skins and production.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {object} gun The base doll's gun row.
 * @param {{ config: object, warnings: string[] }} ctx Shared build context.
 * @returns {object} The doll in the site's raw shape.
 */
export function buildDoll(upstream, gun, ctx) {
	const modGun = upstream.stc("gun").find((row) => row.id === gun.id + MOD_OFFSET);
	return {
		normal: buildForm(upstream, gun, gun, ctx),
		mod: modGun ? buildForm(upstream, modGun, gun, ctx) : null,
		skins: buildSkins(upstream, gun.id),
		production: productionOf(gun)
	};
}

/**
 * Split a finished doll into its shard record and its side-file details, so pages that list every doll do not download profiles
 * and spec sheets. The record keeps a copy of the profile's release date, which the T-Doll index sorts by.
 *
 * @param {object} doll A built doll with overrides applied: a `profile`, an `exclusiveEquipment` list, and a `specs` list on each form.
 * @returns {{ record: object, details: { profile: object, specs: { normal: object[], mod: object[] | null }, exclusiveEquipment: object[] } }} The
 *   record without `profile`, `exclusiveEquipment` or form `specs` but with `release`, and the details. Mod specs are null when the doll
 *   has no Mod or the Mod's sheet matches the base form's.
 */
export function splitDetails(doll) {
	const { profile, exclusiveEquipment, normal, mod, ...rest } = doll;
	const withoutSpecs = ({ specs, ...form }) => form;
	const modSpecs = mod && JSON.stringify(mod.specs) !== JSON.stringify(normal.specs) ? mod.specs : null;
	return {
		record: { normal: withoutSpecs(normal), mod: mod && withoutSpecs(mod), ...rest, release: profile.release },
		details: { profile, specs: { normal: normal.specs, mod: modSpecs }, exclusiveEquipment }
	};
}
