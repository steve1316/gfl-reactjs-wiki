import React from "react";

// MaterialUI imports
import { Container, makeStyles, Grid } from "@material-ui/core";

export default function TDoll_Index() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		},
		paper: {
			padding: theme.spacing(2)
		},
		card: {
			minWidth: 250
		},
		cardImage: {
			height: 140
		},
		cardButton: {
			margin: 10
		}
	}));

	const classes = useStyles();

	return <main></main>;
}
