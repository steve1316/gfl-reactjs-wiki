import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FORMATION_PARAM, decodeFormation, encodeFormation } from "../../lib/formation/codec";
import type { EnemySetup, FairySetup } from "../../lib/formation/codec";
import { MAX_ECHELON, MAX_SKILL_LEVEL, MAX_LINKS, levelCap, maxModStage } from "../../lib/formation/pipeline";
import type { DollSetup } from "../../lib/formation/pipeline";
import type { FormationData } from "../../types/formation";

/**
 * The echelon shown when no formation is in the link: the AR team down the left two columns, reading left to right and top to bottom as
 * HK416, then M4A1 with RO635, then ST AR-15 with P22.
 *
 * Each doll's id with the cell it stands on. Settings come from `defaultSetup`, the same ones a freshly placed doll gets.
 */
const DEFAULT_ECHELON: readonly { cell: number; dollId: number }[] = [
	{ cell: 0, dollId: 65 },
	{ cell: 3, dollId: 55 },
	{ cell: 4, dollId: 143 },
	{ cell: 6, dollId: 57 },
	{ cell: 7, dollId: 242 }
];

/** How long the echelon must stay unchanged before it is written to the URL, in milliseconds. Firefox throws once history calls come too fast. */
const URL_WRITE_DELAY_MS = 250;

/**
 * A doll placed with everything maxed: its top form at its level cap, five links, both skills at 10 and no affection bonus.
 *
 * @param cell Cell the doll stands on.
 * @param dollId Doll id.
 * @param data The loaded formation data.
 * @returns The setup.
 */
function defaultSetup(cell: number, dollId: number, data: FormationData): DollSetup {
	const modStage = maxModStage(dollId, data.forms);
	return { cell, dollId, modStage, level: levelCap(modStage, data.constants), links: MAX_LINKS, affection: 0, skill1: MAX_SKILL_LEVEL, skill2: MAX_SKILL_LEVEL };
}

/** The fairy a new pick starts at: fully levelled, like a freshly placed doll. */
const DEFAULT_FAIRY_LEVEL = 100;

/** Star rank a new fairy pick starts at. */
const DEFAULT_FAIRY_STARS = 5;

/** The echelon, the enemy squad, the fairy and the ways to change them. */
export interface FormationState {
	/** Dolls on the grid, in placement order. */
	setups: DollSetup[];
	/** Enemies on the opposing grid, in placement order. */
	enemies: EnemySetup[];
	/** The chosen fairy, or null when none is chosen. */
	fairy: FairySetup | null;
	/** Put a doll on an empty cell with default settings. Ignored when the cell is taken, the doll is already placed or the echelon is full. */
	placeDoll: (cell: number, dollId: number) => void;
	/** Change the settings of the doll on a cell. */
	updateDoll: (cell: number, patch: Partial<Omit<DollSetup, "cell" | "dollId">>) => void;
	/** Take the doll off a cell. */
	removeDoll: (cell: number) => void;
	/** Move the doll on one cell to another, swapping with any doll already there. */
	moveDoll: (from: number, to: number) => void;
	/** Put an enemy on a cell of the opposing grid, replacing whatever stood there. */
	placeEnemy: (cell: number, enemyId: number) => void;
	/** Move the enemy on one cell of the opposing grid to another, swapping with any enemy already there. */
	moveEnemy: (from: number, to: number) => void;
	/** Take the enemy off a cell of the opposing grid. */
	removeEnemy: (cell: number) => void;
	/** Choose a fairy by id, fully levelled like a freshly placed doll, or clear it with null. */
	setFairy: (fairyId: number | null) => void;
	/** Change the chosen fairy's level or star rank. */
	updateFairy: (patch: Partial<Omit<FairySetup, "fairyId">>) => void;
}

/**
 * The echelon, the enemy squad and the fairy, read once from the `f` query parameter when the data arrives and written back shortly
 * after each change.
 *
 * @param data The loaded formation data, or null while it loads.
 * @returns The formation state.
 */
