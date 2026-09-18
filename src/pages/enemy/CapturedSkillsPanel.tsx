import { memo, useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Avatar, Box, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SelectChangeEvent, SxProps, Theme } from "@mui/material";

import { assimilationSkillIconUrl } from "../../lib/assets";
import { hasAssimilationSkillIcon } from "../../lib/processData";
import { describeSkill } from "../../lib/skillText";
import type { AssimilationData, AssimilationSkill, AssimilationUnit } from "../../types/enemy";

/** Shifts the level drop-down to the right of its field, matching the doll page. A module constant, so the Select is not handed a new object each render. */
const LEVEL_MENU_PROPS = {
	anchorOrigin: { vertical: "top", horizontal: "right" },
	transformOrigin: { vertical: "top", horizontal: "left" }
} as const;

/**
 * The `sangvis` skill slots in the order the class table counts them.
 *
 * `constants.classes[...].skillLevels` has one entry per slot in this order, and a zero means the class does not have that slot at all.
 * The levels have to be read by slot rather than by position in the unit's own skill list: the Architect and five others have no
 * `skill2`, so counting along the list gave their `skill3` the ten levels that belong to `skill2` and asked a five-entry value array
 * for its tenth entry, which came back empty and left a blank where the number should be.
 */
const SLOT_ORDER = ["skill1", "skill2", "skill3", "skill_advance"] as const;

/** What each slot's toggle button reads. */
const SLOT_LABELS: Record<string, string> = {
	skill1: "Skill 1",
	skill2: "Skill 2",
	skill3: "Skill 3",
	skill_advance: "Advanced"
};

const styles = {
	slotToggle: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": { flex: 1 }
	},
	card: {
		width: "100%"
	},
	// The game's own icons are 100 or 128 square, so this only ever shrinks them.
	icon: {
		width: 40,
		height: 40
	},
	description: {
		fontSize: 14
	},
	cooldownText: {
		paddingTop: "12px"
	},
	value: {
		color: "secondary.main"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for CapturedSkillsPanel. */
interface CapturedSkillsPanelProps {
	/** The playable unit captured from this enemy. */
	unit: AssimilationUnit;
	/** The shared class table, which says how many levels each skill slot reaches. */
	data: AssimilationData;
}

/**
 * A captured unit's skills, one at a time, with the doll page's own controls.
 *
 * Laid out as the doll's skill card, down to the level drop-down and the highlighted values, since these skills carry the same
 * per-level value arrays a doll skill does. A unit has up to four slots against a doll's two, so the picker is one button per slot.
 *
 * @param props Component props.
 * @returns The slot picker and the selected skill's card.
 */
export default memo(function CapturedSkillsPanel({ unit, data }: CapturedSkillsPanelProps) {
	const [slot, setSlot] = useState(() => unit.skills[0]?.slot ?? "");
	const [level, setLevel] = useState<number | null>(null);

	// Each slot's top level, read by slot rather than by position. A class that does not have a slot records zero for it.
	const slotLevels = useMemo((): Record<string, number> => {
		const levels = data.constants.classes[unit.className]?.skillLevels ?? [];
		return Object.fromEntries(SLOT_ORDER.map((name, index) => [name, levels[index] ?? 0]));
	}, [data.constants.classes, unit.className]);

	// Resolved in render, so a unit whose slots differ from the last one shown falls back to its own first skill rather than
	// rendering nothing until an effect corrects the selection.
	const skill: AssimilationSkill | undefined = unit.skills.find((entry) => entry.slot === slot) ?? unit.skills[0];
	const maxLevel = skill === undefined ? 0 : slotLevels[skill.slot] || (skill.cooldown?.length ?? 0) || 1;
	// Opens at the top level, the way the panel used to quote every skill, and is clamped so switching to a shorter slot cannot
	// leave the drop-down on a level that slot does not have.
	const shownLevel = Math.min(level ?? maxLevel, maxLevel);

	const handleSlotChange = useCallback((_event: MouseEvent<HTMLElement>, value: string | null) => {
		// Clicking the selected button hands back null, which would leave no slot chosen.
		if (value !== null) {
			setSlot(value);
		}
	}, []);

	const handleLevelChange = useCallback((event: SelectChangeEvent<number>) => setLevel(Number(event.target.value)), []);

	if (skill === undefined) {
		return (
			<Typography variant="body2" color="text.secondary">
				This unit has no skills of its own.
			</Typography>
		);
	}

	const cooldown = skill.cooldown?.[shownLevel - 1];
	const cost = skill.cost?.[shownLevel - 1];

	return (
		<>
			{unit.skills.length > 1 ? (
				<ToggleButtonGroup value={skill.slot} exclusive onChange={handleSlotChange} sx={styles.slotToggle} aria-label="skill selection">
					{unit.skills.map((entry) => (
						<ToggleButton key={entry.slot} value={entry.slot}>
							{SLOT_LABELS[entry.slot] ?? entry.slot}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			) : null}

			<Card sx={styles.card}>
				<CardContent>
					<CardHeader
						avatar={hasAssimilationSkillIcon(unit.id, skill.slot) ? <Avatar variant="rounded" alt="" src={assimilationSkillIconUrl(unit.id, skill.slot)} sx={styles.icon} /> : undefined}
						title={skill.name}
						subheader={skill.initial_cooldown === undefined ? undefined : `Initial CD: ${skill.initial_cooldown}`}
						action={
							// A slot with one level has nothing to choose between, so it shows the level rather than a drop-down.
							maxLevel > 1 ? (
								<FormControl size="small">
									<InputLabel id={`captured-skill-level-${unit.id}`}>Level</InputLabel>
									<Select labelId={`captured-skill-level-${unit.id}`} label="Level" value={shownLevel} onChange={handleLevelChange} MenuProps={LEVEL_MENU_PROPS}>
										{Array.from({ length: maxLevel }, (_unused, index) => (
											<MenuItem key={index + 1} value={index + 1}>
												{index + 1}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							) : undefined
						}
					/>

					<Divider />

					<Typography sx={styles.description} color="textSecondary" gutterBottom>
						{describeSkill(skill, shownLevel)}
					</Typography>

					{cooldown === undefined && cost === undefined ? null : (
						<>
							<Divider />
							<Typography sx={styles.cooldownText} color="textSecondary">
								{cooldown === undefined ? null : (
									<>
										Cooldown:{" "}
										<Box component="span" sx={styles.value}>
											<ins>{cooldown}s</ins>
										</Box>
									</>
								)}
								{cooldown !== undefined && cost !== undefined ? " · " : null}
								{cost === undefined ? null : (
									<>
										Planning cost:{" "}
										<Box component="span" sx={styles.value}>
											<ins>{cost}</ins>
										</Box>
									</>
								)}
							</Typography>
						</>
					)}
				</CardContent>
			</Card>
		</>
	);
});
