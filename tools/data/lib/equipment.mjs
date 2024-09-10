import { cleanName, stripMarkup } from "./text.mjs";
import { TYPE_NAMES } from "./tiles.mjs";

/** Upstream equipment type codes to stable keys. Existing keys match the old data's category names. */
export const TYPE_KEYS = {
	Optical_Sight: "opticalSight",
	Holographic_Sight: "holographicSight",
	RedDot_Sight: "redDotSight",
	NightBattle_Equipment: "nightBattleEquipment",
	AP_Ammo: "armorPiercingAmmo",
	HP_Ammo: "hollowPointAmmo",
	Shotgun_Shells: "shotgunShells",
	HV_Ammo: "highVelocityAmmo",
	Chip: "chip",
	Exoskeleton: "exoskeleton",
	ArmorPlate: "armorPlate",
	Suppressor: "suppressor",
	Ammunition_Box: "ammunitionBox",
	Camouflage_Cloak: "camouflageCloak",
	Spare_Sight: "auxiliarySight",
	Special_AP_Ammo: "specialApAmmo",
	Special_Accessories: "specialAccessories",
	Special_Magazine: "specialMagazine",
	Special_TDoll: "specialDollEquipment",
	GroundMount: "tripod",
	Cylinder: "choke",
	RangeFinder: "rangefinder"
};

/** Upstream stat fields to the stat keys the equipment card labels. */
const STAT_KEYS = {
	critical_percent: "criticalHitRate",
	pow: "damage",
	hit: "accuracy",
	critical_harm_rate: "criticalDamage",
	rate: "rateOfFire",
	dodge: "evasion",
	night_view_percent: "nightVision",
	armor_piercing: "armorPiercing",
	bullet_number_up: "clipSize",
	speed: "movementSpeed",
	armor: "armor"
};

/** Mod doll ids are the base id plus this offset. */
const MOD_OFFSET = 20000;

/**
 * Format one stat at levels 0 to 10.
 *
 * @param {string} range Upstream `"min,max"`.
 * @param {number} bonus Per-level bonus in ten-thousandths, 0 when the stat does not scale.
 * @returns {string[]} Eleven display values such as `+24` or `+2~3`.
 */
export function scaleStat(range, bonus) {
	const [min, max] = range.split(",").map(Number);
	if (min < 0 || max < 0) {
		const text = min === max ? `-${Math.abs(min)}` : `-${Math.abs(min)}~${Math.abs(max)}`;
		return Array(11).fill(text);
	}
	return Array.from({ length: 11 }, (_v, level) => {
		const low = Math.floor((min * (10000 + bonus * level)) / 10000);
		const high = Math.floor((max * (10000 + bonus * level)) / 10000);
		return low === high ? `+${low}` : `+${low}~${high}`;
	});
}

/**
 * Build every shown equipment item, grouped by type.
 *
 * @param {ReturnType<import("./upstream.mjs").loadUpstream>} upstream Upstream readers.
 * @returns {{ types: { key: string, label: string }[], items: Record<string, object[]> }} Types in upstream order, and items by type key.
 */
export function buildEquipment(upstream) {
	const typeRows = upstream.stc("equip_type").filter((row) => TYPE_KEYS[row.code] !== undefined);
	const typeByNumber = new Map(typeRows.map((row) => [row.type, row]));
	const items = {};
	for (const row of upstream.stc("equip")) {
		const type = typeByNumber.get(row.type);
		const name = cleanName(upstream.t(row.name));
		if (row.is_show !== 1 || !type || name === "") {
			continue;
		}
		const bonuses = Object.fromEntries(
			String(row.bonus_type)
				.split(",")
				.filter(Boolean)
				.map((pair) => pair.split(":"))
				.map(([field, value]) => [field, Number(value)])
		);
		const stats = {};
		for (const [field, key] of Object.entries(STAT_KEYS)) {
			if (row[field]) {
				stats[key] = scaleStat(String(row[field]), bonuses[field] ?? 0);
			}
		}
		const fitGuns = String(row.fit_guns).split(",").filter(Boolean).map(Number);
		const baseIds = [...new Set(fitGuns.map((id) => id % MOD_OFFSET))];
		const exclusive = baseIds.length > 0;
		const item = {
			id: row.id,
			name,
			rarity: row.rank,
			exclusive,
			usable: exclusive
				? []
				: String(type.fit_gun_type)
						.split(",")
						.map(Number)
						.filter((code) => TYPE_NAMES[code])
						.map((code) => TYPE_NAMES[code]),
			dolls: baseIds.map((id) => ({ id, mod: !fitGuns.includes(id) })),
			description: stripMarkup(upstream.t(row.equip_introduction)).trim(),
			stats
		};
		const key = TYPE_KEYS[type.code];
		(items[key] ??= []).push(item);
	}
	const types = typeRows.filter((row) => items[TYPE_KEYS[row.code]]).map((row) => ({ key: TYPE_KEYS[row.code], label: cleanName(upstream.t(row.name)) }));
	return { types, items };
}
