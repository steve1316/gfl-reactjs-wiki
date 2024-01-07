import { useEffect, useRef, useState } from "react";

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
	/** Canvas size in CSS pixels. */
	size?: number;
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
export default function SpineAnimation({ skelUrl, atlasUrl, imageBase, animation, size = 250 }: SpineAnimationProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<SpinePlayer | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

	// Rebuild the player whenever the skeleton changes. The animation is switched separately, below,
	// so changing tabs does not pay for a reload.
	useEffect(() => {
		let active = true;
		setStatus("loading");

		void createSpinePlayer({ container: containerRef.current as HTMLElement, skelUrl, atlasUrl, imageBase, size, initialAnimation: animation })
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
		// `animation` is deliberately excluded: it is applied by the effect below without a reload.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skelUrl, atlasUrl, imageBase, size]);

	useEffect(() => {
		if (status === "ready" && animation) {
			playerRef.current?.play(animation);
		}
	}, [animation, status]);

	return (
		<div style={{ width: size, height: size, position: "relative" }}>
			<div ref={containerRef} style={{ width: size, height: size }} />
			{status !== "ready" && (
				<span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", opacity: 0.7 }}>
					{status === "loading" ? "Loading animation..." : "Animation unavailable"}
				</span>
			)}
		</div>
	);
}
