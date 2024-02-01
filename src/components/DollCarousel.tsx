import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box, ButtonBase, IconButton, Skeleton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import DollCard from "./DollCard";
import { loadDoll } from "../lib/data";
import type { TDoll } from "../types/tdoll";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How long each doll is shown before the carousel advances, in ms. */
const ADVANCE_MS = 6000;

/** Horizontal travel, in pixels, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 40;

/** Width of the centre card in CSS pixels, per breakpoint. Everything else is scaled down from this. */
const CARD_WIDTH = { narrow: 180, medium: 190, wide: 200 };

/** Room under the 1:2 art for the name, the badges and the id. */
const CARD_TEXT_HEIGHT = 64;

/** Horizontal distance between neighbouring cards, as a fraction of the card width. Below 1 they overlap. */
const SLOT_RATIO = 0.74;

/** How the ring shrinks and fades away from the centre, indexed by distance from it. The last entry is the off-screen slot. */
const DEPTH = [
	{ scale: 1, opacity: 1 },
	{ scale: 0.64, opacity: 0.55 },
	{ scale: 0.52, opacity: 0.3 },
	{ scale: 0.46, opacity: 0 }
];

/** Props for DollCarousel. */
interface DollCarouselProps {
	/** Doll ids to cycle through. Loaded once, then kept, so going back shows the same doll again. */
	ids: number[];
	/** Replaces the whole set with a fresh random one. Omitted when the caller has nothing to reshuffle. */
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
 * A rotating strip of dolls.
 *
 * What this replaces was not a carousel. One doll rerolled itself every five seconds and there was no
 * way back to the one just shown, because each tick picked a fresh random id rather than stepping
 * through a list. Holding the ids means previous is a real previous.
 *
 * Cards are positioned absolutely and keyed by doll id, so when the index moves React keeps each node
 * and only its transform changes. That is what makes the ring slide rather than redraw.
 *
 * @param props Component props.
 * @returns The carousel.
 */
export default function DollCarousel({ ids, onShuffle }: DollCarouselProps) {
	const theme = useTheme();
	const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
	const isMedium = useMediaQuery(theme.breakpoints.down("md"));
	const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

	const [dolls, setDolls] = useState<(TDoll | undefined)[]>([]);
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const touchStart = useRef<{ x: number; y: number } | null>(null);

	useEffect(() => {
		let active = true;
		// A fresh set starts at its own beginning rather than wherever the previous one had got to.
		setIndex(0);
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

	const step = useCallback(
		(delta: number) => {
			setIndex((current) => {
				const count = entries.length;
				return count === 0 ? 0 : (current + delta + count) % count;
			});
		},
		[entries.length]
	);

	useEffect(() => {
		if (paused || reduceMotion || entries.length < 2) {
			return;
		}
		const timer = setInterval(() => step(1), ADVANCE_MS);
		return () => clearInterval(timer);
	}, [paused, reduceMotion, entries.length, step]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (isTypingTarget(event.target)) {
				return;
			}
			if (event.key === "ArrowLeft") {
				step(-1);
			}
			if (event.key === "ArrowRight") {
				step(1);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [step]);

	const width = isNarrow ? CARD_WIDTH.narrow : isMedium ? CARD_WIDTH.medium : CARD_WIDTH.wide;
	const slot = Math.round(width * SLOT_RATIO);
	// The art is 1:2, so the tallest card in the ring is the unscaled centre one.
	const height = width * 2 + CARD_TEXT_HEIGHT;

	// How many cards the reader should see: 5 on a desktop, 3 on a tablet, 1 on a phone.
	const visibleRadius = isNarrow ? 0 : isMedium ? 1 : 2;
	// One extra slot each side so cards fade in and out at the edges rather than popping. Never more
	// slots than there are dolls, or the same doll would be rendered twice and React would see two of one key.
	const radius = Math.min(visibleRadius + 1, Math.max(0, Math.floor((entries.length - 1) / 2)));

	if (entries.length === 0) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
				<Skeleton variant="rounded" width={width} height={height} />
			</Box>
		);
	}

	const at = (offset: number) => entries[(index + offset + entries.length) % entries.length];
	const offsets = Array.from({ length: radius * 2 + 1 }, (_value, position) => position - radius);
	const transition = reduceMotion ? "none" : "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 380ms ease";

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
					// Without the vertical check a page scroll that drifts sideways also turns the ring.
					if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
						step(dx < 0 ? 1 : -1);
					}
				}
				touchStart.current = null;
				setPaused(false);
			}}
			onTouchCancel={() => {
				touchStart.current = null;
				setPaused(false);
			}}
			sx={{ py: 2 }}
		>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 0, sm: 1 } }}>
				<IconButton onClick={() => step(-1)} aria-label="previous" size="large">
					<ChevronLeftIcon />
				</IconButton>

				{/* The ring itself. Cards sit on top of each other and are pushed apart by their transform,
				    which is what lets them animate between slots instead of being relaid out. */}
				<Box sx={{ position: "relative", flexGrow: 1, height, maxWidth: slot * (visibleRadius * 2 + 1) + width * 0.3, overflow: "hidden" }}>
					{offsets.map((offset) => {
						const entry = at(offset);
						if (!entry) {
							return null;
						}
						// Anything past the visible radius is the extra slot that only exists to fade in and out,
						// so it takes the last DEPTH entry whatever its distance.
						const distance = Math.abs(offset);
						const depth = (distance > visibleRadius ? DEPTH[DEPTH.length - 1] : DEPTH[Math.min(distance, DEPTH.length - 2)]) ?? DEPTH[0];
						return (
							<Box
								key={entry.normal.id}
								aria-hidden={offset !== 0}
								sx={{
									position: "absolute",
									top: 0,
									left: "50%",
									width,
									transform: `translateX(-50%) translateX(${offset * slot}px) scale(${depth?.scale ?? 1})`,
									opacity: depth?.opacity ?? 1,
									zIndex: DEPTH.length - Math.abs(offset),
									transition,
									pointerEvents: offset === 0 ? "auto" : "none"
								}}
							>
								<DollCard {...cardProps(entry)} dense={offset !== 0} />
							</Box>
						);
					})}
				</Box>

				<IconButton onClick={() => step(1)} aria-label="next" size="large">
					<ChevronRightIcon />
				</IconButton>
			</Box>

			{/* Position indicator, plus the way to a different set entirely. */}
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }} role="tablist" aria-label="Carousel position">
					{entries.map((entry, position) => (
						<ButtonBase
							key={entry.normal.id}
							role="tab"
							aria-label={`Show ${entry.normal.name}`}
							aria-selected={position === index}
							onClick={() => setIndex(position)}
							sx={{
								height: 8,
								width: position === index ? 22 : 8,
								borderRadius: "999px",
								backgroundColor: position === index ? "primary.main" : "action.disabled",
								transition: reduceMotion ? "none" : "width 240ms ease, background-color 240ms ease"
							}}
						/>
					))}
				</Box>

				{onShuffle && (
					<Tooltip title="Show a different set">
						<IconButton onClick={onShuffle} aria-label="Show a different set" size="small">
							<AutorenewIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)}
			</Box>
		</Box>
	);
}
