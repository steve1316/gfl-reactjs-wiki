/**
 * Tile buffs on the formation grid: where each placed doll's buffs land, how handgun buffs grow with links, and per-tile totals.
 *
 * Node runs this file with its types stripped in tests, so it must only use erasable TypeScript syntax.
 */

import type { FormationConstants, FormationForm, FormationTile, TileStatCode } from "../../types/formation";

/** Cells on the formation grid. */
export const GRID_CELLS = 9;

/** Rows and columns on the formation grid. */
const GRID_SIZE = 3;

/** The handgun type id, whose tile buffs grow with dummy links. */
const HANDGUN_TYPE = 1;

/** Tile stats in the order labels and totals list them. */
export const TILE_STAT_ORDER: readonly TileStatCode[] = [1, 2, 3, 4, 5, 6, 8];

/** Short tile stat names for labels. */
export const TILE_STAT_SHORT: Record<TileStatCode, string> = { 1: "DMG", 2: "RoF", 3: "ACC", 4: "EVA", 5: "Crit", 6: "Skill CD", 8: "Armor" };

/** A doll standing on the grid, as tile buffs see it. */
export interface TilePlacement {
	/** Cell the doll stands on. */
	cell: number;
	/** The doll's form. */
	form: FormationForm;
	/** Dummy links, 1 to 5. */
	links: number;
}

/** One buff landing on a cell. */
export interface TileSource {
	/** Cell of the doll giving the buff. */
	fromCell: number;
	/** Gun id of the form giving the buff. */
	formId: number;
	/** Which stat. */
	code: TileStatCode;
	/** Percentage, after handgun link growth. */
	value: number;
	/** Type ids the buff applies to. Empty means every type. */
	targets: readonly number[];
}

/** One stat's total on a cell. */
export interface TileTotal {
	/** Which stat. */
	code: TileStatCode;
	/** Summed percentage. */
	total: number;
}

/**
 * The cell index of a row and column.
 *
 * @param row Row, 0 to 2.
 * @param column Column, 0 to 2, where 2 is the front.
 * @returns The cell, 0 to 8.
 */
export function cellOf(row: number, column: number): number {
	return row * GRID_SIZE + column;
}

/**
 * The row and column of a cell.
 *
 * @param cell Cell, 0 to 8.
 * @returns [row, column].
 */
export function rowColumn(cell: number): [number, number] {
	return [Math.floor(cell / GRID_SIZE), cell % GRID_SIZE];
}

/**
 * How much a form's tile values are multiplied by at a link count. Only handguns grow.
 *
 * @param type Upstream type id.
 * @param links Dummy links, 1 to 5.
 * @param constants Formation constants.
 * @returns The multiplier.
 */
export function tileGrowthMultiplier(type: number, links: number, constants: FormationConstants): number {
	if (type !== HANDGUN_TYPE) {
		return 1;
	}
	const [base = 1, perLink = 0] = constants.hgTileGrowth;
	return base + perLink * links;
}

/**
 * Draw a tile as the doll page's 3x3 grid: 0 empty, 1 buffed, 2 the doll.
 *
 * @param tile The tile.
 * @returns Three rows of three numbers.
 */
export function renderTileGrid(tile: FormationTile): number[][] {
	const rows = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	const inside = (row: number, column: number) => row >= 0 && row < GRID_SIZE && column >= 0 && column < GRID_SIZE;
	const [selfRow, selfColumn] = tile.self;
	for (const [rowOffset, columnOffset] of tile.offsets) {
		const row = selfRow + rowOffset;
		const column = selfColumn + columnOffset;
		const line = rows[row];
		if (line && inside(row, column)) {
			line[column] = 1;
		}
	}
	const selfLine = rows[selfRow];
	if (selfLine && inside(selfRow, selfColumn)) {
		selfLine[selfColumn] = 2;
	}
	return rows;
}

/**
 * The cells a doll's tile buffs reach from where it stands, leaving out its own cell and anything off the grid.
 *
 * @param tile The doll's tile.
 * @param cell Cell the doll stands on.
 * @returns Reached cells, in the tile's offset order.
 */
export function tileReach(tile: FormationTile, cell: number): number[] {
	const [row, column] = rowColumn(cell);
	return tile.offsets.flatMap(([rowOffset, columnOffset]) => {
		const targetRow = row + rowOffset;
		const targetColumn = column + columnOffset;
		const offGrid = targetRow < 0 || targetRow >= GRID_SIZE || targetColumn < 0 || targetColumn >= GRID_SIZE;
		return offGrid || (rowOffset === 0 && columnOffset === 0) ? [] : [cellOf(targetRow, targetColumn)];
	});
}

/**
 * Every buff landing on every cell.
 *
 * @param placements Dolls on the grid.
 * @param constants Formation constants.
 * @returns Sources per cell, indexed by cell.
 */
export function tileSources(placements: readonly TilePlacement[], constants: FormationConstants): TileSource[][] {
	const cells: TileSource[][] = Array.from({ length: GRID_CELLS }, () => []);
	for (const { cell, form, links } of placements) {
		const multiplier = tileGrowthMultiplier(form.type, links, constants);
		for (const target of tileReach(form.tile, cell)) {
			const list = cells[target];
			for (const [code, value] of form.tile.effects) {
				list?.push({ fromCell: cell, formId: form.id, code, value: value * multiplier, targets: form.tile.targets });
			}
		}
	}
	return cells;
}

/**
 * Whether a buff applies to a doll type.
 *
 * @param source The buff.
 * @param type Upstream type id of the doll on the tile.
 * @returns True when the buff targets that type or every type.
 */
export function appliesTo(source: TileSource, type: number): boolean {
	return source.targets.length === 0 || source.targets.includes(type);
}

/**
 * Sum buffs per stat, in display order.
 *
 * @param sources Buffs on one cell.
 * @returns One total per stat that has any buff, however many dolls it came from.
 */
export function tileTotals(sources: readonly TileSource[]): TileTotal[] {
	return TILE_STAT_ORDER.flatMap((code) => {
		const matching = sources.filter((source) => source.code === code);
		return matching.length === 0 ? [] : [{ code, total: matching.reduce((sum, source) => sum + source.value, 0) }];
	});
}
