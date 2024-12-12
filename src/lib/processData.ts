/**
 * Turns raw doll data into what pages consume, by attaching resolved asset URLs.
 *
 * The original `processData.js` mutated its argument, assigning `images` and a dozen animation keys
 * onto objects whose literals never declared them, then each data file called it at import time and
 * exported the mutated array. That made imports side-effectful, which in turn made the data modules
 * impossible to code-split. This version is pure, so the data files can be plain literals and the
 * work happens once, on demand, at the data-access boundary.
 *
 * Which portraits exist comes from the generated version 3 manifest, keyed by skin id.
 */

import manifestJson from "../../assets-manifest.json";
import type { AssetsManifest, HocImageKind, ManifestDoll, ManifestForm, ManifestSkin } from "../types/manifest";
import type { FormAssets, RawForm, RawTDoll, TDoll, TDollForm } from "../types/tdoll";
import { imageUrl, modSkinCardUrl, skillImageUrl, skinFormKey } from "./assets";

const manifest = manifestJson as unknown as AssetsManifest;

/** Equipment ids with a hosted icon. */
const equipmentWithIcons: ReadonlySet<number> = new Set(manifest.equipment);

/**
 * Resolve every portrait URL for one form.
 *
 * @param id Doll id.
 * @param form Form key: `normal`, `mod` or a `skinFormKey`.
 * @param entry The manifest record describing what that form has.
 * @returns The form's resolved asset URLs.
 */
function buildFormAssets(id: number, form: string, entry: ManifestForm): FormAssets {
	const images: FormAssets["images"] = {};
	for (const kind of entry.images) {
		images[kind] = imageUrl(id, form, kind);
	}
	return { images };
}

/**
 * Resolve every portrait URL for one skin, including its cards as worn by the Mod.
 *
 * @param id Doll id.
 * @param skinKey The skin's key in the manifest.
 * @param entry The manifest record describing what that skin has.
 * @returns The skin's resolved asset URLs.
 */
function buildSkinAssets(id: number, skinKey: string, entry: ManifestSkin): FormAssets {
	const assets = buildFormAssets(id, skinFormKey(skinKey), entry);
	if (entry.modImages?.length) {
		const modImages: NonNullable<FormAssets["modImages"]> = {};
		for (const kind of entry.modImages) {
			modImages[kind] = modSkinCardUrl(id, skinKey, kind);
		}
		assets.modImages = modImages;
	}
	return assets;
}

/**
 * Attach a form's assets to its raw record.
 *
 * @param raw The raw form, or `null` when the doll has no such form.
 * @param assets The form's resolved assets, when the manifest has any.
 * @returns The form with assets attached, or `null` when `raw` was `null`.
 */
function attach(raw: RawForm | null, assets: FormAssets | undefined): TDollForm | null {
	return raw === null ? null : { ...raw, assets: assets ?? { images: {} } };
}

/**
 * Resolve one doll.
 *
 * @param raw A doll exactly as written in the data files.
 * @returns The doll with every asset URL resolved.
 */
export function processDoll(raw: RawTDoll): TDoll {
	const id = raw.normal.id;
	const record: ManifestDoll | undefined = manifest.dolls[String(id)];

	const forms: Record<string, FormAssets> = {};
	if (record) {
		forms.normal = buildFormAssets(id, "normal", record.normal);
		if (record.mod) {
			forms.mod = buildFormAssets(id, "mod", record.mod);
		}
		for (const [skinKey, entry] of Object.entries(record.skins ?? {})) {
			forms[skinFormKey(skinKey)] = buildSkinAssets(id, skinKey, entry);
		}
	}

	const skillImages: TDoll["skillImages"] = {};
	for (const skill of record?.skills ?? []) {
		skillImages[skill] = skillImageUrl(id, skill);
	}

	const normal = attach(raw.normal, forms.normal);
	if (normal === null) {
		throw new Error(`doll ${id} has no normal form`);
	}

	return { normal, mod: attach(raw.mod, forms.mod), skins: raw.skins, release: raw.release, production: raw.production, forms, skillImages };
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

/**
 * Whether a doll has hosted card art.
 *
 * @param id Doll id.
 * @returns True when the manifest lists a card for the doll's base form.
 */
export function hasDollArt(id: number): boolean {
	return manifest.dolls[String(id)]?.normal.images.includes("card") ?? false;
}

/**
 * Whether an equipment item has a hosted icon.
 *
 * @param id Equipment id.
 * @returns True when the manifest lists the id.
 */
export function hasEquipmentIcon(id: number): boolean {
	return equipmentWithIcons.has(id);
}

/**
 * Whether a HOC has a hosted image of the given kind.
 *
 * @param id HOC id.
 * @param kind Which portrait kind to check for.
 * @returns True when the manifest lists that kind for the HOC.
 */
export function hasHocArt(id: number, kind: HocImageKind): boolean {
	return manifest.hocs?.[String(id)]?.includes(kind) ?? false;
}

/**
 * Whether a fairy has a hosted image for the given form.
 *
 * @param id Fairy id.
 * @param form Form number, 1 through 3.
 * @returns True when the manifest lists that form for the fairy.
 */
export function hasFairyForm(id: number, form: number): boolean {
	return manifest.fairies?.[String(id)]?.includes(`form${form}` as "form1" | "form2" | "form3") ?? false;
}
