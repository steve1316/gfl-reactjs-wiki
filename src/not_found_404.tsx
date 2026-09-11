import { Box, Typography } from "@mui/material";

/**
 * The catch-all page for unknown routes.
 *
 * @returns The 404 message.
 */
export default function NotFound404() {
	return (
		<Box component="main" sx={{ marginTop: "4rem" }}>
			<Typography component="h1" variant="h4" align="center">
				404 Not Found
			</Typography>
		</Box>
	);
}
