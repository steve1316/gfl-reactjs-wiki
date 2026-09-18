/**
 * Parser for the game's AVG cutscene scripts, the `.txt` files under `asset/avgtxt/` in the upstream data.
 *
 * One line of a script is one beat: the sprites on stage, who is speaking, the stage directions, and the text. The grammar, written
 * with placeholders rather than real lines, is:
 *
 *     LEFT_SPRITES||RIGHT_SPRITES:text
 *     Prefab(expression)<Speaker>NAME</Speaker>;Prefab2(0)||<BGM>cue</BGM>:first page+second page
 *
 * `||` splits the left side of the stage from the right. Within a side, `;` separates sprites, a sprite is `Prefab(expression)`, and
 * a bare `()` means nobody is shown, which is how narration is written. Tags are either paired (`<BGM>cue</BGM>`) or bare
 * (`<comms box>`); a tag that positions or labels a sprite binds to the sprite before it, and anything else is a direction for the
 * whole beat.
 *
 * Tag names stay Chinese even in the English data, and several have case variants, so names are treated as opaque keys rather than
 * parsed as words. Any tag this module does not recognise is kept as an `unknown` op carrying its raw name: 2,284 main-story scripts
 * contain forms no parser has seen, and dropping them silently is how a scene breaks with nothing to show for it.
 *
 * This module is pure - it takes script text and returns data, so it can be tested without touching the upstream checkout.
 */

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module constants

/** Tags naming who speaks. The game writes both cases. */
const SPEAKER_TAGS = new Set(["Speaker", "speaker"]);

/** Tags marking the beat as narration rather than a character speaking. */
const NARRATOR_TAGS = new Set(["narrator"]);

/** Tags that describe the sprite before them rather than the beat, so they bind to that sprite. */
const SPRITE_TAGS = new Set(["Position", "position", "Scale", "Size", "通讯框", "边框"]);

/** Tag names to the scene op they become, so the player reads one vocabulary instead of the game's mixed one. */
const OP_NAMES = {
	BGM: "bgm",
	SE: "sfx",
	SE1: "sfx",
	SE2: "sfx",
	BIN: "background",
	Pic: "background",
	cg: "cg",
	CG: "cg",
	CGDelay: "cgDelay",
	Night: "night",
	night: "night",
	Grey: "grey",
	Shake: "shake",
	震屏: "shake",
	震屏3: "shake",
	controll_shake: "shake",
	立绘振动: "spriteShake",
	黑屏1: "blackscreen",
	黑屏2: "blackscreen",
	白屏1: "whitescreen",
	白屏2: "whitescreen",
	白屏闪光: "whiteFlash",
	闪屏: "flash",
	黑点1: "fadePoint",
	黑点2: "fadePoint",
	同时置暗: "darken",
	同时置亮: "brighten",
	同时点亮: "brighten",
	关闭蒙版: "closeMask",
	回忆: "flashback",
	睁眼: "openEyes",
	睁眼2: "openEyes",
	下雪: "snow",
	火花: "spark",
	关闭火花: "sparkOff",
	火花关闭: "sparkOff",
	火焰销毁: "fireOut",
	刮花: "scratch",
	开火: "muzzleFlash",
	快跑: "run",
	拉伸: "stretch",
	平移: "pan",
	bg_move: "backgroundMove",
	BIN_SlowIn: "backgroundSlowIn",
	GradientShow: "gradientShow",
	GradientHide: "gradientHide",
	common_effect: "effect",
	CloseOldEffect: "effectOff",
	ShootPanel: "shootPanel",
	hide_dialogue: "hideDialogue",
	delay: "delay",
	Delay: "delay",
	duration: "duration",
	rate: "rate",
	tips: "tips",
	分支: "branch",
	branchstyle: "branchStyle",
	InputBox: "inputBox",
	名单: "credits",
	名单2: "credits",
	Position: "spritePosition",
	position: "spritePosition",
	Scale: "spriteScale",
	Size: "spriteSize",
	通讯框: "commsBox",
	边框: "frame"
};

/** Inline markup inside the spoken text, which becomes styled spans rather than stage directions. */
const INLINE_TAGS = new Set(["color", "size", "c", "t", "r", "b", "i"]);

/** Splits the text of a beat into successive click-through pages. */
const PAGE_SEPARATOR = "+";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Line splitting

/**
 * Split a line into its stage head and its spoken text at the first colon outside a tag.
 *
 * Scanning rather than using `indexOf` matters because both a tag value and the dialogue itself can contain a colon, and only the
 * first one at the top level ends the head.
 *
 * @param {string} line One line of a script.
 * @returns {{ head: string, text: string | null }} The head, and the text, or null when the line has no colon at all.
 */
