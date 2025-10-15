import { useEffect, useState } from "react";

import type { Live2dMotion } from "../types/live2d";
import { loadFairyLive2dMotions, loadHocLive2dMotions } from "./data";

/** What `useFairyLive2dMotions` and `useHocLive2dMotions` hand back. */
interface Live2dMotionsState {
	/** The model's motions once loaded, undefined when nothing was published for it, or null before the load settles. */
	motions: Live2dMotion[] | undefined | null;
}

/**
 * Load one model's Live2D motions by id, shared by the fairy and HOC hooks below since both only differ in which loader they call.
 *
 * @param id The model's id, or undefined before it is known.
 * @param loader Fetches the motions for one id, resolving to undefined when nothing was published for it.
 * @returns The motions once loaded.
 */
function useModelLive2dMotions(id: number | undefined, loader: (id: number) => Promise<Live2dMotion[] | undefined>): Live2dMotionsState {
	const [motions, setMotions] = useState<Live2dMotion[] | undefined | null>(null);

	useEffect(() => {
		if (id === undefined) {
			return;
		}
		let active = true;
		setMotions(null);
		loader(id).then(
			(loaded) => active && setMotions(loaded),
			() => {}
		);
		return () => {
			active = false;
		};
		// `loader` is a stable module-level function at every call site (`loadFairyLive2dMotions` or `loadHocLive2dMotions`),
		// so including it here never causes an extra run.
	}, [id, loader]);

	return { motions };
}

/**
 * Load one fairy's Live2D motions, for the Live2D viewer's motion tabs and touch reactions.
 *
 * @param id Fairy id, or undefined before it is known.
 * @returns The motions once loaded.
 */
export function useFairyLive2dMotions(id: number | undefined): Live2dMotionsState {
	return useModelLive2dMotions(id, loadFairyLive2dMotions);
}

/**
 * Load one HOC's Live2D motions, for the animations card's motion cycling and caption.
 *
 * @param id HOC id, or undefined before it is known.
 * @returns The motions once loaded.
 */
export function useHocLive2dMotions(id: number | undefined): Live2dMotionsState {
	return useModelLive2dMotions(id, loadHocLive2dMotions);
}
