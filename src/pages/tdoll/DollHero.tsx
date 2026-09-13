import { memo, useCallback } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Chip, Fab, ToggleButton, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { cardArtSx } from "../../lib/artLayout";
import { uiUrl } from "../../lib/assets";
import { RarityStars, TypeBadge } from "../../components/DollBadges";
import ArtPlaceholder from "../../components/ArtPlaceholder";
import type { RawSkins } from "../../types/tdoll";

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
	portrait: {
		...cardArtSx,
		// Capped at the artwork's own 256px rather than stretched, since upscaling a bitmap that is
		// already undersampled at this pixel ratio only makes it softer.
		width: { xs: 176, sm: 208, md: 200 },
		flexShrink: 0,
		// Anchors fabExpand, which is clipped by this card's inherited overflow: hidden otherwise.
		position: "relative",
		boxShadow: 8
	},
	fabExpand: {
		position: "absolute",
		right: 8,
		bottom: 8,
		height: 40,
		width: 40,
		opacity: 0.85
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
	/** The doubled index of the selected skin pill, or false when no skin is selected. */
	skinValue: number | false;
	/** Called with the doubled skin index when a skin pill is clicked, or false when the Base pill is clicked. */
	onSkinChange: (event: unknown, newValue: number | false) => void;
	/** Whether the doll has a Mod, which shows the Mod toggle. */
	hasMod: boolean;
	/** Whether the Mod toggle is currently on. */
	modOn: boolean;
	/** Called when the Mod toggle is clicked. */
	onToggleMod: () => void;
}

/**
 * The doll page's hero: the portrait, the name and badges, the skin pills and the Mod toggle.
 *
 * The full art is not drawn here. It sits blurred behind the whole page in `PageBackdrop`, so the hero
 * carries only the sharp portrait and the doll's details on top of it.
 *
 * @param props Component props.
 * @returns The hero block.
 */
export default memo(function DollHero({ name, id, type, rarity, isMod, cardImage, onCardImageClick, artLink, hasFullArt, skins, skinValue, onSkinChange, hasMod, modOn, onToggleMod }: DollHeroProps) {
	// Shared by every skin pill, which carries its doubled index in `data-skin`. A new arrow per pill per render
	// would hand each Chip a fresh prop and re-render the whole row on any change to the page.
	const handleSkinClick = useCallback((event: MouseEvent<HTMLElement>) => onSkinChange(event, Number(event.currentTarget.dataset.skin)), [onSkinChange]);
	const handleBaseClick = useCallback((event: MouseEvent<HTMLElement>) => onSkinChange(event, false), [onSkinChange]);

	const skinNames = skins?.skin_names ?? [];

	return (
		<Box data-testid="doll-hero" sx={styles.root}>
			<Box sx={styles.content}>
				<Card sx={styles.portrait}>
					{cardImage ? (
						<>
							<CardActionArea onClick={onCardImageClick}>
								<CardMedia component="img" sx={cardArtSx} image={cardImage} title={name} />
							</CardActionArea>

							{/* Sibling of the action area rather than a child, or opening the full art would also flip
							    the portrait to its damaged version on the way out. */}
							{hasFullArt ? (
								<Fab color="primary" component={Link} to={artLink} sx={styles.fabExpand} aria-label="view full art">
									<ZoomOutMapIcon />
								</Fab>
							) : null}
						</>
					) : (
						<ArtPlaceholder name={name} />
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
								const value = index * 2;
								const selected = skinValue === value;
								return (
									<Chip
										key={value}
										label={skinName}
										size="small"
										clickable
										data-skin={value}
										onClick={handleSkinClick}
										aria-pressed={selected}
										sx={selected ? styles.pillSelected : styles.pill}
									/>
								);
							})}
						</Box>
					) : null}
				</Box>
			</Box>
		</Box>
	);
});
