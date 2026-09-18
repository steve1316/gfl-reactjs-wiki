import { memo } from "react";

// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FACTION_MARKS from "../data/faction-marks.json";

/**
 * How big the mark is drawn inside a chip.
 *
 * 22 was too big: a chip is 32 tall with a 16 radius, so a 22 mark left 5 above and below and ran into the rounded cap at the
 * left. 18 clears the curve and still reads, since these marks are drawn as solid silhouettes rather than thin strokes.
 */
const MARK_SIZE = 18;

const styles = {
	root: { display: "block", height: MARK_SIZE, width: MARK_SIZE, flexShrink: 0 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for FactionIcon. */
interface FactionIconProps {
	/** Faction name, as the enemy data spells it. */
	faction: string;
	/**
	 * Class name, which has to be accepted and forwarded.
	 *
	 * A MUI Chip clones whatever is handed to its `icon` prop and adds `MuiChip-icon` to the copy's class name. A component that
	 * takes the prop and drops it gets none of the spacing that class carries, which is what left the mark with no margins at all,
	 * pinned against the chip's rounded left edge.
	 */
	className?: string;
	/** Extra styles, such as a smaller size inside a small chip. */
	sx?: SxProps<Theme>;
}

/**
 * One faction's emblem at chip size, in the colour of whatever it sits inside.
 *
 * The shape is traced from the published emblem by `tools/assets/trace_faction_marks.py` and ships inside the bundle rather than
 * being fetched. A chip glyph that depends on a cross-origin request fails quietly, and a browser that cached a 404 while the
 * asset host was still propagating keeps showing an empty chip long after the file is live.
 *
 * @param props Component props.
 * @returns The mark, or null for a faction with no emblem of its own.
 */
export default memo(function FactionIcon({ faction, className, sx }: FactionIconProps) {
	const path = (FACTION_MARKS as Record<string, string>)[faction];
	if (path === undefined) {
		return null;
	}
	return (
		// MUI's own pattern for merging an incoming sx with a component's own, since sx can itself be an array and they cannot nest.
		<Box component="svg" viewBox="0 0 24 24" aria-hidden className={className} sx={[styles.root, ...(Array.isArray(sx) ? sx : [sx])]}>
			<path d={path} fill="currentColor" fillRule="evenodd" />
		</Box>
	);
});
