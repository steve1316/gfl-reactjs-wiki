import { cleanName } from "./text.mjs";

/**
 * Build a doll's skin list: every visible upstream skin, in skin id order. Art is keyed by skin id, so the order carries no art slots.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {number} dollId Base doll id.
 * @returns {{ number_of_skins: number, skin_names: string[], skin_ids: number[] } | null} Skins, or null when there are none.
 */
export function buildSkins(upstream, dollId) {
	const visible = upstream
		.stc("skin")
		.filter((skin) => skin.fit_gun === dollId && skin.is_hidden === 0)
		.sort((a, b) => a.id - b.id);
	if (visible.length === 0) {
		return null;
	}
	return { number_of_skins: visible.length, skin_names: visible.map((skin) => cleanName(upstream.t(skin.name))), skin_ids: visible.map((skin) => skin.id) };
}

/**
 * Compare the dolls' skins with the v3 asset manifest.
 *
 * @param {{ normal: { id: number }, skins: { skin_names: string[], skin_ids: (number | null)[] } | null }[]} dolls Generated doll records.
 * @param {{ dolls: Record<string, { normal?: { images: string[] }, skins?: Record<string, { images: string[] }> }> }} manifest The v3 asset manifest.
 * @returns {{ skinsWithoutArt: string[], dollsWithoutArt: number[], unlistedArt: string[], artWithoutCard: string[], nullIds: { doll: number, name: string }[] }}
 *   `doll:skin` labels for skins with no manifest art, dolls with no base card, manifest skins no doll lists, manifest skins with no card,
 *   and skins with no id.
 */
export function findSkinArtGaps(dolls, manifest) {
	const gaps = { skinsWithoutArt: [], dollsWithoutArt: [], unlistedArt: [], artWithoutCard: [], nullIds: [] };
	for (const doll of dolls) {
		const id = doll.normal.id;
		const entry = manifest.dolls[String(id)];
		if (!entry?.normal?.images.includes("card")) {
			gaps.dollsWithoutArt.push(id);
		}
		const art = entry?.skins ?? {};
		const skinIds = doll.skins?.skin_ids ?? [];
		skinIds.forEach((skinId, index) => {
			if (skinId === null) {
				gaps.nullIds.push({ doll: id, name: doll.skins.skin_names[index] });
				gaps.skinsWithoutArt.push(`${id}:${doll.skins.skin_names[index]}`);
			} else if (!art[String(skinId)]) {
				gaps.skinsWithoutArt.push(`${id}:${skinId}`);
			}
		});
		for (const [skinId, skin] of Object.entries(art)) {
			if (!skinIds.includes(Number(skinId))) {
				gaps.unlistedArt.push(`${id}:${skinId}`);
			} else if (!skin.images.includes("card")) {
				gaps.artWithoutCard.push(`${id}:${skinId}`);
			}
		}
	}
	return gaps;
}
