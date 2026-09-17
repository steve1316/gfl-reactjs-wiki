import { memo, useCallback, useMemo, useState } from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import { MAX_ECHELON } from "../../lib/formation/pipeline";
import type { DollSetup, EffectiveDoll } from "../../lib/formation/pipeline";
import { TILE_STAT_SHORT, appliesTo } from "../../lib/formation/tiles";
import type { TileSource } from "../../lib/formation/tiles";
import type { FormationData } from "../../types/formation";
import DollBrowser from "./DollBrowser";
import DollSettings from "./DollSettings";
import { dollName } from "./dollNames";
import type { FormationState } from "./useFormationState";

/** Props for DollModal. */
interface DollModalProps {
	/** Whether the dialog is open. */
	open: boolean;
	/** The cell being edited. */
	cell: number | null;
	/** Formation data. */
	data: FormationData;
	/** The echelon and its setters. */
	formation: FormationState;
	/** Computed results for the echelon. */
	results: EffectiveDoll[];
	/** Tile buffs per cell for the echelon. */
	sources: readonly (readonly TileSource[])[];
	/** Close the dialog. */
	onClose: () => void;
	/** Close the dialog and wait for the target tile of a move. */
	onStartMove: (cell: number) => void;
}

/** Props for TileBuffs. */
interface TileBuffsProps {
	/** Buffs landing on the tile. */
	sources: readonly TileSource[];
	/** Dolls on the grid, to name each buff's giver. */
	setups: readonly DollSetup[];
	/** Type id of the doll standing on the tile, or null when it is empty. */
	standingType: number | null;
}

/**
 * The tile's buffs and who gives them, the same list the stage's hover card shows. Buffs that skip the doll on the tile are dimmed.
 *
 * @param props Component props.
 * @returns The list, or nothing when the tile has no buffs.
 */
function TileBuffs({ sources, setups, standingType }: TileBuffsProps) {
	if (sources.length === 0) {
		return null;
	}
	return (
		<Box sx={{ mb: 2 }} role="group" aria-label="Buffs on this tile">
			<Typography variant="subtitle2" color="text.secondary">
				Buffs on this tile
			</Typography>
			{sources.map((source, index) => {
				const giver = setups.find((entry) => entry.cell === source.fromCell);
				const applies = standingType === null || appliesTo(source, standingType);
				return (
					<Typography key={index} variant="body2" sx={{ opacity: applies ? 1 : 0.5 }}>
						{giver ? dollName(giver.dollId, giver.modStage) : "?"}: {TILE_STAT_SHORT[source.code]} +{Math.round(source.value * 10) / 10}%{applies ? "" : " (does not apply)"}
					</Typography>
				);
			})}
		</Box>
	);
}

/**
 * The dialog a tile opens: pick a doll for an empty tile, or customize the doll already there.
 *
 * @param props Component props.
 * @returns The dialog.
 */
export default memo(function DollModal({ open, cell, data, formation, results, sources, onClose, onStartMove }: DollModalProps) {
	const { setups, placeDoll, updateDoll, removeDoll } = formation;
	const theme = useTheme();
	const phone = useMediaQuery(theme.breakpoints.down("sm"));
	const [browsing, setBrowsing] = useState(false);
	const live = useMemo(
		() => ({
			setup: setups.find((entry) => entry.cell === cell),
			result: results.find((entry) => entry.setup.cell === cell),
			buffs: cell === null ? [] : (sources[cell] ?? [])
		}),
		[setups, results, sources, cell]
	);
	// The last open view, kept while the dialog fades out so its content does not flip to the browser as it closes.
	const [lastOpen, setLastOpen] = useState(live);
	if (open && lastOpen !== live) {
		setLastOpen(live);
	}
	const { setup, result, buffs } = open ? live : lastOpen;
	const placedIds = useMemo(() => new Set(setups.filter((entry) => entry.cell !== cell).map((entry) => entry.dollId)), [setups, cell]);

	// Back to settings whenever the dialog opens on a cell. Done during render, not in an effect, so a filled tile never paints the browser first.
	const [openedCell, setOpenedCell] = useState<number | null>(null);
	const nowOpen = open ? cell : null;
	if (nowOpen !== openedCell) {
		setOpenedCell(nowOpen);
		if (nowOpen !== null) {
			setBrowsing(false);
		}
	}

	const showBrowser = !setup || browsing;

	const handlePick = useCallback(
		(dollId: number) => {
			if (cell === null) {
				return;
			}
			if (setup) {
				removeDoll(cell);
			}
			placeDoll(cell, dollId);
			setBrowsing(false);
		},
		[cell, placeDoll, removeDoll, setup]
	);

	const handleChange = useCallback(
		(patch: Partial<Omit<DollSetup, "cell" | "dollId">>) => {
			if (cell !== null) {
				updateDoll(cell, patch);
			}
		},
		[cell, updateDoll]
	);

	const handleRemove = useCallback(() => {
		if (cell !== null) {
			removeDoll(cell);
		}
		onClose();
	}, [cell, removeDoll, onClose]);

	const startBrowsing = useCallback(() => setBrowsing(true), []);

	return (
		<Dialog open={open} onClose={onClose} fullScreen={phone} fullWidth maxWidth="md" aria-labelledby="formation-doll-title">
			<DialogTitle id="formation-doll-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Box sx={{ flex: 1 }}>{showBrowser ? "Choose a T-Doll" : setup ? dollName(setup.dollId, setup.modStage) : ""}</Box>
				{setup && !showBrowser && (
					<Button size="small" variant="outlined" onClick={startBrowsing}>
						Change doll
					</Button>
				)}
				<IconButton aria-label="Close" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<TileBuffs sources={buffs} setups={setups} standingType={result?.form.type ?? null} />
				{showBrowser ? (
					<DollBrowser data={data} placedIds={placedIds} full={!setup && setups.length >= MAX_ECHELON} onPick={handlePick} />
				) : (
					setup && <DollSettings data={data} setup={setup} result={result} onChange={handleChange} />
				)}
			</DialogContent>
			{setup && (
				<DialogActions sx={{ justifyContent: "space-between" }}>
					<Box sx={{ display: "flex", gap: 1 }}>
						<Button color="error" onClick={handleRemove}>
							Remove from tile
						</Button>
						<Button onClick={() => onStartMove(setup.cell)}>Move</Button>
					</Box>
					<Button variant="contained" onClick={onClose}>
						Done
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
});
