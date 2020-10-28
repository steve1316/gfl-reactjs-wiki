/*
    This array of T-Dolls will contain information about index #301 to #400 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// START OF #301-#400 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	{
		normal: {
			id: 301,
			name: "MAS-38",
			type: "SMG",
			rarity: 3,
			max_hp: 190,
			max_dmg: 26,
			max_acc: 13,
			max_eva: 72,
			max_rof: 83,
			skill: {
				name: "Mobility Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 and evasion by #2 for #3 seconds.",
				number_of_stats: 2,
				stat1: ["100%", "106%", "111%", "117%", "122%", "128%", "133%", "139%", "144%", "150%"],
				stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 0, 0],
				row3: [1, 2, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["18%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 302,
			name: "Defender",
			type: "SG",
			rarity: 4,
			max_hp: 247,
			max_dmg: 38,
			max_acc: 13,
			max_eva: 17,
			max_rof: 27,
			max_armor: 18,
			skill: {
				name: "	Fang Blossom",
				initial_cooldown: "Passive",
				description:
					"Every attack expends the entire magazine and causes 8 instances of damage to the nearest target (only counts as 1 attack for calculating knockback. Does not stack with slug rounds.) Does less damage the further away the target, does more damage the closer the target, to a maximum of #1 damage. Reload time is reduced to a fixed #2 seconds.",
				number_of_stats: 2,
				stat1: ["1.6x", "1.7x", "1.8x", "1.9x", "2x", "2.1x", "2.2x", "2.3x", "2.4x", "2.5x"],
				stat2: [3, 2.9, 2.8, 2.7, 2.6, 2.4, 2.3, 2.2, 2.1, 2]
			},
			tile_set: {
				row1: [1, 0, 1],
				row2: [1, 1, 2],
				row3: [0, 0, 0],
				targets: "Buffs MG and SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Armor by "],
				stat2: ["10%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 303,
			name: "HP-35",
			type: "HG",
			rarity: 5,
			max_hp: 76,
			max_dmg: 31,
			max_acc: 64,
			max_eva: 89,
			max_rof: 58,
			skill: {
				name: "Berserk Accompaniment",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"[Passive]: When enemies are under negative status effects, damage taken is increased by #1. When allies are under negative status effects, damage taken is reduced by #2. Passive is always active during night battles. [Active]: Increases the damage dealt to all enemies by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: ["4%", "4%", "5%", "14%", "15%", "16%", "17%", "18%", "19%", "20%"],
				stat2: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat3: ["9%", "10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%"],
				stat4: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 1, 1],
				row3: [1, 2, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["30%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Little Glider"],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true]
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 304,
			name: "SAF",
			type: "SMG",
			rarity: 4,
			max_hp: 180,
			max_dmg: 25,
			max_acc: 14,
			max_eva: 69,
			max_rof: 99,
			skill: {
				name: "Shockwave Explosion",
				initial_cooldown: "4s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"Throws a grenade 5 units ahead of self that deals #1 damage to enemies within a 2.5 unit radius and inflicting a knockback effect of 3 units. If self is in the middle row, enemies are knocked to the sides; If self is in the top/bottom row, enemies are knocked to the middle of the battlefield. The knockback effect is ineffective against enemies in the middle of attacking or using skills.",
				number_of_stats: 1,
				stat1: ["2x", "2.1x", "2.2x", "2.3x", "2.4x", "2.6x", "2.7x", "2.8x", "2.9x", "3x"]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 0, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["22%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 305,
			name: "Tabuk",
			type: "RF",
			rarity: 4,
			max_hp: 84,
			max_dmg: 115,
			max_acc: 81,
			max_eva: 36,
			max_rof: 39,
			skill: {
				name: "Symmetrical Adjustment",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds. While skill is active, prioritise enemies that are within 5 units range of self and deal additional #3 damage to them.",
				number_of_stats: 3,
				stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat3: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Soul-Eating Chef"],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true]
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 306,
			name: "AK-Alfa",
			type: "AR",
			rarity: 5,
			max_hp: 116,
			max_dmg: 56,
			max_acc: 53,
			max_eva: 52,
			max_rof: 75,
			skill: {
				name: "Blazar",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description: "[Passive]: When attacking enemies ahead of self, increases damage by #1. [Active]: Increases damage by #2 and prioritise the closest enemy ahead for #3 seconds.",
				number_of_stats: 3,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: ["30%", "34%", "38%", "42%", "46%", "49%", "53%", "57%", "61%", "65%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [2, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG and AR",
				number_of_stats: 1,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Starry Night Catnapper"],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true]
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 307,
			name: "ZB-26",
			type: "MG",
			rarity: 5,
			max_hp: 182,
			max_dmg: 100,
			max_acc: 30,
			max_eva: 31,
			max_rof: 116,
			skill: {
				name: "Perfect Chain",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"[Passive]: After each reload, grants +1 ammo to other machine guns in the echelon and reduce self reload time by 20%, up to 60% max. [Active]: Immediately complete a special reload and obtain #1 additional ammo. When using additional ammo, increases damage and accuracy by #2.",
				number_of_stats: 2,
				stat1: ["+3", "+4", "+4", "+5", "+5", "+6", "+6", "+7", "+7", "+8"],
				stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Armor by "],
				stat2: ["15%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Cape of Fluttering Dreams"],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true]
			},
			animations_dorm: {
				hasActionAnimation: [true],
				hasSit2Animation: [false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 308,
			name: "C14",
			type: "RF",
			rarity: 3,
			max_hp: 94,
			max_dmg: 128,
			max_acc: 77,
			max_eva: 29,
			max_rof: 32,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 309,
			name: "WKp",
			type: "HG",
			rarity: 3,
			max_hp: 80,
			max_dmg: 41,
			max_acc: 49,
			max_eva: 65,
			max_rof: 44,
			skill: {
				name: "Nightfire",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"[Passive]: Deals #1 dummy-link-ignoring damage to the attacked target in a 1.5 unit radius. [Active]: During night battles, prioritize targets which have not attacked yet, checking enemies for #2 seconds. Enemies damaged by this skill have their evasion decreased by #3 for #4 seconds. (Stacks once, Can only be used during night)",
				number_of_stats: 4,
				stat1: ["0.1x", "0.11x", "0.12x", "0.13x", "0.15x", "0.16x", "0.17x", "0.18x", "0.19x", "0.2x"],
				stat2: [3, 3.2, 3.5, 3.7, 3.9, 4.2, 4.4, 4.6, 4.8, 5],
				stat3: ["65%", "67%", "70%", "73%", "76%", "78%", "81%", "84%", "87%", "90%"],
				stat4: [2, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 3]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 310,
			name: "Rex Zero 1",
			type: "HG",
			rarity: 4,
			max_hp: 70,
			max_dmg: 31,
			max_acc: 56,
			max_eva: 74,
			max_rof: 61,
			skill: {
				name: "Intersecting Support",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Grants a #1 HP shield to the T-Doll in the leader position; increases the damage of the remaining T-Dolls by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["+5", "+8", "+11", "+14", "+17", "+20", "+23", "+26", "+29", "+32"],
				stat2: ["10%", "11%", "13%", "14%", "15%", "17%", "18%", "19%", "21%", "22%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 2, 1],
				row2: [1, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 311,
			name: "Lusa",
			type: "HG",
			rarity: 5,
			max_hp: 205,
			max_dmg: 29,
			max_acc: 13,
			max_eva: 69,
			max_rof: 94,
			skill: {
				name: "Tactical Training",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					'[Passive]: For every 20% Max HP lost, grants self a #1 HP shield. [Active]: Reduces incoming damage taken by #2 and grants self a "Taunt" effect for #3 seconds. [Taunt]: Enemies\' basic attacks and strengthened attacks will prioritize targets with "Taunt" within attack range.',
				number_of_stats: 3,
				stat1: ["+10", "+11", "+12", "+13", "+14", "+16", "+17", "+18", "+19", "+20"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 2, 1],
				row2: [1, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 312,
			name: "VSK-94",
			type: "RF",
			rarity: 5,
			max_hp: 88,
			max_dmg: 133,
			max_acc: 79,
			max_eva: 32,
			max_rof: 38,
			skill: {
				name: "Double Guard",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increase self damage by #1 of self accuracy before skill activation for #2 seconds. The first #3 attacks after skill activation deal 2 hits.",
				number_of_stats: 3,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [3, 3.2, 3.5, 3.7, 3.9, 4.2, 4.4, 4.6, 4.8, 5],
				stat3: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 313,
			name: "Steyr ACR",
			type: "AR",
			rarity: 5,
			max_hp: 124,
			max_dmg: 46,
			max_acc: 45,
			max_eva: 42,
			max_rof: 91,
			skill: {
				name: "Ode to the Dawn Carnival",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					"[Passive]: For every stat reduction effect on self, increase final damage by #1 (stacks additively). [Active]: Swaps to Focus mode, reducing self rate of fire by #2, movement speed and evasion by #3; Increases self damage by #4, accuracy by #5, critical damage by #6 for #7 seconds.",
				number_of_stats: 7,
				stat1: ["3%", "3.2%", "3.4%", "3.7%", "3.9%", "4.1%", "4.3%", "4.6%", "4.8%", "5%"],
				stat2: ["30%", "29%", "28%", "27%", "26%", "25%", "24%", "23%", "22%", "20%"],
				stat3: ["50%", "48%", "46%", "43%", "41%", "39%", "37%", "34%", "32%", "30%"],
				stat4: ["15%", "17%", "20%", "22%", "24%", "27%", "29%", "31%", "33%", "35%"],
				stat5: ["25%", "29%", "33%", "37%", "40%", "44%", "48%", "52%", "56%", "60%"],
				stat6: ["30%", "32%", "35%", "37%", "39%", "42%", "44%", "46%", "48%", "50%"],
				stat7: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 1],
				row3: [0, 2, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 314,
			name: "StG-940",
			type: "AR",
			rarity: 3,
			max_hp: 110,
			max_dmg: 50,
			max_acc: 49,
			max_eva: 44,
			max_rof: 69,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1, rate of fire by #2 and accuracy by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat2: ["12%", "14%", "16%", "18%", "20%", "22%", "24%", "26%", "28%", "30%"],
				stat3: ["30%", "36%", "41%", "47%", "52%", "58%", "63%", "69%", "74%", "80%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Evasion by "],
				stat2: ["15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 315,
			name: "AUG Para",
			type: "SMG",
			rarity: 5,
			max_hp: 185,
			max_dmg: 29,
			max_acc: 15,
			max_eva: 83,
			max_rof: 88,
			skill: {
				name: "Cognitive Transformation",
				initial_cooldown: "1s",
				cooldown: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				description:
					"Activate the skill to switch between modes: [Offense Focused]: Every #1 seconds, converts own evasion into both damage and accuracy. Every -1 point of evasion is converted to +2 points of damage and +1 point of accuracy. Conversion stops when evasion is lower than #2. [Evasion Focused]: Every #3 seconds, converts own damage and accuracy into evasion. Every -1 point of damage and accuracy is converted into +4 points of evasion. Conversion stops when damage is lower than #4 or accuracy is lower than #5. Stat changes from either conversion is applied after other stat modifiers, and converted stats will not disappear as a result of other modifiers expiring. After changing modes, prioritize restoring the converted stats first.",
				number_of_stats: 5,
				stat1: [0.2, 0.2, 0.167, 0.167, 0.167, 0.133, 0.133, 0.133, 0.1, 0.1],
				stat2: [85, 84, 83, 82, 81, 80, 79, 78, 77, 75],
				stat3: [0.2, 0.2, 0.167, 0.167, 0.167, 0.133, 0.133, 0.133, 0.1, 0.1],
				stat4: [50, 49, 48, 47, 45, 43, 41, 39, 37, 35],
				stat5: [35, 34, 33, 32, 31, 30, 29, 37, 25, 23]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["15%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 316,
			name: "General Liu",
			type: "RF",
			rarity: 5,
			max_hp: 80,
			max_dmg: 139,
			max_acc: 88,
			max_eva: 30,
			max_rof: 40,
			skill: {
				name: "Shared Hatred",
				initial_cooldown: "1s",
				cooldown: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				passive_active_description: true,
				description:
					"[Passive]: At the start of battle, summon 3 reinforcement T-Dolls with 3 dummy links each to the rear of the echelon. Each reinforcement has 5 HP per dummy link and inherits the following stats from General Liu; #1 damage, #2 rate of fire and #3 accuracy. The remaining stats and targeting mode are also the same as General Liu. [Active]: Activate the skill to switch between the following modes: [Rear-Focus (default)]: Reduces own rate of fire by 10% and increases own damage by 20% and targets the furthest enemy from self. [Vanguard-Focus]: Reduces own damage by 10% and increases own rate of fire by 20% and targets the nearest enemy from self.",
				number_of_stats: 3,
				stat1: ["20%", "21%", "22%", "23%", "25%", "27%", "29%", "31%", "33%", "35%"],
				stat2: ["45%", "46%", "47%", "48%", "50%", "52%", "54%", "56%", "58%", "60%"],
				stat3: ["25%", "26%", "27%", "28%", "30%", "32%", "34%", "36%", "38%", "40%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [2, 1, 0],
				row3: [1, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 317,
			name: "Mondragon",
			type: "RF",
			rarity: 4,
			max_hp: 84,
			max_dmg: 112,
			max_acc: 74,
			max_eva: 34,
			max_rof: 41,
			skill: {
				name: "Conviction of Certain Victory",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"[Passive]: If currently assigned as an echelons leader, permanently reduces own rate of fire by 35% while increasing allied Rifles' critical hit rate by #1 and critical hit damage by #2. [Active]: When skill is activated, allies on her tiles gain #3 damage and #4 rate of fire for #5 seconds.",
				number_of_stats: 5,
				stat1: ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "20%"],
				stat2: ["5%", "5.5%", "6%", "6.5%", "7%", "7.5%", "8%", "8.5%", "9%", "10%"],
				stat3: ["10%", "10.5%", "11%", "11.5%", "12%", "12.5%", "13%", "13.5%", "14%", "15%"],
				stat4: ["6%", "6.5%", "7%", "7.5%", "8%", "8.5%", "9%", "10%", "11%", "12%"],
				stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs RF",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 318,
			name: "VHS",
			type: "AR",
			rarity: 5,
			max_hp: 116,
			max_dmg: 57,
			max_acc: 54,
			max_eva: 47,
			max_rof: 78,
			skill: {
				name: "Destructor Intrusion",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					'[Passive]: Obtains +1 stack of "Destruct" every second. For every stack of "Destruct" currently active, increases own final damage by #1 up to a max of 10 stacks. [Active]: Consumes all stacks of "Destruct" and obtains damage/accuracy/rate of fire equivalent to the stat of the enemies with the highest respective stat. The stat gain is capped at #2 of self damage, #3 of self accuracy and #4 of self rate of fire. The effect lasts for #5 seconds and no stacks of "Destruct" can be gained throughout the skills duration.',
				number_of_stats: 5,
				stat1: ["1.6%", "1.7%", "1.8%", "1.9%", "2%", "2.1%", "2.2%", "2.3%", "2.4%", "2.5%"],
				stat2: ["25%", "27%", "30%", "32%", "34%", "36%", "39%", "41%", "43%", "45%"],
				stat3: ["50%", "53%", "56%", "59%", "62%", "65%", "68%", "72%", "76%", "80%"],
				stat4: ["20%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "37%", "40%"],
				stat5: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["30%", "18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 319,
			name: "PM1910",
			type: "MG",
			rarity: 4,
			max_hp: 190,
			max_dmg: 90,
			max_acc: 27,
			max_eva: 25,
			max_rof: 104,
			skill: {
				name: "Spreading Bloodthirst",
				initial_cooldown: "3s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"[Passive]: During reloading state, allies on her tiles gain #1 evasion, whereas allies not on her tiles gain #2 damage. [Active]: Extends the current volley by +12 ammo. When using additional ammo, increases own accuracy by #3 and extends the next reload time by 4 seconds.",
				number_of_stats: 3,
				stat1: ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "20%"],
				stat2: ["5%", "5.5%", "6%", "6.5%", "7%", "7.5%", "8%", "8.5%", "9%", "10%"],
				stat3: ["50%", "53%", "56%", "59%", "62%", "65%", "68%", "72%", "76%", "80%"]
			},
			tile_set: {
				row1: [2, 1, 0],
				row2: [0, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Armor by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 320,
			name: "GM6 Lynx",
			type: "RF",
			rarity: 3,
			max_hp: 84,
			max_dmg: 135,
			max_acc: 75,
			max_eva: 30,
			max_rof: 33,
			skill: {
				name: "Rapid Firing",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, shoot the current target thrice, dealing #1 ~ #2 damage per shot based on the current number of charge stacks, taking 0.5 seconds to aim before each shot. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7],
				stat2: ["1.6x", "1.7x", "1.8x", "2x", "2.2x", "2.4x", "2.6x", "2.8x", "3x", "3.2x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
];
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// END OF #301-#400 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//console.log("Now processing images and animations for #301-#400 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for #301-#400 T-Doll Index JSON.");

export default tdolls;
