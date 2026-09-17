import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FORMATION_PARAM, decodeFormation, encodeFormation } from "../../lib/formation/codec";
import { MAX_ECHELON, MAX_SKILL_LEVEL, MAX_LINKS, levelCap, maxModStage } from "../../lib/formation/pipeline";
import type { DollSetup } from "../../lib/formation/pipeline";
import type { FormationData } from "../../types/formation";

/** How long the echelon must stay unchanged before it is written to the URL, in milliseconds. Firefox throws once history calls come too fast. */
const URL_WRITE_DELAY_MS = 250;

/** The echelon and the ways to change it. */
export interface FormationState {
	/** Dolls on the grid, in placement order. */
	setups: DollSetup[];
	/** Put a doll on an empty cell with default settings. Ignored when the cell is taken, the doll is already placed or the echelon is full. */
	placeDoll: (cell: number, dollId: number) => void;
	/** Change the settings of the doll on a cell. */
	updateDoll: (cell: number, patch: Partial<Omit<DollSetup, "cell" | "dollId">>) => void;
	/** Take the doll off a cell. */
	removeDoll: (cell: number) => void;
	/** Move the doll on one cell to another, swapping with any doll already there. */
	moveDoll: (from: number, to: number) => void;
}

/**
 * The echelon, read once from the `f` query parameter when the data arrives and written back shortly after each change.
 *
 * @param data The loaded formation data, or null while it loads.
 * @returns The echelon state.
 */
export function useFormationState(data: FormationData | null): FormationState {
	const [searchParams, setSearchParams] = useSearchParams();
	const [setups, setSetups] = useState<DollSetup[]>([]);
	const [ready, setReady] = useState(false);
	// The URL write waiting on the debounce, with the page path it belongs to, or null when the URL is up to date.
	const pendingWriteRef = useRef<{ pathname: string; write: () => void } | null>(null);

	useEffect(() => {
		if (data && !ready) {
			setSetups(decodeFormation(searchParams.get(FORMATION_PARAM) ?? "", data.forms, data.constants));
			setReady(true);
		}
	}, [data, ready, searchParams]);

	// Skipped until the first decode has landed, so the empty initial state never wipes a shared link. Debounced so a dragged slider
	// writes once when it settles rather than once per step.
	useEffect(() => {
		if (!ready) {
			return;
		}
		const encoded = encodeFormation(setups);
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
	}, [ready, setups, setSearchParams]);

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
				const modStage = maxModStage(dollId, data.forms);
				return [...current, { cell, dollId, modStage, level: levelCap(modStage, data.constants), links: MAX_LINKS, affection: 0, skill1: MAX_SKILL_LEVEL, skill2: MAX_SKILL_LEVEL }];
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

	const moveDoll = useCallback((from: number, to: number) => {
		if (from === to) {
			return;
		}
		setSetups((current) => current.map((setup) => (setup.cell === from ? { ...setup, cell: to } : setup.cell === to ? { ...setup, cell: from } : setup)));
	}, []);

	// Memoised so a component taking the whole state as one prop only re-renders when a field changes.
	return useMemo(() => ({ setups, placeDoll, updateDoll, removeDoll, moveDoll }), [setups, placeDoll, updateDoll, removeDoll, moveDoll]);
}
