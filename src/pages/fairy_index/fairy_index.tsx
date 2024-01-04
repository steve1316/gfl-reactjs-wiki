import { Container, Typography, makeStyles } from "@material-ui/core";

import ScrollToTop from "../../components/ScrollToTop";

const useStyles = makeStyles({
	root: {
		marginTop: "5rem"
	}
});

/**
 * Placeholder page, pending the data model this section needs.
 *
 * @returns The under-construction notice.
 */
export default function FairyIndex() {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<ScrollToTop />
			<Container>
				<Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
					Page under construction!
				</Typography>
			</Container>
		</main>
	);
}
