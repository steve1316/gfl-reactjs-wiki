import { memo, useState } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { searchIndex } from "../../lib/data";
import type { Equipment } from "../../types/equipment";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/**
 * Display names for the stat keys in the equipment data.
 *
 * This was a thirteen-branch if/else chain rebuilt inside the render for every stat of every card.
 * Anything missing from the map falls back to the raw key, which is at least visible rather than the
 * empty string the chain produced.
 */
const STAT_NAMES: Record<string, string> = {
	criticalHitRate: "Critical hit rate",
	damage: "Damage",
	accuracy: "Accuracy",
	criticalDamage: "Critical damage",
	rateOfFire: "Rate of fire",
	evasion: "Evasion",
	nightVision: "Night vision",
	boostAbilityEffectiveness: "Boost ability effectiveness",
	armorPiercing: "Armor piercing",
	target: "Target",
	clipSize: "Clip size",
	movementSpeed: "Movement speed",
	armor: "Armor"
};

/** Doll ids keyed by normalised name, built once for every card to share. */
const DOLL_IDS_BY_NAME = new Map(searchIndex.map((entry) => [normaliseName(entry.name), entry.id]));

const styles = {
	heading: (theme: Theme) => ({
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular as number
	}),
	stats: {
		maxHeight: 140,
		overflow: "auto",
		py: 0
	},
	statRow: {
		display: "flex",
		justifyContent: "space-between",
		gap: 2,
		py: 0.9,
		borderBottom: 1,
		borderColor: "divider",
		"&:last-of-type": { borderBottom: 0 }
	},
	dollLink: {
		color: "primary.main",
		textDecorationColor: "inherit",
		"&:hover": { textDecorationThickness: 2 }
	}
} satisfies Record<string, SxProps<Theme>>;

/**
 * Reduce a name to lowercase letters and digits, so "M4 SOPMOD II" and "m4sopmodii" compare equal.
 *
 * @param text The name to normalise.
 * @returns The text with everything but letters and digits removed.
 */
function normaliseName(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Find the doll a "usable" entry names, if it names one.
 *
 * Entries are either a weapon class such as `AR`, which matches no doll, or a doll's name. Mod-only equipment
 * writes the name with a trailing ` Mod`, which has no page of its own and links to the doll.
 *
 * @param usable One entry from the equipment's `usable` list.
 * @returns The doll's id, or undefined when the entry is a weapon class or an unknown name.
 */
function dollIdFor(usable: string): number | undefined {
	return DOLL_IDS_BY_NAME.get(normaliseName(usable.replace(/ Mod$/, "")));
}

/** Props for EquipmentDescription. */
interface EquipmentDescriptionProps {
	/** The equipment's flavour text. */
	description: string;
}

/**
 * The collapsible description, with its own open state.
 *
 * Which card was open used to live on the page, so opening one description re-rendered every card on it.
 * Memoised on its text alone, so moving the level slider never re-renders the Accordion either.
 *
 * @param props Component props.
 * @returns The description accordion.
 */
const EquipmentDescription = memo(function EquipmentDescription({ description }: EquipmentDescriptionProps) {
	const [expanded, setExpanded] = useState(false);
	return (
		<Accordion expanded={expanded} onChange={(_event, isExpanded) => setExpanded(isExpanded)} slotProps={{ transition: { unmountOnExit: true } }}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography sx={styles.heading}>Description</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography component="p" sx={{ mb: 2 }}>
					{description}
				</Typography>
			</AccordionDetails>
		</Accordion>
	);
});

/** Props for EquippableBy. */
interface EquippableByProps {
	/** Weapon classes or doll names that can equip this. */
	usable: string[];
	/** Whether the equipment is restricted to specific dolls, which highlights the names. */
	exclusive: boolean;
}

/**
 * The "Equippable by" line, with every doll it names linked to that doll's page.
 *
 * @param props Component props.
 * @returns The subheader content.
 */
const EquippableBy = memo(function EquippableBy({ usable, exclusive }: EquippableByProps) {
	return (
		<>
			Equippable by{" "}
			{usable.map((item, index) => {
				const id = dollIdFor(item);
				const separator = index === 0 ? null : ", ";
				if (id !== undefined) {
					return (
						<span key={item}>
							{separator}
							<Box component={Link} to={`/tdoll/${id}`} sx={styles.dollLink}>
								{item}
							</Box>
						</span>
					);
				}
				return (
					<span key={item}>
						{separator}
						{exclusive ? (
							<Box component="span" sx={{ color: "primary.main" }}>
								<ins>{item}</ins>
							</Box>
						) : (
							item
						)}
					</span>
				);
			})}
		</>
	);
});

/** Props for EquipmentCard. */
interface EquipmentCardProps {
	/** The equipment to show. */
	equipment: Equipment;
	/** The level, 1 to 10, whose stat values are shown. */
	level: number;
}

/**
 * One piece of equipment: its name and who can equip it, icon, stats at the chosen level, and description.
 *
 * Memoised, with the header and description split into memoised parts of their own, so a level change only
 * re-renders the stat rows. Before this every step of the level slider rebuilt all 178 cards in full, which
 * blocked the main thread for about 1.2 seconds over a single drag.
 *
 * @param props Component props.
 * @returns The equipment card.
 */
export default memo(function EquipmentCard({ equipment, level }: EquipmentCardProps) {
	return (
		<Card>
			<CardHeader title={equipment.name} subheader={<EquippableBy usable={equipment.usable} exclusive={equipment.exclusive} />} />

			<CardActionArea>
				<CardMedia component="img" image={equipment.image} title={equipment.name} loading="lazy" />
			</CardActionArea>

			<CardContent sx={styles.stats}>
				{Object.keys(equipment.stats).map((key) => {
					const values = equipment.stats[key] ?? [];
					const atLevel = values[level - 1];
					// Highlighted when levelling has actually moved this stat off its level-one value.
					const improved = level !== 1 && atLevel !== values[0];

					return (
						<Box key={key} sx={styles.statRow}>
							<Typography variant="body2" color="text.secondary">
								{STAT_NAMES[key] ?? key}
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 650, color: improved ? "primary.main" : "text.primary" }}>
								{atLevel}
							</Typography>
						</Box>
					);
				})}
			</CardContent>

			<EquipmentDescription description={equipment.description} />
		</Card>
	);
});
