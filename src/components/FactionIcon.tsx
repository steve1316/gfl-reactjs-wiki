import { memo } from "react";

// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

/**
 * One path per faction, echoing the silhouette of its emblem in the game.
 *
 * Drawn rather than extracted: the game's own emblems are detailed illustrations that turn to mush below about 32px, which is taller
 * than a filter chip. These read at 18px and inherit the chip's colour, so they never fight the fill. The real emblems are used at
 * full size on an enemy's page instead.
 */
const FACTION_PATHS: Record<string, string> = {
	// Sangvis Ferri's mark is a hexagon split by an upright bar.
	"Sangvis Ferri": "M12 2 3 7v10l9 5 9-5V7zM12 7.5v9",
	// KCCO's is an eagle on a shield, which reduces to the shield.
	KCCO: "M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z",
	// Paradeus' is a compass inside a diamond.
	Paradeus: "M12 2 22 12 12 22 2 12z"
};

const styles = {
	root: { display: "block", height: 18, width: 18 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for FactionIcon. */
interface FactionIconProps {
	/** Faction name, as the enemy data spells it. */
	faction: string;
}

/**
 * A small glyph standing for one faction, in the colour of whatever it sits inside.
 *
 * @param props Component props.
 * @returns The glyph, or null for a faction with no mark of its own.
 */
export default memo(function FactionIcon({ faction }: FactionIconProps) {
	const path = FACTION_PATHS[faction];
	if (path === undefined) {
		return null;
	}
	return (
		<Box component="svg" viewBox="0 0 24 24" aria-hidden sx={styles.root}>
			<path d={path} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
		</Box>
	);
});
