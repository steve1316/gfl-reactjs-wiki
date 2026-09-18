import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Component imports
import ArtPlaceholder from "../../components/ArtPlaceholder";
import ArtZoomControls from "../../components/ArtZoomControls";
import LoadError from "../../components/LoadError";
import NotFound404 from "../../not_found_404";

import { useArtPanBounds, useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { containArtSx } from "../../lib/artLayout";
import { enemyFullArtUrl } from "../../lib/assets";
import { hasEnemyArt } from "../../lib/processData";
import { useEnemies } from "../../lib/useEnemies";

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: { zIndex: { modal: number } }) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	bar: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	title: { flexGrow: 1 },
	centre: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholder: { width: 256, maxWidth: "60vw" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden" }
};

/**
 * One enemy's full art, filling the screen.
 *
 * Simpler than the doll viewer next door: an enemy has one piece of full art, with no forms, skins or damaged twin to switch
 * between, so the whole bottom control row goes away. The zoom, pan and escape-to-close behaviour comes from the same hooks, so it
 * handles identically.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function EnemyArt() {
	const { id: rawId } = useParams<{ id: string }>();
	const { data, loadFailed, retry } = useEnemies();
	const navigate = useNavigate();
	const location = useLocation();
	const [imageFailed, setImageFailed] = useState(false);

	const artRef = useRef<HTMLImageElement | null>(null);
	const panBounds = useArtPanBounds(artRef);
	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, panBounds });

	const enemy = data?.items.find((entry) => String(entry.id) === rawId);
	const source = enemy !== undefined && hasEnemyArt(enemy.id, "full") && !imageFailed ? enemyFullArtUrl(enemy.id) : null;

	// Going back leaves the viewer the way it was opened, so a reader who arrived by address still lands on the enemy's page.
	const close = useCallback(() => {
		if (location.key !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/enemy/${rawId ?? ""}`, { replace: true });
	}, [location.key, navigate, rawId]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (enemy) {
			document.title = `${enemy.name} - Art`;
		}
	}, [enemy]);

	const handleImageError = useCallback(() => setImageFailed(true), []);

	if (data !== null && enemy === undefined) {
		return <NotFound404 message={`There is no enemy with the id ${rawId ?? ""}.`} />;
	}

	return (
		<Box sx={styles.root}>
			<Box sx={styles.bar}>
				<IconButton onClick={close} aria-label="close" sx={{ color: "inherit" }}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={styles.title}>
					{enemy?.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{source === null ? null : <ArtZoomControls zoom={zoom} />}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centre}>
					<LoadError what="this enemy's art" onRetry={retry} titleComponent="h1" />
				</Box>
			) : source === null ? (
				<Box sx={styles.centre}>
					<Box sx={styles.placeholder}>
						<ArtPlaceholder name={enemy?.name ?? ""} />
					</Box>
				</Box>
			) : (
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers}>
					{/* Not draggable: a mouse drag on an image otherwise starts the browser's own image drag, which cancels the pan. */}
					<Box component="img" ref={artRef} src={source} alt="" draggable={false} onError={handleImageError} sx={containArtSx} style={zoom.contentStyle} />
				</Box>
			)}
		</Box>
	);
}
