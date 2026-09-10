import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// MaterialUI imports
import { Container, Button, makeStyles, Grid, Card, CardMedia, CardActionArea, CardActions, CardContent, Typography, Grow, LinearProgress, Box } from "@material-ui/core";

import Skeleton from "@material-ui/lab/Skeleton";

// MaterialUI icon imports
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { uiUrl } from "../../lib/assets";
import { loadDoll } from "../../lib/data";
import type { TDoll } from "../../types/tdoll";

const tdoll_index_logo = uiUrl("tdoll_index_logo.jpg");
const equipment_index_logo = uiUrl("equipment_index_logo.jpg");
const hoc_index_logo = uiUrl("hoc_index_logo.jpg");
const fairy_index_logo = uiUrl("fairy_index_logo.jpg");
const formation_logo = uiUrl("formation_logo.jpg");

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
		},
		heroCardRoot: {
			display: "flex"
		},
		heroCardDetails: {
			display: "flex",
			alignContent: "center",
			flexDirection: "column"
		},
		cardImageBox: {
			width: 130
		},
		heroCardContent: {
			flex: "1 0 auto"
		},
		heroCardMedia: {
			height: 256,
			width: 128
		}
	}));

	const classes = useStyles();

	var stagger = 100; // Stagger timeout for this page's animations.

	// Set initial states for the progress state for the LinearProgress component.
	const [progress, setProgress] = useState(0);

	// Set initial state for the display of the random T-Doll.
	const [tdoll, setTDoll] = useState<TDoll | undefined>(undefined);
	const [tdollImage, setTDollImage] = useState<string | undefined>(undefined);
	const [tdollName, setTDollName] = useState("");
	const [tdollType, setTDollType] = useState("");

	// Set initial state to check if tab is in focus or not. This will affect the setInterval for the randomization function.
	const [check, setCheck] = useState(true);

	// This contains the information to be rendered into cards. The link attribute is tied to the Route in App.js.
	const cards = [
		{ title: "T-Doll Index", description: "View Index of T-Dolls along with additional information like statistics and sprite animations.", link: "/index", image: tdoll_index_logo },
		{ title: "Equipment Index", description: "View Index of Equipment available for T-Dolls.", link: "/equipment-index", image: equipment_index_logo },
		{ title: "HOC Index", description: "View Index of HOCs available.", link: "/hoc-index", image: hoc_index_logo },
		{ title: "Fairy Index", description: "View Index of Fairies available.", link: "/fairy-index", image: fairy_index_logo },
		{ title: "Formation Simulator", description: "Simulate T-Doll formations and formation effects.", link: "/formation", image: formation_logo }
	];

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Girls' Frontline Database"
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Database for Girls' Frontline featuring T-Dolls, equipment, Fairies and HOCs");
	}, [])

	// This useEffect will run once to generate a random T-Doll.
	useEffect(() => {
		randomTDollDisplay();
	}, []);

	const onFocus = () => {
		console.log("Tab Focused");
		setCheck(true);
	};

	const onBlur = () => {
		console.log("Tab Blurred");
		setCheck(false);
	};

	// This will attach event listeners to listen for when the tab comes into focus or out of focus and will attach the following 2 functions to those events.
	useEffect(() => {
		window.addEventListener("focus", onFocus);
		window.addEventListener("blur", onBlur);

		return () => {
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
		};
	});

	// This will handle the timing of both the LinearProgress component and the randomTDollDisplay().
	// This useEffect will only be called when the focus of the tab is changed according to the event listeners
	// and when the state of the T-Doll's name is changed.
	useEffect(() => {
		if (!check) {
			return;
		}

		// If you need to speed up or slow down the progress bar/timer, adjust the interval's timeout in ms and the timer's incrementation 
		// of prevProgress such that the incremenation will reach 100 when the timer function fires.
		const timer = setInterval(() => {
			setProgress((prevProgress) => prevProgress === 100 ? 0 : Math.min(prevProgress + 25, 100));
		}, 1000);

		const interval = setTimeout(() => {
			randomTDollDisplay();
		}, 5000);

		return () => {
			clearInterval(timer);
			clearTimeout(interval);
			setProgress(0);
		};
	}, [tdollName, check]);

	// This function will randomly choose a T-Doll to display based on the given ranges.
	const randomTDollDisplay = () => {
		// Minimum and maximum number of T-Doll JSON files.
		var min = 1;
		var max = 5;

		// Randomly choose a JSON file to select from first. Min and max are inclusive.
		var chosenRange = Math.floor(Math.random() * (max - min + 1));

		var chosenTDoll = 0;
		var newMin = 0;
		var newMax = 0;

		// Next, randomly choose a T-Doll from the selected JSON data file according to the range of ID values as indicated in their file names.
		// TODO: Remember to update these ranges when MICA Team updates the game with new T-Dolls.
		switch (chosenRange) {
			case 1:
				newMin = 1;
				newMax = 100;
				break;
			case 2:
				newMin = 101;
				newMax = 200;
				break;
			case 3:
				newMin = 201;
				newMax = 300;
				break;
			case 4:
				newMin = 301;
				newMax = 320;
				break;
			default:
				newMin = 1000;
				newMax = 1027;
				break;
		}

		// Loop until a valid random T-Doll ID is chosen based on the newMin and newMax ranges. Min and max are inclusive.
		var notValidIDs = [0, 30, 45, 67, 76, 83, 219, 246, 1000, 1011, 1012, 1013, 1014, 1015, 1016]
		var validCheck = false
		while(!validCheck) {
			chosenTDoll = Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
			validCheck = !notValidIDs.includes(chosenTDoll);
		}
		
		console.clear()
		console.log("ID selected: ", chosenTDoll);

		// Only the shard holding this id is fetched, rather than all five.
		void loadDoll(chosenTDoll).then((selected) => {
			setTDoll(selected);

			// MICA Team skips certain ids, so a random pick can land on a doll that does not exist.
			if (selected !== undefined) {
				setTDollImage(selected.normal.assets.images.card);
				setTDollName(selected.normal.name);
				setTDollType(selected.normal.type);
			} else {
				setTDollImage(undefined);
				setTDollName("");
				setTDollType("");
			}
		});
	};

	const manualReroll = () => {
		setProgress(0)
		randomTDollDisplay()
	}

	return (
		<main className={classes.root}>
			<ScrollToTop />

			{/* Hero Unit */}
			<Box boxShadow={1}>
				<div className={classes.heroContent}>
					<Container maxWidth="sm">
						<Box boxShadow={5}>
							<Card className={classes.heroCardRoot}>
								<div className={classes.heroCardDetails}>
									{/* Skeleton components will display when the randomization function selects an ID for a T-Doll that does not exist. */}
									<Box className={classes.cardImageBox} boxShadow={6} border={1} borderColor="primary.main">
										{tdollImage !== undefined ? <CardMedia className={classes.heroCardMedia} image={tdollImage} title={tdollName} /> : <Skeleton variant="rect" height={256} width={128} />}
									</Box>

									<CardContent className={classes.heroCardContent}>
										<Typography component="h5" variant="h5">
											{tdollName !== "" ? tdollName : <Skeleton />}
										</Typography>
										<Typography variant="subtitle2" color="textSecondary">
											This is a Work-in-Progress
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{tdollType !== "" ? tdollType : <Skeleton />}
										</Typography>
									</CardContent>
								</div>
							</Card>
						</Box>

						<LinearProgress variant="determinate" value={progress} />

						<div className={classes.heroButtons}>
							<Grid container spacing={2} justify="center">
								<Grid item>
									{/* The doll page loads by id, so nothing needs stashing in sessionStorage first. */}
									<Link to={`/tdoll/${tdoll?.normal.id ?? ""}`}>
										<Button variant="contained" color="primary" disabled={tdoll === undefined}>
											Go to this T-Doll
										</Button>
									</Link>
								</Grid>
								<Grid item>
									<Button variant="outlined" color="primary" onClick={() => manualReroll()}>
										Reroll for a different one
									</Button>
								</Grid>
							</Grid>
						</div>
					</Container>
				</div>
			</Box>
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
