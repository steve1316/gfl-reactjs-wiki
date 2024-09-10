/**
 * Builds asset URLs against the published asset hosts.
 *
 * This replaces the dynamic template-literal `require()` calls that used to live in
 * `processData.js` and `equipments.js`. Webpack turned each of those into a context module that
 * bundled every file matching the pattern, which is why the build output ran to gigabytes. Rollup
 * cannot resolve them at all, so they had to go regardless.
 *
 * Paths are derived rather than looked up, because the skin-id layout fully determines them from the doll id, form and kind. The manifest
 * is consulted only for what naming cannot tell us: which assets exist.
 */

import type { CardKind, ImageKind } from "../types/manifest";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Hosts

/** Cards, skill icons, equipment, UI and Spine data. */
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL;

/** Full art, split onto its own host to stay under the 1 GB per-site GitHub Pages cap. */
const ART_BASE = import.meta.env.VITE_ART_BASE_URL;

/** Filenames for each portrait kind inside a form folder. */
const IMAGE_FILE: Record<ImageKind, string> = {
	card: "card.webp",
	card_damaged: "card_d.webp",
	full: "full.webp",
	full_damaged: "full_d.webp"
};

/** Full art lives on a different host from everything else. */
const ART_KINDS: ReadonlySet<string> = new Set<ImageKind>(["full", "full_damaged"]);

/** Prefix of a skin's form key, as in `skin-805` or `skin-legacy-marching-band`. */
const SKIN_FORM_PREFIX = "skin-";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// URL construction

/**
 * Join a path onto a base URL, encoding each segment.
 *
 * @param base Base URL, with or without a trailing slash.
 * @param path Unencoded path relative to the base.
 * @returns An absolute, encoded URL.
 */
function join(base: string, path: string): string {
	const encoded = path.split("/").map(encodeURIComponent).join("/");
	return `${base.replace(/\/$/, "")}/${encoded}`;
}

/**
 * The form key of a skin, shared by the doll page, the art viewer's `form=` parameter and `TDoll.forms`.
 *
 * @param skinKey The skin's id, or a `legacy-<slug>` key for art only the old asset repos hosted.
 * @returns The form key, such as `skin-805`.
 */
export function skinFormKey(skinKey: string | number): string {
	return `${SKIN_FORM_PREFIX}${skinKey}`;
}

/**
 * The skin key inside a skin's form key.
 *
 * @param form A form key such as `normal`, `mod` or `skin-805`.
 * @returns The skin key, or null when the form is not a skin.
 */
export function skinKeyOf(form: string): string | null {
	return form.startsWith(SKIN_FORM_PREFIX) ? form.slice(SKIN_FORM_PREFIX.length) : null;
}

/**
 * Folder holding one form's portraits, relative to either host.
 *
 * @param id Doll id.
 * @param form Form key: `normal`, `mod` or a `skinFormKey`.
 * @returns The folder, such as `tdolls/65/skins/805`.
 */
function formFolder(id: number, form: string): string {
	const skinKey = skinKeyOf(form);
	if (skinKey !== null) {
		return `tdolls/${id}/skins/${skinKey}`;
	}
	return form === "mod" ? `tdolls/${id}/mod` : `tdolls/${id}`;
}

/**
 * URL for one portrait.
 *
 * @param id Doll id.
 * @param form Form key: `normal`, `mod` or a `skinFormKey`.
 * @param kind Which portrait to build.
 * @returns An absolute URL on whichever host serves that kind.
 */
export function imageUrl(id: number, form: string, kind: ImageKind): string {
	const base = ART_KINDS.has(kind) ? ART_BASE : ASSET_BASE;
	return join(base, `${formFolder(id, form)}/${IMAGE_FILE[kind]}`);
}

/**
 * URL for a skin's card as worn by the Mod, which sits next to the skin's own card.
 *
 * @param id Doll id.
 * @param skinKey The skin's key.
 * @param kind Which card to build.
 * @returns An absolute URL.
 */
export function modSkinCardUrl(id: number, skinKey: string, kind: CardKind): string {
	return join(ASSET_BASE, `${formFolder(id, skinFormKey(skinKey))}/mod_${IMAGE_FILE[kind]}`);
}

/**
 * URL for a skill icon.
 *
 * @param id Doll id.
 * @param skill Either `skill1` for the base skill or `skill2` for the Mod skill.
 * @returns An absolute URL.
 */
export function skillImageUrl(id: number, skill: string): string {
	return join(ASSET_BASE, `tdolls/${id}/${skill}.png`);
}

/**
 * URL for one file inside a Spine bundle.
 *
 * @param id Doll id.
 * @param rigPath Rig path from the Spine index, relative to the doll's Spine folder, such as `skins/805/HK416_805`.
 * @param extension File extension without the dot, one of `skel`, `atlas` or `png`.
 * @returns An absolute URL.
 */
export function spineUrl(id: number, rigPath: string, extension: string): string {
	return join(ASSET_BASE, `spine/${id}/${rigPath}.${extension}`);
}

/**
 * Directory holding a Spine atlas's page images, with a trailing slash.
 *
 * The atlas refers to its page by bare filename, so the runtime needs the directory to resolve it. Mod and skin rigs keep their files in
 * a subfolder, which is why this is derived from the atlas path rather than assumed to be the doll's root.
 *
 * @param id Doll id.
 * @param atlasPath Atlas path from the Spine index, possibly including a subfolder.
 * @returns An absolute URL ending in a slash.
 */
export function spineImageBase(id: number, atlasPath: string): string {
	const directory = atlasPath.includes("/") ? atlasPath.slice(0, atlasPath.lastIndexOf("/")) : "";
	return `${join(ASSET_BASE, `spine/${id}${directory ? `/${directory}` : ""}`)}/`;
}

/**
 * URL for an equipment icon.
 *
 * @param id Equipment id.
 * @returns An absolute URL.
 */
export function equipmentIconUrl(id: number): string {
	return join(ASSET_BASE, `equipment/${id}.png`);
}

/**
 * URL for a top-level UI image.
 *
 * @param name Filename including its extension, such as `mod.png`.
 * @returns An absolute URL.
 */
export function uiUrl(name: string): string {
	return join(ASSET_BASE, name);
}
