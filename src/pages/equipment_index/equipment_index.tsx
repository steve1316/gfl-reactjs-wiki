import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// MaterialUI imports
import { Container, Typography, Divider, Grid, Zoom, Fade, Box, Slider } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import FilterChip from "../../components/FilterChip";
import EquipmentCard from "./EquipmentCard";

import { loadEquipment } from "../../lib/data";
import type { Equipment } from "../../types/equipment";

/** Labels under the level slider: the ends spelled out, the steps between as bare numbers. Static, so built once here. */
const SLIDER_MARKS = Array.from({ length: 10 }, (_value, index) => ({ value: index + 1, label: index === 0 ? "Lvl 1" : index === 9 ? "Lvl 10" : String(index + 1) }));

/**
 * The slider's value as text, for its label and screen readers.
 *
 * @param value The slider value.
 * @returns The value as a string.
 */
const sliderValueText = (value: number) => `${value}`;

/** Styles for this page, as `sx` entries. Declared at module scope so they are created once rather than on every render. */
const styles = {
	root: { py: 3 },
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
		// A real ul now, so its default 40px inline padding has to go or the rows sit off centre.
		p: 0,
		m: 0,
		flexWrap: "wrap",
		"& > *": {
			m: 0.5
		}
	},
	dividerForChips: {
		margin: "5px"
	},
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
		{ key: 14, label: "Special", selected: false, property: "special" }
	]);

	const [exclusiveFilter, setExclusiveFilter] = useState({
		key: 0,
		label: "Exclusive",
		selected: false
	});

	const [currentLevel, setCurrentLevel] = useState(1);

	// The cards read a deferred copy of the level, so the slider thumb keeps up with the pointer while 178 cards
	// catch up behind it, instead of every step of a drag waiting for all of them to re-render first.
	const deferredLevel = useDeferredValue(currentLevel);

	// Equipment is fetched once, on mount, rather than pulled in at module scope.
	useEffect(() => {
		void loadEquipment().then(setEquipmentByCategory);
	}, []);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of sortable equipment");
	}, []);

	// Stable handlers that toggle from the current state, so the memoised chips only re-render when their own filter changes.
	const handleOnClickType = useCallback((key?: string | number) => {
		setTypeFilter((types) => types.map((type) => (type.key === key ? { ...type, selected: !type.selected } : type)));
	}, []);

	const handleOnClickExclusive = useCallback(() => {
		setExclusiveFilter((exclusive) => ({ ...exclusive, selected: !exclusive.selected }));
	}, []);

	// T-Doll equipment matching the filters. Derived rather than copied into state from an effect, which rendered
	// the whole grid twice for every filter change.
	const searchResults = useMemo((): Equipment[] => {
		const tempArray: Equipment[] = [];
		let typeSelected = 0;
		var exclusiveSelected = false;

		// Grab the equipment categories as keys.
		const keys = Object.keys(equipmentByCategory);

		// Check to see if filters are enabled and how many.
		typeSelected = typeFilter.filter((type) => type.selected).length;

		if (exclusiveFilter.selected === true) {
			exclusiveSelected = true;
		}

		if (typeSelected === 0) {
			for (var i = 0; i < keys.length; i++) {
				(equipmentByCategory[keys[i] ?? ""] ?? []).forEach((equipment) => {
					if (exclusiveSelected && equipment.exclusive) {
						tempArray.push(equipment);
					} else if (!exclusiveSelected) {
						tempArray.push(equipment);
					}
				});
			}
		} else {
			for (var i = 0; i < keys.length; i++) {
				typeFilter.map((type) => {
					if (type.selected && type.property === keys[i]) {
						(equipmentByCategory[keys[i] ?? ""] ?? []).forEach((equipment) => {
							if (exclusiveSelected && equipment.exclusive) {
								tempArray.push(equipment);
							} else if (!exclusiveSelected) {
								tempArray.push(equipment);
							}
						});
					}
				});
			}
		}

		return tempArray;
	}, [typeFilter, exclusiveFilter, equipmentByCategory]);

	const handleSlider = useCallback((_event: Event, newValue: number | number[]) => {
		setCurrentLevel(Array.isArray(newValue) ? (newValue[0] ?? 1) : newValue);
	}, []);

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />
			<Container>
				<br />

				{/* Filters List */}
				<Box component="ul" sx={styles.chipList}>
					{typeFilter.map((type) => {
						return (
							<li key={type.key}>
								<Zoom in={true} timeout={400}>
									<span>
										<FilterChip label={type.label} selected={type.selected} value={type.key} onToggle={handleOnClickType} />
									</span>
								</Zoom>
							</li>
						);
					})}
				</Box>

				<Divider sx={styles.dividerForChips} />

				<Box component="ul" sx={styles.chipList}>
					<li>
						<Zoom in={true} timeout={600}>
							<span>
								<FilterChip label={exclusiveFilter.label} selected={exclusiveFilter.selected} onToggle={handleOnClickExclusive} />
							</span>
						</Zoom>
					</li>
				</Box>
			</Container>

			<Box sx={{ display: "flex", width: "80%", m: "auto", marginTop: 5 }}>
				<Fade in={true} timeout={500}>
					<Slider
						aria-label="Equipment level"
						step={1}
						defaultValue={1}
						value={currentLevel}
						onChange={handleSlider}
						valueLabelDisplay="auto"
						getAriaValueText={sliderValueText}
						valueLabelFormat={sliderValueText}
						marks={SLIDER_MARKS}
						min={1}
						max={10}
					/>
				</Fade>
			</Box>

			<Container sx={styles.cardGrid} maxWidth="md">
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {searchResults.length} search results
				</Typography>

				<Divider sx={styles.topDividerForCards} />

				{/* Filtered Equipment Results */}
				<Grid container spacing={4}>
					{/* No fade per card: they were staggered up to a second apart, so the page took that long to look loaded. */}
					{searchResults.map((equipment) => (
						<Grid key={equipment.name + equipment.rarity} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}>
							<EquipmentCard equipment={equipment} level={deferredLevel} />
						</Grid>
					))}
				</Grid>

				<Divider sx={styles.bottomDividerForCards} />
			</Container>
		</Box>
	);
}
