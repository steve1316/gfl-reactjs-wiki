import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import HighlightedName from "../../components/HighlightedName";
import RankBar from "../../components/RankBar";
import { enemyCardUrl } from "../../lib/assets";
import { ENEMY_CARD_RANK_KEYS, ENEMY_MAX_RANK, ENEMY_RANK_LABELS } from "../../lib/enemyRanks";
import { findNameMatch } from "../../lib/nameSearch";
import { hasEnemyArt } from "../../lib/processData";
import type { EnemyRankValues } from "../../types/enemy";

/** Text about 11.5px, the smallest size used on the tiles so they stay readable on a phone. */
const SMALL_TEXT = "0.72rem";

/** Enemy art is not published yet, so the tiles hold a square until real art settles the shape. */
const ENEMY_CARD_ASPECT = "1 / 1";

const styles = {
	card: { height: "100%", display: "flex", flexDirection: "column" },
	art: { width: "100%", aspectRatio: ENEMY_CARD_ASPECT, objectFit: "cover", display: "block" },
	action: { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start" },
	body: { px: 1.25, pt: 1, pb: 1.25, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
	name: { fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	// While a search matches, the rest of the name drops to regular weight so the matched part stands out.
	nameWhileMatching: { fontWeight: 400, color: "text.secondary" },
	faction: { fontSize: SMALL_TEXT, color: "text.secondary", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	badges: { display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5, minHeight: 20 },
	badge: { height: 18, fontSize: "0.65rem" },
	ranks: { mt: 0.75 },
	rankRow: { display: "flex", alignItems: "center", gap: 1, height: 18 },
	rankLabel: { fontSize: SMALL_TEXT, color: "text.secondary", width: "4.6rem", flexShrink: 0 },
	rankBar: { flex: 1, minWidth: 0 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyCard. */
interface EnemyCardProps {
	/** Enemy id, used in the link. */
	id: number;
	/** Official English name. */
	name: string;
	/** Faction name, such as "Paradeus". */
	faction: string;
	/** Whether this is one of the named boss and Ringleader tier. */
	boss: boolean;
	/** Whether Protocol Assimilation has a playable unit for this enemy. */
	capturable: boolean;
	/** The archive's rank bars. */
	ranks: EnemyRankValues;
	/** The name search text. The part of the name it matches is shown in bold. */
	highlight: string;
}

/**
 * One enemy as a tile linking to its page: art, name, faction, its badges and the archive's rank bars.
 *
 * @param props Component props.
 * @returns The tile.
 */
export default memo(function EnemyCard({ id, name, faction, boss, capturable, ranks, highlight }: EnemyCardProps) {
	const match = useMemo(() => findNameMatch(name, highlight), [name, highlight]);

	return (
		<Card sx={styles.card}>
			<CardActionArea component={Link} to={`/enemy/${id}`} sx={styles.action}>
				{hasEnemyArt(id, "card") ? <CardMedia component="img" image={enemyCardUrl(id)} alt="" loading="lazy" sx={styles.art} /> : <ArtPlaceholder name={name} sx={styles.art} />}
				<Box sx={styles.body}>
					<Typography component="div" sx={[styles.name, match !== null && styles.nameWhileMatching]} title={name}>
						<HighlightedName name={name} match={match} />
					</Typography>
					<Box sx={styles.faction}>{faction}</Box>
					<Box sx={styles.badges}>
						{boss && <Chip label="Boss" size="small" color="error" variant="outlined" sx={styles.badge} />}
						{capturable && <Chip label="Capturable" size="small" color="success" variant="outlined" sx={styles.badge} />}
					</Box>
					<Box sx={styles.ranks}>
						{ENEMY_CARD_RANK_KEYS.map((key) => (
							<Box key={key} sx={styles.rankRow}>
								<Box component="span" sx={styles.rankLabel}>
									{ENEMY_RANK_LABELS[key]}
								</Box>
								<Box sx={styles.rankBar}>
									<RankBar value={ranks[key]} max={ENEMY_MAX_RANK} label={ENEMY_RANK_LABELS[key]} />
								</Box>
							</Box>
						))}
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
});
