import React, { useState, useEffect } from "react";
import { makeStyles, Container, Typography } from "@material-ui/core";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

export default function Equipment_Index() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		}
	}));

	const classes = useStyles();

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index"
		document.querySelector('meta[name="description"]').setAttribute("content", "Index of sortable equipment");
	}, [])

	return (
		<main className={classes.root}>
			<ScrollToTop />

			<Container>
				
			</Container>

		</main>
	);
}
