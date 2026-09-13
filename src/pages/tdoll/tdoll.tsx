import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
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
	// The two sections under the hero share a row from a medium screen up, so they fill it to the taller one.
	// Narrower screens keep natural heights, where equalising would pair a card with the taller Animations one.
	rowSection: {
		height: { md: "100%" },
		// On a wide screen the panel inside grows with the card too, so the inner boxes end level. Between md and
		// lg the Abilities card stacks and runs far taller than the stat table, and a grown table there was a
		// large empty box, so the table keeps its own height and only the outer card matches.
		display: { md: "flex" },
		flexDirection: "column",
		"& > :last-child": { flexGrow: { md: 0, lg: 1 } }
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

/** What the reader has chosen to look at, as kept in the page's query string. */
interface DollSelection {
	/** Whether the Mod is on screen. */
	mod: boolean;
	/** The 1-based skin on screen, or null for the base art. */
	skin: number | null;
	/** Whether the damaged art is on screen. */
	damaged: boolean;
}

/**
 * Read the selection from the query string, dropping anything the doll does not have.
 *
 * @param params The page's query string.
 * @param doll The doll the selection applies to.
 * @returns The selection to open the page on.
 */
function readSelection(params: URLSearchParams, doll: TDollData): DollSelection {
	const skin = Number(params.get("skin"));
	return {
		mod: params.get("mod") === "1" && doll.mod !== null,
		skin: Number.isInteger(skin) && skin >= 1 && skin <= (doll.skins?.number_of_skins ?? 0) ? skin : null,
		damaged: params.get("damaged") === "1"
	};
}

/**
 * Write a selection into a query string, leaving any other parameters alone.
 *
 * @param params The query string to update in place.
 * @param selection The selection to write. Defaults are removed rather than written.
 */
function writeSelection(params: URLSearchParams, selection: DollSelection) {
	const entries: [string, string | null][] = [
		["mod", selection.mod ? "1" : null],
		["skin", selection.skin === null ? null : String(selection.skin)],
		["damaged", selection.damaged ? "1" : null]
	];
	for (const [key, value] of entries) {
		if (value === null) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	}
}

/**
 * Route wrapper that loads the doll before rendering it.
 *
 * @param props Router props carrying the doll id.
 * @returns A placeholder while loading, then the doll's page.
 */
export default function TDoll() {
	const { id: routeId } = useParams<{ id?: string }>();
	const [searchParams] = useSearchParams();
	// The id comes from the /tdoll/:id route, falling back to the older ?id= query string.
	const rawId = routeId ?? searchParams.get("id") ?? "";
	const id = Number(rawId);
	// Undefined while loading and null once the shard has loaded without this id, so a missing doll is not stuck on "Loading".
	const [doll, setDoll] = useState<DisplayTDoll | null | undefined>(undefined);

	// Only the shard holding this doll is fetched. A copy is stored rather than the cached object,
	// because `selected` is assigned onto it below and the cache is shared with every other route.
	useEffect(() => {
		let active = true;
		setDoll(undefined);
		void loadDoll(id).then((found) => {
			if (active) {
				setDoll(found ? { ...found, selected: found.normal } : null);
			}
		});
		return () => {
			active = false;
		};
	}, [id]);

	if (doll === null) {
		return <NotFound404 message={`There is no T-Doll with the id ${rawId}.`} />;
	}

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
	const [searchParams, setSearchParams] = useSearchParams();

	// The skin, Mod and damaged art the page opens on, from the query string. That is how closing the art viewer or
	// reloading comes back to the same art. The doll object is a per-mount copy, so setting its form here is safe.
	const [initial] = useState(() => {
		const selection = readSelection(searchParams, tdoll);
		tdoll.selected = selection.mod && tdoll.mod ? tdoll.mod : tdoll.normal;
		// A skin without hosted art falls back to the form's own portrait.
		const images = selection.skin === null ? tdoll.selected.assets.images : (tdoll.forms[`${selection.mod ? "mod_" : ""}skin${selection.skin}`] ?? tdoll.selected.assets).images;
		return { ...selection, image: selection.damaged ? images.card_damaged : images.card };
	});

	///////////////////////////////////////////////////////////////////////////////////////////
	// Initialization of States
	///////////////////////////////////////////////////////////////////////////////////////////

	// Set initial states for the Normal/Mod modes.
	const [hasMod] = useState(tdoll.mod !== null);
	const [mode, setMode] = useState(initial.mod ? 1 : 0); // 0 for Normal, 1 for MOD.

	// Set initial states for the images.
	const [switchImage, setSwitchImage] = useState(initial.damaged); // If true, show Damaged version.
	const [tdollImage, setTDollImage] = useState<string | undefined>(initial.image);
	const [showSkin, setShowSkin] = useState(initial.skin !== null);
	// Skin pill values are doubled, so skin N is stored as (N - 1) * 2.
	const [skinSelected, setSkinSelected] = useState(initial.skin === null ? 0 : (initial.skin - 1) * 2);

	// Whether the doll's Mod is currently the form on screen, which SkillsPanel uses to show Skill 2.
	const [showModSkill, setShowModSkill] = useState(initial.mod);

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

	// Spine replaces the animation GIFs entirely. The combat and dorm rigs are separate skeletons, and
	// the dorm one often shares the combat atlas, which is why the index records the pair explicitly.
	const spineEntry = spineFor(tdoll.normal.id);

	// New dolls can arrive before their art is hosted. The page then shows placeholders and drops the Animations card.
	const hasArt = Boolean(tdoll.normal.assets.images.card);

	// Skin pills carry a doubled value, halved here the same way `skinIndex` is below.
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
	// Memoised on the rig's animation list so ChibiPanel, which is memoised, is not handed a new array every render.
	const spineTabs = useMemo(() => animationTabs(spineRig?.anims ?? []), [spineRig]);

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
	const skinForm = useCallback((index: number, withMod = false) => tdoll.forms[`${withMod ? "mod_" : ""}skin${index + 1}`], [tdoll]);

	// The zero-based skin on screen. Pill values are doubled, so the stored value is halved back here.
	const skinIndex = skinSelected / 2;

	// Keep the query string in step with the selection. Replacing rather than pushing means Back still leaves the page
	// instead of stepping through every skin clicked.
	useEffect(() => {
		const next = new URLSearchParams(searchParams);
		writeSelection(next, { mod: mode === 1, skin: showSkin ? skinIndex + 1 : null, damaged: switchImage });
		if (next.toString() !== searchParams.toString()) {
			setSearchParams(next, { replace: true });
		}
	}, [mode, showSkin, skinIndex, switchImage, searchParams, setSearchParams]);

	// Whether the form currently on screen is the Mod. Drives both the rarity star colour and the
	// hero's Mod toggle, which stay in lockstep since they describe the same underlying state.
	const isModForm = tdoll.selected === tdoll.mod;

	// The backdrop's full art follows the same selection as the card portrait: the current skin when one is
	// shown, otherwise the Normal/Mod form, and the damaged version whenever the portrait has been flipped to
	// it. mod_skin* forms only ever publish card art, so the base Normal form stands in when the selected form
	// has none of its own. A form missing only its damaged art keeps its own undamaged art rather than borrowing
	// another outfit's.
	const artKind = switchImage ? "full_damaged" : "full";
	const artImages = showSkin ? skinForm(skinIndex, mode === 1)?.images : tdoll.selected.assets.images;
	const heroArtUrl = artImages?.[artKind] ?? artImages?.full ?? tdoll.normal.assets.images[artKind] ?? tdoll.normal.assets.images.full;

	// The art viewer opens on the outfit on screen. A skin worn by the Mod has no full art of its own, so it opens on the
	// same skin's base form, which is the same outfit.
	const artForm = showSkin ? `skin${skinIndex + 1}` : isModForm ? "mod" : "normal";
	const artLink = `/tdoll/${tdoll.normal.id}/art?form=${artForm}${switchImage ? "&damaged=1" : ""}`;

	// Every handler below is wrapped in useCallback. The panels they are passed to are memoised, and a handler
	// recreated on each render would make every panel re-render on every change, whether or not it changed.

	// Helper function to reset selected animation tab back to the default tab.
	const helperResetAnimationTabs = useCallback(() => {
		setAnimationTabSelected("wait");
		setAnimationDormTabSelected("wait");
	}, []);

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for switching between modes, like Mod or Dorm.
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch information/images/animations displayed between Normal or Mod. Will reset skin selected.
	const switchModes = useCallback(() => {
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
	}, [tdoll, mode, hasMod, helperResetAnimationTabs]);

	// Switch the animations between Normal and Dorm.
	const switchAnimationMode = useCallback(() => {
		helperResetAnimationTabs();
		setAnimationMode((current) => (current === 0 ? 1 : 0));
	}, [helperResetAnimationTabs]);

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Card images
	///////////////////////////////////////////////////////////////////////////////////////////

	// Replace the T-Doll's card image with normal or damaged versions.
	const switchBetweenNormalDamagedCardImages = useCallback(() => {
		if (showSkin) {
			const skin = skinIndex;
			if (switchImage) {
				// Normal Skin image
				setTDollImage((skinForm(skin, mode === 1) ?? tdoll.selected.assets).images.card);
				setSwitchImage(false);
			} else {
				// Damaged Skin image
				setTDollImage((skinForm(skin, mode === 1) ?? tdoll.selected.assets).images.card_damaged);
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
	}, [showSkin, skinIndex, switchImage, skinForm, mode, tdoll]);

	// Switch back to base art for the current mode, undoing a skin selection. Leaves Normal/Mod alone,
	// since the Mod toggle already owns that axis. This only clears the skin one, the inverse of switchSkinSelected below.
	const switchToBaseArt = useCallback(() => {
		setShowSkin(false);
		setSkinSelected(0);
		setSwitchImage(false); // Prevents duplicate click bug on the Card component.

		setTDollImage(tdoll.selected.assets.images.card);

		helperResetAnimationTabs();
	}, [tdoll, helperResetAnimationTabs]);

	// Replace Card image with the Normal version of the selected skin, or the Base pill's false to go back.
	const switchSkinSelected = useCallback(
		(_event: unknown, newValue: number | false) => {
			if (newValue === false) {
				switchToBaseArt();
				return;
			}

			setSkinSelected(newValue);
			setShowSkin(true);
			setSwitchImage(false); // Prevents duplicate click bug on the Card component.

			// newValue is the doubled tab value, so it has to be halved the same way skinIndex is.
			// A skin without hosted art shows the form's own portrait instead of an empty card.
			setTDollImage((skinForm(newValue / 2, mode === 1) ?? tdoll.selected.assets).images.card);

			// Reset animation tab selected.
			helperResetAnimationTabs();
		},
		[switchToBaseArt, skinForm, mode, tdoll, helperResetAnimationTabs]
	);

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tab functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Record which tab is selected for the current animation mode. This alone drives spineAnimationName
	// above, since every doll resolves a Spine rig and the GIF-era per-animation lookups it used to also
	// perform here never ran for anyone.
	const switchAnimations = useCallback(
		(newValue: string) => {
			if (animationMode === 0) {
				setAnimationTabSelected(newValue);
			} else {
				setAnimationDormTabSelected(newValue);
			}
		},
		[animationMode]
	);

	///////////////////////////////////////////////////////////////////////////////////////////
	// Functions for Tileset functionality
	///////////////////////////////////////////////////////////////////////////////////////////

	// Switch the animation playing to the next one when the chibi is clicked. Walks the same spineTabs
	// list the pills render, so clicking the stage and clicking a pill always agree on what comes next.
	const playerSwitchAnimations = useCallback(() => {
		const currentIndex = spineTabs.findIndex((tab) => tab.value === spineAnimationName);
		const nextIndex = currentIndex === -1 || currentIndex + 1 >= spineTabs.length ? 0 : currentIndex + 1;
		const next = spineTabs[nextIndex];
		if (next) {
			switchAnimations(next.value);
		}
	}, [spineTabs, spineAnimationName, switchAnimations]);

	return (
		<main>
			<PageBackdrop artUrl={heroArtUrl} />
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				{/************** Every section on the page at once. From a medium screen up the animations share the hero's
				                row and Stats and Abilities sit below it, so a 1920x1080 screen shows the whole page. On a phone
				                everything stacks, with the animations last since they are the heaviest to load. **************/}
				<Grid container spacing={2}>
					{/************** T-Doll's hero: portrait, name, rarity, type, skin pills and Mod toggle **************/}
					{/* Without the Animations card the hero takes the whole first row, so Stats and Abilities still pair up below it. */}
					<Grid size={spineEntry ? { xs: 12, md: 7, lg: 8, xl: 9 } : { xs: 12 }} sx={{ order: 0 }}>
						<DollHero
							name={tdoll.selected.name}
							id={tdoll.selected.id}
							type={tdoll.selected.type}
							rarity={tdoll.selected.rarity}
							isMod={isModForm}
							cardImage={tdollImage}
							onCardImageClick={switchBetweenNormalDamagedCardImages}
							artLink={artLink}
							hasArt={hasArt}
							skins={tdoll.skins}
							skinValue={showSkin ? skinSelected : false}
							onSkinChange={switchSkinSelected}
							hasMod={hasMod}
							modOn={isModForm}
							onToggleMod={switchModes}
						/>
					</Grid>
					{/* Stats shares its small-screen row with the Animations card, so it takes the full row when that card is absent. */}
					<Grid size={{ xs: 12, sm: spineEntry ? 6 : 12, md: 5, lg: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
						<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Stats
							</Typography>
							<StatsPanel stats={tdoll.selected} />
						</Paper>
					</Grid>

					{/************** Skill and tile buffs in one card. They are both what the doll does in a fight, and
					                apart they left the tile buffs as a mostly empty card in a row of taller ones. **************/}
					<Grid size={{ xs: 12, md: 7, lg: 8 }} sx={{ order: { xs: 2, sm: 3 } }}>
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

					{spineEntry ? (
						<Grid size={{ xs: 12, sm: 6, md: 5, lg: 4, xl: 3 }} sx={{ order: { xs: 3, sm: 2, md: 1 } }}>
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
					) : null}
				</Grid>
			</Container>
		</main>
	);
}
