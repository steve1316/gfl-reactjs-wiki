// MaterialUI imports
import { Box, Chip, ToggleButton, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { heroArtSx } from "../../lib/artLayout";
import { uiUrl } from "../../lib/assets";
import { RarityStars, TypeBadge } from "../../components/DollBadges";
import type { RawSkins } from "../../types/tdoll";

const modIcon = uiUrl("mod.png");

const styles = {
	root: {
		position: "relative",
		width: "100%",
		height: { xs: 180, sm: 240, md: 300 },
		overflow: "hidden",
		borderRadius: "12px",
		mb: 2
	},
	scrim: (theme: Theme) => ({
		position: "absolute",
		inset: 0,
		backgroundImage: `linear-gradient(to top, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.55)} 40%, transparent 80%)`,
		pointerEvents: "none"
	}),
	info: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		display: "flex",
		flexDirection: "column",
		gap: 0.5,
		p: { xs: 1.5, sm: 2 }
	},
	topRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 1
	},
	badgeRow: {
		display: "flex",
		alignItems: "center",
		gap: 1
	},
	name: {
		lineHeight: 1.1
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
		gap: 0.75,
		overflowX: "auto",
		pb: 0.25
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
	/** URL of the full art to show, or undefined when the doll has published none at all. */
	artUrl: string | undefined;
	/** The doll's skins, or null when it has none. */
	skins: RawSkins | null;
	/** The doubled index of the selected skin pill, or false when no skin is selected. */
	skinValue: number | false;
	/** Called with the doubled skin index when a skin pill is clicked. */
	onSkinChange: (event: unknown, newValue: number) => void;
	/** Whether the doll has a Mod, which shows the Mod toggle. */
	hasMod: boolean;
	/** Whether the Mod toggle is currently on. */
	modOn: boolean;
	/** Called when the Mod toggle is clicked. */
	onToggleMod: () => void;
}

/**
 * The doll page's hero: the full art, the name and badges, the skin pills and the Mod toggle.
 *
 * This replaces the old pattern of hiding the full art behind an "expand" button. The art itself is
 * cropped with `heroArtSx`, which anchors to the top of the canvas so the crop keeps the face.
 *
 * @param props Component props.
 * @returns The hero band.
 */
export default function DollHero({ name, id, type, rarity, isMod, artUrl, skins, skinValue, onSkinChange, hasMod, modOn, onToggleMod }: DollHeroProps) {
	const skinNames = skins?.skin_names ?? [];

	return (
		<Box data-testid="doll-hero" sx={styles.root}>
			{artUrl ? <Box component="img" src={artUrl} alt={name} sx={heroArtSx} /> : null}
			<Box sx={styles.scrim} />

			<Box sx={styles.info}>
				<Box sx={styles.topRow}>
					<Box sx={styles.badgeRow}>
						<TypeBadge type={type} />
						<RarityStars rarity={rarity} isMod={isMod} />
					</Box>

					{hasMod ? (
						<ToggleButton value="mod" selected={modOn} onChange={() => onToggleMod()} size="small" sx={styles.modToggle} aria-label="toggle Mod form">
							<Box component="img" src={modIcon} alt="" sx={styles.modIcon} />
							MOD
						</ToggleButton>
					) : null}
				</Box>

				<Typography variant="h3" component="h2" sx={styles.name}>
					{name}
					<Typography component="span" sx={{ display: "inline" }} color="textSecondary">
						{" "}
						#{id}
					</Typography>
				</Typography>

				{skinNames.length > 0 ? (
					<Box sx={styles.pillRow} role="group" aria-label="Skins">
						{skinNames.map((skinName, index) => {
							const value = index * 2;
							const selected = skinValue === value;
							return <Chip key={value} label={skinName} size="small" clickable onClick={(event) => onSkinChange(event, value)} sx={selected ? styles.pillSelected : styles.pill} />;
						})}
					</Box>
				) : null}
			</Box>
		</Box>
	);
}