export function useFormationState(data: FormationData | null): FormationState {
	const [searchParams, setSearchParams] = useSearchParams();
	const [setups, setSetups] = useState<DollSetup[]>([]);
	const [enemies, setEnemies] = useState<EnemySetup[]>([]);
	const [fairy, setFairyState] = useState<FairySetup | null>(null);
	const [ready, setReady] = useState(false);
	// The URL write waiting on the debounce, with the page path it belongs to, or null when the URL is up to date.
	const pendingWriteRef = useRef<{ pathname: string; write: () => void } | null>(null);

	useEffect(() => {
		if (data && !ready) {
			const shared = searchParams.get(FORMATION_PARAM);
			// A link with no formation in it opens on the default echelon. An empty one, such as after clearing the grid, stays empty.
			const decoded = decodeFormation(shared ?? "", data.forms, data.constants, new Set(data.enemies.map((enemy) => enemy.id)));
			const dolls = shared === null ? DEFAULT_ECHELON.filter(({ dollId }) => data.forms[String(dollId)]) : [];
			setSetups(decoded.setups.length > 0 ? decoded.setups : dolls.map(({ cell, dollId }) => defaultSetup(cell, dollId, data)));
			setEnemies(decoded.enemies);
			setFairyState(decoded.fairy);
			setReady(true);
		}
	}, [data, ready, searchParams]);

	// Skipped until the first decode has landed, so the empty initial state never wipes a shared link. Debounced so a dragged slider
	// writes once when it settles rather than once per step.
	useEffect(() => {
		if (!ready) {
			return;
		}
		const encoded = encodeFormation({ setups, enemies, fairy });
		const write = () => {
			pendingWriteRef.current = null;
			setSearchParams(
				(previous) => {
					const next = new URLSearchParams(previous);
					if (encoded) {
						next.set(FORMATION_PARAM, encoded);
					} else {
						next.delete(FORMATION_PARAM);
					}
					return next;
				},
				{ replace: true }
			);
		};
		pendingWriteRef.current = { pathname: window.location.pathname, write };
		const timer = window.setTimeout(write, URL_WRITE_DELAY_MS);
		return () => window.clearTimeout(timer);
	}, [ready, setups, enemies, fairy, setSearchParams]);

	// Flush a waiting write on unmount. Skipped when the unmount is a navigation to another page, which the write would otherwise undo.
	useEffect(
		() => () => {
			const pending = pendingWriteRef.current;
			if (pending && pending.pathname === window.location.pathname) {
				pending.write();
			}
		},
		[]
	);

	const placeDoll = useCallback(
		(cell: number, dollId: number) => {
			if (!data) {
				return;
			}
			setSetups((current) => {
				if (current.length >= MAX_ECHELON || current.some((setup) => setup.cell === cell || setup.dollId === dollId)) {
					return current;
				}
				return [...current, defaultSetup(cell, dollId, data)];
			});
		},
		[data]
	);

	const updateDoll = useCallback(
		(cell: number, patch: Partial<Omit<DollSetup, "cell" | "dollId">>) => {
			if (!data) {
				return;
			}
			setSetups((current) =>
				current.map((setup) => {
					if (setup.cell !== cell) {
						return setup;
					}
					const next = { ...setup, ...patch };
					const cap = levelCap(next.modStage, data.constants);
					// A new form starts at its own max level, as placing a doll does. Other changes only clamp the level to the cap.
					const newForm = next.modStage !== setup.modStage && patch.level === undefined;
					return { ...next, level: newForm ? cap : Math.min(next.level, cap) };
				})
			);
		},
		[data]
	);

	const removeDoll = useCallback((cell: number) => setSetups((current) => current.filter((setup) => setup.cell !== cell)), []);

	// One enemy per cell, so replacing a tile's occupant needs no cap check: there are only ever as many entries as there are cells.
	const placeEnemy = useCallback((cell: number, enemyId: number) => {
		setEnemies((current) => [...current.filter((entry) => entry.cell !== cell), { cell, enemyId }]);
	}, []);

	const removeEnemy = useCallback((cell: number) => setEnemies((current) => current.filter((entry) => entry.cell !== cell)), []);

	const setFairy = useCallback((fairyId: number | null) => setFairyState(fairyId === null ? null : { fairyId, level: DEFAULT_FAIRY_LEVEL, stars: DEFAULT_FAIRY_STARS }), []);

	const updateFairy = useCallback((patch: Partial<Omit<FairySetup, "fairyId">>) => setFairyState((current) => (current === null ? current : { ...current, ...patch })), []);

	const moveDoll = useCallback((from: number, to: number) => {
		if (from === to) {
			return;
		}
		setSetups((current) => current.map((setup) => (setup.cell === from ? { ...setup, cell: to } : setup.cell === to ? { ...setup, cell: from } : setup)));
	}, []);

	const moveEnemy = useCallback((from: number, to: number) => {
		if (from === to) {
			return;
		}
		setEnemies((current) => current.map((entry) => (entry.cell === from ? { ...entry, cell: to } : entry.cell === to ? { ...entry, cell: from } : entry)));
	}, []);

	// Memoised so a component taking the whole state as one prop only re-renders when a field changes.
	return useMemo(
		() => ({ setups, enemies, fairy, placeDoll, updateDoll, removeDoll, moveDoll, placeEnemy, removeEnemy, moveEnemy, setFairy, updateFairy }),
		[setups, enemies, fairy, placeDoll, updateDoll, removeDoll, moveDoll, placeEnemy, removeEnemy, moveEnemy, setFairy, updateFairy]
	);
}
