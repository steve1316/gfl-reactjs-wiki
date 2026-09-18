import { memo } from "react";

// MaterialUI imports
import { Avatar, Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { assimilationSkillIconUrl } from "../../lib/assets";
import { hasAssimilationSkillIcon } from "../../lib/processData";
import { describeSkill } from "../../lib/skillText";
import type { AssimilationData, AssimilationUnit } from "../../types/enemy";

const styles = {
	skill: { display: "flex", gap: 1.25, mb: 1.75, "&:last-of-type": { mb: 0 } },
	// The game's own icons are 100 or 128 square, so this only ever shrinks them.
	icon: { width: 40, height: 40, flexShrink: 0, mt: 0.25 },
	text: { minWidth: 0 },
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
					{/* A strategic skill has no icon in the game at all, so its slot is held open rather than letting that one skill's text
					    start further left than the rest. */}
					{hasAssimilationSkillIcon(unit.id, skill.slot) ? (
						<Avatar variant="rounded" alt="" src={assimilationSkillIconUrl(unit.id, skill.slot)} sx={styles.icon} />
					) : (
						<Box sx={styles.icon} />
					)}
					<Box sx={styles.text}>
						<Typography variant="body2" sx={styles.name}>
							{skill.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{describeSkill(skill, skillLevels[index] ?? 0)}
						</Typography>
					</Box>
				</Box>
			))}
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				Shown at the highest level each skill reaches.
			</Typography>
		</Box>
	);
});
