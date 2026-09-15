import { useCallback, useEffect, useState } from "react";

import type { FairyData } from "../types/fairy";
import { loadFairies } from "./data";

/** What `useFairies` hands back. */
interface FairiesState {
	/** The Fairy data, or null until it loads. */
	data: FairyData | null;
	/** True when the load failed, which swaps the page for a retry notice. */
	loadFailed: boolean;
	/** Loads the data again after a failure. */
	retry: () => void;
}

/**
 * Load the Fairy data on mount, shared by the Fairy Index and each Fairy's page.
 *
 * @returns The data once loaded, whether the load failed, and a retry.
 */
export function useFairies(): FairiesState {
	const [data, setData] = useState<FairyData | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by `retry` to run the load again.
	const [loadAttempt, setLoadAttempt] = useState(0);

	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadFairies().then(
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
