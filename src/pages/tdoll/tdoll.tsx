import { useEffect, useState } from "react";
import type { JSX } from "react";
import { useLocation, useParams } from "react-router-dom";
import parse from "html-react-parser"; // This is needed to parse the span tags inserted into the skill description strings.

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// MaterialUI imports
import {
    Box,
    Container,
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
    //Grow
    Divider,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import StarIcon from "@mui/icons-material/Star";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import "./styles.css";

import { uiUrl } from "../../lib/assets";
import { loadDoll, spineFor } from "../../lib/data";
import { spineImageBase, spineUrl } from "../../lib/assets";
import { animationTabs } from "../../lib/spine";
import SpineAnimation from "../../components/SpineAnimation";
import type { TDoll as TDollData, TDollForm } from "../../types/tdoll";

const mod_button = uiUrl("mod.png");
const dorm_button = uiUrl("dorm_button.png");
const combat_button = uiUrl("combat_button.png");

/** A doll paired with the form currently being displayed. */
interface DisplayTDoll extends TDollData {
	/** The form on screen: the base form, the Mod, or a skin. */
	selected: TDollForm;
}

const styles = {
	cardGrid: (theme: Theme) => ({
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8)
	}),
	card: {
		height: "100%",
		width: "100%"
	},
	cardForImage: {
		width: 256, // The dimensions of the images.
		height: 512,
		marginBottom: 10
	},
	cardForSkill: (theme: Theme) => ({
		minWidth: 256,
		backgroundColor: theme.palette.grey[700]
	}),
	cardForTileSet: (theme: Theme) => ({
		minWidth: 256,
		backgroundColor: theme.palette.grey[700]
	}),
	cardForCombatAnimations: (theme: Theme) => ({
		display: "flex",
		justifyContent: "center",
		width: 256,
		// Used https://stripesgenerator.com/ to generate the linear gradient stripes.
		backgroundImage: "linear-gradient(45deg, #000000 12.50%, #3d3d3d 12.50%, #3d3d3d 50%, #000000 50%, #000000 62.50%, #3d3d3d 62.50%, #3d3d3d 100%)",
		backgroundSize: "5.66px 5.66px",
		cursor: "pointer",
		backgroundColor: theme.palette.grey[700]
	}),
	cardForDormAnimations: (theme: Theme) => ({
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
	}),
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
	table: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.grey[700]
	}),
	title: {
		fontSize: 14
	},
	cooldownText: {
		paddingTop: 12
	},
	tabs: (theme: Theme) => ({
		width: 256,
		backgroundColor: theme.palette.grey[900]
	}),
	tabForSkin: {
		width: 100
	},
	tabsForSkills: (theme: Theme) => ({
		minWidth: 256,
		backgroundColor: theme.palette.grey[900]
	}),
	tableTileSet: {
		width: 100,
		height: 100,
		borderStyle: "solid",
		borderColor: "black",
		borderSpacing: 0,
		borderWidth: 2
	},
	blackTile: (theme: Theme) => ({
		backgroundColor: theme.palette.grey[800],
		width: "33%",
		borderStyle: "solid",
		borderColor: "black",
		borderWidth: 1
	}),
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
	backdrop: (theme: Theme) => ({
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff"
	}),
	fullImage: {
		height: "100%",
		width: "100%",
		objectFit: "contain"
	}
} satisfies Record<string, SxProps<Theme>>;

/**
 * Route wrapper that loads the doll before rendering it.
 *
 * @param props Router props carrying the doll id.
 * @returns A placeholder while loading, then the doll's page.
 */
export default function TDoll() {
	const { id: routeId } = useParams<{ id?: string }>();
	const { search } = useLocation();
	// The id comes from the /tdoll/:id route, falling back to the older ?id= query string.
	const id = Number(routeId ?? search.substring(4));
	const [doll, setDoll] = useState<DisplayTDoll | undefined>(undefined);

	// Only the shard holding this doll is fetched. A copy is stored rather than the cached object,
	// because `selected` is assigned onto it below and the cache is shared with every other route.
	useEffect(() => {
		let active = true;
		setDoll(undefined);
		void loadDoll(id).then((found) => {
			if (active) {
				setDoll(found ? { ...found, selected: found.normal } : undefined);
			}
		});
		return () => {
			active = false;
		};
	}, [id]);

	if (doll === undefined) {
		return (
			<main style={{ marginTop: "5rem" }}>
				<Typography component="h1" variant="h5" align="center" color="textPrimary">
					Loading T-Doll...
				</Typography>
			</main>
		);
	}

	// Keyed by id so switching dolls remounts rather than reusing stale state.
	return <TDollContent key={doll.normal.id} doll={doll} />;
}

/** Props for TDollContent. */
interface TDollContentProps {
	/** The doll to render, already loaded. */
	doll: DisplayTDoll;
}

