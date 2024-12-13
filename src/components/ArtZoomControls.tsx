import { useCallback } from "react";

// MaterialUI imports
import { IconButton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import type { UseZoomPanResult } from "../hooks/useZoomPan";

/** How much one press of zoom in or zoom out multiplies the scale. */
const ZOOM_STEP = 1.4;

/** Default button style, taking the colour of the toolbar around it. */
const BUTTON_SX: SxProps<Theme> = { color: "inherit" };

/** Props for ArtZoomControls. */
interface ArtZoomControlsProps {
	/** The zoom state from `useZoomPan` that the buttons drive. */
	zoom: UseZoomPanResult<HTMLDivElement>;
	/** Style for each button. Defaults to inheriting the toolbar's colour. */
	sx?: SxProps<Theme>;
}

/**
 * Zoom out, zoom in and reset buttons for a full art viewer's toolbar.
 *
 * @param props Component props.
 * @returns The three buttons, in that order.
 */
export default function ArtZoomControls({ zoom, sx = BUTTON_SX }: ArtZoomControlsProps) {
	const { zoomBy, reset } = zoom;
	const zoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
	const zoomOut = useCallback(() => zoomBy(1 / ZOOM_STEP), [zoomBy]);

	return (
		<>
			<IconButton onClick={zoomOut} aria-label="zoom out" sx={sx}>
				<RemoveIcon />
			</IconButton>
			<IconButton onClick={zoomIn} aria-label="zoom in" sx={sx}>
				<AddIcon />
			</IconButton>
			<IconButton onClick={reset} aria-label="reset zoom" sx={sx}>
				<ZoomOutMapIcon />
			</IconButton>
		</>
	);
}
