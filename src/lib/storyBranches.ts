import type { StoryBeat, StorySpan } from "../types/story";

/**
 * The inline styles the scripts put on a choice's label.
 *
 * A prompt beat writes its options as `<c>` or `<t>` runs inside its own text, so they arrive as ordinary spans carrying one of these
 * styles. They are menu entries rather than dialogue, so the player pulls them out instead of reading them with the rest of the line.
 * `<c>` is by far the commoner of the two.
 */
const CHOICE_STYLES = ["c", "t"];

/** How many characters a fallback label keeps before it is cut short. */
const LABEL_LIMIT = 160;

/** A branch region's one alternative: what the choice button reads and which beats taking it plays. */
export interface BranchOption {
	/** The script's own number for the alternative, `1`, `2` and so on. Matches the `branch` op on the beats it plays. */
	label: string;
	/** What the choice button reads, taken from the script's own prompt where it wrote one and from the alternative's first line otherwise. */
	text: string;
}

/** A point where the script offers the reader a choice, and the alternatives it branches into. */
export interface BranchRegion {
	/** Index of the first beat carrying a branch tag, which is where the choice is put to the reader. */
	start: number;
	/** The alternatives, in the order the script numbers them. */
	options: BranchOption[];
}

/** A scene's branch points, and which of them each beat belongs to. */
export interface BranchMap {
	/** Every choice the scene offers, in the order they come up. */
	regions: BranchRegion[];
	/** Per beat, the index into `regions` of the choice it belongs to, or -1 when the beat plays whatever the reader picks. */
	regionOf: number[];
	/** Per beat, the branch number it is tagged with, or null when the beat plays whatever the reader picks. */
	labelOf: (string | null)[];
}

/** The beats to play given the choices made so far, and the next choice still to be answered. */
export interface StoryTimeline {
	/** The beats to play, in order, with every alternative the reader did not take left out. */
	beats: StoryBeat[];
	/** The choice the reader has reached and not yet answered, or null when the scene runs on to its end. */
	pending: BranchRegion | null;
	/** Index of `pending` into the scene's regions, so the answer can be recorded against it. -1 when nothing is pending. */
	pendingIndex: number;
}

/**
 * Whether a span is a choice label rather than dialogue.
 *
 * @param span The span.
 * @returns True when the script marked it as a choice.
 */
export function isChoiceSpan(span: StorySpan): boolean {
	return CHOICE_STYLES.some((style) => span.style?.[style] !== undefined);
}

/**
 * The choice labels a prompt beat carries, in the order the script lists them.
 *
 * @param beat The beat, or null.
 * @returns The labels, empty when the beat is not a prompt.
 */
function promptLabels(beat: StoryBeat | null): string[] {
	if (!beat) {
		return [];
	}
	return beat.pages.flatMap((page) => page.spans.filter(isChoiceSpan).map((span) => span.text.trim())).filter((text) => text !== "");
}

/**
 * The branch number a beat is tagged with.
 *
 * @param beat The beat.
 * @returns The number as the script wrote it, or null when the beat carries no branch tag.
 */
function branchLabel(beat: StoryBeat): string | null {
	let label: string | null = null;
	for (const op of beat.ops) {
		if (op.type === "branch" && op.value) {
			label = op.value;
		}
	}
	return label;
}

/**
 * The first thing an alternative actually says, to stand in as its label where the script wrote no prompt.
 *
 * The opening beats of an alternative are often silent - a background change or a fade - so this looks through the alternative until
 * it finds one with text rather than giving up on the first.
 *
 * @param beats The scene's beats.
 * @param indexes The alternative's beats, in order.
 * @returns The text, or an empty string when the alternative never says anything.
 */
