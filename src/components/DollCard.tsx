import { memo, useMemo } from "react";

import { Card, CardActionArea, CardMedia, Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Link } from "react-router-dom";

import { cardArtSx } from "../lib/artLayout";
import { findNameMatch } from "../lib/nameSearch";
import { RarityLabel, TypeBadge } from "./DollBadges";

/** Style for the part of a name that matches the search. */
const matchSx = { fontWeight: 800, color: "text.primary" } as const;

/** Style for the box that stands in for card art that is not hosted yet. It keeps the card art's 1:2 shape. */
export const PLACEHOLDER_SX: SxProps<Theme> = { ...cardArtSx, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "action.hover" };

/** Props for DollCard. */
interface DollCardProps {
	/** Doll id, shown as the secondary label. */
	id: number;
	/** Doll name, always visible. This used to live only in a hover tooltip. */
	name: string;
	/** Weapon class, such as `AR`. */
	type: string;
	/** Rarity, 1 to 6. */
	rarity: number;
	/** Whether the form shown is the Mod, which changes the rarity colour. */
	isMod: boolean;
	/** URL of the 256x512 card art, or an empty string when the art is not hosted yet. */
	image: string;
	/** Route this card links to. */
	to: string;
	/** Tighter padding and type, for dense grids. */
	dense?: boolean;
	/** A name search query. The part of the name it matches is shown in bold. */
	highlight?: string;
}

/**
 * One doll, as a card.
 *
 * The index and the home carousel drew two different cards showing different facts. The index card
 * showed artwork and nothing else, with the name, rarity and type hidden in a hover tooltip that a touch
 * screen cannot open, so filtering by rarity gave you results whose rarity you could never see.
 *
 * @param props Component props.
 * @returns The card.
 */
export default memo(function DollCard({ id, name, type, rarity, isMod, image, to, dense = false, highlight = "" }: DollCardProps) {
	const match = useMemo(() => findNameMatch(name, highlight), [name, highlight]);

	return (
		<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<CardActionArea component={Link} to={to} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
				{image === "" ? (
					<Box sx={PLACEHOLDER_SX} role="img" aria-label={`${name} - art not available yet`}>
						<Typography sx={{ fontSize: "0.75rem", color: "text.secondary", px: 1, textAlign: "center" }}>Art not available yet</Typography>
					</Box>
				) : (
					<CardMedia component="img" sx={cardArtSx} image={image} alt={name} />
				)}
				<Box sx={{ px: dense ? 0.75 : 1, py: dense ? 0.5 : 0.75 }}>
					<Typography
						component="div"
						sx={{
							// Name must be readable on mobile (11+ px).
							fontSize: dense ? "0.72rem" : "0.8rem",
							// While a search matches, the rest of the name drops to regular weight so the matched part stands out.
							fontWeight: match ? 400 : 700,
							color: match ? "text.secondary" : undefined,
							lineHeight: 1.25,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						}}
						title={name}
					>
						{match ? (
							<>
								{name.slice(0, match[0])}
								<Box component="b" sx={matchSx}>
									{name.slice(match[0], match[1])}
								</Box>
								{name.slice(match[1])}
							</>
						) : (
							name
						)}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, mt: 0.25 }}>
						<TypeBadge type={type} dense={dense} />
						<RarityLabel rarity={rarity} isMod={isMod} />
					</Box>
					<Typography component="div" sx={{ fontSize: "0.6875rem", color: "text.secondary", mt: 0.1 }}>
						#{id}
					</Typography>
				</Box>
			</CardActionArea>
		</Card>
	);
});
