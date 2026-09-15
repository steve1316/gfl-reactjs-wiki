import { memo } from "react";

import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const styles = {
	root: {
		width: "100%",
		aspectRatio: "1 / 1",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		px: 1,
		bgcolor: "action.hover"
	},
	text: { fontSize: "0.75rem", color: "text.secondary", textAlign: "center" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for HocArtPlaceholder. */
interface HocArtPlaceholderProps {
	/** HOC name, used in the accessible label. */
	name: string;
	/** Extra styles for the box, such as rounded corners or a fixed width. */
	sx?: SxProps<Theme>;
}

/**
 * A square box shown in place of HOC art, which is not hosted yet.
 *
 * @param props Component props.
 * @returns The placeholder box.
 */
export default memo(function HocArtPlaceholder({ name, sx }: HocArtPlaceholderProps) {
	return (
		<Box sx={[styles.root, ...(Array.isArray(sx) ? sx : [sx])]} role="img" aria-label={`${name} - art not available yet`}>
			<Typography sx={styles.text}>Art not available yet</Typography>
		</Box>
	);
});
