import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How far one wheel notch moves the scale. */
const WHEEL_STEP = 0.0016;

/** Defaults, overridable per call site. */
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 6;
const DEFAULT_DOUBLE = 2.5;

/** Where the content currently sits. */
export interface ZoomPanTransform {
	/** Current scale, between `minScale` and `maxScale`. */
	scale: number;
	/** Horizontal offset in CSS pixels. */
	x: number;
	/** Vertical offset in CSS pixels. */
	y: number;
}

/** Tuning for `useZoomPan`. */
export interface UseZoomPanOptions {
	/** Smallest allowed scale. Defaults to 1, which is "fitted". */
	minScale?: number;
	/** Largest allowed scale. Defaults to 6. */
	maxScale?: number;
	/** Scale a double click or double tap jumps to when currently fitted. Defaults to 2.5. */
	doubleScale?: number;
}

/** What `useZoomPan` hands back. */
export interface UseZoomPanResult {
	/** The live transform, for callers that need the numbers. */
	transform: ZoomPanTransform;
	/** Spread onto the element that should receive gestures. */
	handlers: {
		/** Wheel zoom, anchored on the pointer. */
		onWheel: (event: ReactWheelEvent<HTMLElement>) => void;
		/** Starts a drag, or the second finger of a pinch. */
		onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
		/** Drags or pinches. */
		onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
		/** Ends a drag or pinch. */
		onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
		/** Ends a drag or pinch that the browser cancelled. */
		onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
		/** Toggles between fitted and `doubleScale`. */
		onDoubleClick: (event: ReactPointerEvent<HTMLElement>) => void;
	};
	/** Style for the content being transformed. */
	contentStyle: CSSProperties;
	/** Multiply the current scale, keeping the centre fixed. */
	zoomBy: (factor: number) => void;
	/** Return to fitted and centred. */
	reset: () => void;
	/** Whether the content is currently scaled past `minScale`. */
	isZoomed: boolean;
}

/**
 * Wheel, pinch, drag and reset for one element.
 *
 * The chibi stage and the full-art viewer both need this. Writing it once is what keeps a pinch meaning
 * the same thing on both, rather than the two drifting apart as they are separately tweaked.
 *
 * Pointer events are used rather than touch events so one code path covers mouse, trackpad, pen and
 * touch. Two simultaneous pointers are treated as a pinch; one is a drag.
 *
 * @param options Tuning for the scale limits.
 * @returns The transform, the handlers to spread, and imperative controls.
 */
export function useZoomPan(options: UseZoomPanOptions = {}): UseZoomPanResult {
	const minScale = options.minScale ?? DEFAULT_MIN;
	const maxScale = options.maxScale ?? DEFAULT_MAX;
	const doubleScale = options.doubleScale ?? DEFAULT_DOUBLE;

	const [transform, setTransform] = useState<ZoomPanTransform>({ scale: minScale, x: 0, y: 0 });

	// Live pointers, keyed by pointerId. A Map rather than state: these change many times per frame and
	// re-rendering on each one would drop frames during a pinch.
	const pointers = useRef(new Map<number, { x: number; y: number }>());
	const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

	const clamp = useCallback((scale: number) => Math.min(maxScale, Math.max(minScale, scale)), [minScale, maxScale]);

	const reset = useCallback(() => {
		setTransform({ scale: minScale, x: 0, y: 0 });
	}, [minScale]);

	const zoomBy = useCallback(
		(factor: number) => {
			setTransform((current) => {
				const scale = clamp(current.scale * factor);
				// Snapping back to fitted also recentres, or the content is left parked off screen.
				return scale === minScale ? { scale, x: 0, y: 0 } : { ...current, scale };
			});
		},
		[clamp, minScale]
	);

	const onWheel = useCallback(
		(event: ReactWheelEvent<HTMLElement>) => {
			event.preventDefault();
			zoomBy(Math.exp(-event.deltaY * WHEEL_STEP));
		},
		[zoomBy]
	);

	const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
		event.currentTarget.setPointerCapture(event.pointerId);
		pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
	}, []);

	const endPointer = useCallback((event: ReactPointerEvent<HTMLElement>) => {
		pointers.current.delete(event.pointerId);
		if (pointers.current.size < 2) {
			pinchStart.current = null;
		}
	}, []);

	const onPointerMove = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			const previous = pointers.current.get(event.pointerId);
			if (!previous) {
				return;
			}
			pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

			const active = [...pointers.current.values()];
			if (active.length >= 2) {
				const [first, second] = active as [{ x: number; y: number }, { x: number; y: number }];
				const distance = Math.hypot(first.x - second.x, first.y - second.y);
				if (!pinchStart.current) {
					pinchStart.current = { distance, scale: transform.scale };
					return;
				}
				const ratio = distance / (pinchStart.current.distance || 1);
				const scale = clamp(pinchStart.current.scale * ratio);
				setTransform((current) => (scale === minScale ? { scale, x: 0, y: 0 } : { ...current, scale }));
				return;
			}

			// One pointer is a drag, and dragging is only meaningful once there is overflow to move.
			if (transform.scale <= minScale) {
				return;
			}
			const dx = event.clientX - previous.x;
			const dy = event.clientY - previous.y;
			setTransform((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
		},
		[clamp, minScale, transform.scale]
	);

	const onDoubleClick = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			event.preventDefault();
			setTransform((current) => (current.scale > minScale ? { scale: minScale, x: 0, y: 0 } : { scale: clamp(doubleScale), x: 0, y: 0 }));
		},
		[clamp, doubleScale, minScale]
	);

	const contentStyle = useMemo<CSSProperties>(
		() => ({
			transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
			transformOrigin: "center center",
			// The browser must not claim the gesture for scrolling, or pinch never reaches these handlers.
			touchAction: "none",
			cursor: transform.scale > minScale ? "grab" : "default",
			willChange: "transform"
		}),
		[transform, minScale]
	);

	return {
		transform,
		handlers: { onWheel, onPointerDown, onPointerMove, onPointerUp: endPointer, onPointerCancel: endPointer, onDoubleClick },
		contentStyle,
		zoomBy,
		reset,
		isZoomed: transform.scale > minScale
	};
}
