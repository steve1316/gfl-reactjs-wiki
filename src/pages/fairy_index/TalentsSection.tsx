import { memo, useMemo } from "react";

// MaterialUI imports
import { Box, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { FairyTalent } from "../../types/fairy";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** The talent groups, in display order. `rank` matches `FairyTalent.rank`: 0 is Special, 1 is Tier I, 2 is Tier II. */
const TALENT_GROUPS: { rank: number; label: string }[] = [
	{ rank: 1, label: "Tier I" },
	{ rank: 2, label: "Tier II" },
	{ rank: 0, label: "Special" }
];

const styles = {
	root: { p: { xs: 2, md: 2.5 }, mt: 4 },
	heading: { mb: 1.5 },
	group: { mt: 2, "&:first-of-type": { mt: 0 } },
	groupHeading: { mb: 1 },
	talent: { py: 1, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0, pb: 0 } },
	name: { fontWeight: 700 },
	description: { mt: 0.25 }
} satisfies Record<string, SxProps<Theme>>;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers

/**
 * Group talents by rank, in `TALENT_GROUPS` order, dropping any group with nothing in it.
 *
 * @param talents Every talent, in table order.
 * @returns Each group with a label and its talents, only for groups that have at least one.
 */
function groupTalents(talents: FairyTalent[]): { rank: number; label: string; talents: FairyTalent[] }[] {
	return TALENT_GROUPS.map((group) => ({ ...group, talents: talents.filter((talent) => talent.rank === group.rank) })).filter((group) => group.talents.length > 0);
}

/** Props for TalentsSection. */
interface TalentsSectionProps {
	/** Every fairy talent, in table order. */
	talents: FairyTalent[];
}

/**
 * Every fairy talent, grouped into Tier I, Tier II and Special.
 *
 * @param props Component props.
 * @returns The section.
 */
export default memo(function TalentsSection({ talents }: TalentsSectionProps) {
	const groups = useMemo(() => groupTalents(talents), [talents]);

	return (
		<Paper id="talents" sx={styles.root} variant="outlined">
			<Typography variant="h6" component="h2" sx={styles.heading}>
				Talents
			</Typography>
			{groups.map((group) => (
				<Box key={group.rank} sx={styles.group}>
					<Typography variant="subtitle1" component="h3" sx={styles.groupHeading}>
						{group.label}
					</Typography>
					{group.talents.map((talent) => (
						<Box key={talent.id} sx={styles.talent}>
							<Typography component="div" sx={styles.name}>
								{talent.name}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={styles.description}>
								{talent.description}
							</Typography>
						</Box>
					))}
				</Box>
			))}
		</Paper>
	);
});
