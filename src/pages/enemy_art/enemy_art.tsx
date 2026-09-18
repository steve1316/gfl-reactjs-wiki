import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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
import { loadEnemyDetails } from "../../lib/data";
import { hasEnemyArt } from "../../lib/processData";
import { useEnemies } from "../../lib/useEnemies";
import type { EnemyDetailsData } from "../../types/enemy";

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: { zIndex: { modal: number } }) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	bar: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	title: { flexGrow: 1 },
	centre: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholder: { width: 256, maxWidth: "60vw" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden" },
	// Wraps so an enemy with several tiers keeps every button on a phone screen instead of spilling off both edges.
	controls: { display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" },
	toggleGroup: { flexWrap: "wrap", justifyContent: "center" },
	toggleButton: { color: "common.white" }
};

/**
 * One enemy's full art, filling the screen.
 *
 * Built to handle exactly like the doll viewer next door: the same zoom, pan and escape-to-close hooks, and the same bottom row for
 * switching between the pictures an entry has. A doll switches between its forms and its damaged twin, where an enemy switches
 * between the tiers of its family, which is the axis its own page offers as pills.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function EnemyArt() {
	const { id: rawId } = useParams<{ id: string }>();
	const { data, loadFailed, retry } = useEnemies();
	const navigate = useNavigate();
	const location = useLocation();
	const [imageFailed, setImageFailed] = useState(false);
	const [details, setDetails] = useState<EnemyDetailsData | null>(null);
	// The tier on screen, which the address names when the viewer opens. Null until the family is known.
	const [variantId, setVariantId] = useState<number | null>(null);

	// The art element fills the stage, so its box is the stage's size and its natural size gives the drawn picture's shape.
	const artRef = useRef<HTMLImageElement | null>(null);
	const panBounds = useArtPanBounds(artRef);
	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, panBounds });

	const opened = data?.items.find((entry) => String(entry.id) === rawId);

	// Every tier of this enemy that actually published full art. One with only card art is left out rather than offered as a button
	// that opens onto a broken image. Labels match the pills on the enemy's own page, which read the same `subName`.
	const variants = useMemo(() => {
		if (data === null || opened === undefined) {
			return [];
		}
		const family = data.items.filter((entry) => entry.familyId === opened.familyId);
		return family.filter((entry) => hasEnemyArt(entry.id, "full")).map((entry, index) => ({ id: entry.id, label: details?.[String(entry.id)]?.subName ?? (index === 0 ? "Base" : entry.name) }));
	}, [data, opened, details]);

	const current = variants.find((variant) => variant.id === variantId) ?? variants[0];
	const source = current === undefined || imageFailed ? null : enemyFullArtUrl(current.id);
	// A loaded enemy whose family published no full art at all. The viewer then shows a notice with only the close button.
	const noArt = data !== null && opened !== undefined && variants.length === 0;
	// Zoom and tier controls only make sense once there is art to act on.
	const showControls = !noArt && !loadFailed && source !== null;

	// Fetched for the tier labels alone, and already cached by the enemy page the reader came from, so this is usually free.
	useEffect(() => {
		let active = true;
		loadEnemyDetails()
			.then((loaded) => active && setDetails(loaded))
			.catch(() => {});
		return () => {
			active = false;
		};
	}, []);

	// Going back leaves the viewer the way it was opened. A reader who arrived by address, or who switched tiers in here, lands on
	// the page of the tier they were actually looking at.
	const close = useCallback(() => {
		if (location.key !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/enemy/${current?.id ?? rawId ?? ""}`, { replace: true });
	}, [location.key, navigate, current?.id, rawId]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (opened) {
			document.title = `${opened.name} - full art`;
		}
	}, [opened]);

	const handleImageError = useCallback(() => setImageFailed(true), []);
	const handleVariantChange = useCallback((_event: unknown, value: number | null) => {
		// Clicking the selected button hands back null, which would leave no tier chosen.
		if (value !== null) {
			setImageFailed(false);
			setVariantId(Number(value));
		}
	}, []);

	if (data !== null && opened === undefined) {
		return <NotFound404 message={`There is no enemy with the id ${rawId ?? ""}.`} />;
	}

	return (
		<Box sx={styles.root}>
			<Box sx={styles.bar}>
				<IconButton onClick={close} aria-label="close" sx={{ color: "inherit" }}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={styles.title}>
					{opened?.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{showControls ? <ArtZoomControls zoom={zoom} /> : null}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centre}>
					<LoadError what="this enemy's art" onRetry={retry} titleComponent="h1" />
				</Box>
			) : noArt ? (
				<Box sx={styles.centre}>
					<Box sx={styles.placeholder}>
						<ArtPlaceholder name={opened?.name ?? ""} />
					</Box>
				</Box>
			) : (
				// Mounted from the first render, before the enemy data arrives, so the zoom hook has its element from the start.
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers}>
					{/* Not draggable: a mouse drag on an image otherwise starts the browser's own image drag, which cancels the pan. */}
					{source === null ? null : <Box component="img" ref={artRef} src={source} alt="" draggable={false} onError={handleImageError} sx={containArtSx} style={zoom.contentStyle} />}
				</Box>
			)}

			{showControls && variants.length > 1 ? (
				<Box sx={styles.controls}>
					<ToggleButtonGroup size="small" exclusive value={current?.id} onChange={handleVariantChange} sx={styles.toggleGroup}>
						{variants.map((variant) => (
							<ToggleButton key={variant.id} value={variant.id} sx={styles.toggleButton}>
								{variant.label}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Box>
			) : null}
		</Box>
	);
}
