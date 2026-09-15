import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";

// MaterialUI imports
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

const styles = {
	root: { width: "100%", "& .MuiToggleButton-root": { flex: 1, py: 0.5 } }
} satisfies Record<string, SxProps<Theme>>;

/** Props for StarRankPicker. */
interface StarRankPickerProps {
	/** The selected star rank. */
	value: number;
	/** The highest star rank. The lowest is always 1. */
	max: number;
	/** Called with the new star rank when a different button is picked. */
	onChange: (stars: number) => void;
	/** Extra styles for the button group. */
	sx?: SxProps<Theme>;
}

/**
 * A full-width row of star rank buttons, shared by the HOC and fairy stats panels.
 *
 * @param props Component props.
 * @returns The toggle button group.
 */
export default memo(function StarRankPicker({ value, max, onChange, sx }: StarRankPickerProps) {
	const ranks = useMemo(() => Array.from({ length: max }, (_v, index) => index + 1), [max]);

	const handleChange = useCallback(
		(_event: MouseEvent<HTMLElement>, next: number | null) => {
			// Clicking the selected button again reports null. Keep the current rank rather than having none.
			if (next !== null) {
				onChange(next);
			}
		},
		[onChange]
	);

	return (
		<ToggleButtonGroup value={value} exclusive onChange={handleChange} size="small" sx={[styles.root, ...(Array.isArray(sx) ? sx : [sx])]} aria-label="Star rank">
			{ranks.map((rank) => (
				<ToggleButton key={rank} value={rank} aria-label={`${rank} star${rank === 1 ? "" : "s"}`}>
					{rank}★
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
});
