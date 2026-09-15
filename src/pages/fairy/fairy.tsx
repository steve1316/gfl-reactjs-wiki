import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useParams } from "react-router-dom";

// MaterialUI imports
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { Box, Button, CardMedia, Chip, Container, Grid, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// Component imports
import ArtPlaceholder from "../../components/ArtPlaceholder";
import LoadError from "../../components/LoadError";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound404 from "../../not_found_404";
import FairySkillPanel from "./FairySkillPanel";
import FairyStatsPanel from "./FairyStatsPanel";
import FairyTalentsPopover from "./FairyTalentsPopover";

import { fairyFormUrl } from "../../lib/assets";
import { formatBuildTime } from "../../lib/buildTime";
import { FAIRY_MAX_STARS, fairyForm } from "../../lib/fairyStats";
import { hasFairyForm } from "../../lib/processData";
import { useFairies } from "../../lib/useFairies";
import type { Fairy, FairyConstants, FairyTalent } from "../../types/fairy";

const styles = {
	page: { pt: 2, pb: 3, maxWidth: 1200, mx: "auto" },
	section: { p: { xs: 2, md: 2.5 }, height: "100%" },
	sectionHeading: { mb: 1.5 },
	hero: { display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, md: 3 } },
	art: { width: { xs: 160, sm: 220 }, aspectRatio: "1 / 1", flex: "none", borderRadius: "8px", overflow: "hidden", objectFit: "contain", bgcolor: "action.hover" },
	facts: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 },
	forms: { alignSelf: "flex-start" },
	chips: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 },
	name: { fontWeight: 700 },
	infoRow: { display: "flex", justifyContent: "space-between", gap: 2, py: 0.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }
} satisfies Record<string, SxProps<Theme>>;

/**
 * The form toggle's label for a group of star ranks, such as "1-2 stars" or "5 stars".
 *
 * @param ranks The star ranks the form covers, in ascending order.
 * @returns The lowest and highest rank joined by a dash, or just the rank when the form covers only one.
 */
function formLabel(ranks: number[]): string {
	return ranks.length > 1 ? `${ranks[0]}-${ranks[ranks.length - 1]}★` : `${ranks[0]}★`;
}

/** Props for FairyDetail. */
interface FairyDetailProps {
	/** The fairy to show. */
	fairy: Fairy;
	/** The shared stat constants. */
	constants: FairyConstants;
	/** Every fairy talent, for the talents popover. */
	talents: FairyTalent[];
}

/**
 * One loaded fairy's content: hero art and form picker, talents popover, stats, info and skill.
 *
 * Owns the chosen star rank itself and is keyed by the fairy's id from `FairyPage`, so switching to a different
 * fairy remounts this component and starts back at the highest star rank instead of carrying the old one over.
 *
 * @param props Component props.
 * @returns The fairy's content.
 */
