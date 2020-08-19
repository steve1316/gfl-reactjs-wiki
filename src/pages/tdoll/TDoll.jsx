import React from "react";

// MaterialUI imports
import { Container, makeStyles, Grid, Typography, Card, CardMedia, CardActionArea, CardContent, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

// MaterialUI icon imports
import StarIcon from "@material-ui/icons/Star";

// Image imports
//import rarity_star from "../../images/rarity_star.png";

export default function TDoll(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
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
		cardForImage: {
			display: "flex",
			flexDirection: "column",
			maxWidth: 200,
			maxHeight: 550,
			marginBottom: 10
		},
		cardMedia: {
			paddingTop: "56.25%" // 16:9
		},
		cardMediaForImage: {
			height: "100%",
			width: "100%",
			objectFit: "contain"
		},
		cardContent: {
			flexGrow: 1
		},
		cardButton: {
			display: "flex",
			margin: 10,
			justifyContent: "flex-end"
		},
		rarityStars: {
			listStyleType: "none",
			display: "inline",
			margin: 0,
			padding: 0
		},
		rarityStar: {
			display: "inline-block",
			transform: "translate(0px,3px)", // This will set the rendered stars to be about inline with the T-Doll's type text.
			marginLeft: 3
		},
		table: {
			minWidth: 100,
			maxWidth: 200,
			backgroundColor: theme.palette.grey[600]
		}
	}));

	const classes = useStyles();

	// Renders the amount of stars equal to the T-Doll's rarity next to its type at the top of the Card.
	const renderStars = (rarity) => {
		var array = [];

		// Populate the array with the keys to the length of the rarity.
		for (var i = 0; i < rarity; i++) {
			array.push(i);
		}

		const stars = array.map((i) => {
			return (
				<li className={classes.rarityStar} key={i}>
					<StarIcon style={{ color: "yellow" }} />
					{/* <img src={rarity_star} alt="rarity star" /> */}
				</li>
			);
		});

		return stars;
	};

	// Grab the T-Doll's information from the sessionStorage
	const id = props.location.search.substring(4);
	const tdoll = JSON.parse(sessionStorage.getItem(id));

	console.log(tdoll);

	const handleChangeImage = () => {};

	return (
		<main>
			<Container className={classes.cardGrid} maxWidth="md">
				<br />

				<Card className={classes.card}>
					<CardContent>
						<Typography className={classes.rarityStars} color="textSecondary" gutterBottom>
							{tdoll.type.toUpperCase()}
							{renderStars(tdoll.rarity)}
						</Typography>
						<Typography variant="h3" component="h2">
							{tdoll.name}
							<Typography display="inline" color="textSecondary">
								{" "}
								#{tdoll.id}
							</Typography>
						</Typography>

						<Grid container direction="row" justify="center" alignItems="center">
							<Grid item key="T-Doll image" xs={12} sm={6}>
								<Card className={classes.cardForImage} elevation={12}>
									<CardActionArea onClick={handleChangeImage}>
										<CardMedia component="img" className={classes.cardMediaForImage} image={tdoll.image_normal} title={tdoll.name} />
									</CardActionArea>
								</Card>
							</Grid>

							<Grid item key="T-Doll stat table" xs={12} sm={6}>
								<TableContainer className={classes.table} component={Paper} elevation={12}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Stats</TableCell>
												<TableCell align="right">At Max Level</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell component="th" scope="row">
													HP
												</TableCell>
												<TableCell align="right">{tdoll.max_hp}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													DMG
												</TableCell>
												<TableCell align="right">{tdoll.max_dmg}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													ACC
												</TableCell>
												<TableCell align="right">{tdoll.max_acc}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													EVA
												</TableCell>
												<TableCell align="right">{tdoll.max_eva}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													ROF
												</TableCell>
												<TableCell align="right">{tdoll.max_rof}</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Container>
		</main>
	);
}
