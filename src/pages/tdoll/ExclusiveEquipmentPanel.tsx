import { memo } from "react";

// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ExclusiveEquipmentRow from "./ExclusiveEquipmentRow";
import type { ExclusiveEquipment } from "../../types/tdoll";

const styles = {
	list: {
		listStyle: "none",
		m: 0,
		p: 0,
		display: "flex",
		flexDirection: "column",
		gap: 1.5
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for ExclusiveEquipmentPanel. */
interface ExclusiveEquipmentPanelProps {
	/** The doll's exclusive equipment, items every form can equip before Mod-only ones. */
	items: ExclusiveEquipment[];
}

/**
 * The equipment only this doll can use, one two-line row per item: icon, name, rarity and any Mod badge, then stats at the item's maximum level.
 *
 * Every item is listed whichever form is on screen, and the ones only the Mod can equip carry a Mod badge.
 *
 * @param props Component props.
 * @returns The list of items.
 */
export default memo(function ExclusiveEquipmentPanel({ items }: ExclusiveEquipmentPanelProps) {
	return (
		<Box component="ul" sx={styles.list}>
			{items.map((item) => (
				<ExclusiveEquipmentRow key={item.id} item={item} component="li" />
			))}
		</Box>
	);
});
