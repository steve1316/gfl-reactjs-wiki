/**
 * A T-Doll form's base stats at any level, as the game computes them.
 *
 * The importer's `tools/data/lib/stats.mjs` calls this too, so the site and the generated data share one formula. Node runs this file with its
 * types stripped in tests and in the importer, so it must only use erasable TypeScript syntax (no enums or parameter properties).
 */

import type { FormationBaseStats, FormationStatConstants, FormationStatRatios } from "../../types/formation";

/** What `levelStats` needs from a form. */
export interface GrowthInput {
	/** Upstream type id. */
	type: number;
	/** Growth ratio for damage, accuracy, evasion and rate of fire, as a percentage. */
	eatRatio: number;
	/** Stat ratios. */
	ratio: FormationStatRatios;
}

/**
 * Look up a constant by its exact name.
 *
 * @param params Growth parameters by name.
 * @param name Parameter name.
 * @returns The constant's values.
 * @throws When the parameter is missing.
 */
function requireParam(params: Record<string, number[]>, name: string): number[] {
	const value = params[name];
	if (!value) {
		throw new Error(`missing game_config_info parameter ${name}`);
	}
	return value;
}

/**
 * Look up a constant, switching to its `_after100` variant above level 100.
 *
 * @param params Growth parameters by name.
 * @param name Parameter name without the suffix.
 * @param level Doll level.
 * @returns The constant's values.
 */
function param(params: Record<string, number[]>, name: string, level: number): number[] {
	return requireParam(params, level > 100 ? `${name}_after100` : name);
}

/**
 * Compute a form's base stats at a level.
 *
 * HP and armor grow linearly. Damage, accuracy, evasion and rate of fire add a base part and a grown part that scales with `eatRatio`.
 * HP is for one dummy link.
 *
 * @param form The form's type, growth ratio and stat ratios.
 * @param constants Growth parameters and type multipliers.
 * @param level Doll level, 1 to 120.
 * @returns The base stats.
 * @throws When the type or a parameter is unknown.
 */
export function levelStats(form: GrowthInput, constants: FormationStatConstants, level: number): FormationBaseStats {
	const type = constants.types[String(form.type)];
	if (!type) {
		throw new Error(`unknown doll type ${form.type}`);
	}
	const { params } = constants;
	const linear = (name: string, multiplier: number, ratio: number): number => {
		const [base = 0, perLevel = 0, divisor = 1] = param(params, name, level);
		return Math.ceil(((base + (level - 1) * perLevel) * multiplier * ratio) / divisor);
	};
	const grown = (name: string, multiplier: number, ratio: number): number => {
		const [basic = 0, basicDivisor = 1] = requireParam(params, `${name}_basic`);
		const [grow = 0, divisorA = 1, divisorB = 1, constant = 0] = param(params, `${name}_grow`, level);
		return Math.ceil((basic * multiplier * ratio) / basicDivisor) + Math.ceil(((grow * (level - 1) + constant) * multiplier * ratio * form.eatRatio) / divisorA / divisorB);
	};
	return {
		hp: linear("life_basic", type.life, form.ratio.life),
		dmg: grown("power", type.pow, form.ratio.pow),
		acc: grown("hit", type.hit, form.ratio.hit),
		eva: grown("dodge", type.dodge, form.ratio.dodge),
		rof: grown("rate", type.rate, form.ratio.rate),
		armor: linear("armor_basic", type.armor, form.ratio.armor)
	};
}
