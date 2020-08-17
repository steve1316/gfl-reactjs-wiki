import React, { useState } from "react";

// MaterialUI imports
import { Container, makeStyles, Grid, Typography } from "@material-ui/core";

// MaterialUI icon imports

export default function TDoll(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		},
		paper: {
			padding: theme.spacing(2)
		},
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8)
		},
		card: {
			height: "100%",
			display: "flex",
			flexDirection: "column"
		},
		cardMedia: {
			paddingTop: "56.25%" // 16:9
		},
		cardContent: {
			flexGrow: 1
		},
		cardButton: {
			display: "flex",
			margin: 10,
			justifyContent: "flex-end"
		}
	}));

	const classes = useStyles();

	if (props.location.state) {
		console.log(props.location.state.tdoll);
	} else {
		console.log("Nothing passed");
	}

	return (
		<main>
			<Container>
				<br />
			</Container>
		</main>
	);
}
