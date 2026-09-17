import { searchIndex } from "../../lib/data";

/** Search index entries by doll id. */
const ENTRIES = new Map(searchIndex.map((entry) => [entry.id, entry]));

/**
 * A doll's display name in the simulator.
 *
 * @param dollId Doll id.
 * @param modStage 0 for the base form, 1 to 3 for Mod stages.
 * @returns The name, with "MOD" appended for a Mod stage, or `#<id>` when the doll is not in the search index.
 */
export function dollName(dollId: number, modStage: number): string {
	const name = ENTRIES.get(dollId)?.name ?? `#${dollId}`;
	return modStage > 0 ? `${name} MOD` : name;
}
