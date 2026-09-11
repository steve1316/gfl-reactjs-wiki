import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import FilterSheet from "../../components/FilterSheet";
import { RarityLabel, TypeBadge } from "../../components/DollBadges";

// Library imports
import { cardArtSx } from "../../lib/artLayout";

// MaterialUI imports
import { Box, Container, Grid, Chip, Divider, Card, CardActionArea, CardMedia, Typography, Tooltip, tooltipClasses, styled, Fade, Button } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import FilterListIcon from "@mui/icons-material/FilterList";

import { loadAllDolls } from "../../lib/data";
import type { TDoll, TDollForm } from "../../types/tdoll";

/** How many dolls one page of results holds. */
const PAGE_SIZE = 30;

/** A doll paired with the form the current filters mean we should show. */
interface IndexEntry extends TDoll {
	/** Either the base form or the Mod, depending on the Mod filter. */
	selected: TDollForm;
}

/**
 * A tooltip with room for a couple of lines, used on the T-Doll cards.
 *
 * Colour and border now come from the theme's own `MuiTooltip` defaults, so only the width is left
 * to say here. It used to hardcode a pale background that stayed light in every mode.
 */
const HtmlTooltip = styled(Tooltip)({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 220
	}
});

const styles = {
	root: { py: 3 },
	summaryContainer: { pt: 2 },
	summaryRow: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 1
	},
	summaryActions: {
		display: "flex",
		alignItems: "center",
		gap: 1.5
	},
	activeChipList: {
		display: "flex",
		flexWrap: "wrap",
		gap: 0.5,
		mt: 1
	},
	cardGrid: {
		pt: 4,
		pb: 8,
		minWidth: "70%"
	},
	card: {
		display: "flex",
		flexDirection: "column",
		maxWidth: 200,
		maxHeight: 500
	},
	cardMedia: cardArtSx,
	topDividerForCards: {
		marginTop: "10px",
		marginBottom: "25px"
	},
	bottomDividerForCards: {
		marginTop: "25px",
		marginBottom: "10px"
	}
} satisfies Record<string, SxProps<Theme>>;

