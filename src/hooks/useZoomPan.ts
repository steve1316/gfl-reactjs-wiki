import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How far one wheel notch moves the scale. */
const WHEEL_STEP = 0.0016;

/** Defaults, overridable per call site. */
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 6;
const DEFAULT_DOUBLE = 2.5;

/** How far, in CSS pixels, a pointer has to travel before its gesture counts as a drag rather than a click. */
const DRAG_THRESHOLD = 4;

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
	/** Whether a double click toggles the zoom. Defaults to true. Turn it off where a single click already means something, or two quick clicks do both. */
	doubleClickZoom?: boolean;
	/**
	 * How far, in CSS pixels, the content may sit from centre on each axis at a given scale. When set, dragging also works while fitted and every
	 * move, zoom and container resize is held inside these limits. When unset, fitted content cannot be dragged and zoomed content is not limited.
	 */
	panBounds?: (scale: number) => { x: number; y: number };
}

/** What `useZoomPan` hands back. `T` is the concrete type of the gesture container, e.g. `HTMLDivElement`. */
export interface UseZoomPanResult<T extends HTMLElement = HTMLElement> {
	/** The live transform, for callers that need the numbers. */
	transform: ZoomPanTransform;
	/** Ref for the element that receives gestures. Attach it to the same node that spreads `handlers`. */
	containerRef: RefObject<T | null>;
	/** Spread onto the element that should receive gestures. */
	handlers: {
		/** Starts a drag, or adds the second finger of a pinch. The rest of the gesture is tracked on the window. */
		onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
		/** Toggles between fitted and `doubleScale`. A native double click, so this is a mouse event, not a pointer event. */
		onDoubleClick: (event: ReactMouseEvent<HTMLElement>) => void;
	};
	/** Style for the element that receives the gestures: touch-action so the browser doesn't claim them for scrolling, and the cursor. */
	containerStyle: CSSProperties;
	/** Style for the content being transformed. */
	contentStyle: CSSProperties;
	/** Multiply the current scale, keeping the centre fixed. */
	zoomBy: (factor: number) => void;
	/** Return to fitted and centred. */
	reset: () => void;
	/** Whether the content is currently scaled past `minScale`. */
	isZoomed: boolean;
	/** Whether the gesture that just ended moved the content, so the click it produces should not count as a click. */
	wasDragged: () => boolean;
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
export function useZoomPan<T extends HTMLElement = HTMLElement>(options: UseZoomPanOptions = {}): UseZoomPanResult<T> {
	const minScale = options.minScale ?? DEFAULT_MIN;
	const maxScale = options.maxScale ?? DEFAULT_MAX;
	const doubleScale = options.doubleScale ?? DEFAULT_DOUBLE;
	const doubleClickZoom = options.doubleClickZoom ?? true;
	const hasPanBounds = options.panBounds !== undefined;

	const [transform, setTransform] = useState<ZoomPanTransform>({ scale: minScale, x: 0, y: 0 });

	// Live pointers, keyed by pointerId. A Map rather than state: these change many times per frame and
	// re-rendering on each one would drop frames during a pinch.
	const pointers = useRef(new Map<number, { x: number; y: number }>());
	const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
	const containerRef = useRef<T | null>(null);
	/**
	 * The container element, mirrored into state so effects that need it re-run when it appears.
	 *
	 * A ref alone is not enough. A caller that only mounts its stage once its data has loaded leaves `containerRef.current` null
	 * through the first render, and the wheel listener below would attach to nothing and never try again, since nothing it depends
	 * on changes afterwards. That is what left the enemy art viewer without wheel zoom while the doll viewer, which mounts its stage
	 * on the first render, happened to work.
	 */
	const [containerNode, setContainerNode] = useState<T | null>(null);

	// No dependency array on purpose: this runs after every render, and sets state only when the element has actually changed, so
	// it settles immediately rather than looping.
	useEffect(() => {
		if (containerRef.current !== containerNode) {
			setContainerNode(containerRef.current);
		}
	});

	// Where a one-pointer drag began and where the content sat at that moment. The drag is applied as an
	// absolute offset from this, not as a sum of per-event deltas, so a gesture that loses intermediate
	// move events still ends up exactly under the cursor. Per-event deltas moved the art a tenth of the
	// way and left it behind the pointer.
	const dragStart = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);

