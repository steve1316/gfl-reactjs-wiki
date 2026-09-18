import { memo } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { EnemySkill } from "../../types/enemy";

const styles = {
	skill: { mb: 1.75, "&:last-of-type": { mb: 0 } },
	name: { fontWeight: 700 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemySkillsPanel. */
interface EnemySkillsPanelProps {
	/** The enemy's own skills, or undefined while the details are still loading. */
	skills: EnemySkill[] | undefined;
}

/**
 * One enemy's own skills, as the archive words them.
 *
 * Shorter than the doll's skill panel, because these carry no levels: the archive ships one paragraph per skill and the game
 * never scales it, so there is nothing for a level slider to move.
 *
 * @param props Component props.
 * @returns The skill list, or a note when the archive lists none.
 */
export default memo(function EnemySkillsPanel({ skills }: EnemySkillsPanelProps) {
	if (skills === undefined) {
		return null;
	}
	if (skills.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				The archive lists no skills of its own for this enemy.
			</Typography>
		);
	}

	return (
		<Box>
			{skills.map((skill) => (
				<Box key={skill.name} sx={styles.skill}>
					<Typography variant="body2" sx={styles.name}>
						{skill.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{skill.description}
					</Typography>
				</Box>
			))}
		</Box>
	);
});
