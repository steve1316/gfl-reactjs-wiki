import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// MaterialUI imports
import { Box, Container, Grid, Paper, Typography, alpha } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
import PageBackdrop from "../../components/PageBackdrop";
import LazySection from "../../components/LazySection";
import AssimilationPanel from "./AssimilationPanel";
import EnemyAnimationsPanel from "./EnemyAnimationsPanel";
import EnemyHero from "./EnemyHero";
import EnemyRanksPanel from "./EnemyRanksPanel";
import EnemyStatsPanel from "./EnemyStatsPanel";

import { enemyCardUrl, enemyFullArtUrl } from "../../lib/assets";
import { loadAssimilation, loadEnemyDetails, loadEnemySpineRigs } from "../../lib/data";
import { hasEnemyArt } from "../../lib/processData";
import { useEnemies } from "../../lib/useEnemies";
import type { AssimilationData, Enemy, EnemyDetailsData } from "../../types/enemy";
import type { SpineRig } from "../../types/spine";

const styles = {
	page: {
		pt: 2,
		pb: 3,
		// The same cap the doll page uses, so a 1920 screen gets four usable columns without letterboxing on an ultrawide.
		maxWidth: 1800,
		mx: "auto",
		// Lifts the content above the fixed backdrop, which would otherwise paint over it.
		position: "relative",
		zIndex: 1
	},
	// Translucent so the backdrop reads through the sections too, with a light blur to keep the text legible over busy art.
	section: (theme: Theme) => ({
		p: { xs: 2, md: 2.5 },
		backgroundColor: alpha(theme.palette.background.paper, 0.7),
		backdropFilter: "blur(6px)"
	}),
	// The cards sharing a row fill it to the taller one from a medium screen up.
	rowSection: {
		height: { md: "100%" },
		display: { md: "flex" },
		flexDirection: "column",
		"& > :last-child": { flexGrow: { md: 0, lg: 1 } }
	},
	sectionHeading: {
		mb: 1.5
	},
	// Stats and skills side by side inside the Combat card on a wide screen, stacked on a narrow one.
	combat: {
		display: "flex",
		flexDirection: { xs: "column", lg: "row" },
		gap: 2
	},
	// Stats is a fixed column on a wide screen, about what its ten rows need, and the skills take the rest, since their
	// descriptions are what wrap and make the row taller.
	combatPart: {
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		"& > :last-child": { flexGrow: 1 }
	},
	combatHeading: {
		mb: 1,
		fontWeight: 600
	},
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
	const [rig, setRig] = useState<SpineRig | null>(null);

	const enemyDetails = details?.[String(enemy.id)];
	// Paired so the panel only renders once both the unit and the shared chip and class data are in hand.
	const capturedUnit = assimilation === null ? null : (assimilation.units.find((entry) => entry.familyId === enemy.familyId) ?? null);
	const capturable = enemy.capturable;
	const hasSkills = enemyDetails !== undefined && enemyDetails.skills.length > 0;
	// Nothing is published yet, so both of these stay undefined: the hero shows its placeholder and the backdrop stays plain.
	const cardImage = hasEnemyArt(enemy.id, "card") ? enemyCardUrl(enemy.id) : undefined;
	const heroArtUrl = hasEnemyArt(enemy.id, "full") ? enemyFullArtUrl(enemy.id) : undefined;

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

	// The rig index is fetched on its own, so the page renders without waiting on it. A failed fetch just leaves the section out.
	useEffect(() => {
		let active = true;
		loadEnemySpineRigs(enemy.id)
			.then((entry) => active && entry?.combat && setRig(entry.combat))
			.catch(() => {});
		return () => {
			active = false;
		};
	}, [enemy.id]);

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
			<PageBackdrop artUrl={heroArtUrl} />
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				{/************** Two rows, the shape the doll page uses: a wide card beside a narrow one, so a 1080p screen shows
				                the whole page. On a phone everything stacks. **************/}
				<Grid container spacing={2}>
					{/************** The archive's entry: portrait, badges, name, lore and counter advice **************/}
					<Grid size={{ xs: 12, md: 7, lg: 8 }}>
						<EnemyHero
							name={enemy.name}
							id={enemy.id}
							code={enemy.code}
							subName={enemyDetails?.subName ?? null}
							faction={enemy.faction}
							boss={enemy.boss}
							capturable={enemy.capturable}
							organisation={enemyDetails?.organisation ?? null}
							cardImage={cardImage}
							introduce={enemyDetails?.introduce ?? ""}
							counter={enemyDetails?.counter ?? ""}
						/>
					</Grid>

					{/************** The archive's rank bars, which are how two enemies are meant to be compared **************/}
					<Grid size={{ xs: 12, md: 5, lg: 4 }}>
						<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Ranks
							</Typography>
							<EnemyRanksPanel ranks={enemy.ranks} />
						</Paper>
					</Grid>

					{/************** Stats and skills in one card. They are both what the enemy does in a fight, and apart they left
					                the skills as a mostly empty card in a row of taller ones. Full width when nothing sits beside it. **************/}
					<Grid size={capturable || rig !== null ? { xs: 12, md: 7, lg: 8 } : { xs: 12 }}>
						<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Combat
							</Typography>
							<Box sx={styles.combat}>
								<Box sx={[styles.combatPart, { flex: { lg: "0 0 320px" } }]}>
									<Typography variant="subtitle2" component="h3" color="textSecondary" sx={styles.combatHeading}>
										Stats
									</Typography>
									{enemyDetails !== undefined && <EnemyStatsPanel stats={enemyDetails.baseStats} level={enemyDetails.baseStatsLevel} />}
								</Box>
								<Box sx={[styles.combatPart, { flex: { lg: "1 1 auto" } }]}>
									<Typography variant="subtitle2" component="h3" color="textSecondary" sx={styles.combatHeading}>
										Skills
									</Typography>
									{hasSkills && enemyDetails !== undefined ? (
										<Box>
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
										</Box>
									) : (
										<Typography variant="body2" color="text.secondary">
											{enemyDetails === undefined ? "" : "The archive lists no skills of its own for this enemy."}
										</Typography>
									)}
								</Box>
							</Box>
						</Paper>
					</Grid>

					{/************** The enemy's chibi, with one pill per animation its skeleton defines **************/}
					{rig !== null ? (
						<Grid size={{ xs: 12, md: 5, lg: 4 }}>
							<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Animations
								</Typography>
								<LazySection minHeight={320}>
									<EnemyAnimationsPanel id={enemy.id} rig={rig} />
								</LazySection>
							</Paper>
						</Grid>
					) : null}

					{/************** What the enemy is like once captured, for the families Protocol Assimilation covers **************/}
					{capturable ? (
						<Grid size={{ xs: 12, md: 5, lg: 4 }}>
							<Paper sx={[styles.section, styles.rowSection]} variant="outlined">
								<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
									Protocol Assimilation
								</Typography>
								{assimilation === null || capturedUnit === null ? (
									<Typography variant="body2" color="text.secondary">
										Loading the captured unit...
									</Typography>
								) : (
									<AssimilationPanel unit={capturedUnit} data={assimilation} lore={capturedUnit.introduce === (enemyDetails?.introduce ?? "") ? "" : capturedUnit.introduce} />
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
