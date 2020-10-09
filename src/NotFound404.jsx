import React from "react";

import { makeStyles } from "@material-ui/core";

export default function NotFound404() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "4rem"
		}
	}));

	const classes = useStyles();

	return (
		<main>
			<div className={classes.root}>
				<h1 style={{ textAlign: "center" }}>404 Not Found</h1>
			</div>
		</main>
	);
}
