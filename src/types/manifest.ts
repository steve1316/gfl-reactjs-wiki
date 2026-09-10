/** Types for the generated `assets-manifest.json`, version 2 (the compact format). */

/** The four portrait kinds a form can have. Mod-skin forms carry only the two card kinds. */
export type ImageKind = "card" | "card_damaged" | "full" | "full_damaged";

/** What one form of one doll has available. */
export interface ManifestForm {
	/** Which portrait kinds exist for this form. */
	images: ImageKind[];
	/** Indices into `animationNames` for the combat animations this form has. */
	a?: number[];
	/** Indices into `dormAnimationNames` for the dorm animations this form has. */
	d?: number[];
}

/** What one doll has available, across all of its forms. */
export interface ManifestDoll {
	/** Keyed by form name: `normal`, `mod`, `skin1`, `mod_skin1` and so on. */
	forms: Record<string, ManifestForm>;
	/** Which skill icons exist, as `skill1` and/or `skill2`. */
	skills?: string[];
	/** Spine bundles keyed by bundle name, each listing the file extensions present. */
	spine?: Record<string, string[]>;
}

/**
 * The compact manifest.
 *
 * Asset paths are derived from naming conventions rather than stored, which takes the file from
 * 700 KB to 116 KB. Animation names are shared vocabularies referenced by index.
 */
export interface AssetsManifest {
	version: 2;
	/** Vocabulary for `ManifestForm.a`. */
	animationNames: string[];
	/** Vocabulary for `ManifestForm.d`. */
	dormAnimationNames: string[];
	/** The portrait kinds, in a stable order. */
	imageKinds: ImageKind[];
	/** Equipment image names, keyed by category directory. */
	equipment: Record<string, string[]>;
	/** Every doll, keyed by stringified id. */
	dolls: Record<string, ManifestDoll>;
}
