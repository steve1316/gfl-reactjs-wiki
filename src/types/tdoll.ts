/**
 * The T-Doll data model, split into what the data files hold and what pages consume.
 *
 * The two are genuinely different shapes. The generated JSON from `tools/data/import.mjs` describes a doll's
 * stats and skills but says nothing about images, while pages need every asset URL resolved. Describing both
 * with one interface would mean marking the asset fields optional everywhere and null-checking them
 * on every use, so they are kept apart: `Raw*` is what is written down, and the rest is what comes
 * out of `processData`.
 */

import type { CardKind, ImageKind } from "./manifest";

/** Skill and tile stat arrays mix numbers and formatted strings such as `"24%"`. */
export type StatValue = string | number;

/** One skill's per-level values. */
export type StatArray = StatValue[];

/**
 * A skill as generated.
 *
 * Skills carry a variable number of stat arrays, `stat1` through `statN`, paired with `number_of_stats`. Each fills the matching `#1..#n`
 * placeholder in `description`, with values taken from upstream per-level text.
 */
export interface RawSkill {
	name: string;
	initial_cooldown: string;
	/** Absent on a few passive skills that never come off cooldown. */
	cooldown?: StatArray;
	description: string;
	number_of_stats: number;
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

/** A doll's visible skins: skin table skins in id order, then the extra skins from `tools/data/extra-skins.json`. */
export interface RawSkins {
	/** How many skins the doll has, equal to the length of both lists. */
	number_of_skins: number;
	/** Official English skin names. */
	skin_names: string[];
	/** Skin keys, parallel to `skin_names`: a numeric skin id, a `legacy-<slug>` key for art only the old repos hosted, or null for a hand-written skin. */
	skin_ids: (number | string | null)[];
}

/** One row of a form's real-world gun spec sheet, taken from the game's own profile text in gf-data-us. */
export interface SpecRow {
	/** The spec's name, such as `Cartridge` or `Rate of fire`. */
	label: string;
	/** The spec's value as plain text, such as `5.56x45mm NATO`. */
	value: string;
}

/** How precisely a doll's Global release date is known. `unreleased` marks dolls that never came to Global. */
export type ReleasePrecision = "day" | "month" | "launch" | "unknown" | "unreleased";

/** When a doll arrived on the Global server. */
export interface DollRelease {
	/** `YYYY-MM-DD` for `day`, `YYYY-MM` for `month` and `launch`, and null for `unknown` and `unreleased`. */
	date: string | null;
	/** How precise `date` is. `launch` marks the dolls on the Global launch roster of May 2018. */
	precision: ReleasePrecision;
}

/** Where a doll's profile came from and what it says about the doll. */
export interface DollProfile {
	/** Factions the doll belongs to, such as `Squad 404`. Empty when unknown. */
	faction: string[];
	/** Real-world makers of the doll's gun. Empty for collaboration dolls and when unknown. */
	manufacturer: string[];
	/** Countries of origin, or the franchise for collaboration dolls. Empty when unknown. */
	country: string[];
	/** The doll's Global release date at its known precision. */
	release: DollRelease;
	/** The gun's full name, such as `Heckler & Koch HK416`, or null when IOPWiki gives none. */
	fullName: string | null;
	/** Title of the doll's IOPWiki page, or null when no page was matched. */
	iopwikiTitle: string | null;
	/** Sources that filled the profile. `wikidata` appears only when it filled a missing manufacturer or country. */
	sources: ("iopwiki" | "wikidata")[];
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
}

/** A doll exactly as generated, before any asset resolution. */
export interface RawTDoll {
	normal: RawForm;
	/** `null` for the majority of dolls, which have no Mod. */
	mod: RawForm | null;
	/** `null` when the doll has no skins. */
	skins: RawSkins | null;
	/** A copy of the profile's release date, kept in the shard so the T-Doll index can sort by it without loading the profiles. */
	release: DollRelease;
}

/** A doll's spec sheets, one per form. */
export interface DollSpecs {
	/** The base form's sheet in the game's order. Empty when the game has no spec text, as for most collaboration dolls. */
	normal: SpecRow[];
	/** The Mod's sheet, or null when the doll has no Mod or the Mod's sheet matches the base form's, so the page shows `normal`. */
	mod: SpecRow[] | null;
}

/**
 * A doll's profile and spec sheets, as generated in the `profiles-*.json` side file next to its shard.
 *
 * Kept out of `RawTDoll` so the T-Doll index, which loads every shard, never downloads them. Only the doll page loads the side file.
 */
export interface DollDetails {
	/** Faction, maker, country, release date and IOPWiki page, shared by every form. */
	profile: DollProfile;
	/** The gun's spec sheets. */
	specs: DollSpecs;
}

/** Resolved asset URLs for one form. */
export interface FormAssets {
	/** Portrait URLs, keyed by the kinds the manifest lists for the form. */
	images: Partial<Record<ImageKind, string>>;
	/** Card URLs for a skin worn by the Mod. Present only on skin forms that have Mod-coloured cards. */
	modImages?: Partial<Record<CardKind, string>>;
}

/** A form with its assets attached. */
export interface TDollForm extends RawForm {
	/** The form's resolved portrait URLs, empty when no art is hosted. */
	assets: FormAssets;
}

/**
 * A doll as pages consume it.
 *
 * Every asset URL is resolved, and every skin with hosted art is present in `forms` under its `skin-<skinKey>` key beside `normal` and `mod`.
 */
export interface TDoll {
	/** The base form. */
	normal: TDollForm;
	/** The Mod form, or null when the doll has no Mod. */
	mod: TDollForm | null;
	/** The doll's skins, or null when it has none. */
	skins: RawSkins | null;
	/** The doll's Global release date at its known precision. */
	release: DollRelease;
	/** Every form the manifest knows about, keyed `normal`, `mod` or `skin-<skinKey>`. */
	forms: Record<string, FormAssets>;
	/** Skill icon URLs, keyed `skill1` and `skill2`. */
	skillImages: Partial<Record<"skill1" | "skill2", string>>;
}

/** A doll with its profile and spec sheets attached, as `loadDollDetails` returns it for the doll page. */
export interface TDollWithDetails extends TDoll, DollDetails {}
