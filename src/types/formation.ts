/** Types for the generated formation data under `src/data/formation/` and the formation engine in `src/lib/formation/`. */

/** Upstream tile effect codes: 1 damage, 2 rate of fire, 3 accuracy, 4 evasion, 5 crit rate, 6 skill cooldown, 8 armor. */
export type TileStatCode = 1 | 2 | 3 | 4 | 5 | 6 | 8;

/** A form's stat ratios from `stc/gun.json`, as percentages (100 is normal). */
export interface FormationStatRatios {
	/** HP ratio. */
	life: number;
	/** Damage ratio. */
	pow: number;
	/** Rate of fire ratio. */
	rate: number;
	/** Accuracy ratio. */
	hit: number;
	/** Evasion ratio. */
	dodge: number;
	/** Armor ratio. */
	armor: number;
}

/** A form's tile buffs in numeric form. */
export interface FormationTile {
	/** The doll's own cell on the 3x3 tile illustration as [row, column], matching the doll page's tile grid. */
	self: [number, number];
	/** Buffed cells relative to the doll as [row offset, column offset]. Row grows downward, column grows toward the front. */
	offsets: [number, number][];
	/** Upstream doll type ids the buffs apply to. Empty means every type. */
	targets: number[];
	/** Buffs as [effect code, value]. Values are percentages, and handgun values are the one-link base value. */
	effects: [TileStatCode, number][];
}

/** One T-Doll form, base or Mod, keyed in `dolls.json` by its gun id (doll id, or doll id + 20000 for the Mod). */
export interface FormationForm {
	/** The gun id: the doll id for a base form, the doll id plus 20000 for a Mod. */
	id: number;
	/** The doll id shared by the base form and its Mod. */
	dollId: number;
	/** Whether this is the Mod form. */
	mod: boolean;
	/** Upstream type id: 1 HG, 2 SMG, 3 RF, 4 AR, 5 MG, 6 SG. */
	type: number;
	/** Stat ratios. */
	ratio: FormationStatRatios;
	/** Growth ratio for damage, accuracy, evasion and rate of fire, as a percentage. */
	eatRatio: number;
	/** Base crit rate as a percentage. */
	crit: number;
	/** Base armor piercing. */
	armorPiercing: number;
	/** The form's own rate of fire cap. */
	rofCap: number;
	/** Clip size for MG and SG forms, 0 for every other type. */
	clip: number;
	/** Whether the form has a second skill. */
	hasSkill2: boolean;
	/** Tile buffs. */
	tile: FormationTile;
}

/** Per-type stat multipliers from `catchdata/gun_type_info.json`. */
export interface FormationTypeMultipliers {
	/** HP multiplier. */
	life: number;
	/** Damage multiplier. */
	pow: number;
	/** Rate of fire multiplier. */
	rate: number;
	/** Accuracy multiplier. */
	hit: number;
	/** Evasion multiplier. */
	dodge: number;
	/** Armor multiplier. */
	armor: number;
}

/** The constants the growth formula reads. */
export interface FormationStatConstants {
	/** `game_config_info` growth parameters by name, such as `power_grow_after100`, each a list of numbers. */
	params: Record<string, number[]>;
	/** Type multipliers keyed by type id as a string. */
	types: Record<string, FormationTypeMultipliers>;
}

/** Affection stat multipliers, as fractions added to 1. */
export interface FormationAffection {
	/** Affection 10 to 89. */
	normal: number;
	/** Affection 90 to 139. */
	high: number;
	/** Oath, affection 140 and above. */
	oath: number;
}

/** Everything in `constants.json`. */
export interface FormationConstants {
	/** Growth formula constants. */
	stats: FormationStatConstants;
	/** Handgun tile growth as [base, per link]: a handgun tile value is multiplied by base + per link x links. */
	hgTileGrowth: number[];
	/** Level cap per Mod stage: index 0 is the base form, 1 to 3 are Mod stages. */
	modLevelCaps: number[];
	/** Affection multipliers. */
	affection: FormationAffection;
	/** Skill cooldown reduction cap, as a percentage. */
	skillCdLimit: number;
}

/** A form's base stats at a level. */
export interface FormationBaseStats {
	/** HP for one link. */
	hp: number;
	/** Damage. */
	dmg: number;
	/** Accuracy. */
	acc: number;
	/** Evasion. */
	eva: number;
	/** Rate of fire. */
	rof: number;
	/** Armor, 0 when the form has none. */
	armor: number;
}

/** The loaded formation data set. */
export interface FormationData {
	/** Forms keyed by gun id as a string. */
	forms: Record<string, FormationForm>;
	/** Shared constants. */
	constants: FormationConstants;
}
