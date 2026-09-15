import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import HighlightedName from "../../components/HighlightedName";
import ArtPlaceholder from "../../components/ArtPlaceholder";
import { HOC_CARD_ASPECT } from "../../lib/artLayout";
import { hocCardUrl } from "../../lib/assets";
import { HOC_STAT_KEYS, HOC_STAT_LABELS } from "../../lib/hocStats";
import { findNameMatch } from "../../lib/nameSearch";
import { hasHocArt } from "../../lib/processData";
import type { HocStatValues } from "../../types/hoc";

/** Text about 11.5px, the smallest size used on the tiles so they stay readable on a phone. */
const SMALL_TEXT = "0.72rem";

const styles = {
	card: { height: "100%", display: "flex", flexDirection: "column" },
	art: { width: "100%", aspectRatio: HOC_CARD_ASPECT, objectFit: "cover", display: "block" },
	action: { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start" },
	body: { px: 1.25, pt: 1, pb: 1.25, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
	name: { fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	// While a search matches, the rest of the name drops to regular weight so the matched part stands out.
	nameWhileMatching: { fontWeight: 400, color: "text.secondary" },
	className: { fontSize: SMALL_TEXT, color: "text.secondary", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	stats: { mt: 0.75 },
	statRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, height: 20 },
	statLabel: { fontSize: SMALL_TEXT, color: "text.secondary" },
	statValue: { fontSize: SMALL_TEXT, fontWeight: 650 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for HocCard. */
interface HocCardProps {
	/** HOC id, used in the link. */
	id: number;
	/** Official English name. */
	name: string;
	/** Class name, such as "Mortar". */
	className: string;
	/** Base stats at the highest level. */
	stats: HocStatValues;
	/** The name search text. The part of the name it matches is shown in bold. */
	highlight: string;
}

/**
 * One HOC as a tile linking to its page: art, name, class and its four stats at the highest level.
 *
 * @param props Component props.
 * @returns The tile.
 */
export default memo(function HocCard({ id, name, className, stats, highlight }: HocCardProps) {
	const match = useMemo(() => findNameMatch(name, highlight), [name, highlight]);

	return (
		<Card sx={styles.card}>
			<CardActionArea component={Link} to={`/hoc/${id}`} sx={styles.action}>
				{hasHocArt(id, "card") ? <CardMedia component="img" image={hocCardUrl(id)} alt="" loading="lazy" sx={styles.art} /> : <ArtPlaceholder name={name} sx={styles.art} />}
				<Box sx={styles.body}>
					<Typography component="div" sx={[styles.name, match !== null && styles.nameWhileMatching]} title={name}>
						<HighlightedName name={name} match={match} />
					</Typography>
					<Box sx={styles.className}>{className}</Box>
					<Box sx={styles.stats}>
						{HOC_STAT_KEYS.map((key) => (
							<Box key={key} sx={styles.statRow}>
								<Box component="span" sx={styles.statLabel}>
									{HOC_STAT_LABELS[key]}
								</Box>
								<Box component="span" sx={styles.statValue}>
									{stats[key]}
								</Box>
							</Box>
						))}
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
});
