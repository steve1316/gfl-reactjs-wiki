/**
 * Isometric projection for the formation stage: where each cell sits on screen and which cell a point is over.
 *
 * Columns run toward the lower right (the front, where enemies come from) and rows toward the lower left. Node runs this file with its types
 * stripped in tests, so it must only use erasable TypeScript syntax.
 */

import { rowColumn } from "../../lib/formation/tiles.ts";

/**
 * Tile width as a fraction of the stage width.
 *
 * Two 3x3 grids stand side by side, and an isometric 3x3 grid is three tile widths across, so the stage has to hold six of them plus
 * the gap between the sides and a margin at each end. That makes the tiles smaller than when the stage held one grid and a single
 * enemy, which is the cost of showing both sides of the fight at once.
 */
const TILE_WIDTH_SHARE = 1 / 7.1;

/** Tile height as a fraction of tile width. */
const TILE_ASPECT = 0.58;

/** Where the back corner of the echelon's grid sits across the stage, as a fraction of its width, so its left corner clears the edge. */
const ORIGIN_X_SHARE = 0.225;

/** Where the back corner of the enemy's grid sits, far enough right that the two grids do not touch. */
const ENEMY_ORIGIN_X_SHARE = 0.775;

/** Which side of the field a grid is on. */
export type StageSide = "player" | "enemy";

/** Headroom above the grid for the back row's chibis, in tile widths. A chibi stands about 1.2 tiles tall from the middle of its tile. */
const HEADROOM = 0.95;

/** Space below the grid, in tile widths, enough for the front row's labels to sit just past the grid's front corner. */
const FOOTROOM = 0.18;

/** Rows and columns on the grid. */
const GRID_SIZE = 3;

/** The stage's size and the grid's placement on it, in CSS pixels. */
export interface StageGeometry {
	/** Stage width. */
	width: number;
	/** Stage height. */
	height: number;
	/** Width of one tile diamond. */
	tileWidth: number;
	/** Height of one tile diamond. */
	tileHeight: number;
	/** X of the echelon grid's back corner. */
	originX: number;
	/** X of the enemy grid's back corner. */
	enemyOriginX: number;
	/** Y of both grids' back corner. */
	originY: number;
}

/**
 * The x of a side's back corner.
 *
 * @param geometry Stage geometry.
 * @param side Which grid.
 * @returns The x in CSS pixels.
 */
function sideOriginX(geometry: StageGeometry, side: StageSide): number {
	return side === "enemy" ? geometry.enemyOriginX : geometry.originX;
}

/**
 * Lay out the grid for a stage width.
 *
 * @param width Stage width in CSS pixels.
 * @returns The geometry.
 */
export function stageGeometry(width: number): StageGeometry {
	const tileWidth = width * TILE_WIDTH_SHARE;
	const tileHeight = tileWidth * TILE_ASPECT;
	const originY = tileWidth * HEADROOM;
	return {
		width,
		height: Math.round(originY + GRID_SIZE * tileHeight + tileWidth * FOOTROOM),
		tileWidth,
		tileHeight,
		originX: width * ORIGIN_X_SHARE,
		enemyOriginX: width * ENEMY_ORIGIN_X_SHARE,
		originY
	};
}

/**
 * The centre of a cell's diamond, where a chibi's feet go.
 *
 * @param geometry Stage geometry.
 * @param cell Cell, 0 to 8.
 * @param side Which grid the cell belongs to.
 * @returns The point.
 */
export function tileCentre(geometry: StageGeometry, cell: number, side: StageSide): { x: number; y: number } {
	const [row, column] = rowColumn(cell);
	return {
		x: sideOriginX(geometry, side) + ((column - row) * geometry.tileWidth) / 2,
		y: geometry.originY + ((column + row) * geometry.tileHeight) / 2 + geometry.tileHeight / 2
	};
}

/**
 * A cell's diamond as an SVG `points` string.
 *
 * @param geometry Stage geometry.
 * @param cell Cell, 0 to 8.
 * @param side Which grid the cell belongs to.
 * @returns The points.
 */
export function tilePoints(geometry: StageGeometry, cell: number, side: StageSide): string {
	const { x, y } = tileCentre(geometry, cell, side);
	const halfWidth = geometry.tileWidth / 2;
	const halfHeight = geometry.tileHeight / 2;
	return `${x},${y - halfHeight} ${x + halfWidth},${y} ${x},${y + halfHeight} ${x - halfWidth},${y}`;
}

/**
 * Which cell of one side a point is over.
 *
 * @param geometry Stage geometry.
 * @param x Point x in CSS pixels.
 * @param y Point y in CSS pixels.
 * @param side Which grid to test against.
 * @returns The cell, or null when the point is off that grid.
 */
export function cellAtSide(geometry: StageGeometry, x: number, y: number, side: StageSide): number | null {
	const across = (x - sideOriginX(geometry, side)) / (geometry.tileWidth / 2);
	const down = (y - geometry.originY) / (geometry.tileHeight / 2);
	const column = Math.floor((across + down) / 2);
	const row = Math.floor((down - across) / 2);
	if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE) {
		return null;
	}
	return row * GRID_SIZE + column;
}

/**
 * Which cell of either side a point is over.
 *
 * @param geometry Stage geometry.
 * @param x Point x in CSS pixels.
 * @param y Point y in CSS pixels.
 * @returns The side and cell, or null when the point is off both grids.
 */
export function cellAt(geometry: StageGeometry, x: number, y: number): { side: StageSide; cell: number } | null {
	for (const side of ["player", "enemy"] as const) {
		const cell = cellAtSide(geometry, x, y, side);
		if (cell !== null) {
			return { side, cell };
		}
	}
	return null;
}
