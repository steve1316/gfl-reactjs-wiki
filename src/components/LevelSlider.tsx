import { memo, useCallback } from "react";

// MaterialUI imports
import { Box, Slider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const styles = {
	root: { display: "flex", alignItems: "center", gap: 2, px: 0.5 },
	slider: { flex: 1, minWidth: 0 },
	value: { fontWeight: 700, minWidth: 56, textAlign: "right" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for LevelSlider. */
interface LevelSliderProps {
	/** Id for the label, which names the slider for screen readers. */
	id: string;
	/** Text shown before the slider, such as "Skill level". */
	label: string;
	/** The current level. */
	value: number;
	/** The highest level. The lowest is always 1. */
	max: number;
	/** Whether to draw a mark at every step, for short ranges. */
	marks?: boolean;
	/** Called with the new level while the slider moves. */
	onChange: (level: number) => void;
	/** Extra styles for the row, such as spacing or a maximum width. */
	sx?: SxProps<Theme>;
}

/**
 * A labelled level slider with the current level shown beside it, shared by the HOC and fairy pages' stats and skills.
 *
 * @param props Component props.
 * @returns The slider row.
 */
export default memo(function LevelSlider({ id, label, value, max, marks = false, onChange, sx }: LevelSliderProps) {
	const handleChange = useCallback((_event: Event, next: number | number[]) => onChange(Array.isArray(next) ? (next[0] ?? 1) : next), [onChange]);

	return (
		<Box sx={[styles.root, ...(Array.isArray(sx) ? sx : [sx])]}>
			<Typography id={id} variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Slider aria-labelledby={id} value={value} onChange={handleChange} step={1} marks={marks} min={1} max={max} valueLabelDisplay="auto" sx={styles.slider} />
			<Typography variant="body2" sx={styles.value}>
				Lvl {value}
			</Typography>
		</Box>
	);
});
