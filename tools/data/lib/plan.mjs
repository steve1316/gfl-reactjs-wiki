/**
 * Decide whether the scheduled refresh has anything to do.
 *
 * There is work when upstream has a newer commit than the lock, or when the dolls released as of today differ from the dolls in the
 * committed shards. The collaboration dolls added by hand through `overrides.json` `addDolls` are never released upstream, so they are
 * left out of the comparison.
 *
 * @param {{ lockedSha: string, latestSha: string, releasedIds: number[], committedIds: number[], extraIds: number[] }} input The locked and
 *   latest gf-data-us commits, the doll ids upstream releases as of the cutoff, the doll ids in the committed shards, and the hand-added ids.
 * @returns {{ work: boolean, upstream: { locked: string, latest: string }, released: { added: number[], removed: number[] } }} The plan.
 */
export function planRefresh({ lockedSha, latestSha, releasedIds, committedIds, extraIds }) {
	const extras = new Set(extraIds);
	const committed = new Set(committedIds.filter((id) => !extras.has(id)));
	const released = new Set(releasedIds);
	const byNumber = (a, b) => a - b;
	const added = [...released].filter((id) => !committed.has(id)).sort(byNumber);
	const removed = [...committed].filter((id) => !released.has(id)).sort(byNumber);
	return {
		work: lockedSha !== latestSha || added.length > 0 || removed.length > 0,
		upstream: { locked: lockedSha, latest: latestSha },
		released: { added, removed }
	};
}
