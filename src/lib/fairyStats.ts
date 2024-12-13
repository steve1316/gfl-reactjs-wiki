/**
 * Fairy stats at a level and star rank, ported from neko-gg/gfl-combat-simulator (MIT). Values are percentages.
 * `tools/data/test/fairies.test.mjs` checks the output against IOPWiki, so this file must stay runnable by Node with its types stripped.
 */

import type { Fairy, FairyConstants, FairyStatKey, FairyStatValues } from "../types/fairy";

/** The fairy stat keys in display order. */
export const FAIRY_STAT_KEYS: readonly FairyStatKey[] = ["damage", "accuracy", "evasion", "armor", "critDamage"];

/** Each stat's name as the game shows it. */
export const FAIRY_STAT_LABELS: Record<FairyStatKey, string> = { damage: "Damage", accuracy: "Accuracy", evasion: "Evasion", armor: "Armor", critDamage: "Crit Damage" };

/** How many star ranks a fairy has. */
export const FAIRY_MAX_STARS = 5;

/**
 * The star rank a fairy actually has, since each rank needs a minimum level.
 *
 * @param constants The shared fairy constants.
 * @param level The level, 1 to `constants.maxLevel`.
 * @param stars The chosen star rank, 1 to 5.
 * @returns The lower of the chosen rank and the highest rank the level allows.
 */
export function effectiveStars(constants: FairyConstants, level: number, stars: number): number {
	const allowed = constants.starLevels.filter((needed) => level >= needed).length;
	return Math.max(1, Math.min(stars, allowed));
}

/**
 * The art form a star rank shows.
 *
 * @param constants The shared fairy constants.
 * @param stars The star rank, 1 to 5.
 * @returns The form number, 1 to 3.
 */
export function fairyForm(constants: FairyConstants, stars: number): number {
	const index = constants.forms.findIndex((ranks) => ranks.includes(stars));
	return index === -1 ? constants.forms.length : index + 1;
}

/**
 * The label for an art form's group of star ranks, such as "1-2★" or "5★".
 *
 * @param ranks The star ranks the form covers, in ascending order.
 * @returns The lowest and highest rank joined by a dash, or just the rank when the form covers only one.
 */
export function fairyFormLabel(ranks: number[]): string {
	return ranks.length > 1 ? `${ranks[0]}-${ranks[ranks.length - 1]}★` : `${ranks[0]}★`;
}

/**
 * A fairy's stats at a level and star rank. The star rank is capped by level first.
 *
 * @param fairy The fairy.
 * @param constants The shared fairy constants.
 * @param level The level, 1 to `constants.maxLevel`.
 * @param stars The chosen star rank, 1 to 5.
 * @returns Each stat as a percentage, rounded to two decimals.
 */
export function fairyStats(fairy: Fairy, constants: FairyConstants, level: number, stars: number): FairyStatValues {
	const multiplier = fairy.proportion[effectiveStars(constants, level, stars) - 1] ?? 1;
	const stat = (key: FairyStatKey) => {
		const [atLevelOne, perLevel] = constants.grow[key];
		const base = fairy.stats[key];
		const raw = multiplier * (Math.ceil((atLevelOne * base) / 100) + Math.ceil(((level - 1) * perLevel * base * fairy.grow) / 10000));
		return Math.round((raw + Number.EPSILON) * 100) / 100;
	};
	return { damage: stat("damage"), accuracy: stat("accuracy"), evasion: stat("evasion"), armor: stat("armor"), critDamage: stat("critDamage") };
}

/**
 * Format a fairy stat as a percentage, dropping a trailing ".0" so a whole number reads as "25%" rather than "25.0%".
 *
 * @param value The stat value, already rounded to two decimals by `fairyStats`.
 * @returns The value with a `%` suffix, such as "25%" or "4.8%".
 */
export function formatFairyStat(value: number): string {
	return `${Number(value.toFixed(2))}%`;
}
