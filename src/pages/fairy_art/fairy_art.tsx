import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import LoadError from "../../components/LoadError";
import { useArtPanBounds, useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { containArtSx } from "../../lib/artLayout";
import { fairyFormUrl } from "../../lib/assets";
import { fairyFormLabel } from "../../lib/fairyStats";
import { hasFairyForm } from "../../lib/processData";
import { useFairies } from "../../lib/useFairies";
import NotFound404 from "../../not_found_404";

/** The form shown when the address names none or an invalid one, the fairy's highest rank. */
const DEFAULT_FORM = 3;

/** How many art forms a fairy has, used to check the address before the data loads. */
const FORM_COUNT = 3;

/** Router state the fairy page puts on its link here, so closing knows going back returns to it. */
interface FairyArtState {
	/** True when opened from the fairy page's full art button. */
	fromFairyPage?: boolean;
}

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: Theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	header: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	iconButton: { color: "inherit" },
	title: { flexGrow: 1 },
	centred: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholderStage: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	placeholderBox: { width: 256, maxWidth: "60vw" },
	placeholder: { aspectRatio: "1 / 1" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden" },
	footer: { display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" },
	formButton: { color: "common.white" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Read the `form` parameter as a form number.
 *
 * @param param The `form` parameter, or null when the address has none.
 * @returns The form number, 1 to 3, or `DEFAULT_FORM` when the parameter is missing or not a valid form.
 */
function parseForm(param: string | null): number {
	const value = Number(param);
	return Number.isInteger(value) && value >= 1 && value <= FORM_COUNT ? value : DEFAULT_FORM;
}

/**
 * Full-screen viewer for a fairy's art, with zoom, pan and a picker for its three forms.
 *
 * A route rather than an overlay, like the T-Doll art viewer, so Back closes it and the form on screen can be linked to.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function FairyArt() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data, loadFailed, retry } = useFairies();

	// The art element fills the stage, so its box is the stage's size and its natural size gives the drawn picture's shape.
	const artRef = useRef<HTMLImageElement | null>(null);

	const panBounds = useArtPanBounds(artRef);

	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, panBounds });

	const fairy = data?.items.find((entry) => String(entry.id) === id);
	const form = parseForm(searchParams.get("form"));
	const hosted = fairy !== undefined && hasFairyForm(fairy.id, form);
	const fromFairyPage = (location.state as FairyArtState | null)?.fromFairyPage === true;

	// Opened from the fairy page, going back returns to it. Opened from a pasted link there is nothing to go back to, so the fairy page opens instead.
	const close = useCallback(() => {
		if (fromFairyPage && location.key !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/fairy/${id ?? ""}`, { replace: true });
	}, [fromFairyPage, location.key, navigate, id]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (fairy) {
			document.title = `${fairy.name} art`;
		}
	}, [fairy]);

	// Stable handlers, in step with the rest of the site.
	const zoomIn = useCallback(() => zoom.zoomBy(1.4), [zoom.zoomBy]);
	const zoomOut = useCallback(() => zoom.zoomBy(1 / 1.4), [zoom.zoomBy]);
	// Replaces rather than pushes, so Back still closes the viewer in one step. The router state rides along so closing still knows where it came from.
	const handleFormChange = useCallback(
		(_event: unknown, value: number | null) => {
			if (value !== null) {
				setSearchParams({ form: String(value) }, { replace: true, state: location.state });
			}
		},
		[setSearchParams, location.state]
	);

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
				{hosted && !loadFailed ? (
					<>
						<IconButton onClick={zoomOut} aria-label="zoom out" sx={styles.iconButton}>
							<RemoveIcon />
						</IconButton>
						<IconButton onClick={zoomIn} aria-label="zoom in" sx={styles.iconButton}>
							<AddIcon />
						</IconButton>
						<IconButton onClick={zoom.reset} aria-label="reset zoom" sx={styles.iconButton}>
							<ZoomOutMapIcon />
						</IconButton>
					</>
				) : null}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centred}>
					<LoadError what="this fairy's art" onRetry={retry} titleComponent="h1" />
				</Box>
			) : (
				// Always mounted, since the zoom hook attaches its wheel and resize listeners to this box once, on mount.
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers}>
					{fairy === undefined ? null : hosted ? (
						// Not draggable: a mouse drag on an image otherwise starts the browser's own image drag, which cancels the pan.
						<Box component="img" ref={artRef} src={fairyFormUrl(fairy.id, form)} alt="" draggable={false} sx={containArtSx} style={zoom.contentStyle} />
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
					<ToggleButtonGroup size="small" exclusive value={form} onChange={handleFormChange} aria-label="Fairy form">
						{data.constants.forms.map((ranks, index) => (
							<ToggleButton key={index} value={index + 1} aria-label={fairyFormLabel(ranks)} sx={styles.formButton}>
								{fairyFormLabel(ranks)}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Box>
			) : null}
		</Box>
	);
}
