import { memo, useCallback, useMemo, useState } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { Box, LinearProgress, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { HOC_MAX_STARS, HOC_STAT_KEYS, HOC_STAT_LABELS, bestHocStats, hocChipStats, hocStats } from "../../lib/hocStats";
import type { Hoc, HocConstants } from "../../types/hoc";
import LevelSlider from "./LevelSlider";

/** The star picker's buttons, 1 to 5. */
const STAR_RANKS = Array.from({ length: HOC_MAX_STARS }, (_v, index) => index + 1);

const styles = {
	stars: { width: "100%", "& .MuiToggleButton-root": { flex: 1, py: 0.5 } },
	level: { pt: 1.5 },
	head: { display: "grid", gridTemplateColumns: "1fr 64px 64px", gap: 1, mt: 1.5, pb: 0.5, borderBottom: 1, borderColor: "divider" },
	row: { py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	values: { display: "grid", gridTemplateColumns: "1fr 64px 64px", gap: 1, alignItems: "baseline" },
	number: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
	base: { fontWeight: 700 },
	bar: { mt: 0.5, height: 6, borderRadius: "3px" },
	caption: { display: "block", mt: 0.25, textAlign: "right" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for HocStatsPanel. */
interface HocStatsPanelProps {
	/** The HOC whose stats are shown. */
	hoc: Hoc;
	/** Every HOC, so each bar can be scaled to the best HOC at the same level. */
	allHocs: Hoc[];
	/** The shared stat constants. */
	constants: HocConstants;
}

/**
 * A HOC's stats at a chosen level, with the most its chip board can add at a chosen star rank.
 *
 * Stars do not change a HOC's base stats in the game, only how much its chip board can hold, so the star picker drives the chip column alone.
 * Each bar compares the stat with the best HOC at the same level, and a caption under it names that HOC.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function HocStatsPanel({ hoc, allHocs, constants }: HocStatsPanelProps) {
	const [stars, setStars] = useState(HOC_MAX_STARS);
	const [level, setLevel] = useState(constants.maxLevel);

	const base = useMemo(() => hocStats(hoc, constants, level), [hoc, constants, level]);
	const chips = useMemo(() => hocChipStats(hoc, constants, level, stars), [hoc, constants, level, stars]);
	// The best HOC for each stat at this level, whose value is a full bar.
	const best = useMemo(() => bestHocStats(allHocs, constants, level), [allHocs, constants, level]);

	const handleStars = useCallback((_event: MouseEvent<HTMLElement>, value: number | null) => {
		// Clicking the selected button again reports null. Keep the current rank rather than having none.
		if (value !== null) {
			setStars(value);
		}
	}, []);

	return (
		<Box>
			<ToggleButtonGroup value={stars} exclusive onChange={handleStars} size="small" sx={styles.stars} aria-label="Star rank">
				{STAR_RANKS.map((rank) => (
					<ToggleButton key={rank} value={rank} aria-label={`${rank} star${rank === 1 ? "" : "s"}`}>
						{rank}★
					</ToggleButton>
				))}
			</ToggleButtonGroup>

			<LevelSlider id="hoc-level-label" label="Level" value={level} max={constants.maxLevel} onChange={setLevel} sx={styles.level} />

			<Box sx={styles.head}>
				<Typography variant="caption" color="text.secondary">
					Stat
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={styles.number}>
					Base
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={styles.number} title={`The most a full chip board adds at ${stars}★`}>
					Chips max
				</Typography>
			</Box>

			{HOC_STAT_KEYS.map((key) => (
				<Box key={key} sx={styles.row}>
					<Box sx={styles.values}>
						<Typography variant="body2" color="text.secondary">
							{HOC_STAT_LABELS[key]}
						</Typography>
						<Typography variant="body2" sx={[styles.number, styles.base]}>
							{base[key]}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={styles.number}>
							+{chips[key]}
						</Typography>
					</Box>
					<LinearProgress
						variant="determinate"
						value={best[key].value > 0 ? (base[key] / best[key].value) * 100 : 0}
						sx={styles.bar}
						aria-label={`${HOC_STAT_LABELS[key]} compared with ${best[key].name}, the best HOC at this level`}
					/>
					<Typography variant="caption" color="text.secondary" sx={styles.caption}>
						{base[key] >= best[key].value ? "Best of all HOCs at this level" : `Best: ${best[key].name} (${best[key].value})`}
					</Typography>
				</Box>
			))}
		</Box>
	);
});
