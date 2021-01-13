import React, { useState, useEffect } from "react";

// MaterialUI imports
import { makeStyles, Container, Typography, Divider, Chip, Grid, Card, Box, CardActionArea, CardMedia, CardContent, CardHeader, Slider, Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// Equipment JSON import
const equipment_array = require("../../data/equipments").default;

export default function Equipment_Index() {
	const useStyles = makeStyles((theme) => ({
		root: {
			marginTop: "5rem"
		},
		bottomDividerForCards: {
			marginTop: 25,
			marginBottom: 10
		},
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
			maxWidth: "90%"
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
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular,
		},
		topDividerForCards: {
			marginTop: 10,
			marginBottom: 25
		},
	}));

	const classes = useStyles();

	const [typeFilter, setTypeFilter] = useState([
		{ key: 0, label: "Optical Sight", selected: false, property: "opticalSight" },
		{ key: 1, label: "Holographic Sight", selected: false, property: "holographicSight" },
		{ key: 2, label: "Red Dot Sight", selected: false, property: "redDotSight" },
		{ key: 3, label: "Suppressor", selected: false, property: "suppressor" },
		{ key: 4, label: "Night Battle Equipment", selected: false, property: "nightBattleEquipment" },
		{ key: 5, label: "AP Ammo", selected: false, property: "armorPiercingAmmo" },
		{ key: 6, label: "HP Ammo", selected: false, property: "hollowPointAmmo" },
		{ key: 7, label: "HV Ammo", selected: false, property: "highVelocityAmmo" },
		{ key: 8, label: "Buckshot Ammo", selected: false, property: "buckshotAmmo" },
		{ key: 9, label: "Slug Ammo", selected: false, property: "slugAmmo" },
		{ key: 10, label: "Exoskeleton", selected: false, property: "exoskeleton" },
		{ key: 11, label: "Armor Plate", selected: false, property: "armorPlate" },
		{ key: 12, label: "Ammo Box", selected: false, property: "ammunitionBox" },
		{ key: 13, label: "Camouflage Cloak", selected: false, property: "camouflageCloak" },
		{ key: 14, label: "Chip", selected: false, property: "chip" },
		{ key: 15, label: "Special", selected: false, property: "special" },
	]);

	const [exclusiveFilter, setExclusiveFilter] = useState({
		key: 0,
		label: "Exclusive",
		selected: false
	})

	const [currentSearchResults, setCurrentSearchResults] = useState(0)
	const [searchResults, setSearchResults] = useState([])
	const [currentLevel, setCurrentLevel] = useState(1)
	const [expanded, setExpanded] = useState("")

	const customSliderMarks = [
		{
			value: 1,
			label: "Lvl 1"
		},
		{
			value: 2,
			label: "2"
		},
		{
			value: 3,
			label: "3"
		},
		{
			value: 4,
			label: "4"
		},
		{
			value: 5,
			label: "5"
		},
		{
			value: 6,
			label: "6"
		},
		{
			value: 7,
			label: "7"
		},
		{
			value: 8,
			label: "8"
		},
		{
			value: 9,
			label: "9"
		},
		{
			value: 10,
			label: "Lvl 10"
		},
	];

	const handleChange = (panel) => (e, name) => {
		setExpanded(name ? panel : false)
	}

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index"
		document.querySelector('meta[name="description"]').setAttribute("content", "Index of sortable equipment");
	}, [])

	/* eslint-disable */
	// Update the search results every time the filters and the page selected changes.
	useEffect(() => {
		setSearchResults(filterEquipment());
	}, [typeFilter, exclusiveFilter]);

	const handleDelete = () => {
		// It is blank as it needed to be set in order for the delete icon (the checkmark) to appear next to the chip.
	};

	const handleOnClickType = (selectedType) => {
		const key = selectedType.key
		const newSelected = !selectedType.selected

		setTypeFilter((types) => types.map((type) => (type.key === key ? { ...type, selected: newSelected } : type)))
	}

	const handleOnClickExclusive = () => {
		setExclusiveFilter({
			...exclusiveFilter,
			selected: !exclusiveFilter.selected
		})
	}

	// Return T-Doll equipments based on filters selected.
	const filterEquipment = () => {
		var tempArray = []
		var typeSelected = 0
		var exclusiveSelected = false
		
		// Grab the equipment categories as keys.
		var keys = Object.keys(equipment_array)

		// Check to see if filters are enabled and how many.
		for(var i = 0; i < typeFilter.length; i++){
			if(typeFilter[i].selected === true){
				typeSelected += 1
			}
		}

		if(exclusiveFilter.selected === true){
			exclusiveSelected = true
		}

		if(typeSelected === 0){
			for(var i = 0; i < keys.length; i++){
				equipment_array[keys[i]].forEach((equipment) => {
					if(exclusiveSelected && equipment.exclusive){
						tempArray.push(equipment)
					}else if(!exclusiveSelected){
						tempArray.push(equipment)
					}
				})
			}
		}else{
			for(var i = 0; i < keys.length; i++){
				typeFilter.map((type) => {
					if(type.selected && type.property === keys[i]){
						equipment_array[keys[i]].forEach((equipment) => {
							if(exclusiveSelected && equipment.exclusive){
								tempArray.push(equipment)
							}else if(!exclusiveSelected){
								tempArray.push(equipment)
							}
						})
					}
				})
			}
		}

		// Update number of search results.
		setCurrentSearchResults(tempArray.length)

		return tempArray
	}

	const valuetext = (value) => {
		return `${value}`
	}

	const handleSlider = (e, newValue) => {
		setCurrentLevel(newValue)
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

				<div className={classes.chipList}>
					<Chip
						className={classes.chip}
						clickable
						color={exclusiveFilter.selected ? "primary" : "secondary"}
						label={exclusiveFilter.label}
						onClick={() => handleOnClickExclusive()}
						onDelete={exclusiveFilter.selected ? handleDelete : null}
						deleteIcon={
							<>
								<Divider orientation="vertical" flexItem />
								<DoneIcon />
							</>
						}
					/>
				</div>

			</Container>

			<Box display="flex" width="80%" m="auto" marginTop={5}>
				<Slider step={1} defaultValue={1} value={currentLevel} onChange={handleSlider} valueLabelDisplay="auto" getAriaValueText={valuetext} valueLabelFormat={valuetext} marks={customSliderMarks} min={1} max={10} />
			</Box>

			<Container className={classes.cardGrid} maxWidth="md">
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {currentSearchResults} search results
				</Typography>

				<Divider className={classes.topDividerForCards} />

				{/* Filtered Equipment Results */}
				<Grid container spacing={4}>
					{searchResults.map((equipment) => {
						return(
							<Grid item key={equipment.name + equipment.rarity} xs={12} sm={6} md={3} lg={3} xl={2}>
								<Card className={classes.card} elevation={12}>
									{/* Equipment Name and what types of T-Dolls can use it */}
									<CardHeader title={equipment.name} subheader={equipment.usable.map((item, index) => {
										if(index === 0 && !equipment.exclusive){
											return <span key={item}>Equippable by {item}</span>
										}else if(index === 0 && equipment.exclusive){
											return <span key={item}>Equippable by <span style={{color: "#ff9800"}}><ins>{item}</ins></span></span>
										} else if(index !== 0 && equipment.exclusive){
											return <span key={item}><span style={{color: "#ff9800"}}>, <ins>{item}</ins></span></span>
										} else{
											return <span key={item}>, {item}</span>
										}
									})}/>

									{/* Equipment Image */}
									<CardActionArea>
										<CardMedia component="img" image={equipment.image.default} title={equipment.title}/>
									</CardActionArea>
									
									{/* Equipment Stats */}
									<CardContent>
										<Typography component="span" variant="body2" style={{maxHeight: 100, overflow: "auto"}}>
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

												if(currentLevel === 1){
													return(
														<div key={statName}>
															<p>{statName}: {equipment.stats[key][currentLevel - 1]}</p>
														</div>
													)
												} else if(currentLevel !== 1 && equipment.stats[key][currentLevel - 1] !== equipment.stats[key][0]){
													return(
														<div key={statName}>
															<p>{statName}: <span style={{color: "#ff9800"}}>{equipment.stats[key][currentLevel - 1]}</span></p>
														</div>
													)
												} else{
													return(
														<div key={statName}>
															<p>{statName}: {equipment.stats[key][currentLevel - 1]}</p>
														</div>
													)
												}
											})}
										</Typography>
									</CardContent>

									{/* Equipment Description */}
									<Accordion expanded={expanded === equipment.name + equipment.rarity} onChange={handleChange(equipment.name + equipment.rarity)}>
										<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
											<Typography className="classes.heading">Description</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography paragraph>{equipment.description}</Typography>
										</AccordionDetails>
									</Accordion>
								</Card>
							</Grid>
						)
					})}
				</Grid>

				<Divider className={classes.bottomDividerForCards} />
			</Container>

		</main>
	);
}
