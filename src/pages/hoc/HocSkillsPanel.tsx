import { memo, useCallback, useState } from "react";

// MaterialUI imports
import { Box, Slider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { HocSkill } from "../../types/hoc";

/** The highest skill level. */
const MAX_SKILL_LEVEL = 10;

const styles = {
	level: { display: "flex", alignItems: "center", gap: 2, px: 0.5, maxWidth: 480 },
	slider: { flex: 1, minWidth: 0 },
	levelValue: { fontWeight: 700, minWidth: 56, textAlign: "right" },
	skill: { py: 1.5, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0, pb: 0 } },
	nameRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, flexWrap: "wrap" },
	name: { fontWeight: 700 },
	// Keeps the line breaks the game puts in longer skill text.
	description: { mt: 0.5, whiteSpace: "pre-line" },
	value: { color: "primary.main", fontWeight: 700 }
} satisfies Record<string, SxProps<Theme>>;

/**
 * A skill's description with each `#N` placeholder replaced by its value at a level.
 *
 * @param skill The skill.
 * @param level The skill level, 1 to 10.
 * @returns The description as text and highlighted values.
 */
function describe(skill: HocSkill, level: number) {
	return skill.description.split(/#(\d+)/).map((part, index) =>
		// Split with a capture group puts the placeholder numbers at odd indexes.
		index % 2 === 1 ? (
			<Box component="span" key={index} sx={styles.value}>
				{skill[`stat${Number(part)}`]?.[level - 1] ?? ""}
			</Box>
		) : (
			part
		)
	);
}

/**
 * The cooldown line for a skill at a level.
 *
 * @param skill The skill.
 * @param level The skill level, 1 to 10.
 * @returns "Passive", or the first and repeat cooldowns.
 */
function cooldownText(skill: HocSkill, level: number): string {
	const cooldown = skill.cooldown?.[level - 1];
	if (skill.initial_cooldown === "Passive" || cooldown === undefined) {
		return "Passive";
	}
	return `Initial ${skill.initial_cooldown} · Cooldown ${cooldown}s`;
}

/** Props for HocSkillsPanel. */
interface HocSkillsPanelProps {
	/** The HOC's skills, in game order. */
	skills: HocSkill[];
}

/**
 * Every skill a HOC has, with one level slider for all of them.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function HocSkillsPanel({ skills }: HocSkillsPanelProps) {
	const [level, setLevel] = useState(MAX_SKILL_LEVEL);

	const handleLevel = useCallback((_event: Event, value: number | number[]) => setLevel(Array.isArray(value) ? (value[0] ?? 1) : value), []);

	return (
		<Box>
			<Box sx={styles.level}>
				<Typography id="hoc-skill-level-label" variant="body2" color="text.secondary">
					Skill level
				</Typography>
				<Slider aria-labelledby="hoc-skill-level-label" value={level} onChange={handleLevel} step={1} marks min={1} max={MAX_SKILL_LEVEL} valueLabelDisplay="auto" sx={styles.slider} />
				<Typography variant="body2" sx={styles.levelValue}>
					Lvl {level}
				</Typography>
			</Box>

			{skills.map((skill) => (
				<Box key={skill.name} sx={styles.skill}>
					<Box sx={styles.nameRow}>
						<Typography component="h3" variant="subtitle1" sx={styles.name}>
							{skill.name}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{cooldownText(skill, level)}
						</Typography>
					</Box>
					<Typography variant="body2" sx={styles.description}>
						{describe(skill, level)}
					</Typography>
				</Box>
			))}
		</Box>
	);
});
