import { memo, useCallback, useState } from "react";
import type { FormEvent, HTMLAttributes, Key, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

// MaterialUI imports
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, alpha, Icon, Divider, TextField, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Autocomplete imports
import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

// MaterialUI icon imports
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { uiUrl } from "../lib/assets";
import { searchIndex } from "../lib/data";

const HomeIcon = uiUrl("home_icon.png");
const IndexIcon = uiUrl("index_icon.png");
const EquipmentIcon = uiUrl("equipment_icon.png");
const HOCIcon = uiUrl("hoc_icon.png");
const FairyIcon = uiUrl("fairy_icon.png");
const FormationIcon = uiUrl("formation_icon.png");

/** One entry in the search dropdown, grouped by its leading character. */
interface SearchOption {
	/** The heading this option groups under: a letter, or "0-9" for names starting with a digit. */
	firstLetter: string;
	/** Doll id, used to build the link. */
	id: number;
	/** Doll name, shown and matched against. */
	name: string;
}

/**
 * The search dropdown's options.
 *
 * Built from the search index rather than the full dataset. The navbar renders on every route, so
 * pulling all five data shards here cost 65 KB gzipped on every page including the 404.
 */
const options: SearchOption[] = searchIndex
	.map((entry) => {
		const firstLetter = entry.name.charAt(0).toUpperCase();
		return { firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter, id: entry.id, name: entry.name };
	})
	.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter) || a.name.localeCompare(b.name));

/**
 * Styles for the navigation bar, as `sx` entries.
 *
 * `search` reads the theme, which `sx` supplies through a callback, and `title` uses the responsive
 * object form in place of a breakpoint media query. The old `backdrop` rule is gone, since nothing
 * referenced it.
 */
const styles = {
	root: { flexGrow: 1 },
	menuButton: { mr: 2 },
	title: { flexGrow: 1 },
	search: (theme: Theme) => ({
		position: "relative",
		width: "100%",
		marginLeft: 0,
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto"
		}
	}),
	drawerPaper: { width: "inherit" },
	link: { textDecoration: "none", color: "text.primary" }
} satisfies Record<string, SxProps<Theme>>;

/** The drawer's destinations. Static, so declared once here rather than rebuilt on every keystroke in the search. */
const NAV_ITEMS = [
	{
		title: "Home",
		link: "/",
		image: HomeIcon,
		height: 25,
		width: 25
	},
	{
		title: "T-Doll Index",
		link: "/index",
		image: IndexIcon,
		height: 25,
		width: 25
	},
	{
		title: "Equipment Index",
		link: "/equipment-index",
		image: EquipmentIcon,
		height: 25,
		width: 25
	},
	{
		title: "HOC Index",
		link: "/hoc-index",
		image: HOCIcon,
		height: 25,
		width: 24 // This is 24 because of the icon getting its right side cut off if it was set to 25 width.
	},
	{
		title: "Fairy Index",
		link: "/fairy-index",
		image: FairyIcon,
		height: 25,
		width: 25
	},
	{
		title: "Formation Simulator",
		link: "/formation",
		image: FormationIcon,
		height: 25,
		width: 25
	}
];

/**
 * The heading a search option groups under.
 *
 * @param option The option.
 * @returns Its leading letter, or "0-9".
 */
const groupByLetter = (option: SearchOption) => option.firstLetter;

/**
 * The text a search option shows and is matched on.
 *
 * @param option The option.
 * @returns The doll's name.
 */
const optionLabel = (option: SearchOption) => option.name;

/**
 * Whether two options are the same doll. Names repeat across forms, so options are compared by id.
 *
 * @param option An option.
 * @param value The selected value.
 * @returns True when both are the same doll.
 */
const sameDoll = (option: SearchOption, value: SearchOption) => option.id === value.id;

/**
 * One row of the search dropdown, with the typed text in bold.
 *
 * @param optionProps Props MUI supplies for the row, including its key.
 * @param option The option to render.
 * @param state MUI's render state, carrying the typed text.
 * @returns The row.
 */
const renderSearchOption = (optionProps: HTMLAttributes<HTMLLIElement> & { key: Key }, option: SearchOption, state: { inputValue: string }) => {
	const parts = parse(option.name, match(option.name, state.inputValue));
	const { key, ...rest } = optionProps;
	return (
		<li key={key} {...rest}>
			{parts.map((part, index) => (
				<span key={index} style={{ fontWeight: part.highlight ? 1000 : 400 }}>
					{part.text}
				</span>
			))}
		</li>
	);
};

/**
 * The search field's pill styling.
 *
 * One shape, not two. The wrapper used to draw a 64px pill behind an 8px rectangle, so the pill's corners showed
 * around a near-square box.
 *
 * @param theme The theme.
 * @returns The sx for the field.
 */
const searchFieldSx = (theme: Theme) => ({
	"& .MuiOutlinedInput-root": {
		borderRadius: "999px",
		backgroundColor: alpha(theme.palette.common.white, 0.11),
		"&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.17) },
		"& fieldset": { borderColor: "transparent" },
		"&:hover fieldset": { borderColor: "transparent" },
		"&.Mui-focused fieldset": { borderColor: theme.palette.secondary.main, borderWidth: 2 }
	},
	// The secondary text colour reads 3.6:1 on the pill, under the 4.5:1 minimum for text this size.
	"& .MuiInputLabel-root:not(.Mui-focused):not(.Mui-error)": { color: alpha(theme.palette.text.primary, 0.7) }
});

/** Props for NavList. */
interface NavListProps {
	/** Called when a destination is picked, to close the drawer. */
	onNavigate: () => void;
}

