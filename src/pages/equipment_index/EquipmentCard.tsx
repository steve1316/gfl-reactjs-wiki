import { memo, useCallback, useMemo } from "react";

// MaterialUI imports
import { Box, Card, CardActionArea, CardMedia, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import { RarityLabel, TypeBadge } from "../../components/DollBadges";
import HighlightedName from "../../components/HighlightedName";
import { formatBuildTime } from "../../lib/buildTime";
import { equipmentDollName, usableSummary } from "../../lib/equipmentDisplay";
import { statName } from "../../lib/equipmentStats";
import { findNameMatch } from "../../lib/nameSearch";
import type { Equipment } from "../../types/equipment";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** How many stat rows every tile reserves. No item has more, and reserving them all keeps every tile the same height. */
const STAT_ROWS = 4;

/** Height of one stat row in pixels. */
const STAT_ROW_HEIGHT = 20;

/** Text about 11.5px, the smallest size used on the tiles so they stay readable on a phone. */
const SMALL_TEXT = "0.72rem";

const styles = {
	card: { height: "100%", display: "flex", flexDirection: "column" },
	action: { height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start" },
	art: { position: "relative" },
	icon: { aspectRatio: "256 / 196", objectFit: "cover" },
	iconPlaceholder: {
		// Equipment icons are 256x196.
		aspectRatio: "256 / 196",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		px: 1,
		textAlign: "center",
		bgcolor: "action.hover"
	},
	buildTime: {
		position: "absolute",
		right: 6,
		bottom: 6,
		display: "flex",
		alignItems: "center",
		gap: 0.5,
		px: 1,
		py: 0.25,
		borderRadius: "999px",
		// A per-value theme callback rather than a whole-style function, so the literal values above keep their narrow types.
		bgcolor: (theme: Theme) => alpha(theme.palette.background.default, 0.85),
		color: "text.primary",
		fontSize: "0.7rem",
		fontWeight: 600,
		lineHeight: 1.4
	},
	buildTimeIcon: { fontSize: "0.85rem" },
	body: { px: 1.25, pt: 1, pb: 1.25, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
	name: { fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	// While a search matches, the rest of the name drops to regular weight so the matched part stands out.
	nameWhileMatching: { fontWeight: 400, color: "text.secondary" },
	subRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, mt: 0.25 },
	type: { fontSize: SMALL_TEXT, color: "text.secondary", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	// Room for every row is reserved even when an item has fewer stats.
	stats: { mt: 0.75, minHeight: STAT_ROWS * STAT_ROW_HEIGHT },
	statRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, height: STAT_ROW_HEIGHT },
	statLabel: { fontSize: SMALL_TEXT, color: "text.secondary", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
	statValue: { fontSize: SMALL_TEXT, fontWeight: 650, whiteSpace: "nowrap" },
	footer: { mt: "auto", pt: 1, borderTop: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 0.5, minHeight: 31, overflow: "hidden", whiteSpace: "nowrap" },
	footerText: { fontSize: SMALL_TEXT, color: "text.secondary", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }
} satisfies Record<string, SxProps<Theme>>;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Tile

/** Props for EquipmentCard. */
interface EquipmentCardProps {
	/** The equipment to show. */
	equipment: Equipment;
	/** Display name of the item's type, such as "Optical Sight". */
	typeLabel: string;
	/** The level, 1 to 10, whose stat values are shown. */
	level: number;
	/** The name search text. The part of the name it matches is shown in bold. */
	highlight: string;
	/** Opens the details dialog for the item with this id. */
	onOpen: (id: number) => void;
}

/**
 * One piece of equipment as a fixed-size tile: icon and build time, name, type and rarity, up to four stats, and who can equip it.
 *
 * Every tile reserves the same rows, so a grid of them lines up whatever each item holds. The description and doll links live in the details dialog
 * the tile opens. Memoised, so a tile skips rendering when its own props are unchanged, such as when filters change which tiles are visible or the
 * dialog opens. A level step still re-renders every visible tile, which the deferred level keeps behind the slider thumb.
 *
 * @param props Component props.
 * @returns The tile.
 */
export default memo(function EquipmentCard({ equipment, typeLabel, level, highlight, onOpen }: EquipmentCardProps) {
	const match = useMemo(() => findNameMatch(equipment.name, highlight), [equipment.name, highlight]);
	const statKeys = useMemo(() => Object.keys(equipment.stats).slice(0, STAT_ROWS), [equipment.stats]);
	const summary = useMemo(() => usableSummary(equipment.usable), [equipment.usable]);
	const dollNames = useMemo(() => equipment.dolls.map(equipmentDollName).join(", "), [equipment.dolls]);
	const handleOpen = useCallback(() => onOpen(equipment.id), [onOpen, equipment.id]);
	const name = equipment.name;

	return (
		<Card sx={styles.card}>
			<CardActionArea onClick={handleOpen} aria-label={name} aria-haspopup="dialog" sx={styles.action}>
				<Box sx={styles.art}>
					{equipment.image === null ? (
						<Box sx={styles.iconPlaceholder}>
							<Typography variant="body2" color="text.secondary">
								Icon not available yet
							</Typography>
						</Box>
					) : (
						<CardMedia component="img" image={equipment.image} alt="" loading="lazy" sx={styles.icon} />
					)}
					{equipment.buildSeconds === null ? null : (
						<Box component="span" sx={styles.buildTime}>
							<TimerOutlinedIcon sx={styles.buildTimeIcon} />
							{formatBuildTime(equipment.buildSeconds)}
						</Box>
					)}
				</Box>

				<Box sx={styles.body}>
					<Typography component="div" sx={[styles.name, match !== null && styles.nameWhileMatching]} title={name}>
						<HighlightedName name={name} match={match} />
					</Typography>

					<Box sx={styles.subRow}>
						<Box component="span" sx={styles.type}>
							{typeLabel}
						</Box>
						<RarityLabel rarity={equipment.rarity} isMod={false} />
					</Box>

					<Box sx={styles.stats}>
						{statKeys.map((key) => {
							const values = equipment.stats[key] ?? [];
							// Values run from level 0 to 10, so the level is the index.
							const atLevel = values[level];
							// Highlighted when levelling has actually moved this stat off its level-one value.
							const improved = level !== 1 && atLevel !== values[1];
							return (
								<Box key={key} sx={styles.statRow}>
									<Box component="span" sx={styles.statLabel}>
										{statName(key)}
									</Box>
									<Box component="span" sx={[styles.statValue, { color: improved ? "primary.main" : "text.primary" }]}>
										{atLevel}
									</Box>
								</Box>
							);
						})}
					</Box>

					<Box sx={styles.footer}>
						{equipment.dolls.length > 0 ? (
							<Box component="span" sx={styles.footerText}>
								For {dollNames}
							</Box>
						) : summary !== null ? (
							<Box component="span" sx={styles.footerText}>
								{summary}
							</Box>
						) : (
							equipment.usable.map((type) => <TypeBadge key={type} type={type} dense />)
						)}
					</Box>
				</Box>
			</CardActionArea>
		</Card>
	);
});
