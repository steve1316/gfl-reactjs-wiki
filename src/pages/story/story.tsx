import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { Box, Button, Chip, CircularProgress, Container, Drawer, Slider, Stack, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { storyAudioUrl, storyBackgroundUrl, storySpriteUrl } from "../../lib/assets";
import { loadStoryChapter, loadStoryScene } from "../../lib/data";
import { hasStoryAudio, hasStoryBackground, hasStorySprite, storySpriteStem } from "../../lib/processData";
import { branchRegions, buildTimeline, isChoiceSpan } from "../../lib/storyBranches";
import type { StoryBeat, StoryChapter, StoryPage, StoryScene } from "../../types/story";

/** How long one character takes to type at the middle speed, in milliseconds. */
const TYPE_MS = 28;

/** How long autoplay waits on a finished page before advancing, in milliseconds. */
const AUTO_HOLD_MS = 1400;

/** Where the reader's place in each scene is remembered. */
const PROGRESS_KEY = "storyProgress";

/** Where the reader's choice to silence the story is remembered. */
const MUTED_KEY = "storyMuted";

/** How loud the music sits under the dialogue, and how loud a sound effect fires over it. */
const MUSIC_VOLUME = 0.35;
const EFFECT_VOLUME = 0.6;

const styles = {
	stage: { position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 2, overflow: "hidden", bgcolor: "#05070c", cursor: "pointer", userSelect: "none" },
	sprites: { position: "absolute", inset: 0, display: "flex", alignItems: "stretch", justifyContent: "space-between", px: { xs: 1, sm: 4 } },
	// Lifted just clear of the dialogue box, so a character stands on the scene's ground rather than behind the text.
	spriteSide: { height: "100%", alignItems: "flex-end", pb: "15%" },
	spriteArt: { height: "88%", width: "auto", maxWidth: { xs: 160, sm: 320 }, objectFit: "contain", objectPosition: "bottom", display: "block" },
	box: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		minHeight: "34%",
		p: { xs: 1.5, sm: 2.5 },
		bgcolor: "rgba(6, 10, 18, 0.82)",
		borderTop: "2px solid",
		borderColor: "secondary.main",
		backdropFilter: "blur(2px)"
	},
	// The choice menu takes the dialogue box's place, so the stage behind it stays visible while the reader decides.
	choices: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		p: { xs: 1.5, sm: 2.5 },
		display: "flex",
		flexDirection: "column",
		gap: 1,
		bgcolor: "rgba(6, 10, 18, 0.88)",
		borderTop: "2px solid",
		borderColor: "secondary.main",
		backdropFilter: "blur(2px)"
	},
	choiceButton: { justifyContent: "flex-start", textAlign: "left", textTransform: "none", lineHeight: 1.5 },
	speaker: { fontWeight: 800, color: "secondary.main", mb: 0.5 },
	text: { whiteSpace: "pre-wrap", lineHeight: 1.7 },
	caret: { display: "inline-block", width: "0.5em", textAlign: "center", opacity: 0.7 },
	backlogLine: { py: 0.75, borderBottom: "1px solid", borderColor: "divider" }
} satisfies Record<string, SxProps<Theme>>;

/** Where a reader had got to in one scene, as it is kept in storage. */
interface SceneProgress {
	/** How far into the played timeline they had read. */
	beat: number;
	/** The branch number taken at each choice, keyed by that choice's index into the scene's regions. */
	choices: Record<number, string>;
}

/** What the stage shows at a point in the scene, folded from every beat up to it. */
interface Stage {
	/** The background the scene is currently on, or null before any is set. */
	background: string | null;
	/** The music cue currently playing, or null before any is set. */
	bgm: string | null;
}

/**
 * A placeholder backdrop derived from the scene's background code.
 *
 * A beat's own background op is a scene-local index the game resolves in code it does not ship, so mid-scene changes cannot be
 * mapped to a picture. Deriving a hue from the code at least makes each backdrop distinct and stable, the way `ArtPlaceholder`
 * stands in for card art that is not hosted.
 *
 * @param background The background code, or null.
 * @returns A CSS gradient.
 */
function backdrop(background: string | null): string {
	if (background === null) {
		return "linear-gradient(160deg, #10141f, #05070c)";
	}
	let hash = 0;
	for (const character of background) {
		hash = (hash * 31 + character.charCodeAt(0)) % 360;
	}
	return `linear-gradient(160deg, hsl(${hash}, 28%, 22%), hsl(${(hash + 40) % 360}, 30%, 9%))`;
}

