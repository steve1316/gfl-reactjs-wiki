import { memo, useCallback } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Chip, Fab, ToggleButton, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { ART_TOP_ANCHOR, CARD_ASPECT, FAB_EXPAND_SX, cardArtSx } from "../../lib/artLayout";
import { uiUrl } from "../../lib/assets";
import { RarityStars, TypeBadge } from "../../components/DollBadges";
import ArtPlaceholder from "../../components/ArtPlaceholder";
import ProfilePanel from "./ProfilePanel";
import type { DollProduction, DollProfile, RawSkins, SpecRow } from "../../types/tdoll";

const modIcon = uiUrl("mod.png");

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
	// From a large screen up the card is stretched to its row, which the Grid has already sized to the taller of the hero and the
	// Animations card beside it, so the two cards end level. Below that the card keeps the artwork's own 1:2 shape: the medium hero
	// is only about 560 wide, and a card wide enough to look right at this height left the profile beside it too narrow to read.
	//
	// The width is given rather than derived from the stretched height. A row flex container resolves an item's width before its
	// height, so an `aspect-ratio` on the card cannot work backwards from a height that is not known yet: it was measured doing
	// exactly that, sizing to the artwork's own 256px and leaving 128px of empty card underneath.
	portrait: {
		...cardArtSx,
		aspectRatio: { xs: CARD_ASPECT, lg: "auto" },
		// Near half the row's height, so the card's own shape stays close to the artwork's 1:2 and `cover` below has almost
		// nothing to crop.
		width: { xs: 176, sm: 208, md: 200, lg: 320 },
		alignSelf: { lg: "stretch" },
		// The row's height comes from the hero's own spec sheet, which on a doll with a long one runs far past what the artwork can
		// fill. This stops the card at a shape close enough to the artwork's that the crop stays small, at the cost of the two
		// cards not ending level on those few dolls.
		maxHeight: { lg: 720 },
		// Pulls the card back out through the hero's own vertical padding, so it spans the whole row rather than stopping 24px
		// short of the Animations card at each end.
		my: { lg: -3 },
		display: "flex",
		flexShrink: 0,
		// Anchors the full art Fab, which is clipped by this card's inherited overflow: hidden otherwise.
		position: "relative",
		boxShadow: 8
	},
	// Fills whatever height the row gives the card.
	portraitAction: {
		flex: 1,
		minHeight: 0
	},
	// `cover` with the top anchor, so the card fills rather than sitting in bands of empty space. The card's shape is kept near the
	// artwork's own, so the crop is a few percent, and anchoring it to the top means what little goes is taken off the boots.
	portraitArt: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		objectPosition: ART_TOP_ANCHOR,
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
		gap: 1
	},
	name: {
		lineHeight: 1.1,
		wordBreak: "break-word"
	},
	modToggle: (theme: Theme) => ({
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
	modIcon: {
		height: 18,
		width: 18
	},

	pillRow: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: { xs: "center", md: "flex-start" },
		gap: 0.75,
		pt: 0.5
	},
	pill: (theme: Theme) => ({
		backgroundColor: alpha(theme.palette.background.default, 0.6),
		color: theme.palette.text.primary
	}),
	pillSelected: (theme: Theme) => ({
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	})
} satisfies Record<string, SxProps<Theme>>;

/** Props for DollHero. */
interface DollHeroProps {
	/** Name of the form currently on screen. */
	name: string;
	/** Id of the form currently on screen. */
	id: number;
	/** Weapon class of the form currently on screen, such as `AR` or `SMG`. */
	type: string;
	/** Rarity of the form currently on screen, 1 to 6. */
	rarity: number;
	/** Whether the form currently on screen is the Mod, which recolours the rarity stars. */
	isMod: boolean;
	/** URL of the sharp card portrait on the left of the hero, or undefined when the outfit on screen has no art and a notice shows. */
	cardImage: string | undefined;
	/** Called when the portrait is clicked, which toggles between the normal and damaged art. */
	onCardImageClick: () => void;
	/** Route of the full art viewer, already pointing at the form and damaged state on screen. */
	artLink: string;
	/** Whether the outfit on screen has full art. Without it the art viewer link is hidden. */
	hasFullArt: boolean;
	/** The doll's skins, or null when it has none. */
	skins: RawSkins | null;
	/** The key of the selected skin, its skin id as a string, or false when no skin is selected. */
	skinValue: string | false;
	/** Called with the skin's key when a skin pill is clicked, or false when the Base pill is clicked. */
	onSkinChange: (event: unknown, newValue: string | false) => void;
	/** Whether the doll has a Mod, which shows the Mod toggle. */
	hasMod: boolean;
	/** Whether the Mod toggle is currently on. */
	modOn: boolean;
	/** Called when the Mod toggle is clicked. */
	onToggleMod: () => void;
	/** The doll's faction, maker, country and release date, shown under the skin pills. */
	profile: DollProfile;
	/** The spec sheet of the form on screen, shown beside the profile. */
	specs: SpecRow[];
	/** The doll's build time and production pools, or null when production never gives it. */
	production: DollProduction | null;
}

