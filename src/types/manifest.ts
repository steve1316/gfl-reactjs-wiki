/** Types for the generated `assets-manifest.json`, version 3 (the skin-id layout). */

/** The four portrait kinds a form can have. */
export type ImageKind = "card" | "card_damaged" | "full" | "full_damaged";

/** The two card kinds, the only portraits a skin has when worn by the Mod. */
export type CardKind = "card" | "card_damaged";

/** What one form of one doll has available. */
export interface ManifestForm {
	/** Which portrait kinds exist for this form. */
	images: ImageKind[];
}

/** What one skin has available. */
export interface ManifestSkin extends ManifestForm {
	/** Which cards exist for the skin as worn by the Mod. Absent when the skin has no Mod-coloured cards. */
	modImages?: CardKind[];
}

/** The two portrait kinds a HOC has. */
export type HocImageKind = "card" | "full";

/** What one doll has available, across all of its forms. */
export interface ManifestDoll {
	/** The base form. */
	normal: ManifestForm;
	/** The Mod form, present only for dolls with Mod art. */
	mod?: ManifestForm;
	/** Skins keyed by skin id as a string, or by a `legacy-<slug>` key for art only the old asset repos hosted. */
	skins?: Record<string, ManifestSkin>;
	/** Which skill icons exist. */
	skills: ("skill1" | "skill2")[];
}

/** The manifest. Asset paths are derived from the doll id, form and kind, so only presence is stored. */
export interface AssetsManifest {
	/** Format version. */
	version: 3;
	/** The portrait kinds, in a stable order. */
	imageKinds: ImageKind[];
	/** Ids of the equipment items that have an icon. */
	equipment: number[];
	/** Every doll with art, keyed by stringified id. */
	dolls: Record<string, ManifestDoll>;
	/** Which portrait kinds exist for each HOC with art, keyed by stringified id. Absent when no HOC art has been merged in yet. */
	hocs?: Record<string, HocImageKind[]>;
}
