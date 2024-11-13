import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

// MaterialUI imports
import { Container, Typography, Divider, Grid, Zoom, Fade, Box, Slider, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import FilterChip from "../../components/FilterChip";
import EquipmentCard from "./EquipmentCard";

import { loadEquipment } from "../../lib/data";
import { matchesBuildTime, parseBuildTime } from "../../lib/buildTime";
import type { Equipment, EquipmentType } from "../../types/equipment";

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
	},
	buildTimeSearch: { mt: 2, width: { xs: "100%", sm: 260 } }
} satisfies Record<string, SxProps<Theme>>;

/**
 * The equipment index: filterable cards for every piece of equipment.
 *
 * @returns The equipment index page.
 */
export default function EquipmentIndex() {
	const [equipment, setEquipment] = useState<{ types: EquipmentType[]; items: Record<string, Equipment[]> }>({ types: [], items: {} });
	// True when the equipment file failed to load, which swaps the results for a retry notice.
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by the retry button to load the equipment again.
	const [loadAttempt, setLoadAttempt] = useState(0);

	// Keys of the equipment types whose chips are on. None selected shows every type.
	const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

	const [exclusiveFilter, setExclusiveFilter] = useState({
		key: 0,
		label: "Exclusive",
		selected: false
	});

	// What the reader has typed into the build time search.
	const [buildTimeText, setBuildTimeText] = useState("");
	// Parsed once per keystroke rather than per item, since every item in the results reads the same parsed query.
	const buildTimeQuery = useMemo(() => parseBuildTime(buildTimeText), [buildTimeText]);
	// True once the reader has typed something that does not parse as a build time, so the field can show a hint instead of filtering.
	const buildTimeInvalid = buildTimeText.trim() !== "" && buildTimeQuery === null;

	const [currentLevel, setCurrentLevel] = useState(1);

	// The cards read a deferred copy of the level, so the slider thumb keeps up with the pointer while 178 cards
	// catch up behind it, instead of every step of a drag waiting for all of them to re-render first.
	const deferredLevel = useDeferredValue(currentLevel);

	// Equipment is fetched once, on mount, rather than pulled in at module scope. A failed load is fetched again from the retry button.
	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadEquipment().then(
			(loaded) => active && setEquipment(loaded),
			() => active && setLoadFailed(true)
		);
		return () => {
			active = false;
		};
	}, [loadAttempt]);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Equipment Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of sortable equipment");
	}, []);

	// Stable handlers that toggle from the current state, so the memoised chips only re-render when their own filter changes.
	const handleOnClickType = useCallback((key?: string | number) => {
		setSelectedTypes((current) => {
			const next = new Set(current);
			const typeKey = String(key);
			if (next.has(typeKey)) {
				next.delete(typeKey);
			} else {
				next.add(typeKey);
			}
			return next;
		});
	}, []);

	const handleRetryLoad = useCallback(() => setLoadAttempt((current) => current + 1), []);

	const handleOnClickExclusive = useCallback(() => {
		setExclusiveFilter((exclusive) => ({ ...exclusive, selected: !exclusive.selected }));
	}, []);

	/**
	 * Update the build time search text as the reader types.
	 *
	 * @param event The input change event.
	 */
	const handleBuildTimeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => setBuildTimeText(event.target.value), []);

	// T-Doll equipment matching the filters. Derived rather than copied into state from an effect, which rendered
	// the whole grid twice for every filter change.
	const searchResults = useMemo((): Equipment[] => {
		const types = selectedTypes.size === 0 ? equipment.types : equipment.types.filter((type) => selectedTypes.has(type.key));
		const items = types.flatMap((type) => equipment.items[type.key] ?? []);
		const exclusiveMatches = exclusiveFilter.selected ? items.filter((item) => item.exclusive) : items;
		return buildTimeQuery ? exclusiveMatches.filter((item) => item.buildSeconds !== null && matchesBuildTime(item.buildSeconds, buildTimeQuery)) : exclusiveMatches;
	}, [selectedTypes, exclusiveFilter, equipment, buildTimeQuery]);

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
					{equipment.types.map((type) => {
						return (
							<li key={type.key}>
								<Zoom in={true} timeout={400}>
									<span>
										<FilterChip label={type.label} selected={selectedTypes.has(type.key)} value={type.key} onToggle={handleOnClickType} />
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

				<TextField
					value={buildTimeText}
					onChange={handleBuildTimeInput}
					placeholder="Build time, e.g. 0:45"
					size="small"
					error={buildTimeInvalid}
					helperText={buildTimeInvalid ? "Type a time like 0:45 or 0:45:00" : undefined}
					sx={styles.buildTimeSearch}
					slotProps={{ htmlInput: { "aria-label": "Search equipment by build time", inputMode: "numeric" } }}
				/>
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
				{loadFailed && <LoadError what="the equipment" onRetry={handleRetryLoad} />}

				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {searchResults.length} search results
				</Typography>

				<Divider sx={styles.topDividerForCards} />

				{/* Filtered Equipment Results */}
				<Grid container spacing={4}>
					{/* No fade per card: they were staggered up to a second apart, so the page took that long to look loaded. */}
					{searchResults.map((item) => (
						<Grid key={item.id} size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 2 }}>
							<EquipmentCard equipment={item} level={deferredLevel} />
						</Grid>
					))}
				</Grid>

				<Divider sx={styles.bottomDividerForCards} />
			</Container>
		</Box>
	);
}
