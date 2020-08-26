import React, { useState, useEffect } from "react";

import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the skill description strings.

// Component imports

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
	Fab,
	Backdrop
} from "@material-ui/core";

// MaterialUI icon imports
import StarIcon from "@material-ui/icons/Star";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";

// GifPlayer import and CSS styling
import GifPlayer from "react-gif-player";
import "./styles.css";

// Image imports
//import rarity_star from "../../images/rarity_star.png";
import mod_button from "../../images/mod.png";
import dorm_button from "../../images/dorm_button.png";

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
			width: "100%"
		},
		cardForImage: {
			width: 256, // The dimensions of the images.
			height: 512,
			marginBottom: 10
		},
		cardForSkill: {
			minWidth: 256,
			backgroundColor: theme.palette.grey[700]
		},
		cardForTileSet: {
			minWidth: 256,
			backgroundColor: theme.palette.grey[700]
		},
		cardForAnimation: {
			display: "flex",
			justifyContent: "center",
			width: 256,
			backgroundColor: theme.palette.grey[700]
		},
		cardMedia: {
			paddingTop: "56.25%" // 16:9
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
		tableContainer: {
			minWidth: 256
		},
		table: {
			width: "100%",
			backgroundColor: theme.palette.grey[700]
		},
		title: {
			fontSize: 14
		},
		pos: {
			marginBottom: 12
		},
		tabs: {
			width: 256,
			backgroundColor: theme.palette.grey[900]
		},
		tabsForSkills: {
			minWidth: 256,
			backgroundColor: theme.palette.grey[900]
		},
		tableTileSet: {
			width: 100,
			height: 100,
			borderStyle: "solid",
			borderColor: "black",
			borderSpacing: 0,
			borderWidth: 2
		},
		blackTile: {
			backgroundColor: theme.palette.grey[800],
			width: "33%",
			borderStyle: "solid",
			borderColor: "black",
			borderWidth: 1
		},
		cyanTile: {
			backgroundColor: "cyan",
			width: "33%",
			borderStyle: "solid",
			borderColor: "black",
			borderWidth: 1
		},
		whiteTile: {
			backgroundColor: "white",
			width: "33%",
			borderStyle: "solid",
			borderColor: "black",
			borderWidth: 1
		},
		tileSetDiv: {
			display: "flex"
		},
		content: {
			flex: "0 1 auto"
		},
		tileSetInformation: {
			display: "flex",
			flexDirection: "column"
		},
		fab: {
			display: "inline-flex",
			transform: "translate(5px, -85px)",
			height: 40,
			width: 40,
			opacity: "75%"
		},
		fab_mod: {
			display: "block",
			transform: "translate(5px, -505px)",
			height: 40,
			width: 40,
			opacity: "85%"
		},
		fab_dorm: {
			display: "block",
			transform: "translate(5px, 100px)",
			height: 40,
			width: 40,
			opacity: "85%",
			zIndex: 100
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: "#fff"
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

	// Set initial states for the skill descriptions. Set Skill 2 to the description of Skill 1 in case T-Doll does not have a Neural Upgrade.
	const [skillDescription1, setSkillDescription1] = useState(backup.normal.skill.description);
	const [skillDescription2, setSkillDescription2] = useState(backup.normal.skill.description);

	// Set initial states.
	const [skillLevel, setSkillLevel] = useState(10);
	const [tdollImage, setTDollImage] = useState(undefined);
	const [switchImage, setSwitchImage] = useState(false);
	const [mode, setMode] = useState(0); // 0 for Normal, 1 for MOD.
	const [hasMod, setHasMod] = useState(false);
	const [showModSkill, setShowModSkill] = useState(false);
	const [selectedSkill, setSelectedSkill] = useState(0); // 0 for Normal skill, 1 for MOD skill if it exists.

	// Set initial states for showing skin images.
	const [showSkin, setShowSkin] = useState(false);
	const [skinMode, setSkinMode] = useState(0);

	// Set initial states for animations.
	const [animationValue, setAnimationValue] = useState(0);
	const [animation, setAnimation] = useState(undefined);
	const [animationMode, setAnimationMode] = useState(0);
	const [animationDormValue, setAnimationDormValue] = useState(0);

	// States and functions for the Backdrop overlay image when the Floating Button is pressed.
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	const handleToggle = () => {
		setOpen(!open);
	};

	// This useEffect will run after the first render and will not be called again. This will be used to initialize the functionality of the page.
	useEffect(() => {
		// Set initial information displayed for Normal.
		tdoll.selected = tdoll.normal;

		// Check if T-Doll has Mod. If so, set state to true. If not, then false. This will impact various functions in this page.
		if (tdoll.mod !== null) {
			setHasMod(true);
		} else {
			setHasMod(false);
		}

		// Run initial skill description formatter.
		handleChangeSkillDescription();

		// Console log the T-Doll's information only once.
		console.log("Initial T-Doll state: ", tdoll);

		// Set the initial image to be displayed for the T-Doll.
		setTDollImage(tdoll.selected.images.card);

		// Set the initial animation to Wait.
		setAnimation(tdoll.selected.animations.wait);
	}, []);

	// Replace the T-Doll's image with normal or damaged versions.
	const switchBetweenNormalDamaged = () => {
		if (showSkin) {
			if (switchImage) {
				setTDollImage(tdoll.skins.skin_images[skinMode]);
				//console.log("Normal skin art is showed.");
				setSwitchImage(false);
			} else {
				setTDollImage(tdoll.skins.skin_images[skinMode + 1]);
				//console.log("Damaged skin art is showed.");
				setSwitchImage(true);
			}
		} else {
			if (switchImage) {
				setTDollImage(tdoll.selected.images.card);
				//console.log("Normal art is showed.");
				setSwitchImage(false);
			} else {
				setTDollImage(tdoll.selected.images.card_damaged);
				//console.log("Damaged art is showed.");
				setSwitchImage(true);
			}
		}
	};

	const renderImage = () => {
		// Show images depending on booleans, either Skins or Normal/Mod.

		if (showSkin) {
			if (switchImage) {
				return <img src={tdoll.skins.skin_images_full[skinMode + 1]} style={{ transform: "translate(0px, 50px)", minWidth: 400, maxWidth: "100%" }} alt="Damaged Full Skin" />;
			} else {
				return <img src={tdoll.skins.skin_images_full[skinMode]} style={{ transform: "translate(0px, 50px)", minWidth: 400, maxWidth: "100%" }} alt="Normal Full Skin" />;
			}
		} else {
			if (switchImage) {
				return <img src={tdoll.selected.images.full_damaged} style={{ transform: "translate(0px, 50px)", minWidth: 400, maxWidth: "100%" }} alt="Damaged Full" />;
			} else {
				return <img src={tdoll.selected.images.full} style={{ transform: "translate(0px, 50px)", minWidth: 400, maxWidth: "100%" }} alt="Normal Full" />;
			}
		}
	};

	useEffect(() => {
		var tempSkinMode = skinMode;

		if (tempSkinMode - 1 > 0) {
			tempSkinMode -= 1;
		} else {
			tempSkinMode = 0;
		}

		if (showSkin) {
			if (animationMode === 0) {
				setAnimation(tdoll.skins.animations.wait[tempSkinMode]);
			} else {
				setAnimation(tdoll.skins.animations_dorm.wait[tempSkinMode]);
			}
		}
	}, [showSkin, skinMode]);

	const switchModes = (event) => {
		//console.log("Switching between Normal and Mod information.");
		setShowSkin(false); // Set this to false so that the image rendered belongs to Normal or Mod, not any skin already selected.

		// Perform check if the information shown should be MOD. Then set the state of the T-Doll depending if MOD. Also set the state of the image.
		var tdoll_temp = backup;
		if (mode === 0) {
			//console.log("Setting to MOD");
			setMode(1);
			setShowModSkill(true);
			setSelectedSkill(0);
			tdoll_temp.selected = backup.mod;
		} else {
			//console.log("Setting to Normal");
			setMode(0);
			setShowModSkill(false);
			tdoll_temp.selected = backup.normal;
		}

		setTDoll(tdoll_temp);

		// Set the state of the T-Doll image and made sure to prevent duplicate click bug on the image.
		setTDollImage(tdoll_temp.selected.images.card);
		setSwitchImage(false);

		if (animationMode === 1) {
			setAnimation(tdoll_temp.selected.animations_dorm.wait);
		} else {
			setAnimation(tdoll_temp.selected.animations.wait);
		}

		setAnimationValue(0);
		setAnimationDormValue(0);
	};

	// Set image to the Normal skin at the newValue index inside JSON.
	const switchSkinModes = (event, newValue) => {
		//console.log("Setting displayed skin to Normal version and setting animation to the skin's wait animation.");
		setSkinMode(newValue);
		setShowSkin(true);

		setSwitchImage(false); // This is needed to make sure there are no duplicate click bug.

		// Odd numbers are the damaged versions. We only need the normal versions.
		switch (newValue) {
			case 0:
				setTDollImage(tdoll.skins.skin_images[0]);
				break;
			case 2:
				setTDollImage(tdoll.skins.skin_images[2]);
				break;
			case 4:
				setTDollImage(tdoll.skins.skin_images[4]);
				break;
			case 6:
				setTDollImage(tdoll.skins.skin_images[6]);
				break;
			case 8:
				setTDollImage(tdoll.skins.skin_images[8]);
				break;
			case 10:
				setTDollImage(tdoll.skins.skin_images[10]);
				break;
			default:
		}

		var tempSkinMode = skinMode;

		if (tempSkinMode - 1 > 0) {
			tempSkinMode -= 1;
		} else {
			tempSkinMode = 0;
		}

		if (animationMode === 0) {
			setAnimation(tdoll.skins.animations.wait[tempSkinMode]);
		} else {
			setAnimation(tdoll.skins.animations_dorm.wait[tempSkinMode]);
		}

		setAnimationValue(0);
		setAnimationDormValue(0);
	};

	// Switch the animations between Normal and Dorm.
	const switchAnimationMode = () => {
		//console.log("Switching between Normal and Dorm animations.");

		var tempSkinMode = skinMode;

		if (tempSkinMode - 1 > 0) {
			tempSkinMode -= 1;
		} else {
			tempSkinMode = 0;
		}

		if (animationMode === 0) {
			//console.log("Switching to Dorm animations...");
			setAnimationMode(1);
			setAnimationValue(0);
			setAnimationDormValue(0);

			if (showSkin) {
				setAnimation(tdoll.skins.animations_dorm.wait[tempSkinMode]);
			} else {
				setAnimation(tdoll.selected.animations_dorm.wait);
			}
		} else {
			//console.log("Switching to Normal animations...");
			setAnimationMode(0);
			setAnimationValue(0);
			setAnimationDormValue(0);

			if (showSkin) {
				setAnimation(tdoll.skins.animations.wait[tempSkinMode]);
			} else {
				setAnimation(tdoll.selected.animations.wait);
			}
		}
	};

	const renderAnimationTabs = () => {
		if (animationMode === 0) {
			// If Mod...
			if (mode === 1 || showSkin) {
				return (
					<Tabs className={classes.tabs} value={animationValue} onChange={switchAnimations} indicatorColor="primary" textColor="primary" scrollButtons="on" variant="scrollable">
						<Tab label="Wait" />
						<Tab label="Move" />
						<Tab label="Attack" />
						<Tab label="Die" />
						<Tab label="Victory" />
						<Tab label="VictoryLoop" />
					</Tabs>
				);
			} else {
				return (
					<Tabs className={classes.tabs} value={animationValue} onChange={switchAnimations} indicatorColor="primary" textColor="primary" scrollButtons="on" variant="scrollable">
						<Tab label="Wait" />
						<Tab label="Move" />
						<Tab label="Attack" />
						<Tab label="Die" />
						<Tab label="Victory" />
						<Tab label="Victory2" />
						<Tab label="VictoryLoop" />
					</Tabs>
				);
			}
		} else {
			return (
				<Tabs className={classes.tabs} value={animationDormValue} onChange={switchAnimations} indicatorColor="primary" textColor="primary" scrollButtons="on" variant="scrollable">
					<Tab label="Wait" />
					<Tab label="Move" />
					<Tab label="Pick" />
					<Tab label="Sit" />
					<Tab label="Lying" />
				</Tabs>
			);
		}
	};

	// Switch animations based on Tab selected.
	const switchAnimations = (event, newValue) => {
		//console.log("Switching animation based on the tab selected.");
		var tempSkinMode = skinMode;

		if (tempSkinMode - 1 > 0) {
			tempSkinMode -= 1;
		} else {
			tempSkinMode = 0;
		}

		if (animationMode === 0) {
			setAnimationValue(newValue);

			switch (newValue) {
				case 0:
					if (showSkin) {
						setAnimation(tdoll.skins.animations.wait[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations.wait);
					}
					break;
				case 1:
					if (showSkin) {
						setAnimation(tdoll.skins.animations.move[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations.move);
					}
					break;
				case 2:
					if (showSkin) {
						setAnimation(tdoll.skins.animations.attack[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations.attack);
					}
					break;
				case 3:
					if (showSkin) {
						setAnimation(tdoll.skins.animations.die[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations.die);
					}
					break;
				case 4:
					if (showSkin) {
						setAnimation(tdoll.skins.animations.victory[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations.victory);
					}
					break;
				case 5:
					if (mode === 1 || showSkin) {
						if (showSkin) {
							setAnimation(tdoll.skins.animations.victoryloop[tempSkinMode]);
						} else {
							setAnimation(tdoll.selected.animations.victoryloop);
						}
					} else {
						setAnimation(tdoll.selected.animations.victory2);
					}
					break;
				case 6:
					setAnimation(tdoll.selected.animations.victoryloop);
					break;
				default:
			}
		} else {
			setAnimationDormValue(newValue);

			switch (newValue) {
				case 0:
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.wait[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.wait);
					}

					break;
				case 1:
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.move[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.move);
					}
					break;
				case 2:
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.pick[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.pick);
					}
					break;
				case 3:
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.sit[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.sit);
					}
					break;
				case 4:
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.lying[tempSkinMode]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.lying);
					}
					break;
				default:
			}
		}
	};

	// This function will return tiles depending on the tile set information in the JSON.
	const tileSetFunction = (tile, index) => {
		var temp = "";
		if (tile === 0) {
			temp = <td className={classes.blackTile} key={index}></td>;
		} else if (tile === 1) {
			temp = <td className={classes.cyanTile} key={index}></td>;
		} else {
			temp = <td className={classes.whiteTile} key={index}></td>;
		}

		return temp;
	};

	const renderTileSetInformation = () => {
		var number_of_stats = tdoll.selected.tile_set.number_of_stats;
		var tempStat = "";
		switch (number_of_stats) {
			case 1:
				tempStat = tdoll.selected.tile_set.stat1[0] + '<span style="color: yellow;"><ins>' + tdoll.selected.tile_set.stat2[0] + "</ins></span>";
				break;
			case 2:
				tempStat =
					tdoll.selected.tile_set.stat1[0] +
					'<span style="color: yellow;"><ins>' +
					tdoll.selected.tile_set.stat2[0] +
					"</ins></span> <br />" +
					tdoll.selected.tile_set.stat1[1] +
					'<span style="color: yellow;"><ins>' +
					tdoll.selected.tile_set.stat2[1] +
					"</ins></span>";
				break;
			default:
		}

		return tempStat;
	};

	const renderSkinsTabs = () => {
		var tempTabs = [];

		tdoll.skins.skin_names.map((name, index) => {
			return tempTabs.push(<Tab label={name} key={index} value={index === 0 ? 0 : index + 1} />);
		});

		return tempTabs;
	};

	// Switch between Skills 1 and 2 if T-Doll has Mod.
	const handleChangeSkills = (event, newValue) => {
		setSelectedSkill(newValue);
	};

	const handleChangeSkillDescription = () => {
		// A hack-job attempt at programmatically replacing all delimiters with the appropriate stat numbers at the chosen skill level.
		// It will also insert into the strings some <span> and <ins> tags in order to highlight what stats are changed when the skill level changes.
		// The npm package html-react-parser will parse the inserted span tags and properly render them into HTML tags.
		// Note: The styling being inserted is using HTML styling and not using React styling.

		var tdollTemp = tdoll; // Using the const backup to make sure that it is reading the delimiters inside the description correctly.

		// Reset the description to have it include the delimiters again and set variables to be used.
		tdollTemp.selected.skill.description = backup.normal.skill.description;
		var tempSkillDescription1 = tdollTemp.selected.skill.description;
		var numberOfStats1 = tdollTemp.selected.skill.number_of_stats;
		if ("skill2" in tdollTemp.selected) {
			tdollTemp.selected.skill2.description = backup.mod.skill2.description;
			var tempSkillDescription2 = tdollTemp.selected.skill2.description;
			var numberOfStats2 = tdollTemp.selected.skill2.number_of_stats;
		}

		// If T-Doll has Mod, set both Skills 1 and 2. If not, only set Skill 1.
		if (showModSkill) {
			// Go through Skill 1 first.
			switch (numberOfStats1) {
				case 1:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			// Go through Skill 2 next.
			switch (numberOfStats2) {
				case 1:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#3", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill2.stat3[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			//console.log("Skill 1 Description: ", tempSkillDescription1);
			//console.log("Skill 2 Description: ", tempSkillDescription2);

			// Save the skill descriptions into their states.
			setSkillDescription1(tempSkillDescription1);
			setSkillDescription2(tempSkillDescription2);
		} else {
			switch (numberOfStats1) {
				case 1:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 125%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			//console.log("Skill 1 only Description: ", tempSkillDescription1);
			setSkillDescription1(tempSkillDescription1);
		}
	};

	useEffect(() => {
		handleChangeSkillDescription();
	}, [skillLevel, mode]);

	// useEffect(() => {
	// 	console.log("0 for Normal, 1 for Dorm animations...");
	// 	console.log("Animation Mode: ", animationMode);
	// 	console.log("Normal Animation Tab selected: ", animationValue);
	// 	console.log("Dorm Animation Tab selected: ", animationDormValue);
	// 	var tempSkinMode = skinMode;
	// 	console.log("Skin selected before calc: ", tempSkinMode);

	// 	if (tempSkinMode - 1 > 0) {
	// 		tempSkinMode -= 1;
	// 	} else {
	// 		tempSkinMode = 0;
	// 	}

	// 	console.log("Skin selected after calc: ", tempSkinMode);
	// });

	return (
		<main>
			<Container className={classes.cardGrid} maxWidth="lg">
				<br />

				<Card className={classes.card}>
					<CardContent>
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
							<Grid item key="T-Doll image" xs={12} sm={6}>
								{/* {hasMod ? (
									<Tabs className={classes.tabs} value={mode} onChange={switchModes} indicatorColor="primary" textColor="primary" scrollButtons="on" variant="scrollable">
										<Tab label="Normal" />
										<Tab label="MOD" />
									</Tabs>
								) : (
									<Tabs className={classes.tabs} value={mode} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
										<Tab label="Normal" />
									</Tabs>
								)} */}

								<Tabs className={classes.tabs} value={false} onChange={switchSkinModes} indicatorColor="primary" textColor="primary" scrollButtons="on" variant="scrollable">
									{renderSkinsTabs()}
								</Tabs>

								<Card className={classes.cardForImage} elevation={12}>
									<CardActionArea onClick={switchBetweenNormalDamaged}>
										<CardMedia component="img" className={classes.cardMediaForImage} image={tdollImage} title={tdoll.selected.name} />
									</CardActionArea>
									{/* Floating Action Button overlayed over image at the top left */}
									{hasMod ? (
										<Fab color="primary" className={classes.fab_mod} onClick={switchModes}>
											<img src={mod_button} alt="Switch between Normal/Mod" style={{ height: 32, width: 32 }} />
										</Fab>
									) : (
										""
									)}

									{/* Floating Action Button overlayed over image at the bottom left */}
									<Fab color="primary" className={classes.fab} onClick={handleToggle}>
										<ZoomOutMapIcon />
									</Fab>
									{/* Display full size images based on boolean */}
									<Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
										{renderImage()}
									</Backdrop>
								</Card>

								{/* T-Doll's animations */}
								<Fab color="primary" className={classes.fab_dorm} onClick={switchAnimationMode}>
									<img src={dorm_button} alt="Switch between Normal/Dorm" style={{ height: 28, width: 28 }} />
								</Fab>

								{renderAnimationTabs()}

								<Card className={classes.cardForAnimation} elevation={12}>
									<GifPlayer gif={animation} style={{ height: 250, width: 250, zIndex: 0 }} autoplay={true} />
								</Card>
							</Grid>

							<Grid item key="T-Doll stat table and skill card" xs={12} sm={6}>
								{/* T-Doll's skill information */}
								{showModSkill ? (
									<Tabs className={classes.tabsForSkills} value={selectedSkill} onChange={handleChangeSkills} indicatorColor="primary" textColor="primary" scrollButtons="auto" centered>
										<Tab label="Skill 1" />
										<Tab label="Skill 2" />
									</Tabs>
								) : (
									<Tabs className={classes.tabsForSkills} value={0} indicatorColor="primary" textColor="primary" centered>
										<Tab label="Skill 1" />
									</Tabs>
								)}
								<Card className={classes.cardForSkill} elevation={12}>
									<CardContent>
										<CardHeader
											avatar={<Avatar variant="rounded" src={selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? tdoll.selected.skill2.image_skill : tdoll.selected.skill.image_skill} />}
											title={selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? tdoll.selected.skill2.name : tdoll.selected.skill.name}
											subheader={
												selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? "Initial CD: " + tdoll.selected.skill2.initial_cooldown : "Initial CD: " + tdoll.selected.skill.initial_cooldown
											}
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
														// MenuProps will shift the drop down menu to the right.
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
											{selectedSkill === 1 && showModSkill ? parse(skillDescription2) : parse(skillDescription1)}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											Cooldown:{" "}
											{
												<span style={{ color: "cyan" }}>
													<ins>{selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? tdoll.selected.skill2.cooldown[skillLevel - 1] : tdoll.selected.skill.cooldown[skillLevel - 1]}s</ins>
												</span>
											}
										</Typography>
									</CardContent>
								</Card>

								<br />

								{/* T-Doll's tileset information */}
								<Card className={classes.cardForTileSet} elevation={12}>
									<div className={classes.tileSetDiv}>
										<CardContent className={classes.content}>
											<table className={classes.tableTileSet} id="tdoll-tileset">
												<tbody>
													<tr>
														{tdoll.selected.tile_set.row1.map((tile, index) => {
															return tileSetFunction(tile, index);
														})}
													</tr>
													<tr>
														{tdoll.selected.tile_set.row2.map((tile, index) => {
															return tileSetFunction(tile, index);
														})}
													</tr>
													<tr>
														{tdoll.selected.tile_set.row3.map((tile, index) => {
															return tileSetFunction(tile, index);
														})}
													</tr>
												</tbody>
											</table>
										</CardContent>

										<CardContent className={classes.tileSetInformation}>
											<Typography className={classes.title} color="textPrimary" gutterBottom>
												{tdoll.selected.tile_set.targets}
											</Typography>
											<Typography className={classes.pos} color="textSecondary">
												{parse(renderTileSetInformation())}
											</Typography>
										</CardContent>
									</div>
								</Card>

								<br />

								{/* T-Doll's stats in table format */}
								<TableContainer className={classes.tableContainer} component={Paper} elevation={12}>
									<Table className={classes.table} size="small">
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
						</Grid>
					</CardContent>
				</Card>
			</Container>
		</main>
	);
}
