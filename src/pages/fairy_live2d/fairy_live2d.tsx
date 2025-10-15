import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import CloseIcon from "@mui/icons-material/Close";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import ArtZoomControls from "../../components/ArtZoomControls";
import FilterChip from "../../components/FilterChip";
import LoadError from "../../components/LoadError";
import StarRankPicker from "../../components/StarRankPicker";
import { useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { fairyLive2dModelUrl } from "../../lib/assets";
import { FAIRY_MAX_STARS, fairyForm } from "../../lib/fairyStats";
import { hasFairyLive2d } from "../../lib/processData";
import { useFairies } from "../../lib/useFairies";
import { motionTabs, useFairyLive2dMotions } from "../../lib/useLive2dMotions";
import { useLive2dStage } from "../../lib/useLive2dStage";
import NotFound404 from "../../not_found_404";

/**
 * The lowest star rank in each art form, index 0 = form 1. Mirrors `FairyConstants.forms`' first entries, since a
 * legacy `?form=` link must resolve to a rank before the data loads.
 */
const FORM_LOWEST_STARS = [1, 3, 5];

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: Theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	header: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	iconButton: { color: "inherit" },
	title: { flexGrow: 1 },
	centred: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholderStage: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	placeholderBox: { width: 256, maxWidth: "60vw" },
	placeholder: { aspectRatio: "1 / 1" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden", cursor: "pointer" },
	canvas: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" },
	statusOverlay: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	footer: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 1 },
	starPicker: { maxWidth: 360 },
	tiles: { display: "flex", flexWrap: "wrap", justifyContent: "center", listStyle: "none", p: 0, m: 0, gap: 0.5 }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Read the star rank from the `stars` parameter, or, for a legacy link, the lowest rank of the `form` parameter.
 *
 * @param params The page's search params.
 * @returns The rank from `stars`, the lowest rank of a valid `form`, or `FAIRY_MAX_STARS` when neither parses.
 */
function parseStars(params: URLSearchParams): number {
	const starsValue = Number(params.get("stars"));
	if (Number.isInteger(starsValue) && starsValue >= 1 && starsValue <= FAIRY_MAX_STARS) {
		return starsValue;
	}
	const formValue = Number(params.get("form"));
	const lowest = Number.isInteger(formValue) ? FORM_LOWEST_STARS[formValue - 1] : undefined;
	return lowest ?? FAIRY_MAX_STARS;
}

/**
 * Full-screen Live2D viewer for a fairy's model, with zoom, pan, motion cycling and a star rank picker.
 *
 * A route rather than an overlay, like the fairy art viewer, so Back closes it and the rank on screen can be linked to.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function FairyLive2d() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data, loadFailed, retry } = useFairies();

	// Captured at open, since the star picker's replace gives the location a new key and would hide a pasted link's `default` key.
	const openedKey = useRef(location.key);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, doubleClickZoom: false });

	const fairy = data?.items.find((entry) => String(entry.id) === id);
	const stars = parseStars(searchParams);
	const form = data !== null ? fairyForm(data.constants, stars) : 1;
	const hosted = fairy !== undefined && hasFairyLive2d(fairy.id, form);
	const modelUrl = fairy !== undefined && hosted ? fairyLive2dModelUrl(fairy.id, form) : undefined;

	const motions = useFairyLive2dMotions(fairy !== undefined && hosted ? fairy.id : undefined);
	const tabs = useMemo(() => motionTabs(motions ?? []), [motions]);

	const live2dStage = useLive2dStage(canvasRef, modelUrl, tabs, zoom.containerRef);

	// Opened from the fairy page, going back returns to it. Opened from a pasted link there is nothing to go back to, so the fairy page opens instead.
	const close = useCallback(() => {
		if (openedKey.current !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/fairy/${id ?? ""}`, { replace: true });
	}, [navigate, id]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (fairy) {
			document.title = `${fairy.name} Live2D`;
		}
	}, [fairy]);

	// Replaces rather than pushes, so Back still closes the viewer in one step, matching `fairy_art.tsx`'s form picker.
	const handleStars = useCallback((next: number) => setSearchParams({ stars: String(next) }, { replace: true }), [setSearchParams]);

	const handleTileToggle = useCallback((value?: string | number) => live2dStage.playMotion(String(value)), [live2dStage.playMotion]);

	// A click anywhere on the stage advances to the next motion in the tile order, same as the fairy card and the HOC panel.
	const handleStageClick = useCallback(() => {
		if (zoom.wasDragged()) {
			return;
		}
		live2dStage.advance();
	}, [zoom.wasDragged, live2dStage.advance]);

	if (data !== null && fairy === undefined) {
		return <NotFound404 message={`There is no fairy with the id ${id ?? ""}.`} />;
	}

	return (
		<Box sx={styles.root}>
			<Box sx={styles.header}>
				<IconButton onClick={close} aria-label="close" sx={styles.iconButton}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={styles.title}>
					{fairy?.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{hosted && !loadFailed ? <ArtZoomControls zoom={zoom} /> : null}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centred}>
					<LoadError what="this fairy" onRetry={retry} titleComponent="h1" />
				</Box>
			) : (
				// Always mounted, since the zoom hook attaches its wheel and resize listeners to this box once, on mount.
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers} onClick={handleStageClick}>
					{fairy === undefined ? null : hosted ? (
						<>
							<Box key={modelUrl} component="canvas" ref={canvasRef} sx={styles.canvas} style={zoom.contentStyle} />
							{live2dStage.status === "error" ? (
								<Box sx={styles.statusOverlay}>
									<LoadError what="this fairy's Live2D model" onRetry={live2dStage.retry} />
								</Box>
							) : live2dStage.status === "loading" ? (
								<Box sx={styles.statusOverlay}>
									<Typography variant="body2" color="common.white" sx={{ opacity: 0.7 }}>
										Loading...
									</Typography>
								</Box>
							) : null}
						</>
					) : (
						<Box sx={styles.placeholderStage}>
							<Box sx={styles.placeholderBox}>
								<ArtPlaceholder name={fairy.name} sx={styles.placeholder} />
							</Box>
						</Box>
					)}
				</Box>
			)}

			{data !== null && !loadFailed ? (
				<Box sx={styles.footer}>
					<StarRankPicker value={stars} max={FAIRY_MAX_STARS} onChange={handleStars} sx={styles.starPicker} />
					{hosted ? (
						<Box component="ul" sx={styles.tiles} aria-label="Motions">
							{tabs.map((tab) => (
								<li key={tab.value}>
									<FilterChip label={tab.label} selected={tab.value === live2dStage.motion} value={tab.value} onToggle={handleTileToggle} />
								</li>
							))}
						</Box>
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
