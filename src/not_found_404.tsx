import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

/** Props for NotFound404. */
interface NotFound404Props {
	/** What could not be found, shown under the heading. Defaults to a message about the page. */
	message?: string;
}

/**
 * The not found page, for unknown routes and for doll ids that do not exist.
 *
 * @param props Component props.
 * @returns The 404 message with links back into the site.
 */
export default function NotFound404({ message = "There is no page at this address." }: NotFound404Props) {
	useEffect(() => {
		document.title = "404 Not Found";
	}, []);

	return (
		<Box component="main" sx={{ py: 8, px: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center" }}>
			<Typography component="p" variant="h2" color="primary" sx={{ fontWeight: 800 }}>
				404
			</Typography>
			<Typography component="h1" variant="h5">
				Not Found
			</Typography>
			<Typography color="textSecondary">{message}</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 1 }}>
				<Button component={Link} to="/index" variant="contained">
					Browse T-Dolls
				</Button>
				<Button component={Link} to="/" variant="outlined">
					Home
				</Button>
			</Box>
		</Box>
	);
}
