import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import ChibiPanel from "./ChibiPanel";
import DollHero from "./DollHero";
import LazySection from "./LazySection";
import PageBackdrop from "./PageBackdrop";
import SkillsPanel from "./SkillsPanel";
import StatsPanel from "./StatsPanel";
import TilesPanel from "./TilesPanel";

// MaterialUI imports
import { Box, Container, Grid, Paper, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { loadDoll, spineFor } from "../../lib/data";
import { animationTabs } from "../../lib/spine";
import type { TDoll as TDollData, TDollForm } from "../../types/tdoll";

/** A doll paired with the form currently being displayed. */
interface DisplayTDoll extends TDollData {
	/** The form on screen: the base form, the Mod, or a skin. */
	selected: TDollForm;
}

const styles = {
	page: {
		pt: 2,
		pb: 3,
		// Wider than the xl breakpoint so a 1920 screen actually gets four usable columns, but still capped
		// so the sections do not stretch into a letterbox on an ultrawide.
		maxWidth: 1800,
		mx: "auto",
		// Lifts the content above the fixed backdrop, which would otherwise paint over it.
		position: "relative",
		zIndex: 1
	},
	// Translucent so the backdrop reads through the sections too, with a light blur behind the panel to keep
	// the text legible over the busier parts of the art.
	section: (theme: Theme) => ({
		p: { xs: 2, md: 2.5 },
		backgroundColor: alpha(theme.palette.background.paper, 0.7),
		backdropFilter: "blur(6px)"
	}),
	// The two sections under the hero share a row on a wide screen, so they fill it to the taller one.
	// Narrower screens keep natural heights, where equalising would pair a card with the taller Animations one.
	rowSection: {
		height: { lg: "100%" },
		// The panel inside grows with the card too, or it keeps a short inner box with empty space under it.
		display: { lg: "flex" },
		flexDirection: "column",
		"& > :last-child": { flexGrow: 1 }
	},
	sectionHeading: {
		mb: 1.5
	},
	// Skill and tile buffs side by side inside the Abilities card on a wide screen, stacked on a narrow one.
	abilities: {
		display: "flex",
		flexDirection: { xs: "column", lg: "row" },
		gap: 2
	},
	// Each half stretches to the card's height, and its panel fills the half, so the two inner boxes end level.
	// Tile buffs is a fixed 300px on a wide screen, about what its grid and one line of text need, and the
	// skill takes the rest, since its description is what wraps and makes the whole row taller.
	abilityPart: {
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		"& > :last-child": { flexGrow: 1 }
	},
	abilityHeading: {
		mb: 1,
		fontWeight: 600
	},
	// The Spine stage tracks its container, so this is what actually decides how large the chibi draws.
	chibiColumn: {
		maxWidth: { xs: 480, lg: 340 },
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

	// Owned here rather than in SkillsPanel so the whole page's selection state sits in one place,
	// alongside the Mod and skin state the hero drives.
	const [skillLevel, setSkillLevel] = useState(10);
	const [selectedSkill, setSelectedSkill] = useState(0); // 0 for Skill 1, 1 for Skill 2 if the doll has a Mod.

	// Set initial states for animations.
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

		// Set the initial image to be displayed for the T-Doll.
		setTDollImage(tdoll.selected.assets.images.card);

		// Depends on tdoll: the shard loads after mount, so an empty dependency list would run this
		// once while the doll is still undefined and never set the initial image.
	}, [tdoll]);
	/* eslint-disable */

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

		// Reset back to Skill 1 whenever the Mod toggle flips, in either direction.
		setSelectedSkill(0);
		helperResetAnimationTabs();
	};

	// Switch the animations between Normal and Dorm.
	const switchAnimationMode = () => {
		helperResetAnimationTabs();
		setAnimationMode(animationMode === 0 ? 1 : 0);
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
	// since the Mod toggle already owns that axis. This only clears the skin one, the inverse of switchSkinSelected below.
	const switchToBaseArt = () => {
		setShowSkin(false);
		setSkinSelected(0);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		setTDollImage(tdoll.selected.assets.images.card);

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

		// Reset animation tab selected.
		helperResetAnimationTabs();
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tab functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Record which tab is selected for the current animation mode. This alone drives spineAnimationName
	// above, since every doll resolves a Spine rig and the GIF-era per-animation lookups it used to also
	// perform here never ran for anyone.
	const switchAnimations = (newValue: string) => {
		if (animationMode === 0) {
			setAnimationTabSelected(newValue);
		} else {
			setAnimationDormTabSelected(newValue);
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tileset functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch the animation playing to the next one when the chibi is clicked. Walks the same spineTabs
	// list the pills render, so clicking the stage and clicking a pill always agree on what comes next.
	const playerSwitchAnimations = () => {
		const currentIndex = spineTabs.findIndex((tab) => tab.value === spineAnimationName);
		const nextIndex = currentIndex === -1 || currentIndex + 1 >= spineTabs.length ? 0 : currentIndex + 1;
		const next = spineTabs[nextIndex];
		if (next) {
			switchAnimations(next.value);
		}
	};

	return (
		<main>
			<PageBackdrop artUrl={heroArtUrl} />
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				{/************** Every section on the page at once. On a wide screen the animations share the hero's row
				                and the rest sit three across below it, so the whole page fits one 1920x1080 screen. On a
				                phone everything stacks, with the animations last since they are the heaviest to load. **************/}
				<Grid container spacing={2}>
					{/************** T-Doll's hero: portrait, name, rarity, type, skin pills and Mod toggle **************/}
					<Grid size={{ xs: 12, lg: 8, xl: 9 }} sx={{ order: 0 }}>
						<DollHero
							name={tdoll.selected.name}
							id={tdoll.selected.id}
							type={tdoll.selected.type}
							rarity={tdoll.selected.rarity}
							isMod={isModForm}
							cardImage={tdollImage}
							onCardImageClick={switchBetweenNormalDamagedCardImages}
							normalId={tdoll.normal.id}
							skins={tdoll.skins}
							skinValue={showSkin ? skinSelected : false}
							onSkinChange={switchSkinSelected}
							hasMod={hasMod}
							modOn={isModForm}
							onToggleMod={switchModes}
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ order: { xs: 1, lg: 2 } }}>
						<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Stats
							</Typography>
							<StatsPanel stats={tdoll.selected} />
						</Paper>
					</Grid>

					{/************** Skill and tile buffs in one card. They are both what the doll does in a fight, and
					                apart they left the tile buffs as a mostly empty card in a row of taller ones. **************/}
					<Grid size={{ xs: 12, lg: 8 }} sx={{ order: { xs: 2, sm: 3, lg: 3 } }}>
						<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Abilities
							</Typography>
							<Box sx={styles.abilities}>
								<Box sx={[styles.abilityPart, { flex: { lg: "1 1 auto" } }]}>
									<Typography variant="subtitle2" component="h3" color="textSecondary" sx={styles.abilityHeading}>
										Skill
									</Typography>
									<SkillsPanel
										showModSkill={showModSkill}
										selectedSkill={selectedSkill}
										onSelectedSkillChange={setSelectedSkill}
										skillLevel={skillLevel}
										onSkillLevelChange={setSkillLevel}
										skill={tdoll.selected.skill}
										skill2={tdoll.selected.skill2}
										normalSkillDescription={tdoll.normal.skill.description}
										modSkill2Description={tdoll.mod?.skill2?.description}
										dollId={tdoll.selected.id}
										skillImages={tdoll.skillImages}
									/>
								</Box>
								<Box sx={[styles.abilityPart, { flex: { lg: "0 0 300px" } }]}>
									<Typography variant="subtitle2" component="h3" color="textSecondary" sx={styles.abilityHeading}>
										Tile buffs
									</Typography>
									<TilesPanel tileSet={tdoll.selected.tile_set} />
								</Box>
							</Box>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ order: { xs: 3, sm: 2, lg: 1 } }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Animations
							</Typography>
							<Box sx={styles.chibiColumn}>
								<LazySection minHeight={320}>
									<ChibiPanel
										animationMode={animationMode}
										spineAnimationName={spineAnimationName}
										spineTabs={spineTabs}
										onSwitchAnimations={switchAnimations}
										onSwitchAnimationMode={switchAnimationMode}
										spineRig={spineRig}
										normalId={tdoll.normal.id}
										onPlayerSwitchAnimations={playerSwitchAnimations}
									/>
								</LazySection>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</main>
	);
}
