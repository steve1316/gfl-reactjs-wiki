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
