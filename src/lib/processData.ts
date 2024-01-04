/**
 * Turns raw doll data into what pages consume, by attaching resolved asset URLs.
 *
 * The original `processData.js` mutated its argument, assigning `images` and a dozen animation keys
 * onto objects whose literals never declared them, then each data file called it at import time and
 * exported the mutated array. That made imports side-effectful, which in turn made the data modules
 * impossible to code-split. This version is pure, so the data files can be plain literals and the
 * work happens once, on demand, at the data-access boundary.
 *
 * It also drops the hardcoded conditionals the old version relied on. Which animations exist now
 * comes from the generated manifest rather than `hasSkillAnimation` flags and branches keyed on
 * specific doll ids, which between them missed `spattack`, `landing`, `crouch` and `dorm_action`.
 */

import manifestJson from "../data/assets-manifest.json";
import type { AssetsManifest, ImageKind, ManifestDoll, ManifestForm } from "../types/manifest";
import type { FormAssets, RawForm, RawTDoll, SpineBundle, TDoll, TDollForm } from "../types/tdoll";
import { animationUrl, dormAnimationUrl, imageUrl, skillImageUrl, spineUrl } from "./assets";

const manifest = manifestJson as unknown as AssetsManifest;

/**
 * Resolve every asset URL for one form.
 *
 * @param id Doll id.
 * @param form Form name such as `normal` or `mod_skin1`.
 * @param entry The manifest record describing what that form has.
 * @returns The form's resolved asset URLs.
 */
function buildFormAssets(id: number, form: string, entry: ManifestForm): FormAssets {
	const images: FormAssets["images"] = {};
	for (const kind of entry.images) {
		images[kind] = imageUrl(id, form, kind);
	}

	const animations: Record<string, string> = {};
	for (const index of entry.a ?? []) {
		const name = manifest.animationNames[index];
		if (name !== undefined) {
			animations[name] = animationUrl(id, form, name);
		}
	}

	const dormAnimations: Record<string, string> = {};
	for (const index of entry.d ?? []) {
		const name = manifest.dormAnimationNames[index];
		if (name !== undefined) {
			dormAnimations[name] = dormAnimationUrl(id, form, name);
		}
	}

	return { images, animations, dormAnimations };
}

/**
 * Attach a form's assets to its raw record.
 *
 * @param raw The raw form, or `null` when the doll has no such form.
 * @param id Doll id, which differs from `raw.id` for Mod forms.
 * @param form Form name.
 * @param record The doll's manifest record.
 * @returns The form with assets attached, or `null` when `raw` was `null`.
 */
function attach(raw: RawForm | null, id: number, form: string, record: ManifestDoll | undefined): TDollForm | null {
	if (raw === null) {
		return null;
	}
	const entry = record?.forms[form];
	const assets = entry ? buildFormAssets(id, form, entry) : { images: {}, animations: {}, dormAnimations: {} };
	return { ...raw, assets };
}

/**
 * Resolve one doll.
 *
 * @param raw A doll exactly as written in the data files.
 * @returns The doll with every asset URL resolved.
 */
export function processDoll(raw: RawTDoll): TDoll {
	const id = raw.normal.id;
	const record = manifest.dolls[String(id)];

	const forms: Record<string, FormAssets> = {};
	for (const [name, entry] of Object.entries(record?.forms ?? {})) {
		forms[name] = buildFormAssets(id, name, entry);
	}

	const skillImages: TDoll["skillImages"] = {};
	for (const skill of record?.skills ?? []) {
		if (skill === "skill1" || skill === "skill2") {
			skillImages[skill] = skillImageUrl(id, skill);
		}
	}

	const spine: SpineBundle[] = Object.entries(record?.spine ?? {}).map(([name, extensions]) => {
		const bundle: SpineBundle = { name };
		for (const extension of extensions) {
			if (extension === "skel" || extension === "atlas" || extension === "png") {
				bundle[extension] = spineUrl(id, name, extension);
			}
		}
		return bundle;
	});

	const normal = attach(raw.normal, id, "normal", record);
	if (normal === null) {
		throw new Error(`doll ${id} has no normal form`);
	}

	return { normal, mod: attach(raw.mod, id, "mod", record), skins: raw.skins, forms, skillImages, spine };
}

/**
 * Resolve a list of dolls.
 *
 * @param raws Dolls as written in the data files.
 * @returns The same dolls with assets resolved, in the same order.
 */
export function processDolls(raws: RawTDoll[]): TDoll[] {
	return raws.map(processDoll);
}

/** The portrait kinds, re-exported so pages do not need to import the manifest types directly. */
export const imageKinds: ImageKind[] = manifest.imageKinds;
