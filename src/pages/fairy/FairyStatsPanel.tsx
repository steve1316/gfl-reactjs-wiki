import { memo, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import LevelSlider from "../../components/LevelSlider";
import StarRankPicker from "../../components/StarRankPicker";
import { FAIRY_MAX_STARS, FAIRY_STAT_KEYS, FAIRY_STAT_LABELS, effectiveStars, fairyStats, formatFairyStat } from "../../lib/fairyStats";
import type { Fairy, FairyConstants } from "../../types/fairy";

const styles = {
	level: { pt: 1.5 },
	row: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	value: { textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 },
	caption: { display: "block", mt: 1, textAlign: "right" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for FairyStatsPanel. */
interface FairyStatsPanelProps {
	/** The fairy whose stats are shown. */
	fairy: Fairy;
	/** The shared stat constants. */
	constants: FairyConstants;
	/** The chosen star rank, owned by the page so the hero art form follows it. */
	stars: number;
	/** Called with the new star rank when the star toggle group changes. */
	onStarsChange: (stars: number) => void;
}

/**
 * A fairy's five stats at a chosen level and star rank.
 *
 * A rank a level is too low to reach falls back to the highest rank that level allows, shown by a caption naming
 * the level the chosen rank actually needs.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function FairyStatsPanel({ fairy, constants, stars, onStarsChange }: FairyStatsPanelProps) {
	const [level, setLevel] = useState(constants.maxLevel);

	const stats = useMemo(() => fairyStats(fairy, constants, level, stars), [fairy, constants, level, stars]);
	const actualStars = effectiveStars(constants, level, stars);

	return (
		<Box>
			<StarRankPicker value={stars} max={FAIRY_MAX_STARS} onChange={onStarsChange} />

			<LevelSlider id="fairy-level-label" label="Level" value={level} max={constants.maxLevel} onChange={setLevel} sx={styles.level} />

			{FAIRY_STAT_KEYS.map((key) => (
				<Box key={key} sx={styles.row}>
					<Typography variant="body2" color="text.secondary">
						{FAIRY_STAT_LABELS[key]}
					</Typography>
					<Typography variant="body2" sx={styles.value}>
						{formatFairyStat(stats[key])}
					</Typography>
				</Box>
			))}

			{actualStars < stars ? (
				<Typography variant="caption" color="text.secondary" sx={styles.caption}>
					{stars}★ needs level {constants.starLevels[stars - 1]}
				</Typography>
			) : null}
		</Box>
	);
});
