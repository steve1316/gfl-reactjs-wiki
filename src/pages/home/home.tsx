import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component imports
import ScrollToTop from "../../components/ScrollToTop";
import DollCarousel from "../../components/DollCarousel";

// MaterialUI imports
import { Container, Button, Grid, Card, CardMedia, CardActionArea, CardActions, CardContent, Typography, Grow, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { uiUrl } from "../../lib/assets";

const tdoll_index_logo = uiUrl("tdoll_index_logo.jpg");
const equipment_index_logo = uiUrl("equipment_index_logo.jpg");
const hoc_index_logo = uiUrl("hoc_index_logo.jpg");
const fairy_index_logo = uiUrl("fairy_index_logo.jpg");
const formation_logo = uiUrl("formation_logo.jpg");

/**
 * Styles for this page, as `sx` entries.
 *
 * These were a style hook built inside the component body, so a fresh hook was created on every
 * render. `sx` needs no hook and the values sit at module scope with the rest of the configuration.
 */
const styles = {
	root: { py: 3 },
	// Padding lives inside the carousel, so its side buttons reach the hero's top and bottom edges.
	heroContent: { backgroundColor: "background.paper" },
	cardGrid: { py: 8 },
	card: { height: "100%", display: "flex", flexDirection: "column" },
	// 16:9, held open by padding because the image is a background.
	cardMedia: { paddingTop: "56.25%" },
	cardContent: { flexGrow: 1 },
	cardButton: { display: "flex", margin: "10px", justifyContent: "flex-end" }
} satisfies Record<string, SxProps<Theme>>;

/** The section cards under the carousel. Static, so declared once here instead of rebuilt on every render. The links match the routes in App.tsx. */
const SECTION_CARDS = [
	{ title: "T-Doll Index", description: "View Index of T-Dolls along with additional information like statistics and sprite animations.", link: "/index", image: tdoll_index_logo },
	{ title: "Equipment Index", description: "View Index of Equipment available for T-Dolls.", link: "/equipment-index", image: equipment_index_logo },
	{ title: "HOC Index", description: "View Index of HOCs available.", link: "/hoc-index", image: hoc_index_logo },
	{ title: "Fairy Index", description: "View Index of Fairies available.", link: "/fairy-index", image: fairy_index_logo },
	{ title: "Formation Simulator", description: "Simulate T-Doll formations and formation effects.", link: "/formation", image: formation_logo }
];

/** Transform origin for each card's grow-in. A constant, since an inline object is a new prop every render. */
const GROW_STYLE = { transformOrigin: "0 0 0" };

/** How many dolls the carousel holds: four sets of three before it asks for a fresh pool. */
const CAROUSEL_SIZE = 12;

/** Id ranges the T-Doll shards cover. */
const ID_RANGES: ReadonlyArray<{ min: number; max: number }> = [
	{ min: 1, max: 100 },
	{ min: 101, max: 200 },
	{ min: 201, max: 300 },
	{ min: 301, max: 320 },
	{ min: 1000, max: 1027 }
];

/** Ids with no doll behind them. MICA Team leaves gaps in the numbering, so these are skipped rather than shown as missing. */
const NOT_VALID_IDS = new Set([0, 30, 45, 67, 76, 83, 219, 246, 1000, 1011, 1012, 1013, 1014, 1015, 1016]);

/** Total ids across every range, so one draw can be spread evenly over all of them. */
const ID_SPAN = ID_RANGES.reduce((total, range) => total + (range.max - range.min + 1), 0);

/**
 * Pick a number of distinct, valid T-Doll ids at random.
 *
 * The draw is uniform across every id, not across the ranges. Picking a range first and then an id
 * inside it made the 20-wide 301-320 range as likely as the 100-wide 1-100 one, so the collab dolls
 * turned up five times more often than they should have.
 *
 * @param count How many distinct ids to return.
 * @returns Up to `count` distinct ids, each inside a real shard range and outside the invalid list.
 */
function randomDollIds(count: number): number[] {
	const ids = new Set<number>();
	// The invalid list can starve a draw, so the attempt cap stops this spinning if `count` is ever raised too far.
	for (let attempts = 0; ids.size < count && attempts < count * 50; attempts += 1) {
		let offset = Math.floor(Math.random() * ID_SPAN);
		for (const range of ID_RANGES) {
			const size = range.max - range.min + 1;
			if (offset < size) {
				const id = range.min + offset;
				if (!NOT_VALID_IDS.has(id)) {
					ids.add(id);
				}
				break;
			}
			offset -= size;
		}
	}
	return [...ids];
}

/**
 * The landing page: a doll carousel and cards linking to each section.
 *
 * @returns The home page.
 */
export default function Home() {
	// Held in state rather than derived, so previous and next are real history rather than fresh rolls and
	// the shuffle button can hand the carousel a whole new set.
	const [carouselIds, setCarouselIds] = useState(() => randomDollIds(CAROUSEL_SIZE));

	// Stable, so the memoised carousel does not re-render whenever the home page does.
	const reshuffle = useCallback(() => setCarouselIds(randomDollIds(CAROUSEL_SIZE)), []);

	// Set HTML meta-data here using document API.
	useEffect(() => {
		document.title = "Girls' Frontline Database";
		document.querySelector('meta[name="description"]')?.setAttribute("content", "Database for Girls' Frontline featuring T-Dolls, equipment, Fairies and HOCs");
	}, []);

	return (
		<Box component="main" sx={styles.root}>
			<ScrollToTop />

			{/* Hero Unit */}
			<Box sx={{ boxShadow: 1 }}>
				{/* No container here: the carousel spans the hero, since each side of it is a button. */}
				<Box component="div" sx={styles.heroContent}>
					<DollCarousel ids={carouselIds} onShuffle={reshuffle} />
				</Box>
			</Box>
			{/* End of Hero Unit */}

			{/* Cards Section for Navigation */}
			<Container sx={styles.cardGrid} maxWidth="md">
				<Grid container spacing={4}>
					{SECTION_CARDS.map((card, index) => {
						// Each card grows in 100ms after the one before it. This was a counter mutated during the map.
						return (
							<Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
								<Grow in={true} style={GROW_STYLE} timeout={600 + index * 100}>
									<Card sx={styles.card}>
										{/* The artwork links to the section too. It was a button that did nothing and had no name. */}
										<CardActionArea component={Link} to={card.link} aria-label={card.title}>
											<CardMedia sx={styles.cardMedia} image={card.image} title={card.title} />
										</CardActionArea>
										<CardContent sx={styles.cardContent}>
											<Typography component="h2" variant="h5" gutterBottom>
												{card.title}
											</Typography>
											<Typography color="textSecondary">{card.description}</Typography>
										</CardContent>
										<CardActions sx={styles.cardButton}>
											{/* One link styled as a button, rather than a button nested inside a link, with a name for screen readers. */}
											<Button component={Link} to={card.link} size="small" variant="contained" color="primary" aria-label={`Open ${card.title}`}>
												<ArrowForwardIcon />
											</Button>
										</CardActions>
									</Card>
								</Grow>
							</Grid>
						);
					})}
				</Grid>
			</Container>
			{/* End of Cards Section */}
		</Box>
	);
}
