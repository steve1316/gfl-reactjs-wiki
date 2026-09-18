import { memo } from "react";

import { Card, CardContent, Typography } from "@mui/material";

import { MAX_ECHELON } from "../../lib/formation/pipeline";
import type { EffectiveDoll } from "../../lib/formation/pipeline";

/** Props for EchelonSidebar. */
interface EchelonSidebarProps {
	/** Computed results for the echelon. */
	results: EffectiveDoll[];
}

/**
 * The echelon summary beside the stage: how many dolls are placed, their pooled health, and a warning when any of them is wasting rate of fire.
 *
 * @param props Component props.
 * @returns The sidebar.
 */
export default memo(function EchelonSidebar({ results }: EchelonSidebarProps) {
	const totalHp = results.reduce((sum, doll) => sum + doll.stats.hp, 0);
	const capped = results.filter((doll) => doll.rofCapped).length;
	return (
		<Card>
			<CardContent>
				<Typography variant="subtitle2" color="text.secondary">
					Echelon
				</Typography>
				<Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>
					{results.length}/{MAX_ECHELON}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{totalHp.toLocaleString()} total HP
				</Typography>
				{capped > 0 && (
					<Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
						{capped} {capped === 1 ? "doll is" : "dolls are"} at the rate of fire cap
					</Typography>
				)}
			</CardContent>
		</Card>
	);
});
