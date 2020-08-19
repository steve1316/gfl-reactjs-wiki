import React from "react";
import { Link } from "react-router-dom";

// Component imports

// MaterialUI imports
import { Container, Button, makeStyles, Grid, Card, CardMedia, CardActionArea, CardActions, CardContent, Typography } from "@material-ui/core";

// MaterialUI icon imports
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

// Image imports
import tdoll_index_logo from "../../images/tdoll_index_logo.jpg";
import equipment_index_logo from "../../images/equipment_index_logo.jpg";
import hoc_index_logo from "../../images/hoc_index_logo.jpg";
import fairy_index_logo from "../../images/fairy_index_logo.jpg";
import formation_logo from "../../images/formation_logo.jpg";

export default function Home() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		},
		paper: {
			padding: theme.spacing(2)
		},
		heroContent: {
			backgroundColor: theme.palette.background.paper,
			padding: theme.spacing(8, 0, 6)
		},
		heroButtons: {
			marginTop: theme.spacing(4)
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
		},
		footer: {
			backgroundColor: theme.palette.background.paper,
			padding: theme.spacing(6)
		}
	}));

	const classes = useStyles();

	// This contains the information to be rendered into cards. The link attribute is tied to the Route in App.js.
	const cards = [
		{ title: "T-Doll Index", description: "View Index of T-Dolls along with additional information like statisticss and sprite animations.", link: "/index", image: tdoll_index_logo },
		{ title: "Equipment Index", description: "View Index of Equipment available for T-Dolls.", link: "", image: equipment_index_logo },
		{ title: "HOC Index", description: "View Index of HOCs available.", link: "", image: hoc_index_logo },
		{ title: "Fairy Index", description: "View Index of Fairies available.", link: "", image: fairy_index_logo },
		{ title: "Formation Simulator", description: "Simulate T-Doll formations and formation effects.", link: "", image: formation_logo }
	];

	return (
		<main>
			{/* Hero Unit */}
			<div className={classes.heroContent}>
				<Container maxWidth="sm">
					<Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
						TODO: Random T-Dolls will display here. A timed function will randomly select from JSON of T-Dolls. Do not display all information.
					</Typography>
					<Typography variant="h5" align="center" color="textSecondary" paragraph>
						Insert random T-Doll here
					</Typography>
					<div className={classes.heroButtons}>
						<Grid container spacing={2} justify="center">
							<Grid item>
								<Button variant="contained" color="primary">
									Go to this T-Doll
								</Button>
							</Grid>
							<Grid item>
								<Button variant="outlined" color="primary">
									Reroll for a different one
								</Button>
							</Grid>
						</Grid>
					</div>
				</Container>
			</div>
			{/* End of Hero Unit */}

			{/* Cards Section for Navigation */}
			<Container className={classes.cardGrid} maxWidth="md">
				<Grid container spacing={4}>
					{cards.map((card) => {
						return (
							<Grid item key={card.title} xs={12} sm={6} md={4}>
								<Card className={classes.card} elevation={12}>
									<CardActionArea>
										<CardMedia className={classes.cardMedia} image={card.image} title={card.title} />
									</CardActionArea>
									<CardContent className={classes.cardContent}>
										<Typography component="h2" variant="h5" gutterBottom>
											{card.title}
										</Typography>
										<Typography color="textSecondary">{card.description}</Typography>
									</CardContent>
									<CardActions className={classes.cardButton}>
										<Link to={card.link}>
											<Button size="small" variant="contained" color="primary">
												<ArrowForwardIcon />
											</Button>
										</Link>
									</CardActions>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</Container>
			{/* End of Cards Section */}
		</main>
	);
}
