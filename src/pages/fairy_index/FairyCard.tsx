import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import HighlightedName from "../../components/HighlightedName";
import { fairyFormUrl } from "../../lib/assets";
import { FAIRY_STAT_KEYS, FAIRY_STAT_LABELS, formatFairyStat } from "../../lib/fairyStats";
import { findNameMatch } from "../../lib/nameSearch";
import { hasFairyForm } from "../../lib/processData";
import type { FairyStatValues } from "../../types/fairy";

/** The form shown on the tile, the fairy's highest rank. */
const TILE_FORM = 3;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** Fairy art is a square 512x512 image. */
const FAIRY_CARD_ASPECT = "1 / 1";

/** Text about 11.5px, the smallest size used on the tiles so they stay readable on a phone. */
const SMALL_TEXT = "0.72rem";

const styles = {
	card: { height: "100%", display: "flex", flexDirection: "column" },
	art: { width: "100%", aspectRatio: FAIRY_CARD_ASPECT, objectFit: "contain", display: "block", bgcolor: "action.hover" },
	action: { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start" },
	body: { px: 1.25, pt: 1, pb: 1.25, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
	name: { fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	// While a search matches, the rest of the name drops to regular weight so the matched part stands out.
	nameWhileMatching: { fontWeight: 400, color: "text.secondary" },
	typeName: { fontSize: SMALL_TEXT, color: "text.secondary", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	stats: { mt: 0.75 },
	statRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, height: 20 },
	statLabel: { fontSize: SMALL_TEXT, color: "text.secondary" },
	statValue: { fontSize: SMALL_TEXT, fontWeight: 650 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for FairyCard. */
interface FairyCardProps {
	/** Fairy id, used in the link. */
	id: number;
	/** Official English name. */
	name: string;
	/** Type name, such as "Buff". */
	typeName: string;
	/** Stats at level 100 and 5 stars. */
	stats: FairyStatValues;
	/** The name search text. The part of the name it matches is shown in bold. */
	highlight: string;
}

/**
 * One Fairy as a tile linking to its page: art, name, type and its five stats at level 100 and 5 stars.
 *
 * @param props Component props.
 * @returns The tile.
 */
export default memo(function FairyCard({ id, name, typeName, stats, highlight }: FairyCardProps) {
	const match = useMemo(() => findNameMatch(name, highlight), [name, highlight]);

	return (
		<Card sx={styles.card}>
			<CardActionArea component={Link} to={`/fairy/${id}`} sx={styles.action}>
				{hasFairyForm(id, TILE_FORM) ? <CardMedia component="img" image={fairyFormUrl(id, TILE_FORM)} alt="" loading="lazy" sx={styles.art} /> : <ArtPlaceholder name={name} sx={styles.art} />}
				<Box sx={styles.body}>
					<Typography component="div" sx={[styles.name, match !== null && styles.nameWhileMatching]} title={name}>
						<HighlightedName name={name} match={match} />
					</Typography>
					<Box sx={styles.typeName}>{typeName}</Box>
					<Box sx={styles.stats}>
						{FAIRY_STAT_KEYS.map((key) => (
							<Box key={key} sx={styles.statRow}>
								<Box component="span" sx={styles.statLabel}>
									{FAIRY_STAT_LABELS[key]}
								</Box>
								<Box component="span" sx={styles.statValue}>
									{formatFairyStat(stats[key])}
								</Box>
							</Box>
						))}
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
});
