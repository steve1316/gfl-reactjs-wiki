import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

// MaterialUI imports
import {
	Container,
	Typography,
	Divider,
	Grid,
	Card,
	Zoom,
	Fade,
	Box,
	CardActionArea,
	CardMedia,
	CardContent,
	CardHeader,
	Slider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import FilterChip from "../../components/FilterChip";

import { loadEquipment } from "../../lib/data";
import type { Equipment } from "../../types/equipment";

/** Styles for this page, as `sx` entries. Declared at module scope so they are created once rather than on every render. */
/**
 * Display names for the stat keys in the equipment data.
 *
 * This was a thirteen-branch if/else chain rebuilt inside the render for every stat of every card.
 * Anything missing from the map falls back to the raw key, which is at least visible rather than the
 * empty string the chain produced.
 */
const STAT_NAMES: Record<string, string> = {
	criticalHitRate: "Critical hit rate",
	damage: "Damage",
	accuracy: "Accuracy",
	criticalDamage: "Critical damage",
	rateOfFire: "Rate of fire",
	evasion: "Evasion",
	nightVision: "Night vision",
	boostAbilityEffectiveness: "Boost ability effectiveness",
	armorPiercing: "Armor piercing",
	target: "Target",
	clipSize: "Clip size",
	movementSpeed: "Movement speed",
	armor: "Armor"
};

const styles = {
	root: {
		marginTop: "5rem"
	},
	bottomDividerForCards: {
		marginTop: "25px",
		marginBottom: "10px"
	},
	cardGrid: {
		pt: 8,
		pb: 8,
		maxWidth: "90%"
	},
	chip: {
		m: 0.5
	},
	chipList: {
		display: "flex",
		justifyContent: "center",
		listStyle: "none",
		flexWrap: "wrap",
		"& > *": {
			m: 0.5
		}
	},
	dividerForChips: {
		margin: "5px"
	},
	heading: (theme: Theme) => ({
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular as number
	}),
	topDividerForCards: {
		marginTop: "10px",
		marginBottom: "25px"
	}
} satisfies Record<string, SxProps<Theme>>;


/**
 * The equipment index: filterable cards for every piece of equipment.
 *
 * @returns The equipment index page.
 */
export default function EquipmentIndex() {
	const [equipmentByCategory, setEquipmentByCategory] = useState<Record<string, Equipment[]>>({});

	const [typeFilter, setTypeFilter] = useState([
		{ key: 0, label: "Optical Sight", selected: false, property: "opticalSight" },
		{ key: 1, label: "Holographic Sight", selected: false, property: "holographicSight" },
		{ key: 2, label: "Red Dot Sight", selected: false, property: "redDotSight" },
		{ key: 3, label: "Suppressor", selected: false, property: "suppressor" },
		{ key: 4, label: "Night Battle Equipment", selected: false, property: "nightBattleEquipment" },
		{ key: 5, label: "AP Ammo", selected: false, property: "armorPiercingAmmo" },
		{ key: 6, label: "HP Ammo", selected: false, property: "hollowPointAmmo" },
		{ key: 7, label: "HV Ammo", selected: false, property: "highVelocityAmmo" },
		{ key: 8, label: "Shotgun Shells", selected: false, property: "shotgunShells" },
		{ key: 9, label: "Exoskeleton", selected: false, property: "exoskeleton" },
		{ key: 10, label: "Armor Plate", selected: false, property: "armorPlate" },
		{ key: 11, label: "Ammo Box", selected: false, property: "ammunitionBox" },
		{ key: 12, label: "Camouflage Cloak", selected: false, property: "camouflageCloak" },
		{ key: 13, label: "Chip", selected: false, property: "chip" },
		{ key: 14, label: "Special", selected: false, property: "special" },
	]);

	const [exclusiveFilter, setExclusiveFilter] = useState({
		key: 0,
		label: "Exclusive",
		selected: false
	})

	const [currentSearchResults, setCurrentSearchResults] = useState(0)
	const [searchResults, setSearchResults] = useState<Equipment[]>([])
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

	const handleChange = (panel: string) => (_event: ChangeEvent<{}>, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : "");
	};

	// Equipment is fetched once, on mount, rather than pulled in at module scope.
	useEffect(() => {
		void loadEquipment().then(setEquipmentByCategory);
	}, []);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index"
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of sortable equipment");
	}, [])

	/* eslint-disable */
	// Update the search results every time the filters and the page selected changes.
	useEffect(() => {
		setSearchResults(filterEquipment());
	}, [typeFilter, exclusiveFilter, equipmentByCategory]);

	const handleOnClickType = (selectedType: { key: number; selected: boolean }) => {
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
	const filterEquipment = (): Equipment[] => {
		const tempArray: Equipment[] = []
		let typeSelected = 0
		var exclusiveSelected = false
		
		// Grab the equipment categories as keys.
		const keys = Object.keys(equipmentByCategory)

		// Check to see if filters are enabled and how many.
		typeSelected = typeFilter.filter((type) => type.selected).length

		if(exclusiveFilter.selected === true){
			exclusiveSelected = true
		}

		if(typeSelected === 0){
			for(var i = 0; i < keys.length; i++){
				(equipmentByCategory[keys[i] ?? ""] ?? []).forEach((equipment) => {
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
						(equipmentByCategory[keys[i] ?? ""] ?? []).forEach((equipment) => {
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

	const valuetext = (value: number) => {
		return `${value}`
	}

	const handleSlider = (_event: Event, newValue: number | number[]) => {
		setCurrentLevel(Array.isArray(newValue) ? (newValue[0] ?? 1) : newValue);
	};

	const calculateTimeout = (index: number) => {
		var stagger = 0
		
		if(index === 0){
			stagger += 500
		}
		else{
			stagger += (500 * index)
		}

		if(stagger >= 2000){
			stagger = 1000
		}

		return stagger
	}

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />
			<Container>
				<br />

				{/* Filters List */}
				<Box component="div" sx={styles.chipList}>
					{typeFilter.map((type) => {
						return (
							<li key={type.key}>
								<Zoom in={true} timeout={400}>
									<span>
										<FilterChip label={type.label} selected={type.selected} onToggle={() => handleOnClickType(type)} />
									</span>
								</Zoom>
							</li>
						)
					})}
				</Box>

				<Divider sx={styles.dividerForChips} />

				<Box component="div" sx={styles.chipList}>
					<Zoom in={true} timeout={600}>
						<span>
							<FilterChip label={exclusiveFilter.label} selected={exclusiveFilter.selected} onToggle={handleOnClickExclusive} />
						</span>
					</Zoom>
				</Box>

			</Container>

			<Box sx={{ display: "flex", width: "80%", m: "auto", marginTop: 5 }}>
				<Fade in={true} timeout={500}>
					<Slider step={1} defaultValue={1} value={currentLevel} onChange={handleSlider} valueLabelDisplay="auto" getAriaValueText={valuetext} valueLabelFormat={valuetext} marks={customSliderMarks} min={1} max={10} />
				</Fade>
			</Box>

			<Container sx={styles.cardGrid} maxWidth="md">
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {currentSearchResults} search results
				</Typography>

				<Divider sx={styles.topDividerForCards} />

				{/* Filtered Equipment Results */}
				<Grid container spacing={4}>
					{searchResults.map((equipment, index) => {
						return(
							<Grid key={equipment.name + equipment.rarity} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}>
								<Fade in={true} timeout={calculateTimeout(index)}>
									<Card>
										{/* Equipment Name and what types of T-Dolls can use it */}
										<CardHeader title={equipment.name} subheader={equipment.usable.map((item, index) => {
											if(index === 0 && !equipment.exclusive){
												return <span key={item}>Equippable by {item}</span>
											}else if(index === 0 && equipment.exclusive){
												return <span key={item}>Equippable by <Box component="span" sx={{ color: "primary.main" }}><ins>{item}</ins></Box></span>
											} else if(index !== 0 && equipment.exclusive){
												return <span key={item}><Box component="span" sx={{ color: "primary.main" }}>, <ins>{item}</ins></Box></span>
											} else{
												return <span key={item}>, {item}</span>
											}
										})}/>

										{/* Equipment Image */}
										<CardActionArea>
											<CardMedia component="img" image={equipment.image} title={equipment.name} />
										</CardActionArea>
										
										{/* Equipment Stats */}
									<CardContent sx={{ maxHeight: 140, overflow: "auto", py: 0 }}>
										{Object.keys(equipment.stats).map((key) => {
											const values = equipment.stats[key] ?? [];
											const atLevel = values[currentLevel - 1];
											// Highlighted when levelling has actually moved this stat off its level-one value.
											const improved = currentLevel !== 1 && atLevel !== values[0];

											return (
												<Box
													key={key}
													sx={{
														display: "flex",
														justifyContent: "space-between",
														gap: 2,
														py: 0.9,
														borderBottom: 1,
														borderColor: "divider",
														"&:last-of-type": { borderBottom: 0 }
													}}
												>
													<Typography variant="body2" color="text.secondary">
														{STAT_NAMES[key] ?? key}
													</Typography>
													<Typography variant="body2" sx={{ fontWeight: 650, color: improved ? "primary.main" : "text.primary" }}>
														{atLevel}
													</Typography>
												</Box>
											);
										})}
									</CardContent>

										{/* Equipment Description */}
										<Accordion expanded={expanded === equipment.name + equipment.rarity} onChange={handleChange(equipment.name + equipment.rarity)}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
												<Typography sx={styles.heading}>Description</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<Typography component="p" sx={{ mb: 2 }}>{equipment.description}</Typography>
											</AccordionDetails>
										</Accordion>
									</Card>
								</Fade>
							</Grid>
						)
					})}
				</Grid>

				<Divider sx={styles.bottomDividerForCards} />
			</Container>

		</Box>
	);
}
