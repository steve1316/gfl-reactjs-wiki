import { memo, useCallback, useMemo, useState } from "react";

// MaterialUI imports
import { Box, Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import SpineAnimation from "../../components/SpineAnimation";
import { enemySpineImageBase, enemySpineUrl } from "../../lib/assets";
import type { SpineRig } from "../../types/spine";

/** Animations shown first when the skeleton defines them, since they say the most about what the enemy does. */
const PREFERRED_ORDER = ["wait", "move", "attack", "s", "s2", "bossskill", "spattack", "die"];

const styles = {
	pills: { display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 },
	stage: { maxWidth: 420, mx: "auto" }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Order a skeleton's animations so the common ones lead and the rest follow alphabetically.
 *
 * @param anims The animation names the skeleton defines.
 * @returns The names in display order.
 */
function orderAnimations(anims: readonly string[]): string[] {
	const preferred = PREFERRED_ORDER.filter((name) => anims.includes(name));
	return [...preferred, ...[...anims].filter((name) => !preferred.includes(name)).sort((a, b) => a.localeCompare(b))];
}

/** Props for EnemyAnimationsPanel. */
interface EnemyAnimationsPanelProps {
	/** Enemy id, used to build the rig's URLs. */
	id: number;
	/** The enemy's combat rig. */
	rig: SpineRig;
}

/**
 * One enemy's chibi, with a pill per animation its skeleton defines.
 *
 * Simpler than the doll and HOC panels: an enemy has a single rig, with no dorm twin, no Mod and no crew to switch between.
 *
 * @param props Component props.
 * @returns The animation stage and its pills.
 */
export default memo(function EnemyAnimationsPanel({ id, rig }: EnemyAnimationsPanelProps) {
	const animations = useMemo(() => orderAnimations(rig.anims), [rig.anims]);
	const [selected, setSelected] = useState(() => animations[0] ?? "");

	const handleSelect = useCallback((event: React.MouseEvent<HTMLElement>) => setSelected(event.currentTarget.dataset.anim ?? ""), []);

	return (
		<Box>
			{animations.length > 1 && (
				<Box sx={styles.pills} role="group" aria-label="Animations">
					{animations.map((name) => (
						<Chip
							key={name}
							label={name}
							size="small"
							clickable
							data-anim={name}
							onClick={handleSelect}
							aria-pressed={name === selected}
							color={name === selected ? "primary" : "default"}
							variant={name === selected ? "filled" : "outlined"}
						/>
					))}
				</Box>
			)}
			<Box sx={styles.stage}>
				<SpineAnimation
					key={`${id}-${rig.skel}`}
					skelUrl={enemySpineUrl(id, rig.skel, "skel")}
					atlasUrl={enemySpineUrl(id, rig.atlas, "atlas")}
					imageBase={enemySpineImageBase(id)}
					animation={selected}
				/>
			</Box>
		</Box>
	);
});
