import { Fragment, memo, useCallback, useId, useMemo, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

// MaterialUI imports
import { Box, Button, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { formatBuildTime } from "../../lib/buildTime";
import { formatRelease } from "../../lib/formatRelease";
import type { DollProduction, DollProfile, SpecRow } from "../../types/tdoll";

/** Manufacturers named in full before the rest fold into "+N more". */
const MAX_MANUFACTURERS = 3;

/** Spec rows a phone shows before "Show all specs". */
const PHONE_SPEC_ROWS = 5;

/** Panel width from which the two blocks sit side by side and the spec sheet splits into two columns. Measured on the panel, not the viewport. */
const WIDE = "@container (min-width: 880px)";

const styles = {
	// The container the layout queries. The hero's info column is centred on a phone, so the lists are pulled back to the left.
	root: {
		containerType: "inline-size",
		alignSelf: "stretch",
		width: "100%",
		textAlign: "left",
		pt: 1.5
	},
	layout: {
		display: "flex",
		flexDirection: "column",
		gap: 2.5,
		[WIDE]: { flexDirection: "row", gap: 4 }
	},
	profileBlock: {
		minWidth: 0,
		[WIDE]: { flex: "0 0 290px" }
	},
	specsBlock: {
		minWidth: 0,
		flex: "1 1 0"
	},
	sectionLabel: {
		display: "block",
		mb: 0.75,
		color: "text.secondary"
	},
	profileList: {
		display: "grid",
		gridTemplateColumns: "max-content minmax(0, 1fr)",
		columnGap: 2,
		rowGap: 0.5,
		m: 0,
		typography: "body2",
		"& dt": { color: "text.secondary" },
		"& dd": { m: 0, overflowWrap: "break-word" }
	},
	// One label and value pair per row on a narrow panel, two pairs per row on a wide one.
	specList: {
		display: "grid",
		gridTemplateColumns: "max-content minmax(0, 1fr)",
		columnGap: 2,
		rowGap: 0.5,
		m: 0,
		typography: "caption",
		// A notch under the caption size, so the longest sheets still fit a 1920x1080 screen without scrolling.
		fontSize: { sm: "0.78125rem" },
		lineHeight: 1.4,
		"& dt": { color: "text.secondary", whiteSpace: "nowrap" },
		"& dd": { m: 0, color: "text.primary", overflowWrap: "break-word" },
		[WIDE]: {
			gridTemplateColumns: "max-content minmax(0, 1fr) max-content minmax(0, 1fr)",
			// Extra room before the second column's labels, so its values do not run into them.
			"& dt:nth-of-type(2n)": { pl: 1.5 }
		}
	},
	hiddenOnPhone: {
		display: { xs: "none", sm: "block" }
	},
	moreMakers: {
		color: "text.secondary",
		cursor: "help",
		whiteSpace: "nowrap",
		textDecoration: "underline dotted",
		textUnderlineOffset: "3px",
		borderRadius: 0.5,
		"&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px" }
	},
	toggle: {
		display: { xs: "inline-flex", sm: "none" },
		mt: 0.5,
		px: 0,
		minWidth: 0
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for MoreMakers. */
interface MoreMakersProps {
	/** Every manufacturer, in order. */
	names: string[];
	/** How many of `names` are already written out before this link. */
	shown: number;
}

/**
 * The "+N more" after the first manufacturers, with the full list in a tooltip.
 *
 * The tooltip is controlled so a tap opens it on click. MUI's touch path waits on a timer Chrome delays during a quick tap, so it never opened.
 * Hover and keyboard focus still open it through the tooltip's own handlers, and Enter or Space opens it too, as a button should.
 *
 * @param props Component props.
 * @returns The "+N more" text with its tooltip.
 */
function MoreMakers({ names, shown }: MoreMakersProps) {
	const [open, setOpen] = useState(false);
	const handleOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => setOpen(false), []);
	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setOpen(true);
		}
	}, []);
	const all = names.join(", ");
	const more = names.length - shown;

	return (
		<Tooltip title={all} open={open} onOpen={handleOpen} onClose={handleClose} enterTouchDelay={0} leaveTouchDelay={5000} arrow>
			<Box component="span" role="button" tabIndex={0} aria-label={`+${more} more manufacturers: ${all}`} onClick={handleOpen} onKeyDown={handleKeyDown} sx={styles.moreMakers}>
				+{more} more
			</Box>
		</Tooltip>
	);
}

