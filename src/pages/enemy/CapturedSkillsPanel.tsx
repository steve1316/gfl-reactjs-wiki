import { memo } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { describeSkill } from "../../lib/skillText";
import type { AssimilationData, AssimilationUnit } from "../../types/enemy";

const styles = {
	skill: { mb: 1.75, "&:last-of-type": { mb: 0 } },
	name: { fontWeight: 700 },
	note: { mt: 1.5, display: "block" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for CapturedSkillsPanel. */
interface CapturedSkillsPanelProps {
	/** The playable unit captured from this enemy. */
	unit: AssimilationUnit;
	/** The shared class table, which says how many levels each skill slot reaches. */
	data: AssimilationData;
}

/**
 * A captured unit's skills, each quoted at the top level its slot reaches.
 *
 * @param props Component props.
 * @returns The skill list.
 */
export default memo(function CapturedSkillsPanel({ unit, data }: CapturedSkillsPanelProps) {
	// Zeros mark slots the class does not have, so they drop out to line the levels up with the skills the unit shipped with.
	const skillLevels = (data.constants.classes[unit.className]?.skillLevels ?? []).filter((level) => level > 0);

	if (unit.skills.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				This unit has no skills of its own.
			</Typography>
		);
	}

	return (
		<Box>
			{unit.skills.map((skill, index) => (
				<Box key={skill.slot} sx={styles.skill}>
					<Typography variant="body2" sx={styles.name}>
						{skill.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{describeSkill(skill, skillLevels[index] ?? 0)}
					</Typography>
				</Box>
			))}
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				Shown at the highest level each skill reaches.
			</Typography>
		</Box>
	);
});
