import { memo } from "react";

import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import type { CombatEstimate } from "../../lib/formation/combat";
import type { EffectiveDoll } from "../../lib/formation/pipeline";
import { dollName } from "./dollNames";

/** Props for CombatPanel. */
interface CombatPanelProps {
	/** The fight's estimate, or null when either side of the field is empty. */
	estimate: CombatEstimate | null;
	/** The echelon's results, to name each row. */
	results: readonly EffectiveDoll[];
}

/**
 * Round a number for display, keeping one decimal only while it is small enough for one to matter.
 *
 * @param value The number.
 * @returns The text.
 */
function round(value: number): string {
	if (!Number.isFinite(value)) {
		return "-";
	}
	return value >= 100 ? String(Math.round(value)) : String(Math.round(value * 10) / 10);
}

/**
 * The damage estimate for the fight on the stage.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function CombatPanel({ estimate, results }: CombatPanelProps) {
	if (!estimate) {
		return (
			<Card>
				<CardContent>
					<Typography variant="subtitle2" color="text.secondary" component="h2" gutterBottom>
						Damage estimate
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Put dolls on the left grid and enemies on the right to see an estimate.
					</Typography>
				</CardContent>
			</Card>
		);
	}

	const nameFor = (cell: number) => {
		const doll = results.find((entry) => entry.setup.cell === cell);
		return doll ? dollName(doll.setup.dollId, doll.setup.modStage) : `Cell ${cell + 1}`;
	};

	return (
		<Card>
			<CardContent>
				<Typography variant="subtitle2" color="text.secondary" component="h2" gutterBottom>
					Damage estimate
				</Typography>

				<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 1, mb: 1.5 }}>
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
							Echelon DPS
						</Typography>
						<Typography variant="h6">{round(estimate.totalDps)}</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
							Enemy HP
						</Typography>
						<Typography variant="h6">{estimate.enemyHp.toLocaleString()}</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
							Time to clear
						</Typography>
						<Typography variant="h6">{estimate.secondsToClear === null ? "-" : `${round(estimate.secondsToClear)}s`}</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
							Incoming DPS
						</Typography>
						<Typography variant="h6">{round(estimate.incomingDps)}</Typography>
					</Box>
				</Box>

				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Doll</TableCell>
							<TableCell align="right">Hit</TableCell>
							<TableCell align="right">Per shot</TableCell>
							<TableCell align="right">Every</TableCell>
							<TableCell align="right">DPS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{estimate.dolls.map(({ cell, estimate: shot }) => (
							<TableRow key={cell}>
								<TableCell component="th" scope="row">
									{nameFor(cell)}
								</TableCell>
								<TableCell align="right">{Math.round(shot.hitChance * 100)}%</TableCell>
								<TableCell align="right">{round(shot.damagePerShot)}</TableCell>
								<TableCell align="right">{Number.isFinite(shot.shotInterval) ? `${round(shot.shotInterval)}s` : "-"}</TableCell>
								<TableCell align="right">{round(shot.dps)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
					An estimate of sustained fire, not a simulation of a battle. Every doll is measured against the sturdiest enemy on the field, and skills, reloads, movement, cover, night fighting
					and targeting order are all left out. Treat it as a way to compare two echelons rather than as the damage the game will deal.
				</Typography>
			</CardContent>
		</Card>
	);
});