	// Set once the current gesture has panned or pinched. Every drag ends in a click event, and callers that
	// also act on a click need to tell those apart from a click that never moved.
	const moved = useRef(false);

	// True only while at least one pointer is down. Drives the cursor, nothing else: the listeners below are
	// attached by hand rather than by an effect keyed on this, because an effect only runs after the next
	// render. A press-and-flick inside one frame would lose both its first moves and its pointerup, and the
	// released pointer left in the map would then be read as the second finger of a pinch.
	const [gesturing, setGesturing] = useState(false);

	// The listeners currently attached to the window, so the same function objects can be removed again.
	const attached = useRef<{ move: (event: PointerEvent) => void; end: (event: PointerEvent) => void } | null>(null);

	// The handlers below run from window listeners, so they cannot close over `transform` without going
	// stale between renders. This mirror is what they read instead.
	const transformRef = useRef(transform);
	transformRef.current = transform;

	// Read through a ref for the same reason, and so a caller passing a fresh function each render does not rebuild every handler.
	const panBoundsRef = useRef(options.panBounds);
	panBoundsRef.current = options.panBounds;

	const clamp = useCallback((scale: number) => Math.min(maxScale, Math.max(minScale, scale)), [minScale, maxScale]);

	// Holds an offset inside `panBounds` for the transform's scale. Without `panBounds` the transform is returned unchanged.
	const limitPan = useCallback((next: ZoomPanTransform): ZoomPanTransform => {
		const bounds = panBoundsRef.current?.(next.scale);
		if (!bounds) {
			return next;
		}
		const x = Math.min(bounds.x, Math.max(-bounds.x, next.x));
		const y = Math.min(bounds.y, Math.max(-bounds.y, next.y));
		return x === next.x && y === next.y ? next : { ...next, x, y };
	}, []);

	const reset = useCallback(() => {
		setTransform({ scale: minScale, x: 0, y: 0 });
	}, [minScale]);

	const zoomBy = useCallback(
		(factor: number) => {
			setTransform((current) => {
				const scale = clamp(current.scale * factor);
				// Snapping back to fitted also recentres, or the content is left parked off screen.
				return scale === minScale ? { scale, x: 0, y: 0 } : limitPan({ ...current, scale });
			});
		},
		[clamp, minScale, limitPan]
	);

	// React attaches wheel listeners passively, so `preventDefault` inside an `onWheel` prop is silently
	// ignored and the page scrolls underneath the gesture. Attaching the listener by hand with
	// `passive: false` is the only way to actually stop that scroll.
	useEffect(() => {
		const element = containerRef.current;
		if (!element) {
			return;
		}
		const handleWheel = (event: WheelEvent) => {
			event.preventDefault();
			zoomBy(Math.exp(-event.deltaY * WHEEL_STEP));
		};
		element.addEventListener("wheel", handleWheel, { passive: false });
		return () => element.removeEventListener("wheel", handleWheel);
	}, [zoomBy, containerNode]);

	const detach = useCallback(() => {
		if (!attached.current) {
			return;
		}
		window.removeEventListener("pointermove", attached.current.move);
		window.removeEventListener("pointerup", attached.current.end);
		window.removeEventListener("pointercancel", attached.current.end);
		attached.current = null;
	}, []);

