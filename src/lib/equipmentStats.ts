/**
 * Display names for the stat keys in the equipment data, shared by the Equipment Index cards and the doll page's exclusive equipment card.
 *
 * This was a thirteen-branch if/else chain rebuilt inside the render for every stat of every card.
 * Anything missing from the map falls back to the raw key, which is at least visible rather than the
 * empty string the chain produced.
 */
const STAT_NAMES: Record<string, string> = {
	criticalHitRate: "Critical hit rate",
	damage: "Damage",
	accuracy: "Accuracy",
	criticalDamage: "Critical damage",
	rateOfFire: "Rate of fire",
	evasion: "Evasion",
	nightVision: "Night vision",
	boostAbilityEffectiveness: "Boost ability effectiveness",
	armorPiercing: "Armor piercing",
	target: "Target",
	clipSize: "Clip size",
	movementSpeed: "Movement speed",
	armor: "Armor"
};

/**
 * The display name of an equipment stat.
 *
 * @param key A stat key from the equipment data, such as `criticalHitRate`.
 * @returns The display name, or the key itself when it has none.
 */
export function statName(key: string): string {
	return STAT_NAMES[key] ?? key;
}
