import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MaterialUI imports
import { Alert, Box, CardMedia, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import ArtPlaceholder from "../../components/ArtPlaceholder";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
import AssimilationPanel from "./AssimilationPanel";
import EnemyRanksPanel from "./EnemyRanksPanel";
import EnemyStatsPanel from "./EnemyStatsPanel";

import { enemyCardUrl, enemyFullArtUrl } from "../../lib/assets";
import { loadAssimilation, loadEnemyDetails } from "../../lib/data";
import { hasEnemyArt } from "../../lib/processData";
import { useEnemies } from "../../lib/useEnemies";
import type { AssimilationData, Enemy, EnemyDetailsData } from "../../types/enemy";

const styles = {
	page: { pt: 2, pb: 3, maxWidth: 1200, mx: "auto" },
	section: { p: { xs: 2, md: 2.5 }, height: "100%" },
	sectionHeading: { mb: 1.5 },
	hero: { display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, md: 3 } },
	fullArt: { width: "100%", aspectRatio: "2 / 1", objectFit: "cover", borderRadius: "8px", display: "block", mb: 2 },
	art: { width: { xs: 160, sm: 220 }, aspectRatio: "1 / 1", flex: "none", borderRadius: "8px", overflow: "hidden" },
	name: { fontWeight: 700 },
	facts: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 },
	badges: { display: "flex", flexWrap: "wrap", gap: 0.75 },
	skill: { mb: 1.75, "&:last-of-type": { mb: 0 } },
	skillName: { fontWeight: 700 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for EnemyDetail. */
interface EnemyDetailProps {
	/** The enemy to show, already resolved from the route. */
	enemy: Enemy;
}

/**
 * One enemy's page once the enemy itself is known.
 *
 * Split from `EnemyPage` so nothing below here has to re-check that the enemy exists, the way the Fairy page is split.
 *
 * @param props Component props.
 * @returns The enemy's sections.
 */
function EnemyDetail({ enemy }: EnemyDetailProps) {
	const [details, setDetails] = useState<EnemyDetailsData | null>(null);
	const [assimilation, setAssimilation] = useState<AssimilationData | null>(null);

	const enemyDetails = details?.[String(enemy.id)];
	// Paired so the panel only renders once both the unit and the shared chip and class data are in hand.
	const capturedUnit = assimilation === null ? null : (assimilation.units.find((entry) => entry.familyId === enemy.familyId) ?? null);
	const hasFullArt = hasEnemyArt(enemy.id, "full");
	const capturable = enemy.capturable;
	const hasSkills = enemyDetails !== undefined && enemyDetails.skills.length > 0;
	// The Skills and Protocol Assimilation panels share a row when both are there, and take the full width when only one is.
	const panelSize = hasSkills && capturable ? 6 : 12;

	// Fetched on its own so the page renders without waiting on it. A failed fetch just leaves the lore and stats out.
	useEffect(() => {
		let active = true;
		loadEnemyDetails()
			.then((loaded) => active && setDetails(loaded))
			.catch(() => {});
		return () => {
			active = false;
		};
	}, []);

	// Only a capturable enemy pays for this file, so an ordinary enemy's page never downloads it.
	useEffect(() => {
		if (!capturable) {
			return;
		}
		let active = true;
		loadAssimilation()
			.then((loaded) => active && setAssimilation(loaded))
			.catch(() => {});
		return () => {
			active = false;
		};
	}, [capturable]);

	return (
		<main>
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				<Grid container spacing={2}>
					{/* Art, name, faction and the archive's lore */}
					<Grid size={12}>
						<Paper sx={styles.section} variant="outlined">
							{hasFullArt ? <CardMedia component="img" image={enemyFullArtUrl(enemy.id)} alt={`${enemy.name} artwork`} sx={styles.fullArt} /> : null}
							<Box sx={styles.hero}>
								{hasEnemyArt(enemy.id, "card") ? (
									<CardMedia component="img" image={enemyCardUrl(enemy.id)} alt="" sx={styles.art} />
								) : (
									<ArtPlaceholder name={enemy.name} sx={styles.art} />
								)}
								<Box sx={styles.facts}>
									<Typography component="h1" variant="h4" sx={styles.name}>
										{enemy.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{enemy.code} · Enemy #{enemy.id}
										{enemyDetails?.subName ? ` · ${enemyDetails.subName}` : ""}
									</Typography>
									<Box sx={styles.badges}>
										<Chip label={enemy.faction} color="primary" variant="outlined" size="small" />
										{enemy.boss && <Chip label="Boss" color="error" variant="outlined" size="small" />}
										{enemy.capturable && <Chip label="Capturable" color="success" variant="outlined" size="small" />}
										{enemyDetails?.organisation ? <Chip label={enemyDetails.organisation} variant="outlined" size="small" /> : null}
									</Box>
									{enemyDetails?.introduce ? (
										<Typography variant="body1" color="text.secondary">
											{enemyDetails.introduce}
										</Typography>
									) : null}
									{enemyDetails?.voiceActor ? (
										<Typography variant="body2" color="text.secondary">
											Voiced by {enemyDetails.voiceActor}
										</Typography>
									) : null}
								</Box>
							</Box>
						</Paper>
					</Grid>

					{/* The archive's own ratings */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Ranks
							</Typography>
							<EnemyRanksPanel ranks={enemy.ranks} />
						</Paper>
					</Grid>

					{/* The base unit's raw numbers */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Stats
							</Typography>
							{enemyDetails !== undefined && <EnemyStatsPanel stats={enemyDetails.baseStats} level={enemyDetails.baseStatsLevel} />}
						</Paper>
					</Grid>

					{/* How to fight it */}
					{enemyDetails?.counter ? (
						<Grid size={12}>
							<Paper sx={styles.section} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Counter
								</Typography>
								<Alert severity="info" icon={false} variant="outlined">
									{enemyDetails.counter}
								</Alert>
							</Paper>
						</Grid>
					) : null}

					{/* Its own skills */}
					{hasSkills && enemyDetails !== undefined ? (
						<Grid size={{ xs: 12, md: panelSize }}>
							<Paper sx={styles.section} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Skills
								</Typography>
								{enemyDetails.skills.map((skill) => (
									<Box key={skill.name} sx={styles.skill}>
										<Typography variant="body2" sx={styles.skillName}>
											{skill.name}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{skill.description}
										</Typography>
									</Box>
								))}
							</Paper>
						</Grid>
					) : null}

					{/* What it is like once captured */}
					{capturable ? (
						<Grid size={{ xs: 12, md: panelSize }}>
							<Paper sx={styles.section} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Protocol Assimilation
								</Typography>
								{assimilation === null || capturedUnit === null ? (
									<Typography variant="body2" color="text.secondary">
										Loading the captured unit...
									</Typography>
								) : (
									<AssimilationPanel unit={capturedUnit} data={assimilation} />
								)}
							</Paper>
						</Grid>
					) : null}
				</Grid>
			</Container>
		</main>
	);
}

/**
 * One enemy's page: the archive's lore, rank bars, base stats, skills and counter advice, plus what the enemy is like to
 * field when Protocol Assimilation can capture it.
 *
 * @returns The enemy page, a loading state, a retry notice, or the 404 page for an unknown id.
 */
export default function EnemyPage() {
	const { id: rawId } = useParams<{ id: string }>();
	const { data, loadFailed, retry } = useEnemies();

	const enemy = data?.items.find((entry) => String(entry.id) === rawId);

	useEffect(() => {
		if (enemy) {
			document.title = `${enemy.name} - Enemy`;
			document.querySelector('meta[name="description"]')?.setAttribute("content", `${enemy.name}, a ${enemy.faction} enemy in Girls' Frontline`);
		}
	}, [enemy]);

	if (loadFailed) {
		return (
			<Container component="main" sx={styles.page}>
				<LoadError what="this enemy" onRetry={retry} titleComponent="h1" />
			</Container>
		);
	}
	if (data === null) {
		return <Box component="main" />;
	}
	if (enemy === undefined) {
		return <NotFound404 message={`There is no enemy with the id ${rawId ?? ""}.`} />;
	}

	// Keyed by enemy so switching to another one remounts this and starts its detail fetches again from scratch.
	return <EnemyDetail key={enemy.id} enemy={enemy} />;
}
