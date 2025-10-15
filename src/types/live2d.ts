/** Types for the generated `live2d-index.json`. */

/** One motion a Live2D model can play. */
export interface Live2dMotion {
	/** The motion's file name, without extension, as `tools/assets/build_live2d_index.py` reads it from the staging tree. */
	name: string;
	/**
	 * What kind of motion this is: the looping idle pose, a random wait, or a touch reaction. A table-driven classification for
	 * labelling and touch-area lookup only - never pass this to `Live2dStage.playMotion`, use `model3Group` instead.
	 */
	group: "idle" | "wait" | "touch";
	/**
	 * The literal group name this motion lives under in the model's own `model3.json`, exactly as `tools/assets/extract_live2d.py`'s
	 * `motion_group_name` computed it when the model was built. This is the value `Live2dStage.playMotion` expects: `group` above is a
	 * separate, table-driven classification that can disagree with it for an oddly named or misclassified clip.
	 */
	model3Group: string;
	/** Clip length in seconds, rounded to two decimals. */
	seconds: number;
	/** Which body area a touch reaction responds to, or null when the motion is not a touch reaction. */
	touchArea: "head" | "body" | null;
}

/** What one fairy or HOC's Live2D model can play. */
export interface Live2dEntry {
	/** The model's motions, in file name order. */
	motions: Live2dMotion[];
}

/** The whole index, each half keyed by stringified id. */
export interface Live2dIndex {
	/** Fairy motions keyed by stringified fairy id. */
	fairies: Record<string, Live2dEntry>;
	/** HOC motions keyed by stringified HOC id. */
	hocs: Record<string, Live2dEntry>;
}
