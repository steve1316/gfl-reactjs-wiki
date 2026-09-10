import { useState } from "react";
import type { FormEvent } from "react";
import { Link, withRouter } from "react-router-dom";
import type { RouteComponentProps } from "react-router-dom";

// MaterialUI imports
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, fade, makeStyles, Icon, Divider, TextField } from "@material-ui/core";

// Autocomplete imports
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

// MaterialUI icon imports
import MenuIcon from "@material-ui/icons/Menu";

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

function Navbar(props: RouteComponentProps) {
	const useStyles = makeStyles((theme) => ({
		root: {
			flexGrow: 1
		},
		menuButton: {
			marginRight: theme.spacing(2)
		},
		title: {
			display: "none",
			flexGrow: 1,
			[theme.breakpoints.up("sm")]: {
				display: "block"
			}
		},
		search: {
			position: "relative",
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			"&:hover": {
				backgroundColor: fade(theme.palette.common.white, 0.25)
			},
			marginRight: theme.spacing(2),
			marginLeft: 0,
			width: "100%",
			[theme.breakpoints.up("sm")]: {
				marginLeft: theme.spacing(3),
				width: "auto"
			}
		},
		drawerPaper: {
			width: "inherit"
		},
		link: {
			textDecoration: "none",
			color: theme.palette.text.primary
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: "#fff",
			marginTop: "4rem",
			backdropFilter: "blur(5px)"
		}
	}));

	const classes = useStyles();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [hasError, setHasError] = useState(false);

	// Controls opening and closing the Drawer.
	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	// This handleSubmit will take care of sending the user to the T-Doll page alongside its information.
	// Look the typed name up in the search index and navigate to that doll's route.
	const handleSubmit = (event?: FormEvent) => {
		event?.preventDefault();
		const selected = options.find((option) => option.name === searchValue);
		if (!selected) {
			console.log("did not find match");
			setHasError(true);
			return;
		}
		setHasError(false);
		props.history.push(`/tdoll/${selected.id}`);
	};

	const listItems = [
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

	return (
		<div className={classes.root}>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton edge="start" onClick={handleDrawerToggle} className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title} noWrap>
						Girls' Frontline Database
					</Typography>

					{/* Search Bar with Autocomplete */}
					<div className={classes.search}>
						<form onSubmit={handleSubmit}>
							<Autocomplete
								options={options}
								groupBy={(option) => option.firstLetter}
								getOptionLabel={(option) => option.name}
								size="small"
								style={{ minWidth: 300, width: "auto" }}
								inputValue={searchValue}
								onInputChange={(_event, newInputValue) => {
									setSearchValue(newInputValue);
								}}
								clearOnEscape
								renderInput={(params) => <TextField {...params} color="secondary" label={hasError ? "Does not match any T-Doll" : "Search..."} value={searchValue} variant="outlined" />}
								renderOption={(option, { inputValue }) => {
									const matches = match(option.name, inputValue);
									const parts = parse(option.name, matches);

									return (
										<div>
											{parts.map((part, index) => (
												<span key={index} style={{ fontWeight: part.highlight ? 1000 : 400 }}>
													{part.text}
												</span>
											))}
										</div>
									);
								}}
							/>
						</form>
					</div>
					{/* End of Search Bar with Autocomplete */}
				</Toolbar>
			</AppBar>

			{/* Drawer */}
			<Drawer style={{ width: "200px" }} anchor="left" open={drawerOpen} onClose={handleDrawerToggle} variant="temporary" classes={{ paper: classes.drawerPaper }}>
				<List>
					{listItems.map((item) => {
						return (
							<div key={item.title}>
								<Link to={item.link} className={classes.link}>
									<ListItem button>
										<ListItemIcon>
											<Icon>
												<img src={item.image} height={item.height} width={item.width} alt={item.title} />
											</Icon>
										</ListItemIcon>
										<ListItemText primary={item.title} />
									</ListItem>
								</Link>
								<Divider />
							</div>
						);
					})}
				</List>
			</Drawer>
			{/* End of Drawer */}
		</div>
	);
}

export default withRouter(Navbar); // Wrap Navbar in withRouter to allow access to props.history for navigation.
