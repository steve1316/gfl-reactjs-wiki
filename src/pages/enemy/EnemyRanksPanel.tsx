import { memo } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import RankBar from "../../components/RankBar";
import { ENEMY_MAX_RANK, ENEMY_RANK_KEYS, ENEMY_RANK_LABELS } from "../../lib/enemyRanks";
import type { EnemyRankValues } from "../../types/enemy";

const styles = {
	row: { display: "flex", alignItems: "center", gap: 2, py: 0.6 },
	label: { width: "6.5rem", flexShrink: 0 },
	bar: { flex: 1, minWidth: 0 },
	value: { width: "1.5rem", textAlign: "right", flexShrink: 0 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyRanksPanel. */
interface EnemyRanksPanelProps {
	/** The archive's rank bars for this enemy. */
	ranks: EnemyRankValues;
}

/**
 * The archive's rank bars for one enemy. These are ratings out of seven rather than stats, and they are the comparable
 * measure the game itself puts in front of a player.
 *
 * @param props Component props.
 * @returns The rank bars.
 */
export default memo(function EnemyRanksPanel({ ranks }: EnemyRanksPanelProps) {
	return (
		<Box>
			{ENEMY_RANK_KEYS.map((key) => (
				<Box key={key} sx={styles.row}>
					<Typography variant="body2" color="text.secondary" sx={styles.label}>
						{ENEMY_RANK_LABELS[key]}
					</Typography>
					<Box sx={styles.bar}>
						<RankBar value={ranks[key]} max={ENEMY_MAX_RANK} label={ENEMY_RANK_LABELS[key]} />
					</Box>
					<Typography variant="body2" sx={styles.value}>
						{ranks[key]}
					</Typography>
				</Box>
			))}
		</Box>
	);
});