/**
 * The drawer's list of destinations.
 *
 * Memoised because the navbar re-renders on every keystroke in the search field, which used to rebuild this list too.
 *
 * @param props Component props.
 * @returns The list.
 */
const NavList = memo(function NavList({ onNavigate }: NavListProps) {
	return (
		<List>
			{NAV_ITEMS.map((item) => (
				<div key={item.title}>
					<Box component={Link} to={item.link} sx={styles.link} onClick={onNavigate}>
						<ListItemButton>
							<ListItemIcon>
								<Icon>
									<img src={item.image} height={item.height} width={item.width} alt={item.title} />
								</Icon>
							</ListItemIcon>
							<ListItemText primary={item.title} />
						</ListItemButton>
					</Box>
					<Divider />
				</div>
			))}
		</List>
	);
});

/**
 * The top bar: drawer trigger, title and search.
 *
 * @returns The application bar and its navigation drawer.
 */
export default function Navbar() {
	const navigate = useNavigate();
	const theme = useTheme();
	// The bar cannot hold a title and a search field at once on a phone, so below `sm` the field is
	// folded behind an icon and takes the whole bar when opened.
	const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
	const [searchOpen, setSearchOpen] = useState(false);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [hasError, setHasError] = useState(false);

	// Controls opening and closing the Drawer.
	// Every handler is stable, so the memoised drawer list and the Autocomplete's callback props do not change
	// identity on every keystroke in the search field.
	const handleDrawerToggle = useCallback(() => setDrawerOpen((open) => !open), []);
	const closeDrawer = useCallback(() => setDrawerOpen(false), []);
	const openSearch = useCallback(() => setSearchOpen(true), []);
	const closeSearch = useCallback(() => setSearchOpen(false), []);

	// Send the reader to a doll and leave search mode. Shared by picking a suggestion and by submitting
	// the form, so both routes behave the same.
	const goTo = useCallback(
		(option: SearchOption) => {
			// Collapse the field again, or the reader lands on the doll with the bar still in search mode.
			setSearchOpen(false);
			void navigate(`/tdoll/${option.id}`);
		},
		[navigate]
	);

	// Submitting without picking a suggestion. An exact name wins, otherwise the first option the typed
	// text appears in, which is the row the dropdown would have had highlighted.
	const handleSubmit = useCallback(
		(event?: FormEvent) => {
			event?.preventDefault();
			const typed = searchValue.trim().toLowerCase();
			if (typed === "") {
				return;
			}
			const selected = options.find((option) => option.name.toLowerCase() === typed) ?? options.find((option) => option.name.toLowerCase().includes(typed));
			if (!selected) {
				setHasError(true);
				return;
			}
			goTo(selected);
		},
		[searchValue, goTo]
	);

	const handleInputChange = useCallback((_event: SyntheticEvent, newInputValue: string) => {
		setSearchValue(newInputValue);
		// Without this the failed-search label stays until the next successful submit.
		setHasError(false);
	}, []);

	// Picking a suggestion used to only fill the text box, leaving the reader to press Enter themselves.
	const handleOptionChange = useCallback(
		(_event: SyntheticEvent, option: SearchOption | null) => {
			if (option) {
				goTo(option);
			}
		},
		[goTo]
	);

	const renderSearchInput = useCallback(
		(params: AutocompleteRenderInputParams) => <TextField {...params} color="secondary" label={hasError ? "Does not match any T-Doll" : "Search..."} variant="outlined" sx={searchFieldSx} />,
		[hasError]
	);

	const searchField = (
		<form onSubmit={handleSubmit} style={{ width: "100%" }}>
			<Autocomplete
				options={options}
				groupBy={groupByLetter}
				getOptionLabel={optionLabel}
				size="small"
				sx={{ width: "100%", minWidth: { xs: 0, sm: 300 } }}
				inputValue={searchValue}
				onInputChange={handleInputChange}
				onChange={handleOptionChange}
				isOptionEqualToValue={sameDoll}
				// MUI swallows the first Enter to select the highlighted row, so without a row highlighted
				// the reader had to press Enter twice before the form ever saw it.
				autoHighlight
				blurOnSelect
				clearOnEscape
				renderInput={renderSearchInput}
				renderOption={renderSearchOption}
			/>
		</form>
	);

	return (
		<Box component="div" sx={styles.root}>
			<AppBar position="fixed">
				<Toolbar>
					{isNarrow && searchOpen ? (
						<>
							<IconButton edge="start" onClick={closeSearch} color="inherit" aria-label="close search" size="large">
								<ArrowBackIcon />
							</IconButton>
							{searchField}
						</>
					) : (
						<>
							<IconButton edge="start" onClick={handleDrawerToggle} sx={styles.menuButton} color="inherit" aria-label="menu" size="large">
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" sx={styles.title} noWrap>
								Girls' Frontline Database
							</Typography>
							{isNarrow ? (
								<IconButton onClick={openSearch} color="inherit" aria-label="search" size="large">
									<SearchIcon />
								</IconButton>
							) : (
								<Box component="div" sx={styles.search}>
									{searchField}
								</Box>
							)}
						</>
					)}
				</Toolbar>
			</AppBar>

			{/* Takes its height from the bar itself, so the eight pages that each guessed a top margin -
			    four at 4rem and four at 5rem, against a bar that is 56, 64 or 48px - no longer have to. */}
			<Toolbar />

			{/* Drawer */}
			<Drawer style={{ width: "200px" }} anchor="left" open={drawerOpen} onClose={handleDrawerToggle} variant="temporary" slotProps={{ paper: { sx: styles.drawerPaper } }}>
				<NavList onNavigate={closeDrawer} />
			</Drawer>
			{/* End of Drawer */}
		</Box>
	);
}
