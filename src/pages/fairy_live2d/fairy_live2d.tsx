import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import CloseIcon from "@mui/icons-material/Close";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import ArtZoomControls from "../../components/ArtZoomControls";
import LoadError from "../../components/LoadError";
import { useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { fairyLive2dModelUrl } from "../../lib/assets";
import { createLive2dStage } from "../../lib/live2d";
import type { Live2dStage } from "../../lib/live2d";
import { hasFairyLive2d } from "../../lib/processData";
import { nextAnimationValue } from "../../lib/spine";
import type { AnimationTab } from "../../lib/spine";
import { useFairies } from "../../lib/useFairies";
import { useFairyLive2dMotions } from "../../lib/useLive2dMotions";
import NotFound404 from "../../not_found_404";
import type { Live2dMotion } from "../../types/live2d";

/** The form shown when the address names none or an invalid one, the fairy's highest rank. Mirrors `FairyConstants.forms.length`. */
const DEFAULT_FORM = 3;

/** How many forms a fairy has. Mirrors `FairyConstants.forms.length`, since the address is checked before the data loads. */
const FORM_COUNT = 3;

/** The `model3Group` value every idle-classified motion's index entry carries, per `tools/assets/extract_live2d.py`'s `motion_group_name`. */
const IDLE_TAB_VALUE = "Idle";

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: Theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	header: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	iconButton: { color: "inherit" },
	title: { flexGrow: 1 },
	centred: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholderStage: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	placeholderBox: { width: 256, maxWidth: "60vw" },
	placeholder: { aspectRatio: "1 / 1" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden", cursor: "pointer" },
	canvas: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" },
	statusOverlay: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	footer: { display: "flex", justifyContent: "center", p: 1 },
	caption: { color: "common.white" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Read the `form` parameter as a form number.
 *
 * @param param The `form` parameter, or null when the address has none.
 * @returns The form number, 1 to 3, or `DEFAULT_FORM` when the parameter is missing or not a valid form.
 */
function parseForm(param: string | null): number {
	const value = Number(param);
	return Number.isInteger(value) && value >= 1 && value <= FORM_COUNT ? value : DEFAULT_FORM;
}

/**
 * A readable label for a raw motion file name, such as `wait_01`.
 *
 * @param name The motion's file name from the Live2D index.
 * @returns The name split on underscores and title-cased.
 */
function motionLabel(name: string): string {
	return name
		.split("_")
		.map((part) => (part.length === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
		.join(" ");
}

/**
 * The playable motion tabs for a model, one per distinct model3 motion group.
 *
 * The tab's `value` is each motion's own `model3Group`, the group name the model's actual `model3.json` uses, so a click always
 * finds a real group to play. Every idle-classified clip collapses into the single `Idle` group they share.
 *
 * @param motions The fairy's motions from the Live2D index.
 * @returns Tabs in the index's own order, for `nextAnimationValue` and the caption.
 */
function motionTabs(motions: readonly Live2dMotion[]): AnimationTab[] {
	const tabs: AnimationTab[] = [];
	const seen = new Set<string>();
	for (const motion of motions) {
		const value = motion.model3Group;
		if (seen.has(value)) {
			continue;
		}
		seen.add(value);
		tabs.push({ value, label: value === IDLE_TAB_VALUE ? "Idle" : motionLabel(motion.name) });
	}
	return tabs;
}

/**
 * Which motion's model3 group plays for a tap on each hit area.
 *
 * @param motions The fairy's motions from the Live2D index.
 * @returns A map of hit area (lowercased) to the model3 group to play, the first touch clip found for each area.
 */
function touchMotionsByArea(motions: readonly Live2dMotion[]): Map<string, string> {
	const map = new Map<string, string>();
	for (const motion of motions) {
		if (motion.group === "touch" && motion.touchArea !== null && !map.has(motion.touchArea)) {
			map.set(motion.touchArea, motion.model3Group);
		}
	}
	return map;
}

/**
 * Full-screen Live2D viewer for a fairy's model, with zoom, pan and motion cycling.
 *
 * A route rather than an overlay, like the fairy art viewer, so Back closes it and the form on screen can be linked to.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function FairyLive2d() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const { data, loadFailed, retry } = useFairies();

	// Captured at open, since a pasted link's `default` key must still be recognised after any internal navigation.
	const openedKey = useRef(location.key);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const stageRef = useRef<Live2dStage | null>(null);

	const [stageStatus, setStageStatus] = useState<"loading" | "ready" | "error">("loading");
	// Bumped by the stage retry button to run the load again.
	const [stageAttempt, setStageAttempt] = useState(0);
	const [motion, setMotion] = useState("");

	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, doubleClickZoom: false });

	const fairy = data?.items.find((entry) => String(entry.id) === id);
	const form = parseForm(searchParams.get("form"));
	const hosted = fairy !== undefined && hasFairyLive2d(fairy.id, form);
	const modelUrl = fairy !== undefined && hosted ? fairyLive2dModelUrl(fairy.id, form) : undefined;

	const { motions } = useFairyLive2dMotions(fairy !== undefined && hosted ? fairy.id : undefined);
	const tabs = useMemo(() => motionTabs(motions ?? []), [motions]);
	const touchByArea = useMemo(() => touchMotionsByArea(motions ?? []), [motions]);

	// Opened from the fairy page, going back returns to it. Opened from a pasted link there is nothing to go back to, so the fairy page opens instead.
	const close = useCallback(() => {
		if (openedKey.current !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/fairy/${id ?? ""}`, { replace: true });
	}, [navigate, id]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (fairy) {
			document.title = `${fairy.name} Live2D`;
		}
	}, [fairy]);

	// Rebuilds the stage whenever the model changes or a retry is requested. The container is measured once here rather than
	// tracked with a resize observer: the footer stays mounted at a stable height as soon as `hosted` is known, so the box has
	// already settled into its final size by the time this runs.
	useEffect(() => {
		if (modelUrl === undefined) {
			return;
		}
		const canvas = canvasRef.current;
		const container = zoom.containerRef.current;
		if (!canvas || !container) {
			return;
		}

		let active = true;
		setStageStatus("loading");
		setMotion("");

		const rect = container.getBoundingClientRect();
		const resolution = window.devicePixelRatio || 1;
		canvas.width = Math.max(1, Math.round(rect.width * resolution));
		canvas.height = Math.max(1, Math.round(rect.height * resolution));

		createLive2dStage(canvas, modelUrl)
			.then((stage) => {
				if (!active) {
					stage.destroy();
					return;
				}
				stageRef.current = stage;
				setStageStatus("ready");
			})
			.catch((error: unknown) => {
				console.error("Live2D model load failed:", error);
				if (active) {
					setStageStatus("error");
				}
			});

		return () => {
			active = false;
			stageRef.current?.destroy();
			stageRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modelUrl, stageAttempt]);

	// Sets the caption once the stage is up and the index's motion tabs have arrived, without overwriting a motion the reader already chose.
	useEffect(() => {
		if (stageStatus === "ready") {
			setMotion((current) => (current === "" ? (tabs.find((tab) => tab.value === IDLE_TAB_VALUE)?.value ?? tabs[0]?.value ?? "") : current));
		}
	}, [stageStatus, tabs]);

	const retryStage = useCallback(() => setStageAttempt((current) => current + 1), []);

	// A hit area's touch reaction pre-empts the plain cycle; otherwise the click walks the same motion order the caption tracks.
	const handleStageClick = useCallback(
		(event: ReactMouseEvent<HTMLElement>) => {
			if (zoom.wasDragged()) {
				return;
			}
			const canvas = canvasRef.current;
			const stage = stageRef.current;
			if (!canvas || !stage) {
				return;
			}
			const rect = canvas.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
			const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
			const hitArea = stage.hitTest(x, y)?.toLowerCase();
			const next = (hitArea !== undefined ? touchByArea.get(hitArea) : undefined) ?? nextAnimationValue(tabs, motion);
			if (next !== undefined) {
				stage.playMotion(next);
				setMotion(next);
			}
		},
		[zoom.wasDragged, touchByArea, tabs, motion]
	);

	if (data !== null && fairy === undefined) {
		return <NotFound404 message={`There is no fairy with the id ${id ?? ""}.`} />;
	}

	return (
		<Box sx={styles.root}>
			<Box sx={styles.header}>
				<IconButton onClick={close} aria-label="close" sx={styles.iconButton}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={styles.title}>
					{fairy?.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{hosted && !loadFailed ? <ArtZoomControls zoom={zoom} /> : null}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centred}>
					<LoadError what="this fairy" onRetry={retry} titleComponent="h1" />
				</Box>
			) : (
				// Always mounted, since the zoom hook attaches its wheel and resize listeners to this box once, on mount.
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers} onClick={handleStageClick}>
					{fairy === undefined ? null : hosted ? (
						<>
							<Box component="canvas" ref={canvasRef} sx={styles.canvas} style={zoom.contentStyle} />
							{stageStatus === "error" ? (
								<Box sx={styles.statusOverlay}>
									<LoadError what="this fairy's Live2D model" onRetry={retryStage} />
								</Box>
							) : stageStatus === "loading" ? (
								<Box sx={styles.statusOverlay}>
									<Typography variant="body2" color="common.white" sx={{ opacity: 0.7 }}>
										Loading...
									</Typography>
								</Box>
							) : null}
						</>
					) : (
						<Box sx={styles.placeholderStage}>
							<Box sx={styles.placeholderBox}>
								<ArtPlaceholder name={fairy.name} sx={styles.placeholder} />
							</Box>
						</Box>
					)}
				</Box>
			)}

			{hosted && !loadFailed ? (
				<Box sx={styles.footer}>
					<Typography variant="body2" sx={styles.caption}>
						{tabs.find((tab) => tab.value === motion)?.label ?? " "}
					</Typography>
				</Box>
			) : null}
		</Box>
	);
}
