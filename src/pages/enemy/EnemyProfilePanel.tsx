import { Fragment, memo, useMemo } from "react";

// MaterialUI imports
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { ENEMY_MAX_RANK, ENEMY_RANK_LABELS } from "../../lib/enemyRanks";
import type { EnemyDetails, EnemyRankValues } from "../../types/enemy";

/** Panel width from which the two blocks sit side by side and the spec sheet splits into two columns. Measured on the panel, not the viewport. */
const WIDE = "@container (min-width: 880px)";

const styles = {
	// The container the layout queries. The hero's info column is centred on a phone, so the lists are pulled back to the left.
	root: {
		containerType: "inline-size",
		alignSelf: "stretch",
		width: "100%",
		textAlign: "left",
		pt: 1.5
	},
	layout: {
		display: "flex",
		flexDirection: "column",
		gap: 2.5,
		[WIDE]: { flexDirection: "row", gap: 4 }
	},
	profileBlock: {
		minWidth: 0,
		[WIDE]: { flex: "0 0 290px" }
	},
	specsBlock: {
		minWidth: 0,
		flex: "1 1 0"
	},
	sectionLabel: {
		display: "block",
		mb: 0.75,
		color: "text.secondary"
	},
	profileList: {
		display: "grid",
		gridTemplateColumns: "max-content minmax(0, 1fr)",
		columnGap: 2,
		rowGap: 0.5,
		m: 0,
		typography: "body2",
		"& dt": { color: "text.secondary" },
		"& dd": { m: 0, overflowWrap: "break-word" }
	},
	// One label and value pair per row on a narrow panel, two pairs per row on a wide one.
	specList: {
		display: "grid",
		gridTemplateColumns: "max-content minmax(0, 1fr)",
		columnGap: 2,
		rowGap: 0.5,
		m: 0,
		typography: "caption",
		fontSize: { sm: "0.78125rem" },
		lineHeight: 1.4,
		"& dt": { color: "text.secondary", whiteSpace: "nowrap" },
		"& dd": { m: 0, color: "text.primary", overflowWrap: "break-word" },
		[WIDE]: {
			gridTemplateColumns: "max-content minmax(0, 1fr) max-content minmax(0, 1fr)",
			// Extra room before the second column's labels, so its values do not run into them.
			"& dt:nth-of-type(2n)": { pl: 1.5 }
		}
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyProfilePanel. */
interface EnemyProfilePanelProps {
	/** Faction name, such as "Paradeus". */
	faction: string;
	/** Whether this is one of the named boss and Ringleader tier. */
	boss: boolean;
	/** Whether Protocol Assimilation can capture this enemy. */
	capturable: boolean;
	/** The game's unit code, such as `BossArchitect`, which is also what names its asset bundles. */
	code: string;
	/** How many tiers this enemy's family has, including the base. */
	variantCount: number;
	/** The archive's rank bars, which is where tenacity is reported since it has no stat of its own. */
	ranks: EnemyRankValues;
	/** The page half of the enemy's record, or undefined while it is still loading. */
	details: EnemyDetails | undefined;
}

/**
 * The enemy's profile and its deployment spec sheet, shown in the hero under the variant pills.
 *
 * The doll page puts the same two blocks in the same place, one describing where the doll comes from and one listing its gun's
 * figures. An enemy's equivalents are which faction and facility it belongs to, and the few deployment facts the Stats card beside
 * it does not already carry.
 *
 * @param props Component props.
 * @returns The Profile block, and the Specifications block beside it.
 */
export default memo(function EnemyProfilePanel({ faction, boss, capturable, code, variantCount, ranks, details }: EnemyProfilePanelProps) {
	const profileRows = useMemo(() => {
		const rows: { label: string; value: string }[] = [
			{ label: "Faction", value: faction },
			{ label: "Class", value: boss ? "Boss / Ringleader" : "Standard unit" }
		];
		if (details?.organisation) {
			// Upstream calls these the enemy's `organization`, which in the archive means the facility it was built or trained at.
			rows.push({ label: "Facility", value: details.organisation });
		}
		if (variantCount > 1) {
			rows.push({ label: "Tiers", value: `${variantCount} models` });
		}
		rows.push({ label: "Assimilation", value: capturable ? "Capturable" : "Cannot be captured" });
		return rows;
	}, [faction, boss, capturable, variantCount, details]);

	const specRows = useMemo(() => {
		// Only what the Stats card does not already say. The level the numbers are quoted at is the stat table's own column
		// heading, and counting the skills says nothing the Abilities card beside it does not show in full.
		const rows: { label: string; value: string }[] = [{ label: "Unit code", value: code }];
		const stats = details?.baseStats;
		if (stats) {
			rows.push({ label: "Squad size", value: stats.number === 1 ? "1 unit" : `${stats.number} units` });
			// Reported here rather than in the Stats card, which only carries the stats the archive puts a rating against.
			rows.push({ label: "Armor piercing", value: String(stats.armorPiercing) });
		}
		// The archive's ninth rating, which has no stat of its own to sit beside in the Stats card.
		if (ranks.tenacity > 0) {
			rows.push({ label: ENEMY_RANK_LABELS.tenacity, value: `${ranks.tenacity} of ${ENEMY_MAX_RANK}` });
		}
		return rows;
	}, [code, ranks, details]);

	return (
		<Box sx={styles.root}>
			<Box sx={styles.layout}>
				<Box sx={styles.profileBlock}>
					<Typography variant="overline" component="h2" sx={styles.sectionLabel}>
						Profile
					</Typography>
					<Box component="dl" sx={styles.profileList}>
						{profileRows.map((row) => (
							<Fragment key={row.label}>
								<dt>{row.label}</dt>
								<dd>{row.value}</dd>
							</Fragment>
						))}
					</Box>
				</Box>

				<Box sx={styles.specsBlock}>
					<Typography variant="overline" component="h2" sx={styles.sectionLabel}>
						Deployment specifications
					</Typography>
					<Box component="dl" sx={styles.specList}>
						{specRows.map((row) => (
							<Fragment key={row.label}>
								<dt>{row.label}</dt>
								<dd>{row.value}</dd>
							</Fragment>
						))}
					</Box>
				</Box>
			</Box>
		</Box>
	);
});
