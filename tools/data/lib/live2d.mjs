/**
 * Shape check for the v3 asset manifest's `live2d` block.
 *
 * Only a handful of fairies, HOCs and T-Doll skins have a Live2D model, so this does not require every fairy, HOC or skin to have
 * one, unlike `findFairyArtGaps` / `findHocArtGaps`. It only checks that an id the block already lists has every kind it needs: a
 * fairy needs all three forms, a HOC needs its model, and a skin's doll/form/skin entry needs at least one variant.
 */

/** The three form kinds a Live2D fairy needs. */
const FAIRY_KINDS = ["form1", "form2", "form3"];

/**
 * Find ids in the manifest's `live2d` block that are missing an expected kind.
 *
 * @param {{ live2d?: { fairies?: Record<string, string[]>, hocs?: Record<string, string[]>, tdolls?: Record<string, Record<string,
 *     Record<string, string[]>>> } }} manifest The v3 asset manifest.
 * @returns {string[]} One description per id missing a kind, e.g. `fairy 1 (missing form3)`, or `tdoll <dollId> <form> <skinKey>` for a
 *     skin entry with no variant.
 */
export function findLive2dArtGaps(manifest) {
	const live2d = manifest.live2d ?? {};
	const gaps = [];
	for (const [id, kinds] of Object.entries(live2d.fairies ?? {})) {
		const missing = FAIRY_KINDS.filter((kind) => !kinds.includes(kind));
		if (missing.length > 0) {
			gaps.push(`fairy ${id} (missing ${missing.join(", ")})`);
		}
	}
	for (const [id, kinds] of Object.entries(live2d.hocs ?? {})) {
		if (!kinds.includes("model")) {
			gaps.push(`hoc ${id} (missing model)`);
		}
	}
	for (const [dollId, forms] of Object.entries(live2d.tdolls ?? {})) {
		for (const [form, skins] of Object.entries(forms)) {
			for (const [skinKey, variants] of Object.entries(skins)) {
				if (variants.length === 0) {
					gaps.push(`tdoll ${dollId} ${form} ${skinKey}`);
				}
			}
		}
	}
	return gaps;
}

/**
 * Find doll/form/skin/variant combinations where the live2d-index availability list and a doll's per-file motions disagree.
 *
 * `build_live2d_index.py` writes the availability list (`src/data/live2d-index.json`'s `tdolls` block) and each doll's motions
 * (`src/data/live2d-tdolls/<dollId>.json`) from the same staging walk, and `merge_indexes.py` merges both add-only from the same
 * partial run, but they are separate files - a bug in either the builder or the merge could let them drift. Only the availability
 * list is bundled on every doll page, so a variant it advertises with no matching motions file would 404 when a reader opens it, and
 * a variant that only exists in a per-doll file would never be offered at all. A doll with an empty availability block and no
 * per-doll file passes, since most dolls have no Live2D model at all.
 *
 * @param {Record<string, Record<string, Record<string, string[]>>>} availability The live2d-index's `tdolls` block: doll id to form
 *     to skin key to the variant names present.
 * @param {Record<string, Record<string, Record<string, Record<string, unknown>>>>} tdollFiles Each doll's parsed per-file motions,
 *     keyed by doll id, one entry per `src/data/live2d-tdolls/<dollId>.json` file that actually exists.
 * @returns {string[]} One description per mismatched doll/form/skin/variant, naming which side is missing it, sorted.
 */
export function findLive2dTdollFileGaps(availability, tdollFiles) {
	const gaps = [];
	for (const dollId of new Set([...Object.keys(availability), ...Object.keys(tdollFiles)])) {
		const forms = availability[dollId] ?? {};
		const fileForms = tdollFiles[dollId] ?? {};
		for (const form of new Set([...Object.keys(forms), ...Object.keys(fileForms)])) {
			const skins = forms[form] ?? {};
			const fileSkins = fileForms[form] ?? {};
			for (const skinKey of new Set([...Object.keys(skins), ...Object.keys(fileSkins)])) {
				const variants = new Set(skins[skinKey] ?? []);
				const fileVariants = new Set(Object.keys(fileSkins[skinKey] ?? {}));
				for (const variant of variants) {
					if (!fileVariants.has(variant)) {
						gaps.push(`tdoll ${dollId} ${form} ${skinKey} ${variant} (listed as available with no matching per-doll file entry)`);
					}
				}
				for (const variant of fileVariants) {
					if (!variants.has(variant)) {
						gaps.push(`tdoll ${dollId} ${form} ${skinKey} ${variant} (has a per-doll file entry but is not listed as available)`);
					}
				}
			}
		}
	}
	return gaps.sort();
}
