import { memo } from "react";

// MaterialUI imports
import { Alert, Box, Card, CardMedia, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import { cardArtSx } from "../../lib/artLayout";

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
		// The same cap the doll portraits use, since enemy art will be published at the same card size.
		width: { xs: 176, sm: 208, md: 200 },
		flexShrink: 0,
		position: "relative",
		boxShadow: 8
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
	}
} satisfies Record<string, SxProps<Theme>>;

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
	/** Whether Protocol Assimilation has a playable unit for this enemy. */
	capturable: boolean;
	/** The organisation the enemy belongs to, or null when upstream records none. */
	organisation: string | null;
	/** The archive's card art, or undefined when none is published. */
	cardImage: string | undefined;
	/** The archive's lore blurb, empty when there is none. */
	introduce: string;
	/** The archive's advice on how to fight this enemy, empty when there is none. */
	counter: string;
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
export default memo(function EnemyHero({ name, id, code, subName, faction, boss, capturable, organisation, cardImage, introduce, counter }: EnemyHeroProps) {
	const subtitle = [code === name ? "" : code, subName === null || subName === name ? "" : subName].filter((part) => part !== "").join(" \u00b7 ");

	return (
		<Box data-testid="enemy-hero" sx={styles.root}>
			<Box sx={styles.content}>
				<Card sx={styles.portrait}>{cardImage ? <CardMedia component="img" sx={cardArtSx} image={cardImage} title={name} /> : <ArtPlaceholder name={name} />}</Card>

				<Box sx={styles.info}>
					<Box sx={styles.topRow}>
						<Chip label={faction} color="primary" variant="outlined" size="small" />
						{boss && <Chip label="Boss" color="error" variant="outlined" size="small" />}
						{capturable && <Chip label="Capturable" color="success" variant="outlined" size="small" />}
						{organisation === null ? null : <Chip label={organisation} variant="outlined" size="small" />}
					</Box>

					<Typography variant="h4" component="h1" sx={styles.name}>
						{name}
						<Typography component="span" sx={styles.id} color="textSecondary">
							{" "}
							#{id}
						</Typography>
					</Typography>

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
