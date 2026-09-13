import { memo, useCallback } from "react";

// MaterialUI imports
import { Box, Card, Fab } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { spineImageBase, spineUrl, uiUrl } from "../../lib/assets";
import type { AnimationTab } from "../../lib/spine";
import type { SpineRig } from "../../types/spine";

const dorm_button = uiUrl("dorm_button.png");
const combat_button = uiUrl("combat_button.png");

/** Style for the clickable stage wrapper. A module constant, since an inline object is a new prop on every render. */
const STAGE_STYLE = { cursor: "pointer" } as const;

const styles = {
	pillList: {
		flexGrow: 1,
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
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer"
	}),
	dormToggle: {
		flexShrink: 0,
		opacity: "85%"
	},
	// The toggle and the pills share one row. It used to sit on a line of its own above them, which cost
	// 48px of height for a single 40px button in a column that has to fit beside three others.
	controlRow: {
		display: "flex",
		alignItems: "flex-start",
		gap: 1,
		mb: 1
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for ChibiPanel. */
interface ChibiPanelProps {
	/** 0 for combat animations, 1 for dorm animations. */
	animationMode: number;
	/** The animation name currently playing, resolved to one the skeleton actually defines. */
	spineAnimationName: string;
	/** Tabs to render for the current skeleton's animations. */
	spineTabs: AnimationTab[];
	/** Called with the tab's animation name when an animation tab is clicked. */
	onSwitchAnimations: (value: string) => void;
	/** Called when the combat/dorm toggle button is clicked. */
	onSwitchAnimationMode: () => void;
	/** The Spine rig to play, or undefined when this doll has no published Spine data. */
	spineRig: SpineRig | undefined;
	/** The doll's base id, used to build the Spine asset URLs. */
	normalId: number;
	/** Called when the animation area is clicked, advancing to the next animation. */
	onPlayerSwitchAnimations: () => void;
}

/**
 * The doll's chibi animation: the combat/dorm toggle, the animation pill row and the Spine or GIF player.
 *
 * @param props Component props.
 * @returns The animation toggle, pill row and player.
 */
export default memo(function ChibiPanel({ animationMode, spineAnimationName, spineTabs, onSwitchAnimations, onSwitchAnimationMode, spineRig, normalId, onPlayerSwitchAnimations }: ChibiPanelProps) {
	// FilterChip hands back its value, so one stable handler serves every chip instead of a new arrow per chip per render.
	const handleChipToggle = useCallback((value?: string | number) => onSwitchAnimations(String(value)), [onSwitchAnimations]);

	return (
		<>
			{/* T-Doll's animations: the combat/dorm toggle leads the row its pills wrap within */}
			<Box sx={styles.controlRow}>
				<Fab color="primary" size="small" sx={styles.dormToggle} onClick={onSwitchAnimationMode} aria-label={animationMode === 0 ? "Switch to Dorm Animations" : "Switch to Normal Animations"}>
					{animationMode === 0 ? (
						<img src={combat_button} alt="" style={{ height: 32, width: 32, paddingTop: 3 }} />
					) : (
						<img src={dorm_button} alt="" style={{ height: 29, width: 29, paddingTop: 3 }} />
					)}
				</Fab>

				<Box component="ul" sx={styles.pillList} aria-label="Animations">
					{spineTabs.map((tab) => (
						<li key={tab.value}>
							<FilterChip label={tab.label} selected={tab.value === spineAnimationName} value={tab.value} onToggle={handleChipToggle} />
						</li>
					))}
				</Box>
			</Box>

			<Card sx={styles.cardForAnimation}>
				{spineRig && (
					<div onClick={onPlayerSwitchAnimations} style={STAGE_STYLE}>
						<SpineAnimation
							skelUrl={spineUrl(normalId, spineRig.skel, "skel")}
							atlasUrl={spineUrl(normalId, spineRig.atlas, "atlas")}
							imageBase={spineImageBase(normalId, spineRig.atlas)}
							animation={spineAnimationName}
							maxSize={340}
						/>
					</div>
				)}
			</Card>
		</>
	);
});
