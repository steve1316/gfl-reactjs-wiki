import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box, IconButton, LinearProgress, Skeleton, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import DollCard from "./DollCard";
import { loadDoll } from "../lib/data";
import type { TDoll } from "../types/tdoll";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How long each doll is shown before the carousel moves on, in ms. */
const ADVANCE_MS = 6000;

/** How often the countdown bar redraws. Fine enough to look continuous, coarse enough to stay cheap. */
const TICK_MS = 50;

/** Horizontal travel, in pixels, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 40;

/** Width of the card in CSS pixels, per breakpoint. */
const CARD_WIDTH = { narrow: 200, wide: 240 };

/** Room under the 1:2 art for the name, the badges and the id. Measured at 83px, rounded up so nothing clips. */
const CARD_TEXT_HEIGHT = 84;

/** Props for DollCarousel. */
interface DollCarouselProps {
	/** The pool of doll ids to draw from. */
	ids: number[];
	/** Asks for a fresh pool. Called once every doll in the current one has been shown. */
	onShuffle?: () => void;
}

/**
 * Map a doll onto the card's props.
 *
 * @param doll The doll to show, or undefined while the shard is still loading.
 * @returns Props for `DollCard`.
 */
function cardProps(doll: TDoll | undefined) {
	const form = doll?.normal;
	return {
		id: form?.id ?? 0,
		name: form?.name ?? "",
		type: form?.type ?? "",
		rarity: form?.rarity ?? 1,
		isMod: false,
		image: form?.assets.images.card ?? "",
		to: `/tdoll/${form?.id ?? ""}`
	};
}

/**
 * Whether a keyboard event's target is a place the user types, so global shortcuts should back off.
 *
 * @param target The event target to check.
 * @returns True when the target is a text input, textarea, select, or any contenteditable element.
 */
function isTypingTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) {
		return false;
	}
	if (target.isContentEditable) {
		return true;
	}
	const tag = target.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * One doll at a time, replaced at random on a timer.
 *
 * The bar under the card is the point of it: a doll that swaps itself out with no warning reads as a
 * glitch, so the countdown says one is coming and roughly when. Dolls are drawn without repeats until
 * the pool is used up, which is when a fresh pool is requested.
 *
 * @param props Component props.
 * @returns The carousel.
 */
export default function DollCarousel({ ids, onShuffle }: DollCarouselProps) {
	const isNarrow = useMediaQuery("(max-width:599.95px)");
	const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

	const [dolls, setDolls] = useState<(TDoll | undefined)[]>([]);
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const touchStart = useRef<{ x: number; y: number } | null>(null);

	// Which of the pool have already been shown, and the order they were shown in. The first gives random
	// cycling without immediate repeats; the second is what makes the back arrow a real back.
	const [seen, setSeen] = useState<number[]>([0]);
	const [history, setHistory] = useState<number[]>([]);

	useEffect(() => {
		let active = true;
		setIndex(0);
		setSeen([0]);
		setHistory([]);
		setElapsed(0);
		setDolls([]);
		void Promise.all(ids.map((id) => loadDoll(id))).then((loaded) => {
			if (active) {
				setDolls(loaded);
			}
		});
		return () => {
			active = false;
		};
	}, [ids]);

	// Only dolls that actually exist. MICA Team skips ids, so a random pick can land on a gap.
	const entries = useMemo(() => dolls.filter((doll): doll is TDoll => doll !== undefined), [dolls]);

	/** Move to a random doll that has not been shown yet, asking for a new pool once none are left. */
	const advance = useCallback(() => {
		setElapsed(0);
		if (entries.length < 2) {
			return;
		}
		const remaining = entries.map((_entry, position) => position).filter((position) => !seen.includes(position));
		if (remaining.length === 0) {
			// Every doll in the pool has had its turn. A new pool is more interesting than a second lap.
			if (onShuffle) {
				onShuffle();
				return;
			}
			setSeen([index]);
			return;
		}
		const next = remaining[Math.floor(Math.random() * remaining.length)] ?? 0;
		setHistory((current) => [...current, index]);
		setSeen((current) => [...current, next]);
		setIndex(next);
	}, [entries, seen, index, onShuffle]);

	/** Step back to the doll shown before this one. Does nothing at the start of the run. */
	const back = useCallback(() => {
		setElapsed(0);
		setHistory((current) => {
			const previous = current[current.length - 1];
			if (previous === undefined) {
				return current;
			}
			setIndex(previous);
			return current.slice(0, -1);
		});
	}, []);

	// One timer drives both the countdown and the advance, so the bar can never disagree with the swap.
	useEffect(() => {
		if (paused || reduceMotion || entries.length < 2) {
			return;
		}
		const timer = setInterval(() => {
			setElapsed((current) => {
				if (current + TICK_MS >= ADVANCE_MS) {
					advance();
					return 0;
				}
				return current + TICK_MS;
			});
		}, TICK_MS);
		return () => clearInterval(timer);
	}, [paused, reduceMotion, entries.length, advance]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (isTypingTarget(event.target)) {
				return;
			}
			if (event.key === "ArrowLeft") {
				back();
			}
			if (event.key === "ArrowRight") {
				advance();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [advance, back]);

	const width = isNarrow ? CARD_WIDTH.narrow : CARD_WIDTH.wide;
	const height = width * 2 + CARD_TEXT_HEIGHT;

	if (entries.length === 0) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
				<Skeleton variant="rounded" width={width} height={height} />
			</Box>
		);
	}

	const current = entries[index] ?? entries[0];
	if (!current) {
		return <Box sx={{ height }} />;
	}

	return (
		<Box
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
			onTouchStart={(event) => {
				setPaused(true);
				const touch = event.touches[0];
				touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
			}}
			onTouchEnd={(event) => {
				const start = touchStart.current;
				const end = event.changedTouches[0] ?? null;
				if (start !== null && end !== null) {
					const dx = end.clientX - start.x;
					const dy = end.clientY - start.y;
					// Without the vertical check a page scroll that drifts sideways also turns the carousel.
					if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
						if (dx < 0) {
							advance();
						} else {
							back();
						}
					}
				}
				touchStart.current = null;
				setPaused(false);
			}}
			onTouchCancel={() => {
				touchStart.current = null;
				setPaused(false);
			}}
			sx={{ py: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
				<IconButton onClick={back} aria-label="previous" size="large" disabled={history.length === 0}>
					<ChevronLeftIcon />
				</IconButton>

				{/* Keyed by doll id so a swap remounts the card, which is what replays the entry animation. */}
				<Box
					key={current.normal.id}
					sx={{
						width,
						flexShrink: 0,
						animation: reduceMotion ? "none" : "dollCarouselIn 360ms cubic-bezier(0.22, 0.61, 0.36, 1)",
						"@keyframes dollCarouselIn": {
							from: { opacity: 0, transform: "translateX(24px) scale(0.97)" },
							to: { opacity: 1, transform: "none" }
						}
					}}
				>
					<DollCard {...cardProps(current)} />
				</Box>

				<IconButton onClick={advance} aria-label="next" size="large">
					<ChevronRightIcon />
				</IconButton>
			</Box>

			{/* The countdown to the next doll. Hidden when nothing is counting down, rather than sitting at zero. */}
			{!reduceMotion && entries.length > 1 && (
				<LinearProgress
					variant="determinate"
					value={(elapsed / ADVANCE_MS) * 100}
					aria-hidden
					sx={{ width, height: 4, borderRadius: "999px", opacity: paused ? 0.35 : 1, transition: "opacity 200ms" }}
				/>
			)}
		</Box>
	);
}
