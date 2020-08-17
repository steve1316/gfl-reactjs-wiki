import React, { useState } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { AppBar, Toolbar, IconButton, Typography, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText, fade, makeStyles, Icon, Divider } from "@material-ui/core";

// MaterialUI icon imports
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

// Image imports
import HomeIcon from "../images/home_icon.png";
import IndexIcon from "../images/index_icon.png";
import EquipmentIcon from "../images/equipment_icon.png";
import HOCIcon from "../images/hoc_icon.png";
import FairyIcon from "../images/fairy_icon.png";
import FormationIcon from "../images/formation_icon.png";

export default function Navbar() {
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
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: "100%",
			position: "absolute",
			pointerEvents: "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		inputRoot: {
			color: "inherit"
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create("width"),
			width: "100%",
			[theme.breakpoints.up("md")]: {
				width: "20ch"
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
		}
	}));

	const classes = useStyles();

	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
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
			link: "/equipment",
			image: EquipmentIcon,
			height: 25,
			width: 25
		},
		{
			title: "HOC Index",
			link: "/hoc",
			image: HOCIcon,
			height: 25,
			width: 24 // This is 24 because of the icon getting its right side cut off if it was set to 25 width.
		},
		{
			title: "Fairy Index",
			link: "/fairy",
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
			<AppBar position="relative">
				<Toolbar>
					<IconButton edge="start" onClick={handleDrawerToggle} className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title} noWrap>
						Girls' Frontline Database
					</Typography>

					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput
							}}
							inputProps={{ "aria-label": "search" }}
						/>
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
