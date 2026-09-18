import { memo, useCallback } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Alert, AlertTitle, Box, Card, CardMedia, Chip, Fab, ToggleButton, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import FactionIcon from "../../components/FactionIcon";
import EnemyProfilePanel from "./EnemyProfilePanel";
import { ENEMY_CARD_ASPECT, FAB_EXPAND_SX } from "../../lib/artLayout";
import { factionEmblemUrl } from "../../lib/assets";
import { hasFactionEmblem } from "../../lib/processData";
import { FACTION_COLOURS } from "../../theme/palette";
import type { EnemyDetails, EnemyRankValues } from "../../types/enemy";

const styles = {
	root: {
		position: "relative",
		width: "100%"
	},
	// The portrait only sits beside the text from a large screen up. A doll's card is 200 wide, which fits the medium hero column
	// next to its profile; a square enemy card wide enough to stand as tall left the column too narrow for the name to fit on one
	// line. Below large the card sits above the text instead, which is what a phone already did.
	content: {
		position: "relative",
		display: "flex",
		flexDirection: { xs: "column", lg: "row" },
		alignItems: { xs: "center", lg: "flex-start" },
		gap: { xs: 2, md: 3 },
		p: { xs: 2, md: 3 }
	},
	portrait: {
		// Enemy art is a single square image where a doll's is a 1:2 half-atlas, so a card of the doll's width would stand half as
		// tall. These widths are the card's height too, and beside the text that is the doll card's own 400px.
		width: { xs: 300, sm: 380, md: 420, lg: 400 },
		flexShrink: 0,
		// Anchors the full art Fab, which is clipped by this card's inherited overflow: hidden otherwise.
		position: "relative",
		boxShadow: 8
	},
	portraitArt: {
		width: "100%",
		aspectRatio: ENEMY_CARD_ASPECT,
		objectFit: "cover",
		display: "block"
	},
	info: {
		display: "flex",
		flexDirection: "column",
		gap: 1,
		minWidth: 0,
		width: "100%",
		alignItems: { xs: "center", lg: "flex-start" },
		textAlign: { xs: "center", lg: "left" }
	},
	topRow: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 1,
		justifyContent: { xs: "center", lg: "flex-start" }
	},
	name: {
		lineHeight: 1.1,
		wordBreak: "break-word"
	},
	id: {
		display: "inline"
	},
	counter: {
		width: "100%",
		textAlign: "left"
	},
	// The tip is the game's own, so it is labelled rather than left as an unattributed box of advice.
	counterTitle: {
		mb: 0.25,
		fontSize: "0.75rem",
		textTransform: "uppercase",
		letterSpacing: "0.06em",
		color: "text.secondary"
	},
	// The faction's own emblem at full size, sunk into the hero's top corner. It says whose side the enemy is on without
	// repeating the chip's wording, which is all a second copy of the name beside it would have done.
	emblem: {
		position: "absolute",
		top: { xs: 8, md: 16 },
		right: { xs: 8, md: 16 },
		height: { xs: 56, md: 88 },
		width: "auto",
		opacity: 0.12,
		pointerEvents: "none",
		display: { xs: "none", sm: "block" }
	},
	pillRow: {
		display: "flex",
		flexWrap: "wrap",
		gap: 0.5,
		justifyContent: { xs: "center", lg: "flex-start" }
	},
	pill: (theme: Theme) => ({
		backgroundColor: alpha(theme.palette.background.default, 0.6),
		color: theme.palette.text.primary
	}),
	pillSelected: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	}),
	// The doll hero's Mod toggle, verbatim: this holds the same place and does the same job, swapping the page between the
	// archive's enemy and the unit a player fields.
	capturedToggle: (theme: Theme) => ({
		display: "flex",
		alignItems: "center",
		gap: 0.5,
		px: 1,
		py: 0.25,
		color: theme.palette.text.primary,
		borderColor: theme.palette.divider,
		"&.Mui-selected": {
			color: theme.palette.primary.contrastText,
			backgroundColor: theme.palette.primary.main,
			"&:hover": { backgroundColor: theme.palette.primary.main }
		}
	}),
	// Not a faction mark: Protocol Assimilation reaches Paradeus and a few event units as well as Sangvis Ferri, and a second
	// copy of the mark already on the chip beside it would read as a mistake either way.
	capturedIcon: {
		height: 18,
		width: 18
	}
} satisfies Record<string, SxProps<Theme>>;

/**
 * One faction chip's colours, and the room its mark needs.
 *
 * Not part of `styles`, since it takes the faction rather than only the theme. The mark is painted in `currentColor`, so the icon
 * has to inherit rather than take MUI's own chip icon colour. It is also sized down from the 18 a full-size chip uses: this chip is
 * small, 24 tall, and an 18 mark 4px from the left ran straight through the rounded cap.
 *
 * @param faction Faction name, as the enemy data spells it.
 * @returns The chip's `sx`.
 */
function factionChipSx(faction: string): SxProps<Theme> {
	return (theme: Theme) => {
		const tint = FACTION_COLOURS[faction as keyof typeof FACTION_COLOURS] ?? theme.palette.text.secondary;
		return { borderColor: tint, color: tint, "& .MuiChip-icon": { color: "inherit", height: 15, width: 15, marginLeft: "7px", marginRight: "-3px" } };
	};
}

/** One selectable variant of an enemy: the same unit at a harder tier, sharing its art and rig. */
export interface EnemyVariant {
	/** The variant's enemy id. */
	id: number;
	/** What the pill reads, such as "Base" or "Gray Zone Specialized Model". */
	label: string;
}

