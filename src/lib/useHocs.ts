import { useCallback, useEffect, useState } from "react";

import type { HocData } from "../types/hoc";
import { loadHocs } from "./data";

/** What `useHocs` hands back. */
interface HocsState {
	/** The HOC data, or null until it loads. */
	data: HocData | null;
	/** True when the load failed, which swaps the page for a retry notice. */
	loadFailed: boolean;
	/** Loads the data again after a failure. */
	retry: () => void;
}

/**
 * Load the HOC data on mount, shared by the HOC Index and each HOC's page.
 *
 * @returns The data once loaded, whether the load failed, and a retry.
 */
export function useHocs(): HocsState {
	const [data, setData] = useState<HocData | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by `retry` to run the load again.
	const [loadAttempt, setLoadAttempt] = useState(0);

	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadHocs().then(
			(loaded) => active && setData(loaded),
			() => active && setLoadFailed(true)
		);
		return () => {
			active = false;
		};
	}, [loadAttempt]);

	const retry = useCallback(() => setLoadAttempt((current) => current + 1), []);

	return { data, loadFailed, retry };
}
