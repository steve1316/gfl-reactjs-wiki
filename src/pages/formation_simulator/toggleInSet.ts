/**
 * A copy of a set with one value added, or removed when it was already there.
 *
 * @param set The current set.
 * @param value The value to toggle.
 * @returns The new set.
 */
export function toggleInSet<T>(set: ReadonlySet<T>, value: T): Set<T> {
	const next = new Set(set);
	if (next.has(value)) {
		next.delete(value);
	} else {
		next.add(value);
	}
	return next;
}
