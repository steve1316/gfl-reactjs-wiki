import { memo } from "react";

import { Box } from "@mui/material";

/** Props for TileGrid. */
interface TileGridProps {
	/** The three rows of the tile set, each three entries of 0, 1 or 2. */
	rows: readonly (readonly number[])[];
}

/**
 * A doll's tile set, as a 3x3 grid.
 *
 * This was a `table` used purely for layout, with each cell a `Box component="td"`. A grid says the same
 * thing without claiming to a screen reader that the shape is tabular data.
 *
 * @param props Component props.
 * @returns The grid.
 */
export default memo(function TileGrid({ rows }: TileGridProps) {
	return (
		<Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", width: 102, aspectRatio: "1 / 1" }} role="img" aria-label="Tile buff pattern">
			{rows.flatMap((row, rowIndex) =>
				row.map((tile, columnIndex) => (
					<Box
						key={`${rowIndex}-${columnIndex}`}
						sx={(theme) => ({
							// Empty squares used the card's own colour with a divider-coloured border, so on the card the
							// grid lines were close to invisible. They now have their own lighter fill and a brighter line.
							backgroundColor: tile === 0 ? theme.palette.tile.empty : tile === 1 ? theme.palette.tile.buff : theme.palette.tile.self,
							border: `1px solid ${theme.palette.tile.line}`
						})}
					/>
				))
			)}
		</Box>
	);
});
