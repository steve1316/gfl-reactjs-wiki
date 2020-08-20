import React, { useState } from "react";

import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the skill description strings.
import PropTypes from "prop-types";

// MaterialUI imports
import {
	Container,
	makeStyles,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardActionArea,
	CardContent,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	CardHeader,
	Avatar,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Tabs,
	Tab,
	withStyles
} from "@material-ui/core";

// MaterialUI icon imports
import StarIcon from "@material-ui/icons/Star";
import { useEffect } from "react";

// Image imports
//import rarity_star from "../../images/rarity_star.png";

const StyledTabs = withStyles({
	indicator: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "transparent",
		"& > span": {
			maxWidth: 40,
			width: "100%",
			backgroundColor: "#635ee7"
		}
	}
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
	root: {
		textTransform: "none",
		color: "#fff",
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: theme.typography.pxToRem(15),
		marginRight: theme.spacing(1),
		"&:focus": {
			opacity: 1
		}
	}
}))((props) => <Tab {...props} />);

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
			width: "100%",
			display: "flex"
		},
		cardForImage: {
			display: "flex",
			width: 256, // The dimensions of the images.
			height: 512,
			marginBottom: 10
		},
		cardForSkill: {
			display: "flex",
			minWidth: 300,
			backgroundColor: theme.palette.grey[700]
		},
		cardMedia: {
			paddingTop: "56.25%" // 16:9
		},
		cardMediaForImage: {
			// height: "100%",
			// objectFit: "contain"
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
			transform: "translate(0px, 3px)", // This will set the rendered stars to be about inline with the T-Doll's type text.
			marginLeft: 3
		},
		table: {
			minWidth: 150,
			maxWidth: 200,
			backgroundColor: theme.palette.grey[700]
		},
		title: {
			fontSize: 14
		},
		pos: {
			marginBottom: 12
		},
		skillLevel: {
			//
		},
		tabs: {
			width: 256,
			backgroundColor: theme.palette.grey[900]
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

	// Grab the T-Doll's information from the sessionStorage.
	const id = props.location.search.substring(4);
	const [tdoll, setTDoll] = useState(JSON.parse(sessionStorage.getItem(id)));
	const backup = JSON.parse(sessionStorage.getItem(id));

	// Set initial states.
	const [skillLevel, setSkillLevel] = useState(10);
	const [tdollImage, setTDollImage] = useState(undefined);
	const [switchImage, setSwitchImage] = useState(false);
	const [MOD, setMOD] = useState(false);
	const [value, setValue] = useState(0); // 0 for Normal, 1 for MOD.

	useEffect(() => {
		tdoll.selected = tdoll.normal;

		// Console log the T-Doll's information only once.
		console.log("T-Doll: ", tdoll);

		setTDollImage(tdoll.selected.image_normal);
	}, []);

	const handleChangeImage = () => {
		// Replace the T-Doll's image with normal or damaged versions.
		if (switchImage) {
			setTDollImage(tdoll.selected.image_normal);
			//console.log("Normal art is showed.");
			setSwitchImage(false);
		} else {
			setTDollImage(tdoll.selected.image_damaged);
			//console.log("Damaged art is showed.");
			setSwitchImage(true);
		}
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		// Switch the information shown from Normal to MOD for the T-Doll depending on the tab selected above its image.
		tdoll.selected = {};
		if (value === 1) {
			//console.log("Setting to MOD");
			tdoll.selected = tdoll.mod;
			setTDollImage(tdoll.selected.image_normal);
		} else {
			//console.log("Setting to Normal");
			tdoll.selected = tdoll.normal;
			setTDollImage(tdoll.selected.image_normal);
		}
	}, [value]);

	useEffect(() => {
		// A hack-job attempt at programmatically replacing all delimiters with the appropriate stat numbers at the chosen skill level.
		// It will also insert into the strings some <span> and <ins> tags in order to highlight what stats are changed when the skill level changes.
		// The npm package html-react-parser will parse the inserted span tags and properly render them into HTML tags.
		// Note: The styling being inserted is using HTML styling and not using React styling.
		var tdoll_temp = backup; // Using the const backup to make sure that it is reading the delimiters inside the description correctly.
		var skillDescription = tdoll_temp.selected.skill.description;
		var numberOfStats = tdoll_temp.selected.skill.number_of_stats;
		switch (numberOfStats) {
			case 1:
				skillDescription = skillDescription.replace("#1", '<span style="color: cyan;"><ins>' + tdoll_temp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
				break;
			case 2:
				skillDescription = skillDescription.replace("#1", '<span style="color: cyan; font-size: 125%;"><ins>' + tdoll_temp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
				skillDescription = skillDescription.replace("#2", '<span style="color: cyan; font-size: 125%;"><ins>' + tdoll_temp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
				break;
			case 3:
				skillDescription = skillDescription.replace("#1", '<span style="color: cyan;"><ins>' + tdoll_temp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
				skillDescription = skillDescription.replace("#2", '<span style="color: cyan;"><ins>' + tdoll_temp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
				skillDescription = skillDescription.replace("#3", '<span style="color: cyan;"><ins>' + tdoll_temp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
				break;

			default:
		}

		tdoll_temp.selected.skill.description = skillDescription;

		// Save the properly formatted skill description.
		setTDoll(tdoll_temp);
	}, [skillLevel, value]);

	return (
		<main>
			<Container className={classes.cardGrid} maxWidth="md">
				<br />

				<Card className={classes.card}>
					<CardContent className={classes.cardContent}>
						{/* T-Doll's Name, Rarity in stars, type, and Index Number */}
						<Typography className={classes.rarityStars} color="textSecondary" gutterBottom>
							{tdoll.selected.type}
							{renderStars(tdoll.selected.rarity)}
						</Typography>
						<Typography variant="h3" component="h2">
							{tdoll.selected.name}
							<Typography display="inline" color="textSecondary">
								{" "}
								#{tdoll.selected.id}
							</Typography>
						</Typography>

						{/* T-Doll image */}
						<Grid container direction="row" spacing={2}>
							<Grid item key="T-Doll image" xs={6}>
								<Tabs className={classes.tabs} value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
									<Tab label="Normal" />
									<Tab label="MOD" />
								</Tabs>
								<Card className={classes.cardForImage} elevation={12}>
									<CardActionArea onClick={handleChangeImage}>
										<CardMedia component="img" className={classes.cardMediaForImage} image={tdollImage} title={tdoll.selected.name} />
									</CardActionArea>
								</Card>
							</Grid>

							{/* T-Doll's stats in table format */}
							<Grid item key="T-Doll stat table" xs={10} sm={6}>
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
												<TableCell align="right">{tdoll.selected.max_hp}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													DMG
												</TableCell>
												<TableCell align="right">{tdoll.selected.max_dmg}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													ACC
												</TableCell>
												<TableCell align="right">{tdoll.selected.max_acc}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													EVA
												</TableCell>
												<TableCell align="right">{tdoll.selected.max_eva}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell component="th" scope="row">
													ROF
												</TableCell>
												<TableCell align="right">{tdoll.selected.max_rof}</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>

							{/* T-Doll's skill information */}
							<Grid item key="T-Doll skill(s)" xs={6} sm={6}>
								<Card className={classes.cardForSkill} elevation={12}>
									<CardContent>
										<CardHeader
											avatar={<Avatar variant="rounded" src={tdoll.selected.skill.image_skill} />}
											title={tdoll.selected.skill.name}
											subheader={"Initial CD: " + tdoll.selected.skill.initial_cooldown + "s"}
											action={
												<FormControl>
													<InputLabel id="skill-level-select-label">Level</InputLabel>

													<Select
														id="skill-level-select"
														className={classes.skillLevel}
														value={skillLevel}
														onChange={(e) => {
															setSkillLevel(e.target.value);
														}}
														// MenuProps will shift the drop down menu to the right
														MenuProps={{
															anchorOrigin: {
																vertical: "top",
																horizontal: "right"
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "left"
															},
															getContentAnchorEl: null
														}}
													>
														<MenuItem value={1}>1</MenuItem>
														<MenuItem value={2}>2</MenuItem>
														<MenuItem value={3}>3</MenuItem>
														<MenuItem value={4}>4</MenuItem>
														<MenuItem value={5}>5</MenuItem>
														<MenuItem value={6}>6</MenuItem>
														<MenuItem value={7}>7</MenuItem>
														<MenuItem value={8}>8</MenuItem>
														<MenuItem value={9}>9</MenuItem>
														<MenuItem value={10}>10</MenuItem>
													</Select>
												</FormControl>
											}
										/>
										<Typography className={classes.title} color="textSecondary" gutterBottom>
											{/* This will render the span tags inserted into the skill description and will color the numbers. */}
											{parse(tdoll.selected.skill.description)}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											Cooldown:{" "}
											{
												<span style={{ color: "cyan" }}>
													<ins>{tdoll.selected.skill.cooldown[skillLevel - 1]}s</ins>
												</span>
											}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Container>
		</main>
	);
}
