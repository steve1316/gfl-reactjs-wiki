import { memo, useCallback, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, Fab, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { FAB_EXPAND_SX } from "../../lib/artLayout";
import { skinLive2dModelUrl, spineImageBase, spineUrl } from "../../lib/assets";
import { LIVE2D_CANVAS_STYLE, LIVE2D_STAGE_STYLE, LIVE2D_STATUS_STYLE, STAGE_STYLE } from "../../lib/live2dStageStyles";
import type { AnimationTab } from "../../lib/spine";
import { motionTabs, resolveSkinLive2dVariant, useSkinLive2dMotions } from "../../lib/useLive2dMotions";
import { useLive2dStage } from "../../lib/useLive2dStage";
import type { SpineRig } from "../../types/spine";

/** Which animation source is on screen: the battle rig, the dorm rig, or the skin's Live2D model. */
export type ChibiMode = "battle" | "dorm" | "live2d";

const styles = {
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
		// Anchors the Live2D expand Fab, which is clipped by the overflow: hidden below otherwise.
		position: "relative",
		// The card is the ancestor SpineAnimation's ResizeObserver measures, so clipping happens here
		// rather than on SpineAnimation's own wrapper, which resolves to zero width and would hide it.
		overflow: "hidden",
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: `linear-gradient(45deg, ${theme.palette.stripe.dark} 12.50%, ${theme.palette.stripe.light} 12.50%, ${theme.palette.stripe.light} 50%, ${theme.palette.stripe.dark} 50%, ${theme.palette.stripe.dark} 62.50%, ${theme.palette.stripe.light} 62.50%, ${theme.palette.stripe.light} 100%)`,
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer"
	}),
	// Shared by the Battle/Dorm/Live2D row and the Live2D Normal/Damaged row, matching the full-width toggle
	// `HocAnimationsPanel` uses for its own rig picker.
	toggleRow: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": { flex: 1 }
	},
	dialogueLine: {
		mt: 1,
		fontStyle: "italic",
		color: "text.secondary"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for ChibiPanel. */
interface ChibiPanelProps {
	/** Which animation source is on screen: the battle rig, the dorm rig, or the skin's Live2D model. */
	mode: ChibiMode;
	/** Called with the tapped toggle's value when the reader switches between Battle, Dorm and Live2D. */
	onSelectMode: (mode: ChibiMode) => void;
	/** The animation name currently playing, resolved to one the skeleton actually defines. */
	spineAnimationName: string;
	/** Tabs to render for the current skeleton's animations. */
	spineTabs: AnimationTab[];
	/** Called with the tab's animation name when a Spine animation tab is clicked. */
	onSwitchAnimations: (value: string) => void;
	/** The Spine rig to play, or undefined when this doll has no published Spine data. */
	spineRig: SpineRig | undefined;
	/** The doll's base id, used to build the Spine and Live2D asset URLs. */
	normalId: number;
	/** Called when the Spine stage is clicked, advancing to the next animation. */
	onPlayerSwitchAnimations: () => void;
	/** `mod` when the Mod form is on screen, else `base`. Selects which Live2D model to load. */
	live2dForm: string;
	/** `base` for the form's own art, or the skin id as a string. Selects which Live2D model to load. */
	live2dSkinKey: string;
	/** The variants this exact form/skin actually has, such as `["normal"]` or `["normal", "damaged"]`. Empty when it has none. */
	live2dVariants: string[];
	/** Whether the current form/skin combination has a published Live2D model, so the Live2D toggle option can be offered. */
	hasLive2d: boolean;
}

/**
 * The doll's chibi animations: a Battle/Dorm/Live2D toggle, the animation pill row, and the Spine or Live2D player.
 *
 * @param props Component props.
 * @returns The mode toggle, pill row and player.
 */
export default memo(function ChibiPanel({
	mode,
	onSelectMode,
	spineAnimationName,
	spineTabs,
	onSwitchAnimations,
	spineRig,
	normalId,
	onPlayerSwitchAnimations,
	live2dForm,
	live2dSkinKey,
	live2dVariants,
	hasLive2d
}: ChibiPanelProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	// The reader's raw Normal/Damaged pick, independent of the page's own damaged-art toggle, since a reader previewing a Live2D pose
	// is not necessarily asking to also flip the portrait and hero art. Null until they pick, so the default below applies.
	const [variantPreference, setVariantPreference] = useState<string | null>(null);

	// Derived in render from the variants this exact form/skin actually has, rather than reset by an effect after the fact - an effect
	// runs after render, so the first render following a skin change would otherwise still compute live2dModelUrl below with the old
	// variant, mounting a model that does not exist for the new skin before the effect corrects it on the next render.
	const variant = resolveSkinLive2dVariant(live2dVariants, variantPreference);
	const hasBothVariants = live2dVariants.length > 1;

	// Gated on the mode being "live2d", not on hasLive2d, since each doll's motions are their own network request now that they
	// live in a per-doll file rather than the shared index - fetching them the moment a skin with a model is merely on screen would
	// mean every visit to such a doll's page downloads motions the reader may never open the Live2D toggle to see. The tradeoff is
	// a brief loading state the first time the toggle is opened, rather than both variants already being ready.
	const motionId = mode === "live2d" ? normalId : undefined;
	const normalMotions = useSkinLive2dMotions(motionId, live2dForm, live2dSkinKey, "normal");
	const damagedMotions = useSkinLive2dMotions(motionId, live2dForm, live2dSkinKey, "damaged");
	const motions = variant === "damaged" ? damagedMotions : normalMotions;
	const live2dTabs = useMemo(() => motionTabs(motions ?? []), [motions]);

	// Undefined outside Live2D mode, so the shared hook tears the stage down the moment a Spine rig is picked instead.
	const live2dModelUrl = mode === "live2d" ? skinLive2dModelUrl(normalId, live2dForm, live2dSkinKey, variant) : undefined;
	const live2dStage = useLive2dStage(canvasRef, live2dModelUrl, live2dTabs);

	// The motion actually driving the stage right now, found by its model3Group so its dialogue line can be shown.
	// Read with ?? rather than a strict null check, since fairy and HOC motions omit `line` entirely, not just null it.
	const activeMotion = motions?.find((entry) => entry.model3Group === live2dStage.motion);
	const dialogueLine = activeMotion?.line ?? null;

	// Opens the full-page viewer on the exact combination this card is showing right now.
	const live2dViewerLink = `/tdoll/${normalId}/live2d?form=${live2dForm}&skin=${live2dSkinKey}&variant=${variant}`;

	const handleModeChange = useCallback(
		(_event: MouseEvent<HTMLElement>, value: ChibiMode | null) => {
			// Clicking the selected button hands back null, which would leave no mode chosen.
			if (value === null) {
				return;
			}
			onSelectMode(value);
		},
		[onSelectMode]
	);

	const handleVariantChange = useCallback((_event: MouseEvent<HTMLElement>, value: "normal" | "damaged" | null) => {
		if (value === null) {
			return;
		}
		setVariantPreference(value);
	}, []);

	// FilterChip hands back its value, so one stable handler serves every chip instead of a new arrow per chip per render.
	const handleChipToggle = useCallback((value?: string | number) => onSwitchAnimations(String(value)), [onSwitchAnimations]);
	const handleLive2dChipToggle = useCallback((value?: string | number) => live2dStage.playMotion(String(value)), [live2dStage.playMotion]);
	const handleLive2dStageClick = useCallback(() => live2dStage.advance(), [live2dStage.advance]);

	return (
		<>
			<ToggleButtonGroup size="small" value={mode} exclusive onChange={handleModeChange} sx={styles.toggleRow} aria-label="Animation mode">
				<ToggleButton value="battle">Battle</ToggleButton>
				<ToggleButton value="dorm">Dorm</ToggleButton>
				{hasLive2d ? <ToggleButton value="live2d">Live2D</ToggleButton> : null}
			</ToggleButtonGroup>

			{mode !== "live2d" ? (
				<Box component="ul" sx={styles.pillList} aria-label="Animations">
					{spineTabs.map((tab) => (
						<li key={tab.value}>
							<FilterChip label={tab.label} selected={tab.value === spineAnimationName} value={tab.value} onToggle={handleChipToggle} />
						</li>
					))}
				</Box>
			) : null}

			<Card sx={styles.cardForAnimation}>
				{mode === "live2d" ? (
					<>
						<div onClick={handleLive2dStageClick} style={LIVE2D_STAGE_STYLE}>
							{/* Keyed by model so a skin, form or variant change mounts a fresh canvas rather than reusing an old WebGL context. */}
							<canvas key={live2dModelUrl} ref={canvasRef} style={LIVE2D_CANVAS_STYLE} />
							{live2dStage.status !== "ready" ? <span style={LIVE2D_STATUS_STYLE}>{live2dStage.status === "loading" ? "Loading model..." : "Model unavailable"}</span> : null}
						</div>

						<Fab color="primary" component={Link} to={live2dViewerLink} sx={FAB_EXPAND_SX} aria-label="view full-page Live2D model">
							<ZoomOutMapIcon />
						</Fab>
					</>
				) : (
					spineRig && (
						<div onClick={onPlayerSwitchAnimations} style={STAGE_STYLE}>
							<SpineAnimation
								skelUrl={spineUrl(normalId, spineRig.skel, "skel")}
								atlasUrl={spineUrl(normalId, spineRig.atlas, "atlas")}
								imageBase={spineImageBase(normalId, spineRig.atlas)}
								animation={spineAnimationName}
								maxSize={340}
							/>
						</div>
					)
				)}
			</Card>

			{mode === "live2d" ? (
				<>
					{hasBothVariants ? (
						<ToggleButtonGroup size="small" value={variant} exclusive onChange={handleVariantChange} sx={styles.toggleRow} aria-label="Live2D variant">
							<ToggleButton value="normal">Normal</ToggleButton>
							<ToggleButton value="damaged">Damaged</ToggleButton>
						</ToggleButtonGroup>
					) : null}

					<Box component="ul" sx={styles.pillList} aria-label="Motions">
						{live2dTabs.map((tab) => (
							<li key={tab.value}>
								<FilterChip label={tab.label} selected={tab.value === live2dStage.motion} value={tab.value} onToggle={handleLive2dChipToggle} />
							</li>
						))}
					</Box>

					{dialogueLine ? (
						<Typography variant="body2" sx={styles.dialogueLine}>
							{dialogueLine}
						</Typography>
					) : null}
				</>
			) : null}
		</>
	);
});
