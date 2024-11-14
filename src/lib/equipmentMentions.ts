import type { SkillEquipmentMention } from "../types/tdoll";

/** One run of text: plain, or a mention already wrapped. */
interface TextPiece {
	/** The text of the run. */
	text: string;
	/** Id of the mentioned item when the run is a mention, otherwise undefined. */
	id?: number;
}

/**
 * Wrap mentions inside one run of text between tags, longest wording first so a name inside a longer name is not wrapped twice.
 *
 * @param text Text with no tags in it.
 * @param mentions Mentions ordered longest wording first.
 * @returns The text with every mention wrapped in a marker span.
 */
function wrapText(text: string, mentions: SkillEquipmentMention[]): string {
	let pieces: TextPiece[] = [{ text }];
	for (const mention of mentions) {
		pieces = pieces.flatMap((piece) => {
			if (piece.id !== undefined || !piece.text.includes(mention.text)) {
				return [piece];
			}
			return piece.text.split(mention.text).flatMap((part, index) => (index === 0 ? [{ text: part }] : [{ text: mention.text, id: mention.id }, { text: part }]));
		});
	}
	return pieces.map((piece) => (piece.id === undefined ? piece.text : `<span data-equipment-id="${piece.id}">${piece.text}</span>`)).join("");
}

/**
 * Wrap every mention of the doll's exclusive equipment in a skill description's HTML in a marker span for the tooltip.
 *
 * Only text between tags is touched, so the value, heading and colouring spans already inserted into the description stay intact.
 *
 * @param html The skill description as HTML, after values, headings and any hand styling were inserted.
 * @param mentions The skill's mentions from the generated data.
 * @returns The HTML with every mention wrapped in `<span data-equipment-id="ID">`.
 */
export function wrapMentions(html: string, mentions: SkillEquipmentMention[]): string {
	if (mentions.length === 0) {
		return html;
	}
	const ordered = [...mentions].sort((a, b) => b.text.length - a.text.length);
	return html
		.split(/(<[^>]*>)/)
		.map((segment) => (segment.startsWith("<") ? segment : wrapText(segment, ordered)))
		.join("");
}
