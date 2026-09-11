import { useEffect, useState } from "react";
import type { ChangeEvent, JSX } from "react";
import { Link } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";

// MaterialUI imports
import {
    Box,
    Container,
    Grid,
    Chip,
    Avatar,
    Divider,
    Card,
    CardActionArea,
    CardMedia,
    Typography,
    Tooltip,
    tooltipClasses,
    styled,
    Fade,
    Zoom,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import Pagination from '@mui/material/Pagination';

// MaterialUI icon imports
import DoneIcon from "@mui/icons-material/Done";

import { uiUrl } from "../../lib/assets";
import { loadAllDolls } from "../../lib/data";
import type { TDoll, TDollForm } from "../../types/tdoll";

const mod_button = uiUrl("mod.png");

/** A doll paired with the form the current filters mean we should show. */
interface IndexEntry extends TDoll {
	/** Either the base form or the Mod, depending on the Mod filter. */
	selected: TDollForm;
}

/** A pale tooltip with room for a couple of lines, used for the T-Doll cards. */
const HtmlTooltip = styled(Tooltip)(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9"
	}
}));

const styles = {
	root: {
		marginTop: "4rem"
	},
	cardGrid: (theme: Theme) => ({
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
		minWidth: "70%"
	}),
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
	chip: (theme: Theme) => ({
		margin: theme.spacing(0.5)
	}),
	chipList: (theme: Theme) => ({
		display: "flex",
		justifyContent: "center",
		listStyle: "none",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(0.5)
	}
	}),
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
} satisfies Record<string, SxProps<Theme>>;

