import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, CircularProgress, Container, Typography } from "@mui/material";

import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { loadFormationData } from "../../lib/data";
import { placedForms, placedSources } from "../../lib/formation/pipeline";
import type { FormationData } from "../../types/formation";
import FormationStage from "./FormationStage";
import { useFormationState } from "./useFormationState";

/**
 * The Formation Simulator: place T-Dolls on the grid and see their stats.
 *
 * @returns The page.
 */
export default function FormationSimulator() {
	const [data, setData] = useState<FormationData | null>(null);
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const formation = useFormationState(data);
	const [selectedCell, setSelectedCell] = useState<number | null>(null);
	const [moveFrom, setMoveFrom] = useState<number | null>(null);
	// Worked out once here and shared, so the stage, the modal and the results do not each redo it.
	const placed = useMemo(() => (data ? placedForms(formation.setups, data.forms) : []), [data, formation.setups]);
	const sources = useMemo(() => (data ? placedSources(placed, data.constants) : []), [data, placed]);

	useEffect(() => {
		document.title = "Formation Simulator";
	}, []);

	useEffect(() => {
		let active = true;
		setFailed(false);
		loadFormationData()
			.then((loaded) => active && setData(loaded))
			.catch((error: unknown) => {
				console.error("Formation data failed to load:", error);
				if (active) {
					setFailed(true);
				}
			});
		return () => {
			active = false;
		};
	}, [attempt]);

	const retry = useCallback(() => setAttempt((count) => count + 1), []);
	const handleTileClick = useCallback((cell: number) => setSelectedCell(cell), []);
	const handleMove = useCallback(
		(from: number, to: number) => {
			formation.moveDoll(from, to);
			setMoveFrom(null);
		},
		[formation.moveDoll]
	);
	const cancelMove = useCallback(() => setMoveFrom(null), []);

	return (
		<Box component="main" sx={{ py: 3 }}>
			<ScrollToTop />
			<Container maxWidth="xl">
				<Typography component="h1" variant="h5" gutterBottom>
					Formation Simulator
				</Typography>
				{failed ? (
					<LoadError what="the formation data" onRetry={retry} titleComponent="h2" />
				) : !data ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
						<CircularProgress aria-label="Loading formation data" />
					</Box>
				) : (
					<FormationStage
						placed={placed}
						sources={sources}
						constants={data.constants}
						selectedCell={selectedCell}
						moveFrom={moveFrom}
						onTileClick={handleTileClick}
						onMove={handleMove}
						onCancelMove={cancelMove}
					/>
				)}
			</Container>
		</Box>
	);
}
