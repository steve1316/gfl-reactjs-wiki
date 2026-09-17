import { memo } from "react";

// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const styles = {
	track: { display: "flex", gap: "2px", alignItems: "center" },
	segment: { flex: 1, height: 4, borderRadius: 1, bgcolor: "action.disabledBackground" },
	segmentFilled: { bgcolor: "primary.main" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for RankBar. */
interface RankBarProps {
	/** How many segments are filled, from 0 up to `max`. */
	value: number;
	/** How many segments the bar has. */
	max: number;
	/** What the bar measures, read out to assistive technology since the segments themselves carry no text. */
	label: string;
}

/**
 * One of the archive's rank bars, drawn as filled segments rather than a number because that is how the game shows it.
 *
 * @param props Component props.
 * @returns The bar.
 */
export default memo(function RankBar({ value, max, label }: RankBarProps) {
	return (
		<Box sx={styles.track} role="img" aria-label={`${label}: ${value} of ${max}`}>
			{Array.from({ length: max }, (_unused, index) => (
				<Box key={index} sx={[styles.segment, index < value && styles.segmentFilled]} />
			))}
		</Box>
	);
});
