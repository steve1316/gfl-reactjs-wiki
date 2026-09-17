import { useCallback, useEffect, useState } from "react";

import type { EnemyData } from "../types/enemy";
import { loadEnemies } from "./data";

/** What `useEnemies` hands back. */
interface EnemiesState {
	/** The enemy data, or null until it loads. */
	data: EnemyData | null;
	/** True when the load failed, which swaps the page for a retry notice. */
	loadFailed: boolean;
	/** Loads the data again after a failure. */
	retry: () => void;
}

/**
 * Load the enemy data on mount, shared by the Enemy Index and each enemy's page.
 *
 * @returns The data once loaded, whether the load failed, and a retry.
 */
export function useEnemies(): EnemiesState {
	const [data, setData] = useState<EnemyData | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by `retry` to run the load again.
	const [loadAttempt, setLoadAttempt] = useState(0);

	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadEnemies().then(
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