/**
 * The doll page itself.
 *
 * @param props Component props.
 * @returns The doll's stats, skills, tiles, art and animations.
 */
function TDollContent({ doll }: TDollContentProps) {
	const tdoll = doll;

	///////////////////////////////////////////////////////////////////////////////////////////
	// Initialization of States
	///////////////////////////////////////////////////////////////////////////////////////////

	// Set initial states for the Normal/Mod modes.
	const [hasMod, setHasMod] = useState(false);
	const [mode, setMode] = useState(0); // 0 for Normal, 1 for MOD.

	// Set initial states for the images.
	const [switchImage, setSwitchImage] = useState(false); // If true, show Damaged version.
	const [tdollImage, setTDollImage] = useState<string | undefined>(undefined);
	const [showSkin, setShowSkin] = useState(false);
	const [skinSelected, setSkinSelected] = useState(0); // The value of this is dependent on how many skins a T-Doll has.

	// Set initial states for the skills. Set Skill 2 to the description of Skill 1 in case T-Doll does not have a Neural Upgrade.
	const [showModSkill, setShowModSkill] = useState(false);
	const [skillLevel, setSkillLevel] = useState(10);
	const [skillDescription1, setSkillDescription1] = useState("");
	const [skillDescription2, setSkillDescription2] = useState("");
	const [selectedSkill, setSelectedSkill] = useState(0); // 0 for Normal skill, 1 for MOD skill if it exists.

	// Set initial states for animations.
	const [animation, setAnimation] = useState<string | undefined>(undefined);
	const [animationMode, setAnimationMode] = useState(0); // 0 for Normal animations, 1 for Dorm animations.
	const [animationTabSelected, setAnimationTabSelected] = useState("wait");
	const [animationDormTabSelected, setAnimationDormTabSelected] = useState("wait");

	// Set initial miscellaneous states.
	const [open, setOpen] = useState(false);

	///////////////////////////////////////////////////////////////////////////////////////////
	// useEffect and helper functions
	///////////////////////////////////////////////////////////////////////////////////////////

	/* eslint-disable */
	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = `#${tdoll.normal.id} - ${tdoll.normal.name}`
		document.querySelector('meta[name="description"]')?.setAttribute("content", `#${tdoll.normal.id} - ${tdoll.normal.name}`);
	}, [tdoll])
	
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
		setTDollImage(tdoll.selected.assets.images.card);
		setAnimation(tdoll.selected.assets.animations.wait);

		console.log("Initial T-Doll state: ", tdoll);
		// Depends on tdoll: the shard loads after mount, so an empty dependency list would run this
		// once while the doll is still undefined and never set the initial image or animation.
	}, [tdoll]);
	/* eslint-disable */

	// This will update the animations when skins are switched.
	useEffect(() => {
		var tempSkinSelected = helperSkinSelected();
		if (showSkin) {
			if (animationMode === 0) {
				setAnimation(skinForm(tempSkinSelected)?.animations.wait);
			} else {
				setAnimation(skinForm(tempSkinSelected)?.dormAnimations.wait);
			}
		}
	}, [showSkin, skinSelected]);

	// This will update the skill descriptions when different skills are selected or their skill levels change.
	useEffect(() => {
		handleChangeSkillDescription();
	}, [skillLevel, mode, tdoll]);

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

	// Spine replaces the animation GIFs entirely. The combat and dorm rigs are separate skeletons, and
	// the dorm one often shares the combat atlas, which is why the index records the pair explicitly.
	const spineEntry = spineFor(tdoll.normal.id);

	// Skin tabs carry a doubled value, the same halving helperSkinSelected does. It is inlined because
	// that helper is declared further down and would still be in the temporal dead zone here.
	const selectedSkinRigs = showSkin ? (spineEntry?.skinRigs?.[skinSelected / 2] ?? null) : null;
	// A Mod doll is a different chibi with its own animations, so the base rig cannot stand in for it.
	const modRigs = mode === 1 ? spineEntry?.mod : undefined;
	// A skin wins over the Mod rigs, since Mod skins do not exist and the game shows the skin's own chibi
	// either way. Many skins have no rig published, so the doll's own rigs stand in rather than showing nothing.
	const rigs = selectedSkinRigs ?? modRigs ?? spineEntry;
	const spineRig = animationMode === 0 ? rigs?.combat : (rigs?.dorm ?? rigs?.combat);
	const requestedAnimation = animationMode === 0 ? animationTabSelected : animationDormTabSelected;

	// One tab per animation the skeleton defines. A fixed list, whether from the old GIF filenames or
	// the hand-maintained `has*Animation` flags, both offered tabs that did nothing when clicked and
	// hid animations the skeleton did have, such as the rifles' `snipe` pose.
	const spineTabs = animationTabs(spineRig?.anims ?? []);

	// Tabs default to "wait", which most but not all skeletons define. Falling back to the first tab
	// keeps the selection valid instead of leaving MUI with a value none of its children carry.
	const spineAnimationName = spineTabs.some((tab) => tab.value === requestedAnimation) ? requestedAnimation : (spineTabs[0]?.value ?? requestedAnimation);

	/**
	 * Look up a skin's resolved assets.
	 *
	 * Skin assets used to hang off `skins.skin_images[n]` and similar arrays that the old processData
	 * built. They now come from the manifest-derived form records, keyed `skin1`, `mod_skin1` and so on,
	 * which is also why skins that exist only as a Mod variant are reachable at all.
	 *
	 * @param index Zero-based skin number.
	 * @param withMod Whether to look up the Mod variant of the skin.
	 * @returns The skin's assets, or undefined when that skin was never published.
	 */
	const skinForm = (index: number, withMod = false) => tdoll.forms[`${withMod ? "mod_" : ""}skin${index + 1}`];

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
	const switchModes = () => {
		const tdoll_temp = tdoll;

		setShowSkin(false); // Prevent skin image to be rendered if it was selected.
		setSkinSelected(0);

		// Perform check to see if the information shown should be Mod or not.
		if (mode === 0 && hasMod && tdoll.mod) {
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
		setTDollImage(tdoll_temp.selected.assets.images.card);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		// Set animation.
		if (animationMode === 1) {
			setAnimation(tdoll_temp.selected.assets.dormAnimations.wait);
		} else {
			setAnimation(tdoll_temp.selected.assets.animations.wait);
		}

		// Finalize state updates. `tdoll_temp` is the same object as `tdoll`, mutated in place, so the
		// setSelectedSkill call below is what schedules the re-render that shows the change.
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
				setAnimation(skinForm(tempSkinSelected)?.dormAnimations.wait);
			} else {
				setAnimation(tdoll.selected.assets.dormAnimations.wait);
			}

			setAnimationMode(1);
		} else {
			// Switch to Normal animations.
			if (showSkin) {
				setAnimation(skinForm(tempSkinSelected)?.animations.wait);
			} else {
				setAnimation(tdoll.selected.assets.animations.wait);
			}

			setAnimationMode(0);
		}
	};

	// Function will render a floating button to go back to Normal art if a skin is selected. Assumes no Mod is available to T-Doll.
	const renderNormalButton = () => {
		if (showSkin) {
			return (
				<Fab color="primary" sx={styles.fab_mod} onClick={switchToNormalArt}>
					<ExitToAppIcon titleAccess="Switch back to Normal" style={{ height: 40, width: 25 }} />
				</Fab>
			);
		} else {
			return (
				<Fab color="primary" sx={styles.fab_clickThrough}>
					<></>
				</Fab>
			);
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for skill descriptions
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch between Skills 1 and 2 if T-Doll has Mod.
	const handleChangeSkills = (_event: unknown, newValue: number) => {
		setSelectedSkill(newValue);
	};

	/*
	A hack-job attempt at programmatically replacing all delimiters with the appropriate stats at the chosen skill level.
	It will also insert into the strings some <span> and <ins> tags for visual clarity.
	The npm package html-react-parser will parse the inserted span tags and properly render them into HTML tags.
	Note: The styling being inserted is using HTML styling and not using React styling.
	*/
	const handleChangeSkillDescription = () => {
		const tdollTemp = tdoll;

		// Reset the descriptions to have it include the delimiters again and set variables to be used.
		tdollTemp.selected.skill.description = tdoll.normal.skill.description;
		let tempSkillDescription1 = tdollTemp.selected.skill.description;
		const numberOfStats1 = tdollTemp.selected.skill.number_of_stats;

		const skill2 = tdollTemp.selected.skill2;
		let tempSkillDescription2 = "";
		let numberOfStats2 = 0;
		if (skill2) {
			skill2.description = tdoll.mod?.skill2?.description ?? skill2.description;
			tempSkillDescription2 = skill2.description;
			numberOfStats2 = skill2.number_of_stats;
		}

		// If T-Doll has Mod, format both Skills 1 and 2. If not, only format Skill 1.
		if (showModSkill) {
			// Format Skill 1 first.
			for (let statIndex = 1; statIndex <= numberOfStats1; statIndex++) {
				const values = tdollTemp.selected.skill[`stat${statIndex}`] ?? [];
				tempSkillDescription1 = tempSkillDescription1.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			// Format Skill 2 next.
			for (let statIndex = 1; statIndex <= numberOfStats2; statIndex++) {
				const values = skill2?.[`stat${statIndex}`] ?? [];
				tempSkillDescription2 = tempSkillDescription2.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			if ("passive_active_description" in tdollTemp.selected.skill) {
				tempSkillDescription1 = tempSkillDescription1.replace("[Passive]:", '<span style="color: orange; font-size: 110%;"><ins>[Passive]</ins></span>: ');
				tempSkillDescription1 = tempSkillDescription1.replace("[Active]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Active]</ins></span>: ');
			}

			if (skill2 && "passive_active_description" in skill2) {
				tempSkillDescription2 = tempSkillDescription2.replace("[Passive]: ", '<span style="color: orange; font-size: 110%;"><ins>[Passive]</ins></span>: ');
				tempSkillDescription2 = tempSkillDescription2.replace("[Active]: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Active]</ins></span>: ');
			}

			if (skill2 && "passive_passive_description" in skill2) {
				tempSkillDescription2 = tempSkillDescription2.replace("[Passive 1]: ", '<span style="color: orange; font-size: 110%;"><ins>[Passive 1]</ins></span>: ');
				tempSkillDescription2 = tempSkillDescription2.replace("[Passive 2]: ", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Passive 2]</ins></span>: ');
			}

			setSkillDescription1(tempSkillDescription1);
			setSkillDescription2(tempSkillDescription2);
		} else {
			// Only format Skill 1.
			for (let statIndex = 1; statIndex <= numberOfStats1; statIndex++) {
				const values = tdollTemp.selected.skill[`stat${statIndex}`] ?? [];
				tempSkillDescription1 = tempSkillDescription1.replace(`#${statIndex}`, '<span style="color: cyan; font-size: 110%;"><ins>' + (values[skillLevel - 1] ?? "") + "</ins></span>");
			}

			if ("passive_active_description" in tdollTemp.selected.skill) {
				tempSkillDescription1 = tempSkillDescription1.replace("[Passive]:", '<span style="color: orange; font-size: 110%;"><ins>[Passive]</ins></span>: ');
				tempSkillDescription1 = tempSkillDescription1.replace("[Active]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Active]</ins></span>: ');
			}

			// Insert HTML <br /> tags whenever there is an occurrence of \n inside string.abs
			tempSkillDescription1 = tempSkillDescription1.replaceAll("\n", "<br />");

			// Deal with Jill's special skill description menu.
			if (tdoll.selected.id === 1017) {
				tempSkillDescription1 = tempSkillDescription1.replaceAll("■Adelhyde", '<span style="color: #db3d3d;">■Adelhyde</span>');
				tempSkillDescription1 = tempSkillDescription1.replaceAll("■Flanergide", '<span style="color: #70ad47;">■Flanergide</span>');
				tempSkillDescription1 = tempSkillDescription1.replaceAll("■Karmotrine", '<span style="color: #91c1f0;">■Karmotrine</span>');
				tempSkillDescription1 = tempSkillDescription1.replaceAll("■Bronson Ext", '<span style="color: #ffb400;">■Bronson Ext</span>');
				tempSkillDescription1 = tempSkillDescription1.replaceAll("■Pwd Delta", '<span style="color: #3a94e8;">■Pwd Delta</span>');
				tempSkillDescription1 = tempSkillDescription1.replaceAll("❈❈❈", '<span style="color: #db3d3d;">❈❈❈</span>');

				tempSkillDescription1 = tempSkillDescription1.replace("Big Beer", '<span style="font-size: 120%;"><ins>Big Beer</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Brandtini", '<span style="font-size: 120%;"><ins>Brandtini</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Piano Woman", '<span style="font-size: 120%;"><ins>Piano Woman</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Moonblast", '<span style="font-size: 120%;"><ins>Moonblast</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Bleeding Jane", '<span style="font-size: 120%;"><ins>Bleeding Jane</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Fringe Weaver", '<span style="font-size: 120%;"><ins>Fringe Weaver</ins></span>');
				tempSkillDescription1 = tempSkillDescription1.replace("Sugar Rush", '<span style="font-size: 120%;"><ins>Sugar Rush</ins></span>');
			}

			// Deal with the other T-Dolls from the Valhalla colloboration event.
			if (tdoll.selected.id >= 1018 && tdoll.selected.id <= 1022) {
				if (tdoll.selected.id === 1018) {
					tempSkillDescription1 = tempSkillDescription1.replaceAll("Moonblast", '<span style="font-size: 110%;"><ins>Moonblast</ins></span>');
				} else if (tdoll.selected.id === 1019) {
					tempSkillDescription1 = tempSkillDescription1.replace("[MIRD-113]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[MIRD-113]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("[Nano-Camo]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Nano-Camo]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("Piano Woman", '<span style="font-size: 110%;"><ins>Piano Woman</ins></span>');
				} else if (tdoll.selected.id === 1020) {
					tempSkillDescription1 = tempSkillDescription1.replace("Bleeding Jane", '<span style="font-size: 110%;"><ins>Bleeding Jane</ins></span>');
				} else if (tdoll.selected.id === 1021) {
					tempSkillDescription1 = tempSkillDescription1.replace("Brandtini", '<span style="font-size: 110%;"><ins>Brandtini</ins></span>');
				} else {
					tempSkillDescription1 = tempSkillDescription1.replace("[Normal Attack]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Normal Attack]</ins></span>: ');
					tempSkillDescription1 = tempSkillDescription1.replace("Big Beer", '<span style="font-size: 110%;"><ins>Big Beer</ins></span>');
				}

				tempSkillDescription1 = tempSkillDescription1.replace("[Favorite Drink]:", '<span style="color: orange; font-size: 110%;"><ins><br /><br />[Favorite Drink]</ins></span>: ');
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
			const skin = helperSkinSelected();
			if (switchImage) {
				// Normal Skin image
				setTDollImage(skinForm(skin, mode === 1)?.images.card);
				setSwitchImage(false);
			} else {
				// Damaged Skin image
				setTDollImage(skinForm(skin, mode === 1)?.images.card_damaged);
				setSwitchImage(true);
			}
		} else {
			if (switchImage) {
				// Normal image
				setTDollImage(tdoll.selected.assets.images.card);
				setSwitchImage(false);
			} else {
				// Damaged image
				setTDollImage(tdoll.selected.assets.images.card_damaged);
				setSwitchImage(true);
			}
		}
	};

	// Replace Card image with the Normal version of the selected skin.
	const switchSkinSelected = (_event: unknown, newValue: number) => {
		setSkinSelected(newValue);
		setShowSkin(true);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		// newValue is the doubled tab value, so it has to be halved the same way helperSkinSelected does.
		setTDollImage(skinForm(newValue / 2, mode === 1)?.images.card);

		// Switch animations based on the animation mode selected, Normal or Dorm.
		var tempSkinSelected = helperSkinSelected();

		if (animationMode === 0) {
			setAnimation(skinForm(tempSkinSelected)?.animations.wait);
		} else {
			setAnimation(skinForm(tempSkinSelected)?.dormAnimations.wait);
		}

		// Reset animation tab selected.
		helperResetAnimationTabs();
	};

	// Show full images for the Backdrop component depending on whether it is the skin or Normal/Mod selected.
	const renderImage = () => {
		if (showSkin) {
			const skin = skinForm(helperSkinSelected(), mode === 1);
			if (switchImage) {
				return <Box component="img" src={skin?.images.full_damaged} sx={styles.fullImage} alt="Damaged Full Skin" />;
			} else {
				return <Box component="img" src={skin?.images.full} sx={styles.fullImage} alt="Normal Full Skin" />;
			}
		} else {
			if (switchImage) {
				return <Box component="img" src={tdoll.selected.assets.images.full_damaged} sx={styles.fullImage} alt="Damaged Full" />;
			} else {
				return <Box component="img" src={tdoll.selected.assets.images.full} sx={styles.fullImage} alt="Normal Full" />;
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
		if (animationMode === 0) {
			if (showSkin) {
				// Skin animations for Combat.
				return (
                    <Tabs
                        sx={styles.tabs}
                        value={spineAnimationName}
                        onChange={(_e, value) => switchAnimations(value)}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollButtons
                        variant="scrollable"
                        allowScrollButtonsMobile>
                        {spineTabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
                    </Tabs>
                );
			} else {
				// Normal Animations for Combat.
				return (
                    <Tabs
                        sx={styles.tabs}
                        value={spineAnimationName}
                        onChange={(_e, value) => switchAnimations(value)}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollButtons
                        variant="scrollable"
                        allowScrollButtonsMobile>
                        {spineTabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
                    </Tabs>
                );
			}
		} else {
			// Animations for Dorm.
			return (
                <Tabs
                    sx={styles.tabs}
                    value={spineAnimationName}
                    onChange={(_e, value) => switchAnimations(value)}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons
                    variant="scrollable"
                    allowScrollButtonsMobile>
                    {spineTabs.map((tab) => (
						<Tab key={tab.value} label={tab.label} value={tab.value} />
					))}
                </Tabs>
            );
		}
	};

	// Render tabs for skin selection.
	const renderSkinsTabs = () => {
		const tempTabs: JSX.Element[] = [];

		if (tdoll.skins === null) {
			return tempTabs;
		}

		(tdoll.skins?.skin_names ?? []).map((name, index) => {
			// Index is doubled for the value such that the Damaged versions are not selected.
			return tempTabs.push(<Tab sx={styles.tabForSkin} label={name} key={index} wrapped value={index * 2} />);
		});

		return tempTabs;
	};

	// Switch animations based on Tab selected.
	const switchAnimations = (newValue: string) => {
		var tempSkinSelected = helperSkinSelected();

		if (animationMode === 0) {
			setAnimationTabSelected(newValue);

			// This switch block is for Normal/Mod Animations.
			switch (newValue) {
				case "wait":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.wait);
					} else {
						setAnimation(tdoll.selected.assets.animations.wait);
					}
					break;
				case "wait2":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.wait2);
					} else {
						setAnimation(tdoll.selected.assets.animations.wait2);
					}
					break;
				case "move":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.move);
					} else {
						setAnimation(tdoll.selected.assets.animations.move);
					}
					break;
				case "attack":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.attack);
					} else {
						setAnimation(tdoll.selected.assets.animations.attack);
					}
					break;
				case "crouch":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.crouch);
					} else {
						setAnimation(tdoll.selected.assets.animations.crouch);
					}
					break;
				case "attack2":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.attack2);
					} else {
						setAnimation(tdoll.selected.assets.animations.attack2);
					}
					break;
				case "action":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.action);
					} else {
						setAnimation(tdoll.selected.assets.animations.action);
					}
					break;
				case "action2":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.action2);
					} else {
						setAnimation(tdoll.selected.assets.animations.action2);
					}
					break;
				case "spattack":
					setAnimation(tdoll.selected.assets.animations.spattack);

					break;
				case "spattack2":
					setAnimation(tdoll.selected.assets.animations.spattack2);

					break;
				case "reload":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.reload);
					} else {
						setAnimation(tdoll.selected.assets.animations.reload);
					}
					break;
				case "landing":
					setAnimation(tdoll.selected.assets.animations.landing);

					break;
				case "die":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.die);
					} else {
						setAnimation(tdoll.selected.assets.animations.die);
					}
					break;
				case "skill":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.skill);
					} else {
						setAnimation(tdoll.selected.assets.animations.skill);
					}
					break;
				case "skill2":
					setAnimation(tdoll.selected.assets.animations.skill2);

					break;
				case "victory":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.victory);
					} else {
						setAnimation(tdoll.selected.assets.animations.victory);
					}
					break;
				case "victory2":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.victory2);
					} else {
						setAnimation(tdoll.selected.assets.animations.victory2);
					}
					break;
				case "victoryloop":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.animations.victoryloop);
					} else {
						setAnimation(tdoll.selected.assets.animations.victoryloop);
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
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.wait);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.wait);
					}

					break;
				case "move":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.move);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.move);
					}
					break;
				case "action":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.action);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.action);
					}
					break;
				case "pick":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.pick);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.pick);
					}
					break;
				case "sit":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.sit);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.sit);
					}
					break;
				case "sit2":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.sit2);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.sit2);
					}
					break;
				case "lying":
					if (showSkin) {
						setAnimation(skinForm(tempSkinSelected)?.dormAnimations.lying);
					} else {
						setAnimation(tdoll.selected.assets.dormAnimations.lying);
					}
					break;
				default:
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tileset functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch the animation playing to the next one when you click on the GIF Player. This also influences the movement trhough the animation Tabs as well. 
	// If you encounter the bug that moving forward suddenly skips a few tabs, chances are that animationArray is missing some of your newly added animations.
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
				(showSkin && ("wait2" in (skinForm(tempSkinSelected)?.animations ?? {})))
			) {
				animationArray.push("wait2");
			}
			animationArray.push("move");
			animationArray.push("attack");
			if ((!showSkin && tdoll.selected.animations.hasSkillAnimation) || (showSkin && ("skill" in (skinForm(tempSkinSelected)?.animations ?? {})))) {
				animationArray.push("skill");
			}
			if (!showSkin && "skill2" in tdoll.selected.animations) {
				animationArray.push("skill2");
			}
			if ((!showSkin && "crouch" in tdoll.selected.animations) || (showSkin && skinForm(tempSkinSelected)?.animations.crouch)) {
				animationArray.push("crouch");
			}
			if ((!showSkin && "hasAttack2Animation" in tdoll.selected.animations) || (showSkin && ("attack2" in (skinForm(tempSkinSelected)?.animations ?? {})))) {
				animationArray.push("attack2");
			}
			if ((!showSkin && "action" in tdoll.selected.animations) || (showSkin && skinForm(tempSkinSelected)?.animations.action)) {
				animationArray.push("action");
			}
			if ((!showSkin && "action2" in tdoll.selected.animations) || (showSkin && skinForm(tempSkinSelected)?.animations.action2)) {
				animationArray.push("action2");
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
			if (tdoll.selected.type === "MG" || tdoll.selected.type === "SG") {
				animationArray.push("reload");
			}
			animationArray.push("die");
			animationArray.push("victory");
			if ("victory2" in tdoll.selected.animations && !showSkin) {
				animationArray.push("victory2");
			}
			if ((!showSkin && tdoll.selected.animations.hasVictoryLoopAnimation) || (showSkin && ("victoryloop" in (skinForm(tempSkinSelected)?.animations ?? {})))) {
				animationArray.push("victoryloop");
			}
		} else {
			// For Dorm Animations
			currentAnimation = animationDormTabSelected;

			animationArray.push("wait");
			animationArray.push("move");
			if ((tdoll.skins && showSkin && ("action" in (skinForm(tempSkinSelected)?.dormAnimations ?? {}))) || "hasActionAnimation" in tdoll.selected.animations) {
				animationArray.push("action");
			}
			animationArray.push("pick");
			animationArray.push("sit");
			if (tdoll.skins && showSkin && ("sit2" in (skinForm(tempSkinSelected)?.dormAnimations ?? {}))) {
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

		switchAnimations(animationArray[tempIndex] ?? "wait");
	};

	// This function will return tiles depending on the tile set information in the JSON.
	const createTileSetRow = (tile: number, index: number) => {
		let temp: JSX.Element;
		if (tile === 0) {
			temp = <Box component="td" sx={styles.blackTile} key={index}></Box>;
		} else if (tile === 1) {
			temp = <Box component="td" sx={styles.cyanTile} key={index}></Box>;
		} else {
			temp = <Box component="td" sx={styles.whiteTile} key={index}></Box>;
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
	const renderStars = (rarity: number) => {
		const array: number[] = [];

		// Populate the array with the keys to the length of the rarity.
		for (var i = 0; i < rarity; i++) {
			array.push(i);
		}

		const stars = array.map((i) => {
			return (
				<Box component="li" sx={styles.rarityStar} key={i}>
					<StarIcon style={{ color: "yellow" }} />
					{/* <img src={rarity_star} alt="rarity star" /> */}
				</Box>
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
            <Container sx={styles.cardGrid} maxWidth="md">
				<br />

				<Card sx={styles.card}>
					<CardContent>
						{/************** T-Doll's Name, Rarity in stars, type, and Index Number **************/}
						<Typography sx={styles.rarityStars} color="textSecondary" gutterBottom>
							{tdoll.selected.type}
							{renderStars(tdoll.selected.rarity)}
						</Typography>
						<Typography variant="h3" component="h2">
							{tdoll.selected.name}
							<Typography component="span" sx={{ display: "inline" }} color="textSecondary">
								{" "}
								#{tdoll.selected.id}
							</Typography>
						</Typography>

						{/************** T-Doll image and skin images (Card/Full) **************/}
						<Grid container direction="row" spacing={2}>
							<Grid key="T-Doll image" size={{ xs: 12, sm: 6 }}>
								{tdoll.skins !== null ? (
									(tdoll.skins?.number_of_skins ?? 0) === 1 ? (
										<Tabs
                                            sx={styles.tabs}
                                            value={showSkin ? skinSelected : false}
                                            onChange={switchSkinSelected}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="fullWidth"
                                            scrollButtons
                                            allowScrollButtonsMobile>
											{renderSkinsTabs()}
										</Tabs>
									) : (
										<Tabs
                                            sx={styles.tabs}
                                            value={showSkin ? skinSelected : false}
                                            onChange={switchSkinSelected}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="scrollable"
                                            scrollButtons
                                            allowScrollButtonsMobile>
											{renderSkinsTabs()}
										</Tabs>
									)
								) : (
									<Tabs sx={styles.tabs} value={false} indicatorColor="primary" textColor="primary" variant="fullWidth" scrollButtons="auto" centered>
										<Tab label="No skins" />
									</Tabs>
								)}

								<Card sx={styles.cardForImage} elevation={12}>
									<CardActionArea onClick={switchBetweenNormalDamagedCardImages}>
										<CardMedia component="img" sx={styles.cardForImage} image={tdollImage} title={tdoll.selected.name} />
									</CardActionArea>
									{/************** Floating Action Button overlayed over image at the top left **************/}
									{hasMod ? (
										<Fab color="primary" sx={styles.fab_mod} onClick={switchModes}>
											<img src={mod_button} alt="Switch between Normal/Mod" style={{ height: 32, width: 32 }} />
										</Fab>
									) : (
										renderNormalButton()
									)}

									{/************** Floating Action Button overlayed over image at the bottom left **************/}
									<Fab color="primary" sx={styles.fabExpand} onClick={handleToggle}>
										<ZoomOutMapIcon />
									</Fab>

									{/************** Display full size images based on boolean **************/}
									<Backdrop sx={styles.backdrop} open={open} onClick={handleClose}>
										{renderImage()}
									</Backdrop>
								</Card>

								{/************** T-Doll's animations **************/}
								<Fab color="primary" sx={styles.fab_dorm} onClick={switchAnimationMode}>
									{animationMode === 0 ? (
										<img src={combat_button} alt="Switch to Dorm Animations" style={{ height: 32, width: 32, paddingTop: 3 }} />
									) : (
										<img src={dorm_button} alt="Switch to Normal Animations" style={{ height: 29, width: 29, paddingTop: 3 }} />
									)}
								</Fab>

								{renderAnimationTabs()}

								{animationMode === 0 ? (
									<Card sx={styles.cardForCombatAnimations} elevation={12}>
										{spineRig ? (
											<div onClick={() => playerSwitchAnimations()} style={{ cursor: "pointer" }}>
												<SpineAnimation
													skelUrl={spineUrl(tdoll.normal.id, spineRig.skel, "skel")}
													atlasUrl={spineUrl(tdoll.normal.id, spineRig.atlas, "atlas")}
													imageBase={spineImageBase(tdoll.normal.id, spineRig.atlas)}
													animation={spineAnimationName}
												/>
											</div>
										) : (
											<img src={animation} alt="T-Doll animation" style={{ height: 250, width: 250, zIndex: 0 }} onClick={() => playerSwitchAnimations()} />
										)}
									</Card>
								) : (
									<Card sx={styles.cardForDormAnimations} elevation={12}>
										{spineRig ? (
											<div onClick={() => playerSwitchAnimations()} style={{ cursor: "pointer" }}>
												<SpineAnimation
													skelUrl={spineUrl(tdoll.normal.id, spineRig.skel, "skel")}
													atlasUrl={spineUrl(tdoll.normal.id, spineRig.atlas, "atlas")}
													imageBase={spineImageBase(tdoll.normal.id, spineRig.atlas)}
													animation={spineAnimationName}
												/>
											</div>
										) : (
											<img src={animation} alt="T-Doll animation" style={{ height: 250, width: 250, zIndex: 0 }} onClick={() => playerSwitchAnimations()} />
										)}
									</Card>
								)}
							</Grid>

							<Grid key="T-Doll stat table and skill card" size={{ xs: 12, sm: 6 }}>
								{/************** T-Doll's skill information **************/}
								{showModSkill ? (
									<Tabs sx={styles.tabsForSkills} value={selectedSkill} onChange={handleChangeSkills} indicatorColor="primary" textColor="primary" scrollButtons="auto" centered>
										<Tab label="Skill 1" />
										<Tab label="Skill 2" />
									</Tabs>
								) : (
									<Tabs sx={styles.tabsForSkills} value={0} indicatorColor="primary" textColor="primary" centered>
										<Tab label="Skill 1" />
									</Tabs>
								)}

								<Card sx={styles.cardForSkill} elevation={12}>
									<CardContent>
										<CardHeader
											avatar={<Avatar variant="rounded" src={selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? tdoll.skillImages.skill2 : tdoll.skillImages.skill1} />}
											title={selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? tdoll.selected.skill2.name : tdoll.selected.skill.name}
											subheader={
												selectedSkill === 1 && tdoll.selected.skill2 !== undefined ? "Initial CD: " + tdoll.selected.skill2.initial_cooldown : "Initial CD: " + tdoll.selected.skill.initial_cooldown
											}
											action={
												<FormControl>
													<InputLabel id="skill-level-select-label">Level</InputLabel>

													<Select
														id="skill-level-select"
														value={skillLevel}
														onChange={(e) => {
															setSkillLevel(Number(e.target.value));
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
															}
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
										<Typography sx={styles.title} color="textSecondary" gutterBottom>
											{selectedSkill === 1 && showModSkill ? parse(skillDescription2) : parse(skillDescription1)}
										</Typography>
										{selectedSkill === 0 && tdoll.selected.skill.initial_cooldown !== "Passive" ? (
											<>
												<Divider />
												<Typography sx={styles.cooldownText} color="textSecondary">
													Cooldown:{" "}
													{
														<span style={{ color: "cyan" }}>
															<ins>{(tdoll.selected.skill.cooldown?.[skillLevel - 1] ?? "?")}s</ins>
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
								<Card sx={styles.cardForTileSet} elevation={12}>
									<Box component="div" sx={styles.tileSetDiv}>
										<CardContent sx={styles.content}>
											<Box component="table" sx={styles.tableTileSet} id="tdoll-tileset">
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
											</Box>
										</CardContent>

										<CardContent sx={styles.tileSetInformation}>
											<Typography sx={styles.title} color="textPrimary" gutterBottom>
												{tdoll.selected.tile_set.targets}
											</Typography>
											<Typography color="textSecondary">{parse(renderTileSetInformation())}</Typography>
										</CardContent>
									</Box>
								</Card>

								<br />

								{/************** T-Doll's stats in table format **************/}
								<TableContainer sx={styles.tableContainer} component={Paper} elevation={12}>
									<Table sx={styles.table} size="small">
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