/**
 * The doll page's hero: the portrait, the name and badges, the skin pills, the Mod toggle, and the profile and spec sheet.
 *
 * The full art is not drawn here. It sits blurred behind the whole page in `PageBackdrop`, so the hero
 * carries only the sharp portrait and the doll's details on top of it.
 *
 * @param props Component props.
 * @returns The hero block.
 */
export default memo(function DollHero({
	name,
	id,
	type,
	rarity,
	isMod,
	cardImage,
	onCardImageClick,
	artLink,
	hasFullArt,
	skins,
	skinValue,
	onSkinChange,
	hasMod,
	modOn,
	onToggleMod,
	profile,
	specs,
	production
}: DollHeroProps) {
	// Shared by every skin pill, which carries its skin key in `data-skin`. A new arrow per pill per render
	// would hand each Chip a fresh prop and re-render the whole row on any change to the page.
	const handleSkinClick = useCallback((event: MouseEvent<HTMLElement>) => onSkinChange(event, event.currentTarget.dataset.skin ?? false), [onSkinChange]);
	const handleBaseClick = useCallback((event: MouseEvent<HTMLElement>) => onSkinChange(event, false), [onSkinChange]);

	const skinNames = skins?.skin_names ?? [];
	const skinIds = skins?.skin_ids ?? [];

	return (
		<Box data-testid="doll-hero" sx={styles.root}>
			<Box sx={styles.content}>
				<Card sx={styles.portrait}>
					{cardImage ? (
						<>
							<CardActionArea onClick={onCardImageClick} sx={styles.portraitAction}>
								<CardMedia component="img" sx={styles.portraitArt} image={cardImage} title={name} />
							</CardActionArea>

							{/* Sibling of the action area rather than a child, or opening the full art would also flip
							    the portrait to its damaged version on the way out. */}
							{hasFullArt ? (
								<Fab color="primary" component={Link} to={artLink} sx={FAB_EXPAND_SX} aria-label="view full art">
									<ZoomOutMapIcon />
								</Fab>
							) : null}
						</>
					) : (
						<ArtPlaceholder name={name} sx={styles.portraitArt} />
					)}
				</Card>

				<Box sx={styles.info}>
					<Box sx={styles.topRow}>
						<TypeBadge type={type} />
						<RarityStars rarity={rarity} isMod={isMod} />

						{hasMod ? (
							<ToggleButton value="mod" selected={modOn} onChange={onToggleMod} size="small" sx={styles.modToggle} aria-label="toggle Mod form">
								<Box component="img" src={modIcon} alt="" sx={styles.modIcon} />
								MOD
							</ToggleButton>
						) : null}
					</Box>

					<Typography variant="h4" component="h1" sx={styles.name}>
						{name}
						<Typography component="span" sx={{ display: "inline" }} color="textSecondary">
							{" "}
							#{id}
						</Typography>
					</Typography>

					{skinNames.length > 0 ? (
						<Box sx={styles.pillRow} role="group" aria-label="Skins">
							<Chip label="Base" size="small" clickable onClick={handleBaseClick} aria-pressed={skinValue === false} sx={skinValue === false ? styles.pillSelected : styles.pill} />
							{skinNames.map((skinName, index) => {
								// A hand-written skin with no id has no art to show, so its pill is disabled.
								const skinId = skinIds[index];
								const value = skinId === null || skinId === undefined ? undefined : String(skinId);
								const selected = value !== undefined && skinValue === value;
								return (
									<Chip
										key={value ?? `unkeyed-${index}`}
										label={skinName}
										size="small"
										clickable
										disabled={value === undefined}
										data-skin={value}
										onClick={handleSkinClick}
										aria-pressed={selected}
										sx={selected ? styles.pillSelected : styles.pill}
									/>
								);
							})}
						</Box>
					) : null}

					<ProfilePanel profile={profile} specs={specs} name={name} production={production} />
				</Box>
			</Box>
		</Box>
	);
});
