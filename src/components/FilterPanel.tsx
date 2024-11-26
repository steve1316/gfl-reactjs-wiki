import { memo, useCallback, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

import { Badge, Box, Button, Collapse, IconButton, InputAdornment, Paper, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

const styles = {
	root: {
		p: { xs: 1.5, sm: 2 },
		mt: 2
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 1
	},
	headerLabel: {
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		fontWeight: 700
	},
	// Name and build time searches share a row from sm up, the name taking twice the width, and stack on a phone.
	searches: {
		mt: 1.5,
		display: "grid",
		gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
		gap: 1,
		alignItems: "start"
	},
	rows: {
		display: "flex",
		flexDirection: "column",
		gap: 1,
		pt: 1
	}
} satisfies Record<string, SxProps<Theme>>;

/** Props for FilterPanel. */
interface FilterPanelProps {
	/** How many filters are currently active, shown on the header so nothing is hidden silently. */
	activeCount: number;
	/** Clears every filter at once. */
	onClear: () => void;
	/** The text in the name search. */
	nameQuery: string;
	/** Called with the new text on every keystroke, so the list filters as the reader types. */
	onNameQueryChange: (query: string) => void;
	/** The name search's accessible label, such as "Search T-Dolls by name". */
	nameLabel: string;
	/** The text in the build time search. The field is left out when this is absent, for an index with nothing to build. */
	buildTimeQuery?: string;
	/** Called with the new text on every keystroke. */
	onBuildTimeQueryChange?: (query: string) => void;
	/** True when the build time text is not a readable time, which shows a hint instead of filtering. */
	buildTimeInvalid?: boolean;
	/** A typical build time for this index, such as "3:55", used in the placeholder and the hint. */
	buildTimeExample?: string;
	/** The build time search's accessible label, such as "Search T-Dolls by build time". */
	buildTimeLabel?: string;
	/** The page's chip rows, which collapse on a phone. */
	children: ReactNode;
	/** Controls under the chip rows that stay visible on a phone while the rows are collapsed, such as a level slider. */
	footer?: ReactNode;
}

/**
 * An index's filters, rendered in the page itself: a header with Clear all, the name and optional build time searches, the page's own chip rows, and an optional footer.
 *
 * These lived behind a Filters button that opened a drawer on a phone and a popover on a desktop. Putting
 * them back in the page costs roughly 250px on a desktop and 330-370px on a phone, which is why the phone
 * starts collapsed. Whatever is active stays on screen as chips in the summary bar either way, so collapsing
 * never hides the fact that a filter is on.
 *
 * @param props Component props.
 * @returns The panel, with its chip rows always open from `sm` up and collapsible below it.
 */
export default memo(function FilterPanel({
	activeCount,
	onClear,
	nameQuery,
	onNameQueryChange,
	nameLabel,
	buildTimeQuery,
	onBuildTimeQueryChange,
	buildTimeInvalid = false,
	buildTimeExample = "",
	buildTimeLabel,
	children,
	footer
}: FilterPanelProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = useCallback(() => setExpanded((current) => !current), []);
	const clearNameQuery = useCallback(() => onNameQueryChange(""), [onNameQueryChange]);
	const handleNameInput = useCallback((event: ChangeEvent<HTMLInputElement>) => onNameQueryChange(event.target.value), [onNameQueryChange]);
	const clearBuildTimeQuery = useCallback(() => onBuildTimeQueryChange?.(""), [onBuildTimeQueryChange]);
	const handleBuildTimeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => onBuildTimeQueryChange?.(event.target.value), [onBuildTimeQueryChange]);

	// Only the phone collapses. On a wider screen the rows cost little enough to leave open.
	const open = !isMobile || expanded;

	return (
		<Paper sx={styles.root} elevation={0} variant="outlined">
			<Box sx={styles.header}>
				<Typography variant="subtitle1" sx={styles.headerLabel} component="h2">
					Filters
					{activeCount > 0 && <Badge badgeContent={activeCount} color="primary" />}
				</Typography>

				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<Button size="small" onClick={onClear} disabled={activeCount === 0}>
						Clear all
					</Button>
					{isMobile && (
						<IconButton
							onClick={toggleExpanded}
							aria-label={expanded ? "Hide filters" : "Show filters"}
							aria-expanded={expanded}
							size="small"
							sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
						>
							<ExpandMoreIcon />
						</IconButton>
					)}
				</Box>
			</Box>

			{/* Outside the collapsing rows, so a phone can search without opening the chips first. */}
			<Box sx={styles.searches}>
				<TextField
					value={nameQuery}
					onChange={handleNameInput}
					placeholder="Search by name"
					size="small"
					fullWidth
					slotProps={{
						htmlInput: { "aria-label": nameLabel },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
							endAdornment: nameQuery ? (
								<InputAdornment position="end">
									<IconButton size="small" onClick={clearNameQuery} aria-label="clear name search" edge="end">
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							) : null
						}
					}}
				/>
				{buildTimeQuery !== undefined && (
					<TextField
						value={buildTimeQuery}
						onChange={handleBuildTimeInput}
						placeholder={`Build time, e.g. ${buildTimeExample}`}
						size="small"
						fullWidth
						error={buildTimeInvalid}
						helperText={buildTimeInvalid ? `Type a time like ${buildTimeExample}, ${buildTimeExample}:00 or ${buildTimeExample.replace(":", "")}` : undefined}
						slotProps={{
							htmlInput: { "aria-label": buildTimeLabel },
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<TimerOutlinedIcon fontSize="small" />
									</InputAdornment>
								),
								endAdornment: buildTimeQuery ? (
									<InputAdornment position="end">
										<IconButton size="small" onClick={clearBuildTimeQuery} aria-label="clear build time search" edge="end">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								) : null
							}
						}}
					/>
				)}
			</Box>

			{/* Mounted either way, so toggling the breakpoint never drops the rows entirely. */}
			<Collapse in={open}>
				<Box sx={styles.rows}>{children}</Box>
			</Collapse>

			{footer}
		</Paper>
	);
});
