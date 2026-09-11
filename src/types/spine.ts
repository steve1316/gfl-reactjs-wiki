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

/** A combat rig and the dorm rig that usually accompanies it. Skins and the Mod form share this shape. */
export interface SpineRigPair {
	/** The combat rig, absent only when no atlas could be paired with the skeleton. */
	combat?: SpineRig;
	/** The dorm rig, when one was published. */
	dorm?: SpineRig;
}

/** Everything published for one doll. */
export interface SpineDollEntry {
	/** The combat rig: attack, move, victory and so on. */
	combat?: SpineRig;
	/** The dorm rig: sit, lying, pick and so on. */
	dorm?: SpineRig;
	/**
	 * The Mod form's rigs, present only for the dolls that have a Mod.
	 *
	 * A Mod doll is a different chibi with its own animation set, so it cannot share the base rig. Mod
	 * skins do not exist, which is why this is a single pair rather than a list.
	 */
	mod?: SpineRigPair;
	/**
	 * Skin rigs in the same order the skin tabs render.
	 *
	 * Aligned by `tools/assets/map_skin_rigs.mjs`, which resolves each skin name through the game's
	 * own skin table. Entries are `null` where a skin has no rig published, which is common.
	 */
	skinRigs?: (SpineRigPair | null)[];
}

/** The whole index, keyed by stringified doll id. */
export type SpineIndex = Record<string, SpineDollEntry>;
