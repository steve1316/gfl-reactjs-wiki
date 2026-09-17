import { memo, useMemo } from "react";

// MaterialUI imports
import { Box, Chip, Divider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { describeSkill } from "../../lib/skillText";
import type { AssimilationChip, AssimilationData, AssimilationStatKey, AssimilationUnit } from "../../types/enemy";

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
	header: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 1.5 },
	lore: { mb: 2 },
	subHeading: { mt: 2.5, mb: 1 },
	row: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.6, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	chips: { display: "flex", flexWrap: "wrap", gap: 0.75 },
	slotLabel: { mb: 0.5, display: "block" },
	skill: { mb: 1.75, "&:last-of-type": { mb: 0 } },
	skillName: { fontWeight: 700 },
	note: { mt: 2, display: "block" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for AssimilationPanel. */
interface AssimilationPanelProps {
	/** The playable unit captured from this enemy. */
	unit: AssimilationUnit;
	/** The shared classes, constants and chips. */
	data: AssimilationData;
	/** The unit's own lore, or an empty string when it just repeats what the hero already shows. */
	lore: string;
}

/**
 * What one captured enemy is like to field: its class, traits, growth percentages, strategic chip slots and skills.
 *
 * No stat line is shown. A unit's displayed stats depend on its level, star rank, size and affection together, and that
 * combination has not been checked against a reliable source, so the panel shows the game's own inputs instead of a number
 * that might be wrong.
 *
 * @param props Component props.
 * @returns The Protocol Assimilation panel.
 */
export default memo(function AssimilationPanel({ unit, data, lore }: AssimilationPanelProps) {
	const unitClass = data.constants.classes[unit.className];
	// The class says how many levels each slot has, and the panel quotes every skill at its top level. Zeros mark slots the class
	// does not have, so they are dropped to line the levels up with the skills the unit actually shipped with.
	const skillLevels = (unitClass?.skillLevels ?? []).filter((level) => level > 0);

	// Every slot takes the same chip types, so the chips are listed once rather than repeated per slot.
	const slotChips = useMemo((): AssimilationChip[] => data.chips.filter((chip) => unit.chipSlots.some((types) => types.includes(chip.type))), [unit.chipSlots, data.chips]);

	return (
		<Box>
			<Box sx={styles.header}>
				<Chip label={unit.className} color="secondary" size="small" />
				<Chip label={`${unit.stars}★`} size="small" variant="outlined" />
				{unit.traits.map((trait) => (
					<Chip key={trait} label={trait} size="small" variant="outlined" />
				))}
			</Box>

			{lore !== "" && (
				<Typography variant="body2" color="text.secondary" sx={styles.lore}>
					{lore}
				</Typography>
			)}

			{unitClass !== undefined && (
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

			<Typography variant="subtitle2" component="h3" sx={styles.subHeading}>
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

			{slotChips.length > 0 && (
				<>
					<Divider sx={styles.subHeading} />
					<Typography variant="subtitle2" component="h3" sx={styles.subHeading}>
						Strategic chips
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={styles.slotLabel}>
						Equips {unit.chipSlots.length}, each chosen from any of these
					</Typography>
					<Box sx={styles.chips}>
						{slotChips.map((chip) => (
							<Chip key={chip.id} label={chip.name} size="small" variant="outlined" title={chip.description} />
						))}
					</Box>
				</>
			)}

			{unit.skills.length > 0 && (
				<>
					<Divider sx={styles.subHeading} />
					<Typography variant="subtitle2" component="h3" sx={styles.subHeading}>
						Skills
					</Typography>
					{unit.skills.map((skill, index) => (
						<Box key={skill.slot} sx={styles.skill}>
							<Typography variant="body2" sx={styles.skillName}>
								{skill.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{describeSkill(skill, skillLevels[index] ?? 0)}
							</Typography>
						</Box>
					))}
					<Typography variant="caption" color="text.secondary" sx={styles.note}>
						Skill values are shown at the highest level each skill reaches.
					</Typography>
				</>
			)}
		</Box>
	);
});
