import React, { useState, useEffect } from "react";

// MaterialUI imports
import { makeStyles, Container, Typography, Divider, Chip, Grid, Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core";
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
			width: 1000
		},
		cardDetails: {
			display: "flex",
			flexDirection: "column"
		},
		cardContent: {
			flex: "1 0 auto"
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
		},
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
		{ key: 11, label: "Armor Plate", selected: false },
		{ key: 12, label: "Ammo Box", selected: false },
		{ key: 13, label: "Camouflage Cloak", selected: false },
		{ key: 14, label: "Chip", selected: false },
		{ key: 15, label: "Special", selected: false },
	]);

	const [currentSearchResults, setCurrentSearchResults] = useState(0)
	const [searchResults, setSearchResults] = useState([])
	const [currentLevel, setCurrentLevel] = useState(0)

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
					<Grid item key={equipment.name + equipment.rarity} xs={12} sm={6} md={4}>
						<Card className={classes.card} elevation={12}>
							<div className={classes.cardDetails}>
								<CardContent className={classes.cardContent}>
									<Typography component="h5" variant="h5">
										{equipment.name}
									</Typography>

									<Typography variant="subtitle1" color="textSecondary">
										Equippable by {equipment.usable.map((item, index) => {
											if(index + 1 < equipment.usable.length){
												return <span key={item}>{item}, </span>
											}else {
												return <span key={item}>{item}</span>
											}
										})}
										<CardActionArea style={{height: 98, width: 128}}>
											<CardMedia style={{height: 98, width: 128}} image={equipment.image} title={equipment.name} />
										</CardActionArea>
									</Typography>

									

									<Typography variant="body2" component="p">
										<br />
										{equipment.description}
									</Typography>

									<Typography variant="subtitle1" color="textSecondary">
										{Object.keys(equipment.stats).map((key) => {
											var statName = ""
											if(key === "criticalHitRate"){
												statName = "Critical Hit Rate"
											} else if(key === "damage"){
												statName = "Damage"
											} else if(key === "accuracy"){
												statName = "Accuracy"
											} else if(key === "criticalDamage"){
												statName = "Critical Damage"
											} else if(key === "rateOfFire"){
												statName = "Rate of Fire"
											} else if(key === "evasion"){
												statName = "Evasion"
											} else if(key === "nightVision"){
												statName = "Night Vision"
											} else if(key === "boostAbilityEffectiveness"){
												statName = "Boost Ability Effectiveness"
											} else if(key === "armorPiercing"){
												statName = "Armor Piercing"
											} else if(key === "target"){
												statName = "Target"
											} else if(key === "clipSize"){
												statName = "Clip Size"
											} else if(key === "movementSpeed"){
												statName = "Movement Speed"
											} else if(key === "armor"){
												statName = "Armor"
											}

											return(
												<div key={statName}>
													<p>{statName}: {equipment.stats[key][currentLevel]}</p>
												</div>
											)
										})}
									</Typography>

								</CardContent>
							</div>
							
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
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {currentSearchResults} search results
				</Typography>

				<Divider className={classes.topDividerForCards} />

				{/* Filtered Results */}
				<Grid container spacing={4}>
					{searchResults}
				</Grid>

				<Divider className={classes.bottomDividerForCards} />
			</Container>

		</main>
	);
}
