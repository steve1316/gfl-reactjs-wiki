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
 * Append a doll's extra skins (art with no skin.json row) after its table skins: game extras in id order, then legacy extras in file order.
 *
 * @param {{ number_of_skins: number, skin_names: string[], skin_ids: (number | string | null)[] } | null} skins The doll's skins, left unchanged.
 * @param {number} dollId Base doll id.
 * @param {{ doll: number, key: number | string, name: string, source: "game" | "legacy" }[]} extras Entries of `tools/data/extra-skins.json`.
 * @returns {{ number_of_skins: number, skin_names: string[], skin_ids: (number | string | null)[] } | null} Skins with the extras, or null when there are none.
 */
export function addExtraSkins(skins, dollId, extras) {
	const own = extras.filter((extra) => extra.doll === dollId);
	const ordered = [...own.filter((extra) => extra.source === "game").sort((a, b) => a.key - b.key), ...own.filter((extra) => extra.source === "legacy")];
	if (ordered.length === 0) {
		return skins;
	}
	const names = [...(skins?.skin_names ?? []), ...ordered.map((extra) => extra.name)];
	return { number_of_skins: names.length, skin_names: names, skin_ids: [...(skins?.skin_ids ?? []), ...ordered.map((extra) => extra.key)] };
}

/**
 * Check the extra skins: game keys are numeric ids with no skin.json row, legacy keys are `legacy-<slug>` with an old slot, and no key repeats.
 *
 * @param {{ doll: number, key: number | string, name: string, source: string, legacySlot?: number }[]} extras Entries of `tools/data/extra-skins.json`.
 * @param {{ stc: (name: string) => { id: number }[] }} upstream Upstream readers.
 * @throws {Error} On the first invalid entry.
 */
export function validateExtraSkins(extras, upstream) {
	const tableIds = new Set(upstream.stc("skin").map((skin) => skin.id));
	const seen = new Set();
	for (const extra of extras) {
		const label = `extra skin ${extra.doll}:${extra.key}`;
		if (!Number.isInteger(extra.doll) || typeof extra.name !== "string" || !extra.name) {
			throw new Error(`${label} needs a numeric doll and a name`);
		}
		if (extra.source === "game") {
			if (!Number.isInteger(extra.key)) {
				throw new Error(`${label} is a game skin, so its key must be a numeric skin id`);
			}
			if (tableIds.has(extra.key)) {
				throw new Error(`${label} has a skin.json row, so it is not an extra`);
			}
		} else if (extra.source === "legacy") {
			if (typeof extra.key !== "string" || !/^legacy-[a-z0-9-]+$/.test(extra.key)) {
				throw new Error(`${label} is a legacy skin, so its key must be legacy-<slug>`);
			}
			if (!Number.isInteger(extra.legacySlot) || extra.legacySlot < 1) {
				throw new Error(`${label} needs the legacySlot its old files use`);
			}
		} else {
			throw new Error(`${label} has an unknown source ${extra.source}`);
		}
		const id = `${extra.doll}:${extra.key}`;
		if (seen.has(id)) {
			throw new Error(`${label} is listed twice`);
		}
		seen.add(id);
	}
}

/**
 * Compare the dolls' skins with the v3 asset manifest.
 *
 * @param {{ normal: { id: number }, skins: { skin_names: string[], skin_ids: (number | string | null)[] } | null }[]} dolls Generated doll records.
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
			if (!skinIds.some((listed) => listed !== null && String(listed) === skinId)) {
				gaps.unlistedArt.push(`${id}:${skinId}`);
			} else if (!skin.images.includes("card")) {
				gaps.artWithoutCard.push(`${id}:${skinId}`);
			}
		}
	}
	return gaps;
}
