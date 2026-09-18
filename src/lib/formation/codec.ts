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

/**
 * The current format version.
 *
 * Version 1 carried the echelon alone. Version 2 adds the enemy squad and the fairy after it. A version 1 link still decodes, since
 * the dolls are laid out identically and the two new sections simply come back empty.
 */
const VERSION = 2;

/** The oldest version that still decodes. */
const MIN_VERSION = 1;

/** Bytes per doll. */
const DOLL_BYTES = 9;

/** Bytes per enemy: cell, then the id over two bytes. */
const ENEMY_BYTES = 3;

/** Bytes for the fairy: id over two bytes, then level and stars. */
const FAIRY_BYTES = 4;

/** Bytes before the dolls: version and doll count. */
const HEADER_BYTES = 2;

/** Cells on the grid. */
const CELLS = 9;

/** Highest affection bucket. */
const MAX_AFFECTION = 2;

/** Most enemies on the opposing grid. */
export const MAX_ENEMY_SQUAD = 9;

/** Highest fairy star rank. */
const MAX_FAIRY_STARS = 5;

/** Highest fairy level. */
const MAX_FAIRY_LEVEL = 100;

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

/** An enemy placed on the opposing grid. */
export interface EnemySetup {
	/** Cell on the enemy grid, 0 to 8. */
	cell: number;
	/** The enemy's archive id. */
	enemyId: number;
}

/** The chosen fairy and how far it is levelled. */
export interface FairySetup {
	/** The fairy's id. */
	fairyId: number;
	/** Level, 1 to 100. */
	level: number;
	/** Star rank, 1 to 5. */
	stars: number;
}

/** Everything a shared link carries. */
export interface FormationLink {
	/** The echelon. */
	setups: DollSetup[];
	/** The enemy squad. */
	enemies: EnemySetup[];
	/** The fairy, or null when none is chosen. */
	fairy: FairySetup | null;
}

/**
 * Encode a formation: the echelon, the enemy squad and the fairy.
 *
 * @param link The echelon, enemies and fairy.
 * @returns The encoded text, or an empty string when there is nothing to encode.
 */
export function encodeFormation(link: FormationLink): string {
	const { setups, enemies, fairy } = link;
	if (setups.length === 0 && enemies.length === 0 && fairy === null) {
		return "";
	}
	const bytes = new Uint8Array(HEADER_BYTES + setups.length * DOLL_BYTES + 1 + enemies.length * ENEMY_BYTES + 1 + (fairy ? FAIRY_BYTES : 0));
	bytes[0] = VERSION;
	bytes[1] = setups.length;
	setups.forEach((setup, index) => {
		const at = HEADER_BYTES + index * DOLL_BYTES;
		bytes.set(
			[setup.cell, (setup.dollId >> 8) & 0xff, setup.dollId & 0xff, setup.modStage, setup.level, setup.links, setup.affection, setup.skill1, setup.skill2].map((value) => clamp(value, 0, 255)),
			at
		);
	});

	let at = HEADER_BYTES + setups.length * DOLL_BYTES;
	bytes[at] = enemies.length;
	at += 1;
	for (const enemy of enemies) {
		bytes.set([clamp(enemy.cell, 0, 255), (enemy.enemyId >> 8) & 0xff, enemy.enemyId & 0xff], at);
		at += ENEMY_BYTES;
	}
	bytes[at] = fairy ? 1 : 0;
	at += 1;
	if (fairy) {
		bytes.set([(fairy.fairyId >> 8) & 0xff, fairy.fairyId & 0xff, clamp(fairy.level, 1, 255), clamp(fairy.stars, 1, 255)], at);
	}
	return toBase64Url(bytes);
}

/**
 * Decode a formation, dropping anything the data does not support and clamping values into range.
 *
 * A version 1 link, which had no enemy squad or fairy, decodes its echelon and returns the two new sections empty.
 *
 * @param text The encoded text.
 * @param forms Formation forms by gun id.
 * @param constants Formation constants.
 * @param enemyIds The enemy ids the data has, so a link naming one it does not know drops that enemy rather than placing a blank.
 * @returns The formation, empty when the text is empty, malformed or from an unknown version.
 */
export function decodeFormation(text: string, forms: Record<string, FormationForm>, constants: FormationConstants, enemyIds?: ReadonlySet<number>): FormationLink {
	const bytes = fromBase64Url(text);
	const version = bytes?.[0] ?? 0;
	if (!bytes || bytes.length < HEADER_BYTES || version < MIN_VERSION || version > VERSION) {
		return { setups: [], enemies: [], fairy: null };
	}
	const count = bytes[1] ?? 0;
	const dollsEnd = HEADER_BYTES + count * DOLL_BYTES;
	if (bytes.length < dollsEnd || (version === 1 && bytes.length !== dollsEnd)) {
		return { setups: [], enemies: [], fairy: null };
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
	if (version === 1) {
		return { setups, enemies: [], fairy: null };
	}

	let at = dollsEnd;
	const enemyCount = bytes[at] ?? 0;
	at += 1;
	if (bytes.length < at + enemyCount * ENEMY_BYTES + 1) {
		return { setups, enemies: [], fairy: null };
	}
	const enemies: EnemySetup[] = [];
	for (let index = 0; index < enemyCount && enemies.length < MAX_ENEMY_SQUAD; index++) {
		const base = at + index * ENEMY_BYTES;
		const cell = bytes[base] ?? 0;
		const enemyId = ((bytes[base + 1] ?? 0) << 8) | (bytes[base + 2] ?? 0);
		if (cell >= CELLS || enemies.some((entry) => entry.cell === cell) || (enemyIds && !enemyIds.has(enemyId))) {
			continue;
		}
		enemies.push({ cell, enemyId });
	}

	at += enemyCount * ENEMY_BYTES;
	const hasFairy = (bytes[at] ?? 0) === 1;
	at += 1;
	if (!hasFairy || bytes.length < at + FAIRY_BYTES) {
		return { setups, enemies, fairy: null };
	}
	const fairy: FairySetup = {
		fairyId: ((bytes[at] ?? 0) << 8) | (bytes[at + 1] ?? 0),
		level: clamp(bytes[at + 2] ?? 1, 1, MAX_FAIRY_LEVEL),
		stars: clamp(bytes[at + 3] ?? 1, 1, MAX_FAIRY_STARS)
	};
	return { setups, enemies, fairy };
}
