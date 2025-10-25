/** Types for the generated `live2d-index.json`. */

/**
 * What kind of motion this is: the looping idle pose, a random wait, a touch reaction, or one of the skin-only groups (a shake reaction,
 * the wedding pose, or an uncategorized clip). A table-driven classification for labelling and touch-area lookup only - never pass this to
 * `Live2dStage.playMotion`, use `model3Group` instead. Fairy and HOC entries only ever use `idle`, `wait` and `touch`, so widening this
 * union to include the skin-only groups does not change their meaning.
 */
export type Live2dMotionGroup = "idle" | "wait" | "touch" | "shake" | "wedding" | "other";

/** Which body area a touch reaction responds to. `leg` is only produced by T-Doll skin motions - fairies and HOCs never have it. */
export type Live2dTouchArea = "head" | "body" | "leg";

/** One motion a Live2D model can play. */
export interface Live2dMotion {
	/** The motion's file name, without extension, as `tools/assets/build_live2d_index.py` reads it from the staging tree. */
	name: string;
	/** What kind of motion this is. See `Live2dMotionGroup`. */
	group: Live2dMotionGroup;
	/**
	 * The literal group name this motion lives under in the model's own `model3.json`, exactly as `tools/assets/extract_live2d.py`'s
	 * `motion_group_name` computed it when the model was built. This is the value `Live2dStage.playMotion` expects: `group` above is a
	 * separate, table-driven classification that can disagree with it for an oddly named or misclassified clip.
	 */
	model3Group: string;
	/** Clip length in seconds, rounded to two decimals. */
	seconds: number;
	/** Which body area a touch reaction responds to, or null when the motion is not a touch reaction. See `Live2dTouchArea`. */
	touchArea: Live2dTouchArea | null;
	/**
	 * The dialogue this motion plays, resolved from the game's voice table, or null when the motion has none. Only T-Doll skin motions
	 * carry this field - fairy and HOC motions omit the key entirely, which is why it is optional here rather than required.
	 */
	line?: string | null;
}

/** What one fairy, HOC, or T-Doll skin variant's Live2D model can play. */
export interface Live2dEntry {
	/** The model's motions, in file name order. */
	motions: Live2dMotion[];
}

/**
 * Which variant names (`normal`, `damaged`, or both) exist for one T-Doll skin form/skin combination, keyed by skin key. No motions -
 * see `Live2dIndex.tdolls`.
 */
export type Live2dSkinAvailability = Record<string, string[]>;

/** The whole index, each part keyed by stringified id. */
export interface Live2dIndex {
	/** Fairy motions keyed by stringified fairy id. */
	fairies: Record<string, Live2dEntry>;
	/** HOC motions keyed by stringified HOC id. */
	hocs: Record<string, Live2dEntry>;
	/**
	 * Which T-Doll skin Live2D models are available, keyed by stringified doll id, then form (`base` or `mod`), then skin key (`base` or
	 * a skin id as a string), to the variant names present (`normal`, `damaged`, or both). This is availability only, with no motions -
	 * the motions themselves are too large to ship on every doll page, so they live in one file per doll under `src/data/live2d-tdolls/`,
	 * loaded by `loadSkinLive2dMotions`. Optional because an index built before the skin extraction ran has no `tdolls` key at all -
	 * every reader must treat a missing key the same as a missing entry, never throw.
	 */
	tdolls?: Record<string, Record<string, Live2dSkinAvailability>>;
}

/**
 * One doll's T-Doll skin Live2D motions, from its own `src/data/live2d-tdolls/<dollId>.json` file: form (`base` or `mod`) to skin key
 * (`base` or a skin id as a string) to variant (`normal` or `damaged`) to that variant's motions.
 */
export type Live2dTdollFile = Record<string, Record<string, Record<string, Live2dEntry>>>;
