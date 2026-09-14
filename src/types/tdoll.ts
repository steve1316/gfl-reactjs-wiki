/**
 * The T-Doll data model, split into what the data files hold and what pages consume.
 *
 * The two are genuinely different shapes. The generated JSON from `tools/data/import.mjs` describes a doll's
 * stats and skills but says nothing about images, while pages need every asset URL resolved. Describing both
 * with one interface would mean marking the asset fields optional everywhere and null-checking them
 * on every use, so they are kept apart: `Raw*` is what is written down, and the rest is what comes
 * out of `processData`.
 */

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

/** A doll's visible skins. Skins with art come first, in the order of their `skinN` art slots. */
export interface RawSkins {
	/** How many skins the doll has, equal to the length of both lists. */
	number_of_skins: number;
	/** Official English skin names. */
	skin_names: string[];
	/** Upstream skin ids, parallel to `skin_names`. Null for a skin with hosted art but no upstream record, such as merch-only skins. */
	skin_ids: (number | null)[];
}

/** One row of a form's real-world gun spec sheet, taken from IOPWiki. */
export interface SpecRow {
	/** The spec's name, such as `Cartridge` or `Rate of fire`. */
	label: string;
	/** The spec's value as plain text, such as `5.56x45mm NATO`. */
	value: string;
}

/** How precisely a doll's Global release date is known. */
export type ReleasePrecision = "day" | "month" | "launch" | "unknown";

/** When a doll arrived on the Global server. */
export interface DollRelease {
	/** `YYYY-MM-DD` for `day`, `YYYY-MM` for `month` and `launch`, and null for `unknown`. */
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
	/** The gun's spec sheet in IOPWiki's order. Empty when IOPWiki has none, as for most collaboration dolls. */
	specs: SpecRow[];
}

/** A doll exactly as generated, before any asset resolution. */
export interface RawTDoll {
	normal: RawForm;
	/** `null` for the majority of dolls, which have no Mod. */
	mod: RawForm | null;
	/** `null` when the doll has no skins. */
	skins: RawSkins | null;
	/** Faction, maker, country, release date and IOPWiki page, shared by every form. */
	profile: DollProfile;
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
	/** Faction, maker, country, release date and IOPWiki page, shared by every form. */
	profile: DollProfile;
	/** Every form the manifest knows about, keyed by form name. */
	forms: Record<string, FormAssets>;
	/** Skill icon URLs, keyed `skill1` and `skill2`. */
	skillImages: Partial<Record<"skill1" | "skill2", string>>;
	/** Spine bundles for this doll, empty when none were published. */
	spine: SpineBundle[];
}
