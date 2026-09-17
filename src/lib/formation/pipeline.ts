/**
 * Effective stats for every doll in an echelon, with a breakdown of where each change came from.
 *
 * The order and rounding follow the community calculators and are provisional until Milestone 4's mechanics research. Node runs this file with
 * its types stripped in tests, so it must only use erasable TypeScript syntax.
 */

import type { FormationConstants, FormationForm, TileStatCode } from "../../types/formation";
import { levelStats } from "./growth.ts";
import { appliesTo, tileSources } from "./tiles.ts";
import type { TileSource } from "./tiles.ts";

/** Mod forms are keyed by the doll id plus this offset. */
export const MOD_ID_OFFSET = 20000;

/** Most dummy links a doll can have. */
export const MAX_LINKS = 5;

/** Highest skill level. */
export const MAX_SKILL_LEVEL = 10;

/** Most dolls in one echelon. */
export const MAX_ECHELON = 5;

/** Highest Mod stage. */
const MAX_MOD_STAGE = 3;

/** Most crit rate a doll can have, as a percentage. */
const CRIT_CAP = 100;

/** Which doll stat each tile effect code raises. */
const TILE_STAT: Record<TileStatCode, StatKey> = { 1: "dmg", 2: "rof", 3: "acc", 4: "eva", 5: "crit", 6: "skillCd", 8: "armor" };

/** Stats a tile raises by a percentage of their value, rounded down. */
const PERCENT_STATS: readonly StatKey[] = ["dmg", "rof", "acc", "eva", "armor"];

/** Stats affection raises. */
const AFFECTION_STATS: readonly StatKey[] = ["dmg", "acc", "eva"];

/** Affection buckets: normal, 90 and above, Oath. */
export type AffectionLevel = 0 | 1 | 2;

/** One doll's place and settings in the echelon. */
export interface DollSetup {
	/** Cell on the grid, 0 to 8. */
	cell: number;
	/** Doll id. */
	dollId: number;
	/** 0 for the base form, 1 to 3 for Mod stages. */
	modStage: number;
	/** Level, 1 to the stage's cap. */
	level: number;
	/** Dummy links, 1 to 5. */
	links: number;
	/** Affection bucket. */
	affection: AffectionLevel;
	/** Skill 1 level, 1 to 10. */
	skill1: number;
	/** Skill 2 level, 1 to 10. Ignored when the form has no second skill. */
	skill2: number;
}

/** A doll's stats. */
export interface DollStats {
	/** HP across all links. */
	hp: number;
	/** Damage. */
	dmg: number;
	/** Accuracy. */
	acc: number;
	/** Evasion. */
	eva: number;
	/** Rate of fire. */
	rof: number;
	/** Armor. */
	armor: number;
	/** Crit rate, as a percentage. */
	crit: number;
	/** Armor piercing. */
	armorPiercing: number;
	/** Clip size for MG and SG, 0 otherwise. */
	clip: number;
	/** Skill cooldown reduction, as a percentage. */
	skillCd: number;
}

/** A stat of `DollStats`. */
export type StatKey = keyof DollStats;

/** One change to a stat on top of its level value. */
export interface Contribution {
	/** The stat changed. */
	stat: StatKey;
	/** What changed it. */
	source: "links" | "affection" | "tiles" | "cap";
	/** The change in the stat's own units. Negative for a cap. */
	amount: number;
	/** For tiles, the cells of the dolls giving the buff. Empty otherwise. */
	fromCells: number[];
}

/** A doll's result. */
export interface EffectiveDoll {
	/** Its setup. */
	setup: DollSetup;
	/** Its form. */
	form: FormationForm;
	/** Stats at its level for one link, before anything else. */
	base: DollStats;
	/** Final stats. */
	stats: DollStats;
	/** Every change from `base` to `stats`, in the order applied. */
	breakdown: Contribution[];
	/** Whether rate of fire hit the form's cap. */
	rofCapped: boolean;
	/** Tile buffs on its cell that apply to it. */
	tileSources: TileSource[];
}

/** A setup whose form the data has. */
export interface PlacedForm {
	/** The doll's setup. */
	setup: DollSetup;
	/** The form it uses. */
	form: FormationForm;
}

/**
 * The form a setup uses.
 *
 * @param setup The doll id and Mod stage.
 * @param forms Formation forms by gun id.
 * @returns The form, or undefined when the data has none.
 */
export function formFor(setup: Pick<DollSetup, "dollId" | "modStage">, forms: Record<string, FormationForm>): FormationForm | undefined {
	return forms[String(setup.modStage > 0 ? setup.dollId + MOD_ID_OFFSET : setup.dollId)];
}

/**
 * The level cap at a Mod stage.
 *
 * @param modStage 0 for the base form, 1 to 3 for Mod stages.
 * @param constants Formation constants.
 * @returns The cap.
 */
