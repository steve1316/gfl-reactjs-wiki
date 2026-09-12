import { useEffect, useRef, useState } from "react";

import { Fab } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useZoomPan } from "../hooks/useZoomPan";
import { createSpinePlayer } from "../lib/spine";
import type { SpinePlayer } from "../lib/spine";

/** Props for SpineAnimation. */
interface SpineAnimationProps {
	/** URL of the binary `.skel`. */
	skelUrl: string;
	/** URL of the `.atlas`. */
	atlasUrl: string;
	/** Directory holding the atlas page images, with a trailing slash. */
	imageBase: string;
	/** Animation to play, looping. Ignored when the skeleton does not define it. */
	animation?: string;
	/** Upper bound on the square stage size in CSS pixels. Defaults to 420. The stage otherwise tracks its container's width. */
	maxSize?: number;
}

/**
 * Renders one Spine skeleton, replacing the animation GIFs.
 *
 * The whole set of GIFs came to 5,267 MB and covered only the dolls present in 2021. The equivalent
 * Spine data is 157 MB and covers every doll, which is why the GIFs are not published at all.
 *
 * @param props Component props.
 * @returns A canvas showing the animation, or a short status message.
 */
export default function SpineAnimation({ skelUrl, atlasUrl, imageBase, animation, maxSize = 420 }: SpineAnimationProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<SpinePlayer | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
	const [stageSize, setStageSize] = useState(maxSize);
	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 4, doubleScale: 2 });

	// The stage was pinned at 250px whatever the screen, so it was small on a desktop and still had to fit
	// a phone. A square that tracks its container suits both.
	//
	// The wrapper below is a shrink-to-fit flex child of whatever page embeds it, so it renders at 0 width
	// once the canvas mount point is taken out of flow. Walking up to the first ancestor that already has
	// real width finds the actual layout box (the surrounding card) rather than echoing our own size back.
	useEffect(() => {
		let host = containerRef.current?.parentElement ?? null;
		while (host && host.getBoundingClientRect().width === 0) {
			host = host.parentElement;
		}
		if (!host) {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? 0;
			if (width > 0) {
				setStageSize(Math.round(Math.min(width, maxSize)));
			}
		});
		observer.observe(host);
		return () => observer.disconnect();
	}, [maxSize]);

	// `status` is included so a resize that landed while the player was still loading is applied the
	// moment it becomes ready, rather than being silently dropped as a no-op on a null playerRef.
	useEffect(() => {
		if (status === "ready") {
			playerRef.current?.resize(stageSize);
		}
	}, [stageSize, status]);

	// Rebuild the player whenever the skeleton changes. The animation is switched separately, below,
	// so changing tabs does not pay for a reload.
	useEffect(() => {
		let active = true;
		setStatus("loading");

		void createSpinePlayer({ container: containerRef.current as HTMLElement, skelUrl, atlasUrl, imageBase, size: stageSize, resolution: window.devicePixelRatio || 1, initialAnimation: animation })
			.then((player) => {
				if (!active) {
					player.destroy();
					return;
				}
				playerRef.current = player;
				setStatus("ready");
			})
			.catch((error: unknown) => {
				console.error("Spine load failed:", error);
				if (active) {
					setStatus("error");
				}
			});

		return () => {
			active = false;
			playerRef.current?.destroy();
			playerRef.current = null;
		};
		// `animation` and `stageSize` are deliberately excluded: animation is applied by the effect below
		// without a reload, and a stageSize change is applied to the live player by the resize effect above.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skelUrl, atlasUrl, imageBase]);

	useEffect(() => {
		if (status === "ready" && animation) {
			playerRef.current?.play(animation);
		}
	}, [animation, status]);

	return (
		// The mount point below is deliberately taken out of flow (absolute) rather than a normal block: a
		// fixed-pixel box sitting in flow would force this wrapper's own flex ancestor to grow to match it,
		// which defeats the point of measuring the ancestor to decide the size in the first place.
		//
		// This same div is the gesture surface: it is also `containerRef.current?.parentElement`, the node the
		// ResizeObserver above starts its ancestor walk from, so the zoom handlers and touch-action are applied
		// here rather than on a new wrapper. A new layer between this div and the mount point would make the
		// walk latch onto it instead of climbing to the real sizing host.
		//
		// No `overflow: hidden` here: this div's own CSS width resolves to 0 (the same shrink-wrap issue the
		// comment above describes), so clipping to its own box would clip the mount point to nothing instead
		// of just trimming the parts of a zoomed-in chibi that pan past the stage edge.
		<div
			ref={zoom.containerRef}
			style={{ width: "100%", height: stageSize, position: "relative", ...zoom.containerStyle }}
			{...zoom.handlers}
			onClick={(event) => {
				// A drag ends in a click. Swallow it while zoomed so a pan does not also advance the animation.
				if (zoom.isZoomed) {
					event.stopPropagation();
				}
			}}
		>
			<div
				ref={containerRef}
				style={{
					position: "absolute",
					top: 0,
					left: "50%",
					width: stageSize,
					height: stageSize,
					...zoom.contentStyle,
					// zoom.contentStyle's own transform would drop the horizontal centering, so the two are combined here.
					transform: `translateX(-50%) translate(${zoom.transform.x}px, ${zoom.transform.y}px) scale(${zoom.transform.scale})`
				}}
			/>
			{/* Bottom right rather than top right: the chibi's head sits at the top of the stage, and this
			    matches where the full-art button sits on the portrait card.

			    onPointerDown is stopped here because the gesture container calls setPointerCapture on itself
			    for every pointerdown that reaches it. With the pointer captured by the container, the matching
			    pointerup never lands on this button, so no click is ever synthesised and the reset does nothing. */}
			{zoom.isZoomed && (
				<Fab
					size="small"
					color="primary"
					onPointerDown={(event) => event.stopPropagation()}
					onClick={zoom.reset}
					aria-label="reset view"
					sx={{ position: "absolute", right: 8, bottom: 8, opacity: 0.9 }}
				>
					<RestartAltIcon />
				</Fab>
			)}
			{status !== "ready" && (
				<span
					style={{
						position: "absolute",
						top: 0,
						left: "50%",
						transform: "translateX(-50%)",
						width: stageSize,
						height: stageSize,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "0.85rem",
						opacity: 0.7
					}}
				>
					{status === "loading" ? "Loading animation..." : "Animation unavailable"}
				</span>
			)}
		</div>
	);
}