/** Props for ProfilePanel. */
interface ProfilePanelProps {
	/** The doll's profile, shared by every form. */
	profile: DollProfile;
	/** The spec sheet of the form on screen. */
	specs: SpecRow[];
	/** Name of the form on screen, used as the spec heading when the profile has no full gun name. */
	name: string;
	/** The doll's build time and production pools, or null when production never gives it. */
	production: DollProduction | null;
}

/**
 * The doll's profile and its gun's spec sheet, shown in the hero under the skin pills.
 *
 * The Profile block always shows, since every doll has at least its Global release row, plus a Production row when production can give the
 * doll. The Specifications block shows when the form has a sheet.
 *
 * @param props Component props.
 * @returns The Profile block, and the Specifications block beside it when there is a sheet.
 */
export default memo(function ProfilePanel({ profile, specs, name, production }: ProfilePanelProps) {
	const [showAllSpecs, setShowAllSpecs] = useState(false);
	const specListId = useId();

	const profileRows = useMemo(() => {
		const rows: { label: string; value: ReactNode }[] = [];
		if (profile.faction.length > 0) {
			rows.push({ label: "Faction", value: profile.faction.join(", ") });
		}
		const makers = profile.manufacturer;
		if (makers.length > MAX_MANUFACTURERS) {
			rows.push({
				label: "Manufacturer",
				value: (
					<>
						{makers.slice(0, MAX_MANUFACTURERS).join(", ")} <MoreMakers names={makers} shown={MAX_MANUFACTURERS} />
					</>
				)
			});
		} else if (makers.length > 0) {
			rows.push({ label: "Manufacturer", value: makers.join(", ") });
		}
		if (profile.country.length > 0) {
			rows.push({ label: "Country", value: profile.country.join(", ") });
		}
		rows.push({ label: "Global release", value: formatRelease(profile.release) });
		if (production !== null) {
			const pools = production.standard && production.heavy ? "standard and heavy" : production.standard ? "standard" : "heavy";
			rows.push({ label: "Production", value: `${formatBuildTime(production.seconds)} (${pools})` });
		}
		return rows;
	}, [profile, production]);

	const toggleSpecs = useCallback(() => setShowAllSpecs((current) => !current), []);

	return (
		<Box sx={styles.root}>
			<Box sx={styles.layout}>
				<Box sx={styles.profileBlock}>
					<Typography variant="overline" component="h2" sx={styles.sectionLabel}>
						Profile
					</Typography>
					<Box component="dl" sx={styles.profileList}>
						{profileRows.map((row) => (
							<Fragment key={row.label}>
								<dt>{row.label}</dt>
								<dd>{row.value}</dd>
							</Fragment>
						))}
					</Box>
				</Box>

				{specs.length > 0 ? (
					<Box sx={styles.specsBlock}>
						<Typography variant="overline" component="h2" sx={styles.sectionLabel}>
							{profile.fullName ?? name} specifications
						</Typography>
						<Box component="dl" id={specListId} sx={styles.specList}>
							{specs.map((row, index) => {
								const hidden = !showAllSpecs && index >= PHONE_SPEC_ROWS ? styles.hiddenOnPhone : undefined;
								return (
									<Fragment key={`${index}-${row.label}`}>
										<Box component="dt" sx={hidden}>
											{row.label}
										</Box>
										<Box component="dd" sx={hidden}>
											{row.value}
										</Box>
									</Fragment>
								);
							})}
						</Box>
						{specs.length > PHONE_SPEC_ROWS ? (
							<Button variant="text" size="small" onClick={toggleSpecs} aria-expanded={showAllSpecs} aria-controls={specListId} sx={styles.toggle}>
								{showAllSpecs ? "Show fewer" : "Show all specs"}
							</Button>
						) : null}
					</Box>
				) : null}
			</Box>
		</Box>
	);
});
