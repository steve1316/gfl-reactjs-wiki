import { memo } from "react";

import { Box, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { heroArtSx } from "../../lib/artLayout";

const styles = {
	// Fixed to the viewport rather than sized to the page, so the art stays behind whatever is on screen as
	// the page scrolls on a phone, instead of stretching over the page's full height and losing the face.
	root: (theme: Theme) => ({
		position: "fixed",
		inset: 0,
		zIndex: 0,
		overflow: "hidden",
		pointerEvents: "none",
		backgroundColor: theme.palette.background.default
	}),
	// Scaled past the edges because a blur of this radius leaves a soft, transparent border otherwise.
	art: {
		...heroArtSx,
		filter: "blur(9px) saturate(1.2)",
		transform: "scale(1.06)"
	},
	scrim: (theme: Theme) => ({
		position: "absolute",
		inset: 0,
		backgroundColor: alpha(theme.palette.background.default, 0.6)
	})
} satisfies Record<string, SxProps<Theme>>;

/** Props for PageBackdrop. */
interface PageBackdropProps {
	/** URL of the full art to blur, or undefined when the doll has published none, which leaves a plain background. */
	artUrl: string | undefined;
}

/**
 * The doll's full art, blurred behind the whole doll page.
 *
 * This used to be confined to the hero, so the art filled the top band and stopped dead where the sections
 * began. Behind the whole page it reads as one backdrop rather than a banner.
 *
 * @param props Component props.
 * @returns The fixed backdrop layer.
 */
export default memo(function PageBackdrop({ artUrl }: PageBackdropProps) {
	return (
		<Box sx={styles.root} aria-hidden>
			{artUrl ? <Box component="img" src={artUrl} alt="" sx={styles.art} /> : null}
			<Box sx={styles.scrim} />
		</Box>
	);
});
