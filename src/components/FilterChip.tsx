import { Chip } from "@mui/material";
import type { ReactElement } from "react";

/** Props for FilterChip. */
interface FilterChipProps {
	/** The text on the chip. */
	label: string;
	/** Whether this filter is currently applied. */
	selected: boolean;
	/** Called when the chip is clicked. */
	onToggle: () => void;
	/**
	 * The colour this filter stands for, such as a rarity or a weapon class.
	 *
	 * Left undefined where the filter carries no meaning of its own, as the equipment categories do,
	 * in which case the chip falls back to the theme's accent.
	 */
	colour?: string;
	/** Small leading element, such as a rarity number or the Mod icon. */
	avatar?: ReactElement;
}

/**
 * One filter chip, on or off.
 *
 * Every filter row on the site used to repeat the same block of chip markup, which is how one of them
 * ended up rendering its label twice. Three faults are fixed by having a single component:
 *
 * - There was no off state. Both branches of `color={selected ? "primary" : "secondary"}` are filled
 *   chips, so an untouched filter looked as active as a chosen one. Off is now an outline.
 * - The weapon chips passed the same string as both `avatar` and `label`, rendering `HG HG` six times.
 * - The tick was a hijacked delete button, wired to an empty handler that existed only to make the
 *   icon appear. The fill carries the state instead. A real tick was tried and dropped: MUI renders
 *   either an avatar or an icon, never both, so the rarity chips silently lost theirs and only some
 *   selected chips were ticked. `aria-pressed` states it for a screen reader either way.
 *
 * @param props Component props.
 * @returns The chip.
 */
export default function FilterChip({ label, selected, onToggle, colour, avatar }: FilterChipProps) {
	return (
		<Chip
			clickable
			label={label}
			avatar={avatar}
			onClick={onToggle}
			variant={selected ? "filled" : "outlined"}
			aria-pressed={selected}
			sx={(theme) => {
				const tint = colour ?? theme.palette.primary.main;
				return {
					m: 0.5,
					fontWeight: 650,
					borderColor: tint,
					color: selected ? theme.palette.getContrastText(tint) : tint,
					backgroundColor: selected ? tint : "transparent",
					"&:hover": {
						backgroundColor: selected ? tint : theme.palette.action.hover
					},
					// The avatar inherits the chip's own colour rather than MUI's default, which assumes a
					// filled chip in one of the palette's named colours.
					"& .MuiChip-avatar": {
						color: "inherit",
						backgroundColor: selected ? "transparent" : theme.palette.action.hover
					}
				};
			}}
		/>
	);
}
