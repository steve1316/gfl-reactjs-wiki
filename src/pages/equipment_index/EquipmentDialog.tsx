import { memo } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { Box, Button, CardMedia, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { rarityColour } from "../../components/DollBadges";
import { formatBuildTime } from "../../lib/buildTime";
import { equipmentDollName, equipmentRarityName } from "../../lib/equipmentDisplay";
import { statName } from "../../lib/equipmentStats";
import type { Equipment } from "../../types/equipment";

const styles = {
	header: {
		display: "flex",
		flexDirection: { xs: "column", sm: "row" },
		alignItems: { xs: "stretch", sm: "flex-start" },
		gap: 2
	},
	icon: { width: { xs: "100%", sm: 200 }, aspectRatio: "256 / 196", objectFit: "cover", borderRadius: "8px", flex: "none", display: "block" },
	iconPlaceholder: {
		width: { xs: "100%", sm: 200 },
		aspectRatio: "256 / 196",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "8px",
		flex: "none",
		bgcolor: "action.hover"
	},
	facts: { display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 },
	rarity: { fontWeight: 700 },
	stats: { mt: 2 },
	statRow: {
		display: "flex",
		justifyContent: "space-between",
		gap: 2,
		py: 0.75,
		borderBottom: 1,
		borderColor: "divider",
		"&:last-of-type": { borderBottom: 0 }
	},
	statValue: { fontWeight: 650 },
	description: { mt: 2 },
	dollLink: {
		color: "primary.main",
		textDecorationColor: "inherit",
		"&:hover": { textDecorationThickness: 2 }
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for EquipmentDialog. */
interface EquipmentDialogProps {
	/** Whether the dialog is open. */
	open: boolean;
	/** The item to show. Kept by the page after closing, so the closing animation still has content. Undefined before any item is opened. */
	equipment: Equipment | undefined;
	/** Display name of the item's type, such as "Optical Sight". */
	typeLabel: string;
	/** The page's current level, whose stat values are shown. */
	level: number;
	/** Closes the dialog. */
	onClose: () => void;
}

/**
 * An equipment item's full details: icon, rarity and type, who can equip it with links to each doll, build time, stats at the page's level, and description.
 *
 * @param props Component props.
 * @returns The dialog.
 */
export default memo(function EquipmentDialog({ open, equipment, typeLabel, level, onClose }: EquipmentDialogProps) {
	return (
		<Dialog open={open && equipment !== undefined} onClose={onClose} fullWidth maxWidth="sm" scroll="paper" aria-labelledby="equipment-dialog-title">
			{equipment && (
				<>
					<DialogContent>
						<Box sx={styles.header}>
							{equipment.image === null ? (
								<Box sx={styles.iconPlaceholder}>
									<Typography variant="body2" color="text.secondary">
										Icon not available yet
									</Typography>
								</Box>
							) : (
								<CardMedia component="img" image={equipment.image} alt="" sx={styles.icon} />
							)}

							<Box sx={styles.facts}>
								<Typography id="equipment-dialog-title" variant="h6" component="h2">
									{equipment.name}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<Box component="span" sx={[styles.rarity, (theme) => ({ color: rarityColour(theme, equipment.rarity, false) })]}>
										{equipment.rarity}★ {equipmentRarityName(equipment.rarity)}
									</Box>
									{` · ${typeLabel}`}
								</Typography>
								<Typography variant="body2">
									Equippable by{" "}
									{equipment.dolls.length === 0
										? equipment.usable.join(", ")
										: equipment.dolls.map((doll, index) => (
												<span key={`${doll.id}-${doll.mod}`}>
													{index === 0 ? null : ", "}
													<Box component={Link} to={`/tdoll/${doll.id}`} sx={styles.dollLink} onClick={onClose}>
														{equipmentDollName(doll)}
													</Box>
												</span>
											))}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{equipment.buildSeconds === null ? "Not in Equipment Productions" : `Build time ${formatBuildTime(equipment.buildSeconds)}`}
								</Typography>
							</Box>
						</Box>

						<Box sx={styles.stats}>
							{Object.keys(equipment.stats).map((key) => (
								<Box key={key} sx={styles.statRow}>
									<Typography variant="body2" color="text.secondary">
										{statName(key)} at level {level}
									</Typography>
									<Typography variant="body2" sx={styles.statValue}>
										{equipment.stats[key]?.[level]}
									</Typography>
								</Box>
							))}
						</Box>

						<Typography variant="body2" sx={styles.description}>
							{equipment.description}
						</Typography>
					</DialogContent>

					<DialogActions>
						<Button onClick={onClose}>Close</Button>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
});
