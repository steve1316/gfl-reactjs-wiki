import React from "react";
import { makeStyles, Container, Typography } from "@material-ui/core";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

export default function Fairy_Index() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		}
	}));

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