function firstLine(beats: StoryBeat[], indexes: number[]): string {
	for (const index of indexes) {
		for (const page of beats[index]?.pages ?? []) {
			const text = page.spans
				.filter((span) => !isChoiceSpan(span))
				.map((span) => span.text)
				.join("")
				.trim();
			if (text !== "") {
				return text.length > LABEL_LIMIT ? `${text.slice(0, LABEL_LIMIT).trimEnd()}...` : text;
			}
		}
	}
	return "";
}

/**
 * Find a scene's choice points.
 *
 * The scripts mark a branch by tagging each beat with the number of the alternative it belongs to. A prompt beat, the one listing the
 * options, is what opens a choice, and everything tagged after it belongs to that choice however the numbers run - some scripts write
 * the alternatives as blocks, others interleave them. Where a script wrote no prompt, a number that has already been used is the only
 * signal that the next choice has begun. Beats carrying no tag at all play whichever way the reader goes.
 *
 * @param beats The scene's beats.
 * @returns The regions, and the region and branch number of every beat.
 */
export function branchRegions(beats: StoryBeat[]): BranchMap {
	const regions: BranchRegion[] = [];
	const regionOf: number[] = new Array<number>(beats.length).fill(-1);
	const labelOf: (string | null)[] = new Array<string | null>(beats.length).fill(null);
	// Every beat of each alternative in the region being built, so a label can fall back to the first line the alternative speaks.
	let heads: Map<string, number[]> = new Map();
	let seen = new Set<string>();
	let previous: string | null = null;
	// A prompt has been read and the next tagged beat starts the choice it introduces.
	let armed = true;
	// The region being built was opened without a prompt, so a repeated number is all there is to go on.
	let promptless = true;

	const close = () => {
		const region = regions[regions.length - 1];
		if (!region) {
			return;
		}
		const numbered = [...heads.entries()].sort((left, right) => Number(left[0]) - Number(right[0]));
		const prompt = promptLabels(beats[region.start - 1] ?? null);
		region.options = numbered.map(([label, indexes], position) => ({
			label,
			text: (prompt[position] ?? firstLine(beats, indexes)) || `Option ${position + 1}`
		}));
	};

	const open = (index: number, fromPrompt: boolean) => {
		close();
		regions.push({ start: index, options: [] });
		heads = new Map();
		seen = new Set();
		previous = null;
		promptless = !fromPrompt;
		armed = false;
	};

	beats.forEach((beat, index) => {
		if (promptLabels(beat).length > 0) {
			armed = true;
			return;
		}
		const label = branchLabel(beat);
		if (label === null) {
			return;
		}
		if (regions.length === 0 || armed) {
			open(index, armed && index > 0 && promptLabels(beats[index - 1] ?? null).length > 0);
		} else if (promptless && seen.has(label) && label !== previous) {
			open(index, false);
		}
		heads.set(label, [...(heads.get(label) ?? []), index]);
		seen.add(label);
		regionOf[index] = regions.length - 1;
		labelOf[index] = label;
		previous = label;
	});
	close();

	return { regions, regionOf, labelOf };
}

/**
 * The beats to play, given the choices the reader has made.
 *
 * Playback stops at the first choice still unanswered, since everything past it depends on the answer.
 *
 * @param beats The scene's beats.
 * @param map The scene's branch map.
 * @param choices The branch number picked for each region, keyed by its index into `map.regions`.
 * @returns The timeline.
 */
export function buildTimeline(beats: StoryBeat[], map: BranchMap, choices: Record<number, string>): StoryTimeline {
	const played: StoryBeat[] = [];
	for (let index = 0; index < beats.length; index++) {
		const beat = beats[index];
		if (!beat) {
			continue;
		}
		const region = map.regionOf[index] ?? -1;
		if (region === -1) {
			played.push(beat);
			continue;
		}
		const chosen = choices[region];
		if (chosen === undefined) {
			return { beats: played, pending: map.regions[region] ?? null, pendingIndex: region };
		}
		if (map.labelOf[index] === chosen) {
			played.push(beat);
		}
	}
	return { beats: played, pending: null, pendingIndex: -1 };
}
