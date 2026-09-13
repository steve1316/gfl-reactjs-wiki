/**
 * Parse one upstream text table.
 *
 * Lines are `key,value`, split on the first comma only. Files use CRLF, and `battle_skill_config.txt` starts with two BOMs.
 *
 * @param {string} source The whole file.
 * @returns {Map<string, string>} Raw values keyed by text key, still escaped.
 */
export function parseTextTable(source) {
	const table = new Map();
	for (const line of source.replace(/^﻿+/, "").split(/\r?\n/)) {
		const comma = line.indexOf(",");
		if (comma > 0) {
			table.set(line.slice(0, comma), line.slice(comma + 1));
		}
	}
	return table;
}

/**
 * Undo the text tables' escapes. `//c` is a comma and `//n` a newline, and no other escape occurs.
 *
 * @param {string} value An escaped value.
 * @returns {string} The plain text.
 */
export function unescapeText(value) {
	return value.replaceAll("//c", ",").replaceAll("//n", "\n");
}

/**
 * Remove Unity rich text colour tags, keeping the text inside them.
 *
 * @param {string} value Text that may contain `<color=...>` tags.
 * @returns {string} The text without tags.
 */
export function stripMarkup(value) {
	return value.replace(/<\/?color(=[^>]*)?>/g, "");
}
