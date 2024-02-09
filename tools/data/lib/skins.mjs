/**
 * Build a doll's skin list.
 *
 * Skins that already have art come first, in the order of their `skinN` art slots, so existing art and `?skin=N`
 * links stay aligned. Other visible skins follow in id order and show without art until assets are added.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @param {number} dollId Base doll id.
 * @param {(number | { name: string })[] | undefined} assetSlots Skin ids occupying `skin1..skinK`, from `skin-assets.json`.
 * @returns {{ number_of_skins: number, skin_names: string[], skin_ids: (number | null)[] } | null} Skins, or null when there are none.
 */
export function buildSkins(upstream, dollId, assetSlots) {
	const visible = upstream
		.stc("skin")
		.filter((skin) => skin.fit_gun === dollId && skin.is_hidden === 0)
		.sort((a, b) => a.id - b.id);
	const byId = new Map(visible.map((skin) => [skin.id, skin]));
	const entries = (assetSlots ?? []).map((slot) => {
		if (typeof slot === "object") {
			return { id: null, name: slot.name };
		}
		const skin = byId.get(slot);
		if (!skin) {
			throw new Error(`doll ${dollId}: skin ${slot} in skin-assets.json is not a visible upstream skin`);
		}
		return { id: slot, name: upstream.t(skin.name).trim() };
	});
	const taken = new Set(entries.map((entry) => entry.id));
	for (const skin of visible) {
		if (!taken.has(skin.id)) {
			entries.push({ id: skin.id, name: upstream.t(skin.name).trim() });
		}
	}
	if (entries.length === 0) {
		return null;
	}
	return { number_of_skins: entries.length, skin_names: entries.map((entry) => entry.name), skin_ids: entries.map((entry) => entry.id) };
}
