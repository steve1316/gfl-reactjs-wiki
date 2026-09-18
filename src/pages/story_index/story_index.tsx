import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Container, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import { loadStoryChapter, loadStoryIndex } from "../../lib/data";
import type { StoryChapter, StoryIndex } from "../../types/story";

const styles = {
	label: { minWidth: 56, fontWeight: 800, color: "secondary.main" },
	missions: { p: 0 },
	blurb: { display: "block", color: "text.secondary" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * The story index: every chapter, with its missions listed once the chapter is opened.
 *
 * A chapter's missions live in their own file, so nothing is fetched until a chapter is expanded. That keeps the first paint to the
 * small chapter list rather than every mission in the game.
 *
 * @returns The page.
 */
export default function StoryIndex() {
	const [index, setIndex] = useState<StoryIndex | null>(null);
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const [open, setOpen] = useState<number | null>(null);
	const [chapters, setChapters] = useState<Record<number, StoryChapter>>({});

	useEffect(() => {
		document.title = "Story";
	}, []);

	useEffect(() => {
		let active = true;
		setFailed(false);
		loadStoryIndex().then(
			(loaded) => active && setIndex(loaded),
			() => active && setFailed(true)
		);
		return () => {
			active = false;
		};
	}, [attempt]);

	const retry = useCallback(() => setAttempt((count) => count + 1), []);

	const toggle = useCallback(
		(id: number) => () => {
			setOpen((current) => (current === id ? null : id));
			if (chapters[id]) {
				return;
			}
			loadStoryChapter(id).then(
				(chapter) => setChapters((current) => ({ ...current, [id]: chapter })),
				() => {}
			);
		},
		[chapters]
	);

	return (
		<Box component="main" sx={{ py: 3 }}>
			<ScrollToTop />
			<Container maxWidth="md">
				<Typography component="h1" variant="h5" gutterBottom>
					Story
				</Typography>
				{failed ? (
					<LoadError what="the story index" onRetry={retry} titleComponent="h2" />
				) : !index ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
						<CircularProgress aria-label="Loading the story index" />
					</Box>
				) : (
					index.chapters.map((chapter) => {
						const loaded = chapters[chapter.id];
						return (
							<Accordion key={chapter.id} expanded={open === chapter.id} onChange={toggle(chapter.id)} disableGutters>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									<Typography sx={styles.label}>{chapter.label}</Typography>
									<Typography sx={{ flex: 1 }}>{chapter.name}</Typography>
									<Typography variant="body2" color="text.secondary">
										{chapter.missions} {chapter.missions === 1 ? "mission" : "missions"}
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={styles.missions}>
									{loaded ? (
										<List disablePadding>
											{loaded.missions.map((mission) => (
												<ListItemButton key={mission.id} component={RouterLink} to={`/story/${chapter.id}/${encodeURIComponent(mission.scripts[0] ?? "")}`}>
													<ListItemText primary={mission.title} secondary={mission.description} slotProps={{ secondary: { sx: styles.blurb, variant: "body2" } }} />
												</ListItemButton>
											))}
										</List>
									) : (
										<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
											<CircularProgress size={24} aria-label={`Loading ${chapter.name}`} />
										</Box>
									)}
								</AccordionDetails>
							</Accordion>
						);
					})
				)}
			</Container>
		</Box>
	);
}
