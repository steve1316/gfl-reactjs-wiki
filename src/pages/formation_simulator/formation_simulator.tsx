import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, CircularProgress, Container, Typography } from "@mui/material";

import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { loadFormationData } from "../../lib/data";
import { effectiveEchelon, placedForms, placedSources } from "../../lib/formation/pipeline";
import type { FormationData } from "../../types/formation";
import DollModal from "./DollModal";
import { dollName } from "./dollNames";
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
	const results = useMemo(() => (data ? effectiveEchelon(formation.setups, data.forms, data.constants, sources) : []), [data, formation.setups, sources]);

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
	const closeModal = useCallback(() => setSelectedCell(null), []);
	const startMove = useCallback((cell: number) => {
		setSelectedCell(null);
		setMoveFrom(cell);
	}, []);

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
					<>
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
						{moveFrom !== null && (
							<Typography role="status" color="primary" sx={{ mt: 1 }}>
								Tap the tile to move {dollName(formation.setups.find((setup) => setup.cell === moveFrom)?.dollId ?? 0, 0)} to.
							</Typography>
						)}
						<DollModal
							open={selectedCell !== null}
							cell={selectedCell}
							data={data}
							formation={formation}
							results={results}
							sources={sources}
							onClose={closeModal}
							onStartMove={startMove}
						/>
					</>
				)}
			</Container>
		</Box>
	);
}
