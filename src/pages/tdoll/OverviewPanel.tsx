import type { JSX } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Card, CardActionArea, CardMedia, Fab, Tab, Tabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { cardArtSx } from "../../lib/artLayout";
import { uiUrl } from "../../lib/assets";
import type { RawSkins } from "../../types/tdoll";

const mod_button = uiUrl("mod.png");

const styles = {
	tabs: (theme: Theme) => ({
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}),
	tabForSkin: {
		width: 100
	},
	cardForImage: {
		...cardArtSx,
		// Capped at the artwork's own 256px rather than stretched, since upscaling a bitmap that is
		// already undersampled at this pixel ratio only makes it softer.
		maxWidth: 256,
		mx: "auto",
		marginBottom: "10px"
	},
	fabExpand: {
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
	fab_clickThrough: {
		display: "block",
		transform: "translate(5px, -505px)",
		height: 40,
		width: 40,
		opacity: "0%",
		pointerEvents: "none"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for OverviewPanel. */
interface OverviewPanelProps {
	/** The doll's skins, or null when it has none. */
	skins: RawSkins | null;
	/** Whether a skin is currently on screen instead of the Normal or Mod art. */
	showSkin: boolean;
	/** The doubled index of the selected skin tab. */
	skinSelected: number;
	/** Called when the skin tab selection changes. */
	onSkinTabChange: (event: unknown, newValue: number) => void;
	/** URL of the portrait currently on screen. */
	tdollImage: string | undefined;
	/** Called when the portrait is clicked, toggling the damaged art. */
	onCardImageClick: () => void;
	/** Name of the form currently selected, used as the portrait's title. */
	dollName: string;
	/** Whether the doll has a Mod, which shows the Mod toggle instead of the "back to Normal" button. */
	hasMod: boolean;
	/** Called when the Mod toggle button is clicked. */
	onSwitchModes: () => void;
	/** Called to switch back to the Normal form after a skin was selected. */
	onSwitchToNormalArt: () => void;
	/** The doll's base id, used to link to its full art page. */
	normalId: number;
}

/**
 * The doll's skin tabs and portrait card, with the Mod and full-art floating buttons.
 *
 * @param props Component props.
 * @returns The skin tab strip and the portrait card.
 */
export default function OverviewPanel({
	skins,
	showSkin,
	skinSelected,
	onSkinTabChange,
	tdollImage,
	onCardImageClick,
	dollName,
	hasMod,
	onSwitchModes,
	onSwitchToNormalArt,
	normalId
}: OverviewPanelProps) {
	// Render tabs for skin selection.
	const renderSkinsTabs = () => {
		const tempTabs: JSX.Element[] = [];

		if (skins === null) {
			return tempTabs;
		}

		(skins?.skin_names ?? []).map((name, index) => {
			// Index is doubled for the value such that the Damaged versions are not selected.
			return tempTabs.push(<Tab sx={styles.tabForSkin} label={name} key={index} wrapped value={index * 2} />);
		});

		return tempTabs;
	};

	// Function will render a floating button to go back to Normal art if a skin is selected. Assumes no Mod is available to T-Doll.
	const renderNormalButton = () => {
		if (showSkin) {
			return (
				<Fab color="primary" sx={styles.fab_mod} onClick={onSwitchToNormalArt}>
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

	return (
		<>
			{/************** T-Doll image and skin images (Card/Full) **************/}
			{skins !== null ? (
				(skins?.number_of_skins ?? 0) === 1 ? (
					<Tabs
						sx={styles.tabs}
						value={showSkin ? skinSelected : false}
						onChange={onSkinTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="fullWidth"
						scrollButtons
						allowScrollButtonsMobile
					>
						{renderSkinsTabs()}
					</Tabs>
				) : (
					<Tabs
						sx={styles.tabs}
						value={showSkin ? skinSelected : false}
						onChange={onSkinTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons
						allowScrollButtonsMobile
					>
						{renderSkinsTabs()}
					</Tabs>
				)
			) : (
				<Tabs sx={styles.tabs} value={false} indicatorColor="primary" textColor="primary" variant="fullWidth" scrollButtons="auto" centered>
					<Tab label="No skins" />
				</Tabs>
			)}

			<Card sx={styles.cardForImage}>
				<CardActionArea onClick={onCardImageClick}>
					<CardMedia component="img" sx={styles.cardForImage} image={tdollImage} title={dollName} />
				</CardActionArea>
				{/************** Floating Action Button overlayed over image at the top left **************/}
				{hasMod ? (
					<Fab color="primary" sx={styles.fab_mod} onClick={onSwitchModes}>
						<img src={mod_button} alt="Switch between Normal/Mod" style={{ height: 32, width: 32 }} />
					</Fab>
				) : (
					renderNormalButton()
				)}

				{/************** Floating Action Button overlayed over image at the bottom left **************/}
				<Fab color="primary" component={Link} to={`/tdoll/${normalId}/art`} sx={styles.fabExpand} aria-label="view full art">
					<ZoomOutMapIcon />
				</Fab>
			</Card>
		</>
	);
}
