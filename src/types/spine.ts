/** Types for the generated `spine-index.json`. */

/** One skeleton and the atlas it renders with. */
export interface SpineRig {
	/** Skeleton basename, relative to the doll's Spine directory, without the extension. */
	skel: string;
	/** Atlas basename. Often differs from `skel`, since dorm rigs share the combat atlas. */
	atlas: string;
	/**
	 * Animation names this skeleton defines.
	 *
	 * Read from the skeleton itself rather than inferred from the old GIF filenames, which disagree:
	 * most dolls call their skill animation `s`, and some skeletons carry animations no GIF existed for.
	 */
	anims: string[];
}

/** Everything published for one doll. */
export interface SpineDollEntry {
	/** The combat rig: attack, move, victory and so on. */
	combat?: SpineRig;
	/** The dorm rig: sit, lying, pick and so on. */
	dorm?: SpineRig;
	/** Skin rigs, keyed by the skin id from the filename. */
	skins?: Record<string, SpineRig>;
}

/** The whole index, keyed by stringified doll id. */
export type SpineIndex = Record<string, SpineDollEntry>;
