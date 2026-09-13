/** A character a name search keeps: a lowercase ASCII letter or digit. */
const KEPT_CHAR = /^[a-z0-9]$/;

/**
 * Reduce a name to lowercase letters and digits, so a search ignores case, spaces and punctuation.
 *
 * NFKC runs first so compatibility characters fold to plain ones, such as the Roman numeral two (U+2161) in "STEN Mk II" becoming "II".
 *
 * @param text The name or query to normalise.
 * @returns The text with everything but letters and digits removed.
 */
export function normaliseName(text: string): string {
	return text
		.normalize("NFKC")
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "");
}

/**
 * Whether a normalised query appears in any of a doll's normalised search names.
 *
 * @param keys The doll's names and old names, already passed through `normaliseName`.
 * @param needle The query, already passed through `normaliseName`.
 * @returns True when the query is empty or found in one of the names.
 */
export function matchesAnyName(keys: readonly string[], needle: string): boolean {
	return needle === "" || keys.some((key) => key.includes(needle));
}

/**
 * Find where a search query sits inside a name, matching the way `normaliseName` does.
 *
 * Punctuation and spaces are skipped while matching, so "hk416" is found in "HK-416" and the range covers the dash.
 *
 * @param name The name as displayed.
 * @param query What the reader typed.
 * @returns The start and end (exclusive) of the match in `name`, or null when the query is empty or not found.
 */
export function findNameMatch(name: string, query: string): [number, number] | null {
	const needle = normaliseName(query);
	if (!needle) {
		return null;
	}
	// Fold one character at a time, since NFKC can turn one character into several (U+2161 into "II"). Each kept
	// piece remembers the range of the original character it came from, so the match maps back onto `name`.
	let haystack = "";
	const starts: number[] = [];
	const ends: number[] = [];
	let index = 0;
	for (const char of name) {
		const end = index + char.length;
		for (const piece of char.normalize("NFKC").toLowerCase()) {
			if (KEPT_CHAR.test(piece)) {
				haystack += piece;
				starts.push(index);
				ends.push(end);
			}
		}
		index = end;
	}
	const at = haystack.indexOf(needle);
	if (at < 0) {
		return null;
	}
	return [starts[at] ?? 0, ends[at + needle.length - 1] ?? 0];
}
