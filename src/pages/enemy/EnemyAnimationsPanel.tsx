import { memo, useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, Card, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import SpineAnimation from "../../components/SpineAnimation";
import { enemySpineImageBase, enemySpineUrl } from "../../lib/assets";
import { STAGE_STYLE } from "../../lib/live2dStageStyles";
import { animationTabs, nextAnimationValue } from "../../lib/spine";
import type { SpineRig } from "../../types/spine";

/**
 * The dorm poses, which a captured unit plays in the dormitory and an enemy never plays at all.
 *
 * A doll keeps these in a second rig, so its page can offer Battle and Dorm as two sources. The 58 enemies that Protocol
 * Assimilation makes playable keep them inside the one combat rig instead, which is why the pill row mixed a wait and an attack
 * in with a unit lying down. Splitting them here gives those enemies the same two-way toggle a doll has and leaves everyone
 * else with the single pill row they had.
 */
const DORM_ANIMATIONS = new Set(["lying", "pick", "r_move", "r_wait", "sit"]);

/** The stage's own cap, matching the doll page so the two chibis are drawn at the same size. */
const MAX_STAGE_SIZE = 340;

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
		position: "relative",
		// The card is the ancestor SpineAnimation measures, so clipping happens here. Without it a zoomed-in chibi
		// panned straight out of the card and over the rest of the page.
		overflow: "hidden",
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: `linear-gradient(45deg, ${theme.palette.stripe.dark} 12.50%, ${theme.palette.stripe.light} 12.50%, ${theme.palette.stripe.light} 50%, ${theme.palette.stripe.dark} 50%, ${theme.palette.stripe.dark} 62.50%, ${theme.palette.stripe.light} 62.50%, ${theme.palette.stripe.light} 100%)`,
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer"
	}),
	// The same full-width toggle the doll's chibi panel uses for its own Battle/Dorm picker.
	toggleRow: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": { flex: 1 }
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyAnimationsPanel. */
interface EnemyAnimationsPanelProps {
	/** Enemy id, used to build the rig's URLs. */
	id: number;
	/** The enemy's rig. */
	rig: SpineRig;
}

/**
 * One enemy's chibi, with the doll page's own controls: a Battle/Dorm toggle when the rig has dorm poses, a pill per animation,
 * and a stage that advances to the next animation when clicked.
 *
 * @param props Component props.
 * @returns The mode toggle, pill row and player.
 */
export default memo(function EnemyAnimationsPanel({ id, rig }: EnemyAnimationsPanelProps) {
	const [dorm, setDorm] = useState(false);

	const tabs = useMemo(() => {
		const dormNames = rig.anims.filter((name) => DORM_ANIMATIONS.has(name));
		const battleNames = rig.anims.filter((name) => !DORM_ANIMATIONS.has(name));
		return { battle: animationTabs(battleNames), dorm: animationTabs(dormNames) };
	}, [rig.anims]);

	const shown = dorm ? tabs.dorm : tabs.battle;
	const [selected, setSelected] = useState(() => tabs.battle[0]?.value ?? "");
	// Resolved in render rather than corrected by an effect, so the first render after the toggle already asks the player for an
	// animation the new list holds instead of playing the old one for a frame.
	const animation = shown.some((tab) => tab.value === selected) ? selected : (shown[0]?.value ?? "");

	const handleModeChange = useCallback((_event: MouseEvent<HTMLElement>, value: "battle" | "dorm" | null) => {
		// Clicking the selected button hands back null, which would leave no mode chosen.
		if (value !== null) {
			setDorm(value === "dorm");
		}
	}, []);

	// FilterChip hands back its value, so one stable handler serves every chip instead of a new arrow per chip per render.
	const handleChipToggle = useCallback((value?: string | number) => setSelected(String(value)), []);
	const handleStageClick = useCallback(() => {
		const next = nextAnimationValue(shown, animation);
		if (next) {
			setSelected(next);
		}
	}, [shown, animation]);

	return (
		<>
			{tabs.dorm.length > 0 ? (
				<ToggleButtonGroup size="small" value={dorm ? "dorm" : "battle"} exclusive onChange={handleModeChange} sx={styles.toggleRow} aria-label="Animation mode">
					<ToggleButton value="battle">Battle</ToggleButton>
					<ToggleButton value="dorm">Dorm</ToggleButton>
				</ToggleButtonGroup>
			) : null}

			<Box component="ul" sx={styles.pillList} aria-label="Animations">
				{shown.map((tab) => (
					<li key={tab.value}>
						<FilterChip label={tab.label} selected={tab.value === animation} value={tab.value} onToggle={handleChipToggle} />
					</li>
				))}
			</Box>

			<Card sx={styles.cardForAnimation}>
				<div onClick={handleStageClick} style={STAGE_STYLE}>
					<SpineAnimation
						key={`${id}-${rig.skel}`}
						skelUrl={enemySpineUrl(id, rig.skel, "skel")}
						atlasUrl={enemySpineUrl(id, rig.atlas, "atlas")}
						imageBase={enemySpineImageBase(id)}
						animation={animation}
						maxSize={MAX_STAGE_SIZE}
					/>
				</div>
			</Card>
		</>
	);
});
