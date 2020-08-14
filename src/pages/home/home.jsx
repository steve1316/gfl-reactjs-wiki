import React from "react";
import { Link } from "react-router-dom";

// Component imports

// MaterialUI imports
import { Container, Button, makeStyles, Grid, Card, CardMedia, CardActionArea, CardContent, Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

// MaterialUI icon imports
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

// Image imports
import card1_logo from "../../images/tdoll-index.png";

export default function Home() {
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
						<Card className={classes.card}>
							<CardActionArea>
								<CardMedia className={classes.cardImage} image={card1_logo} style={{ height: "140px" }} title="T-Doll Index"></CardMedia>
							</CardActionArea>
							<CardContent>
								<Typography gutterbottom="true" variant="h5" component="h2">
									T-Doll Index
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									List of Tactical Dolls with Search and Filtering
								</Typography>
							</CardContent>
							<Link to="/index" className={classes.link}>
								<Button className={classes.cardButton} color="primary" variant="contained">
									<ArrowForwardIcon />
								</Button>
							</Link>
						</Card>
					</Grid>
					<Grid item xs>
						<Card className={classes.card}>
							<CardContent>
								<Typography gutterbottom="true" variant="h5" component="h2">
									wip
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									wip
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs>
						<Card className={classes.card}>
							<CardContent>
								<Typography gutterbottom="true" variant="h5" component="h2">
									wip
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									wip
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
