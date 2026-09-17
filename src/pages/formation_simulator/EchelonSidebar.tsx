import { memo } from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";

import { MAX_ECHELON } from "../../lib/formation/pipeline";
import type { EffectiveDoll } from "../../lib/formation/pipeline";

/** Props for EchelonSidebar. */
interface EchelonSidebarProps {
	/** Computed results for the echelon. */
	results: EffectiveDoll[];
}

/**
 * The echelon summary and the fairy and enemy cards beside the stage. Fairies arrive in Milestone 3 and enemies with damage estimates in Milestone 4,
 * so their cards say so for now.
 *
 * @param props Component props.
 * @returns The sidebar.
 */
export default memo(function EchelonSidebar({ results }: EchelonSidebarProps) {
	const totalHp = results.reduce((sum, doll) => sum + doll.stats.hp, 0);
	const capped = results.filter((doll) => doll.rofCapped).length;
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: { md: "sticky" }, top: { md: 88 } }}>
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
			<Card>
				<CardContent>
					<Typography variant="subtitle2" color="text.secondary">
						Fairy
					</Typography>
					<Typography variant="body2">Fairies are coming soon.</Typography>
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<Typography variant="subtitle2" color="text.secondary">
						Enemy
					</Typography>
					<Typography variant="body2">Enemies and damage estimates are coming soon.</Typography>
				</CardContent>
			</Card>
		</Box>
	);
});