export function splitBeat(line) {
	let depth = 0;
	for (let index = 0; index < line.length; index++) {
		const character = line[index];
		if (character === "<") {
			depth++;
		} else if (character === ">") {
			depth = Math.max(0, depth - 1);
		} else if (character === ":" && depth === 0) {
			return { head: line.slice(0, index), text: line.slice(index + 1) };
		}
	}
	return { head: line, text: null };
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Head parsing

/**
 * Read the tags and sprites of one side of the stage.
 *
 * @param {string} block The text of one side, before or after the `||`.
 * @param {"left" | "right"} side Which side of the stage it is.
 * @param {{ sprites: object[], ops: object[], speaker: string | null, narrator: boolean, unknown: string[] }} beat The beat being filled in.
 */
function readBlock(block, side, beat) {
	// One pass over the block, so a tag can be bound to the sprite that came before it.
	const token = /<([^<>/]+?)>([^<]*)<\/\1>|<([^<>/]+?)>|([^;<>()]*)\((\d*)\)|;/gy;
	let current = null;
	let match;
	token.lastIndex = 0;
	while ((match = token.exec(block)) !== null) {
		const [whole, pairedName, pairedValue, bareName, prefab, expression] = match;
		if (whole === ";") {
			current = null;
			continue;
		}
		if (prefab !== undefined) {
			// A bare `()` is narration: the beat has text but nobody on stage.
			if (prefab.trim() === "") {
				current = null;
				continue;
			}
			current = { prefab: prefab.trim(), expression: expression === "" ? 0 : Number(expression), side, tags: {} };
			beat.sprites.push(current);
			continue;
		}
		const bareSplit = bareName === undefined ? -1 : bareName.indexOf("=");
		const name = pairedName ?? (bareSplit === -1 ? bareName : bareName.slice(0, bareSplit));
		const value = pairedValue ?? (bareSplit === -1 ? "" : bareName.slice(bareSplit + 1));
		if (SPEAKER_TAGS.has(name)) {
			beat.speaker = value.trim() === "" ? null : value.trim();
			continue;
		}
		if (NARRATOR_TAGS.has(name)) {
			beat.narrator = true;
			continue;
		}
		if (SPRITE_TAGS.has(name) && current) {
			current.tags[name] = value;
			continue;
		}
		if (INLINE_TAGS.has(name)) {
			continue;
		}
		const op = OP_NAMES[name];
		if (op) {
			beat.ops.push(value === "" ? { type: op, raw: name } : { type: op, value, raw: name });
			continue;
		}
		// Kept rather than dropped, and reported by the build so new tags surface instead of vanishing.
		beat.unknown.push(name);
		beat.ops.push({ type: "unknown", raw: name, value });
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Text parsing

/**
 * Split spoken text into pages and turn its inline markup into styled spans.
 *
 * @param {string} text The text after the colon.
 * @returns {{ spans: { text: string, style?: Record<string, string> }[] }[]} One entry per click-through page.
 */
export function readText(text) {
	return text.split(PAGE_SEPARATOR).map((page) => ({ spans: readSpans(page) }));
}

/**
 * Turn one page's inline markup into a flat list of styled spans.
 *
 * @param {string} page One page of text.
 * @returns {{ text: string, style?: Record<string, string> }[]} The spans, in order.
 */
function readSpans(page) {
	const spans = [];
	const style = {};
	let buffer = "";
	const token = /<(\/?)([a-zA-Z]+)(?:=([^<>]*))?>/g;
	let last = 0;
	let match;
	const flush = () => {
		if (buffer !== "") {
			spans.push(Object.keys(style).length === 0 ? { text: buffer } : { text: buffer, style: { ...style } });
			buffer = "";
		}
	};
	while ((match = token.exec(page)) !== null) {
		const [whole, closing, name, value] = match;
		if (!INLINE_TAGS.has(name)) {
			continue;
		}
		buffer += page.slice(last, match.index);
		last = match.index + whole.length;
		flush();
		if (closing === "/") {
			delete style[name];
		} else {
			style[name] = value ?? "";
		}
	}
	buffer += page.slice(last);
	flush();
	return spans;
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Script parsing

/**
 * Parse one beat.
 *
 * @param {string} line One non-empty line of a script.
 * @returns {object} The beat: its sprites, speaker, stage ops and pages of text.
 */
export function parseBeat(line) {
	const beat = { sprites: [], ops: [], speaker: null, narrator: false, pages: [], unknown: [] };
	const { head, text } = splitBeat(line);
	const separator = head.indexOf("||");
	const left = separator === -1 ? head : head.slice(0, separator);
	const right = separator === -1 ? "" : head.slice(separator + 2);
	readBlock(left, "left", beat);
	readBlock(right, "right", beat);
	if (text !== null && text !== "") {
		beat.pages = readText(text);
	}
	return beat;
}

/**
 * Parse a whole script.
 *
 * @param {string} source The script file's text.
 * @returns {{ beats: object[], unknown: Map<string, number> }} The beats in order, and how often each unrecognised tag appeared.
 */
export function parseScript(source) {
	const beats = [];
	const unknown = new Map();
	for (const raw of source.split(/\r?\n/)) {
		const line = raw.trim();
		if (line === "") {
			continue;
		}
		const beat = parseBeat(line);
		for (const name of beat.unknown) {
			unknown.set(name, (unknown.get(name) ?? 0) + 1);
		}
		delete beat.unknown;
		beats.push(beat);
	}
	return { beats, unknown };
}
