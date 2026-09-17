/**
 * Isometric projection for the formation stage: where each cell sits on screen and which cell a point is over.
 *
 * Columns run toward the lower right (the front, where enemies come from) and rows toward the lower left. Node runs this file with its types
 * stripped in tests, so it must only use erasable TypeScript syntax.
 */

import { rowColumn } from "../../lib/formation/tiles.ts";

/** Tile width as a fraction of the stage width. The grid and the enemy beside it fill the stage, with a thin margin at each end. */
const TILE_WIDTH_SHARE = 1 / 3.95;

/** Tile height as a fraction of tile width. */
const TILE_ASPECT = 0.58;

/** Where the back corner of the grid sits across the stage, as a fraction of its width. Set so the grid's left corner clears the edge by a little. */
const ORIGIN_X_SHARE = 0.395;

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
	/** X of the grid's back corner. */
	originX: number;
	/** Y of the grid's back corner. */
	originY: number;
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
	return { width, height: Math.round(originY + GRID_SIZE * tileHeight + tileWidth * FOOTROOM), tileWidth, tileHeight, originX: width * ORIGIN_X_SHARE, originY };
}

/**
 * The centre of a cell's diamond, where a chibi's feet go.
 *
 * @param geometry Stage geometry.
 * @param cell Cell, 0 to 8.
 * @returns The point.
 */
export function tileCentre(geometry: StageGeometry, cell: number): { x: number; y: number } {
	const [row, column] = rowColumn(cell);
	return {
		x: geometry.originX + ((column - row) * geometry.tileWidth) / 2,
		y: geometry.originY + ((column + row) * geometry.tileHeight) / 2 + geometry.tileHeight / 2
	};
}

/**
 * A cell's diamond as an SVG `points` string.
 *
 * @param geometry Stage geometry.
 * @param cell Cell, 0 to 8.
 * @returns The points.
 */
export function tilePoints(geometry: StageGeometry, cell: number): string {
	const { x, y } = tileCentre(geometry, cell);
	const halfWidth = geometry.tileWidth / 2;
	const halfHeight = geometry.tileHeight / 2;
	return `${x},${y - halfHeight} ${x + halfWidth},${y} ${x},${y + halfHeight} ${x - halfWidth},${y}`;
}

/**
 * Where the enemy placeholder stands: right of the grid, level with its middle.
 *
 * @param geometry Stage geometry.
 * @returns The point for the enemy's feet.
 */
export function enemyAnchor(geometry: StageGeometry): { x: number; y: number } {
	const middle = tileCentre(geometry, 4);
	return { x: geometry.originX + geometry.tileWidth * 1.92, y: middle.y + geometry.tileHeight * 0.5 };
}

/**
 * Which cell a point is over.
 *
 * @param geometry Stage geometry.
 * @param x Point x in CSS pixels.
 * @param y Point y in CSS pixels.
 * @returns The cell, or null when the point is off the grid.
 */
export function cellAt(geometry: StageGeometry, x: number, y: number): number | null {
	const across = (x - geometry.originX) / (geometry.tileWidth / 2);
	const down = (y - geometry.originY) / (geometry.tileHeight / 2);
	const column = Math.floor((across + down) / 2);
	const row = Math.floor((down - across) / 2);
	if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE) {
		return null;
	}
	return row * GRID_SIZE + column;
}
