/**
 * Shape check for the v3 asset manifest's `live2d` block.
 *
 * Only a handful of fairies and HOCs have a Live2D model, so this does not require every fairy or HOC to have one, unlike
 * `findFairyArtGaps` / `findHocArtGaps`. It only checks that an id the block already lists has every kind it needs: a fairy needs
 * all three forms, a HOC needs its model.
 */

/** The three form kinds a Live2D fairy needs. */
const FAIRY_KINDS = ["form1", "form2", "form3"];

/**
 * Find ids in the manifest's `live2d` block that are missing an expected kind.
 *
 * @param {{ live2d?: { fairies?: Record<string, string[]>, hocs?: Record<string, string[]> } }} manifest The v3 asset manifest.
 * @returns {string[]} One description per id missing a kind, e.g. `fairy 1 (missing form3)`.
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
	return gaps;
}
