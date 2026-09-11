import { Box, Container, Typography } from "@mui/material";

import ScrollToTop from "../../components/ScrollToTop";

/**
 * Placeholder page, pending the data model this section needs.
 *
 * @returns The under-construction notice.
 */
export default function FormationSimulator() {
	return (
		<Box component="main" sx={{ py: 3 }}>
			<ScrollToTop />
			<Container>
				<Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
					Page under construction!
				</Typography>
			</Container>
		</Box>
	);
}
