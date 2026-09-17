/** The enemy archive's rank bars: which ones exist, what to call them and how far they go. */

import type { EnemyRankKey } from "../types/enemy";

/** Every rank bar, in the order the archive lists them. */
export const ENEMY_RANK_KEYS: readonly EnemyRankKey[] = ["power", "health", "accuracy", "evasion", "rateOfFire", "armor", "speed", "range", "tenacity"];

/**
 * The rank bars a tile has room for. Tenacity is left out because upstream only sets it on three enemies, and speed and range
 * matter less at a glance than what an enemy hits with and how hard it is to kill.
 */
export const ENEMY_CARD_RANK_KEYS: readonly EnemyRankKey[] = ["power", "health", "accuracy", "evasion", "rateOfFire", "armor"];

/** Each rank's name as the game shows it. */
export const ENEMY_RANK_LABELS: Record<EnemyRankKey, string> = {
	power: "Power",
	health: "Health",
	accuracy: "Accuracy",
	evasion: "Evasion",
	rateOfFire: "Rate of Fire",
	armor: "Armor",
	speed: "Speed",
	range: "Range",
	tenacity: "Tenacity"
};

/** The highest a rank bar goes. Every bar in the shipped data tops out here or below. */
export const ENEMY_MAX_RANK = 7;
