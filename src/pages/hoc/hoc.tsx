import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MaterialUI imports
import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import HocArtPlaceholder from "../../components/HocArtPlaceholder";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
import HocSkillsPanel from "./HocSkillsPanel";
import HocStatsPanel from "./HocStatsPanel";

import { formatBuildTime } from "../../lib/buildTime";
import { loadHocs } from "../../lib/data";
import type { HocData } from "../../types/hoc";

const styles = {
	page: { pt: 2, pb: 3, maxWidth: 1200, mx: "auto" },
	section: { p: { xs: 2, md: 2.5 }, height: "100%" },
	sectionHeading: { mb: 1.5 },
	hero: { display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, md: 3 } },
	art: { width: { xs: 160, sm: 220 }, flex: "none", borderRadius: "8px", overflow: "hidden" },
	name: { fontWeight: 700 },
	facts: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 },
	infoRow: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }
} satisfies Record<string, SxProps<Theme>>;

/**
 * One HOC's page: its crew description, stats at any level and star rank, facts and skills.
 *
 * @returns The HOC page, a loading state, a retry notice, or the 404 page for an unknown id.
 */
export default function HOCPage() {
	const { id: rawId } = useParams<{ id: string }>();
	const [data, setData] = useState<HocData | null>(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const [loadAttempt, setLoadAttempt] = useState(0);

	const hoc = data?.items.find((entry) => String(entry.id) === rawId);

	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadHocs().then(
			(loaded) => active && setData(loaded),
			() => active && setLoadFailed(true)
		);
		return () => {
			active = false;
		};
	}, [loadAttempt]);

	useEffect(() => {
		if (hoc) {
			document.title = `${hoc.name} - HOC`;
			document.querySelector('meta[name="description"]')?.setAttribute("content", `${hoc.name}, a ${hoc.className} Heavy Ordnance Corps unit`);
		}
	}, [hoc]);

	const retry = useCallback(() => setLoadAttempt((current) => current + 1), []);

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
							<Box sx={styles.hero}>
								<HocArtPlaceholder name={hoc.name} sx={styles.art} />
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
							<HocStatsPanel key={hoc.id} hoc={hoc} allHocs={data.items} constants={data.constants} />
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
				</Grid>
			</Container>
		</main>
	);
}
