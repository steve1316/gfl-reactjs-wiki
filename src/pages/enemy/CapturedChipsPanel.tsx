import { memo, useMemo } from "react";

// MaterialUI imports
import { Box, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { AssimilationChip, AssimilationData, AssimilationUnit } from "../../types/enemy";

const styles = {
	chips: { display: "flex", flexWrap: "wrap", gap: 0.75 },
	note: { mb: 0.75, display: "block" }
} satisfies Record<string, SxProps<Theme>>;

/** Props for CapturedChipsPanel. */
interface CapturedChipsPanelProps {
	/** The playable unit captured from this enemy. */
	unit: AssimilationUnit;
	/** The shared chip list. */
	data: AssimilationData;
}

/**
 * The strategic chips a captured Ringleader can equip.
 *
 * Every slot currently takes the same chip types, so the set is listed once rather than repeated per slot. A unit with differing
 * slots would need this to grow a list each, which nothing in the data asks for yet.
 *
 * @param props Component props.
 * @returns The chip list, or a note for a class that has no slots.
 */
export default memo(function CapturedChipsPanel({ unit, data }: CapturedChipsPanelProps) {
	const chips = useMemo((): AssimilationChip[] => data.chips.filter((chip) => unit.chipSlots.some((types) => types.includes(chip.type))), [unit.chipSlots, data.chips]);

	if (chips.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				Only Ringleaders carry strategic chips.
			</Typography>
		);
	}

	return (
		<Box>
			<Typography variant="caption" color="text.secondary" sx={styles.note}>
				Equips {unit.chipSlots.length}, each chosen from any of these.
			</Typography>
			<Box sx={styles.chips}>
				{chips.map((chip) => (
					<Chip key={chip.id} label={chip.name} size="small" variant="outlined" title={chip.description} />
				))}
			</Box>
		</Box>
	);
});
