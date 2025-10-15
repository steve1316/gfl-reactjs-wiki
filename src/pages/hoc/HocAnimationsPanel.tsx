import { useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, Card, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { hocLive2dModelUrl, hocSpineImageBase, hocSpineUrl } from "../../lib/assets";
import { hasHocLive2d } from "../../lib/processData";
import { animationTabs, nextAnimationValue } from "../../lib/spine";
import { motionTabs, useHocLive2dMotions } from "../../lib/useLive2dMotions";
import { useLive2dStage } from "../../lib/useLive2dStage";
import type { HocSpineEntry, SpineRig } from "../../types/spine";

/** The animation a rig opens on, when it defines one. */
const DEFAULT_ANIMATION = "wait";

/** Shows the stage is clickable. A module constant, so the wrapper is not handed a new style object each render. */
const STAGE_STYLE = { cursor: "pointer" } as const;

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

	const rig = rigs[rigIndex] ?? entry.combat;
	const tabs = useMemo(() => animationTabs(rig.anims), [rig]);

	const hasLive2d = hasHocLive2d(hocId);
	const motions = useHocLive2dMotions(hasLive2d ? hocId : undefined);
	const live2dTabs = useMemo(() => motionTabs(motions ?? []), [motions]);
	// Undefined outside Live2D mode, so the shared hook tears the stage down the moment a Spine rig is picked instead.
	const live2dModelUrl = live2dActive ? hocLive2dModelUrl(hocId) : undefined;
	const live2dStage = useLive2dStage(canvasRef, live2dModelUrl, live2dTabs);

	// Derived from state declared above, not from the handlers below, so these sit with the rest of the component's
	// derived state rather than just above the JSX that reads them.
	const activeTabs = live2dActive ? live2dTabs : tabs;
	const activeValue = live2dActive ? live2dStage.motion : animation;

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
	const handleLive2dChipToggle = useCallback((value?: string | number) => live2dStage.playMotion(String(value)), [live2dStage.playMotion]);
	const handleLive2dStageClick = useCallback(() => live2dStage.advance(), [live2dStage.advance]);

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
						{/* Keyed by model so a HOC id change (should one ever occur without unmounting this panel) mounts a fresh canvas rather than reusing an old WebGL context. */}
						<canvas key={live2dModelUrl} ref={canvasRef} style={LIVE2D_CANVAS_STYLE} />
						{live2dStage.status !== "ready" ? <span style={LIVE2D_STATUS_STYLE}>{live2dStage.status === "loading" ? "Loading model..." : "Model unavailable"}</span> : null}
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
