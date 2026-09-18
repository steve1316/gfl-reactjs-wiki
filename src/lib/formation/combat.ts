/**
 * A damage estimate for an echelon fighting an enemy squad.
 *
 * This is a model, not the game's own combat loop. It resolves the four things that decide a shot - whether it lands, whether it
 * crits, how much armor eats, and how often it is fired - and multiplies them out into damage per second. It deliberately leaves out
 * everything that needs a battle timeline: active skills, reloads between clips, movement, cover, night vision, targeting order and
 * the enemy shooting back. Those change the real answer, which is why every number here is presented as an estimate.
 *
 * The formulas are the ones the community calculators use:
 *
 * - Hit chance is `accuracy / (accuracy + evasion)`, the standard logistic split between the two stats.
 * - Armor subtracts from damage after piercing, and a shot that cannot beat armor still does a floor share of its damage rather
 *   than nothing, which is what stops a high-armor enemy reading as invulnerable.
 * - A crit multiplies damage, by default by half again.
 * - Rate of fire becomes an interval in the game's 30-per-second ticks: `ceil(1500 / rof)` ticks between volleys.
 *
 * Node runs this file with its types stripped in tests, so it must only use erasable TypeScript syntax.
 */

import type { FormationEnemy } from "../../types/formation";
import type { DollStats } from "./pipeline.ts";

/** Game ticks per second. The engine runs its combat loop at this rate, and a firing interval is a whole number of ticks. */
const TICKS_PER_SECOND = 30;

/** Numerator of the firing interval: ticks between volleys is `ceil(ROF_CONSTANT / rate of fire)`. */
const ROF_CONSTANT = 1500;

/** What a critical hit multiplies damage by, absent a fairy or equipment that changes it. */
export const BASE_CRIT_MULTIPLIER = 1.5;

/** The share of its damage a shot still does when armor would otherwise absorb all of it. */
const ARMOR_FLOOR_SHARE = 0.1;

/** One side's damage against the other. */
export interface DamageEstimate {
	/** Chance a shot lands, 0 to 1. */
	hitChance: number;
	/** Damage a landed non-critical shot does after armor. */
	damagePerHit: number;
	/** Damage a landed critical shot does after armor. */
	damagePerCrit: number;
	/** Average damage per shot fired, counting misses and crits. */
	damagePerShot: number;
	/** Seconds between volleys. */
	shotInterval: number;
	/** Average damage per second. */
	dps: number;
}

/** What one doll does to one enemy. */
export interface DollDamage {
	/** The doll's cell on the grid. */
	cell: number;
	/** The estimate. */
	estimate: DamageEstimate;
}

/** The whole fight's estimate. */
export interface CombatEstimate {
	/** Each doll's damage against the enemy squad, in the order given. */
	dolls: DollDamage[];
	/** The echelon's summed damage per second. */
	totalDps: number;
	/** The enemy squad's total HP across every unit in it. */
	enemyHp: number;
	/** Seconds to clear the squad at `totalDps`, or null when the echelon cannot hurt it at all. */
	secondsToClear: number | null;
	/** The enemy squad's summed damage per second against the echelon. */
	incomingDps: number;
}

/**
 * Seconds between one unit's volleys.
 *
 * @param rof Rate of fire.
 * @returns The interval in seconds, or Infinity for a unit that never fires.
 */
export function shotInterval(rof: number): number {
	if (rof <= 0) {
		return Infinity;
	}
	return Math.ceil(ROF_CONSTANT / rof) / TICKS_PER_SECOND;
}

/**
 * The chance a shot lands.
 *
 * @param accuracy The shooter's accuracy.
 * @param evasion The target's evasion.
 * @returns The chance, 0 to 1. A target with no evasion is always hit.
 */
export function hitChance(accuracy: number, evasion: number): number {
	const total = accuracy + evasion;
	if (total <= 0) {
		return accuracy > 0 ? 1 : 0;
	}
	return Math.max(0, Math.min(1, accuracy / total));
}

/**
 * Damage one landed shot does once armor has taken its share.
 *
 * @param damage The shooter's damage.
 * @param armor The target's armor.
 * @param piercing The shooter's armor piercing.
 * @returns The damage, never below the floor share of the shot.
 */
