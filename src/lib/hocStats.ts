/**
 * HOC stats at a level and star rank, ported from the game's formula as implemented by neko-gg/gfl-combat-simulator (MIT).
 *
 * The multiplication order matches the game, because the result is rounded up and a different order can land a float just past a whole number.
 * `tools/data/test/hocs.test.mjs` checks the output against IOPWiki, so this file must stay plain enough for Node to run with its types stripped.
 */

import type { Hoc, HocConstants, HocStatKey, HocStatValues } from "../types/hoc";

/** The HOC stat keys in display order. */
export const HOC_STAT_KEYS: readonly HocStatKey[] = ["lethality", "pierce", "precision", "reload"];

/** Each stat's name as the game shows it. */
export const HOC_STAT_LABELS: Record<HocStatKey, string> = { lethality: "Lethality", pierce: "Pierce", precision: "Precision", reload: "Reload" };

/** How many star ranks a HOC has. */
export const HOC_MAX_STARS = 5;

/**
 * Round up after trimming float noise past seven decimals, as the game does.
 *
 * @param value The unrounded stat.
 * @returns The stat as a whole number.
 */
function roundUp(value: number): number {
	return Math.ceil(Number.parseFloat(value.toFixed(7)));
}

/**
 * Build one value per stat.
 *
 * @param compute Works out one stat.
 * @returns Every stat.
 */
function perStat(compute: (key: HocStatKey) => number): HocStatValues {
	return { lethality: compute("lethality"), pierce: compute("pierce"), precision: compute("precision"), reload: compute("reload") };
}

/**
 * A HOC's base stats at a level. Stars do not change these.
 *
 * @param hoc The HOC.
 * @param constants The shared stat constants.
 * @param level The level, 1 to `constants.maxLevel`.
 * @returns Each stat.
 */
export function hocStats(hoc: Hoc, constants: HocConstants, level: number): HocStatValues {
	const scaledLevel = constants.baseLevel + level - 1;
	return perStat((key) => roundUp((hoc.basicRate * (constants.stats[key].basicRate * (scaledLevel * hoc.attributes[key]))) / 100_000_000));
}

/**
 * The most a HOC's chip board can add at a level and star rank.
 *
 * @param hoc The HOC.
 * @param constants The shared stat constants.
 * @param level The level, 1 to `constants.maxLevel`.
 * @param stars The star rank, 1 to 5.
 * @returns Each stat's chip board maximum.
 */
export function hocChipStats(hoc: Hoc, constants: HocConstants, level: number, stars: number): HocStatValues {
	const scaledLevel = constants.baseLevel + level - 1;
	const starRate = constants.starCpuRates[stars - 1] ?? 0;
	return perStat((key) => roundUp((hoc.cpuRate * (constants.stats[key].cpuRate * (hoc.attributes[key] * scaledLevel)) * starRate) / 10_000_000_000));
}
