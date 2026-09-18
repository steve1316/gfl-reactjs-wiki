import { Fragment, memo, useCallback, useState } from "react";

import { Box, Card, CardContent, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

import type { Contribution, EffectiveDoll, StatKey } from "../../lib/formation/pipeline";
import { dollName } from "./dollNames";
import { toggleInSet } from "./toggleInSet";

/** Result columns and their labels. */
const COLUMNS: readonly [StatKey, string][] = [
	["hp", "HP"],
	["dmg", "DMG"],
	["acc", "ACC"],
	["eva", "EVA"],
	["rof", "RoF"],
	["armor", "Armor"],
	["crit", "Crit %"],
	["armorPiercing", "AP"],
	["skillCd", "Skill CD %"]
];

/** Labels for breakdown sources. */
const SOURCE_LABELS: Record<Contribution["source"], string> = { links: "Dummy links", affection: "Affection", tiles: "Tiles", fairy: "Fairy", cap: "Cap" };

/**
 * The Material "expand more" chevron path. Drawn inline because importing the icon module moved it into a shared chunk and grew every page's
 * first load.
 */
const CHEVRON_PATH = "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z";

/**
 * Styles for the desktop table, matching MUI's small table and the theme's cell override. Plain table elements are used because importing MUI's
 * Table components from this lazy chunk added exports to the main chunk and grew every page's first load.
 */
const TABLE_SX: SxProps<Theme> = {
	width: "100%",
	borderCollapse: "collapse",
	typography: "body2",
	"& th, & td": { px: 2, py: "6px", textAlign: "left", borderBottom: 1, borderColor: "divider", fontVariantNumeric: "tabular-nums" },
	"& thead th": { fontWeight: "fontWeightMedium" },
	"& tbody th": { fontWeight: "inherit" },
	"& .numeric": { textAlign: "right" },
	"& .toggle": { width: 48, p: "0 0 0 4px" },
	"& tbody tr.doll:hover": { bgcolor: "action.hover" }
};

/** Hides a header label visually while keeping it for screen readers. */
const VISUALLY_HIDDEN: SxProps<Theme> = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

/** Props for Chevron. */
interface ChevronProps {
	/** Whether the breakdown is open, which flips the chevron to point up. */
	open: boolean;
}

/** Props for ResultsTable. */
interface ResultsTableProps {
	/** Computed results for the echelon. */
	results: EffectiveDoll[];
}

/**
 * The expand chevron, pointing up while the breakdown is open.
 *
 * @param props Component props.
 * @returns The icon.
 */
function Chevron({ open }: ChevronProps) {
	return (
		<svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined }}>
			<path d={CHEVRON_PATH} />
		</svg>
	);
}

/**
 * One doll's breakdown lines.
 *
 * @param doll The doll.
 * @param results The whole echelon, to name tile givers.
 * @returns Readable lines such as `DMG +12 (Tiles from M4A1 MOD)`.
 */
function breakdownLines(doll: EffectiveDoll, results: readonly EffectiveDoll[]): string[] {
	const label = (stat: StatKey) => COLUMNS.find(([key]) => key === stat)?.[1] ?? stat;
	return doll.breakdown.map((entry) => {
		const givers = entry.fromCells.map((cell) => results.find((other) => other.setup.cell === cell)).filter((other): other is EffectiveDoll => Boolean(other));
		const from = givers.length > 0 ? ` from ${givers.map((giver) => dollName(giver.setup.dollId, giver.setup.modStage)).join(", ")}` : "";
		return `${label(entry.stat)} ${entry.amount > 0 ? "+" : ""}${Math.round(entry.amount * 10) / 10} (${SOURCE_LABELS[entry.source]}${from})`;
	});
}

/**
 * Every doll's final stats, as a table on wide screens and as cards on phones, each with an expandable breakdown.
 *
 * @param props Component props.
 * @returns The results.
 */
export default memo(function ResultsTable({ results }: ResultsTableProps) {
	const theme = useTheme();
	const phone = useMediaQuery(theme.breakpoints.down("md"));
	// Keyed by doll id, so an open breakdown follows its doll when it moves to another tile.
	const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
	const toggle = useCallback((dollId: number) => setOpen((current) => toggleInSet(current, dollId)), []);

	if (results.length === 0) {
		return (
			<Typography color="text.secondary" sx={{ py: 2 }}>
				Tap or click a tile to add a T-Doll.
			</Typography>
		);
	}

	if (phone) {
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				{results.map((doll) => (
					<Card key={doll.setup.dollId}>
						<CardContent>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<Typography sx={{ fontWeight: 700, flex: 1 }}>{dollName(doll.setup.dollId, doll.setup.modStage)}</Typography>
								<IconButton
									size="small"
									aria-label={`Show breakdown for ${dollName(doll.setup.dollId, doll.setup.modStage)}`}
									aria-expanded={open.has(doll.setup.dollId)}
									onClick={() => toggle(doll.setup.dollId)}
								>
									<Chevron open={open.has(doll.setup.dollId)} />
								</IconButton>
							</Box>
							<Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5 }}>
								{COLUMNS.map(([stat, label]) => (
									<Typography key={stat} variant="body2" color="text.secondary">
										{label}{" "}
										<Box component="span" sx={{ color: "text.primary" }}>
											{doll.stats[stat]}
										</Box>
									</Typography>
								))}
							</Box>
							{open.has(doll.setup.dollId) &&
								breakdownLines(doll, results).map((line) => (
									<Typography key={line} variant="caption" sx={{ display: "block" }}>
										{line}
									</Typography>
								))}
						</CardContent>
					</Card>
				))}
			</Box>
		);
	}

	return (
		<Card>
			<Box component="table" aria-label="Echelon stats" sx={TABLE_SX}>
				<thead>
					<tr>
						<th className="toggle">
							<Box component="span" sx={VISUALLY_HIDDEN}>
								Breakdown
							</Box>
						</th>
						<th>Doll</th>
						<th>Lv / links</th>
						{COLUMNS.map(([stat, label]) => (
							<th key={stat} className="numeric">
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{results.map((doll) => (
						<Fragment key={doll.setup.dollId}>
							<tr className="doll">
								<td className="toggle">
									<IconButton
										size="small"
										aria-label={`Show breakdown for ${dollName(doll.setup.dollId, doll.setup.modStage)}`}
										aria-expanded={open.has(doll.setup.dollId)}
										onClick={() => toggle(doll.setup.dollId)}
									>
										<Chevron open={open.has(doll.setup.dollId)} />
									</IconButton>
								</td>
								<th scope="row">{dollName(doll.setup.dollId, doll.setup.modStage)}</th>
								<td>
									{doll.setup.level} / x{doll.setup.links}
								</td>
								{COLUMNS.map(([stat]) => (
									<td key={stat} className="numeric" style={doll.stats[stat] !== doll.base[stat] ? { color: theme.palette.secondary.main } : undefined}>
										{doll.stats[stat]}
										{stat === "rof" && doll.rofCapped ? "*" : ""}
									</td>
								))}
							</tr>
							{open.has(doll.setup.dollId) && (
								<tr>
									<td colSpan={COLUMNS.length + 3}>
										{breakdownLines(doll, results).map((line) => (
											<Typography key={line} variant="body2">
												{line}
											</Typography>
										))}
										{doll.breakdown.length === 0 && <Typography variant="body2">No changes from level stats.</Typography>}
									</td>
								</tr>
							)}
						</Fragment>
					))}
				</tbody>
			</Box>
		</Card>
	);
});
