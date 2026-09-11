import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import ChibiPanel from "./ChibiPanel";
import DollHero from "./DollHero";
import OverviewPanel from "./OverviewPanel";
import SkillsPanel from "./SkillsPanel";
import TilesPanel from "./TilesPanel";

// MaterialUI imports
import {
	Box,
	Container,
	Typography,
	Card,
	CardContent,
	Tab,
	Tabs
	//Grow
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { loadDoll, spineFor } from "../../lib/data";
import { animationTabs } from "../../lib/spine";
import type { TDoll as TDollData, TDollForm } from "../../types/tdoll";

/** A doll paired with the form currently being displayed. */
interface DisplayTDoll extends TDollData {
	/** The form on screen: the base form, the Mod, or a skin. */
	selected: TDollForm;
}

/** Which of the doll page's four sections is currently shown. */
type SectionTab = "overview" | "skills" | "tiles" | "chibi";

const styles = {
	cardGrid: {
		pt: 3,
		pb: 8
	},
	card: {
		height: "100%",
		width: "100%"
	},
	sectionTabs: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.background.paper,
		mb: 2
	}),
	// Overview and Chibi are image-centric, so they stay in a compact column even though the page
	// itself is wide. Skills and Tiles are text and table heavy, so they get a wider reading column.
	// Kept under SpineAnimation's 420px default stage cap so the chibi's size reflects this column
	// rather than the clamp, which would report the same width whether this layout was right or not.
	mediaColumn: {
		maxWidth: 400,
		mx: "auto"
	},
	textColumn: {
		maxWidth: 700,
		mx: "auto"
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
			<Box component="main" sx={{ py: 3 }}>
				<Typography component="h1" variant="h5" align="center" color="textPrimary">
					Loading T-Doll...
				</Typography>
			</Box>
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

	// Which of the four section tabs (Overview/Skills/Tiles/Chibi) is currently shown.
	const [sectionTab, setSectionTab] = useState<SectionTab>("overview");

	// Set initial states for the Normal/Mod modes.
	const [hasMod, setHasMod] = useState(false);
	const [mode, setMode] = useState(0); // 0 for Normal, 1 for MOD.

	// Set initial states for the images.
	const [switchImage, setSwitchImage] = useState(false); // If true, show Damaged version.
	const [tdollImage, setTDollImage] = useState<string | undefined>(undefined);
	const [showSkin, setShowSkin] = useState(false);
	const [skinSelected, setSkinSelected] = useState(0); // The value of this is dependent on how many skins a T-Doll has.

	// Whether the doll's Mod is currently the form on screen, which SkillsPanel uses to show Skill 2.
	const [showModSkill, setShowModSkill] = useState(false);

	// Set initial states for animations.
	const [animation, setAnimation] = useState<string | undefined>(undefined);
	const [animationMode, setAnimationMode] = useState(0); // 0 for Normal animations, 1 for Dorm animations.
	const [animationTabSelected, setAnimationTabSelected] = useState("wait");
	const [animationDormTabSelected, setAnimationDormTabSelected] = useState("wait");

	///////////////////////////////////////////////////////////////////////////////////////////
	// useEffect and helper functions
	///////////////////////////////////////////////////////////////////////////////////////////

	/* eslint-disable */
	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = `#${tdoll.normal.id} - ${tdoll.normal.name}`;
		document.querySelector('meta[name="description"]')?.setAttribute("content", `#${tdoll.normal.id} - ${tdoll.normal.name}`);
	}, [tdoll]);

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

	// Whether the form currently on screen is the Mod. Drives both the rarity star colour and the
	// hero's Mod toggle, which stay in lockstep since they describe the same underlying state.
	const isModForm = tdoll.selected === tdoll.mod;

	// The hero's full art follows the same selection as the card portrait: the current skin when one is
	// shown, otherwise the Normal/Mod form. mod_skin* forms only ever publish card art, so the base
	// Normal form's full art stands in whenever the selected form has none of its own.
	const heroArtUrl = (showSkin ? skinForm(helperSkinSelected(), mode === 1)?.images.full : tdoll.selected.assets.images.full) ?? tdoll.normal.assets.images.full;

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
		// setMode/setShowModSkill calls above are what schedule the re-render that shows the change.
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

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Card images
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

	// Switch back to base art for the current mode, undoing a skin selection. Leaves Normal/Mod alone,
	// since the Mod toggle already owns that axis; this only clears the skin one, the inverse of switchSkinSelected below.
	const switchToBaseArt = () => {
		setShowSkin(false);
		setSkinSelected(0);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		setTDollImage(tdoll.selected.assets.images.card);

		if (animationMode === 0) {
			setAnimation(tdoll.selected.assets.animations.wait);
		} else {
			setAnimation(tdoll.selected.assets.dormAnimations.wait);
		}

		helperResetAnimationTabs();
	};

	// Replace Card image with the Normal version of the selected skin, or the Base pill's false to go back.
	const switchSkinSelected = (_event: unknown, newValue: number | false) => {
		if (newValue === false) {
			switchToBaseArt();
			return;
		}

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

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tab functionality
	///////////////////////////////////////////////////////////////////////////////////////////

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
			if ((!showSkin && "hasWait2Animation" in tdoll.selected.animations) || (showSkin && "wait2" in (skinForm(tempSkinSelected)?.animations ?? {}))) {
				animationArray.push("wait2");
			}
			animationArray.push("move");
			animationArray.push("attack");
			if ((!showSkin && tdoll.selected.animations.hasSkillAnimation) || (showSkin && "skill" in (skinForm(tempSkinSelected)?.animations ?? {}))) {
				animationArray.push("skill");
			}
			if (!showSkin && "skill2" in tdoll.selected.animations) {
				animationArray.push("skill2");
			}
			if ((!showSkin && "crouch" in tdoll.selected.animations) || (showSkin && skinForm(tempSkinSelected)?.animations.crouch)) {
				animationArray.push("crouch");
			}
			if ((!showSkin && "hasAttack2Animation" in tdoll.selected.animations) || (showSkin && "attack2" in (skinForm(tempSkinSelected)?.animations ?? {}))) {
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
			if ((!showSkin && tdoll.selected.animations.hasVictoryLoopAnimation) || (showSkin && "victoryloop" in (skinForm(tempSkinSelected)?.animations ?? {}))) {
				animationArray.push("victoryloop");
			}
		} else {
			// For Dorm Animations
			currentAnimation = animationDormTabSelected;

			animationArray.push("wait");
			animationArray.push("move");
			if ((tdoll.skins && showSkin && "action" in (skinForm(tempSkinSelected)?.dormAnimations ?? {})) || "hasActionAnimation" in tdoll.selected.animations) {
				animationArray.push("action");
			}
			animationArray.push("pick");
			animationArray.push("sit");
			if (tdoll.skins && showSkin && "sit2" in (skinForm(tempSkinSelected)?.dormAnimations ?? {})) {
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

	return (
		<main>
			<ScrollToTop />
			{/* <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={1000}> */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<br />

				<Card sx={styles.card}>
					<CardContent>
						{/************** T-Doll's hero: full art, name, rarity, type, skin pills and Mod toggle **************/}
						<DollHero
							name={tdoll.selected.name}
							id={tdoll.selected.id}
							type={tdoll.selected.type}
							rarity={tdoll.selected.rarity}
							isMod={isModForm}
							artUrl={heroArtUrl}
							skins={tdoll.skins}
							skinValue={showSkin ? skinSelected : false}
							onSkinChange={switchSkinSelected}
							hasMod={hasMod}
							modOn={isModForm}
							onToggleMod={switchModes}
						/>

						{/************** Section tabs: only the active panel mounts, so the chibi never sizes itself against a hidden ancestor **************/}
						<Tabs
							sx={styles.sectionTabs}
							value={sectionTab}
							onChange={(_e, value: SectionTab) => setSectionTab(value)}
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							scrollButtons
							allowScrollButtonsMobile
						>
							<Tab label="Overview" value="overview" />
							<Tab label="Skills" value="skills" />
							<Tab label="Tiles" value="tiles" />
							<Tab label="Chibi" value="chibi" />
						</Tabs>

						{sectionTab === "overview" && (
							<Box sx={styles.mediaColumn}>
								<OverviewPanel
									tdollImage={tdollImage}
									onCardImageClick={switchBetweenNormalDamagedCardImages}
									dollName={tdoll.selected.name}
									normalId={tdoll.normal.id}
									stats={tdoll.selected}
								/>
							</Box>
						)}

						{sectionTab === "skills" && (
							<Box sx={styles.textColumn}>
								<SkillsPanel
									showModSkill={showModSkill}
									skill={tdoll.selected.skill}
									skill2={tdoll.selected.skill2}
									normalSkillDescription={tdoll.normal.skill.description}
									modSkill2Description={tdoll.mod?.skill2?.description}
									dollId={tdoll.selected.id}
									skillImages={tdoll.skillImages}
								/>
							</Box>
						)}

						{sectionTab === "tiles" && (
							<Box sx={styles.textColumn}>
								<TilesPanel tileSet={tdoll.selected.tile_set} />
							</Box>
						)}

						{sectionTab === "chibi" && (
							<Box sx={styles.mediaColumn}>
								<ChibiPanel
									animationMode={animationMode}
									spineAnimationName={spineAnimationName}
									spineTabs={spineTabs}
									onSwitchAnimations={switchAnimations}
									onSwitchAnimationMode={switchAnimationMode}
									spineRig={spineRig}
									normalId={tdoll.normal.id}
									animation={animation}
									onPlayerSwitchAnimations={playerSwitchAnimations}
								/>
							</Box>
						)}
					</CardContent>
				</Card>
			</Container>
			{/* </Grow> */}
		</main>
	);
}
