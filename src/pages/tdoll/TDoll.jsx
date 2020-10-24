import React, { useState, useEffect } from "react";
import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the skill description strings.

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

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
	Backdrop,
	Divider
	//Grow
} from "@material-ui/core";

// MaterialUI icon imports
import StarIcon from "@material-ui/icons/Star";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// GifPlayer import and CSS styling for it.
import GifPlayer from "react-gif-player";
import "./styles.css";

// Image imports
//import rarity_star from "../../images/rarity_star.png";
import mod_button from "../../images/mod.png";
import dorm_button from "../../images/dorm_button.png";
import combat_button from "../../images/combat_button.png";

export default function TDoll(props) {
	const useStyles = makeStyles((theme) => ({
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
		cardForCombatAnimations: {
			display: "flex",
			justifyContent: "center",
			width: 256,
			// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
			backgroundImage: "linear-gradient(45deg, #000000 12.50%, #3d3d3d 12.50%, #3d3d3d 50%, #000000 50%, #000000 62.50%, #3d3d3d 62.50%, #3d3d3d 100%)",
			backgroundSize: "5.66px 5.66px",
			cursor: "pointer",
			backgroundColor: theme.palette.grey[700]
		},
		cardForDormAnimations: {
			display: "flex",
			justifyContent: "center",
			width: 256,
			// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
			backgroundImage: "linear-gradient(45deg, #000000 12.50%, #3d3d3d 12.50%, #3d3d3d 50%, #000000 50%, #000000 62.50%, #3d3d3d 62.50%, #3d3d3d 100%)",
			backgroundSize: "5.66px 5.66px",
			// backgroundImage:
			// 	"linear-gradient(45deg, #000000 5.56%, #292929 5.56%, #292929 33.33%, #424242 33.33%, #424242 50%, #000000 50%, #000000 55.56%, #292929 55.56%, #292929 83.33%, #424242 83.33%, #424242 100%)",
			// backgroundSize: "12.73px 12.73px",
			cursor: "pointer",
			backgroundColor: theme.palette.grey[700]
		},
		cardMedia: {
			paddingTop: "56.25%" // 16:9
		},
		rarityStars: {
			listStyleType: "none",
			display: "inline",
			margin: 0,
			padding: 0
		},
		rarityStar: {
			display: "inline-block",
			transform: "translate(0px, 3px)", // This will set the rendered stars to be inline with the T-Doll's type text.
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
		cooldownText: {
			paddingTop: 12
		},
		tabs: {
			width: 256,
			backgroundColor: theme.palette.grey[900]
		},
		tabForSkin: {
			width: 100
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
		fabExpand: {
			display: "inline-flex",
			transform: "translate(5px, -85px)",
			height: 40,
			width: 40,
			opacity: "75%"
		},
		fabNoMod: {
			display: "inline-flex",
			transform: "translate(5px, -45px)",
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
		fab_clickThrough: {
			display: "block",
			transform: "translate(5px, -505px)",
			height: 40,
			width: 40,
			opacity: "0%",
			pointerEvents: "none"
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
		},
		fullImage: {
			height: "100%",
			width: "100%",
			objectFit: "contain"
		}
	}));

	const classes = useStyles();

	///////////////////////////////////////////////////////////////////////////////////////////
	// Initialization of States
	///////////////////////////////////////////////////////////////////////////////////////////

	// Grab the T-Doll's information from the JSONs.
	const id = props.location.search.substring(4);
	var tdolls = undefined;
	if (id <= 100) {
		tdolls = require("../../data/tdolls_from_1_to_100").default;
	} else if (id > 100 && id <= 200) {
		tdolls = require("../../data/tdolls_from_101_to_200").default;
	} else if (id > 200 && id <= 300) {
		tdolls = require("../../data/tdolls_from_201_to_300").default;
	} else if (id > 300 && id <= 400) {
		tdolls = require("../../data/tdolls_from_301_to_400").default;
	} else if (id >= 1000 && id <= 1050) {
		tdolls = require("../../data/tdolls_from_1000_to_1050").default;
	}

	const [tdoll, setTDoll] = useState(tdolls.find((element) => element.normal.id === parseInt(id)));

	const [check, setCheck] = useState(true);
	if (check) {
		console.clear();
		tdoll.selected = tdoll.normal;
		setCheck(false);
	}

	// Set initial states for the Normal/Mod modes.
	const [hasMod, setHasMod] = useState(false);
	const [mode, setMode] = useState(0); // 0 for Normal, 1 for MOD.

	// Set initial states for the images.
	const [switchImage, setSwitchImage] = useState(false); // If true, show Damaged version.
	const [tdollImage, setTDollImage] = useState(undefined);
	const [showSkin, setShowSkin] = useState(false);
	const [skinSelected, setSkinSelected] = useState(undefined); // The value of this is dependent on how many skins a T-Doll has.

	// Set initial states for the skills. Set Skill 2 to the description of Skill 1 in case T-Doll does not have a Neural Upgrade.
	const [showModSkill, setShowModSkill] = useState(false);
	const [skillLevel, setSkillLevel] = useState(10);
	const [skillDescription1, setSkillDescription1] = useState(tdoll.normal.skill.description);
	const [skillDescription2, setSkillDescription2] = useState(tdoll.normal.skill.description);
	const [selectedSkill, setSelectedSkill] = useState(0); // 0 for Normal skill, 1 for MOD skill if it exists.

	// Set initial states for animations.
	const [animation, setAnimation] = useState(undefined);
	const [animationMode, setAnimationMode] = useState(0); // 0 for Normal animations, 1 for Dorm animations.
	const [animationTabSelected, setAnimationTabSelected] = useState("wait");
	const [animationDormTabSelected, setAnimationDormTabSelected] = useState("wait");

	// Set initial miscellaneous states.
	const [open, setOpen] = useState(false);

	///////////////////////////////////////////////////////////////////////////////////////////
	// useEffect and helper functions
	///////////////////////////////////////////////////////////////////////////////////////////

	// This will be used to initialize the functionality of the page.
	useEffect(() => {
		// Set initial information displayed to Normal.
		tdoll.selected = tdoll.normal;

		// Check if T-Doll has Mod. If so, set state to true. If not, then false. This will impact various functions in this page.
		if (tdoll.mod !== null) {
			setHasMod(true);
		} else {
			setHasMod(false);
		}

		// Run skill description formatter.
		handleChangeSkillDescription();

		// Set the initial image and animation to be displayed for the T-Doll.
		setTDollImage(tdoll.selected.images.card);
		setAnimation(tdoll.selected.animations.wait);

		console.log("Initial T-Doll state: ", tdoll);
	}, []);

	// This will update the animations when skins are switched.
	useEffect(() => {
		var tempSkinSelected = helperSkinSelected();
		if (showSkin) {
			if (animationMode === 0) {
				setAnimation(tdoll.skins.animations.wait[tempSkinSelected]);
			} else {
				setAnimation(tdoll.skins.animations_dorm.wait[tempSkinSelected]);
			}
		}
	}, [showSkin, skinSelected]);

	// This will update the skill descriptions when different skills are selected or their skill levels change.
	useEffect(() => {
		handleChangeSkillDescription();
	}, [skillLevel, mode]);

	// // Print out debugging information at each render.
	// useEffect(() => {
	// 	console.log("Animation Mode: ", animationMode);
	// 	console.log("Normal Animation Tab selected: ", animationTabSelected);
	// 	console.log("Dorm Animation Tab selected: ", animationDormTabSelected);
	// 	var tempSkinSelected = helperSkinSelected();
	// 	console.log("Show skin? ", showSkin);
	// 	console.log("Skin selected before calc: ", tempSkinSelected);
	// 	console.log("Skin selected after calc: ", tempSkinSelected);
	// });

	// Helper function to determine the correct selected skin.
	const helperSkinSelected = () => {
		var tempSkinSelected = skinSelected;

		return tempSkinSelected / 2;
	};

	// Helper function to reset selected animation tab back to the default tab.
	const helperResetAnimationTabs = () => {
		setAnimationTabSelected("wait");
		setAnimationDormTabSelected("wait");
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for switching between modes, like Mod or Dorm.
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch information/images/animations displayed between Normal or Mod. Will reset skin selected.
	const switchModes = (event) => {
		var tdoll_temp = tdoll;

		setShowSkin(false); // Prevent skin image to be rendered if it was selected.
		setSkinSelected(undefined);

		// Perform check to see if the information shown should be Mod or not.
		if (mode === 0 && hasMod) {
			// Switch to Mod information.
			tdoll_temp.selected = tdoll.mod;
			setShowModSkill(true);
			setMode(1);
		} else {
			// Switch to Normal information.
			tdoll_temp.selected = tdoll.normal;
			setShowModSkill(false);
			setMode(0);
		}

		// Set T-Doll image.
		setTDollImage(tdoll_temp.selected.images.card);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		// Set animation.
		if (animationMode === 1) {
			setAnimation(tdoll_temp.selected.animations_dorm.wait);
		} else {
			setAnimation(tdoll_temp.selected.animations.wait);
		}

		// Finalize state updates.
		setTDoll(tdoll_temp);
		setSelectedSkill(0);
		helperResetAnimationTabs();
	};

	// Switch the animations between Normal and Dorm.
	const switchAnimationMode = () => {
		helperResetAnimationTabs();

		var tempSkinSelected = helperSkinSelected();
		if (animationMode === 0) {
			// Switch to Dorm animations.
			if (showSkin) {
				setAnimation(tdoll.skins.animations_dorm.wait[tempSkinSelected]);
			} else {
				setAnimation(tdoll.selected.animations_dorm.wait);
			}

			setAnimationMode(1);
		} else {
			// Switch to Normal animations.
			if (showSkin) {
				setAnimation(tdoll.skins.animations.wait[tempSkinSelected]);
			} else {
				setAnimation(tdoll.selected.animations.wait);
			}

			setAnimationMode(0);
		}
	};

	// Function will render a floating button to go back to Normal art if a skin is selected. Assumes no Mod is available to T-Doll.
	const renderNormalButton = () => {
		if (showSkin) {
			return (
				<Fab color="primary" className={classes.fab_mod} onClick={switchToNormalArt}>
					<ExitToAppIcon alt="Switch back to Normal" style={{ height: 40, width: 25 }} />
				</Fab>
			);
		} else {
			return (
				<Fab color="primary" className={classes.fab_clickThrough}>
					<></>
				</Fab>
			);
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for skill descriptions
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch between Skills 1 and 2 if T-Doll has Mod.
	const handleChangeSkills = (event, newValue) => {
		setSelectedSkill(newValue);
	};

	/*
	A hack-job attempt at programmatically replacing all delimiters with the appropriate stats at the chosen skill level.
	It will also insert into the strings some <span> and <ins> tags for visual clarity.
	The npm package html-react-parser will parse the inserted span tags and properly render them into HTML tags.
	Note: The styling being inserted is using HTML styling and not using React styling.
	*/
	const handleChangeSkillDescription = () => {
		var tdollTemp = tdoll;

		// Reset the descriptions to have it include the delimiters again and set variables to be used.
		tdollTemp.selected.skill.description = tdoll.normal.skill.description;
		var tempSkillDescription1 = tdollTemp.selected.skill.description;
		var numberOfStats1 = tdollTemp.selected.skill.number_of_stats;

		if ("skill2" in tdollTemp.selected) {
			tdollTemp.selected.skill2.description = tdoll.mod.skill2.description;
			var tempSkillDescription2 = tdollTemp.selected.skill2.description;
			var numberOfStats2 = tdollTemp.selected.skill2.number_of_stats;
		}

		// If T-Doll has Mod, format both Skills 1 and 2. If not, only format Skill 1.
		if (showModSkill) {
			// Format Skill 1 first.
			switch (numberOfStats1) {
				case 1:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					break;
				case 4:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat4[skillLevel - 1] + "</ins></span>");
					break;
				case 5:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat4[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#5", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat5[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			// Format Skill 2 next.
			switch (numberOfStats2) {
				case 1:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat3[skillLevel - 1] + "</ins></span>");
					break;
				case 4:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat4[skillLevel - 1] + "</ins></span>");
					break;
				case 5:
					tempSkillDescription2 = tempSkillDescription2.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat4[skillLevel - 1] + "</ins></span>");
					tempSkillDescription2 = tempSkillDescription2.replace("#5", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill2.stat5[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			if ("passive_active_description" in tdollTemp.selected.skill) {
				tempSkillDescription1 = tempSkillDescription1.replace("Passive: ", '<span style="color: orange; font-size: 110%;"><ins>Passive:</ins></span> ');
				tempSkillDescription1 = tempSkillDescription1.replace("Active: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />Active:</ins></span> ');
			}
			if ("passive_active_description" in tdollTemp.selected.skill2) {
				tempSkillDescription2 = tempSkillDescription2.replace("Passive: ", '<span style="color: orange; font-size: 110%;"><ins>Passive:</ins></span> ');
				tempSkillDescription2 = tempSkillDescription2.replace("Active: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />Active:</ins></span> ');
			}

			if ("passive_passive_description" in tdollTemp.selected.skill2) {
				tempSkillDescription2 = tempSkillDescription2.replace("Passive 1: ", '<span style="color: orange; font-size: 110%;"><ins>Passive 1:</ins></span> ');
				tempSkillDescription2 = tempSkillDescription2.replace("Passive 2: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />Passive 2:</ins></span> ');
			}

			setSkillDescription1(tempSkillDescription1);
			setSkillDescription2(tempSkillDescription2);
		} else {
			// Only format Skill 1.
			switch (numberOfStats1) {
				case 1:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					break;
				case 2:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					break;
				case 3:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					break;
				case 4:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat4[skillLevel - 1] + "</ins></span>");
					break;
				case 5:
					tempSkillDescription1 = tempSkillDescription1.replace("#1", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat1[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#2", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat2[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#3", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat3[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#4", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat4[skillLevel - 1] + "</ins></span>");
					tempSkillDescription1 = tempSkillDescription1.replace("#5", '<span style="color: cyan; font-size: 110%;"><ins>' + tdollTemp.selected.skill.stat5[skillLevel - 1] + "</ins></span>");
					break;
				default:
			}

			if ("passive_active_description" in tdollTemp.selected.skill) {
				tempSkillDescription1 = tempSkillDescription1.replace("Passive: ", '<span style="color: orange; font-size: 110%;"><ins>Passive:</ins></span> ');
				tempSkillDescription1 = tempSkillDescription1.replace("Active: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />Active:</ins></span> ');
			}

			setSkillDescription1(tempSkillDescription1);
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Card and Backdrop images
	///////////////////////////////////////////////////////////////////////////////////////////

	// Replace the T-Doll's card image with normal or damaged versions.
	const switchBetweenNormalDamagedCardImages = () => {
		if (showSkin) {
			if (switchImage) {
				// Normal Skin image
				if (mode === 1) {
					setTDollImage(tdoll.skins.mod_skin_images[skinSelected]);
				} else {
					setTDollImage(tdoll.skins.skin_images[skinSelected]);
				}
				setSwitchImage(false);
			} else {
				// Damaged Skin image
				if (mode === 1) {
					setTDollImage(tdoll.skins.mod_skin_images[skinSelected + 1]);
				} else {
					setTDollImage(tdoll.skins.skin_images[skinSelected + 1]);
				}
				setSwitchImage(true);
			}
		} else {
			if (switchImage) {
				// Normal image
				setTDollImage(tdoll.selected.images.card);
				setSwitchImage(false);
			} else {
				// Damaged image
				setTDollImage(tdoll.selected.images.card_damaged);
				setSwitchImage(true);
			}
		}
	};

	// Replace Card image with the Normal version of the selected skin.
	const switchSkinSelected = (event, newValue) => {
		setSkinSelected(newValue);
		setShowSkin(true);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		// Switch to the modded Skin image cards when currently displaying Mod information.
		if (mode === 1) {
			setTDollImage(tdoll.skins.mod_skin_images[newValue]);
		} else {
			setTDollImage(tdoll.skins.skin_images[newValue]);
		}

		// Switch animations based on the animation mode selected, Normal or Dorm.
		var tempSkinSelected = helperSkinSelected();
		if (animationMode === 0) {
			setAnimation(tdoll.skins.animations.wait[tempSkinSelected]);
		} else {
			setAnimation(tdoll.skins.animations_dorm.wait[tempSkinSelected]);
		}

		// Reset animation tab selected.
		helperResetAnimationTabs();
	};

	// Show full images for the Backdrop component depending on whether it is the skin or Normal/Mod selected.
	const renderImage = () => {
		if (showSkin) {
			if (switchImage) {
				return <img src={tdoll.skins.skin_images_full[skinSelected + 1]} className={classes.fullImage} alt="Damaged Full Skin" />;
			} else {
				return <img src={tdoll.skins.skin_images_full[skinSelected]} className={classes.fullImage} alt="Normal Full Skin" />;
			}
		} else {
			if (switchImage) {
				return <img src={tdoll.selected.images.full_damaged} className={classes.fullImage} alt="Damaged Full" />;
			} else {
				return <img src={tdoll.selected.images.full} className={classes.fullImage} alt="Normal Full" />;
			}
		}
	};

	// Switch back to Normal information if user already selected a skin.
	const switchToNormalArt = () => {
		switchModes();
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tab functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Render tabs for animation selection based on Normal or Dorm animation mode active.
	const renderAnimationTabs = () => {
		var tempSkinSelected = helperSkinSelected();
		if (animationMode === 0) {
			if (showSkin) {
				return (
					<Tabs
						className={classes.tabs}
						value={animationTabSelected}
						onChange={(e, value) => switchAnimations(value)}
						indicatorColor="primary"
						textColor="primary"
						scrollButtons="on"
						variant="scrollable"
					>
						<Tab label="Wait" value="wait" />
						{"hasWait2Animation" in tdoll.skins.animations && tdoll.skins.animations.hasWait2Animation[tempSkinSelected] ? <Tab label="Wait2" value="wait2" /> : ""}
						<Tab label="Move" value="move" />
						<Tab label="Attack" value="attack" />
						{tdoll.skins.animations.hasSkillAnimation[tempSkinSelected] ? <Tab label="Skill" value="skill" /> : ""}
						{"hasAttack2Animation" in tdoll.skins.animations && tdoll.skins.animations.hasAttack2Animation[tempSkinSelected] ? <Tab label="Attack2" value="attack2" /> : ""}
						{tdoll.selected.type === "MG" ? <Tab label="Reload" value="reload" /> : ""}
						<Tab label="Die" value="die" />
						<Tab label="Victory" value="victory" />
						{tdoll.skins.animations.hasVictoryLoopAnimation[tempSkinSelected] ? <Tab label="VictoryLoop" value="victoryloop" /> : ""}
					</Tabs>
				);
			} else {
				return (
					<Tabs
						className={classes.tabs}
						value={animationTabSelected}
						onChange={(e, value) => switchAnimations(value)}
						indicatorColor="primary"
						textColor="primary"
						scrollButtons="on"
						variant="scrollable"
					>
						<Tab label="Wait" value="wait" />
						{"hasWait2Animation" in tdoll.normal.animations ? <Tab label="Wait2" value="wait2" /> : ""}
						<Tab label="Move" value="move" />
						<Tab label="Attack" value="attack" />
						{tdoll.selected.animations.hasSkillAnimation ? <Tab label="Skill" value="skill" /> : ""}
						{"skill2" in tdoll.selected.animations ? <Tab label="Skill2" value="skill2" /> : ""}
						{"hasAttack2Animation" in tdoll.selected.animations ? <Tab label="Attack2" value="attack2" /> : ""}
						{"spattack" in tdoll.selected.animations ? <Tab label="Special Attack" value="spattack" /> : ""}
						{"spattack2" in tdoll.selected.animations ? <Tab label="Special Attack2" value="spattack2" /> : ""}
						{"landing" in tdoll.selected.animations ? <Tab label="Landing" value="landing" /> : ""}
						{tdoll.selected.type === "MG" ? <Tab label="Reload" value="reload" /> : ""}
						<Tab label="Die" value="die" />
						<Tab label="Victory" value="victory" />
						{"victory2" in tdoll.selected.animations && !showSkin ? <Tab label="Victory2" value="victory2" /> : ""}
						{tdoll.selected.animations.hasVictoryLoopAnimation ? <Tab label="VictoryLoop" value="victoryloop" /> : ""}
					</Tabs>
				);
			}
		} else {
			return (
				<Tabs
					className={classes.tabs}
					value={animationDormTabSelected}
					onChange={(e, value) => switchAnimations(value)}
					indicatorColor="primary"
					textColor="primary"
					scrollButtons="on"
					variant="scrollable"
				>
					<Tab label="Wait" value="wait" />
					<Tab label="Move" value="move" />
					{(tdoll.skins && showSkin && tdoll.skins.animations_dorm.hasActionAnimation[tempSkinSelected]) || "hasActionAnimation" in tdoll.selected.animations ? (
						<Tab label="Action" value="action" />
					) : (
						""
					)}
					<Tab label="Pick" value="pick" />
					<Tab label="Sit" value="sit" />
					{tdoll.skins && showSkin && tdoll.skins.animations_dorm.hasSit2Animation[tempSkinSelected] ? <Tab label="Sit2" value="sit2" /> : ""}
					<Tab label="Lying" value="lying" />
				</Tabs>
			);
		}
	};

	// Render tabs for skin selection.
	const renderSkinsTabs = () => {
		var tempTabs = [];

		if (tdoll.skins === null) {
			return tempTabs.push();
		}

		tdoll.skins.skin_names.map((name, index) => {
			// Index is doubled for the value such that the Damaged versions are not selected.
			return tempTabs.push(<Tab className={classes.tabForSkin} label={name} key={index} wrapped value={index * 2} />);
		});

		return tempTabs;
	};

	// Switch animations based on Tab selected.
	const switchAnimations = (newValue) => {
		var tempSkinSelected = helperSkinSelected();

		if (animationMode === 0) {
			setAnimationTabSelected(newValue);

			// This switch block is for Normal/Mod Animations.
			switch (newValue) {
				case "wait":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.wait[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.wait);
					}
					break;
				case "wait2":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.wait2[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.wait2);
					}
					break;
				case "move":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.move[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.move);
					}
					break;
				case "attack":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.attack[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.attack);
					}
					break;
				case "attack2":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.attack2[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.attack2);
					}
					break;
				case "spattack":
					setAnimation(tdoll.selected.animations.spattack);

					break;
				case "spattack2":
					setAnimation(tdoll.selected.animations.spattack2);

					break;
				case "reload":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.reload[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.reload);
					}
					break;
				case "landing":
					setAnimation(tdoll.selected.animations.landing);

					break;
				case "die":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.die[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.die);
					}
					break;
				case "skill":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.skill[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.skill);
					}
					break;
				case "skill2":
					setAnimation(tdoll.selected.animations.skill2);

					break;
				case "victory":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.victory[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.victory);
					}
					break;
				case "victory2":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.victory2[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.victory2);
					}
					break;
				case "victoryloop":
					if (showSkin) {
						setAnimation(tdoll.skins.animations.victoryloop[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations.victoryloop);
					}
					break;
				default:
			}
		} else {
			setAnimationDormTabSelected(newValue);

			// This switch block is for Dorm Animations.
			switch (newValue) {
				case "wait":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.wait[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.wait);
					}

					break;
				case "move":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.move[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.move);
					}
					break;
				case "action":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.action[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.action);
					}
					break;
				case "pick":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.pick[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.pick);
					}
					break;
				case "sit":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.sit[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.sit);
					}
					break;
				case "sit2":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.sit2[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.sit2);
					}
					break;
				case "lying":
					if (showSkin) {
						setAnimation(tdoll.skins.animations_dorm.lying[tempSkinSelected]);
					} else {
						setAnimation(tdoll.selected.animations_dorm.lying);
					}
					break;
				default:
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tileset functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch the animation playing to the next one when you click on the GIF Player.
	const playerSwitchAnimations = () => {
		var currentAnimation = "";
		var animationArray = [];
		var tempSkinSelected = helperSkinSelected();

		// Populate array with animations based on checks in sequential order.
		if (animationMode === 0) {
			// For Normal Animations
			currentAnimation = animationTabSelected;

			animationArray.push("wait");
			if (
				(!showSkin && "hasWait2Animation" in tdoll.selected.animations) ||
				(showSkin && "hasWait2Animation" in tdoll.skins.animations && tdoll.skins.animations.hasWait2Animation[tempSkinSelected])
			) {
				animationArray.push("wait2");
			}
			animationArray.push("move");
			animationArray.push("attack");
			if ((!showSkin && tdoll.selected.animations.hasSkillAnimation) || (showSkin && tdoll.skins.animations.hasSkillAnimation[tempSkinSelected])) {
				animationArray.push("skill");
			}
			if (!showSkin && "skill2" in tdoll.selected.animations) {
				animationArray.push("skill2");
			}
			if (
				(!showSkin && "hasAttack2Animation" in tdoll.selected.animations) ||
				(showSkin && "hasAttack2Animation" in tdoll.skins.animations && tdoll.skins.animations.hasAttack2Animation[tempSkinSelected])
			) {
				animationArray.push("attack2");
			}
			if (!showSkin && "spattack" in tdoll.selected.animations) {
				animationArray.push("spattack");
			}
			if (!showSkin && "spattack2" in tdoll.selected.animations) {
				animationArray.push("spattack2");
			}
			if (!showSkin && "landing" in tdoll.selected.animations) {
				animationArray.push("landing");
			}
			if (tdoll.selected.type === "MG") {
				animationArray.push("reload");
			}
			animationArray.push("die");
			animationArray.push("victory");
			if ("victory2" in tdoll.selected.animations && !showSkin) {
				animationArray.push("victory2");
			}
			if ((!showSkin && tdoll.selected.animations.hasVictoryLoopAnimation) || (showSkin && tdoll.skins.animations.hasVictoryLoopAnimation[tempSkinSelected])) {
				animationArray.push("victoryloop");
			}
		} else {
			// For Dorm Animations
			currentAnimation = animationDormTabSelected;

			animationArray.push("wait");
			animationArray.push("move");
			if ((tdoll.skins && showSkin && tdoll.skins.animations_dorm.hasActionAnimation[tempSkinSelected]) || "hasActionAnimation" in tdoll.selected.animations) {
				animationArray.push("action");
			}
			animationArray.push("pick");
			animationArray.push("sit");
			if (tdoll.skins && showSkin && tdoll.skins.animations_dorm.hasSit2Animation[tempSkinSelected]) {
				animationArray.push("sit2");
			}
			animationArray.push("lying");
		}

		// Now determine the index of the current animation and set the new animation to the one after it. If current animation
		// is already the last, set the new animation to the first animation in the array.
		var tempIndex = animationArray.findIndex((animation) => animation === currentAnimation);
		if (tempIndex + 1 > animationArray.length - 1) {
			tempIndex = 0;
		} else {
			tempIndex += 1;
		}

		switchAnimations(animationArray[tempIndex]);
	};

	// This function will return tiles depending on the tile set information in the JSON.
	const createTileSetRow = (tile, index) => {
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

	// This will create a string with HTML span tags inserted into them for visual clarity.
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

	///////////////////////////////////////////////////////////////////////////////////////////
	// Misc Functions
	///////////////////////////////////////////////////////////////////////////////////////////

	// Render the amount of stars equal to the T-Doll's rarity next to its type text at the top of the Card.
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

	// The following 2 handle functions control the Backdrop component.
	const handleToggle = () => {
		setOpen(!open);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<main>
			<ScrollToTop />
			{/* <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={1000}> */}
			<Container className={classes.cardGrid} maxWidth="md">
				<br />

				<Card className={classes.card}>
					<CardContent>
						{/************** T-Doll's Name, Rarity in stars, type, and Index Number **************/}
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

						{/************** T-Doll image and skin images (Card/Full) **************/}
						<Grid container direction="row" spacing={2}>
							<Grid item key="T-Doll image" xs={12} sm={6}>
								{tdoll.skins !== null ? (
									tdoll.skins.number_of_skins === 1 ? (
										<Tabs
											className={classes.tabs}
											value={skinSelected !== undefined ? skinSelected : false}
											onChange={switchSkinSelected}
											indicatorColor="primary"
											textColor="primary"
											variant="fullWidth"
											scrollButtons="on"
										>
											{renderSkinsTabs()}
										</Tabs>
									) : (
										<Tabs
											className={classes.tabs}
											value={skinSelected !== undefined ? skinSelected : false}
											onChange={switchSkinSelected}
											indicatorColor="primary"
											textColor="primary"
											variant="scrollable"
											scrollButtons="on"
										>
											{renderSkinsTabs()}
										</Tabs>
									)
								) : (
									<Tabs className={classes.tabs} value={false} indicatorColor="primary" textColor="primary" variant="fullWidth" scrollButtons="auto" centered>
										<Tab label="No skins" />
									</Tabs>
								)}

								<Card className={classes.cardForImage} elevation={12}>
									<CardActionArea onClick={switchBetweenNormalDamagedCardImages}>
										<CardMedia component="img" className={classes.cardMediaForImage} image={tdollImage} title={tdoll.selected.name} />
									</CardActionArea>
									{/************** Floating Action Button overlayed over image at the top left **************/}
									{hasMod ? (
										<Fab color="primary" className={classes.fab_mod} onClick={switchModes}>
											<img src={mod_button} alt="Switch between Normal/Mod" style={{ height: 32, width: 32 }} />
										</Fab>
									) : (
										renderNormalButton()
									)}

									{/************** Floating Action Button overlayed over image at the bottom left **************/}
									<Fab color="primary" className={classes.fabExpand} onClick={handleToggle}>
										<ZoomOutMapIcon />
									</Fab>

									{/************** Display full size images based on boolean **************/}
									<Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
										{renderImage()}
									</Backdrop>
								</Card>

								{/************** T-Doll's animations **************/}
								<Fab color="primary" className={classes.fab_dorm} onClick={switchAnimationMode}>
									{animationMode === 0 ? (
										<img src={combat_button} alt="Switch to Dorm Animations" style={{ height: 32, width: 32, paddingTop: 3 }} />
									) : (
										<img src={dorm_button} alt="Switch to Normal Animations" style={{ height: 29, width: 29, paddingTop: 3 }} />
									)}
								</Fab>

								{renderAnimationTabs()}

								{animationMode === 0 ? (
									<Card className={classes.cardForCombatAnimations} elevation={12}>
										<GifPlayer gif={animation} style={{ height: 250, width: 250, zIndex: 0 }} autoplay={true} onClick={() => playerSwitchAnimations()} />
									</Card>
								) : (
									<Card className={classes.cardForDormAnimations} elevation={12}>
										<GifPlayer gif={animation} style={{ height: 250, width: 250, zIndex: 0 }} autoplay={true} onClick={() => playerSwitchAnimations()} />
									</Card>
								)}
							</Grid>

							<Grid item key="T-Doll stat table and skill card" xs={12} sm={6}>
								{/************** T-Doll's skill information **************/}
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

										<Divider />

										{/************** This will render the span tags inserted into the skill description and will color the numbers. **************/}
										<Typography className={classes.title} color="textSecondary" gutterBottom>
											{selectedSkill === 1 && showModSkill ? parse(skillDescription2) : parse(skillDescription1)}
										</Typography>
										{selectedSkill === 0 && tdoll.selected.skill.initial_cooldown !== "Passive" ? (
											<>
												<Divider />
												<Typography className={classes.cooldownText} color="textSecondary">
													Cooldown:{" "}
													{
														<span style={{ color: "cyan" }}>
															<ins>{tdoll.selected.skill.cooldown[skillLevel - 1]}s</ins>
														</span>
													}
												</Typography>
											</>
										) : (
											""
										)}
									</CardContent>
								</Card>

								<br />

								{/************** T-Doll's tileset information **************/}
								<Card className={classes.cardForTileSet} elevation={12}>
									<div className={classes.tileSetDiv}>
										<CardContent className={classes.content}>
											<table className={classes.tableTileSet} id="tdoll-tileset">
												<tbody>
													<tr>
														{tdoll.selected.tile_set.row1.map((tile, index) => {
															return createTileSetRow(tile, index);
														})}
													</tr>
													<tr>
														{tdoll.selected.tile_set.row2.map((tile, index) => {
															return createTileSetRow(tile, index);
														})}
													</tr>
													<tr>
														{tdoll.selected.tile_set.row3.map((tile, index) => {
															return createTileSetRow(tile, index);
														})}
													</tr>
												</tbody>
											</table>
										</CardContent>

										<CardContent className={classes.tileSetInformation}>
											<Typography className={classes.title} color="textPrimary" gutterBottom>
												{tdoll.selected.tile_set.targets}
											</Typography>
											<Typography color="textSecondary">{parse(renderTileSetInformation())}</Typography>
										</CardContent>
									</div>
								</Card>

								<br />

								{/************** T-Doll's stats in table format **************/}
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
			{/* </Grow> */}
		</main>
	);
}
