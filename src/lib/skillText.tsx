/** Rendering a skill description with its per-level values filled in, shared by the HOC, Fairy and Protocol Assimilation panels. */

import type { ReactNode } from "react";

// MaterialUI imports
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

/** How a filled-in value is picked out from the surrounding text. */
const VALUE_SX: SxProps<Theme> = { color: "primary.main", fontWeight: 700 };

/** The shape every skill with `#N` placeholders has, whatever entity it belongs to. */
interface TemplatedSkill {
	/** The description with `#N` placeholders. */
	description: string;
	/** Placeholder values at each level. */
	[stat: `stat${number}`]: readonly (string | number)[] | undefined;
}

/**
 * A skill's description with each `#N` placeholder replaced by its value at a level.
 *
 * @param skill The skill.
 * @param level The skill level, counted from 1. Skills have ten levels, except Protocol Assimilation's last two slots, which have five.
 * @returns The description as text and highlighted values.
 */
export function describeSkill(skill: TemplatedSkill, level: number): ReactNode[] {
	return skill.description.split(/#(\d+)/).map((part, index) =>
		// Split with a capture group puts the placeholder numbers at odd indexes.
		index % 2 === 1 ? (
			<Box component="span" key={index} sx={VALUE_SX}>
				{skill[`stat${Number(part)}`]?.[level - 1] ?? ""}
			</Box>
		) : (
			part
		)
	);
}
