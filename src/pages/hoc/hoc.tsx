import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MaterialUI imports
import { Box, CardMedia, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import ArtPlaceholder from "../../components/ArtPlaceholder";
import LazySection from "../../components/LazySection";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
import HocAnimationsPanel from "./HocAnimationsPanel";
import HocSkillsPanel from "./HocSkillsPanel";
import HocStatsPanel from "./HocStatsPanel";

import { HOC_CARD_ASPECT } from "../../lib/artLayout";
import { hocCardUrl, hocFullArtUrl } from "../../lib/assets";
import { formatBuildTime } from "../../lib/buildTime";
import { loadHocSpineRigs } from "../../lib/data";
import { hasHocArt } from "../../lib/processData";
import { useHocs } from "../../lib/useHocs";
import type { HocSpineEntry } from "../../types/spine";

const styles = {
	page: { pt: 2, pb: 3, maxWidth: 1200, mx: "auto" },
	section: { p: { xs: 2, md: 2.5 }, height: "100%" },
	sectionHeading: { mb: 1.5 },
	hero: { display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, md: 3 } },
	fullArt: { width: "100%", aspectRatio: "2 / 1", objectFit: "cover", borderRadius: "8px", display: "block", mb: 2 },
	art: { width: { xs: 160, sm: 220 }, aspectRatio: HOC_CARD_ASPECT, flex: "none", borderRadius: "8px", overflow: "hidden" },
	name: { fontWeight: 700 },
	facts: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 },
	infoRow: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }
} satisfies Record<string, SxProps<Theme>>;

/**
 * One HOC's page: its crew description, stats at any level and star rank, facts, skills and animations.
 *
 * @returns The HOC page, a loading state, a retry notice, or the 404 page for an unknown id.
 */
export default function HOCPage() {
	const { id: rawId } = useParams<{ id: string }>();
	const { data, loadFailed, retry } = useHocs();
	// Tagged with the HOC it belongs to, so moving to another HOC never renders the previous one's rigs against the new id.
	const [spineRigs, setSpineRigs] = useState<{ hocId: number; entry: HocSpineEntry } | undefined>();

	const hoc = data?.items.find((entry) => String(entry.id) === rawId);
	const hasFullArt = hoc !== undefined && hasHocArt(hoc.id, "full");
	// The full scene already shows the HOC, so the hero only gets the card, or a placeholder, when there is no full art.
	const heroArt =
		hoc === undefined || hasFullArt ? null : hasHocArt(hoc.id, "card") ? (
			<CardMedia component="img" image={hocCardUrl(hoc.id)} alt="" sx={styles.art} />
		) : (
			<ArtPlaceholder name={hoc.name} sx={styles.art} />
		);
	const hocId = hoc?.id;
	const spineEntry = spineRigs !== undefined && spineRigs.hocId === hocId ? spineRigs.entry : undefined;

	useEffect(() => {
		if (hoc) {
			document.title = `${hoc.name} - HOC`;
			document.querySelector('meta[name="description"]')?.setAttribute("content", `${hoc.name}, a ${hoc.className} Heavy Ordnance Corps unit`);
		}
	}, [hoc]);

	// The rig index is fetched on its own, so a HOC page renders without waiting on it. A failed fetch just leaves the section out.
	useEffect(() => {
		if (hocId === undefined) {
			return;
		}
		let active = true;
		loadHocSpineRigs(hocId)
			.then((entry) => {
				if (active && entry) {
					setSpineRigs({ hocId, entry });
				}
			})
			.catch(() => {});
		return () => {
			active = false;
		};
	}, [hocId]);

	if (loadFailed) {
		return (
			<Container component="main" sx={styles.page}>
				<LoadError what="this HOC" onRetry={retry} titleComponent="h1" />
			</Container>
		);
	}
	if (data === null) {
		return <Box component="main" />;
	}
	if (hoc === undefined) {
		return <NotFound404 message={`There is no HOC with the id ${rawId ?? ""}.`} />;
	}

	return (
		<main>
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				<Grid container spacing={2}>
					{/* Art, name, class and the crew description */}
					<Grid size={12}>
						<Paper sx={styles.section} variant="outlined">
							{hasFullArt ? <CardMedia component="img" image={hocFullArtUrl(hoc.id)} alt={`${hoc.name} artwork`} sx={styles.fullArt} /> : null}
							<Box sx={styles.hero}>
								{heroArt}
								<Box sx={styles.facts}>
									<Typography component="h1" variant="h4" sx={styles.name}>
										{hoc.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										HOC #{hoc.id} · Released {hoc.released}
									</Typography>
									<Box>
										<Chip label={hoc.className} color="primary" variant="outlined" size="small" />
									</Box>
									<Typography variant="body1" color="text.secondary">
										{hoc.description}
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Stats
							</Typography>
							{/* Keyed by HOC so moving to another HOC starts again at the highest level and rank. */}
							<HocStatsPanel key={hoc.id} hoc={hoc} constants={data.constants} />
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Info
							</Typography>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Class
								</Typography>
								<Typography variant="body2">{hoc.className}</Typography>
							</Box>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Support range
								</Typography>
								<Typography variant="body2">
									{hoc.range} node{hoc.range === 1 ? "" : "s"}
								</Typography>
							</Box>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Production time
								</Typography>
								<Typography variant="body2">{formatBuildTime(hoc.productionSeconds)}</Typography>
							</Box>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Released
								</Typography>
								<Typography variant="body2">{hoc.released}</Typography>
							</Box>
						</Paper>
					</Grid>

					<Grid size={12}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Skills
							</Typography>
							<HocSkillsPanel key={hoc.id} skills={hoc.skills} />
						</Paper>
					</Grid>

					{spineEntry ? (
						<Grid size={12}>
							<Paper sx={styles.section} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Animations
								</Typography>
								{/* Mounted only once scrolled near, since the rigs cost a network round trip most readers never scroll to. */}
								<LazySection minHeight={420}>
									<HocAnimationsPanel key={hoc.id} hocId={hoc.id} entry={spineEntry} />
								</LazySection>
							</Paper>
						</Grid>
					) : null}
				</Grid>
			</Container>
		</main>
	);
}
