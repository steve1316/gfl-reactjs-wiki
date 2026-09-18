import { memo, useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { Box, Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import FilterChip from "../../components/FilterChip";
import { enemyCardUrl } from "../../lib/assets";
import { matchesAnyName, normaliseName } from "../../lib/nameSearch";
import { hasEnemyArt } from "../../lib/processData";
import { FACTION_COLOURS } from "../../theme/palette";
import type { FormationEnemy } from "../../types/formation";
import { toggleInSet } from "./toggleInSet";

/** Most cards shown at once, so typing stays fast. Narrowing the search shows the rest. */
const MAX_CARDS = 120;

/** Props for EnemyModal. */
interface EnemyModalProps {
	/** Whether the dialog is open. */
	open: boolean;
	/** The cell of the enemy grid being filled, or null when the dialog is closed. */
	cell: number | null;
	/** Every enemy that can be placed. */
	enemies: readonly FormationEnemy[];
	/** The enemy already on this cell, or undefined when it is empty. */
	current: FormationEnemy | undefined;
	/** An enemy was picked for the cell. */
	onPick: (cell: number, enemyId: number) => void;
	/** The cell was cleared. */
	onClear: (cell: number) => void;
	/** The dialog was dismissed. */
	onClose: () => void;
}

/**
 * Pick the enemy standing on one cell of the opposing grid.
 *
 * Built the same way as the doll picker: a name search, chips to narrow the list, and a grid of cards. It fills one cell at a time
 * rather than an echelon, so the same enemy can stand on several tiles, the way a squad of the same unit does in game.
 *
 * @param props Component props.
 * @returns The dialog.
 */
export default memo(function EnemyModal({ open, cell, enemies, current, onPick, onClear, onClose }: EnemyModalProps) {
	const [query, setQuery] = useState("");
	const [factions, setFactions] = useState<ReadonlySet<string>>(new Set());
	const [bossOnly, setBossOnly] = useState(false);

	const factionNames = useMemo(() => [...new Set(enemies.map((enemy) => enemy.faction))], [enemies]);
	const candidates = useMemo(() => enemies.map((enemy) => ({ enemy, key: normaliseName(enemy.name) })), [enemies]);
	const shown = useMemo(() => {
		const needle = normaliseName(query);
		return candidates.filter(({ enemy, key }) => matchesAnyName([key], needle) && (factions.size === 0 || factions.has(enemy.faction)) && (!bossOnly || enemy.boss)).slice(0, MAX_CARDS);
	}, [candidates, query, factions, bossOnly]);

	const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value), []);
	const toggleFaction = useCallback((faction?: string | number) => setFactions((currentSet) => toggleInSet(currentSet, String(faction))), []);
	const toggleBoss = useCallback(() => setBossOnly((current) => !current), []);
	const handleClear = useCallback(() => {
		if (cell !== null) {
			onClear(cell);
		}
		onClose();
	}, [cell, onClear, onClose]);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
			<DialogTitle>{current ? `Replace ${current.name}` : "Place an enemy"}</DialogTitle>
			<DialogContent dividers>
				<TextField
					fullWidth
					size="small"
					placeholder="Search by name"
					value={query}
					onChange={handleQuery}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							)
						},
						htmlInput: { "aria-label": "Search enemies by name" }
					}}
				/>
				<Box sx={{ display: "flex", flexWrap: "wrap", my: 1.5 }}>
					{factionNames.map((faction) => (
						<FilterChip
							key={faction}
							label={faction}
							value={faction}
							selected={factions.has(faction)}
							onToggle={toggleFaction}
							colour={FACTION_COLOURS[faction as keyof typeof FACTION_COLOURS]}
						/>
					))}
					<FilterChip label="Boss" selected={bossOnly} onToggle={toggleBoss} />
				</Box>
				<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 1 }}>
					{shown.map(({ enemy }) => (
						<ButtonBase
							key={enemy.id}
							onClick={() => cell !== null && onPick(cell, enemy.id)}
							sx={{ flexDirection: "column", alignItems: "stretch", borderRadius: "8px", overflow: "hidden", bgcolor: "raised", textAlign: "left" }}
							aria-label={`Place ${enemy.name}`}
						>
							{hasEnemyArt(enemy.id, "card") ? (
								<Box component="img" src={enemyCardUrl(enemy.id)} alt="" loading="lazy" sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
							) : (
								<ArtPlaceholder name={enemy.name} />
							)}
							<Box sx={{ p: 0.75 }}>
								<Typography variant="caption" sx={{ fontWeight: 700, display: "block", lineHeight: 1.2 }} noWrap>
									{enemy.name}
								</Typography>
								<Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }} noWrap>
									{enemy.stats.hp} HP {enemy.stats.count > 1 ? `x${enemy.stats.count}` : ""}
								</Typography>
							</Box>
						</ButtonBase>
					))}
				</Box>
				{shown.length === 0 && <Typography sx={{ py: 3, textAlign: "center" }}>No enemies match.</Typography>}
			</DialogContent>
			<DialogActions>
				{current ? (
					<Button color="error" onClick={handleClear}>
						Clear tile
					</Button>
				) : null}
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
});