	// Nothing here depends on render state, so one set of listeners serves the whole gesture. The window
	// rather than the container: setPointerCapture was delivering only a fraction of the moves and no
	// pointerup at all, which truncated the pan and left the gesture stuck open.
	const attach = useCallback(() => {
		if (attached.current) {
			return;
		}

		const move = (event: PointerEvent) => {
			if (!pointers.current.has(event.pointerId)) {
				return;
			}
			pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

			const active = [...pointers.current.values()];
			if (active.length >= 2) {
				const [first, second] = active as [{ x: number; y: number }, { x: number; y: number }];
				const distance = Math.hypot(first.x - second.x, first.y - second.y);
				if (!pinchStart.current) {
					pinchStart.current = { distance, scale: transformRef.current.scale };
					return;
				}
				moved.current = true;
				const ratio = distance / (pinchStart.current.distance || 1);
				const scale = clamp(pinchStart.current.scale * ratio);
				setTransform((current) => (scale === minScale ? { scale, x: 0, y: 0 } : limitPan({ ...current, scale })));
				return;
			}

			// One pointer is a drag. Without pan limits that is only meaningful once there is overflow to move.
			const origin = dragStart.current;
			if (!origin || (!panBoundsRef.current && transformRef.current.scale <= minScale)) {
				return;
			}
			if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > DRAG_THRESHOLD) {
				moved.current = true;
			}
			setTransform((current) => limitPan({ ...current, x: origin.originX + (event.clientX - origin.x), y: origin.originY + (event.clientY - origin.y) }));
		};

		const end = (event: PointerEvent) => {
			pointers.current.delete(event.pointerId);
			if (pointers.current.size < 2) {
				pinchStart.current = null;
			}
			if (pointers.current.size === 0) {
				dragStart.current = null;
				setGesturing(false);
				detach();
			}
		};

		attached.current = { move, end };
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
		window.addEventListener("pointercancel", end);
	}, [clamp, minScale, detach, limitPan]);

	// The limits depend on the container's size, so a resize pulls content that is now too far out back inside them.
	useEffect(() => {
		const element = containerRef.current;
		if (!element || !hasPanBounds) {
			return;
		}
		const observer = new ResizeObserver(() => setTransform((current) => limitPan(current)));
		observer.observe(element);
		return () => observer.disconnect();
	}, [hasPanBounds, limitPan]);

	// A gesture still running when the component goes away would otherwise leave its listeners behind.
	useEffect(() => detach, [detach]);

	const onPointerDown = useCallback(
		(event: ReactPointerEvent<HTMLElement>) => {
			pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
			if (pointers.current.size === 1) {
				moved.current = false;
				const current = transformRef.current;
				dragStart.current = { x: event.clientX, y: event.clientY, originX: current.x, originY: current.y };
			} else {
				// A second finger turns the gesture into a pinch, so the drag origin stops applying.
				dragStart.current = null;
			}
			setGesturing(true);
			attach();
		},
		[attach]
	);

	const wasDragged = useCallback(() => moved.current, []);

	const onDoubleClick = useCallback(
		(event: ReactMouseEvent<HTMLElement>) => {
			if (!doubleClickZoom) {
				return;
			}
			event.preventDefault();
			setTransform((current) => (current.scale > minScale ? { scale: minScale, x: 0, y: 0 } : { scale: clamp(doubleScale), x: 0, y: 0 }));
		},
		[clamp, doubleClickZoom, doubleScale, minScale]
	);

	const containerStyle = useMemo<CSSProperties>(
		() => ({
			// The browser must not claim the gesture for scrolling, or pinch never reaches these handlers. This has to sit
			// on the container rather than the content, since that is the element the handlers are actually spread onto.
			touchAction: "none",
			cursor: hasPanBounds || transform.scale > minScale ? (gesturing ? "grabbing" : "grab") : "default"
		}),
		[transform.scale, minScale, gesturing, hasPanBounds]
	);

	const contentStyle = useMemo<CSSProperties>(
		() => ({
			transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
			transformOrigin: "center center",
			willChange: "transform"
		}),
		[transform]
	);

	return {
		transform,
		containerRef,
		handlers: { onPointerDown, onDoubleClick },
		containerStyle,
		contentStyle,
		zoomBy,
		reset,
		isZoomed: transform.scale > minScale,
		wasDragged
	};
}
