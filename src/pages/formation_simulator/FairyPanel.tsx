import { memo, useCallback, useMemo } from "react";

import { Box, Button, Card, CardContent, FormControl, MenuItem, Select, Typography } from "@mui/material";
import type { SelectChangeEvent, SxProps, Theme } from "@mui/material";

import LevelSlider from "../../components/LevelSlider";
import StarRankPicker from "../../components/StarRankPicker";
import { FAIRY_MAX_STARS, FAIRY_STAT_KEYS, FAIRY_STAT_LABELS, effectiveStars, fairyStats, formatFairyStat } from "../../lib/fairyStats";
import type { FairySetup } from "../../lib/formation/codec";
import type { FairyData } from "../../types/fairy";

const styles = {
	row: { display: "flex", justifyContent: "space-between", py: 0.25 },
	control: { mt: 1, mb: 0.5 },
	note: { display: "block", mt: 1 }
} satisfies Record<string, SxProps<Theme>>;

/** Props for FairyPanel. */
interface FairyPanelProps {
	/** Every fairy, or null while the data loads. */
	data: FairyData | null;
	/** The chosen fairy, or null when none is chosen. */
	fairy: FairySetup | null;
	/** A fairy was chosen by id, or cleared with null. */
	onChoose: (fairyId: number | null) => void;
	/** The chosen fairy's level or star rank changed. */
	onUpdate: (patch: Partial<Omit<FairySetup, "fairyId">>) => void;
}

/**
 * The echelon's fairy: which one, how far it is levelled, and what it adds. Built from the same star picker and level slider the
 * fairy's own page uses, so the two read alike.
 *
 * Only the fairy's own stat buff is modelled. Its skill is left out for the same reason the damage estimate leaves out doll skills:
 * a skill needs a battle timeline to mean anything, and there is none here.
 *
 * @param props Component props.
 * @returns The panel.
 */
export default memo(function FairyPanel({ data, fairy, onChoose, onUpdate }: FairyPanelProps) {
	const chosen = useMemo(() => (data && fairy ? (data.items.find((entry) => entry.id === fairy.fairyId) ?? null) : null), [data, fairy]);
	const stats = useMemo(() => (data && chosen && fairy ? fairyStats(chosen, data.constants, fairy.level, fairy.stars) : null), [data, chosen, fairy]);
	// Every fairy is an option and the list never changes, so it is built once rather than on each move of the level slider.
	const options = useMemo(
		() =>
			(data?.items ?? []).map((entry) => (
				<MenuItem key={entry.id} value={entry.id}>
					{entry.name}
				</MenuItem>
			)),
		[data]
	);
	const realStars = data && fairy ? effectiveStars(data.constants, fairy.level, fairy.stars) : 0;

	const handleChoose = useCallback((event: SelectChangeEvent<number>) => onChoose(Number(event.target.value) || null), [onChoose]);
	const handleStars = useCallback((stars: number) => onUpdate({ stars }), [onUpdate]);
	const handleLevel = useCallback((level: number) => onUpdate({ level }), [onUpdate]);
	const handleClear = useCallback(() => onChoose(null), [onChoose]);

	if (!data) {
		return null;
	}

	return (
		<Card>
			<CardContent>
				<Typography variant="subtitle2" color="text.secondary" component="h2" gutterBottom>
					Fairy
				</Typography>
				<FormControl fullWidth size="small">
					<Select value={fairy?.fairyId ?? 0} onChange={handleChoose} inputProps={{ "aria-label": "Fairy" }}>
						<MenuItem value={0}>None</MenuItem>
						{options}
					</Select>
				</FormControl>

				{fairy && chosen && stats ? (
					<>
						<StarRankPicker value={fairy.stars} max={FAIRY_MAX_STARS} onChange={handleStars} sx={styles.control} />
						<LevelSlider id="formation-fairy-level" label="Level" value={fairy.level} max={data.constants.maxLevel} onChange={handleLevel} sx={styles.control} />

						{FAIRY_STAT_KEYS.filter((key) => stats[key] > 0).map((key) => (
							<Box key={key} sx={styles.row}>
								<Typography variant="body2" color="text.secondary">
									{FAIRY_STAT_LABELS[key]}
								</Typography>
								<Typography variant="body2">+{formatFairyStat(stats[key])}</Typography>
							</Box>
						))}

						{realStars < fairy.stars ? (
							<Typography variant="caption" color="text.secondary" sx={styles.note}>
								{fairy.stars}★ needs level {data.constants.starLevels[fairy.stars - 1]}
							</Typography>
						) : null}
						<Typography variant="caption" color="text.secondary" sx={styles.note}>
							Applied to the whole echelon.{stats.critDamage > 0 ? " Crit damage raises what a critical hit multiplies by rather than any stat on the table." : ""}
						</Typography>

						<Button size="small" onClick={handleClear} sx={{ mt: 1 }}>
							Remove fairy
						</Button>
					</>
				) : null}
			</CardContent>
		</Card>
	);
});
