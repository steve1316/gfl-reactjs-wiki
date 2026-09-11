import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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

/** Props for DollCarousel. */
interface DollCarouselProps {
	/** Doll ids to cycle through. Loaded once, then kept, so going back shows the same doll again. */
	ids: number[];
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
 * A rotating strip of dolls.
 *
 * What this replaces was not a carousel. One doll rerolled itself every five seconds and there was no
 * way back to the one just shown, because each tick picked a fresh random id rather than stepping
 * through a list. Holding the ids means previous is a real previous.
 *
 * @param props Component props.
 * @returns The carousel.
 */
export default function DollCarousel({ ids }: DollCarouselProps) {
	const theme = useTheme();
	const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
	const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

	const [dolls, setDolls] = useState<(TDoll | undefined)[]>([]);
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const touchStart = useRef<number | null>(null);

	useEffect(() => {
		let active = true;
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

	if (entries.length === 0) {
		return <Box sx={{ height: 320 }} />;
	}

	const at = (offset: number) => entries[(index + offset + entries.length) % entries.length];
	const centre = at(0);
	if (!centre) {
		return <Box sx={{ height: 320 }} />;
	}

	return (
		<Box
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
			onTouchStart={(event) => {
				setPaused(true);
				touchStart.current = event.touches[0]?.clientX ?? null;
			}}
			onTouchEnd={(event) => {
				const start = touchStart.current;
				const end = event.changedTouches[0]?.clientX ?? null;
				if (start !== null && end !== null && Math.abs(end - start) > SWIPE_THRESHOLD) {
					step(end < start ? 1 : -1);
				}
				touchStart.current = null;
				setPaused(false);
			}}
			onTouchCancel={() => {
				touchStart.current = null;
				setPaused(false);
			}}
			sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 1, sm: 2 }, py: 2 }}
		>
			<IconButton onClick={() => step(-1)} aria-label="previous" size="large">
				<ChevronLeftIcon />
			</IconButton>

			{!isNarrow && (
				<Box sx={{ width: 110, opacity: 0.4, flexShrink: 0 }}>
					<DollCard {...cardProps(at(-1))} dense />
				</Box>
			)}

			{/* The centre card's art is at least 180px wide. At a device ratio of 1 the old hero drew a
			    256px source at 128 CSS pixels, discarding half of it. */}
			<Box sx={{ width: { xs: 200, sm: 220 }, flexShrink: 0 }}>
				<DollCard {...cardProps(centre)} />
			</Box>

			{!isNarrow && (
				<Box sx={{ width: 110, opacity: 0.4, flexShrink: 0 }}>
					<DollCard {...cardProps(at(1))} dense />
				</Box>
			)}

			<IconButton onClick={() => step(1)} aria-label="next" size="large">
				<ChevronRightIcon />
			</IconButton>
		</Box>
	);
}
