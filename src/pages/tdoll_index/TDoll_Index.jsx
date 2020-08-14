import React from "react";

// MaterialUI imports
import { Container, makeStyles, Grid, Card, CardMedia, CardActionArea, CardContent, Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

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

	return (
		<>
			<CssBaseline />
			<Container className={classes.root}>
				<br />
				<br />

				<Grid container spacing={3}>
					<Grid item xs>
						wip
					</Grid>
					<Grid item xs>
						wip
					</Grid>
					<Grid item xs>
						wip
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
