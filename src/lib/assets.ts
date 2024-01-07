/**
 * Builds asset URLs against the published asset hosts.
 *
 * This replaces the dynamic template-literal `require()` calls that used to live in
 * `processData.js` and `equipments.js`. Webpack turned each of those into a context module that
 * bundled every file matching the pattern, which is why the build output ran to gigabytes. Rollup
 * cannot resolve them at all, so they had to go regardless.
 *
 * Paths are derived rather than looked up, because the naming is fully determined by the doll id,
 * form and kind. The manifest is consulted only for what naming cannot tell us: which assets exist.
 */

import type { ImageKind } from "../types/manifest";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Hosts

/** Cards, skill icons, equipment, UI and Spine data. */
const ASSET_BASE = import.meta.env.VITE_ASSET_BASE_URL;

/** Full art, split onto its own host to stay under the 1 GB per-site GitHub Pages cap. */
const ART_BASE = import.meta.env.VITE_ART_BASE_URL;

/** Filename suffixes for each portrait kind. */
const IMAGE_SUFFIX: Record<ImageKind, string> = {
	card: "card",
	card_damaged: "card_d",
	full: "full",
	full_damaged: "full_d"
};

/** Full art lives on a different host from everything else. */
const ART_KINDS: ReadonlySet<string> = new Set<ImageKind>(["full", "full_damaged"]);

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// URL construction

/**
 * Join a path onto a base URL, encoding each segment.
 *
 * Encoding matters more than it looks. Equipment filenames contain spaces and plus signs, as in
 * `Performance+ Cartridge.png`. `encodeURI` leaves the plus alone and some servers then read it as a
 * space, so each segment goes through `encodeURIComponent` instead.
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
 * Build the filename prefix for a form.
 *
 * Portraits omit the form for the base state (`110_card.png`), while animations always spell it out
 * (`110_normal_attack.gif`). The two are not interchangeable.
 *
 * @param id Doll id.
 * @param form Form name such as `normal`, `mod` or `mod_skin1`.
 * @returns The filename prefix, without a trailing underscore.
 */
function formPrefix(id: number, form: string): string {
	return form === "normal" ? `${id}` : `${id}_${form}`;
}

/**
 * URL for one portrait.
 *
 * @param id Doll id.
 * @param form Form name.
 * @param kind Which portrait to build.
 * @returns An absolute URL on whichever host serves that kind.
 */
export function imageUrl(id: number, form: string, kind: ImageKind): string {
	const base = ART_KINDS.has(kind) ? ART_BASE : ASSET_BASE;
	return join(base, `tdolls/${id}/${formPrefix(id, form)}_${IMAGE_SUFFIX[kind]}.png`);
}

/**
 * URL for one combat animation.
 *
 * @param id Doll id.
 * @param form Form name.
 * @param name Animation name such as `attack` or `victoryloop`.
 * @returns An absolute URL.
 */
export function animationUrl(id: number, form: string, name: string): string {
	return join(ASSET_BASE, `tdolls/${id}/animations/${id}_${form}_${name}.gif`);
}

/**
 * URL for one dorm animation.
 *
 * @param id Doll id.
 * @param form Form name.
 * @param name Dorm animation name such as `sit` or `lying`.
 * @returns An absolute URL.
 */
export function dormAnimationUrl(id: number, form: string, name: string): string {
	return join(ASSET_BASE, `tdolls/${id}/animations/${id}_${form}_dorm_${name}.gif`);
}

/**
 * URL for a skill icon.
 *
 * @param id Doll id.
 * @param skill Either `skill1` for the base skill or `skill2` for the Mod skill.
 * @returns An absolute URL.
 */
export function skillImageUrl(id: number, skill: string): string {
	return join(ASSET_BASE, `tdolls/${id}/${id}_${skill}.png`);
}

/**
 * URL for one file inside a Spine bundle.
 *
 * @param id Doll id.
 * @param bundle Bundle name, such as `FG42`.
 * @param extension File extension without the dot, one of `skel`, `atlas` or `png`.
 * @returns An absolute URL.
 */
export function spineUrl(id: number, bundle: string, extension: string): string {
	return join(ASSET_BASE, `spine/${id}/${bundle}.${extension}`);
}

/**
 * Directory holding a Spine atlas's page images, with a trailing slash.
 *
 * The atlas refers to its page by bare filename, so the runtime needs the directory to resolve it.
 * Some dolls keep their Spine files in a subdirectory, which is why this is derived from the atlas
 * path rather than assumed to be the doll's root.
 *
 * @param id Doll id.
 * @param atlasPath Atlas basename from the Spine index, possibly including a subdirectory.
 * @returns An absolute URL ending in a slash.
 */
export function spineImageBase(id: number, atlasPath: string): string {
	const directory = atlasPath.includes("/") ? atlasPath.slice(0, atlasPath.lastIndexOf("/")) : "";
	return `${join(ASSET_BASE, `spine/${id}${directory ? `/${directory}` : ""}`)}/`;
}

/**
 * URL for an equipment icon.
 *
 * @param category Category directory, such as `chip`.
 * @param name Equipment name without the extension.
 * @returns An absolute URL.
 */
export function equipmentUrl(category: string, name: string): string {
	return join(ASSET_BASE, `equipment/${category}/${name}.png`);
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
