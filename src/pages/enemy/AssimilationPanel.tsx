import { memo, useMemo } from "react";

// MaterialUI imports
import { Box, Chip, Divider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { AssimilationChip, AssimilationData, AssimilationSkill, AssimilationStatKey, AssimilationUnit } from "../../types/enemy";

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

/**
 * Fill a skill's `#N` placeholders with its values at the top skill level.
 *
 * Counts down rather than up, so replacing `#1` cannot eat the `#1` inside a `#10`.
 *
 * @param skill The skill.
 * @returns The description with every placeholder replaced.
 */
function describeSkill(skill: AssimilationSkill): string {
	let text = skill.description;
	for (let index = skill.number_of_stats; index >= 1; index--) {
		const values = skill[`stat${index}`];
		const top = values?.[values.length - 1];
		text = text.replace(`#${index}`, top === undefined ? "" : String(top));
	}
	return text;
}

const styles = {
	header: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 1.5 },
	lore: { mb: 2 },
	subHeading: { mt: 2.5, mb: 1 },
	row: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.6, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	chips: { display: "flex", flexWrap: "wrap", gap: 0.75 },
	slot: { mb: 1.25 },
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
export default memo(function AssimilationPanel({ unit, data }: AssimilationPanelProps) {
	const unitClass = data.constants.classes[unit.className];

	// Each slot accepts a set of chip types. Every Ringleader currently takes the same types in all three, so an identical set is
	// listed once rather than repeated per slot, while a unit with differing slots would still get one list each.
	const chipsBySlot = useMemo((): AssimilationChip[][] => unit.chipSlots.map((types) => data.chips.filter((chip) => types.includes(chip.type))), [unit.chipSlots, data.chips]);
	const slotsAlike = chipsBySlot.length > 1 && chipsBySlot.every((chips) => chips.length === chipsBySlot[0]?.length && chips.every((chip, index) => chip === chipsBySlot[0]?.[index]));

	return (
		<Box>
			<Box sx={styles.header}>
				<Chip label={unit.className} color="secondary" size="small" />
				<Chip label={`${unit.stars}★`} size="small" variant="outlined" />
				{unit.traits.map((trait) => (
					<Chip key={trait} label={trait} size="small" variant="outlined" />
				))}
			</Box>

			{unit.introduce !== "" && (
				<Typography variant="body2" color="text.secondary" sx={styles.lore}>
					{unit.introduce}
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

			{chipsBySlot.length > 0 && (
				<>
					<Divider sx={styles.subHeading} />
					<Typography variant="subtitle2" component="h3" sx={styles.subHeading}>
						Strategic chips
					</Typography>
					{slotsAlike ? (
						<Box sx={styles.slot}>
							<Typography variant="caption" color="text.secondary" sx={styles.slotLabel}>
								Equips {chipsBySlot.length}, each chosen from any of these
							</Typography>
							<Box sx={styles.chips}>
								{chipsBySlot[0]?.map((chip) => (
									<Chip key={chip.id} label={chip.name} size="small" variant="outlined" title={chip.description} />
								))}
							</Box>
						</Box>
					) : (
						chipsBySlot.map((chips, index) => (
							<Box key={index} sx={styles.slot}>
								<Typography variant="caption" color="text.secondary" sx={styles.slotLabel}>
									Slot {index + 1}
								</Typography>
								<Box sx={styles.chips}>
									{chips.map((chip) => (
										<Chip key={chip.id} label={chip.name} size="small" variant="outlined" title={chip.description} />
									))}
								</Box>
							</Box>
						))
					)}
				</>
			)}

			{unit.skills.length > 0 && (
				<>
					<Divider sx={styles.subHeading} />
					<Typography variant="subtitle2" component="h3" sx={styles.subHeading}>
						Skills
					</Typography>
					{unit.skills.map((skill) => (
						<Box key={skill.slot} sx={styles.skill}>
							<Typography variant="body2" sx={styles.skillName}>
								{skill.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{describeSkill(skill)}
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