export default function TDoll_Index() {

	const [totalSearchResults, setTotalSearchResults] = useState(0);
	const [allDolls, setAllDolls] = useState<TDoll[]>([]);
	const [searchResults, setSearchResults] = useState<JSX.Element[]>([]);
	const [searchResultPages, setSearchResultPages] = useState<IndexEntry[][]>([]);
	const [pageSelected, setPageSelected] = useState(1);

	const [rarityFilter, setRarityFilter] = useState([
		{ key: 0, label: "General", rarity: 2, selected: false },
		{ key: 1, label: "Rare", rarity: 3, selected: false },
		{ key: 2, label: "Epochal", rarity: 4, selected: false },
		{ key: 3, label: "Legendary", rarity: 5, selected: false },
		{ key: 4, label: "Extra", rarity: 1, selected: false }
	]);

	const [typeFilter, setTypeFilter] = useState([
		{ key: 0, label: "HG", selected: false },
		{ key: 1, label: "SMG", selected: false },
		{ key: 2, label: "RF", selected: false },
		{ key: 3, label: "AR", selected: false },
		{ key: 4, label: "MG", selected: false },
		{ key: 5, label: "SG", selected: false }
	]);

	const [modFilter, setModFilter] = useState({
		key: 0,
		label: "Mod",
		selected: false
	});

	const handleDelete = () => {
		// It is blank as it needed to be set in order for the delete icon (the checkmark) to appear next to the chip.
	};

	// The index renders every doll, so it is the one route that legitimately loads all shards.
	useEffect(() => {
		void loadAllDolls().then(setAllDolls);
	}, []);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "T-Doll Index"
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of filterable T-Dolls");
	}, [])

	// Checks for filters in sessionStorage. Set the number of search results to the length of the T-Doll JSON. Runs once for now.
	useEffect(() => {
		const savedFilters = sessionStorage.getItem("filters");
		if (savedFilters) {
			const temp = JSON.parse(savedFilters);
			setRarityFilter(temp.rarityFilter);
			setTypeFilter(temp.typeFilter);
			setModFilter(temp.modFilter);
		}
	}, []);

	// Update the page selected whenever the following values change.
	useEffect(() => {
		setPageSelected(1);
	}, [modFilter, rarityFilter, typeFilter, totalSearchResults]);

	/* eslint-disable */
	// Update the search results every time the filters and the page selected changes. Save the filters in sessionStorage.
	useEffect(() => {
		setSearchResults(renderTDolls());

		var tempFilters = {
			rarityFilter: rarityFilter,
			typeFilter: typeFilter,
			modFilter: modFilter
		};

		sessionStorage.setItem("filters", JSON.stringify(tempFilters));
		// allDolls is a dependency because the shards load asynchronously, so the first render has none.
	}, [modFilter, rarityFilter, typeFilter, pageSelected, allDolls]);
	/* eslint-disable */

	// The following handler functions below are setting the filters selected as active.
	const handleOnClickRarity = (rarityToBeUpdated: { key: number; selected: boolean }) => () => {
		const key = rarityToBeUpdated.key;
		const newSelected = !rarityToBeUpdated.selected;

		// Match the rarity's key with the given rarity's key and only set its selected boolean to the opposite of what it was.
		setRarityFilter((rarities) => rarities.map((rarity) => (rarity.key === key ? { ...rarity, selected: newSelected } : rarity)));
	};

	const handleOnClickType = (typeToBeUpdated: { key: number; selected: boolean }) => () => {
		const key = typeToBeUpdated.key;
		const newSelected = !typeToBeUpdated.selected;
		setTypeFilter((type) => type.map((type) => (type.key === key ? { ...type, selected: newSelected } : type)));
	};

	const handleOnClickMod = () => {
		setModFilter({
			...modFilter,
			selected: !modFilter.selected
		});
	};

	// This will update the page selected via the Pagination component.
	const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
		setPageSelected(value);
	};

	// Create and return an array of T-Dolls that match filters.
	const createSearchResults = (): IndexEntry[][] => {
		const typeSelected = typeFilter.filter((type) => type.selected).length
		const raritySelected = rarityFilter.filter((rarity) => rarity.selected).length
		const typeFilterCheck = typeSelected > 0
		const rarityFilterCheck = raritySelected > 0
		const modFilterCheck = modFilter.selected

		// Copies are returned rather than a `selected` property assigned onto the doll. The dolls come
		// from a shared cache, so mutating them here would leak the current filter into every later read.
		const tempArray: IndexEntry[] = allDolls.flatMap((data) => {
			if (!typeFilterCheck && !rarityFilterCheck && !modFilterCheck) {
				return [{ ...data, selected: data.normal }]
			}

			// Filter if T-Dolls have Mod or not.
			let selected: TDollForm
			if (modFilter.selected) {
				if (data.mod === null) {
					return []
				}
				selected = data.mod

				// If the only filter enabled is the Mod filter, return this T-Doll.
				if (!typeFilterCheck && !rarityFilterCheck) {
					return [{ ...data, selected }]
				}
			} else {
				selected = data.normal
			}

			const entry: IndexEntry[] = [{ ...data, selected }]
			const matchesType = typeFilter.some((type) => type.selected && type.label === selected.type)

			// A Mod at 6 stars is shown under the 5 star filter, since that is the rarity it upgraded from.
			const matchesRarity = rarityFilter.some(
				(rarity) => rarity.selected && (rarity.rarity === selected.rarity || (modFilterCheck && rarity.rarity === 5 && selected.rarity === 6))
			)

			if (typeSelected > 0 && raritySelected > 0) {
				return matchesType && matchesRarity ? entry : []
			}
			if (typeSelected === 0) {
				return matchesRarity ? entry : []
			}
			return matchesType ? entry : []
		});

		// Partition search results by 30 at a time (static for now).
		const tempSearchResultPages: IndexEntry[][] = [];
		for (var i = 0, j = 0; i < tempArray.length; i += 30, j++) {
			let temp: IndexEntry[] = [];
			if (i + 30 > tempArray.length) {
				temp = tempArray.slice(i, tempArray.length);
			} else {
				temp = tempArray.slice(i, i + 30);
			}

			tempSearchResultPages[j] = temp;
		}

		console.log("Page Partitions after filters: ", tempSearchResultPages);

		// Update the pages of search results and the total number of results.
		setSearchResultPages(tempSearchResultPages);
		setTotalSearchResults(tempArray.length);

		return tempSearchResultPages;
	};

	// Render the Cards of T-Dolls based on filters selected.
	const renderTDolls = () => {
		var tempArrayOfSearchResults = createSearchResults();

		const tempArray: JSX.Element[] = [];
		let stagger = 0;
		var tempPageSelected = pageSelected;

		// Makes sure to avoid the out of bounds error.
		if (tempPageSelected > tempArrayOfSearchResults.length) {
			tempPageSelected = 1;
		}

		// Go through the Search Results array from createSearchResults() and push 30 at a time until the remainder is left.
		// This is expecting that tdoll.selected has been set back in createSearchResults(). Otherwise, it will only see [Object object] and will error.
		if(tempArrayOfSearchResults.length > 0){
			(tempArrayOfSearchResults[tempPageSelected - 1] ?? []).forEach((tdoll) => {
				tempArray.push(
					<Grid key={tdoll.selected.name} size={{ xs: 4, sm: 4, md: 2 }}>
						<Fade in={true} timeout={stagger}>
							<Card sx={styles.card} elevation={12}>
								<Link
									to={{
										pathname: "/tdoll",
										search: "?id=" + tdoll.normal.id
									}}
									onClick={() => sessionStorage.setItem(String(tdoll.normal.id), JSON.stringify(tdoll))}
								>
									<HtmlTooltip
										title={
											<>
												<Typography color="inherit">
													{tdoll.selected.name}
													<small>
														<sup>[#{tdoll.normal.id}]</sup>
													</small>
												</Typography>
												<b>{tdoll.selected.rarity + "* " + tdoll.selected.type}</b>
											</>
										}
										placement="right"
									>
										<CardActionArea>
											<CardMedia component="img" sx={styles.cardMedia} image={tdoll.selected.assets.images.card} title={tdoll.selected.name} />
										</CardActionArea>
									</HtmlTooltip>
								</Link>
							</Card>
						</Fade>
					</Grid>
				);
	
				// Stagger timeout will never be more than 1 second.
				stagger += 50;
				if (stagger >= 1000) {
					stagger = 0;
				}
			});
		}

		return tempArray;
	};

	// Calculates the minimum and maximum number of filtered results for UX purposes.
	const calculateRemainingResults = () => {
		var tempPageSelected = pageSelected
		var minResult = 0
		var maxResult = 0

		if(tempPageSelected === 1){
			minResult = 1
		}
		else{
			minResult += 30
			minResult *= (pageSelected - 1)
		}

		while(tempPageSelected > 0){
			maxResult += 30
			tempPageSelected -= 1
		}

		if(maxResult > totalSearchResults){
			maxResult = totalSearchResults
		}

		return `${minResult}-${maxResult}`
	}

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />
			<Container>
				<br />

				{/* Chips List */}
				<Box component="div" sx={styles.chipList}>
					{rarityFilter.map((rarity) => {
						return (
							<li key={rarity.key}>
								<Zoom in={true} timeout={400}>
									<Chip
										sx={styles.chip}
										avatar={<Avatar>{rarity.rarity}*</Avatar>}
										clickable
										color={rarity.selected ? "primary" : "secondary"}
										label={rarity.label}
										onClick={handleOnClickRarity(rarity)}
										onDelete={rarity.selected ? handleDelete : undefined}
										deleteIcon={
											<>
												<Divider orientation="vertical" flexItem />
												<DoneIcon />
											</>
										}
									/>
								</Zoom>
							</li>
						);
					})}
				</Box>

				<Divider sx={styles.dividerForChips} />

				<Box component="div" sx={styles.chipList}>
					{typeFilter.map((type) => {
						return (
							<li key={type.key}>
								<Zoom in={true} timeout={600}>
									<Chip
										sx={styles.chip}
										avatar={<Avatar style={{ width: 30 }}>{type.label}</Avatar>}
										clickable
										color={type.selected ? "primary" : "secondary"}
										label={type.label}
										onClick={handleOnClickType(type)}
										onDelete={type.selected ? handleDelete : undefined}
										deleteIcon={
											<>
												<Divider orientation="vertical" flexItem />
												<DoneIcon />
											</>
										}
									/>
								</Zoom>
							</li>
						);
					})}
				</Box>

				<Divider sx={styles.dividerForChips} />

				<Box component="div" sx={styles.chipList}>
					<Zoom in={true} timeout={800}>
						<Chip
							sx={styles.chip}
							avatar={
								<Avatar>
									<img src={mod_button} alt="Mod" style={{ width: 20, height: 20 }} />
								</Avatar>
							}
							clickable
							color={modFilter.selected ? "primary" : "secondary"}
							label={modFilter.label}
							onClick={() => handleOnClickMod()}
							onDelete={modFilter.selected ? handleDelete : undefined}
							deleteIcon={
								<>
									<Divider orientation="vertical" flexItem />
									<DoneIcon />
								</>
							}
						/>
					</Zoom>
				</Box>

				{/* End of Chips List */}
			</Container>

			{/* T-Dolls List */}
			<Container sx={styles.cardGrid} maxWidth="md">
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {calculateRemainingResults()} of {totalSearchResults}
				</Typography>

				{/* Pagination Component */}
				<Pagination count={searchResultPages.length} color="primary" page={pageSelected} onChange={handlePageChange} showFirstButton showLastButton size="large" />

				<Divider sx={styles.topDividerForCards} />

				{/* Search Results */}
				<Grid container spacing={4}>
					{searchResults}
				</Grid>

				<Divider sx={styles.bottomDividerForCards} />

				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {calculateRemainingResults()} of {totalSearchResults}
				</Typography>

				{/* Pagination Component */}
				<Pagination count={searchResultPages.length} color="primary" page={pageSelected} onChange={handlePageChange} showFirstButton showLastButton size="large" />

				{/* End of Search Results */}
			</Container>

			{/* End of T-Dolls List */}
		</Box>
	);
}
