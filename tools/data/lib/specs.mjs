// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Labels renamed so the same field reads the same across dolls. */
const LABEL_ALIASES = { Mass: "Weight", Calibre: "Caliber", Feed: "Feed system" };

/** Multi-word labels upstream sometimes glues to the value with one space or none, as in "Effective firing range50 yds". */
const GLUED_LABELS = ["Effective firing range", "Maximum effective range", "Maximum firing range", "Muzzle velocity", "Rate of fire", "Barrel length", "Feed system"];

/** A label, a gap of two or more spaces, then the value. */
const GAP_ROW = /^(\S.*?)\s{2,}(\S.*)$/;

/** A capitalised "Label: value" line, as some dolls write their whole sheet. */
const COLON_ROW = /^([A-Z][^:]{0,39}):\s+(\S.*)$/;

/** A line that can stand alone as a label with its value on the indented lines below, such as "Barrel length". */
const LABEL_ONLY = /^[A-Z][A-Za-z ]{0,29}$/;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Parsing

/**
 * Collapse whitespace runs, non-breaking spaces included, and trim.
 *
 * @param {string} value Text to tidy.
 * @returns {string} The tidied text.
 */
function collapse(value) {
	return value.replace(/\s+/g, " ").trim();
}

/**
 * Tidy a label and apply the renames in `LABEL_ALIASES`.
 *
 * @param {string} label Raw label text.
 * @returns {string} The display label.
 */
function normaliseLabel(label) {
	const tidy = collapse(label).replace(/:$/, "").trim();
	return LABEL_ALIASES[tidy] ?? tidy;
}

/**
 * Split an unindented line into a label and value, trying the gap, glued-label and colon forms in turn.
 *
 * @param {string} line An unindented, non-blank line.
 * @returns {{ label: string, value: string } | null} The row, or null when the line has no recognisable label.
 */
function splitRow(line) {
	const gap = line.match(GAP_ROW);
	if (gap) {
		return { label: gap[1], value: gap[2] };
	}
	const glued = GLUED_LABELS.find((label) => line.startsWith(label) && !/[a-z]/i.test(line.charAt(label.length)));
	if (glued) {
		return { label: glued, value: line.slice(glued.length) };
	}
	const colon = line.match(COLON_ROW);
	return colon ? { label: colon[1], value: colon[2] } : null;
}

/**
 * Parse a gun's spec sheet (its `en_introduce` text, already unescaped) into label/value rows.
 *
 * An unindented line starts a row. An indented line, or an unindented one with no label, continues the row above, joined
 * with "; " (or a space after a colon). A short label alone on its line takes its value from the indented lines below it.
 * Rows with no value are dropped.
 *
 * @param {string} text The spec sheet text.
 * @returns {{ label: string, value: string }[]} The rows in sheet order.
 */
export function parseSpecs(text) {
	const lines = text.split("\n").filter((line) => line.trim() !== "");
	const rows = [];
	const append = (segment) => {
		const row = rows.at(-1);
		const value = collapse(segment);
		if (!row || !value) {
			return;
		}
		if (!row.value || row.value.endsWith(":")) {
			row.value = collapse(`${row.value} ${value}`);
		} else {
			row.value = `${row.value.replace(/[,;]$/, "")}; ${value}`;
		}
	};
	lines.forEach((line, index) => {
		if (/^\s/.test(line)) {
			append(line);
			return;
		}
		const row = splitRow(line.trimEnd());
		if (row) {
			rows.push({ label: normaliseLabel(row.label), value: collapse(row.value) });
		} else if ((LABEL_ONLY.test(line.trimEnd()) && /^\s/.test(lines[index + 1] ?? "")) || rows.length === 0) {
			rows.push({ label: normaliseLabel(line), value: "" });
		} else {
			append(line);
		}
	});
	return rows.filter((row) => row.label && row.value);
}

/**
 * Parse a form's spec sheet, falling back to another sheet when the form's own has no rows. A Mod uses this with its base form's text.
 *
 * @param {string} text The form's own spec sheet text.
 * @param {string} fallbackText The sheet to use when `text` gives no rows.
 * @returns {{ label: string, value: string }[]} The rows in sheet order.
 */
export function specsFor(text, fallbackText) {
	const rows = parseSpecs(text);
	return rows.length > 0 ? rows : parseSpecs(fallbackText);
}
