import { memo, useCallback } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Alert, Box, Card, CardMedia, Chip, Fab, ToggleButton, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import FactionIcon from "../../components/FactionIcon";
import { ENEMY_CARD_ASPECT, FAB_EXPAND_SX } from "../../lib/artLayout";
import { factionEmblemUrl } from "../../lib/assets";
import { hasFactionEmblem } from "../../lib/processData";
import { FACTION_COLOURS } from "../../theme/palette";

const styles = {
	root: {
		position: "relative",
		width: "100%"
	},
	content: {
		position: "relative",
		display: "flex",
		flexDirection: { xs: "column", md: "row" },
		alignItems: { xs: "center", md: "flex-start" },
		gap: { xs: 2, md: 3 },
		p: { xs: 2, md: 3 }
	},
	portrait: {
		width: "100%",
		aspectRatio: ENEMY_CARD_ASPECT,
		objectFit: "cover",
		display: "block",
		// Capped at the published art's own 512px rather than stretched.
		maxWidth: { xs: 208, sm: 240, md: 256 },
		flexShrink: 0,
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
		alignItems: { xs: "center", md: "flex-start" },
		textAlign: { xs: "center", md: "left" }
	},
	topRow: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 1,
		justifyContent: { xs: "center", md: "flex-start" }
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
	emblem: {
		height: 34,
		width: "auto",
		display: "block",
		// The emblems are drawn light on dark, so they need no treatment beyond sitting quietly beside the badges.
		opacity: 0.9
	},
	pillRow: {
		display: "flex",
		flexWrap: "wrap",
		gap: 0.5,
		justifyContent: { xs: "center", md: "flex-start" }
	},
	pill: (theme: Theme) => ({
		backgroundColor: alpha(theme.palette.background.default, 0.6),
		color: theme.palette.text.primary
	}),
	pillSelected: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	}),
	capturedToggle: (theme: Theme) => ({
		display: "flex",
		alignItems: "center",
		gap: 0.5,
		px: 1,
		py: 0.25,
		color: theme.palette.text.primary,
		borderColor: theme.palette.divider,
		"&.Mui-selected": {
			color: theme.palette.success.contrastText,
			backgroundColor: theme.palette.success.main,
			"&:hover": { backgroundColor: theme.palette.success.main }
		}
	})
} satisfies Record<string, SxProps<Theme>>;

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
	/** A variant's own name when it differs from the enemy's, or null. */
	subName: string | null;
	/** Faction name, such as "Paradeus". */
	faction: string;
	/** Whether this is one of the named boss and Ringleader tier. */
	boss: boolean;
	/** Whether Protocol Assimilation can capture this enemy, which is what puts the Captured toggle on screen. */
	capturable: boolean;
	/** The organisation the enemy belongs to, or null when upstream records none. */
	organisation: string | null;
	/** The archive's card art, or undefined when none is published. */
	cardImage: string | undefined;
	/** The archive's lore blurb, empty when there is none. */
	introduce: string;
	/** The archive's advice on how to fight this enemy, empty when there is none. */
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
 * The enemy page's hero: the portrait, the badges, the name, the archive's lore and its counter advice.
 *
 * Laid out like the doll page's hero, with the portrait beside a details column, so the two pages read the same way. The
 * counter sits here rather than in its own card for the same reason the doll's profile does: it is what the archive says
 * about the enemy, not a measurement of it.
 *
 * @param props Component props.
 * @returns The hero block.
 */
export default memo(function EnemyHero({
	name,
	id,
	code,
	subName,
	faction,
	boss,
	capturable,
	organisation,
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
	const subtitle = [code === name ? "" : code, subName === null || subName === name ? "" : subName].filter((part) => part !== "").join(" \u00b7 ");
	// Shared by every pill, which carries its variant id in `data-variant`, so a fresh arrow per pill never re-renders the row.
	const handleVariantClick = useCallback((event: MouseEvent<HTMLElement>) => onVariantChange(Number(event.currentTarget.dataset.variant)), [onVariantChange]);

	return (
		<Box data-testid="enemy-hero" sx={styles.root}>
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
						{hasFactionEmblem(faction) ? <Box component="img" src={factionEmblemUrl(faction)} alt="" sx={styles.emblem} /> : null}
						<Chip
							label={faction}
							icon={<FactionIcon faction={faction} />}
							variant="outlined"
							size="small"
							sx={{ borderColor: FACTION_COLOURS[faction as keyof typeof FACTION_COLOURS], color: FACTION_COLOURS[faction as keyof typeof FACTION_COLOURS] }}
						/>
						{boss && <Chip label="Boss" color="error" variant="outlined" size="small" />}
						{organisation === null ? null : <Chip label={organisation} variant="outlined" size="small" />}
						{capturable ? (
							<ToggleButton value="captured" selected={capturedOn} onChange={onToggleCaptured} size="small" sx={styles.capturedToggle} aria-label="show the captured unit">
								Captured
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

					{/* The code usually repeats the name, so it only earns a line when it says something the name does not. */}
					{subtitle === "" ? null : (
						<Typography variant="body2" color="text.secondary">
							{subtitle}
						</Typography>
					)}

					{introduce === "" ? null : (
						<Typography variant="body1" color="text.secondary">
							{introduce}
						</Typography>
					)}

					{counter === "" ? null : (
						<Alert severity="info" icon={false} variant="outlined" sx={styles.counter}>
							{counter}
						</Alert>
					)}
				</Box>
			</Box>
		</Box>
	);
});
