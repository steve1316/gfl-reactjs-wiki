import React, { useState, useEffect } from "react";

// MaterialUI imports
import { makeStyles, Container, Typography, Divider, Chip, Grid, Card, CardActionArea, CardMedia } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// Equipment JSON import
const equipment_array = require("../../data/equipments").default;

export default function Equipment_Index() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		},
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
			maxWidth: "90%"
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
		},
		chip: {
			margin: theme.spacing(0.5)
		},
		chipList: {
			display: "flex",
			justifyContent: "center",
			listStyle: "none",
			flexWrap: "wrap",
			"& > *": {
				margin: theme.spacing(0.5)
			}
		},
		dividerForChips: {
			margin: 5
		},
		topDividerForCards: {
			marginTop: 10,
			marginBottom: 25
		},
		bottomDividerForCards: {
			marginTop: 25,
			marginBottom: 10
		}
	}));

	const classes = useStyles();

	const [typeFilter, setTypeFilter] = useState([
		{ key: 0, label: "Optical Sight", selected: false },
		{ key: 1, label: "Holographic Sight", selected: false },
		{ key: 2, label: "Red Dot Sight", selected: false },
		{ key: 3, label: "Suppressor", selected: false },
		{ key: 4, label: "Night Battle Equipment", selected: false },
		{ key: 5, label: "AP Ammo", selected: false },
		{ key: 6, label: "HP Ammo", selected: false },
		{ key: 7, label: "HV Ammo", selected: false },
		{ key: 8, label: "Buckshot Ammo", selected: false },
		{ key: 9, label: "Slug Ammo", selected: false },
		{ key: 10, label: "Exoskeleton", selected: false },
		{ key: 13, label: "Armor Plate", selected: false },
		{ key: 11, label: "Ammo Box", selected: false },
		{ key: 12, label: "Camouflage Cloak", selected: false },
		{ key: 14, label: "Chip", selected: false },
	]);

	const [currentSearchResults, setCurrentSearchResults] = useState(0)
	const [totalSearchResults, setTotalSearchResults] = useState(0)
	const [searchResults, setSearchResults] = useState([])

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index"
		document.querySelector('meta[name="description"]').setAttribute("content", "Index of sortable equipment");
	}, [])

	/* eslint-disable */
	// Update the search results every time the filters and the page selected changes.
	useEffect(() => {
		setSearchResults(renderEquipment());
	}, [typeFilter]);

	const handleDelete = () => {
		// It is blank as it needed to be set in order for the delete icon (the checkmark) to appear next to the chip.
	};

	const handleOnClickType = (selectedType) => {
		const key = selectedType.key
		const newSelected = !selectedType.selected

		setTypeFilter([
			{ key: 0, label: "Optical Sight", selected: false },
			{ key: 1, label: "Holographic Sight", selected: false },
			{ key: 2, label: "Red Dot Sight", selected: false },
			{ key: 3, label: "Suppressor", selected: false },
			{ key: 4, label: "Night Battle Equipment", selected: false },
			{ key: 5, label: "AP Ammo", selected: false },
			{ key: 6, label: "HP Ammo", selected: false },
			{ key: 7, label: "HV Ammo", selected: false },
			{ key: 8, label: "Buckshot Ammo", selected: false },
			{ key: 9, label: "Slug Ammo", selected: false },
			{ key: 10, label: "Exoskeleton", selected: false },
			{ key: 13, label: "Armor Plate", selected: false },
			{ key: 11, label: "Ammo Box", selected: false },
			{ key: 12, label: "Camouflage Cloak", selected: false },
			{ key: 14, label: "Chip", selected: false },
		])

		setTypeFilter((types) => types.map((type) => (type.key === key ? { ...type, selected: newSelected } : type)))
	}

	// Render the Cards of T-Doll equipment based on filters selected.
	const renderEquipment = () => {
		var tempArray = []
		
		// Grab the equipment categories as keys.
		var keys = Object.keys(equipment_array)

		// Go through the Search Results array and render each equipment as a Card onto the Grid.
		for(var i = 0; i < keys.length; i++){
			equipment_array[keys[i]].forEach((equipment) => {
				tempArray.push(
					<Grid item key={equipment.name} xs={6} sm={4} md={2}>
						<Card className={classes.card} elevation={12}>
							<Typography className={classes.title} color="textSecondary" gutterBottom>
								{equipment.name}
							</Typography>
	
							<CardActionArea>
								<CardMedia component="img" className={classes.cardMedia} image={equipment.image} title={equipment.name} />
							</CardActionArea>
						</Card>
					</Grid>
				)
			})
		}
			
			
			
		

		// Update number of search results.
		setCurrentSearchResults(tempArray.length)

		return tempArray
	}

	return (
		<main className={classes.root}>
			<ScrollToTop />
			<Container>
				<br />

				{/* Filters List */}
				<div className={classes.chipList}>
					{typeFilter.map((type) => {
						return (
							<li key={type.key}>
								<Chip 
									className={classes.chip}
									clickable
									color={type.selected ? "primary" : "secondary"}
									label={type.label}
									onClick={() => handleOnClickType(type)}
									onDelete={type.selected ? handleDelete : null}
									deleteIcon={
										<>
											<Divider orientation="vertical" flexItem />
											<DoneIcon />
										</>
									} 
								/>
							</li>
						)
					})}
				</div>

				<Divider className={classes.dividerForChips} />
			</Container>

			{/* Equipment List */}
			<Container className={classes.cardGrid} maxWidth="md">
				<Typography component="h1" variant="h5" color="textPrimary" gutterBottom>
					Total number of search results: {totalSearchResults}. Now showing {currentSearchResults} search results.
				</Typography>

				{/* Filtered Results */}
				<Grid container spacing={4}>
					{searchResults}
				</Grid>
			</Container>

		</main>
	);
}
