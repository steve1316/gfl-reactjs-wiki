import { memo, useState } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { searchIndex } from "../../lib/data";
import { statName } from "../../lib/equipmentStats";
import { formatBuildTime } from "../../lib/buildTime";
import type { SearchEntry } from "../../lib/data";
import type { Equipment, EquipmentDoll } from "../../types/equipment";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** Search index entries keyed by doll id, built once for every card to share. */
const DOLLS_BY_ID = new Map<number, SearchEntry>(searchIndex.map((entry) => [entry.id, entry]));

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
	iconPlaceholder: {
		// Equipment icons are 256x196.
		aspectRatio: "256 / 196",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		bgcolor: "action.hover"
	},
	dollLink: {
		color: "primary.main",
		textDecorationColor: "inherit",
		"&:hover": { textDecorationThickness: 2 }
	},
	buildTime: { display: "block", mt: 0.25 }
} satisfies Record<string, SxProps<Theme>>;

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
		<Accordion expanded={expanded} onChange={(_event, isExpanded) => setExpanded(isExpanded)} slotProps={{ heading: { component: "h2" }, transition: { unmountOnExit: true } }}>
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
	/** Weapon classes that can equip this. Empty for exclusive items. */
	usable: string[];
	/** The dolls an exclusive item belongs to. Empty otherwise. */
	dolls: EquipmentDoll[];
}

/**
 * The "Equippable by" line: weapon classes for general equipment, or links to each doll for exclusive equipment.
 *
 * @param props Component props.
 * @returns The subheader content.
 */
const EquippableBy = memo(function EquippableBy({ usable, dolls }: EquippableByProps) {
	if (dolls.length === 0) {
		return <>Equippable by {usable.join(", ")}</>;
	}
	return (
		<>
			Equippable by{" "}
			{dolls.map((doll, index) => {
				const name = DOLLS_BY_ID.get(doll.id)?.name ?? `#${doll.id}`;
				return (
					<span key={`${doll.id}-${doll.mod}`}>
						{index === 0 ? null : ", "}
						<Box component={Link} to={`/tdoll/${doll.id}`} sx={styles.dollLink}>
							{doll.mod ? `${name} Mod` : name}
						</Box>
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
			<CardHeader
				title={equipment.name}
				subheader={
					<>
						<EquippableBy usable={equipment.usable} dolls={equipment.dolls} />
						{equipment.buildSeconds === null ? null : (
							<Box component="span" sx={styles.buildTime}>
								Build time {formatBuildTime(equipment.buildSeconds)}
							</Box>
						)}
					</>
				}
			/>

			<CardActionArea>
				{equipment.image === null ? (
					<Box sx={styles.iconPlaceholder}>
						<Typography variant="body2" color="text.secondary">
							Icon not available yet
						</Typography>
					</Box>
				) : (
					<CardMedia component="img" image={equipment.image} title={equipment.name} loading="lazy" />
				)}
			</CardActionArea>

			<CardContent sx={styles.stats}>
				{Object.keys(equipment.stats).map((key) => {
					const values = equipment.stats[key] ?? [];
					// Values run from level 0 to 10, so the level is the index.
					const atLevel = values[level];
					// Highlighted when levelling has actually moved this stat off its level-one value.
					const improved = level !== 1 && atLevel !== values[1];

					return (
						<Box key={key} sx={styles.statRow}>
							<Typography variant="body2" color="text.secondary">
								{statName(key)}
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
