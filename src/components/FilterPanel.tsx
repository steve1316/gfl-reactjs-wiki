import { useState } from "react";

import { Avatar, Badge, Box, Button, Collapse, Divider, IconButton, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import FilterChip from "./FilterChip";
import { uiUrl } from "../lib/assets";

const mod_button = uiUrl("mod.png");

const styles = {
	root: {
		p: { xs: 1.5, sm: 2 },
		mt: 2
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 1
	},
	headerLabel: {
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		fontWeight: 700
	},
	rows: {
		display: "flex",
		flexDirection: "column",
		gap: 1,
		pt: 1
	},
	chipList: {
		display: "flex",
		flexWrap: "wrap",
		listStyle: "none",
		p: 0,
		m: 0,
		gap: 0.5
	},
	divider: {
		my: 0.5
	}
} satisfies Record<string, SxProps<Theme>>;

/** One weapon-type or Mod filter entry: a togglable chip with no colour data of its own beyond its label. */
interface SimpleFilterEntry {
	/** Stable index used to match a toggle back to this entry. */
	key: number;
	/** Text shown on the chip. */
	label: string;
	/** Whether this filter is currently active. */
	selected: boolean;
}

/** One rarity filter entry, which also carries the rarity number used for matching and the chip's colour. */
interface RarityFilterEntry extends SimpleFilterEntry {
	/** The game's rarity number (1 = Extra, 2-5 = General through Legendary) this entry filters on. */
	rarity: number;
}

/** Props for FilterPanel. */
interface FilterPanelProps {
	/** The five rarity filter entries and their current selected state. */
	rarityFilter: RarityFilterEntry[];
	/** The six weapon-type filter entries and their current selected state. */
	typeFilter: SimpleFilterEntry[];
	/** The single Mod filter entry and its current selected state. */
	modFilter: SimpleFilterEntry;
	/** How many filters are currently active, shown on the collapsed header so nothing is hidden silently. */
	activeCount: number;
	/** Toggles one rarity entry; curried so it can be handed straight to a chip's onToggle. */
	onToggleRarity: (entry: RarityFilterEntry) => () => void;
	/** Toggles one weapon-type entry; curried so it can be handed straight to a chip's onToggle. */
	onToggleType: (entry: SimpleFilterEntry) => () => void;
	/** Toggles the Mod filter. */
	onToggleMod: () => void;
	/** Clears every filter at once. */
	onClear: () => void;
}

/**
 * The index's filters, rendered in the page itself.
 *
 * These lived behind a Filters button that opened a drawer on a phone and a popover on a desktop. Putting
 * them back in the page costs roughly 250px on a desktop and 330-370px on a phone, which is why the phone
 * starts collapsed. Whatever is active stays on screen as chips in the summary bar either way, so collapsing
 * never hides the fact that a filter is on.
 *
 * @param props Component props.
 * @returns The filter rows, always open from `sm` up and collapsible below it.
 */
export default function FilterPanel({ rarityFilter, typeFilter, modFilter, activeCount, onToggleRarity, onToggleType, onToggleMod, onClear }: FilterPanelProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [expanded, setExpanded] = useState(false);

	// Only the phone collapses. On a wider screen the rows cost little enough to leave open.
	const open = !isMobile || expanded;

	const rows = (
		<Box sx={styles.rows}>
			<Box component="ul" sx={styles.chipList}>
				{rarityFilter.map((rarity) => (
					<li key={rarity.key}>
						<FilterChip
							label={rarity.label}
							selected={rarity.selected}
							onToggle={onToggleRarity(rarity)}
							colour={theme.palette.rarity[rarity.rarity as keyof typeof theme.palette.rarity]}
							avatar={<Avatar>{rarity.rarity}</Avatar>}
						/>
					</li>
				))}
			</Box>

			<Divider sx={styles.divider} />

			<Box component="ul" sx={styles.chipList}>
				{typeFilter.map((type) => (
					<li key={type.key}>
						<FilterChip label={type.label} selected={type.selected} onToggle={onToggleType(type)} colour={theme.palette.weaponType[type.label as keyof typeof theme.palette.weaponType]} />
					</li>
				))}
			</Box>

			<Divider sx={styles.divider} />

			<Box component="ul" sx={styles.chipList}>
				<li>
					<FilterChip
						label={modFilter.label}
						selected={modFilter.selected}
						onToggle={onToggleMod}
						avatar={
							<Avatar>
								<img src={mod_button} alt="" style={{ width: 20, height: 20 }} />
							</Avatar>
						}
					/>
				</li>
			</Box>
		</Box>
	);

	return (
		<Paper sx={styles.root} elevation={0} variant="outlined">
			<Box sx={styles.header}>
				<Typography variant="subtitle1" sx={styles.headerLabel} component="h2">
					Filters
					{activeCount > 0 && <Badge badgeContent={activeCount} color="primary" />}
				</Typography>

				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Button size="small" onClick={onClear} disabled={activeCount === 0}>
						Clear all
					</Button>
					{isMobile && (
						<IconButton
							onClick={() => setExpanded((current) => !current)}
							aria-label={expanded ? "Hide filters" : "Show filters"}
							aria-expanded={expanded}
							size="small"
							sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
						>
							<ExpandMoreIcon />
						</IconButton>
					)}
				</Box>
			</Box>

			{/* Mounted either way, so toggling the breakpoint never drops the rows entirely. */}
			<Collapse in={open}>{rows}</Collapse>
		</Paper>
	);
}
