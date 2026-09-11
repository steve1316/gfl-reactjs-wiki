import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the skill description strings.

// MaterialUI imports
import { Avatar, Box, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { RawSkill } from "../../types/tdoll";

const styles = {
	tabsForSkills: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}),
	cardForSkill: {
		width: "100%"
	},
	title: {
		fontSize: 14
	},
	cooldownText: {
		paddingTop: "12px"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for SkillsPanel. */
interface SkillsPanelProps {
	/** Whether the doll has a Mod, which shows both Skill 1 and Skill 2 tabs. */
	showModSkill: boolean;
	/** Which skill tab is active: 0 for Skill 1, 1 for Skill 2. */
	selectedSkill: number;
	/** Called when the skill tab selection changes. */
	onSelectedSkillChange: (event: unknown, newValue: number) => void;
	/** The currently selected form's primary skill. */
	skill: RawSkill;
	/** The currently selected form's second skill, present only on Mods. */
	skill2: RawSkill | undefined;
	/** Skill icon URLs, keyed `skill1` and `skill2`. */
	skillImages: Partial<Record<"skill1" | "skill2", string>>;
	/** Skill 1's description, already formatted with the level's stat values and highlight spans. */
	skillDescription1: string;
	/** Skill 2's description, already formatted the same way. */
	skillDescription2: string;
	/** The skill level the description and cooldown are shown at, 1-10. */
	skillLevel: number;
	/** Called with the new level when the level select changes. */
	onSkillLevelChange: (level: number) => void;
}

/**
 * The doll's skill card: the Skill 1/2 tabs, the level select, the formatted description and cooldown.
 *
 * @param props Component props.
 * @returns The skill tab strip and the skill card.
 */
export default function SkillsPanel({
	showModSkill,
	selectedSkill,
	onSelectedSkillChange,
	skill,
	skill2,
	skillImages,
	skillDescription1,
	skillDescription2,
	skillLevel,
	onSkillLevelChange
}: SkillsPanelProps) {
	return (
		<>
			{/************** T-Doll's skill information **************/}
			{showModSkill ? (
				<Tabs sx={styles.tabsForSkills} value={selectedSkill} onChange={onSelectedSkillChange} indicatorColor="primary" textColor="primary" scrollButtons="auto" centered>
					<Tab label="Skill 1" />
					<Tab label="Skill 2" />
				</Tabs>
			) : (
				<Tabs sx={styles.tabsForSkills} value={0} indicatorColor="primary" textColor="primary" centered>
					<Tab label="Skill 1" />
				</Tabs>
			)}

			<Card sx={styles.cardForSkill}>
				<CardContent>
					<CardHeader
						avatar={<Avatar variant="rounded" src={selectedSkill === 1 && skill2 !== undefined ? skillImages.skill2 : skillImages.skill1} />}
						title={selectedSkill === 1 && skill2 !== undefined ? skill2.name : skill.name}
						subheader={selectedSkill === 1 && skill2 !== undefined ? "Initial CD: " + skill2.initial_cooldown : "Initial CD: " + skill.initial_cooldown}
						action={
							<FormControl>
								<InputLabel id="skill-level-select-label">Level</InputLabel>

								<Select
									id="skill-level-select"
									value={skillLevel}
									onChange={(e) => {
										onSkillLevelChange(Number(e.target.value));
									}}
									// MenuProps will shift the drop down menu to the right.
									MenuProps={{
										anchorOrigin: {
											vertical: "top",
											horizontal: "right"
										},
										transformOrigin: {
											vertical: "top",
											horizontal: "left"
										}
									}}
								>
									<MenuItem value={1}>1</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={3}>3</MenuItem>
									<MenuItem value={4}>4</MenuItem>
									<MenuItem value={5}>5</MenuItem>
									<MenuItem value={6}>6</MenuItem>
									<MenuItem value={7}>7</MenuItem>
									<MenuItem value={8}>8</MenuItem>
									<MenuItem value={9}>9</MenuItem>
									<MenuItem value={10}>10</MenuItem>
								</Select>
							</FormControl>
						}
					/>

					<Divider />

					{/************** This will render the span tags inserted into the skill description and will color the numbers. **************/}
					<Typography sx={styles.title} color="textSecondary" gutterBottom>
						{selectedSkill === 1 && showModSkill ? parse(skillDescription2) : parse(skillDescription1)}
					</Typography>
					{selectedSkill === 0 && skill.initial_cooldown !== "Passive" ? (
						<>
							<Divider />
							<Typography sx={styles.cooldownText} color="textSecondary">
								Cooldown:{" "}
								{
									<Box component="span" sx={{ color: "secondary.main" }}>
										<ins>{skill.cooldown?.[skillLevel - 1] ?? "?"}s</ins>
									</Box>
								}
							</Typography>
						</>
					) : (
						""
					)}
				</CardContent>
			</Card>
		</>
	);
}
