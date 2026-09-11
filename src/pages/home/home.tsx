import { useEffect, useMemo } from "react";
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
	heroContent: { backgroundColor: "background.paper", pt: 8, pb: 6 },
	cardGrid: { py: 8 },
	card: { height: "100%", display: "flex", flexDirection: "column" },
	// 16:9, held open by padding because the image is a background.
	cardMedia: { paddingTop: "56.25%" },
	cardContent: { flexGrow: 1 },
	cardButton: { display: "flex", margin: "10px", justifyContent: "flex-end" }
} satisfies Record<string, SxProps<Theme>>;

/** Id ranges the T-Doll shards cover. Each range is equally likely to be picked, matching the shards' own weighting. */
const ID_RANGES: ReadonlyArray<{ min: number; max: number }> = [
	{ min: 1, max: 100 },
	{ min: 101, max: 200 },
	{ min: 201, max: 300 },
	{ min: 301, max: 320 },
	{ min: 1000, max: 1027 }
];

/** Ids with no doll behind them. MICA Team leaves gaps in the numbering, so these are skipped rather than shown as missing. */
const NOT_VALID_IDS = new Set([0, 30, 45, 67, 76, 83, 219, 246, 1000, 1011, 1012, 1013, 1014, 1015, 1016]);

/**
 * Pick a number of distinct, valid T-Doll ids at random.
 *
 * @param count How many distinct ids to return.
 * @returns Up to `count` distinct ids, each inside a real shard range and outside the invalid list.
 */
function randomDollIds(count: number): number[] {
	const ids = new Set<number>();
	while (ids.size < count) {
		const range = ID_RANGES[Math.floor(Math.random() * ID_RANGES.length)];
		if (!range) {
			break;
		}
		const id = Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
		if (!NOT_VALID_IDS.has(id)) {
			ids.add(id);
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
	var stagger = 100; // Stagger timeout for this page's animations.

	// This contains the information to be rendered into cards. The link attribute is tied to the Route in App.js.
	const cards = [
		{ title: "T-Doll Index", description: "View Index of T-Dolls along with additional information like statistics and sprite animations.", link: "/index", image: tdoll_index_logo },
		{ title: "Equipment Index", description: "View Index of Equipment available for T-Dolls.", link: "/equipment-index", image: equipment_index_logo },
		{ title: "HOC Index", description: "View Index of HOCs available.", link: "/hoc-index", image: hoc_index_logo },
		{ title: "Fairy Index", description: "View Index of Fairies available.", link: "/fairy-index", image: fairy_index_logo },
		{ title: "Formation Simulator", description: "Simulate T-Doll formations and formation effects.", link: "/formation", image: formation_logo }
	];

	// Seven ids picked once per mount, so previous and next are real history rather than fresh rolls.
	const carouselIds = useMemo(() => randomDollIds(7), []);

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
				<Box component="div" sx={styles.heroContent}>
					<Container maxWidth="md">
						<DollCarousel ids={carouselIds} />
					</Container>
				</Box>
			</Box>
			{/* End of Hero Unit */}

			{/* Cards Section for Navigation */}
			<Container sx={styles.cardGrid} maxWidth="md">
				<Grid container spacing={4}>
					{cards.map((card) => {
						stagger += 100;
						return (
							<Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
								<Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={400 + stagger}>
									<Card sx={styles.card}>
										<CardActionArea>
											<CardMedia sx={styles.cardMedia} image={card.image} title={card.title} />
										</CardActionArea>
										<CardContent sx={styles.cardContent}>
											<Typography component="h2" variant="h5" gutterBottom>
												{card.title}
											</Typography>
											<Typography color="textSecondary">{card.description}</Typography>
										</CardContent>
										<CardActions sx={styles.cardButton}>
											<Link to={card.link}>
												<Button size="small" variant="contained" color="primary">
													<ArrowForwardIcon />
												</Button>
											</Link>
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
