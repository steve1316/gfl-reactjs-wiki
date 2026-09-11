// MaterialUI imports
import { Card, Fab, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import SpineAnimation from "../../components/SpineAnimation";
import { spineImageBase, spineUrl, uiUrl } from "../../lib/assets";
import type { AnimationTab } from "../../lib/spine";
import type { SpineRig } from "../../types/spine";

const dorm_button = uiUrl("dorm_button.png");
const combat_button = uiUrl("combat_button.png");

const styles = {
	tabs: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}),
	cardForCombatAnimations: (theme: Theme) => ({
		display: "flex",
		justifyContent: "center",
		width: "100%",
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: `linear-gradient(45deg, ${theme.palette.stripe.dark} 12.50%, ${theme.palette.stripe.light} 12.50%, ${theme.palette.stripe.light} 50%, ${theme.palette.stripe.dark} 50%, ${theme.palette.stripe.dark} 62.50%, ${theme.palette.stripe.light} 62.50%, ${theme.palette.stripe.light} 100%)`,
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer"
	}),
	cardForDormAnimations: (theme: Theme) => ({
		display: "flex",
		justifyContent: "center",
		width: "100%",
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: `linear-gradient(45deg, ${theme.palette.stripe.dark} 12.50%, ${theme.palette.stripe.light} 12.50%, ${theme.palette.stripe.light} 50%, ${theme.palette.stripe.dark} 50%, ${theme.palette.stripe.dark} 62.50%, ${theme.palette.stripe.light} 62.50%, ${theme.palette.stripe.light} 100%)`,
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer"
	}),
	fab_dorm: {
		display: "block",
		transform: "translate(5px, 100px)",
		height: 40,
		width: 40,
		opacity: "85%",
		zIndex: 100
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for ChibiPanel. */
interface ChibiPanelProps {
	/** 0 for combat animations, 1 for dorm animations. */
	animationMode: number;
	/** Whether a skin is currently selected. */
	showSkin: boolean;
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
	/** Fallback animation GIF URL, used only when no Spine rig is available. */
	animation: string | undefined;
	/** Called when the animation area is clicked, advancing to the next animation. */
	onPlayerSwitchAnimations: () => void;
}

/**
 * The doll's chibi animation: the combat/dorm toggle, the animation tab strip and the Spine or GIF player.
 *
 * @param props Component props.
 * @returns The animation toggle, tabs and player.
 */
export default function ChibiPanel({
	animationMode,
	showSkin,
	spineAnimationName,
	spineTabs,
	onSwitchAnimations,
	onSwitchAnimationMode,
	spineRig,
	normalId,
	animation,
	onPlayerSwitchAnimations
}: ChibiPanelProps) {
	// Render tabs for animation selection based on Normal or Dorm animation mode active.
	const renderAnimationTabs = () => {
		if (animationMode === 0) {
			if (showSkin) {
				// Skin animations for Combat.
				return (
					<Tabs
						sx={styles.tabs}
						value={spineAnimationName}
						onChange={(_e, value) => onSwitchAnimations(value)}
						indicatorColor="primary"
						textColor="primary"
						scrollButtons
						variant="scrollable"
						allowScrollButtonsMobile
					>
						{spineTabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
					</Tabs>
				);
			} else {
				// Normal Animations for Combat.
				return (
					<Tabs
						sx={styles.tabs}
						value={spineAnimationName}
						onChange={(_e, value) => onSwitchAnimations(value)}
						indicatorColor="primary"
						textColor="primary"
						scrollButtons
						variant="scrollable"
						allowScrollButtonsMobile
					>
						{spineTabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
					</Tabs>
				);
			}
		} else {
			// Animations for Dorm.
			return (
				<Tabs
					sx={styles.tabs}
					value={spineAnimationName}
					onChange={(_e, value) => onSwitchAnimations(value)}
					indicatorColor="primary"
					textColor="primary"
					scrollButtons
					variant="scrollable"
					allowScrollButtonsMobile
				>
					{spineTabs.map((tab) => (
						<Tab key={tab.value} label={tab.label} value={tab.value} />
					))}
				</Tabs>
			);
		}
	};

	return (
		<>
			{/************** T-Doll's animations **************/}
			<Fab color="primary" sx={styles.fab_dorm} onClick={onSwitchAnimationMode}>
				{animationMode === 0 ? (
					<img src={combat_button} alt="Switch to Dorm Animations" style={{ height: 32, width: 32, paddingTop: 3 }} />
				) : (
					<img src={dorm_button} alt="Switch to Normal Animations" style={{ height: 29, width: 29, paddingTop: 3 }} />
				)}
			</Fab>

			{renderAnimationTabs()}

			{animationMode === 0 ? (
				<Card sx={styles.cardForCombatAnimations}>
					{spineRig ? (
						<div onClick={() => onPlayerSwitchAnimations()} style={{ cursor: "pointer" }}>
							<SpineAnimation
								skelUrl={spineUrl(normalId, spineRig.skel, "skel")}
								atlasUrl={spineUrl(normalId, spineRig.atlas, "atlas")}
								imageBase={spineImageBase(normalId, spineRig.atlas)}
								animation={spineAnimationName}
							/>
						</div>
					) : (
						<img src={animation} alt="T-Doll animation" style={{ height: 250, width: 250, zIndex: 0 }} onClick={() => onPlayerSwitchAnimations()} />
					)}
				</Card>
			) : (
				<Card sx={styles.cardForDormAnimations}>
					{spineRig ? (
						<div onClick={() => onPlayerSwitchAnimations()} style={{ cursor: "pointer" }}>
							<SpineAnimation
								skelUrl={spineUrl(normalId, spineRig.skel, "skel")}
								atlasUrl={spineUrl(normalId, spineRig.atlas, "atlas")}
								imageBase={spineImageBase(normalId, spineRig.atlas)}
								animation={spineAnimationName}
							/>
						</div>
					) : (
						<img src={animation} alt="T-Doll animation" style={{ height: 250, width: 250, zIndex: 0 }} onClick={() => onPlayerSwitchAnimations()} />
					)}
				</Card>
			)}
		</>
	);
}
