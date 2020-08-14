import React, { useState } from "react";
import { Link } from "react-router-dom";

// MaterialUI imports
import { AppBar, Toolbar, IconButton, Typography, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText, fade, makeStyles } from "@material-ui/core";

// MaterialUI icon imports
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import MenuBookIcon from "@material-ui/icons/MenuBook";

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
			flexGrow: 1
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
		}
	}));

	const classes = useStyles();

	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleDrawerToggle = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<div className={classes.root}>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton edge="start" onClick={handleDrawerToggle} className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
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
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary={"Home"} />
						</ListItem>
					</Link>
					<Link to="/index" className={classes.link}>
						<ListItem button>
							<ListItemIcon>
								<MenuBookIcon></MenuBookIcon>
							</ListItemIcon>
							<ListItemText primary={"T-Doll Index"} />
						</ListItem>
					</Link>
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={"Equipment Index"} />
						</ListItem>
					</Link>
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={"HOC Index"} />
						</ListItem>
					</Link>
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={"Fairy Index"} />
						</ListItem>
					</Link>
					<Link to="/" className={classes.link}>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={"Formation Simulator"} />
						</ListItem>
					</Link>
				</List>
			</Drawer>
		</div>
	);
}
