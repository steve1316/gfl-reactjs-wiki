/** Upstream doll type ids to the site's type names. */
export const TYPE_NAMES = { 1: "HG", 2: "SMG", 3: "RF", 4: "AR", 5: "MG", 6: "SG" };

/** Upstream tile effect codes to the text the tile card shows before the value. Code 7 never occurs. */
const EFFECT_LABELS = { 1: "Damage by ", 2: "Rate of Fire by ", 3: "Accuracy by ", 4: "Evasion by ", 5: "Critical Rate by ", 6: "Reduces Skill CD by ", 8: "Armor by " };

/** The tile effect codes the game uses, as numbers. */
export const TILE_EFFECT_CODES = new Set(Object.keys(EFFECT_LABELS).map(Number));

/** Handgun tile buffs grow with dummy links. The site shows the five-link value, which is double the base. */
const HANDGUN_LINK_MULTIPLIER = 2;

/**
 * Convert a 5x5 upstream position, already centred on 13, to a cell of the 3x3 grid.
 *
 * Columns run left to right and rows run bottom to top in upstream, so the row is flipped for `row1` being the top.
 *
 * @param {number} position Upstream position, 1 to 25.
 * @returns {[number, number]} Row index (0 is the top) and column index.
 */
export function tileCell(position) {
	const column = Math.ceil(position / 5);
	const row = position - 5 * (column - 1);
	return [4 - row, column - 2];
}

/**
 * Describe which types a tile set buffs.
 *
 * @param {string} guntype Upstream `effect_guntype`, such as `"0"`, `"2"` or `"2,4,6"`.
 * @returns {string} Text such as `Buffs All Types` or `Buffs SMG, AR and SG`.
 */
function targetsText(guntype) {
	const names = guntype
		.split(",")
		.map(Number)
		.filter((code) => code !== 0)
		.map((code) => TYPE_NAMES[code]);
	if (names.length === 0) {
		return "Buffs All Types";
	}
	const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
	return `Buffs ${list}`;
}

/**
 * Build a form's tile buff grid and its effect lines.
 *
 * Upstream positions sit on a 5x5 grid around `effect_grid_center`, which is not always 13. Buffed cells are shifted so
 * the centre lands on 13, and the doll itself is drawn at the mirror of the centre. Verified exact on 358 of 379 forms.
 *
 * @param {object} gun A `stc/gun.json` row.
 * @returns {{ row1: number[], row2: number[], row3: number[], targets: string, number_of_stats: number, stat1: string[], stat2: string[] }} The tile set.
 */
export function buildTiles(gun) {
	const rows = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	const center = gun.effect_grid_center;
	const inside = ([row, column]) => row >= 0 && row < 3 && column >= 0 && column < 3;
	for (const position of String(gun.effect_grid_pos).split(",").filter(Boolean).map(Number)) {
		const target = tileCell(position - center + 13);
		if (inside(target)) {
			rows[target[0]][target[1]] = 1;
		}
	}
	const self = tileCell(26 - center);
	if (inside(self)) {
		rows[self[0]][self[1]] = 2;
	}

	const multiplier = gun.type === 1 ? HANDGUN_LINK_MULTIPLIER : 1;
	const effects = String(gun.effect_grid_effect)
		.split(";")
		.filter(Boolean)
		.map((pair) => pair.split(",").map(Number))
		.filter(([code]) => EFFECT_LABELS[code] !== undefined);

	return {
		row1: rows[0],
		row2: rows[1],
		row3: rows[2],
		targets: targetsText(String(gun.effect_guntype)),
		number_of_stats: effects.length,
		stat1: effects.map(([code]) => EFFECT_LABELS[code]),
		stat2: effects.map(([, value]) => `${value * multiplier}%`)
	};
}
