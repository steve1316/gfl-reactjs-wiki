import { memo } from "react";

import { Avatar, useTheme } from "@mui/material";

import FilterChip from "../../components/FilterChip";
import { ChipRow, ChipRowDivider, RarityChipRow } from "../../components/FilterRows";
import type { RarityFilterEntry, SimpleFilterEntry } from "../../components/FilterRows";
import { uiUrl } from "../../lib/assets";

/** The Mod chip's icon avatar, built once since it is a prop of a memoised chip. */
const MOD_AVATAR = (
	<Avatar>
		<img src={uiUrl("mod.png")} alt="" style={{ width: 20, height: 20 }} />
	</Avatar>
);

/** Props for DollFilterRows. */
interface DollFilterRowsProps {
	/** The five rarity filter entries and their current selected state. */
	rarityFilter: RarityFilterEntry[];
	/** The six weapon-type filter entries and their current selected state. */
	typeFilter: SimpleFilterEntry[];
	/** The single Mod filter entry and its current selected state. */
	modFilter: SimpleFilterEntry;
	/** The single Live2D filter entry and its current selected state. */
	live2dFilter: SimpleFilterEntry;
	/** Toggles the rarity entry with this key. */
	onToggleRarity: (key?: string | number) => void;
	/** Toggles the weapon-type entry with this key. */
	onToggleType: (key?: string | number) => void;
	/** Toggles the Mod filter. */
	onToggleMod: () => void;
	/** Toggles the Live2D filter. */
	onToggleLive2d: () => void;
}

/**
 * The T-Doll Index's chip rows: rarity, weapon class, and Mod alongside Live2D.
 *
 * @param props Component props.
 * @returns The three rows with dividers between them.
 */
export default memo(function DollFilterRows({ rarityFilter, typeFilter, modFilter, live2dFilter, onToggleRarity, onToggleType, onToggleMod, onToggleLive2d }: DollFilterRowsProps) {
	const theme = useTheme();
	return (
		<>
			<RarityChipRow entries={rarityFilter} onToggle={onToggleRarity} />

			<ChipRowDivider />

			<ChipRow>
				{typeFilter.map((type) => (
					<li key={type.key}>
						<FilterChip
							label={type.label}
							selected={type.selected}
							value={type.key}
							onToggle={onToggleType}
							colour={theme.palette.weaponType[type.label as keyof typeof theme.palette.weaponType]}
						/>
					</li>
				))}
			</ChipRow>

			<ChipRowDivider />

			<ChipRow>
				<li>
					<FilterChip label={modFilter.label} selected={modFilter.selected} onToggle={onToggleMod} avatar={MOD_AVATAR} />
				</li>
				<li>
					<FilterChip label={live2dFilter.label} selected={live2dFilter.selected} onToggle={onToggleLive2d} />
				</li>
			</ChipRow>
		</>
	);
});
