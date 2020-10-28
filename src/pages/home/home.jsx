import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// MaterialUI imports
import { Container, Button, makeStyles, Grid, Card, CardMedia, CardActionArea, CardActions, CardContent, Typography, Grow, LinearProgress } from "@material-ui/core";

// MaterialUI icon imports
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

// Image imports
import tdoll_index_logo from "../../images/tdoll_index_logo.jpg";
import equipment_index_logo from "../../images/equipment_index_logo.jpg";
import hoc_index_logo from "../../images/hoc_index_logo.jpg";
import fairy_index_logo from "../../images/fairy_index_logo.jpg";
import formation_logo from "../../images/formation_logo.jpg";

// T-Dolls JSON import
const tdolls_from_1_to_100 = require("../../data/tdolls_from_1_to_100").default;
const tdolls_from_101_to_200 = require("../../data/tdolls_from_101_to_200").default;
const tdolls_from_201_to_300 = require("../../data/tdolls_from_201_to_300").default;
const tdolls_from_301_to_400 = require("../../data/tdolls_from_301_to_400").default;
const tdolls_from_1000_to_1050 = require("../../data/tdolls_from_1000_to_1050").default;

const tdolls_array = tdolls_from_1_to_100.concat(tdolls_from_101_to_200).concat(tdolls_from_201_to_300).concat(tdolls_from_301_to_400).concat(tdolls_from_1000_to_1050);

export default function Home() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "4rem"
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
		}
	}));

	const classes = useStyles();

	var stagger = 100; // Stagger timeout for this page's animations.

	// Set initial states for the progress state for the LinearProgress component.
	const [progress, setProgress] = useState(0);

	// This contains the information to be rendered into cards. The link attribute is tied to the Route in App.js.
	const cards = [
		{ title: "T-Doll Index", description: "View Index of T-Dolls along with additional information like statistics and sprite animations.", link: "/index", image: tdoll_index_logo },
		{ title: "Equipment Index", description: "View Index of Equipment available for T-Dolls.", link: "/equipment-index", image: equipment_index_logo },
		{ title: "HOC Index", description: "View Index of HOCs available.", link: "/hoc-index", image: hoc_index_logo },
		{ title: "Fairy Index", description: "View Index of Fairies available.", link: "/fairy-index", image: fairy_index_logo },
		{ title: "Formation Simulator", description: "Simulate T-Doll formations and formation effects.", link: "/formation", image: formation_logo }
	];

	// This useEffect will run once to generate a random T-Doll.
	useEffect(() => {
		randomTDollDisplay();
	}, []);

	// This useEffect will determine the progress of the LinearProgress component. This fires every 1 second because this accounts
	// for the fact that if the user clicks off the tab making it inactive, browser defaults the interval to 1000ms so I might as well
	// set it to fire every 1 second to avoid any discrepencies.
	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress === 100 ? 0 : Math.min(prevProgress + 10, 100)));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// This useEffect will call randomTDollDisplay() every 10 + 1 seconds.
	useEffect(() => {
		const interval = setInterval(() => {
			randomTDollDisplay();
		}, 11000);

		return () => clearInterval(interval);
	}, []);

	// This function will fire at set intervals and will randomly choose a T-Doll to display.
	const randomTDollDisplay = () => {
		// Randomly choose a JSON file to select from first.
		var min = 1;
		var max = 5; // Total number of T-Doll JSON files.
		var chosenRange = Math.floor(Math.random() * (max - min + 1) + min); // Min and max are inclusive.

		// console.log("Range selected: ", chosenRange);

		// Next, randomly choose a T-Doll from the selected JSON data file according to the range of ID values as indicated in their file names.
		var chosenTDoll = 0;
		var newMin = 0;
		var newMax = 0;

		switch (chosenRange) {
			case 1:
				newMin = 1;
				newMax = 100;
				break;
			case 2:
				newMin = 101;
				newMax = 100;
				break;
			case 3:
				newMin = 201;
				newMax = 300;
				break;
			case 4:
				newMin = 301;
				newMax = 400;
				break;
			default:
				newMin = 1000;
				newMax = 1050;
				break;
		}

		chosenTDoll = Math.floor(Math.random() * (newMax - newMin + 1) + newMin); // Min and max are inclusive.

		console.log("T-Doll selected: ", chosenTDoll);
	};

	return (
		<main className={classes.root}>
			<ScrollToTop />

			{/* Hero Unit */}
			<div className={classes.heroContent}>
				<Container maxWidth="sm">
					<Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
						TODO: Random T-Dolls will display here. A timed function will randomly select from JSON of T-Dolls. Do not display all information.
					</Typography>
					<Typography variant="h5" align="center" color="textSecondary" paragraph>
						Insert random T-Doll here
					</Typography>

					<LinearProgress variant="determinate" value={progress} />

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
						stagger += 100;
						return (
							<Grid item key={card.title} xs={12} sm={6} md={4}>
								<Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={400 + stagger}>
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
								</Grow>
							</Grid>
						);
					})}
				</Grid>
			</Container>
			{/* End of Cards Section */}
		</main>
	);
}
