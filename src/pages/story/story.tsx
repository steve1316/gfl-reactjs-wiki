import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { Box, Button, Chip, CircularProgress, Container, Drawer, Slider, Stack, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { storyBackgroundUrl, storySpriteUrl } from "../../lib/assets";
import { loadStoryChapter, loadStoryScene } from "../../lib/data";
import { hasStoryBackground, hasStorySprite } from "../../lib/processData";
import type { StoryBeat, StoryChapter, StoryPage, StoryScene } from "../../types/story";

/** How long one character takes to type at the middle speed, in milliseconds. */
const TYPE_MS = 28;

/** How long autoplay waits on a finished page before advancing, in milliseconds. */
const AUTO_HOLD_MS = 1400;

/** Where the reader's place in each scene is remembered. */
const PROGRESS_KEY = "storyProgress";

const styles = {
	stage: { position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 2, overflow: "hidden", bgcolor: "#05070c", cursor: "pointer", userSelect: "none" },
	sprites: { position: "absolute", inset: 0, display: "flex", alignItems: "stretch", justifyContent: "space-between", px: { xs: 1, sm: 4 } },
	// Lifted just clear of the dialogue box, so a character stands on the scene's ground rather than behind the text.
	spriteSide: { height: "100%", alignItems: "flex-end", pb: "15%" },
	// Stands in for art the game does not ship, the way `ArtPlaceholder` does for a card that is not hosted.
	spriteGhost: {
		width: { xs: 56, sm: 96 },
		height: "58%",
		borderRadius: "10px 10px 0 0",
		bgcolor: "rgba(255,255,255,0.045)",
		border: "1px solid",
		borderColor: "rgba(255,255,255,0.14)",
		display: "flex",
		alignItems: "flex-end",
		justifyContent: "center",
		pb: 1
	},
	spriteName: { color: "text.secondary", writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.08em" },
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
	speaker: { fontWeight: 800, color: "secondary.main", mb: 0.5 },
	text: { whiteSpace: "pre-wrap", lineHeight: 1.7 },
	caret: { display: "inline-block", width: "0.5em", textAlign: "center", opacity: 0.7 },
	backlogLine: { py: 0.75, borderBottom: "1px solid", borderColor: "divider" }
} satisfies Record<string, SxProps<Theme>>;

/** What the stage shows at a point in the scene, folded from every beat up to it. */
interface Stage {
	/** The background the scene is currently on, or null before any is set. */
	background: string | null;
	/** The music cue currently playing, or null before any is set. Nothing plays it yet - audio is a later phase. */
	bgm: string | null;
}

/**
 * A placeholder backdrop derived from the scene's background code.
 *
 * The story backgrounds are not published to the asset repo yet, so a scene change would otherwise be invisible. Deriving a hue from
 * the code at least makes each backdrop distinct and stable, the way `ArtPlaceholder` stands in for card art that is not hosted.
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
 * @param page The page.
 * @returns Its text.
 */
function pageText(page: StoryPage): string {
	return page.spans.map((span) => span.text).join("");
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
 * @param scene The script name.
 * @returns The beat index, or 0 when there is nothing saved or storage is unavailable.
 */
function readProgress(scene: string): number {
	try {
		const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, number>;
		return saved[scene] ?? 0;
	} catch {
		return 0;
	}
}

/**
 * Remember where the reader has got to in a scene.
 *
 * @param scene The script name.
 * @param beat The beat index.
 */
function writeProgress(scene: string, beat: number) {
	try {
		const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, number>;
		saved[scene] = beat;
		window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
	} catch {
		// A private window or blocked storage just means the place is not remembered, which is not worth failing the page over.
	}
}

/**
 * The story player: one scene, advanced a page at a time.
 *
 * Sprites and backgrounds are placeholders for now. The art is a separate, large piece of work, so the player ships readable first
 * and the art drops in behind the same two helpers later.
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
	const [typed, setTyped] = useState(0);
	const [auto, setAuto] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [backlogOpen, setBacklogOpen] = useState(false);
	// Held in a ref as well so the keyboard handler can advance without being rebuilt on every character typed.
	const advanceRef = useRef<() => void>(() => {});

	const beat = scene?.beats[beatIndex] ?? null;
	const page = beat?.pages[pageIndex] ?? null;
	const full = page ? pageText(page) : "";
	const done = typed >= full.length;
	const stage = useMemo(() => (scene ? stageAt(scene.beats, beatIndex) : { background: null, bgm: null }), [scene, beatIndex]);
	const mission = useMemo(() => chapter?.missions.find((entry) => entry.scripts.includes(sceneName)) ?? null, [chapter, sceneName]);
	// The mission names its own scene art. A beat's own `background` op is a scene-local index the game resolves in code the data does
	// not ship, so it cannot be mapped to a picture - it still drives the fallback wash, which at least changes when the scene does.
	const scenery = useMemo(() => (mission?.background && hasStoryBackground(mission.background) ? storyBackgroundUrl(mission.background) : null), [mission]);
	const backlog = useMemo(() => {
		if (!scene) {
			return [];
		}
		return scene.beats.slice(0, beatIndex + 1).flatMap((entry) => entry.pages.map((entryPage) => ({ speaker: entry.speaker, text: pageText(entryPage) })));
	}, [scene, beatIndex]);

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
				setBeatIndex(saved < loadedScene.beats.length ? saved : 0);
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
		if (scene && beatIndex > 0) {
			writeProgress(sceneName, beatIndex);
		}
	}, [scene, sceneName, beatIndex]);

	const advance = useCallback(() => {
		if (!scene || !beat) {
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
		if (beatIndex + 1 < scene.beats.length) {
			setBeatIndex((current) => current + 1);
			setPageIndex(0);
		}
	}, [scene, beat, done, full, pageIndex, beatIndex]);
	advanceRef.current = advance;

	const back = useCallback(() => {
		if (pageIndex > 0) {
			setPageIndex((current) => current - 1);
			return;
		}
		setBeatIndex((current) => {
			const next = Math.max(0, current - 1);
			setPageIndex(Math.max(0, (scene?.beats[next]?.pages.length ?? 1) - 1));
			return next;
		});
	}, [pageIndex, scene]);

	const restart = useCallback(() => {
		setBeatIndex(0);
		setPageIndex(0);
		setTyped(0);
	}, []);
	const toEnd = useCallback(() => {
		if (scene) {
			setBeatIndex(scene.beats.length - 1);
			setPageIndex(Math.max(0, (scene.beats[scene.beats.length - 1]?.pages.length ?? 1) - 1));
		}
	}, [scene]);
	const retry = useCallback(() => setAttempt((count) => count + 1), []);
	const toggleAuto = useCallback(() => setAuto((current) => !current), []);
	const openBacklog = useCallback(() => setBacklogOpen(true), []);
	const closeBacklog = useCallback(() => setBacklogOpen(false), []);
	const changeSpeed = useCallback((_event: Event, value: number | number[]) => setSpeed(Array.isArray(value) ? (value[0] ?? 1) : value), []);

	// Autoplay waits for the page to finish typing, then holds before moving on.
	useEffect(() => {
		if (!auto || !done) {
			return;
		}
		const timer = window.setTimeout(() => advanceRef.current(), AUTO_HOLD_MS / speed);
		return () => window.clearTimeout(timer);
	}, [auto, done, speed, beatIndex, pageIndex]);

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

	const atEnd = scene !== null && beatIndex >= scene.beats.length - 1 && (beat === null || pageIndex >= beat.pages.length - 1);

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
											.map((sprite, position) =>
												hasStorySprite(sprite.prefab) ? (
													<Box
														key={`${sprite.prefab}-${position}`}
														component="img"
														// The expression the script asked for, or the plain pose when the game ships no art for it.
														src={storySpriteUrl(sprite.prefab, hasStorySprite(sprite.prefab, sprite.expression) ? sprite.expression : 0)}
														alt={sprite.prefab}
														sx={styles.spriteArt}
													/>
												) : (
													<Box key={`${sprite.prefab}-${position}`} sx={styles.spriteGhost}>
														<Typography variant="caption" sx={styles.spriteName} noWrap>
															{sprite.prefab}
														</Typography>
													</Box>
												)
											)}
									</Stack>
								))}
							</Box>

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
						</Box>

						<Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 1, alignItems: "center" }}>
							<Button size="small" onClick={back} disabled={beatIndex === 0 && pageIndex === 0}>
								Back
							</Button>
							<Button size="small" variant={auto ? "contained" : "outlined"} onClick={toggleAuto}>
								{auto ? "Auto on" : "Auto"}
							</Button>
							<Button size="small" onClick={openBacklog}>
								Backlog
							</Button>
							<Button size="small" onClick={restart}>
								Restart
							</Button>
							<Button size="small" onClick={toEnd} disabled={atEnd}>
								Skip to end
							</Button>
							<Box sx={{ width: 150, display: "flex", alignItems: "center", gap: 1 }}>
								<Typography variant="caption" color="text.secondary">
									Speed
								</Typography>
								<Slider size="small" min={0.5} max={3} step={0.5} value={speed} onChange={changeSpeed} aria-label="Text speed" valueLabelDisplay="auto" />
							</Box>
							<Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
								Beat {beatIndex + 1} of {scene.beats.length}
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
	return page.spans.map((span, position) => {
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
