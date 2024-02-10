import { memo } from "react";

import { Box, Typography } from "@mui/material";

import { PLACEHOLDER_SX } from "../lib/artLayout";

/** Props for ArtPlaceholder. */
interface ArtPlaceholderProps {
	/** Doll name, used in the accessible label. */
	name: string;
}

/**
 * A card-art-shaped box shown in place of art that is not hosted yet.
 *
 * @param props Component props.
 * @returns The placeholder box.
 */
export default memo(function ArtPlaceholder({ name }: ArtPlaceholderProps) {
	return (
		<Box sx={PLACEHOLDER_SX} role="img" aria-label={`${name} - art not available yet`}>
			<Typography sx={{ fontSize: "0.75rem", color: "text.secondary", px: 1, textAlign: "center" }}>Art not available yet</Typography>
		</Box>
	);
});
