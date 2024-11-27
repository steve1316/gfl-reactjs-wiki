/** Types for the generated `spine-index.json`, keyed by skin id. */

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

/** Everything published for one doll. Rig paths are relative to `spine/<id>/`. */
export interface SpineDollEntry {
	/** The combat rig: attack, move, victory and so on. */
	combat?: SpineRig;
	/** The dorm rig: sit, lying, pick and so on. */
	dorm?: SpineRig;
	/**
	 * The Mod form's rigs, present only for the dolls that have a Mod.
	 *
	 * A Mod doll is a different chibi with its own animation set, so it cannot share the base rig.
	 */
	mod?: SpineRigPair;
	/** Skin rigs keyed by skin id as a string, or by a `legacy-<slug>` key. Skins with no rig published are absent. */
	skins?: Record<string, SpineRigPair>;
}

/** The whole index, keyed by stringified doll id. */
export type SpineIndex = Record<string, SpineDollEntry>;

/** Everything published for one HOC. Rig paths are relative to `hoc-spine/<id>/`. */
export interface HocSpineEntry {
	/** The combat rig, always published since a HOC with no rig is not listed at all. */
	combat: SpineRig;
	/** The crew's own rigs, shown alongside the combat rig. */
	crew: SpineRig[];
}

/** The whole HOC index, keyed by stringified HOC id. */
export type HocSpineIndex = Record<string, HocSpineEntry>;
