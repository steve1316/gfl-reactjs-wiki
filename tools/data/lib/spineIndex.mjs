/**
 * Shape check for the generated `src/data/spine-index.json`.
 *
 * The site reads the skin-id (v3) index: skin rigs keyed by skin id under `skins`. An index written by a retired slot-map tool, with
 * `skinRigs` arrays, or one missing combat rigs would still load but show the wrong chibi or none, so the check fails on it instead. A rig
 * with no animation names is rejected too, since the page would offer a chibi with nothing to play.
 */

/**
 * Whether a value is a rig: a skeleton path, an atlas path and a list of animation names.
 *
 * @param {unknown} rig The value to test.
 * @returns {boolean} True when the value has string `skel` and `atlas` and an array `anims`.
 */
function isRig(rig) {
	return typeof rig === "object" && rig !== null && typeof rig.skel === "string" && typeof rig.atlas === "string" && Array.isArray(rig.anims);
}

/**
 * List every rig a doll's entry holds, labelled for messages.
 *
 * @param {object} entry One doll's index entry.
 * @returns {Array<[string, object]>} Label and rig pairs for the rigs that are present and rig-shaped.
 */
function labelledRigs(entry) {
	const skins = typeof entry.skins === "object" && entry.skins !== null && !Array.isArray(entry.skins) ? Object.entries(entry.skins) : [];
	return [
		["combat", entry.combat],
		["dorm", entry.dorm],
		["Mod combat", entry.mod?.combat],
		["Mod dorm", entry.mod?.dorm],
		...skins.flatMap(([key, pair]) => [
			[`skin ${key} combat`, pair?.combat],
			[`skin ${key} dorm`, pair?.dorm]
		])
	].filter(([, rig]) => isRig(rig));
}

/**
 * List what is wrong with a Spine index's shape.
 *
 * @param {unknown} index The parsed index.
 * @returns {string[]} One message per problem, empty when the index is v3-shaped.
 */
export function findSpineIndexProblems(index) {
	if (typeof index !== "object" || index === null || Array.isArray(index)) {
		return ["the spine index is not an object keyed by doll id"];
	}
	const problems = [];
	for (const [id, entry] of Object.entries(index)) {
		if (!/^\d+$/.test(id)) {
			problems.push(`key ${id} is not a doll id`);
			continue;
		}
		if ("skinRigs" in entry) {
			problems.push(`doll ${id} has a version 2 skinRigs list`);
		}
		if (!isRig(entry.combat)) {
			problems.push(`doll ${id} has no combat rig`);
		}
		if (entry.dorm !== undefined && !isRig(entry.dorm)) {
			problems.push(`doll ${id} has a malformed dorm rig`);
		}
		if (entry.mod !== undefined && !isRig(entry.mod?.combat)) {
			problems.push(`doll ${id} Mod has no combat rig`);
		}
		for (const [label, rig] of labelledRigs(entry)) {
			if (rig.anims.length === 0) {
				problems.push(`doll ${id} ${label} rig ${rig.skel} has no animations`);
			}
		}
		if (entry.skins !== undefined) {
			if (typeof entry.skins !== "object" || entry.skins === null || Array.isArray(entry.skins)) {
				problems.push(`doll ${id} skins is not a map keyed by skin id`);
				continue;
			}
			for (const [key, pair] of Object.entries(entry.skins)) {
				if (!isRig(pair?.combat)) {
					problems.push(`doll ${id} skin ${key} has no combat rig`);
				}
			}
		}
	}
	return problems;
}
