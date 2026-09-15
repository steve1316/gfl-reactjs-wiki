import { memo, useMemo } from "react";

// MaterialUI imports
import { Box, Popover, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import type { FairyTalent } from "../../types/fairy";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration

/** The id of the popover's heading, which labels the popover. */
const HEADING_ID = "fairy-talents-heading";

/** The rolled talent groups, in display order. `rank` matches `FairyTalent.rank`. */
const TIER_GROUPS: { rank: number; label: string }[] = [
	{ rank: 1, label: "Tier I" },
	{ rank: 2, label: "Tier II" }
];

const styles = {
	paper: { p: 2, maxWidth: "min(420px, calc(100vw - 32px))", maxHeight: "min(70vh, 560px)", overflowY: "auto", borderRadius: "8px" },
	heading: { mb: 0.5 },
	intro: { mb: 1 },
	group: { mt: 2 },
	groupHeading: { mb: 0.5 },
	note: { mb: 0.5 },
	talent: { py: 1, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0, pb: 0 } },
	name: { fontWeight: 700 },
	description: { mt: 0.25 }
} satisfies Record<string, SxProps<Theme>>;

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Component

/** Props for FairyTalentsPopover. */
interface FairyTalentsPopoverProps {
	/** The element the popover opens from, or null while it is closed. */
	anchorEl: HTMLElement | null;
	/** Whether the popover is showing. */
	open: boolean;
	/** Called when the popover asks to close, on an outside click or Escape. */
	onClose: () => void;
	/** Every fairy talent, in table order. */
	talents: FairyTalent[];
	/** The id of this fairy's own Special talent, or null when it has none. */
	specialTalentId: number | null;
}

/** Props for TalentRow. */
interface TalentRowProps {
	/** The talent to show. */
	talent: FairyTalent;
}

/**
 * One talent's name and description.
 *
 * @param props Component props.
 * @returns The talent row.
 */
function TalentRow({ talent }: TalentRowProps) {
	return (
		<Box sx={styles.talent}>
			<Typography component="div" sx={styles.name}>
				{talent.name}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={styles.description}>
				{talent.description}
			</Typography>
		</Box>
	);
}

/**
 * A popover listing the talents a fairy can roll, with its own Special talent first when it has one.
 *
 * @param props Component props.
 * @returns The popover.
 */
export default memo(function FairyTalentsPopover({ anchorEl, open, onClose, talents, specialTalentId }: FairyTalentsPopoverProps) {
	const special = useMemo(() => (specialTalentId === null ? undefined : talents.find((talent) => talent.id === specialTalentId && talent.rank === 0)), [talents, specialTalentId]);
	const tiers = useMemo(() => TIER_GROUPS.map((group) => ({ ...group, talents: talents.filter((talent) => talent.rank === group.rank) })), [talents]);

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			transformOrigin={{ vertical: "top", horizontal: "left" }}
			slotProps={{ paper: { sx: styles.paper, role: "dialog", "aria-labelledby": HEADING_ID } }}
		>
			<Typography id={HEADING_ID} variant="h6" component="h2" sx={styles.heading}>
				Talents
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={styles.intro}>
				A fairy rolls one talent at random from Tier I and Tier II.
			</Typography>
			{special && (
				<Box sx={styles.group}>
					<Typography variant="subtitle1" component="h3" sx={styles.groupHeading}>
						Special
					</Typography>
					<Typography variant="caption" component="p" color="text.secondary" sx={styles.note}>
						Exclusive to this fairy. The game describes it with flavour text rather than its effect.
					</Typography>
					<TalentRow talent={special} />
				</Box>
			)}
			{tiers.map((group) => (
				<Box key={group.rank} sx={styles.group}>
					<Typography variant="subtitle1" component="h3" sx={styles.groupHeading}>
						{group.label}
					</Typography>
					{group.talents.map((talent) => (
						<TalentRow key={talent.id} talent={talent} />
					))}
				</Box>
			))}
		</Popover>
	);
});