function FairyDetail({ fairy, constants, talents }: FairyDetailProps) {
	const [stars, setStars] = useState(FAIRY_MAX_STARS);
	const [talentsAnchor, setTalentsAnchor] = useState<HTMLElement | null>(null);
	const form = fairyForm(constants, stars);
	const talentsOpen = talentsAnchor !== null;

	const handleForm = useCallback(
		(_event: MouseEvent<HTMLElement>, value: number | null) => {
			if (value !== null) {
				const ranks = constants.forms[value - 1];
				if (ranks !== undefined && ranks[0] !== undefined) {
					setStars(ranks[0]);
				}
			}
		},
		[constants]
	);

	const handleOpenTalents = useCallback((event: MouseEvent<HTMLElement>) => setTalentsAnchor(event.currentTarget), []);

	const handleCloseTalents = useCallback(() => setTalentsAnchor(null), []);

	return (
		<main>
			<ScrollToTop />
			<Container sx={styles.page} maxWidth={false}>
				<Grid container spacing={2}>
					{/* Art, form picker, name, type and flavour text */}
					<Grid size={12}>
						<Paper sx={styles.section} variant="outlined">
							<Box sx={styles.hero}>
								{hasFairyForm(fairy.id, form) ? (
									<CardMedia component="img" image={fairyFormUrl(fairy.id, form)} alt="" sx={styles.art} />
								) : (
									<ArtPlaceholder name={fairy.name} sx={styles.art} />
								)}
								<Box sx={styles.facts}>
									<ToggleButtonGroup value={form} exclusive onChange={handleForm} size="small" sx={styles.forms} aria-label="Fairy form">
										{constants.forms.map((ranks, index) => (
											<ToggleButton key={index} value={index + 1} aria-label={formLabel(ranks)}>
												{formLabel(ranks)}
											</ToggleButton>
										))}
									</ToggleButtonGroup>
									<Typography component="h1" variant="h4" sx={styles.name}>
										{fairy.name}
									</Typography>
									<Box sx={styles.chips}>
										<Chip label={fairy.typeName} color="primary" variant="outlined" size="small" />
										<Button variant="outlined" size="small" startIcon={<AutoAwesomeOutlinedIcon />} onClick={handleOpenTalents} aria-haspopup="true" aria-expanded={talentsOpen}>
											Talents
										</Button>
										<FairyTalentsPopover anchorEl={talentsAnchor} open={talentsOpen} onClose={handleCloseTalents} talents={talents} specialTalentId={fairy.specialTalent} />
									</Box>
									<Typography variant="body2" color="text.secondary">
										{fairy.tagline}
									</Typography>
									<Typography variant="body1" color="text.secondary">
										{fairy.introduce}
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
							<FairyStatsPanel fairy={fairy} constants={constants} stars={stars} onStarsChange={setStars} />
						</Paper>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Info
							</Typography>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Type
								</Typography>
								<Typography variant="body2">{fairy.typeName}</Typography>
							</Box>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Production time
								</Typography>
								<Typography variant="body2">{fairy.productionSeconds === null ? "Not in production" : formatBuildTime(fairy.productionSeconds)}</Typography>
							</Box>
							<Box sx={styles.infoRow}>
								<Typography variant="body2" color="text.secondary">
									Source
								</Typography>
								<Typography variant="body2">{fairy.source}</Typography>
							</Box>
						</Paper>
					</Grid>

					<Grid size={12}>
						<Paper sx={styles.section} variant="outlined">
							<Typography variant="h6" component="h2" sx={styles.sectionHeading}>
								Skill
							</Typography>
							<FairySkillPanel skill={fairy.skill} strategy={fairy.strategy} />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</main>
	);
}

/**
 * One Fairy's page: its stats at any level and star rank, its skill, and its production info.
 *
 * @returns The Fairy page, a loading state, a retry notice, or the 404 page for an unknown id.
 */
export default function FairyPage() {
	const { id: rawId } = useParams<{ id: string }>();
	const { data, loadFailed, retry } = useFairies();

	const fairy = data?.items.find((entry) => String(entry.id) === rawId);

	useEffect(() => {
		if (fairy) {
			document.title = `${fairy.name} - Fairy`;
			document.querySelector('meta[name="description"]')?.setAttribute("content", `${fairy.name}, a ${fairy.typeName} fairy`);
		}
	}, [fairy]);

	if (loadFailed) {
		return (
			<Container component="main" sx={styles.page}>
				<LoadError what="this fairy" onRetry={retry} titleComponent="h1" />
			</Container>
		);
	}
	if (data === null) {
		return <Box component="main" />;
	}
	if (fairy === undefined) {
		return <NotFound404 message={`There is no fairy with the id ${rawId ?? ""}.`} />;
	}

	// Keyed by fairy so switching to another fairy remounts this and resets its star rank to the highest.
	return <FairyDetail key={fairy.id} fairy={fairy} constants={data.constants} talents={data.talents} />;
}
