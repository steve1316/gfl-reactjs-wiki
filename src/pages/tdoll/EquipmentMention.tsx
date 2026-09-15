import { memo } from "react";
import type { ReactNode } from "react";

// MaterialUI imports
import { Box, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import ExclusiveEquipmentRow from "./ExclusiveEquipmentRow";
import type { ExclusiveEquipment } from "../../types/tdoll";

/** How long a tapped tooltip stays open on a touch screen, in milliseconds. */
const TOUCH_OPEN_MS = 6000;

const styles = {
	mention: {
		color: "text.primary",
		textDecorationLine: "underline",
		textDecorationStyle: "dotted",
		textUnderlineOffset: "3px",
		cursor: "help",
		borderRadius: "2px",
		"&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" }
	},
	tooltip: {
		p: 0,
		maxWidth: 380,
		bgcolor: "background.paper",
		border: 1,
		borderColor: "divider",
		borderRadius: "10px",
		overflow: "hidden"
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for EquipmentMention. */
interface EquipmentMentionProps {
	/** The exclusive equipment item the text names. */
	item: ExclusiveEquipment;
	/** The mentioned wording, as rendered from the description. */
	children: ReactNode;
}

/**
 * A skill description's mention of an exclusive equipment item, with the item's row in a tooltip on hover, focus or tap.
 *
 * @param props Component props.
 * @returns The underlined mention and its tooltip.
 */
export default memo(function EquipmentMention({ item, children }: EquipmentMentionProps) {
	return (
		<Tooltip title={<ExclusiveEquipmentRow item={item} />} enterTouchDelay={0} leaveTouchDelay={TOUCH_OPEN_MS} slotProps={{ tooltip: { sx: styles.tooltip } }}>
			<Box component="span" tabIndex={0} sx={styles.mention}>
				{children}
			</Box>
		</Tooltip>
	);
});
