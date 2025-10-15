import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, Card, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { hocLive2dModelUrl, hocSpineImageBase, hocSpineUrl } from "../../lib/assets";
import { createLive2dStage } from "../../lib/live2d";
import type { Live2dStage } from "../../lib/live2d";
import { hasHocLive2d } from "../../lib/processData";
import { animationTabs, nextAnimationValue } from "../../lib/spine";
import type { AnimationTab } from "../../lib/spine";
import { useHocLive2dMotions } from "../../lib/useLive2dMotions";
import type { Live2dMotion } from "../../types/live2d";
import type { HocSpineEntry, SpineRig } from "../../types/spine";

/** The animation a rig opens on, when it defines one. */
const DEFAULT_ANIMATION = "wait";

/** Shows the stage is clickable. A module constant, so the wrapper is not handed a new style object each render. */
const STAGE_STYLE = { cursor: "pointer" } as const;

/**
 * The `model3Group` value every idle-classified motion's index entry carries, per `tools/assets/extract_live2d.py`'s `motion_group_name`,
 * mirroring `fairy_live2d.tsx`'s own constant of the same name.
 */
const IDLE_TAB_VALUE = "Idle";

/** The square Live2D stage, sized directly on the flex item Card hands it rather than an inner width:100% that would collapse to 0. */
const LIVE2D_STAGE_STYLE = { width: "100%", maxWidth: 340, aspectRatio: "1 / 1", position: "relative", cursor: "pointer" } as const;

/** Fills the Live2D stage box exactly, matching `fairy_live2d.tsx`'s canvas style. */
const LIVE2D_CANVAS_STYLE = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" } as const;

/** Centred loading/error text over the Live2D stage, matching `SpineAnimation`'s own status overlay. */
const LIVE2D_STATUS_STYLE = {
	position: "absolute",
	inset: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "0.85rem",
	opacity: 0.7
} as const;

const styles = {
	// The same full-width toggle the Stats card uses to switch views.
	rigToggle: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": { flex: 1 }
	},
	pillList: {
		display: "flex",
		flexWrap: "wrap",
		listStyle: "none",
		p: 0,
		m: 0,
		mb: 1,
		gap: 0.5
	},
	cardForAnimation: (theme: Theme) => ({
		display: "flex",
		justifyContent: "center",
		width: "100%",
		// The card is the ancestor SpineAnimation's ResizeObserver measures, so clipping happens here
		// rather than on SpineAnimation's own wrapper, which resolves to zero width and would hide it.
		overflow: "hidden",
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: `linear-gradient(45deg, ${theme.palette.stripe.dark} 12.50%, ${theme.palette.stripe.light} 12.50%, ${theme.palette.stripe.light} 50%, ${theme.palette.stripe.dark} 50%, ${theme.palette.stripe.dark} 62.50%, ${theme.palette.stripe.light} 62.50%, ${theme.palette.stripe.light} 100%)`,
		backgroundSize: "5.66px 5.66px"
	})
} satisfies Record<string, SxProps<Theme>>;

/**
 * Pick the animation a rig should open on.
 *
 * @param rig The rig being switched to.
 * @returns `wait` when the rig defines it, else its first tab's animation, or an empty string for a rig with none.
 */
function openingAnimation(rig: SpineRig | undefined): string {
	if (!rig) {
		return "";
	}
	return rig.anims.includes(DEFAULT_ANIMATION) ? DEFAULT_ANIMATION : (animationTabs(rig.anims)[0]?.value ?? "");
}

/**
 * A readable label for a raw motion file name, such as `wait_01`. Mirrors `fairy_live2d.tsx`'s `motionLabel`.
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
 * The playable motion tabs for a model, one per distinct model3 motion group. Mirrors `fairy_live2d.tsx`'s `motionTabs`: the tab's
 * `value` is each motion's own `model3Group`, the group name the model's actual `model3.json` uses, so a click always finds a
 * real group to play.
 *
 * @param motions The HOC's motions from the Live2D index.
 * @returns Tabs in the index's own order, for `nextAnimationValue` and the pill row.
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

/** Props for HocAnimationsPanel. */
interface HocAnimationsPanelProps {
	/** The HOC's id, used to build the Spine and Live2D asset URLs. */
	hocId: number;
	/** The HOC's published rigs: the combat rig and its crew. */
	entry: HocSpineEntry;
}

/**
 * A HOC's chibi animations: a toggle between the battle rig, each crew rig and, when the manifest lists one, the HOC's Live2D
 * model. Clicking the player moves to the next animation or motion, as on the T-Doll page.
 *
 * @param props Component props.
 * @returns The rig toggle, pill row and player.
 */
