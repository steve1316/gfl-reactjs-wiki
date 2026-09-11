import { Link } from "react-router-dom";

// MaterialUI imports
import { Card, CardActionArea, CardMedia, Fab } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { cardArtSx } from "../../lib/artLayout";

const styles = {
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
	fabTopLeft: {
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
	/** Whether a skin is currently on screen instead of the Normal or Mod art. */
	showSkin: boolean;
	/** URL of the portrait currently on screen. */
	tdollImage: string | undefined;
	/** Called when the portrait is clicked, toggling the damaged art. */
	onCardImageClick: () => void;
	/** Name of the form currently selected, used as the portrait's title. */
	dollName: string;
	/** Called to switch back to the Normal form after a skin was selected. */
	onSwitchToNormalArt: () => void;
	/** The doll's base id, used to link to its full art page. */
	normalId: number;
}

/**
 * The doll's portrait card, with the "back to Normal" and full-art floating buttons.
 *
 * The skin tabs and the Mod toggle that used to live here now live in the page's hero, so this card
 * is left with only the card art and the floating buttons the hero does not carry.
 *
 * @param props Component props.
 * @returns The portrait card.
 */
export default function OverviewPanel({ showSkin, tdollImage, onCardImageClick, dollName, onSwitchToNormalArt, normalId }: OverviewPanelProps) {
	// Function will render a floating button to go back to Normal art if a skin is selected.
	const renderNormalButton = () => {
		if (showSkin) {
			return (
				<Fab color="primary" sx={styles.fabTopLeft} onClick={onSwitchToNormalArt}>
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
		<Card sx={styles.cardForImage}>
			<CardActionArea onClick={onCardImageClick}>
				<CardMedia component="img" sx={styles.cardForImage} image={tdollImage} title={dollName} />
			</CardActionArea>
			{/************** Floating Action Button overlayed over image at the top left **************/}
			{renderNormalButton()}

			{/************** Floating Action Button overlayed over image at the bottom left **************/}
			<Fab color="primary" component={Link} to={`/tdoll/${normalId}/art`} sx={styles.fabExpand} aria-label="view full art">
				<ZoomOutMapIcon />
			</Fab>
		</Card>
	);
}
