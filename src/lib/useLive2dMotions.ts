import { useEffect, useState } from "react";

import type { AnimationTab } from "./spine";
import type { Live2dMotion } from "../types/live2d";
import { loadFairyLive2dMotions, loadHocLive2dMotions, loadSkinLive2dForms, loadSkinLive2dMotions } from "./data";

/**
 * The `model3Group` value every idle-classified motion's index entry carries, per `tools/assets/extract_live2d.py`'s
 * `motion_group_name`. Shared by the fairy and HOC Live2D viewers.
 */
export const IDLE_TAB_VALUE = "Idle";

/**
 * A readable label for a raw motion file name, such as `wait_01`.
 *
 * @param name The motion's file name from the Live2D index.
 * @returns The name split on underscores and title-cased.
 */
export function motionLabel(name: string): string {
	return name
		.split("_")
		.map((part) => (part.length === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
		.join(" ");
}

/**
 * The playable motion tabs for a model, one per distinct model3 motion group.
 *
 * The tab's `value` is each motion's own `model3Group`, the group name the model's actual `model3.json` uses, so a click always
 * finds a real group to play. Every idle-classified clip collapses into the single `Idle` group they share.
 *
 * @param motions The model's motions from the Live2D index.
 * @returns Tabs in the index's own order, for `nextAnimationValue` and the caption.
 */
export function motionTabs(motions: readonly Live2dMotion[]): AnimationTab[] {
	const tabs: AnimationTab[] = [];
	const seen = new Set<string>();
	for (const motion of motions) {
		const value = motion.model3Group;
		if (seen.has(value)) {
			continue;
		}
		seen.add(value);
		tabs.push({ value, label: value === IDLE_TAB_VALUE ? "Idle" : motionLabel(motion.name) });
	}
	return tabs;
}

/**
 * Load one model's Live2D data by id, shared by every hook below that keys off a single id since they only differ in which loader
 * they call.
 *
 * @param id The model's id, or undefined before it is known.
 * @param loader Fetches the data for one id, resolving to undefined when nothing was published for it.
 * @returns The data once loaded, undefined when nothing was published for it, or null before the load settles.
 */
function useModelLive2dData<T>(id: number | undefined, loader: (id: number) => Promise<T | undefined>): T | undefined | null {
	const [value, setValue] = useState<T | undefined | null>(null);

	useEffect(() => {
		if (id === undefined) {
			return;
		}
		let active = true;
		setValue(null);
		loader(id).then(
			(loaded) => active && setValue(loaded),
			() => {}
		);
		return () => {
			active = false;
		};
		// `loader` is a stable module-level function at every call site, so including it here never causes an extra run.
	}, [id, loader]);

	return value;
}

/**
 * Load one fairy's Live2D motions, for the Live2D viewer's motion tabs and touch reactions.
 *
 * @param id Fairy id, or undefined before it is known.
 * @returns The motions once loaded, undefined when nothing was published for it, or null before the load settles.
 */
export function useFairyLive2dMotions(id: number | undefined): Live2dMotion[] | undefined | null {
	return useModelLive2dData(id, loadFairyLive2dMotions);
}

/**
 * Load one HOC's Live2D motions, for the animations card's motion cycling and caption.
 *
 * @param id HOC id, or undefined before it is known.
 * @returns The motions once loaded, undefined when nothing was published for it, or null before the load settles.
 */
export function useHocLive2dMotions(id: number | undefined): Live2dMotion[] | undefined | null {
	return useModelLive2dData(id, loadHocLive2dMotions);
}

/**
 * Load which form, skin and variant combinations have a published T-Doll skin Live2D model, for the doll page to decide whether to
 * offer the Live2D toggle at all before any motions are loaded.
 *
 * @param dollId The doll's base id, or undefined before it is known.
 * @returns The doll's forms once loaded, undefined when it has no T-Doll skin Live2D models, or null before the load settles.
 */
export function useSkinLive2dForms(dollId: number | undefined): Record<string, Record<string, string[]>> | undefined | null {
	return useModelLive2dData(dollId, loadSkinLive2dForms);
}

/**
 * Load one T-Doll skin variant's Live2D motions, for the doll page's Live2D viewer once a skin, form and variant are selected.
 *
 * @param dollId The doll's base id, or undefined before it is known.
 * @param form `base` or `mod`, the doll form the model belongs to.
 * @param skinKey `base` for the form's own art, or the skin id as a string.
 * @param variant `normal` or `damaged`.
 * @returns The motions once loaded, undefined when nothing was published for it, or null before the load settles.
 */
export function useSkinLive2dMotions(dollId: number | undefined, form: string, skinKey: string, variant: string): Live2dMotion[] | undefined | null {
	const [motions, setMotions] = useState<Live2dMotion[] | undefined | null>(null);

	useEffect(() => {
		if (dollId === undefined) {
			return;
		}
		let active = true;
		setMotions(null);
		loadSkinLive2dMotions(dollId, form, skinKey, variant).then(
			(loaded) => active && setMotions(loaded),
			() => {}
		);
		return () => {
			active = false;
		};
	}, [dollId, form, skinKey, variant]);

	return motions;
}
