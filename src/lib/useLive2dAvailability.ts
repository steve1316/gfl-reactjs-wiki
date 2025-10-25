import { useEffect, useState } from "react";

import type { Live2dAvailability } from "./data";
import { loadLive2dAvailability } from "./data";

/**
 * Load which fairies, HOCs and T-Dolls have a Live2D model, but only once a caller turns the fetch on.
 *
 * Shared by the T-Doll, Fairy and HOC index pages' Live2D filter chip. The load starts on the first render where
 * `enabled` is true, whether that is a manual toggle or a saved filter restoring the chip already on, so a visitor
 * who never opens the chip never downloads the index.
 *
 * @param enabled Whether the Live2D filter is on.
 * @returns The availability once loaded, or null before the load starts or while it is still in flight.
 */
export function useLive2dAvailability(enabled: boolean): Live2dAvailability | null {
	const [availability, setAvailability] = useState<Live2dAvailability | null>(null);

	useEffect(() => {
		if (!enabled || availability !== null) {
			return;
		}
		let active = true;
		loadLive2dAvailability().then(
			(loaded) => active && setAvailability(loaded),
			() => {}
		);
		return () => {
			active = false;
		};
	}, [enabled, availability]);

	return availability;
}
