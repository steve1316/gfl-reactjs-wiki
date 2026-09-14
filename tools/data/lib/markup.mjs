// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Wiki or HTML markup that must never survive into a generated profile string. */
const PROFILE_TOKENS = ["'''", "''", "[[", "]]", "{{", "}}", "<"];

/** Wiki markup that must never survive into a spec sheet. `''` (inches) and `<` (as in "<1 MOA") are real spec text, so they are allowed there. */
const SPEC_TOKENS = ["'''", "[[", "]]", "{{", "}}"];

/** An HTML entity left undecoded, named such as `&amp;` or numeric such as `&#39;`. Named ones need two letters, so ".40 S&W; .45 ACP" is not one. */
const ENTITY = /&(?:[a-zA-Z]{2,}|#[0-9]+);/;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Detection

/**
 * Find leftover wiki or HTML markup in a generated string.
 *
 * @param {string} text The generated string.
 * @param {"profile" | "spec"} kind Whether the string is a profile field or a spec sheet label or value, which allows `''` and `<`.
 * @returns {string | null} The first markup found, or null when the text is clean.
 */
export function findMarkup(text, kind) {
	const token = (kind === "spec" ? SPEC_TOKENS : PROFILE_TOKENS).find((candidate) => text.includes(candidate));
	return token ?? text.match(ENTITY)?.[0] ?? null;
}