/**
 * Flatten a page's styled runs into plain text, for the backlog and for measuring how much has been typed.
 *
 * A choice label is left out. The script writes the options inside the prompt beat's own text, and the choice menu shows them, so
 * reading them out here as well would run all the options together into one line.
 *
 * @param page The page.
 * @returns Its text.
 */
function pageText(page: StoryPage): string {
	return page.spans
		.filter((span) => !isChoiceSpan(span))
		.map((span) => span.text)
		.join("");
}

/**
 * The stage as it stands at a beat, folded from the ops of every beat up to and including it.
 *
 * Background and music persist until something changes them, so they cannot be read off the current beat alone.
 *
 * @param beats The scene's beats.
 * @param upTo Index of the current beat.
 * @returns The stage.
 */
function stageAt(beats: StoryBeat[], upTo: number): Stage {
	const stage: Stage = { background: null, bgm: null };
	for (let index = 0; index <= upTo && index < beats.length; index++) {
		for (const op of beats[index]?.ops ?? []) {
			if (op.type === "background" && op.value) {
				stage.background = op.value;
			} else if (op.type === "bgm" && op.value) {
				stage.bgm = op.value;
			}
		}
	}
	return stage;
}

/**
 * Read where the reader had got to in a scene.
 *
 * Entries written before the player understood branches are a bare number. They restore as a beat index with no choices, which
 * the timeline then clamps back to the scene's first unanswered choice.
 *
 * @param scene The script name.
 * @returns The saved place, or the start of the scene when there is nothing saved or storage is unavailable.
 */
function readProgress(scene: string): SceneProgress {
	try {
		const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, number | SceneProgress>;
		const entry = saved[scene];
		if (typeof entry === "number") {
			return { beat: entry, choices: {} };
		}
		return { beat: entry?.beat ?? 0, choices: entry?.choices ?? {} };
	} catch {
		return { beat: 0, choices: {} };
	}
}

/**
 * Remember where the reader has got to in a scene, and which way they went at each choice.
 *
 * @param scene The script name.
 * @param progress The place to save.
 */
function writeProgress(scene: string, progress: SceneProgress) {
	try {
		const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, SceneProgress>;
		saved[scene] = progress;
		window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
	} catch {
		// A private window or blocked storage just means the place is not remembered, which is not worth failing the page over.
	}
}

/**
 * The story player: one scene, advanced a page at a time.
 *
 * Where a script branches, the reader picks which way to go and only the beats of that alternative are played.
 *
 * @returns The page.
 */
