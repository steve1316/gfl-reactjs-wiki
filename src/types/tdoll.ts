/**
 * The T-Doll data model, split into what the data files hold and what pages consume.
 *
 * The two are genuinely different shapes. The literals in `src/data/*.js` describe a doll's stats and
 * skills but say nothing about images, while pages need every asset URL resolved. Describing both
 * with one interface would mean marking the asset fields optional everywhere and null-checking them
 * on every use, so they are kept apart: `Raw*` is what is written down, and the rest is what comes
 * out of `processData`.
 */

/** Skill and tile stat arrays mix numbers and formatted strings such as `"24%"`. */
export type StatValue = string | number;

/** One skill's per-level values. */
export type StatArray = StatValue[];

/**
 * A skill as written in the data files.
 *
 * Skills carry a variable number of stat arrays, `stat1` through `stat17`, most of them absent. They
 * pair with `number_of_stats` and fill the `#(n)` placeholders in `description` in order.
 */
export interface RawSkill {
	name: string;
	initial_cooldown: string;
	/** Absent on a few passive skills that never come off cooldown. */
	cooldown?: StatArray;
	description: string;
	number_of_stats: number;
	/** Marks a skill whose description text describes a passive rather than an activated effect. */
	passive_active_description?: boolean;
	passive_passive_description?: boolean;
	passive_passive_active_description?: boolean;
	[stat: `stat${number}`]: StatArray | undefined;
}

/** A doll's 3x3 tile buff grid and the buffs it grants. */
export interface RawTileSet {
	row1: number[];
	row2: number[];
	row3: number[];
	targets: string;
	number_of_stats: number;
	stat1: string[];
	stat2: string[];
}

/**
 * Which optional animations a form has.
 *
 * These flags are what the generated manifest replaces. They are kept on the raw type because the
 * data files still carry them, but `processData` prefers the manifest.
 */
export interface RawAnimationFlags {
	hasSkillAnimation: boolean;
	hasVictoryLoopAnimation: boolean;
	hasAttack2Animation?: boolean;
	hasWait2Animation?: boolean;
	hasActionAnimation?: boolean;
}

/** Skins are described in aggregate rather than as a list of individual skin objects. */
export interface RawSkins {
	number_of_skins: number;
	skin_names: string[];
	animations: Record<string, boolean>;
	animations_dorm: Record<string, boolean>;
}

/** One form of a doll: its base state, its Mod, or one of its skins. */
export interface RawForm {
	id: number;
	name: string;
	type: string;
	rarity: number;
	max_hp: number;
	max_dmg: number;
	max_acc: number;
	max_eva: number;
	max_rof: number;
	/** Only Armored HGs and a few others carry armour. */
	max_armor?: number;
	skill: RawSkill;
	/** Mod forms gain a second skill. */
	skill2?: RawSkill;
	tile_set: RawTileSet;
	animations: RawAnimationFlags;
}

/** A doll exactly as written in `src/data/*.js`, before any asset resolution. */
export interface RawTDoll {
	normal: RawForm;
	/** `null` for the majority of dolls, which have no Mod. */
	mod: RawForm | null;
	/** `null` when the doll has no skins. */
	skins: RawSkins | null;
}

/** Resolved asset URLs for one form. */
export interface FormAssets {
	/** Portrait URLs. Mod-skin forms have only `card` and `card_damaged`. */
	images: Partial<Record<"card" | "card_damaged" | "full" | "full_damaged", string>>;
	/** Combat animation URLs, keyed by animation name. */
	animations: Record<string, string>;
	/** Dorm animation URLs, keyed by animation name. */
	dormAnimations: Record<string, string>;
}

/** A form with its assets attached. */
export interface TDollForm extends RawForm {
	assets: FormAssets;
}

/** One Spine bundle: the skeleton, its atlas and its page image. */
export interface SpineBundle {
	name: string;
	skel?: string;
	atlas?: string;
	png?: string;
}

/**
 * A doll as pages consume it.
 *
 * Every asset URL is resolved, and the extra forms discovered in the manifest, such as `skin1` and
 * `mod_skin1`, are present alongside the two the data files name directly.
 */
export interface TDoll {
	normal: TDollForm;
	mod: TDollForm | null;
	skins: RawSkins | null;
	/** Every form the manifest knows about, keyed by form name. */
	forms: Record<string, FormAssets>;
	/** Skill icon URLs, keyed `skill1` and `skill2`. */
	skillImages: Partial<Record<"skill1" | "skill2", string>>;
	/** Spine bundles for this doll, empty when none were published. */
	spine: SpineBundle[];
}