export function damageAfterArmor(damage: number, armor: number, piercing: number): number {
	const effectiveArmor = Math.max(0, armor - piercing);
	return Math.max(damage * ARMOR_FLOOR_SHARE, damage - effectiveArmor);
}

/**
 * Estimate one shooter's damage against one target.
 *
 * @param shooter The shooter's damage, accuracy, crit rate and armor piercing.
 * @param target The target's evasion and armor.
 * @param critMultiplier What a crit multiplies damage by.
 * @returns The estimate.
 */
export function estimateDamage(
	shooter: { dmg: number; acc: number; rof: number; crit: number; armorPiercing: number },
	target: { eva: number; armor: number },
	critMultiplier: number = BASE_CRIT_MULTIPLIER
): DamageEstimate {
	const chance = hitChance(shooter.acc, target.eva);
	const perHit = damageAfterArmor(shooter.dmg, target.armor, shooter.armorPiercing);
	const perCrit = damageAfterArmor(shooter.dmg * critMultiplier, target.armor, shooter.armorPiercing);
	const critRate = Math.max(0, Math.min(1, shooter.crit / 100));
	const perShot = chance * (perHit * (1 - critRate) + perCrit * critRate);
	const interval = shotInterval(shooter.rof);
	return {
		hitChance: chance,
		damagePerHit: perHit,
		damagePerCrit: perCrit,
		damagePerShot: perShot,
		shotInterval: interval,
		dps: interval === Infinity ? 0 : perShot / interval
	};
}

/**
 * The health of a whole enemy squad: its units share their stats, so only the HP pool adds up.
 *
 * @param enemy The enemy.
 * @returns Its squad's pooled HP.
 */
export function squadHp(enemy: FormationEnemy): number {
	return enemy.stats.hp * Math.max(1, enemy.stats.count);
}

/**
 * Estimate a fight between an echelon and the enemies facing it.
 *
 * Each doll is estimated against the toughest enemy on the field rather than against a chosen target, since the model has no
 * targeting order to work from. The enemy side's damage is summed the same way.
 *
 * @param dolls The echelon's dolls, each with its cell and final stats.
 * @param enemies The enemies placed on the opposing grid.
 * @param critMultiplier What a crit multiplies damage by: `BASE_CRIT_MULTIPLIER` plus whatever a fairy adds.
 * @returns The estimate, or null when either side is empty.
 */
export function estimateCombat(dolls: readonly { cell: number; stats: DollStats }[], enemies: readonly FormationEnemy[], critMultiplier: number): CombatEstimate | null {
	if (dolls.length === 0 || enemies.length === 0) {
		return null;
	}
	// The sturdiest enemy stands for the squad, so the estimate is the pessimistic one rather than an average that no single
	// exchange ever matches.
	const target = enemies.reduce((worst, enemy) => (enemy.stats.armor > worst.stats.armor || (enemy.stats.armor === worst.stats.armor && enemy.stats.eva > worst.stats.eva) ? enemy : worst));
	const estimates = dolls.map(({ cell, stats }) => ({
		cell,
		estimate: estimateDamage({ dmg: stats.dmg, acc: stats.acc, rof: stats.rof, crit: stats.crit, armorPiercing: stats.armorPiercing }, target.stats, critMultiplier)
	}));
	const totalDps = estimates.reduce((sum, entry) => sum + entry.estimate.dps, 0);
	const enemyHp = enemies.reduce((sum, enemy) => sum + squadHp(enemy), 0);

	// The echelon's own evasion and armor vary by doll, so the incoming estimate uses the front line's weakest showing: the lowest
	// evasion and the lowest armor on the grid. It is the damage the echelon takes when the enemy shoots whoever is easiest to hit.
	const softest = dolls.reduce((worst, doll) => (doll.stats.eva < worst.stats.eva ? doll : worst));
	const incomingDps = enemies.reduce((sum, enemy) => {
		const units = Math.max(1, enemy.stats.count);
		const shot = estimateDamage(
			{ dmg: enemy.stats.dmg, acc: enemy.stats.acc, rof: enemy.stats.rof, crit: 0, armorPiercing: enemy.stats.armorPiercing },
			{ eva: softest.stats.eva, armor: softest.stats.armor },
			critMultiplier
		);
		return sum + shot.dps * units;
	}, 0);

	return { dolls: estimates, totalDps, enemyHp, secondsToClear: totalDps > 0 ? enemyHp / totalDps : null, incomingDps };
}
