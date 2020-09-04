import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

// MaterialUI imports
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, fade, makeStyles, Icon, Divider, TextField } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

// MaterialUI icon imports
import MenuIcon from "@material-ui/icons/Menu";

// Image imports
import HomeIcon from "../images/home_icon.png";
import IndexIcon from "../images/index_icon.png";
import EquipmentIcon from "../images/equipment_icon.png";
import HOCIcon from "../images/hoc_icon.png";
import FairyIcon from "../images/fairy_icon.png";
import FormationIcon from "../images/formation_icon.png";

const tdolls = require("../data/tdolls_from_1_to_50");

function Navbar(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			flexGrow: 1
		},
		grow: {
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
		listIcon: {
			marginRight: -5
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: "#fff",
			marginTop: "4rem",
			backdropFilter: "blur(5px)"
		},
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8)
		},
		card: {
			display: "flex",
			flexDirection: "column",
			maxWidth: 200,
			maxHeight: 500
		},
		cardMedia: {
			height: "100%",
			width: "100%",
			objectFit: "contain" // Makes sure to keep the image contained inside the rendered Card.
		}
	}));

	const classes = useStyles();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [hasError, setHasError] = useState(false);

	// Add a firstLetter property to every tdoll for categorization in the autocomplete component.
	const options = tdolls.map((tdoll) => {
		const firstLetter = tdoll.normal.name[0].toUpperCase();
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
			...tdoll
		};
	});

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	// This handleSubmit will take care of sending the user to the T-Doll page alongside its information.
	const handleSubmit = () => {
		var check = false;
		tdolls.forEach((tdoll) => {
			// Check each T-Doll's name and match it with the search value.
			if (searchValue === tdoll.normal.name) {
				sessionStorage.clear();
				setHasError(false);
				sessionStorage.setItem(tdoll.normal.id, JSON.stringify(tdoll));

				if (props.history.location.pathname === "/tdoll") {
					// If user is already at /tdoll, send the user to a null component and then to the /tdoll page, triggering a state reload.
					// This unfortunately disables the ability to go back to the T-Doll that was previous as you will go back to the page before that, like Home or Index.
					props.history.replace("/reload");
					setTimeout(() => {
						props.history.replace({
							pathname: "/tdoll",
							search: `?id=${tdoll.normal.id}`
						});
					}, 0);
				} else {
					props.history.push({
						pathname: "/tdoll",
						search: `?id=${tdoll.normal.id}`
					});
				}

				check = true;
			}
		});

		if (!check) {
			console.log("did not find match");
			setHasError(true);
		}
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

					<div className={classes.search}>
						<form onSubmit={handleSubmit}>
							<Autocomplete
								options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
								groupBy={(option) => option.firstLetter}
								getOptionLabel={(option) => option.normal.name}
								size="small"
								style={{ minWidth: 300, width: "auto" }}
								inputValue={searchValue}
								onInputChange={(e, newInputValue) => {
									setSearchValue(newInputValue);
								}}
								clearOnEscape
								renderInput={(params) => (
									<TextField
										{...params}
										color="secondary"
										label={hasError ? "Does not match any T-Doll" : "Search..."}
										value={searchValue}
										//error={hasError ? true : false}
										//helperText={hasError ? "Does not match any T-Doll" : ""}
										variant="outlined"
									/>
								)}
								renderOption={(option, { inputValue }) => {
									const matches = match(option.normal.name, inputValue);
									const parts = parse(option.normal.name, matches);

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
				</Toolbar>
			</AppBar>

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
		</div>
	);
}

export default withRouter(Navbar);
