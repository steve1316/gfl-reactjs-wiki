import { memo } from "react";

// MaterialUI imports
import { Box, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { RarityStars } from "../../components/DollBadges";
import { statName } from "../../lib/equipmentStats";
import type { ExclusiveEquipment } from "../../types/tdoll";

const styles = {
	list: {
		listStyle: "none",
		m: 0,
		p: 0,
		display: "flex",
		flexDirection: "column",
		gap: 1
	},
	row: {
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		p: 1,
		borderRadius: "8px",
		bgcolor: "action.hover"
	},
	// Equipment icons are 256x196, drawn small beside the text.
	icon: {
		width: 64,
		aspectRatio: "256 / 196",
		flex: "none",
		objectFit: "contain",
		display: "block"
	},
	iconPlaceholder: {
		width: 64,
		aspectRatio: "256 / 196",
		flex: "none",
		borderRadius: "6px",
		bgcolor: "action.hover"
	},
	text: {
		minWidth: 0
	},
	nameLine: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
		columnGap: 1,
		rowGap: 0.25
	},
	name: {
		fontWeight: 650
	},
	stats: {
		display: "flex",
		flexWrap: "wrap",
		columnGap: 1.5,
		rowGap: 0.25
	},
	statValue: {
		color: "text.primary",
		fontWeight: 650
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
				<Box component="li" key={item.id} sx={styles.row}>
					{item.image === null ? <Box sx={styles.iconPlaceholder} aria-hidden="true" /> : <Box component="img" src={item.image} alt="" loading="lazy" sx={styles.icon} />}
					<Box sx={styles.text}>
						<Box sx={styles.nameLine}>
							<Typography variant="body2" component="h3" sx={styles.name}>
								{item.name}
							</Typography>
							<RarityStars rarity={item.rarity} isMod={false} />
							{item.mod ? <Chip label="Mod" size="small" color="primary" variant="outlined" /> : null}
						</Box>
						<Box sx={styles.stats}>
							{Object.entries(item.stats).map(([key, value]) => (
								<Typography key={key} variant="caption" color="text.secondary">
									{statName(key)}{" "}
									<Box component="span" sx={styles.statValue}>
										{value}
									</Box>
								</Typography>
							))}
						</Box>
					</Box>
				</Box>
			))}
		</Box>
	);
});
