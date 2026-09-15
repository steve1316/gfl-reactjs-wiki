import { memo, useCallback, useState } from "react";
import type { ChangeEvent } from "react";

import { Avatar, Badge, Box, Button, Collapse, Divider, IconButton, InputAdornment, Paper, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import FilterChip from "./FilterChip";
import { uiUrl } from "../lib/assets";

const mod_button = uiUrl("mod.png");

// Avatars are props of memoised chips, so they are built once here. A fresh element per render would re-render every chip.
/** The number avatar for each rarity, keyed by the rarity it shows. */
const RARITY_AVATARS = new Map([1, 2, 3, 4, 5, 6].map((rarity) => [rarity, <Avatar key={rarity}>{rarity}</Avatar>]));
/** The Mod chip's icon avatar. */
const MOD_AVATAR = (
	<Avatar>
		<img src={mod_button} alt="" style={{ width: 20, height: 20 }} />
	</Avatar>
);

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
	// Name and build time searches share a row from sm up, the name taking twice the width, and stack on a phone.
	searches: {
		mt: 1.5,
		display: "grid",
		gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
		gap: 1,
		alignItems: "start"
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
	/** The text in the name search. */
	nameQuery: string;
	/** Called with the new text on every keystroke, so the list filters as the reader types. */
	onNameQueryChange: (query: string) => void;
	/** The text in the build time search. */
	buildTimeQuery: string;
	/** Called with the new text on every keystroke. */
	onBuildTimeQueryChange: (query: string) => void;
	/** True when the build time text is not a readable time, which shows a hint instead of filtering. */
	buildTimeInvalid: boolean;
	/** Toggles the rarity entry with this key. One stable handler for the whole row, which each chip calls with its key. */
	onToggleRarity: (key?: string | number) => void;
	/** Toggles the weapon-type entry with this key. One stable handler for the whole row, which each chip calls with its key. */
	onToggleType: (key?: string | number) => void;
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
export default memo(function FilterPanel({
	rarityFilter,
	typeFilter,
	modFilter,
	activeCount,
	nameQuery,
	onNameQueryChange,
	buildTimeQuery,
	onBuildTimeQueryChange,
	buildTimeInvalid,
	onToggleRarity,
	onToggleType,
	onToggleMod,
	onClear
}: FilterPanelProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = useCallback(() => setExpanded((current) => !current), []);
	const clearNameQuery = useCallback(() => onNameQueryChange(""), [onNameQueryChange]);
	const handleNameInput = useCallback((event: ChangeEvent<HTMLInputElement>) => onNameQueryChange(event.target.value), [onNameQueryChange]);
	const clearBuildTimeQuery = useCallback(() => onBuildTimeQueryChange(""), [onBuildTimeQueryChange]);
	const handleBuildTimeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => onBuildTimeQueryChange(event.target.value), [onBuildTimeQueryChange]);

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
							value={rarity.key}
							onToggle={onToggleRarity}
							colour={theme.palette.rarity[rarity.rarity as keyof typeof theme.palette.rarity]}
							avatar={RARITY_AVATARS.get(rarity.rarity)}
						/>
					</li>
				))}
			</Box>

			<Divider sx={styles.divider} />

			<Box component="ul" sx={styles.chipList}>
				{typeFilter.map((type) => (
					<li key={type.key}>
						<FilterChip
							label={type.label}
							selected={type.selected}
							value={type.key}
							onToggle={onToggleType}
							colour={theme.palette.weaponType[type.label as keyof typeof theme.palette.weaponType]}
						/>
					</li>
				))}
			</Box>

			<Divider sx={styles.divider} />

			<Box component="ul" sx={styles.chipList}>
				<li>
					<FilterChip label={modFilter.label} selected={modFilter.selected} onToggle={onToggleMod} avatar={MOD_AVATAR} />
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
							onClick={toggleExpanded}
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

			{/* Outside the collapsing rows, so a phone can search without opening the chips first. */}
			<Box sx={styles.searches}>
				<TextField
					value={nameQuery}
					onChange={handleNameInput}
					placeholder="Search by name"
					size="small"
					fullWidth
					slotProps={{
						htmlInput: { "aria-label": "Search T-Dolls by name" },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
							endAdornment: nameQuery ? (
								<InputAdornment position="end">
									<IconButton size="small" onClick={clearNameQuery} aria-label="clear name search" edge="end">
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							) : null
						}
					}}
				/>
				<TextField
					value={buildTimeQuery}
					onChange={handleBuildTimeInput}
					placeholder="Build time, e.g. 3:55"
					size="small"
					fullWidth
					error={buildTimeInvalid}
					helperText={buildTimeInvalid ? "Type a time like 3:55, 3:55:00 or 355" : undefined}
					slotProps={{
						htmlInput: { "aria-label": "Search T-Dolls by build time" },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<TimerOutlinedIcon fontSize="small" />
								</InputAdornment>
							),
							endAdornment: buildTimeQuery ? (
								<InputAdornment position="end">
									<IconButton size="small" onClick={clearBuildTimeQuery} aria-label="clear build time search" edge="end">
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							) : null
						}
					}}
				/>
			</Box>

			{/* Mounted either way, so toggling the breakpoint never drops the rows entirely. */}
			<Collapse in={open}>{rows}</Collapse>
		</Paper>
	);
});
