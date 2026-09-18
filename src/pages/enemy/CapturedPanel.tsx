import { memo } from "react";

// MaterialUI imports
import { Box, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { AssimilationData, AssimilationStatKey, AssimilationUnit } from "../../types/enemy";

/** The growth percentages in display order. */
const RATIO_KEYS: readonly AssimilationStatKey[] = ["hp", "damage", "accuracy", "evasion", "rateOfFire", "armor"];

/** Each growth percentage's name as the game shows it. */
const RATIO_LABELS: Record<AssimilationStatKey, string> = {
	hp: "HP",
	damage: "Damage",
	accuracy: "Accuracy",
	evasion: "Evasion",
	rateOfFire: "Rate of Fire",
	armor: "Armor"
};

const styles = {
	badges: { display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 },
	row: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.6, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	heading: { mt: 2, mb: 0.5, display: "block" },
	note: { mt: 2, display: "block" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for CapturedPanel. */
interface CapturedPanelProps {
	/** The playable unit captured from this enemy. */
	unit: AssimilationUnit;
	/** The shared classes and constants. */
	data: AssimilationData;
}

/**
 * What a captured enemy is worth fielding: its class, traits, capture odds and growth percentages.
 *
 * This fills the slot the archive's rank bars hold for an ordinary enemy, since a captured unit has no rank bars of its own. No stat
 * line is shown: a unit's displayed stats depend on level, star rank, size and affection together, and that combination has not been
 * checked against a reliable source.
 *
 * @param props Component props.
 * @returns The captured unit's standing.
 */
export default memo(function CapturedPanel({ unit, data }: CapturedPanelProps) {
	const unitClass = data.constants.classes[unit.className];

	return (
		<Box>
			<Box sx={styles.badges}>
				<Chip label={unit.className} color="secondary" size="small" />
				<Chip label={`${unit.stars}★`} size="small" variant="outlined" />
				{unit.traits.map((trait) => (
					<Chip key={trait} label={trait} size="small" variant="outlined" />
				))}
			</Box>

			{unitClass === undefined ? null : (
				<>
					<Box sx={styles.row}>
						<Typography variant="body2" color="text.secondary">
							Capture chance
						</Typography>
						<Typography variant="body2">{unitClass.captureRate}%</Typography>
					</Box>
					<Box sx={styles.row}>
						<Typography variant="body2" color="text.secondary">
							With an Aid Commission
						</Typography>
						<Typography variant="body2">{unitClass.guaranteedRate}%</Typography>
					</Box>
				</>
			)}
			<Box sx={styles.row}>
				<Typography variant="body2" color="text.secondary">
					Planning cost
				</Typography>
				<Typography variant="body2">{unit.apCost}</Typography>
			</Box>
			<Box sx={styles.row}>
				<Typography variant="body2" color="text.secondary">
					Critical hit
				</Typography>
				<Typography variant="body2">
					{unit.crit}% for {unit.critDamage}% damage
				</Typography>
			</Box>
			<Box sx={styles.row}>
				<Typography variant="body2" color="text.secondary">
					Armor piercing
				</Typography>
				<Typography variant="body2">{unit.armorPiercing}</Typography>
			</Box>

			<Typography variant="subtitle2" component="h3" color="textSecondary" sx={styles.heading}>
				Growth
			</Typography>
			{RATIO_KEYS.map((key) => (
				<Box key={key} sx={styles.row}>
					<Typography variant="body2" color="text.secondary">
						{RATIO_LABELS[key]}
					</Typography>
					<Typography variant="body2">{unit.ratios[key]}%</Typography>
				</Box>
			))}
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				Each figure is this unit&apos;s share of its class&apos;s base rate. The stat a player sees also depends on level, star rank, size and affection, so no final numbers are shown here.
			</Typography>
		</Box>
	);
});
