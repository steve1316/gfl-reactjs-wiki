import { memo } from "react";
import type { ReactElement } from "react";

import { Chip } from "@mui/material";

/** Props for FilterChip. */
interface FilterChipProps {
	/** The text on the chip. */
	label: string;
	/** Whether this filter is currently applied. */
	selected: boolean;
	/**
	 * Called with `value` when the chip is clicked.
	 *
	 * Taking the value back means a row of chips can share one stable handler. A fresh arrow per chip, the
	 * usual way to say which chip was clicked, is a new prop on every render and defeats the memo below.
	 */
	onToggle: (value?: string | number) => void;
	/** Identifies this chip to `onToggle`, such as a filter's key. */
	value?: string | number;
	/**
	 * The colour this filter stands for, such as a rarity or a weapon class.
	 *
	 * Left undefined where the filter carries no meaning of its own, as the equipment categories do,
	 * in which case the chip falls back to the theme's accent.
	 */
	colour?: string;
	/** Small leading element, such as a rarity number or the Mod icon. Drawn in a round 24px slot. */
	avatar?: ReactElement;
	/** Small leading glyph, such as a faction's emblem. Drawn at its own size rather than in the avatar's round slot. */
	icon?: ReactElement;
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
export default memo(function FilterChip({ label, selected, onToggle, value, colour, avatar, icon }: FilterChipProps) {
	return (
		<Chip
			clickable
			label={label}
			avatar={avatar}
			icon={icon}
			onClick={() => onToggle(value)}
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
					},
					// Same reason for the colour. The spacing is MUI's own 5px/-6px opened up a little, since these marks are
					// square where a MUI glyph has its own built-in padding, and 5px sat them right on the chip's rounded cap.
					"& .MuiChip-icon": {
						color: "inherit",
						marginLeft: "9px",
						marginRight: "-3px"
					}
				};
			}}
		/>
	);
});
