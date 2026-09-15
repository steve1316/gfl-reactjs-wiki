import { memo } from "react";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { PLACEHOLDER_SX } from "../lib/artLayout";

/** Props for ArtPlaceholder. */
interface ArtPlaceholderProps {
	/** Doll or HOC name, used in the accessible label. */
	name: string;
	/** Styles laid over the card-art shape, such as a square aspect ratio for HOC art. */
	sx?: SxProps<Theme>;
}

/**
 * A card-art-shaped box shown in place of art that is not hosted yet, reshaped through `sx` where the art is not card-shaped.
 *
 * @param props Component props.
 * @returns The placeholder box.
 */
export default memo(function ArtPlaceholder({ name, sx }: ArtPlaceholderProps) {
	return (
		<Box sx={sx === undefined ? PLACEHOLDER_SX : [PLACEHOLDER_SX, ...(Array.isArray(sx) ? sx : [sx])]} role="img" aria-label={`${name} - art not available yet`}>
			<Typography sx={{ fontSize: "0.75rem", color: "text.secondary", px: 1, textAlign: "center" }}>Art not available yet</Typography>
		</Box>
	);
});
