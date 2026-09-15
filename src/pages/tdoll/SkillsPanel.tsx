import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
// The bare "html-react-parser" specifier only type-checks its default export under this repo's TS config, so the named
// exports come from its "lib/index" subpath instead. Both specifiers resolve to the same module at runtime.
import parse, { Element, domToReact } from "html-react-parser/lib/index";
import type { DOMNode, HTMLReactParserOptions } from "html-react-parser/lib/index";

// MaterialUI imports
import { Avatar, Box, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import EquipmentMention from "./EquipmentMention";
import { wrapMentions } from "../../lib/equipmentMentions";
import { INGREDIENT_COLOURS } from "../../theme";
import type { ExclusiveEquipment, RawSkill, SkillEquipmentMention } from "../../types/tdoll";

/** Shifts the level drop-down to the right of its field. A module constant, so the Select is not handed a new object each render. */
const LEVEL_MENU_PROPS = {
	anchorOrigin: { vertical: "top", horizontal: "right" },
	transformOrigin: { vertical: "top", horizontal: "left" }
} as const;

const styles = {
	skillToggle: {
		width: "100%",
		mb: 1,
		"& .MuiToggleButton-root": {
			flex: 1
		}
	},
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

/**
 * Section headings that open a line in generated skill text, such as `Passive:` or `Burst Mode:`.
 *
 * Found by scanning every line-start `Label:` in the doll shards. Sentence openings such as `Upon defeating the Giant:` are left out.
 */
const SKILL_LABEL_PATTERN = new RegExp(
	`(^|\\n)(${[
		"Passive",
		"Active",
		"Favorite Drink",
		"Normal attack",
		"RPG",
		"Machine Gun",
		"Erosion effect",
		"Fragility",
		"Arc Shadow",
		"Special Bullets",
		"Joint Effect",
		"In Mystic Mode",
		"In Focused Mode",
		"Revision Mode",
		"Full Marks Mode",
		"Burst Mode",
		"Accuracy Mode",
		"Weak Point Mode",
		"Upright Shooting Mode",
		"Hip Shooting Mode",
		"Prone Shooting Mode",
		"Ability Upgrade I{1,3}"
	].join("|")})( \\d+)?:\\s*`,
	"g"
);

/**
 * Highlight the section headings that open a line in a skill description. The line break before a heading already becomes `<br />`.
 *
 * @param text The skill description with its placeholders already filled.
 * @returns The description with each heading wrapped in highlight tags.
 */
function highlightLabels(text: string): string {
	return text.replace(
		SKILL_LABEL_PATTERN,
		(_match, start: string, label: string, number: string | undefined) => `${start}<span style="color: orange; font-size: 110%;"><ins>${label}${number ?? ""}</ins></span>: `
	);
}

/** Props for SkillsPanel. */
interface SkillsPanelProps {
	/** Whether the doll has a Mod, which shows the Skill 1/2 toggle and Skill 2 itself. */
	showModSkill: boolean;
	/** Which skill is on screen: 0 for Skill 1, 1 for Skill 2. Owned by the page so it survives tab switches. */
	selectedSkill: number;
	/** Called with the new value when the Skill 1/2 toggle changes. */
	onSelectedSkillChange: (newValue: number) => void;
	/** The level the description and cooldown are shown at, 1-10. Owned by the page so it survives tab switches. */
	skillLevel: number;
	/** Called with the new level when the level select changes. */
	onSkillLevelChange: (level: number) => void;
	/** The currently selected form's primary skill. Its `description` is reset and reformatted in place on every level change. */
	skill: RawSkill;
	/** The currently selected form's second skill, present only on Mods. Reformatted the same way as `skill`. */
	skill2: RawSkill | undefined;
	/** The Normal form's untouched Skill 1 description text, used to reset `skill.description` before each reformat. */
	normalSkillDescription: string;
	/** The Mod form's untouched Skill 2 description text, used to reset `skill2.description` before each reformat. */
	modSkill2Description: string | undefined;
	/** Id of the form currently on screen, used by a handful of dolls with hand-styled skill text. */
	dollId: number;
	/** Skill icon URLs, keyed `skill1` and `skill2`. */
	skillImages: Partial<Record<"skill1" | "skill2", string>>;
	/** Where the Normal form's Skill 1 description names exclusive equipment, matching `normalSkillDescription`. */
	normalSkillMentions: SkillEquipmentMention[];
	/** Where the Mod's Skill 2 description names exclusive equipment, matching `modSkill2Description`. */
	modSkill2Mentions: SkillEquipmentMention[] | undefined;
	/** The doll's exclusive equipment, which the tooltips show. */
	exclusiveEquipment: ExclusiveEquipment[];
}

/**
 * The doll's skill card: the Skill 1/2 toggle, the level select, the formatted description and cooldown.
 *
 * @param props Component props.
 * @returns The skill toggle and the skill card.
 */
export default memo(function SkillsPanel({
	showModSkill,
	selectedSkill,
	onSelectedSkillChange,
	skillLevel,
	onSkillLevelChange,
	skill,
	skill2,
	normalSkillDescription,
	modSkill2Description,
	dollId,
	skillImages,
	normalSkillMentions,
	modSkill2Mentions,
	exclusiveEquipment
}: SkillsPanelProps) {
	const handleSkillToggle = useCallback(
		(_event: MouseEvent<HTMLElement>, newValue: number | null) => {
			if (newValue !== null) {
				onSelectedSkillChange(newValue);
			}
		},
		[onSelectedSkillChange]
	);

	const handleLevelChange = useCallback((event: { target: { value: unknown } }) => onSkillLevelChange(Number(event.target.value)), [onSkillLevelChange]);

	const [skillDescription1, setSkillDescription1] = useState("");
	const [skillDescription2, setSkillDescription2] = useState("");

	/*
	A hack-job attempt at programmatically replacing all delimiters with the appropriate stats at the chosen skill level.
	It will also insert into the strings some <span> and <ins> tags for visual clarity.
	The npm package html-react-parser will parse the inserted span tags and properly render them into HTML tags.
	Note: The styling being inserted is using HTML styling and not using React styling.
	*/
	useEffect(() => {
		// Reset the descriptions to have it include the delimiters again and set variables to be used.
		skill.description = normalSkillDescription;
		let tempSkillDescription1 = skill.description;
		const numberOfStats1 = skill.number_of_stats;

		let tempSkillDescription2 = "";
		let numberOfStats2 = 0;
		if (skill2) {
			skill2.description = modSkill2Description ?? skill2.description;
			tempSkillDescription2 = skill2.description;
			numberOfStats2 = skill2.number_of_stats;
		}

		// If the doll has a Mod, format both Skill 1 and Skill 2. If not, only format Skill 1.
		if (showModSkill) {
			// Format Skill 1 first.
			for (let statIndex = numberOfStats1; statIndex >= 1; statIndex--) {
				const values = skill[`stat${statIndex}`] ?? [];
				tempSkillDescription1 = tempSkillDescription1.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			// Format Skill 2 next.
			for (let statIndex = numberOfStats2; statIndex >= 1; statIndex--) {
				const values = skill2?.[`stat${statIndex}`] ?? [];
				tempSkillDescription2 = tempSkillDescription2.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			// Highlight any "[Label]:" sections, then turn line breaks into HTML.
			tempSkillDescription1 = highlightLabels(tempSkillDescription1).replaceAll("\n", "<br />");
			tempSkillDescription2 = highlightLabels(tempSkillDescription2).replaceAll("\n", "<br />");

			setSkillDescription1(tempSkillDescription1);
			setSkillDescription2(tempSkillDescription2);
		} else {
			// Only format Skill 1.
			for (let statIndex = numberOfStats1; statIndex >= 1; statIndex--) {
				const values = skill[`stat${statIndex}`] ?? [];
				tempSkillDescription1 = tempSkillDescription1.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			// Highlight any "[Label]:" sections, then turn line breaks into HTML.
			tempSkillDescription1 = highlightLabels(tempSkillDescription1).replaceAll("\n", "<br />");

			// Deal with Jill's special skill description menu.
			if (dollId === 1017) {
				// The ingredient colours come from the palette rather than being written out five times.
				for (const [ingredient, colour] of Object.entries(INGREDIENT_COLOURS)) {
					tempSkillDescription1 = tempSkillDescription1.replaceAll(`■${ingredient}`, `<span style="color: ${colour};">■${ingredient}</span>`);
				}
				tempSkillDescription1 = tempSkillDescription1.replaceAll("❈❈❈", `<span style="color: ${INGREDIENT_COLOURS.Adelhyde};">❈❈❈</span>`);

				tempSkillDescription1 = tempSkillDescription1.replace("Big Beer", '<span style="font-size: 120%;"><ins>Big Beer</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Brandtini", '<span style="font-size: 120%;"><ins>Brandtini</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Piano Woman", '<span style="font-size: 120%;"><ins>Piano Woman</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Moonblast", '<span style="font-size: 120%;"><ins>Moonblast</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Bleeding Jane", '<span style="font-size: 120%;"><ins>Bleeding Jane</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Fringe Weaver", '<span style="font-size: 120%;"><ins>Fringe Weaver</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Sugar Rush", '<span style="font-size: 120%;"><ins>Sugar Rush</ins></span>');
			}

			// Deal with the other T-Dolls from the Valhalla colloboration event.
			if (dollId >= 1018 && dollId <= 1022) {
				if (dollId === 1018) {
					tempSkillDescription1 = tempSkillDescription1.replaceAll("Moonblast", '<span style="font-size: 110%;"><ins>Moonblast</ins></span>');
				} else if (dollId === 1019) {
					tempSkillDescription1 = tempSkillDescription1.replace("[MIRD-113]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[MIRD-113]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("[Nano-Camo]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Nano-Camo]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("Piano Woman", '<span style="font-size: 110%;"><ins>Piano Woman</ins></span>');
				} else if (dollId === 1020) {
					tempSkillDescription1 = tempSkillDescription1.replace("Bleeding Jane", '<span style="font-size: 110%;"><ins>Bleeding Jane</ins></span>');
				} else if (dollId === 1021) {
					tempSkillDescription1 = tempSkillDescription1.replace("Brandtini", '<span style="font-size: 110%;"><ins>Brandtini</ins></span>');
				} else {
					tempSkillDescription1 = tempSkillDescription1.replace("[Normal Attack]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Normal Attack]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("Big Beer", '<span style="font-size: 110%;"><ins>Big Beer</ins></span>');
				}

				tempSkillDescription1 = tempSkillDescription1.replace("[Favorite Drink]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Favorite Drink]</ins></span>: ');
			}

			setSkillDescription1(tempSkillDescription1);
		}
	}, [skill, skill2, normalSkillDescription, modSkill2Description, showModSkill, skillLevel, dollId]);

	// Turns the marker spans wrapMentions inserts into tooltips. A marker whose item is missing renders as its plain text.
	const parserOptions = useMemo<HTMLReactParserOptions>(() => {
		const byId = new Map(exclusiveEquipment.map((item) => [item.id, item]));
		const options: HTMLReactParserOptions = {
			replace(node) {
				if (!(node instanceof Element) || node.name !== "span" || node.attribs["data-equipment-id"] === undefined) {
					return undefined;
				}
				const children = domToReact(node.children as DOMNode[], options);
				const item = byId.get(Number(node.attribs["data-equipment-id"]));
				return item ? <EquipmentMention item={item}>{children}</EquipmentMention> : <>{children}</>;
			}
		};
		return options;
	}, [exclusiveEquipment]);

	return (
		<>
			{/************** T-Doll's skill information **************/}
			{showModSkill && (
				<ToggleButtonGroup value={selectedSkill} exclusive onChange={handleSkillToggle} sx={styles.skillToggle} aria-label="skill selection">
					<ToggleButton value={0}>Skill 1</ToggleButton>
					<ToggleButton value={1}>Skill 2</ToggleButton>
				</ToggleButtonGroup>
			)}

			<Card sx={styles.cardForSkill}>
				<CardContent>
					<CardHeader
						avatar={<Avatar variant="rounded" alt="" src={selectedSkill === 1 && skill2 !== undefined ? skillImages.skill2 : skillImages.skill1} />}
						title={selectedSkill === 1 && skill2 !== undefined ? skill2.name : skill.name}
						subheader={selectedSkill === 1 && skill2 !== undefined ? "Initial CD: " + skill2.initial_cooldown : "Initial CD: " + skill.initial_cooldown}
						action={
							<FormControl>
								<InputLabel id="skill-level-select-label">Level</InputLabel>

								<Select id="skill-level-select" labelId="skill-level-select-label" label="Level" value={skillLevel} onChange={handleLevelChange} MenuProps={LEVEL_MENU_PROPS}>
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
						{selectedSkill === 1 && showModSkill
							? parse(wrapMentions(skillDescription2, modSkill2Mentions ?? []), parserOptions)
							: parse(wrapMentions(skillDescription1, normalSkillMentions), parserOptions)}
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
});
