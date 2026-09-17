import { memo } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { EnemyStatKey, EnemyStatValues } from "../../types/enemy";

/** The stat keys in display order. */
const STAT_KEYS: readonly EnemyStatKey[] = ["hp", "damage", "accuracy", "evasion", "rateOfFire", "armor", "armorPiercing", "range", "speed", "number"];

/** Each stat's name as the game shows it. */
const STAT_LABELS: Record<EnemyStatKey, string> = {
	hp: "HP",
	damage: "Damage",
	accuracy: "Accuracy",
	evasion: "Evasion",
	rateOfFire: "Rate of Fire",
	armor: "Armor",
	armorPiercing: "Armor Piercing",
	range: "Range",
	speed: "Speed",
	number: "Units per squad"
};

const styles = {
	row: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } },
	note: { mt: 1.5, display: "block" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyStatsPanel. */
interface EnemyStatsPanelProps {
	/** The enemy's base deployment stats. */
	stats: EnemyStatValues;
	/** The level the stats are quoted at, or null when upstream records none. */
	level: number | null;
}

/**
 * One enemy's base deployment stats.
 *
 * The numbers are the base unit's own row, not what a player meets on a map: the game deploys the same enemy at different
 * levels and scales it, so the note under the table says so rather than letting these read as final.
 *
 * @param props Component props.
 * @returns The stat table.
 */
export default memo(function EnemyStatsPanel({ stats, level }: EnemyStatsPanelProps) {
	return (
		<Box>
			{STAT_KEYS.map((key) => (
				<Box key={key} sx={styles.row}>
					<Typography variant="body2" color="text.secondary">
						{STAT_LABELS[key]}
					</Typography>
					<Typography variant="body2">{stats[key].toLocaleString()}</Typography>
				</Box>
			))}
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				Base deployment values{level === null ? "" : ` at level ${level}`}. The game scales these by the level and mode an enemy is deployed in, so the rank bars are the better way to compare
				two enemies.
			</Typography>
		</Box>
	);
});
