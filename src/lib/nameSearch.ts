/**
 * Reduce a name to lowercase letters and digits, so a search ignores case, spaces and punctuation.
 *
 * @param text The name or query to normalise.
 * @returns The text with everything but letters and digits removed.
 */
export function normaliseName(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]/g, "");
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
	// Lowercase one character at a time so each kept character still knows its index in the original name.
	let haystack = "";
	const positions: number[] = [];
	for (let index = 0; index < name.length; index++) {
		const char = (name[index] ?? "").toLowerCase();
		if (/^[a-z0-9]$/.test(char)) {
			haystack += char;
			positions.push(index);
		}
	}
	const at = haystack.indexOf(needle);
	if (at < 0) {
		return null;
	}
	return [positions[at] ?? 0, (positions[at + needle.length - 1] ?? 0) + 1];
}
