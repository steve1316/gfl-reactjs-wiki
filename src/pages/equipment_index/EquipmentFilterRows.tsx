import { memo } from "react";

import FilterChip from "../../components/FilterChip";
import { ChipRow, ChipRowDivider, RarityChipRow } from "../../components/FilterRows";
import type { RarityFilterEntry } from "../../components/FilterRows";
import type { EquipmentType } from "../../types/equipment";

/** Props for EquipmentFilterRows. */
interface EquipmentFilterRowsProps {
	/** The four rarity entries and whether each is on. */
	rarities: RarityFilterEntry[];
	/** Every equipment type, in display order. */
	types: EquipmentType[];
	/** Keys of the types whose chips are on. */
	selectedTypes: ReadonlySet<string>;
	/** Whether only exclusive equipment is shown. */
	exclusiveOnly: boolean;
	/** Toggles the rarity entry with this key. */
	onToggleRarity: (key?: string | number) => void;
	/** Toggles the type with this key. */
	onToggleType: (key?: string | number) => void;
	/** Toggles the Exclusive filter. */
	onToggleExclusive: () => void;
}

/**
 * The Equipment Index's chip rows: rarity, equipment type and Exclusive.
 *
 * @param props Component props.
 * @returns The three rows with dividers between them.
 */
export default memo(function EquipmentFilterRows({ rarities, types, selectedTypes, exclusiveOnly, onToggleRarity, onToggleType, onToggleExclusive }: EquipmentFilterRowsProps) {
	return (
		<>
			<RarityChipRow entries={rarities} onToggle={onToggleRarity} />

			<ChipRowDivider />

			<ChipRow>
				{types.map((type) => (
					<li key={type.key}>
						<FilterChip label={type.label} selected={selectedTypes.has(type.key)} value={type.key} onToggle={onToggleType} />
					</li>
				))}
			</ChipRow>

			<ChipRowDivider />

			<ChipRow>
				<li>
					<FilterChip label="Exclusive" selected={exclusiveOnly} onToggle={onToggleExclusive} />
				</li>
			</ChipRow>
		</>
	);
});
