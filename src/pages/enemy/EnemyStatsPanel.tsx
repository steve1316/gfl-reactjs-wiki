import { memo } from "react";

// MaterialUI imports
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import RankBar from "../../components/RankBar";
import { ENEMY_RANK_LABELS } from "../../lib/enemyRanks";
import type { EnemyRankKey, EnemyRankValues, EnemyStatKey, EnemyStatValues } from "../../types/enemy";

/**
 * The stat rows in display order, each with the archive's own rank bar for it.
 *
 * The bars used to be a card of their own, which left a reader with two lists of the same six things and no hint that they were
 * related. They are the game's 0 to 7 ratings from `enemy_illustration`, and they only mean anything next to the number they rate.
 *
 * Every row here has one, so the table has no empty cells. The archive ships no rating for armor piercing and none for squad size,
 * and its one rating with no stat behind it is tenacity, so all three are reported by the spec sheet in the hero instead.
 */
const STAT_ROWS: readonly { key: EnemyStatKey; label: string; rank: EnemyRankKey }[] = [
	{ key: "hp", label: "HP", rank: "health" },
	{ key: "damage", label: "Damage", rank: "power" },
	{ key: "accuracy", label: "Accuracy", rank: "accuracy" },
	{ key: "evasion", label: "Evasion", rank: "evasion" },
	{ key: "rateOfFire", label: "Rate of fire", rank: "rateOfFire" },
	{ key: "armor", label: "Armor", rank: "armor" },
	{ key: "range", label: "Range", rank: "range" },
	{ key: "speed", label: "Speed", rank: "speed" }
];

const styles = {
	container: {
		width: "100%"
	},
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.raised
	}),
	// Wide enough for seven segments and no wider, so the label and the number keep their room on a phone.
	rankCell: {
		width: 96,
		px: 1
	},
	note: {
		mt: 1.5,
		display: "block"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyStatsPanel. */
interface EnemyStatsPanelProps {
	/** The enemy's base deployment stats, or null for the few enemies the archive records none for. */
	stats: EnemyStatValues | null;
	/** The archive's rank bars for this enemy, shown beside the stat each one rates. */
	ranks: EnemyRankValues;
	/** The level the stats are quoted at, or null when upstream records none. */
	level: number | null;
}

/**
 * One enemy's base deployment stats, each with the archive's rank bar for it.
 *
 * Laid out as the doll page's own stat table, so the two pages read the same way. The numbers are the base unit's own row rather
 * than what a player meets on a map: the game deploys the same enemy at different levels and scales it, which is what the note says.
 *
 * @param props Component props.
 * @returns The stat table, or a note when the archive records no stats.
 */
export default memo(function EnemyStatsPanel({ stats, ranks, level }: EnemyStatsPanelProps) {
	if (stats === null) {
		return (
			<Typography variant="body2" color="text.secondary">
				The archive records no stats for this enemy.
			</Typography>
		);
	}

	return (
		<>
			<TableContainer sx={styles.container} component={Paper}>
				<Table sx={styles.table} size="small">
					<TableHead>
						<TableRow>
							<TableCell>Stats</TableCell>
							<TableCell sx={styles.rankCell}>Rank</TableCell>
							<TableCell align="right">{level === null ? "Base" : `At level ${level}`}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{STAT_ROWS.map((row) => (
							<TableRow key={row.key}>
								<TableCell component="th" scope="row">
									{row.label}
								</TableCell>
								<TableCell sx={styles.rankCell}>
									<RankBar value={ranks[row.rank]} label={ENEMY_RANK_LABELS[row.rank]} />
								</TableCell>
								<TableCell align="right">{stats[row.key].toLocaleString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				These are the enemy&apos;s base numbers. The game raises them for the level and difficulty you actually meet it at, so what you fight is usually stronger than this. The bars are the 0
				to 7 ratings the game&apos;s own Enemy Archive shows, and they are the quicker way to see how two enemies compare.
			</Typography>
		</>
	);
});
