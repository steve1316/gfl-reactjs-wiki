import { Box, Button, Typography } from "@mui/material";

/** Props for LoadError. */
interface LoadErrorProps {
	/** What failed to load, read as "Could not load <what>.", such as "this T-Doll". */
	what: string;
	/** Runs the failed load again. */
	onRetry: () => void;
	/** Heading element for the message. The doll page uses `h1` because the notice is the whole page. */
	titleComponent?: "h1" | "h2";
}

/**
 * Inline notice for data that failed to load, with a button to try again.
 *
 * Pages show it in place of their content, so a dropped connection leaves a way forward instead of a page that loads forever.
 *
 * @param props Component props.
 * @returns The notice.
 */
export default function LoadError({ what, onRetry, titleComponent = "h2" }: LoadErrorProps) {
	return (
		<Box role="alert" sx={{ py: 3, px: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
			<Typography component={titleComponent} variant="h5" align="center" color="textPrimary">
				Could not load {what}.
			</Typography>
			<Typography align="center" color="textSecondary">
				Check your connection and try again.
			</Typography>
			<Button variant="outlined" onClick={onRetry}>
				Try again
			</Button>
		</Box>
	);
}
