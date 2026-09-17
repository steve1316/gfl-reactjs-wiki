// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { ENEMY_MAX_RANK } from "../lib/enemyRanks";

/** One unfilled segment. A single shared object, so every segment hands the `sx` resolver the same reference. */
const EMPTY_SEGMENT: SxProps<Theme> = { flex: 1, height: 4, borderRadius: 1, bgcolor: "action.disabledBackground" };

/** One filled segment. */
const FILLED_SEGMENT: SxProps<Theme> = { flex: 1, height: 4, borderRadius: 1, bgcolor: "primary.main" };

const styles = {
	track: { display: "flex", gap: "2px", alignItems: "center" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Every bar body there can be, indexed by value. A bar only ever shows 0 to `ENEMY_MAX_RANK` filled segments, so the eight
 * possible rows are built once here rather than per bar. The index page draws six bars on each of its tiles, so building them
 * per render meant thousands of throwaway elements and `sx` arrays for eight distinct results.
 */
const SEGMENTS = Array.from({ length: ENEMY_MAX_RANK + 1 }, (_unused, value) =>
	Array.from({ length: ENEMY_MAX_RANK }, (_segment, index) => <Box key={index} sx={index < value ? FILLED_SEGMENT : EMPTY_SEGMENT} />)
);

/** Props for RankBar. */
interface RankBarProps {
	/** How many segments are filled, from 0 up to `ENEMY_MAX_RANK`. */
	value: number;
	/** What the bar measures, read out to assistive technology since the segments themselves carry no text. */
	label: string;
}

/**
 * One of the archive's rank bars, drawn as filled segments rather than a number because that is how the game shows it.
 *
 * @param props Component props.
 * @returns The bar.
 */
export default function RankBar({ value, label }: RankBarProps) {
	return (
		<Box sx={styles.track} role="img" aria-label={`${label}: ${value} of ${ENEMY_MAX_RANK}`}>
			{SEGMENTS[Math.min(Math.max(value, 0), ENEMY_MAX_RANK)]}
		</Box>
	);
}
