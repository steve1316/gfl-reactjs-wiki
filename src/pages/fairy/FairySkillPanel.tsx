import { memo, useState } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import LevelSlider from "../../components/LevelSlider";
import { describeSkill } from "../../lib/skillText";
import type { FairySkill } from "../../types/fairy";

/** The highest skill level. */
const MAX_SKILL_LEVEL = 10;

const styles = {
	level: { maxWidth: 480 },
	nameRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mt: 1.5 },
	name: { fontWeight: 700 },
	// Keeps the line breaks the game puts in longer skill text.
	description: { mt: 0.5, whiteSpace: "pre-line" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * The cost or cooldown caption for a skill at a level.
 *
 * @param skill The skill.
 * @param strategy Whether the skill is a strategy skill, costed in command points, rather than a battle skill's cooldown.
 * @param level The skill level, 1 to 10.
 * @returns The caption text, or undefined when the matching array is absent.
 */
function captionText(skill: FairySkill, strategy: boolean, level: number): string | undefined {
	if (strategy) {
		const cost = skill.cost?.[level - 1];
		return cost === undefined ? undefined : `Cost ${cost} CP`;
	}
	const cooldown = skill.cooldown?.[level - 1];
	return cooldown === undefined ? undefined : `Cooldown ${cooldown}s`;
}

/** Props for FairySkillPanel. */
interface FairySkillPanelProps {
	/** The fairy's one skill, battle or strategy. */
	skill: FairySkill;
	/** Whether the skill is a strategy skill, which shows a command point cost instead of a cooldown. */
	strategy: boolean;
}

/**
 * A fairy's one skill at a chosen level: its cost or cooldown, and its description with placeholders filled in.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function FairySkillPanel({ skill, strategy }: FairySkillPanelProps) {
	const [level, setLevel] = useState(MAX_SKILL_LEVEL);
	const caption = captionText(skill, strategy, level);

	return (
		<Box>
			<LevelSlider id="fairy-skill-level-label" label="Skill level" value={level} max={MAX_SKILL_LEVEL} marks onChange={setLevel} sx={styles.level} />

			<Box sx={styles.nameRow}>
				<Typography component="h3" variant="subtitle1" sx={styles.name}>
					{skill.name}
				</Typography>
				{caption !== undefined ? (
					<Typography variant="caption" color="text.secondary">
						{caption}
					</Typography>
				) : null}
			</Box>
			<Typography variant="body2" sx={styles.description}>
				{describeSkill(skill, level)}
			</Typography>
		</Box>
	);
});