export function levelCap(modStage: number, constants: FormationConstants): number {
	return constants.modLevelCaps[modStage] ?? constants.modLevelCaps[0] ?? 100;
}

/**
 * The highest Mod stage a doll can take.
 *
 * @param dollId Doll id.
 * @param forms Formation forms by gun id.
 * @returns 3 when the doll has a Mod, otherwise 0.
 */
export function maxModStage(dollId: number, forms: Record<string, FormationForm>): number {
	return forms[String(dollId + MOD_ID_OFFSET)] ? MAX_MOD_STAGE : 0;
}

/**
 * The affection bonus as a fraction.
 *
 * @param level Affection bucket.
 * @param constants Formation constants.
 * @returns The fraction added to 1.
 */
export function affectionMultiplier(level: AffectionLevel, constants: FormationConstants): number {
	return level === 2 ? constants.affection.oath : level === 1 ? constants.affection.high : constants.affection.normal;
}

/**
 * The setups whose form the data has, paired with that form.
 *
 * @param setups The echelon.
 * @param forms Formation forms by gun id.
 * @returns One entry per setup with a form, in the order given.
 */
export function placedForms(setups: readonly DollSetup[], forms: Record<string, FormationForm>): PlacedForm[] {
	return setups.flatMap((setup) => {
		const form = formFor(setup, forms);
		return form ? [{ setup, form }] : [];
	});
}

/**
 * Every buff landing on every cell from the placed dolls.
 *
 * @param placed Placed dolls from `placedForms`.
 * @param constants Formation constants.
 * @returns Sources per cell, indexed by cell.
 */
export function placedSources(placed: readonly PlacedForm[], constants: FormationConstants): TileSource[][] {
	return tileSources(
		placed.map(({ setup, form }) => ({ cell: setup.cell, form, links: setup.links })),
		constants
	);
}

/**
 * Work out every doll's effective stats.
 *
 * @param setups The echelon. Setups whose form is missing from `forms` are skipped.
 * @param forms Formation forms by gun id.
 * @param constants Formation constants.
 * @param sources Tile buffs per cell for these setups, when the caller already has them. Worked out here otherwise.
 * @returns One result per placed doll, in the order given.
 */
export function effectiveEchelon(setups: readonly DollSetup[], forms: Record<string, FormationForm>, constants: FormationConstants, sources?: readonly (readonly TileSource[])[]): EffectiveDoll[] {
	const placed = placedForms(setups, forms);
	const cellSources = sources ?? placedSources(placed, constants);
	return placed.map(({ setup, form }) => {
		const level = levelStats(form, constants.stats, setup.level);
		const base: DollStats = { ...level, crit: form.crit, armorPiercing: form.armorPiercing, clip: form.clip, skillCd: 0 };
		const stats: DollStats = { ...base };
		const breakdown: Contribution[] = [];
		const change = (stat: StatKey, next: number, source: Contribution["source"], fromCells: number[] = []) => {
			const amount = next - stats[stat];
			if (amount !== 0) {
				breakdown.push({ stat, source, amount, fromCells });
				stats[stat] = next;
			}
		};

		change("hp", stats.hp * setup.links, "links");
		const affection = affectionMultiplier(setup.affection, constants);
		for (const stat of AFFECTION_STATS) {
			change(stat, Math.ceil(stats[stat] * (1 + affection)), "affection");
		}

		const mine = (cellSources[setup.cell] ?? []).filter((source) => appliesTo(source, form.type));
		const byStat = new Map<StatKey, TileSource[]>();
		for (const source of mine) {
			const stat = TILE_STAT[source.code];
			byStat.set(stat, [...(byStat.get(stat) ?? []), source]);
		}
		for (const [stat, list] of byStat) {
			const percent = list.reduce((sum, source) => sum + source.value, 0);
			const fromCells = [...new Set(list.map((source) => source.fromCell))];
			if (PERCENT_STATS.includes(stat)) {
				change(stat, Math.floor(stats[stat] * (1 + percent / 100)), "tiles", fromCells);
			} else {
				// Crit and skill cooldown record the full tile buff, then a separate cap entry when they go past their limit, like RoF.
				const [next, limit] = stat === "crit" ? [Math.round(stats.crit * (1 + percent / 100) * 10) / 10, CRIT_CAP] : [stats.skillCd + percent, constants.skillCdLimit];
				change(stat, next, "tiles", fromCells);
				if (next > limit) {
					change(stat, limit, "cap");
				}
			}
		}

		const rofCapped = stats.rof > form.rofCap;
		if (rofCapped) {
			change("rof", form.rofCap, "cap");
		}
		return { setup, form, base, stats, breakdown, rofCapped, tileSources: mine };
	});
}
