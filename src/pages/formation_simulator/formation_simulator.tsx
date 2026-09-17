import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

import { Box, Button, Card, CircularProgress, Container, Fab, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import FilterChip from "../../components/FilterChip";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { useZoomPan } from "../../hooks/useZoomPan";
import { loadFormationData } from "../../lib/data";
import { effectiveEchelon, placedForms, placedSources } from "../../lib/formation/pipeline";
import type { FormationData } from "../../types/formation";
import DollModal from "./DollModal";
import { dollName } from "./dollNames";
import EchelonSidebar from "./EchelonSidebar";
import FormationStage from "./FormationStage";
import ResultsTable from "./ResultsTable";
import { useFormationState } from "./useFormationState";

/** The Material "restart alt" icon path. Drawn inline because importing the icon module added an export to the main chunk. */
const RESET_ICON_PATH =
	"M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8m-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91";

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
	// On by default: every buffed tile shows what it adds up to, whether or not a doll is being pointed at.
	const [showTotals, setShowTotals] = useState(true);
	// Where a doll being dragged would land, so every number on the page follows the drag. Cleared when it is put down.
	const [dragPreview, setDragPreview] = useState<{ from: number; over: number } | null>(null);
	// The echelon as it would be after the drop: the dragged doll and the one on the tile under it swap, as the drop itself does.
	const previewSetups = useMemo(() => {
		if (!dragPreview) {
			return formation.setups;
		}
		const { from, over } = dragPreview;
		return formation.setups.map((setup) => (setup.cell === from ? { ...setup, cell: over } : setup.cell === over ? { ...setup, cell: from } : setup));
	}, [dragPreview, formation.setups]);
	// Worked out once here and shared, so the stage, the modal and the results do not each redo it. The chibis stand where the dolls really
	// are, so the stage takes `placed`, while the tiles, stats and results take the previewed echelon.
	const placed = useMemo(() => (data ? placedForms(formation.setups, data.forms) : []), [data, formation.setups]);
	const previewPlaced = useMemo(() => (data ? placedForms(previewSetups, data.forms) : []), [data, previewSetups]);
	const sources = useMemo(() => (data ? placedSources(previewPlaced, data.constants) : []), [data, previewPlaced]);
	const results = useMemo(() => (data ? effectiveEchelon(previewSetups, data.forms, data.constants, sources) : []), [data, previewSetups, sources]);
	// The doll being moved by tap-to-move, if any.
	const moving = moveFrom === null ? undefined : formation.setups.find((setup) => setup.cell === moveFrom);
	const theme = useTheme();
	const phone = useMediaQuery(theme.breakpoints.down("sm"));
	const zoomSurfaceRef = useRef<HTMLDivElement | null>(null);
	// A zoomed stage can pan only until its edge meets the card edge, so it can never be lost off the card.
	const panBounds = useCallback((scale: number) => {
		const surface = zoomSurfaceRef.current;
		return { x: surface ? (surface.clientWidth * (scale - 1)) / 2 : 0, y: surface ? (surface.clientHeight * (scale - 1)) / 2 : 0 };
	}, []);
	// Phones pinch to zoom the stage so the tile labels are readable. A pan ends in a tile press, which the handlers below ignore.
	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 3, doubleClickZoom: false, panBounds });

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

	// Escape leaves tap-to-move.
	useEffect(() => {
		if (moveFrom === null) {
			return;
		}
		const handleKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMoveFrom(null);
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [moveFrom]);

	const retry = useCallback(() => setAttempt((count) => count + 1), []);
	// Whether a stage press ended a phone pan rather than a tap. Only phones spread the zoom handlers that reset the drag flag, so a flag left
	// from a phone gesture is ignored on wider screens.
	const panned = useCallback(() => phone && zoom.wasDragged(), [phone, zoom.wasDragged]);
	const handleTileClick = useCallback(
		(cell: number) => {
			if (!panned()) {
				setSelectedCell(cell);
			}
		},
		[panned]
	);
	const handleMove = useCallback(
		(from: number, to: number) => {
			if (!panned()) {
				formation.moveDoll(from, to);
				setMoveFrom(null);
			}
		},
		[formation.moveDoll, panned]
	);
	const cancelMove = useCallback(() => setMoveFrom(null), []);
	const previewDrag = useCallback((preview: { from: number; over: number } | null) => setDragPreview(preview), []);
	const toggleTotals = useCallback(() => setShowTotals((shown) => !shown), []);
	const handleCancelMove = useCallback(() => {
		if (!panned()) {
			setMoveFrom(null);
		}
	}, [panned]);
	const closeModal = useCallback(() => setSelectedCell(null), []);
	const stopPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => event.stopPropagation(), []);
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
						{/* A plain CSS grid rather than MUI Grid: importing Grid here moved it out of the main chunk and grew every page's first load. */}
						<Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 2fr) minmax(0, 1fr)" }, gap: 2, alignItems: "start" }}>
							<Box>
								<Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
									<FilterChip label="Show tile totals" selected={showTotals} onToggle={toggleTotals} />
								</Box>
								<Card sx={{ p: { xs: 0.5, md: 1.5 }, overflow: "hidden", position: "relative" }}>
									{/* Not the hook's containerRef: the hook would then attach its wheel listener, and a mouse wheel should keep scrolling the page. */}
									<Box ref={zoomSurfaceRef} {...(phone ? zoom.handlers : {})} style={phone ? zoom.containerStyle : undefined}>
										<Box style={phone ? zoom.contentStyle : undefined}>
											<FormationStage
												placed={placed}
												sources={sources}
												selectedCell={selectedCell}
												moveFrom={moveFrom}
												onTileClick={handleTileClick}
												onMove={handleMove}
												onCancelMove={handleCancelMove}
												canDrag={!phone}
												showTotals={showTotals}
												onDragPreview={previewDrag}
											/>
										</Box>
									</Box>
									{phone && zoom.isZoomed && (
										<Fab
											size="small"
											color="primary"
											onPointerDown={stopPointerDown}
											onClick={zoom.reset}
											aria-label="reset view"
											sx={{ position: "absolute", right: 8, bottom: 8, opacity: 0.9 }}
										>
											<svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
												<path d={RESET_ICON_PATH} />
											</svg>
										</Fab>
									)}
								</Card>
								{moveFrom !== null && (
									<Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
										<Typography role="status" color="primary">
											Tap the tile to move {dollName(moving?.dollId ?? 0, moving?.modStage ?? 0)} to.
										</Typography>
										<Button size="small" onClick={cancelMove}>
											Cancel
										</Button>
									</Box>
								)}
							</Box>
							<EchelonSidebar results={results} />
						</Box>
						<Box sx={{ mt: 2 }}>
							<ResultsTable results={results} />
						</Box>
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