export default function HocAnimationsPanel({ hocId, entry }: HocAnimationsPanelProps) {
	const rigs = useMemo(() => [entry.combat, ...entry.crew], [entry]);
	const [rigIndex, setRigIndex] = useState(0);
	const [animation, setAnimation] = useState(() => openingAnimation(entry.combat));
	// Whether the Live2D option is selected, instead of one of the Spine rigs. Kept separate from `rigIndex` so leaving
	// Live2D and coming back returns to the same rig without re-deriving it.
	const [live2dActive, setLive2dActive] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const stageRef = useRef<Live2dStage | null>(null);
	const [live2dStatus, setLive2dStatus] = useState<"loading" | "ready" | "error">("loading");
	const [live2dMotion, setLive2dMotion] = useState("");

	const rig = rigs[rigIndex] ?? entry.combat;
	const tabs = useMemo(() => animationTabs(rig.anims), [rig]);

	const hasLive2d = hasHocLive2d(hocId);
	const { motions } = useHocLive2dMotions(hasLive2d ? hocId : undefined);
	const live2dTabs = useMemo(() => motionTabs(motions ?? []), [motions]);

	// Derived from state declared above, not from the handlers below, so these sit with the rest of the component's
	// derived state rather than just above the JSX that reads them.
	const activeTabs = live2dActive ? live2dTabs : tabs;
	const activeValue = live2dActive ? live2dMotion : animation;

	const handleModeChange = useCallback(
		(_event: MouseEvent<HTMLElement>, value: number | "live2d" | null) => {
			// Clicking the selected button hands back null, which would leave no rig chosen.
			if (value === null) {
				return;
			}
			if (value === "live2d") {
				setLive2dActive(true);
				return;
			}
			setLive2dActive(false);
			setRigIndex(value);
			setAnimation(openingAnimation(rigs[value]));
		},
		[rigs]
	);
	// FilterChip hands back its value, so one stable handler serves every chip instead of a new arrow per chip per render.
	const handleChipToggle = useCallback((value?: string | number) => setAnimation(String(value)), []);
	// Walks the same tab list the pills render, so clicking the stage and clicking a pill agree on what comes next.
	const handleStageClick = useCallback(() => {
		const next = nextAnimationValue(tabs, animation);
		if (next) {
			setAnimation(next);
		}
	}, [tabs, animation]);

	// Same idea as `handleChipToggle`, for the Live2D motion pills.
	const handleLive2dChipToggle = useCallback((value?: string | number) => {
		const next = String(value);
		stageRef.current?.playMotion(next);
		setLive2dMotion(next);
	}, []);
	const handleLive2dStageClick = useCallback(() => {
		const stage = stageRef.current;
		if (!stage) {
			return;
		}
		const next = nextAnimationValue(live2dTabs, live2dMotion);
		if (next) {
			stage.playMotion(next);
			setLive2dMotion(next);
		}
	}, [live2dTabs, live2dMotion]);

	// Mounts the Live2D stage while it is selected, and destroys it on every exit: leaving Live2D for a rig, changing HOC, or
	// leaving the page. Mirrors `fairy_live2d.tsx`'s own load effect, but the canvas is measured once at mount rather than
	// tracked with `useZoomPan`'s container, since this card has no zoom or pan of its own.
	useEffect(() => {
		if (!live2dActive) {
			return;
		}
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		let active = true;
		setLive2dStatus("loading");
		setLive2dMotion("");

		const rect = canvas.getBoundingClientRect();
		const resolution = window.devicePixelRatio || 1;
		canvas.width = Math.max(1, Math.round(rect.width * resolution));
		canvas.height = Math.max(1, Math.round(rect.height * resolution));

		createLive2dStage(canvas, hocLive2dModelUrl(hocId))
			.then((stage) => {
				if (!active) {
					stage.destroy();
					return;
				}
				stageRef.current = stage;
				setLive2dStatus("ready");
			})
			.catch((error: unknown) => {
				console.error("Live2D model load failed:", error);
				if (active) {
					setLive2dStatus("error");
				}
			});

		return () => {
			active = false;
			stageRef.current?.destroy();
			stageRef.current = null;
		};
	}, [live2dActive, hocId]);

	// Sets the pill selection once the stage is up and the index's motion tabs have arrived, without overwriting a motion
	// the reader already chose.
	useEffect(() => {
		if (live2dStatus === "ready") {
			setLive2dMotion((current) => (current === "" ? (live2dTabs.find((tab) => tab.value === IDLE_TAB_VALUE)?.value ?? live2dTabs[0]?.value ?? "") : current));
		}
	}, [live2dStatus, live2dTabs]);

	// Depends on the handlers above, unlike `activeTabs`/`activeValue`, so it stays here rather than with the rest of
	// the derived state near the top.
	const activeToggle = live2dActive ? handleLive2dChipToggle : handleChipToggle;

	return (
		<>
			<ToggleButtonGroup size="small" value={live2dActive ? "live2d" : rigIndex} exclusive onChange={handleModeChange} sx={styles.rigToggle} aria-label="Rig">
				{rigs.map((_rig, index) => (
					<ToggleButton key={index} value={index}>
						{index === 0 ? "Battle" : `Crew ${index}`}
					</ToggleButton>
				))}
				{hasLive2d ? <ToggleButton value="live2d">Live2D</ToggleButton> : null}
			</ToggleButtonGroup>

			<Box component="ul" sx={styles.pillList} aria-label="Animations">
				{activeTabs.map((tab) => (
					<li key={tab.value}>
						<FilterChip label={tab.label} selected={tab.value === activeValue} value={tab.value} onToggle={activeToggle} />
					</li>
				))}
			</Box>

			<Card sx={styles.cardForAnimation}>
				{live2dActive ? (
					<div onClick={handleLive2dStageClick} style={LIVE2D_STAGE_STYLE}>
						<canvas ref={canvasRef} style={LIVE2D_CANVAS_STYLE} />
						{live2dStatus !== "ready" ? <span style={LIVE2D_STATUS_STYLE}>{live2dStatus === "loading" ? "Loading model..." : "Model unavailable"}</span> : null}
					</div>
				) : (
					// Keyed by rig so switching rigs mounts a fresh player rather than swapping a skeleton under a live one.
					<div onClick={handleStageClick} style={STAGE_STYLE}>
						<SpineAnimation
							key={rigIndex}
							skelUrl={hocSpineUrl(hocId, rig.skel, "skel")}
							atlasUrl={hocSpineUrl(hocId, rig.atlas, "atlas")}
							imageBase={hocSpineImageBase(hocId)}
							animation={animation}
							maxSize={340}
						/>
					</div>
				)}
			</Card>
		</>
	);
}