export default function TDoll_Index() {
	const [allDolls, setAllDolls] = useState<TDoll[]>([]);

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

	/** How many results are on screen. Raised by the load-more button rather than by paging. */
	const [shown, setShown] = useState(PAGE_SIZE);

	/** Whether the filter sheet is open. */
	const [filterSheetOpen, setFilterSheetOpen] = useState(false);

	/**
	 * The dolls matching the current filters.
	 *
	 * This used to be built inside an effect that stored rendered JSX elements in state, so every filter
	 * change re-rendered the whole list twice and the element array was a second copy of the data.
	 */
	const matches = useMemo(() => {
		const typeOn = typeFilter.some((entry) => entry.selected);
		const rarityOn = rarityFilter.some((entry) => entry.selected);
		const modOn = modFilter.selected;

		return allDolls.flatMap<IndexEntry>((data) => {
			if (!typeOn && !rarityOn && !modOn) {
				return [{ ...data, selected: data.normal }];
			}
			let selected: TDollForm;
			if (modOn) {
				if (data.mod === null) {
					return [];
				}
				selected = data.mod;
				if (!typeOn && !rarityOn) {
					return [{ ...data, selected }];
				}
			} else {
				selected = data.normal;
			}
			const entry: IndexEntry[] = [{ ...data, selected }];
			const matchesType = typeFilter.some((type) => type.selected && type.label === selected.type);
			// A Mod at 6 stars is shown under the 5 star filter, since that is the rarity it upgraded from.
			const matchesRarity = rarityFilter.some((rarity) => rarity.selected && (rarity.rarity === selected.rarity || (modOn && rarity.rarity === 5 && selected.rarity === 6)));
			if (typeOn && rarityOn) {
				return matchesType && matchesRarity ? entry : [];
			}
			return (typeOn ? matchesType : matchesRarity) ? entry : [];
		});
	}, [allDolls, typeFilter, rarityFilter, modFilter]);

	// The slice of matches actually rendered, grown by PAGE_SIZE each time the load-more button is clicked.
	const visible = useMemo(() => matches.slice(0, shown), [matches, shown]);

	// The old version computed this with a loop and an off-by-one, so page 2 read "30-60" rather than
	// "31-60" and every later page was wrong by the same one.
	const rangeLabel = matches.length === 0 ? "0" : `1-${visible.length}`;

	// The index renders every doll, so it is the one route that legitimately loads all shards.
	useEffect(() => {
		void loadAllDolls().then(setAllDolls);
	}, []);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "T-Doll Index";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Index of filterable T-Dolls");
	}, []);

	// Checks for filters in sessionStorage. Runs once for now.
	useEffect(() => {
		const savedFilters = sessionStorage.getItem("filters");
		if (savedFilters) {
			const temp = JSON.parse(savedFilters);
			setRarityFilter(temp.rarityFilter);
			setTypeFilter(temp.typeFilter);
			setModFilter(temp.modFilter);
		}
	}, []);

	// Reset the visible slice and persist the filters every time they change, so a narrower filter never
	// leaves a stale, too-large slice on screen.
	useEffect(() => {
		setShown(PAGE_SIZE);

		const tempFilters = {
			rarityFilter: rarityFilter,
			typeFilter: typeFilter,
			modFilter: modFilter
		};
		sessionStorage.setItem("filters", JSON.stringify(tempFilters));
	}, [modFilter, rarityFilter, typeFilter]);

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

	// Deselects every filter at once, for the sheet's Clear all button.
	const handleClearAll = () => {
		setRarityFilter((rarities) => rarities.map((rarity) => ({ ...rarity, selected: false })));
		setTypeFilter((types) => types.map((type) => ({ ...type, selected: false })));
		setModFilter({ ...modFilter, selected: false });
	};

	// The currently active filters, flattened into one list the summary bar can render as removable chips.
	// Each entry keeps a reference to its own toggle handler so its delete button clears just that filter.
	const activeFilters = [
		...rarityFilter.filter((rarity) => rarity.selected).map((rarity) => ({ id: `rarity-${rarity.key}`, label: rarity.label, onDelete: handleOnClickRarity(rarity) })),
		...typeFilter.filter((type) => type.selected).map((type) => ({ id: `type-${type.key}`, label: type.label, onDelete: handleOnClickType(type) })),
		...(modFilter.selected ? [{ id: "mod", label: modFilter.label, onDelete: handleOnClickMod }] : [])
	];

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Summary bar */}
			<Container maxWidth="lg" sx={styles.summaryContainer}>
				<Box sx={styles.summaryRow}>
					<Typography variant="body1" color="textSecondary">
						Showing {rangeLabel} of {matches.length}
					</Typography>

					<Box sx={styles.summaryActions}>
						{activeFilters.length > 0 && (
							<Typography variant="body2" color="textSecondary">
								{activeFilters.length} filter{activeFilters.length === 1 ? "" : "s"} active
							</Typography>
						)}
						<Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterSheetOpen(true)}>
							Filters
						</Button>
					</Box>
				</Box>

				{activeFilters.length > 0 && (
					<Box sx={styles.activeChipList}>
						{activeFilters.map((filter) => (
							<Chip key={filter.id} label={filter.label} onDelete={filter.onDelete} size="small" />
						))}
					</Box>
				)}
			</Container>
			{/* End of summary bar */}

			<FilterSheet
				open={filterSheetOpen}
				onClose={() => setFilterSheetOpen(false)}
				rarityFilter={rarityFilter}
				typeFilter={typeFilter}
				modFilter={modFilter}
				onToggleRarity={handleOnClickRarity}
				onToggleType={handleOnClickType}
				onToggleMod={handleOnClickMod}
				onClear={handleClearAll}
			/>

			{/* T-Dolls List */}
			<Container sx={styles.cardGrid} maxWidth="lg">
				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {rangeLabel} of {matches.length}
				</Typography>

				<Divider sx={styles.topDividerForCards} />

				{/* Search Results */}
				<Grid container spacing={4}>
					{visible.map((tdoll, index) => (
						<Grid key={tdoll.selected.name} size={{ xs: 4, sm: 4, md: 2 }}>
							<Fade in={true} timeout={(index * 50) % 1000}>
								<Card sx={styles.card}>
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
												{/* Rarity and type used to live only in a hover tooltip, which a touch screen cannot open. */}
												<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, px: 0.75, py: 0.5 }}>
													<TypeBadge type={tdoll.selected.type} dense />
													<RarityLabel rarity={tdoll.selected.rarity} isMod={tdoll.selected === tdoll.mod} />
												</Box>
											</CardActionArea>
										</HtmlTooltip>
									</Link>
								</Card>
							</Fade>
						</Grid>
					))}
				</Grid>

				{visible.length < matches.length && (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
						<Button variant="outlined" onClick={() => setShown((current) => current + PAGE_SIZE)}>
							Load {Math.min(PAGE_SIZE, matches.length - visible.length)} more
						</Button>
					</Box>
				)}

				<Divider sx={styles.bottomDividerForCards} />

				<Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
					Now showing {rangeLabel} of {matches.length}
				</Typography>

				{/* End of Search Results */}
			</Container>

			{/* End of T-Dolls List */}
		</Box>
	);
}
