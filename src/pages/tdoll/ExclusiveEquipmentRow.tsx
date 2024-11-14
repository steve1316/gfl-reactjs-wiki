import { memo } from "react";

// MaterialUI imports
import { Box, Chip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { RarityStars } from "../../components/DollBadges";
import { statName } from "../../lib/equipmentStats";
import type { ExclusiveEquipment } from "../../types/tdoll";

const styles = {
	row: {
		display: "flex",
		alignItems: "center",
		gap: 2,
		p: 1.5,
		borderRadius: "10px",
		bgcolor: "action.hover"
	},
	// Equipment icons are 256x196, drawn beside the text at a size that keeps their "ONLY" badge readable.
	icon: {
		width: { xs: 80, sm: 96 },
		aspectRatio: "256 / 196",
		flex: "none",
		objectFit: "contain",
		display: "block"
	},
	iconPlaceholder: {
		width: { xs: 80, sm: 96 },
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
		rowGap: 0.5
	},
	name: {
		fontWeight: 650
	},
	stats: {
		display: "flex",
		flexWrap: "wrap",
		columnGap: 2,
		rowGap: 0.25,
		mt: 0.5
	},
	statValue: {
		color: "text.primary",
		fontWeight: 650
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for ExclusiveEquipmentRow. */
interface ExclusiveEquipmentRowProps {
	/** The equipment item to show. */
	item: ExclusiveEquipment;
	/** The element the row renders as: `li` inside the Stats card list, `div` inside a tooltip. */
	component?: "li" | "div";
}

/**
 * One exclusive equipment item: icon, name, rarity and any Mod badge, then its stats at maximum level.
 *
 * @param props Component props.
 * @returns The row.
 */
export default memo(function ExclusiveEquipmentRow({ item, component = "div" }: ExclusiveEquipmentRowProps) {
	return (
		<Box component={component} sx={styles.row}>
			{item.image === null ? <Box sx={styles.iconPlaceholder} aria-hidden="true" /> : <Box component="img" src={item.image} alt="" loading="lazy" sx={styles.icon} />}
			<Box sx={styles.text}>
				<Box sx={styles.nameLine}>
					<Typography variant="body1" component="h3" sx={styles.name}>
						{item.name}
					</Typography>
					<RarityStars rarity={item.rarity} isMod={false} />
					{item.mod ? <Chip label="Mod" size="small" color="primary" variant="outlined" /> : null}
				</Box>
				<Box sx={styles.stats}>
					{Object.entries(item.stats).map(([key, value]) => (
						<Typography key={key} variant="body2" color="text.secondary">
							{statName(key)}{" "}
							<Box component="span" sx={styles.statValue}>
								{value}
							</Box>
						</Typography>
					))}
				</Box>
			</Box>
		</Box>
	);
});
