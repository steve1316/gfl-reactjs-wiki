import { Avatar, Box, Button, Divider, Drawer, Popover, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import FilterChip from "./FilterChip";
import { uiUrl } from "../lib/assets";

const mod_button = uiUrl("mod.png");

const styles = {
	drawerPaper: {
		borderTopLeftRadius: "16px",
		borderTopRightRadius: "16px",
		maxHeight: "80vh"
	},
	popoverPaper: {
		width: 420,
		maxWidth: "90vw",
		maxHeight: "80vh"
	},
	content: {
		p: 2.5,
		display: "flex",
		flexDirection: "column",
		gap: 1,
		overflowY: "auto"
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between"
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
	},
	footer: {
		display: "flex",
		justifyContent: "flex-end",
		mt: 1
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

/** Props for FilterSheet. */
interface FilterSheetProps {
	/** Whether the sheet is currently open. */
	open: boolean;
	/** Called when the sheet should close: the Done button, a backdrop click, or Escape. */
	onClose: () => void;
	/** The Filters button to anchor the popover to on `sm` and up. Unused on the mobile drawer. */
	anchorEl: HTMLElement | null;
	/** The five rarity filter entries and their current selected state. */
	rarityFilter: RarityFilterEntry[];
	/** The six weapon-type filter entries and their current selected state. */
	typeFilter: SimpleFilterEntry[];
	/** The single Mod filter entry and its current selected state. */
	modFilter: SimpleFilterEntry;
	/** Toggles one rarity entry; curried so it can be handed straight to a chip's onToggle. */
	onToggleRarity: (entry: RarityFilterEntry) => () => void;
	/** Toggles one weapon-type entry; curried so it can be handed straight to a chip's onToggle. */
	onToggleType: (entry: SimpleFilterEntry) => () => void;
	/** Toggles the Mod filter. */
	onToggleMod: () => void;
	/** Clears every filter in the sheet at once. */
	onClear: () => void;
}

/**
 * The filter picker: a bottom drawer on a phone, a popover from `sm` up.
 *
 * The index used to render all three filter rows inline, ahead of every result, which is why a phone
 * had to scroll past 572px of chips before the first doll appeared. The three rows themselves are
 * unchanged here, just moved behind a Filters button so they only take screen space while open.
 *
 * @param props Component props.
 * @returns The drawer or popover, whichever the current breakpoint calls for.
 */
export default function FilterSheet({ open, onClose, anchorEl, rarityFilter, typeFilter, modFilter, onToggleRarity, onToggleType, onToggleMod, onClear }: FilterSheetProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const content = (
		<Box sx={styles.content}>
			<Box sx={styles.header}>
				<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
					Filters
				</Typography>
				<Button size="small" onClick={onClear}>
					Clear all
				</Button>
			</Box>

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

			<Box sx={styles.footer}>
				<Button variant="contained" onClick={onClose} fullWidth={isMobile}>
					Done
				</Button>
			</Box>
		</Box>
	);

	if (isMobile) {
		return (
			<Drawer anchor="bottom" open={open} onClose={onClose} slotProps={{ paper: { sx: styles.drawerPaper } }}>
				{content}
			</Drawer>
		);
	}

	return (
		<Popover
			open={open}
			onClose={onClose}
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			slotProps={{ paper: { sx: styles.popoverPaper } }}
		>
			{content}
		</Popover>
	);
}
