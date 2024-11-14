/**
 * Find where a skill description names one of the doll's exclusive equipment items, for the doll page's skill tooltips.
 */

/** A letter or digit in any script. */
const WORD_CHARACTER = /[\p{L}\p{N}]/u;

/**
 * Lowercase text and keep only letters and digits, recording the original index of every kept character.
 *
 * @param {string} text Text to normalise.
 * @returns {{ normal: string, positions: number[] }} The normalised text and, for each of its characters, the index it came from.
 */
export function normaliseWithPositions(text) {
	let normal = "";
	const positions = [];
	for (let index = 0; index < text.length; index++) {
		const character = text[index];
		if (!WORD_CHARACTER.test(character)) {
			continue;
		}
		for (const lower of character.toLowerCase()) {
			normal += lower;
			positions.push(index);
		}
	}
	return { normal, positions };
}

/**
 * Find every item a description names, ignoring case, spaces and punctuation, plus the hand-checked alias wordings.
 *
 * Longer names are tried first and a matched stretch is never matched again, so a name inside a longer name does not match twice.
 * A match must start and end on a word boundary in the original text.
 * When two of the doll's items share a name, the wording is recorded once under the first of them in the doll's item order.
 *
 * @param {string} description The skill description.
 * @param {{ id: number, name: string }[]} items The doll's exclusive equipment.
 * @param {{ equipment: number, text: string }[]} aliases The doll's alias wordings from `tools/data/equipment-aliases.json`.
 * @returns {{ text: string, id: number }[]} One entry per distinct wording and item, in order of first appearance, with the description's own wording.
 */
export function findEquipmentMentions(description, items, aliases) {
	const { normal, positions } = normaliseWithPositions(description);
	const taken = new Array(normal.length).fill(false);
	const candidates = [
		...items.map((entry) => ({ id: entry.id, key: normaliseWithPositions(entry.name).normal })),
		...aliases.map((alias) => ({ id: alias.equipment, key: normaliseWithPositions(alias.text).normal }))
	]
		.filter((candidate) => candidate.key.length > 0)
		.sort((a, b) => b.key.length - a.key.length);
	const found = new Map();
	for (const candidate of candidates) {
		for (let at = normal.indexOf(candidate.key); at !== -1; at = normal.indexOf(candidate.key, at + 1)) {
			const end = at + candidate.key.length;
			const start = positions[at];
			const stop = positions[end - 1] + 1;
			const partWord = WORD_CHARACTER.test(description[start - 1] ?? "") || WORD_CHARACTER.test(description[stop] ?? "");
			if (partWord || taken.slice(at, end).some(Boolean)) {
				continue;
			}
			taken.fill(true, at, end);
			const text = description.slice(start, stop);
			const key = `${candidate.id}:${text}`;
			if (!found.has(key)) {
				found.set(key, { start, mention: { text, id: candidate.id } });
			}
		}
	}
	return [...found.values()].sort((a, b) => a.start - b.start).map((entry) => entry.mention);
}