export default function Story() {
	const { chapter: chapterParam, scene: sceneParam } = useParams();
	const chapterId = Number(chapterParam);
	const sceneName = sceneParam ?? "";

	const [scene, setScene] = useState<StoryScene | null>(null);
	const [chapter, setChapter] = useState<StoryChapter | null>(null);
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const [beatIndex, setBeatIndex] = useState(0);
	const [pageIndex, setPageIndex] = useState(0);
	// The branch number taken at each of the scene's choices, keyed by that choice's index into the branch map.
	const [choices, setChoices] = useState<Record<number, string>>({});
	const [typed, setTyped] = useState(0);
	const [auto, setAuto] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [backlogOpen, setBacklogOpen] = useState(false);
	// Held in a ref as well so the keyboard handler can advance without being rebuilt on every character typed.
	const advanceRef = useRef<() => void>(() => {});
	// The looping music. One element reused across cues, so changing track does not leave the old one playing.
	const musicRef = useRef<HTMLAudioElement | null>(null);
	const [muted, setMuted] = useState(() => {
		try {
			return window.localStorage.getItem(MUTED_KEY) === "1";
		} catch {
			return false;
		}
	});

	const branches = useMemo(() => (scene ? branchRegions(scene.beats) : null), [scene]);
	// Only the beats the reader's choices actually reach. It stops at the first choice still unanswered, since what follows depends on it.
	const timeline = useMemo(() => (scene && branches ? buildTimeline(scene.beats, branches, choices) : { beats: [], pending: null, pendingIndex: -1 }), [scene, branches, choices]);
	const beats = timeline.beats;
	const beat = beats[beatIndex] ?? null;
	const page = beat?.pages[pageIndex] ?? null;
	const full = page ? pageText(page) : "";
	const done = typed >= full.length;
	// The reader has read everything the timeline holds and a choice is waiting, so the menu takes the dialogue box's place.
	const choosing = timeline.pending !== null && beatIndex >= beats.length - 1 && pageIndex >= Math.max(0, (beat?.pages.length ?? 1) - 1) && done;
	const stage = useMemo(() => stageAt(beats, beatIndex), [beats, beatIndex]);
	const mission = useMemo(() => chapter?.missions.find((entry) => entry.scripts.includes(sceneName)) ?? null, [chapter, sceneName]);
	// The mission names its own scene art. A beat's own `background` op is a scene-local index the game resolves in code the data does
	// not ship, so it cannot be mapped to a picture - it still drives the fallback wash, which at least changes when the scene does.
	const scenery = useMemo(() => (mission?.background && hasStoryBackground(mission.background) ? storyBackgroundUrl(mission.background) : null), [mission]);
	const backlog = useMemo(() => beats.slice(0, beatIndex + 1).flatMap((entry) => entry.pages.map((entryPage) => ({ speaker: entry.speaker, text: pageText(entryPage) }))), [beats, beatIndex]);

	useEffect(() => {
		document.title = mission ? `${mission.title} - Story` : "Story";
	}, [mission]);

	useEffect(() => {
		let active = true;
		setFailed(false);
		setScene(null);
		Promise.all([loadStoryScene(sceneName), loadStoryChapter(chapterId)]).then(
			([loadedScene, loadedChapter]) => {
				if (!active) {
					return;
				}
				setScene(loadedScene);
				setChapter(loadedChapter);
				const saved = readProgress(sceneName);
				setChoices(saved.choices);
				setBeatIndex(Math.max(0, saved.beat));
				setPageIndex(0);
				setTyped(0);
			},
			() => active && setFailed(true)
		);
		return () => {
			active = false;
		};
	}, [sceneName, chapterId, attempt]);

	// Type the current page out one character at a time. Restarts whenever the page changes.
	useEffect(() => {
		setTyped(0);
		if (full === "") {
			return;
		}
		const interval = window.setInterval(() => {
			setTyped((count) => {
				if (count >= full.length) {
					window.clearInterval(interval);
					return count;
				}
				return count + 1;
			});
		}, TYPE_MS / speed);
		return () => window.clearInterval(interval);
	}, [full, speed]);

	useEffect(() => {
		if (beats.length > 0 && beatIndex > beats.length - 1) {
			setBeatIndex(beats.length - 1);
			setPageIndex(0);
		}
	}, [beats, beatIndex]);

	useEffect(() => {
		if (scene && beatIndex > 0) {
			writeProgress(sceneName, { beat: beatIndex, choices });
		}
	}, [scene, sceneName, beatIndex, choices]);

	// The music follows the scene's current cue. A cue the game no longer ships simply leaves the stage quiet.
	useEffect(() => {
		const element = musicRef.current;
		if (!element) {
			return;
		}
		const cue = stage.bgm;
		const wanted = cue && hasStoryAudio(cue) ? storyAudioUrl(cue) : null;
		if (wanted === null) {
			element.pause();
			element.removeAttribute("src");
			return;
		}
		if (!element.src.endsWith(wanted.slice(wanted.lastIndexOf("/") + 1))) {
			element.src = wanted;
		}
		element.volume = MUSIC_VOLUME;
		if (!muted) {
			// A browser may refuse to start audio before the reader has interacted, and advancing the scene is that interaction.
			void element.play().catch(() => {});
		}
	}, [stage.bgm, muted]);

	// Sound effects fire once as their beat is reached, over whatever music is playing.
	useEffect(() => {
		if (muted || !beat) {
			return;
		}
		for (const op of beat.ops) {
			if (op.type !== "sfx" || !op.value || !hasStoryAudio(op.value)) {
				continue;
			}
			const effect = new Audio(storyAudioUrl(op.value));
			effect.volume = EFFECT_VOLUME;
			void effect.play().catch(() => {});
		}
	}, [beat, muted]);

	useEffect(() => {
		try {
			window.localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
		} catch {
			// Storage being unavailable only costs the reader their preference, which is not worth failing the page over.
		}
		if (muted) {
			musicRef.current?.pause();
		}
	}, [muted]);

	const advance = useCallback(() => {
		if (!beat) {
			return;
		}
		// A part-typed page finishes first, so a click never skips text the reader has not seen.
		if (!done && full !== "") {
			setTyped(full.length);
			return;
		}
		if (pageIndex + 1 < beat.pages.length) {
			setPageIndex((current) => current + 1);
			return;
		}
		if (beatIndex + 1 < beats.length) {
			setBeatIndex((current) => current + 1);
			setPageIndex(0);
		}
	}, [beats, beat, done, full, pageIndex, beatIndex]);
	advanceRef.current = advance;

	const back = useCallback(() => {
		if (pageIndex > 0) {
			setPageIndex((current) => current - 1);
			return;
		}
		setBeatIndex((current) => {
			const next = Math.max(0, current - 1);
			setPageIndex(Math.max(0, (beats[next]?.pages.length ?? 1) - 1));
			return next;
		});
	}, [pageIndex, beats]);

	const restart = useCallback(() => {
		setBeatIndex(0);
		setPageIndex(0);
		setTyped(0);
		setChoices({});
	}, []);
	const toEnd = useCallback(() => {
		if (beats.length > 0) {
			setBeatIndex(beats.length - 1);
			setPageIndex(Math.max(0, (beats[beats.length - 1]?.pages.length ?? 1) - 1));
		}
	}, [beats]);
	const choose = useCallback(
		(region: number, label: string) => {
			setChoices((current) => ({ ...current, [region]: label }));
			// The chosen alternative is appended to the timeline, so the next beat is the one that was just unlocked.
			setBeatIndex(beats.length);
			setPageIndex(0);
			setTyped(0);
		},
		[beats]
	);
	const retry = useCallback(() => setAttempt((count) => count + 1), []);
	const toggleAuto = useCallback(() => setAuto((current) => !current), []);
	const toggleMuted = useCallback(() => setMuted((current) => !current), []);
	// The stage advances on a click, so a click landing on a choice button must not also count as advancing the scene.
	const stopBubbling = useCallback((event: MouseEvent) => event.stopPropagation(), []);
	const openBacklog = useCallback(() => setBacklogOpen(true), []);
	const closeBacklog = useCallback(() => setBacklogOpen(false), []);
	const changeSpeed = useCallback((_event: Event, value: number | number[]) => setSpeed(Array.isArray(value) ? (value[0] ?? 1) : value), []);

	// Autoplay waits for the page to finish typing, then holds before moving on.
	useEffect(() => {
		if (!auto || !done || choosing) {
			return;
		}
		const timer = window.setTimeout(() => advanceRef.current(), AUTO_HOLD_MS / speed);
		return () => window.clearTimeout(timer);
	}, [auto, done, choosing, speed, beatIndex, pageIndex]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") {
				event.preventDefault();
				advanceRef.current();
			} else if (event.key === "ArrowLeft") {
				event.preventDefault();
				back();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [back]);

	const atEnd = timeline.pending === null && beats.length > 0 && beatIndex >= beats.length - 1 && (beat === null || pageIndex >= beat.pages.length - 1);

	return (
		<Box component="main" sx={{ py: 3 }}>
			<ScrollToTop />
			<Container maxWidth="lg">
				<Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", alignItems: "center" }}>
					<Typography component="h1" variant="h6" sx={{ flex: 1, minWidth: 0 }} noWrap>
						{mission?.title ?? sceneName}
					</Typography>
					<Chip size="small" label={sceneName} />
					<Button size="small" component={RouterLink} to="/story">
						All chapters
					</Button>
				</Stack>

				{failed ? (
					<LoadError what="this scene" onRetry={retry} titleComponent="h2" />
				) : !scene ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
						<CircularProgress aria-label="Loading the scene" />
					</Box>
				) : (
					<>
						<Box
							sx={[styles.stage, scenery ? { backgroundImage: `url(${scenery})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: backdrop(stage.background) }]}
							onClick={advance}
							role="button"
							tabIndex={-1}
							aria-label="Advance the scene"
						>
							<Box sx={styles.sprites}>
								{["left", "right"].map((side) => (
									<Stack key={side} direction="row" spacing={1} sx={styles.spriteSide}>
										{(beat?.sprites ?? [])
											.filter((sprite) => sprite.side === side)
											.flatMap((sprite, position) => {
												// A slot with no art is not a character with a missing picture. Scripts use the same slot to carry an
												// off-screen speaker's label, such as a description of a voice, so the stage shows nobody and the
												// dialogue box still names who is talking.
												const stem = storySpriteStem(sprite.prefab);
												if (stem === null) {
													return [];
												}
												return [
													<Box
														key={`${sprite.prefab}-${position}`}
														component="img"
														// The expression the script asked for, or the plain pose when the game ships no art for it.
														src={storySpriteUrl(stem, hasStorySprite(sprite.prefab, sprite.expression) ? sprite.expression : 0)}
														alt={sprite.prefab}
														sx={styles.spriteArt}
													/>
												];
											})}
									</Stack>
								))}
							</Box>

							{choosing && timeline.pending ? (
								<Box sx={styles.choices} onClick={stopBubbling}>
									<Typography variant="caption" color="text.secondary">
										Choose
									</Typography>
									{timeline.pending.options.map((option) => (
										<Button
											key={option.label}
											size="small"
											variant="outlined"
											color="secondary"
											sx={styles.choiceButton}
											onClick={() => choose(timeline.pendingIndex, option.label)}
										>
											{option.text}
										</Button>
									))}
								</Box>
							) : (
								<Box sx={styles.box}>
									{beat?.speaker && (
										<Typography variant="subtitle2" sx={styles.speaker}>
											{beat.speaker}
										</Typography>
									)}
									<Typography variant="body1" sx={styles.text}>
										{renderTyped(page, typed)}
										{!done && (
											<Box component="span" sx={styles.caret}>
												|
											</Box>
										)}
									</Typography>
									{full === "" && (
										<Typography variant="body2" color="text.secondary">
											{beat && beat.ops.length > 0 ? beat.ops.map((op) => op.type).join(", ") : "..."}
										</Typography>
									)}
								</Box>
							)}
						</Box>

						<Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 1, alignItems: "center" }}>
							<Button size="small" onClick={back} disabled={beatIndex === 0 && pageIndex === 0}>
								Back
							</Button>
							<Button size="small" variant={auto ? "contained" : "outlined"} onClick={toggleAuto}>
								{auto ? "Auto on" : "Auto"}
							</Button>
							<Button size="small" onClick={toggleMuted}>
								{muted ? "Sound off" : "Sound on"}
							</Button>
							<Button size="small" onClick={openBacklog}>
								Backlog
							</Button>
							<Button size="small" onClick={restart}>
								Restart
							</Button>
							<Tooltip title={timeline.pending ? "The scene branches ahead, so it cannot be skipped past the choice" : ""}>
								<span>
									<Button size="small" onClick={toEnd} disabled={atEnd || choosing}>
										Skip to end
									</Button>
								</span>
							</Tooltip>
							<Box sx={{ width: 150, display: "flex", alignItems: "center", gap: 1 }}>
								<Typography variant="caption" color="text.secondary">
									Speed
								</Typography>
								<Slider size="small" min={0.5} max={3} step={0.5} value={speed} onChange={changeSpeed} aria-label="Text speed" valueLabelDisplay="auto" />
							</Box>
							<Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
								Beat {beatIndex + 1} of {beats.length}
								{stage.bgm ? ` - ${stage.bgm}` : ""}
							</Typography>
						</Stack>

						{mission && mission.scripts.length > 1 && (
							<Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}>
								{mission.scripts.map((script) => (
									<Tooltip key={script} title={script}>
										<Chip
											size="small"
											label={script}
											color={script === sceneName ? "secondary" : "default"}
											component={RouterLink}
											to={`/story/${chapterId}/${encodeURIComponent(script)}`}
											clickable
										/>
									</Tooltip>
								))}
							</Stack>
						)}
					</>
				)}
			</Container>

			{/* One long-lived element for the music. It sits outside the stage so redrawing a beat never restarts the track. */}
			<Box component="audio" ref={musicRef} loop preload="none" aria-hidden sx={{ display: "none" }} />

			<Drawer anchor="right" open={backlogOpen} onClose={closeBacklog}>
				<Box sx={{ width: { xs: 300, sm: 420 }, p: 2 }} role="presentation">
					<Typography variant="h6" gutterBottom>
						Backlog
					</Typography>
					{backlog.map((entry, position) => (
						<Box key={position} sx={styles.backlogLine}>
							{entry.speaker && (
								<Typography variant="caption" sx={{ fontWeight: 700, color: "secondary.main", display: "block" }}>
									{entry.speaker}
								</Typography>
							)}
							<Typography variant="body2">{entry.text}</Typography>
						</Box>
					))}
				</Box>
			</Drawer>
		</Box>
	);
}

/**
 * Render a page up to the number of characters typed so far, keeping each run's styling.
 *
 * @param page The page, or null when the beat has no text.
 * @param typed How many characters to show.
 * @returns The styled runs, truncated.
 */
function renderTyped(page: StoryPage | null, typed: number) {
	if (!page) {
		return null;
	}
	let remaining = typed;
	return page.spans
		.filter((span) => !isChoiceSpan(span))
		.map((span, position) => {
			if (remaining <= 0) {
				return null;
			}
			const shown = span.text.slice(0, remaining);
			remaining -= span.text.length;
			const style = span.style ?? {};
			return (
				<Box
					key={position}
					component="span"
					sx={{
						color: style.color ? style.color : undefined,
						fontSize: style.size ? `${Number(style.size) / 26}rem` : undefined,
						fontWeight: style.b !== undefined ? 700 : undefined,
						fontStyle: style.i !== undefined ? "italic" : undefined
					}}
				>
					{shown}
				</Box>
			);
		});
}
