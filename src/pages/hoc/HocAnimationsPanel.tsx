import { useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, Card, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { hocSpineImageBase, hocSpineUrl } from "../../lib/assets";
import { animationTabs, nextAnimationValue } from "../../lib/spine";
import type { HocSpineEntry, SpineRig } from "../../types/spine";

/** The animation a rig opens on, when it defines one. */
const DEFAULT_ANIMATION = "wait";

/** Shows the stage is clickable. A module constant, so the wrapper is not handed a new style object each render. */
const STAGE_STYLE = { cursor: "pointer" } as const;

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
	/** The HOC's id, used to build the Spine asset URLs. */
	hocId: number;
	/** The HOC's published rigs: the combat rig and its crew. */
	entry: HocSpineEntry;
}

/**
 * A HOC's chibi animations: a toggle between the battle rig and each crew rig, the animation pill row and the Spine player. Clicking the
 * player moves to the next animation, as on the T-Doll page.
 *
 * @param props Component props.
 * @returns The rig toggle, pill row and player.
 */
export default function HocAnimationsPanel({ hocId, entry }: HocAnimationsPanelProps) {
	const rigs = useMemo(() => [entry.combat, ...entry.crew], [entry]);
	const [rigIndex, setRigIndex] = useState(0);
	const [animation, setAnimation] = useState(() => openingAnimation(entry.combat));

	const rig = rigs[rigIndex] ?? entry.combat;
	const tabs = useMemo(() => animationTabs(rig.anims), [rig]);

	const handleRigChange = useCallback(
		(_event: MouseEvent<HTMLElement>, value: number | null) => {
			// Clicking the selected button hands back null, which would leave no rig chosen.
			if (value === null) {
				return;
			}
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

	return (
		<>
			<ToggleButtonGroup size="small" value={rigIndex} exclusive onChange={handleRigChange} sx={styles.rigToggle} aria-label="Rig">
				{rigs.map((_rig, index) => (
					<ToggleButton key={index} value={index}>
						{index === 0 ? "Battle" : `Crew ${index}`}
					</ToggleButton>
				))}
			</ToggleButtonGroup>

			<Box component="ul" sx={styles.pillList} aria-label="Animations">
				{tabs.map((tab) => (
					<li key={tab.value}>
						<FilterChip label={tab.label} selected={tab.value === animation} value={tab.value} onToggle={handleChipToggle} />
					</li>
				))}
			</Box>

			<Card sx={styles.cardForAnimation}>
				{/* Keyed by rig so switching rigs mounts a fresh player rather than swapping a skeleton under a live one. */}
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
			</Card>
		</>
	);
}