/** Props for EnemyHero. */
interface EnemyHeroProps {
	/** Official English name. */
	name: string;
	/** Enemy id, shown muted beside the name. */
	id: number;
	/** The game's unit code, such as `BossArchitect`. */
	code: string;
	/** Faction name, such as "Paradeus". */
	faction: string;
	/** Whether this is one of the named boss and Ringleader tier. */
	boss: boolean;
	/** Whether Protocol Assimilation can capture this enemy, which is what puts the Captured toggle on screen. */
	capturable: boolean;
	/** The archive's rank bars, which the spec sheet reads tenacity from. */
	ranks: EnemyRankValues;
	/** The page half of the enemy's record, or undefined while it is still loading. */
	details: EnemyDetails | undefined;
	/** The archive's card art, or undefined when none is published. */
	cardImage: string | undefined;
	/** The lore blurb to show, which is the captured unit's own when the Captured toggle is on. */
	introduce: string;
	/** The archive's advice on how to fight this enemy, empty when there is none or when the captured unit is on screen. */
	counter: string;
	/** The family's variants, in id order. A single entry means the enemy has no harder tiers and no pills are drawn. */
	variants: EnemyVariant[];
	/** The variant on screen. */
	variantId: number;
	/** Called with the id of the variant whose pill was clicked. */
	onVariantChange: (id: number) => void;
	/** Whether the page is showing the captured unit rather than the enemy. */
	capturedOn: boolean;
	/** Flips between the enemy and the captured unit. */
	onToggleCaptured: () => void;
	/** Link to the full art viewer, or null when the enemy has no full art published. */
	artLink: string | null;
}

/**
 * The enemy page's hero: the portrait, the badges, the name, the variant pills, the profile and spec sheet, and the counter advice.
 *
 * Laid out as the doll page's hero, down to the portrait's width and the toggle's styling, so the two pages read the same way. The
 * counter sits here rather than in its own card for the same reason the doll's profile does: it is what the archive says about the
 * enemy, not a measurement of it.
 *
 * @param props Component props.
 * @returns The hero block.
 */
export default memo(function EnemyHero({
	name,
	id,
	code,
	faction,
	boss,
	capturable,
	ranks,
	details,
	cardImage,
	introduce,
	counter,
	variants,
	variantId,
	onVariantChange,
	capturedOn,
	onToggleCaptured,
	artLink
}: EnemyHeroProps) {
	// Shared by every pill, which carries its variant id in `data-variant`, so a fresh arrow per pill never re-renders the row.
	const handleVariantClick = useCallback((event: MouseEvent<HTMLElement>) => onVariantChange(Number(event.currentTarget.dataset.variant)), [onVariantChange]);

	return (
		<Box data-testid="enemy-hero" sx={styles.root}>
			{hasFactionEmblem(faction) ? <Box component="img" src={factionEmblemUrl(faction)} alt="" sx={styles.emblem} /> : null}

			<Box sx={styles.content}>
				<Card sx={styles.portrait}>
					{cardImage ? <CardMedia component="img" sx={styles.portraitArt} image={cardImage} title={name} /> : <ArtPlaceholder name={name} sx={styles.portraitArt} />}

					{/* A sibling of the media rather than a child, so opening the art never also fires a click on the portrait. */}
					{artLink === null ? null : (
						<Fab color="primary" component={Link} to={artLink} sx={FAB_EXPAND_SX} aria-label="view full art">
							<ZoomOutMapIcon />
						</Fab>
					)}
				</Card>

				<Box sx={styles.info}>
					<Box sx={styles.topRow}>
						<Chip label={faction} icon={<FactionIcon faction={faction} />} variant="outlined" size="small" sx={factionChipSx(faction)} />
						{boss && <Chip label="Boss" color="error" variant="outlined" size="small" />}
						{capturable ? (
							<ToggleButton value="captured" selected={capturedOn} onChange={onToggleCaptured} size="small" sx={styles.capturedToggle} aria-label="show the captured unit">
								<PersonAddAlt1Icon sx={styles.capturedIcon} />
								CAPTURED
							</ToggleButton>
						) : null}
					</Box>

					<Typography variant="h4" component="h1" sx={styles.name}>
						{name}
						<Typography component="span" sx={styles.id} color="textSecondary">
							{" "}
							#{id}
						</Typography>
					</Typography>

					{variants.length > 1 ? (
						<Box sx={styles.pillRow} role="group" aria-label="Variants">
							{variants.map((variant) => (
								<Chip
									key={variant.id}
									label={variant.label}
									size="small"
									clickable
									data-variant={variant.id}
									onClick={handleVariantClick}
									aria-pressed={variant.id === variantId}
									sx={variant.id === variantId ? styles.pillSelected : styles.pill}
								/>
							))}
						</Box>
					) : null}

					{introduce === "" ? null : (
						<Typography variant="body1" color="text.secondary">
							{introduce}
						</Typography>
					)}

					{counter === "" ? null : (
						<Alert severity="info" icon={false} variant="outlined" sx={styles.counter}>
							<AlertTitle sx={styles.counterTitle}>How to fight it</AlertTitle>
							{counter}
						</Alert>
					)}

					<EnemyProfilePanel faction={faction} boss={boss} capturable={capturable} code={code} variantCount={variants.length} ranks={ranks} details={details} />
				</Box>
			</Box>
		</Box>
	);
});
