/**
 * Encodes an echelon into a short URL-safe string and back, so a formation can be shared as a link.
 *
 * Node runs this file with its types stripped in tests, so it must only use erasable TypeScript syntax.
 */

import type { FormationConstants, FormationForm } from "../../types/formation";
import { MAX_ECHELON, MAX_LINKS, MAX_SKILL_LEVEL, formFor, levelCap, maxModStage } from "./pipeline.ts";
import type { AffectionLevel, DollSetup } from "./pipeline.ts";

/** The query parameter holding the encoded formation. */
export const FORMATION_PARAM = "f";

/** The current format version. */
const VERSION = 1;

/** Bytes per doll in version 1. */
const DOLL_BYTES = 9;

/** Bytes before the dolls: version and count. */
const HEADER_BYTES = 2;

/** Cells on the grid. */
const CELLS = 9;

/** Highest affection bucket. */
const MAX_AFFECTION = 2;

/**
 * Clamp a number into a range.
 *
 * @param value The number.
 * @param min Lowest allowed.
 * @param max Highest allowed.
 * @returns The clamped number.
 */
function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Encode bytes as base64url without padding.
 *
 * @param bytes The bytes.
 * @returns The text.
 */
function toBase64Url(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/**
 * Decode base64url text into bytes.
 *
 * @param text The text.
 * @returns The bytes, or null when the text is not base64url.
 */
function fromBase64Url(text: string): Uint8Array | null {
	if (!/^[A-Za-z0-9_-]*$/.test(text)) {
		return null;
	}
	try {
		const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
		return Uint8Array.from(binary, (char) => char.charCodeAt(0));
	} catch {
		return null;
	}
}

/**
 * Encode an echelon.
 *
 * @param setups The echelon.
 * @returns The encoded text, or an empty string for an empty echelon.
 */
export function encodeFormation(setups: readonly DollSetup[]): string {
	if (setups.length === 0) {
		return "";
	}
	const bytes = new Uint8Array(HEADER_BYTES + setups.length * DOLL_BYTES);
	bytes[0] = VERSION;
	bytes[1] = setups.length;
	setups.forEach((setup, index) => {
		const at = HEADER_BYTES + index * DOLL_BYTES;
		bytes.set(
			[setup.cell, (setup.dollId >> 8) & 0xff, setup.dollId & 0xff, setup.modStage, setup.level, setup.links, setup.affection, setup.skill1, setup.skill2].map((value) => clamp(value, 0, 255)),
			at
		);
	});
	return toBase64Url(bytes);
}

/**
 * Decode an echelon, dropping anything the data does not support and clamping values into range.
 *
 * @param text The encoded text.
 * @param forms Formation forms by gun id.
 * @param constants Formation constants.
 * @returns The echelon, empty when the text is empty, malformed or from an unknown version.
 */
export function decodeFormation(text: string, forms: Record<string, FormationForm>, constants: FormationConstants): DollSetup[] {
	const bytes = fromBase64Url(text);
	if (!bytes || bytes.length < HEADER_BYTES || bytes[0] !== VERSION) {
		return [];
	}
	const count = bytes[1] ?? 0;
	if (bytes.length !== HEADER_BYTES + count * DOLL_BYTES) {
		return [];
	}
	const setups: DollSetup[] = [];
	for (let index = 0; index < count && setups.length < MAX_ECHELON; index++) {
		const at = HEADER_BYTES + index * DOLL_BYTES;
		const read = (offset: number) => bytes[at + offset] ?? 0;
		const cell = read(0);
		const dollId = (read(1) << 8) | read(2);
		if (cell >= CELLS || setups.some((setup) => setup.cell === cell || setup.dollId === dollId)) {
			continue;
		}
		const modStage = clamp(read(3), 0, maxModStage(dollId, forms));
		if (!formFor({ dollId, modStage }, forms)) {
			continue;
		}
		setups.push({
			cell,
			dollId,
			modStage,
			level: clamp(read(4), 1, levelCap(modStage, constants)),
			links: clamp(read(5), 1, MAX_LINKS),
			affection: clamp(read(6), 0, MAX_AFFECTION) as AffectionLevel,
			skill1: clamp(read(7), 1, MAX_SKILL_LEVEL),
			skill2: clamp(read(8), 1, MAX_SKILL_LEVEL)
		});
	}
	return setups;
}
