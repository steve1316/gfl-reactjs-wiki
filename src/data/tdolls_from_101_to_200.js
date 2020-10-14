/*
    This array of T-Dolls will contain information about index #101 to #200 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// START OF #101-#200 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	{
		normal: {
			id: 101,
			name: "UMP9",
			type: "SMG",
			rarity: 4,
			max_hp: 176,
			max_dmg: 26,
			max_acc: 14,
			max_eva: 76,
			max_rof: 87,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["30%", "12%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 101,
			name: "UMP9 Mod",
			type: "SMG",
			rarity: 5,
			max_hp: 181,
			max_dmg: 29,
			max_acc: 18,
			max_eva: 84,
			max_rof: 87,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2.5, 2.7, 2.9, 3.2, 3.4, 3.6, 3.8, 4.1, 4.3, 4.5]
			},
			skill2: {
				name: "Snow Owl's Roar",
				initial_cooldown: "Passive",
				description:
					"If the main target of the flashbang was not stunned or is already dead, grants a #1 HP shield and #2 evasion to self and allies on the same column for #3 seconds. If the main target of the flashbang was stunned, increase the damage of self and allies on the same column by #4 for #5 seconds.",
				number_of_stats: 5,
				stat1: [15, 16, 17, 18, 19, 21, 22, 23, 24, 25],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat4: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["30%", "15%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 4,
			skin_names: ["Am I Late?", "Song of the World", "Shiba Inu Scout", "Wish-Giving Fireworks Magician"],
			animations: {
				hasSkillAnimation: [true, true, true, true],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 102,
			name: "UMP40",
			type: "SMG",
			rarity: 4,
			max_hp: 180,
			max_dmg: 27,
			max_acc: 14,
			max_eva: 75,
			max_rof: 85,
			skill: {
				name: "Etching Overload",
				initial_cooldown: "1s",
				cooldown: [666, 666, 666, 666, 666, 666, 666, 666, 666, 666],
				passive_active_description: true,
				description:
					"Passive: Before activation, increase evasion by 10% and decrease damage by 5% every 2 seconds, 5 stacks maximum. Active: Clear all passive stacks, increase damage by #1 and decrease evasion by #2 every 2 seconds, 5 stacks maximum.",
				number_of_stats: 2,
				stat1: ["20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "30%"],
				stat2: ["20%", "21%", "21%", "22%", "22%", "23%", "23%", "24%", "24%", "25%"]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Critical Rate by "],
				stat2: ["500%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Wish-Protecting Maiden of Shadows"],
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
			id: 103,
			name: "UMP45",
			type: "SMG",
			rarity: 4,
			max_hp: 185,
			max_dmg: 28,
			max_acc: 13,
			max_eva: 74,
			max_rof: 82,
			skill: {
				name: "Smoke Grenade",
				initial_cooldown: "1s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
				number_of_stats: 3,
				stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["18%", "30%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 103,
			name: "UMP45 Mod",
			type: "SMG",
			rarity: 5,
			max_hp: 195,
			max_dmg: 29,
			max_acc: 14,
			max_eva: 77,
			max_rof: 83,
			skill: {
				name: "Smoke Grenade",
				initial_cooldown: "1s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
				number_of_stats: 3,
				stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat2: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
			},
			skill2: {
				name: "Mist Trap",
				initial_cooldown: "Passive",
				description:
					"2 seconds after the smoke grenade takes effect, targets affected by the smoke grenade will be hacked every 2 seconds. Hacked targets will enter a short-circuited state, receiving #1 fixed damage every attack. Short-circuit state lasts for 5 seconds.",
				number_of_stats: 1,
				stat1: [23, 26, 29, 32, 35, 38, 41, 44, 47, 50]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["20%", "30%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 5,
			skin_names: ["Just This Time.", "Diamond Flower", "Winter Journey", "Lop-Eared Rabbit Agent", "Hopeful Fireworks Magician"],
			animations: {
				hasSkillAnimation: [true, true, true, true, true],
				hasVictoryLoopAnimation: [true, true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false, false, false, false],
				hasSit2Animation: [false, false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 104,
			name: "G36C",
			type: "SMG",
			rarity: 5,
			max_hp: 203,
			max_dmg: 32,
			max_acc: 12,
			max_eva: 65,
			max_rof: 83,
			skill: {
				name: "Force Shield",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Grants self a barrier with a Defense value of 9999 (Max value of 9999), reducing incoming damage by a percentage (100% if at max Defense value) for #1 seconds.",
				number_of_stats: 1,
				stat1: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["10%", "8%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Ode to Summer", "You Who Takes the Step", "Burning-Eyed G36C"],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false, false],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 105,
			name: "OTs-12",
			type: "AR",
			rarity: 3,
			max_hp: 105,
			max_dmg: 42,
			max_acc: 54,
			max_eva: 54,
			max_rof: 72,
			skill: {
				name: "Assault Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
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
			skin_names: ["Blossoming Flowers"],
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
			id: 106,
			name: "FAL",
			type: "AR",
			rarity: 5,
			max_hp: 132,
			max_dmg: 57,
			max_acc: 43,
			max_eva: 38,
			max_rof: 72,
			skill: {
				name: "Grenade Salvo",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches 3 grenades consecutively that deals #1 damage to enemies within a radius of 1.5 units.",
				number_of_stats: 1,
				stat1: ["2.5x", "2.8x", "3.1x", "3.3x", "3.6x", "3.9x", "4.2x", "4.4x", "4.7x", "5x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Evasion by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Winter Supply Operation", "The Big Day", "FAL's Summer"],
			animations: {
				hasSkillAnimation: [true, true, true],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, true],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 107,
			name: "F2000",
			type: "AR",
			rarity: 2,
			max_hp: 105,
			max_dmg: 42,
			max_acc: 44,
			max_eva: 40,
			max_rof: 81,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Damage by "],
				stat2: ["10%", "20%"]
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
			id: 108,
			name: "CZ-805",
			type: "AR",
			rarity: 3,
			max_hp: 116,
			max_dmg: 43,
			max_acc: 49,
			max_eva: 41,
			max_rof: 75,
			skill: {
				name: "High-Explosive Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
				number_of_stats: 1,
				stat1: ["1.8/0.7/0.4x", "2.1/0.8/0.5x", "2.4/0.9/0.5x", "2.7/1.1/0.6x", "3/1.2/0.7x", "3.3/1.3/0.7x", "3.6/1.4/0.8x", "3.9/1.7/0.9x", "4.2/1.8/0.9x", "4.5/1.8/1x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["50%", "25%"]
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
			id: 109,
			name: "MG5",
			type: "MG",
			rarity: 5,
			max_hp: 198,
			max_dmg: 85,
			max_acc: 27,
			max_eva: 27,
			max_rof: 120,
			skill: {
				name: "Terminating Barrage",
				initial_cooldown: "Passive",
				description: "After every 3 hits, the next hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["1.5x", "1.7x", "1.8x", "2x", "2.2x", "2.3x", "2.5x", "2.7x", "2.8x", "3x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
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
		skins: {
			number_of_skins: 4,
			skin_names: ["Crimson Guardian", "Wild Hunter", "Knight of Pestilence", "Dark Tea Stalks"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, true, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 110,
			name: "FG42",
			type: "MG",
			rarity: 2,
			max_hp: 149,
			max_dmg: 87,
			max_acc: 28,
			max_eva: 33,
			max_rof: 121,
			skill: {
				name: "Hunting Impulse",
				initial_cooldown: "3s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases accuracy by #1 and all hits will be criticals for #2 seconds.",
				number_of_stats: 2,
				stat1: ["22%", "26%", "30%", "35%", "39%", "43%", "47%", "52%", "56%", "60%"],
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Accuracy by "],
				stat2: ["30%"]
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
			id: 111,
			name: "AAT-52",
			type: "MG",
			rarity: 2,
			max_hp: 182,
			max_dmg: 79,
			max_acc: 24,
			max_eva: 22,
			max_rof: 118,
			skill: {
				name: "Damage Focus N-MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["32%", "38%", "44%", "50%", "56%", "61%", "67%", "73%", "79%", "85%"],
				stat2: ["10%", "12%", "14%", "17%", "19%", "21%", "23%", "26%", "28%", "30%"],
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [2, 0, 0],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
				stat2: ["20%"]
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
			id: 112,
			name: "Negev",
			type: "MG",
			rarity: 5,
			max_hp: 174,
			max_dmg: 84,
			max_acc: 35,
			max_eva: 36,
			max_rof: 139,
			skill: {
				name: "Manic Blood",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 after every reload. Can be stacked up to 3 times for 25 seconds.",
				number_of_stats: 1,
				stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Armor by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Little Vagrant", "Obsidian Princess"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, true]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 113,
			name: "Serdyukov",
			type: "HG",
			rarity: 3,
			max_hp: 70,
			max_dmg: 33,
			max_acc: 58,
			max_eva: 68,
			max_rof: 59,
			skill: {
				name: "Fire Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "40%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Black Crow Lifeguard"],
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
			id: 114,
			name: "Welrod MkII",
			type: "HG",
			rarity: 5,
			max_hp: 80,
			max_dmg: 28,
			max_acc: 71,
			max_eva: 90,
			max_rof: 52,
			skill: {
				name: "Precision Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["30%", "32%", "33%", "35%", "37%", "38%", "40%", "42%", "43%", "45%"],
				stat2: [4, 4, 4, 5, 5, 5, 5, 6, 6, 6]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["20%", "16%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["English in Love", "Lord of Darkness", "Twilight Menace"],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 115,
			name: "Suomi",
			type: "SMG",
			rarity: 5,
			max_hp: 220,
			max_dmg: 28,
			max_acc: 15,
			max_eva: 56,
			max_rof: 93,
			skill: {
				name: "Cover Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["80%", "88%", "96%", "103%", "111%", "119%", "127%", "134%", "142%", "150%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["15%", "30%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Korvantunturi Pixie", "Midsummer Pixie", "Mission for Happiness"],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true, false],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 116,
			name: "Z-62",
			type: "SMG",
			rarity: 3,
			max_hp: 168,
			max_dmg: 28,
			max_acc: 15,
			max_eva: 77,
			max_rof: 77,
			skill: {
				name: "Incendiary Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"],
				stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["12%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Swimming Question"],
			animations: {
				hasSkillAnimation: [true],
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
			id: 117,
			name: "PSG-1",
			type: "RF",
			rarity: 4,
			max_hp: 93,
			max_dmg: 120,
			max_acc: 73,
			max_eva: 26,
			max_rof: 39,
			skill: {
				name: "Designated Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the furthest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
				stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"]
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
			skin_names: ["Phantom Assaulter"],
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
			id: 118,
			name: "9A-91",
			type: "AR",
			rarity: 4,
			max_hp: 116,
			max_dmg: 42,
			max_acc: 49,
			max_eva: 50,
			max_rof: 78,
			skill: {
				name: "Damage Focus N",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["110%", "118%", "126%", "133%", "141%", "149%", "157%", "164%", "172%", "180%"],
				stat2: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Rate of Fire by "],
				stat2: ["15%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Bullets Cafe", "Purifying Arrow, Flowers and Dreams"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 119,
			name: "OTs-14",
			type: "AR",
			rarity: 5,
			max_hp: 110,
			max_dmg: 49,
			max_acc: 54,
			max_eva: 54,
			max_rof: 75,
			skill: {
				name: "Damage Focus N",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["120%", "129%", "138%", "147%", "156%", "164%", "173%", "182%", "191%", "200%"],
				stat2: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["65%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Flurry of Petals", "Crassula Volkensii", "Dinner Dictator"],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false, false],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 120,
			name: "ARX-160",
			type: "AR",
			rarity: 3,
			max_hp: 99,
			max_dmg: 49,
			max_acc: 48,
			max_eva: 48,
			max_rof: 73,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["4.5x", "5.2x", "5.9x", "6.7x", "7.4x", "8.1x", "8.8x", "9.6x", "10.3x", "11x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["50%", "25%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 121,
	// 		name: "Mk48",
	// 		type: "MG",
	// 		rarity: 4,
	// 		max_hp: 174,
	// 		max_dmg: 90,
	// 		max_acc: 25,
	// 		max_eva: 26,
	// 		max_rof: 112,
	// 		skill: {
	// 			name: "Hunting Impulse",
	// 			initial_cooldown: "3s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases accuracy by #1 and all hits will be criticals for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "34%", "39%", "43%", "48%", "52%", "57%", "61%", "66%", "70%"],
	// 			stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Damage by "],
	// 			stat2: ["50%", "25%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Smoke Signal"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 122,
	// 		name: "G11",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 121,
	// 		max_dmg: 43,
	// 		max_acc: 44,
	// 		max_eva: 41,
	// 		max_rof: 95,
	// 		skill: {
	// 			name: "Eye of the Assaulter",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Each attack will deal #1 hits on the target for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
	// 			stat2: [3, 3.2, 3.3, 3.5, 3.7, 3.8, 4, 4.2, 4.3, 4.5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Evasion by ", "Damage by "],
	// 			stat2: ["10%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 122,
	// 		name: "G11 Mod",
	// 		type: "AR",
	// 		rarity: 6,
	// 		max_hp: 124,
	// 		max_dmg: 48,
	// 		max_acc: 48,
	// 		max_eva: 44,
	// 		max_rof: 97,
	// 		skill: {
	// 			name: "Eye of the Assaulter",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Each attack will deal #1 hits on the target for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
	// 			stat2: [3.5, 3.7, 3.9, 4, 4.2, 4.3, 4.5, 4.7, 4.8, 5]
	// 		},
	// 		skill2: {
	// 			name: "Stance of the Assaulter",
	// 			initial_cooldown: "Passive",
	// 			description:
	// 				"For every 3 hits on the same enemy, deal an extra hit that does damage equal to #1 of the enemy's max HP. The extra hit is affected by armor but ignores HP shields, and cannot exceed #2 of self damage.",
	// 			number_of_stats: 2,
	// 			stat1: ["1%", "1.1%", "1.2%", "1.3%", "1.4%", "1.5%", "1.7%", "1.8%", "1.9%", "2%"],
	// 			stat2: ["120%", "140%", "160%", "180%", "200%", "220%", "240%", "260%", "280%", "300%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Evasion by ", "Damage by "],
	// 			stat2: ["12%", "35%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 5,
	// 		skin_names: ["Neet Zombie", "Most Beautiful Gift of Mine", "Dragon Jr.", "Lucky Mouse's Sleepy New Year", "Courage-Seeking Rex Bunny"],
	// 		animations: {
	// 			hasSkillAnimation: [, false, false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false, false, false],
	// 			hasSit2Animation: [false, false, false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 123,
	// 		name: "P99",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 60,
	// 		max_dmg: 31,
	// 		max_acc: 56,
	// 		max_eva: 87,
	// 		max_rof: 61,
	// 		skill: {
	// 			name: "Cover Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increase all allies' evasion by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Evasion by "],
	// 			stat2: ["12%", "36%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 124,
	// 		name: "Super SASS",
	// 		type: "RF",
	// 		rarity: 3,
	// 		max_hp: 88,
	// 		max_dmg: 115,
	// 		max_acc: 65,
	// 		max_eva: 27,
	// 		max_rof: 39,
	// 		skill: {
	// 			name: "Aimed Shot",
	// 			initial_cooldown: "5s",
	// 			cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
	// 			stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 124,
	// 		name: "Super SASS Mod",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 91,
	// 		max_dmg: 125,
	// 		max_acc: 73,
	// 		max_eva: 31,
	// 		max_rof: 40,
	// 		skill: {
	// 			name: "Aimed Snipe",
	// 			initial_cooldown: "5s",
	// 			cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to an enemy with the highest HP based on the current number of charge stacks. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
	// 			stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"]
	// 		},
	// 		skill: {
	// 			name: "Sniper's Pursuit",
	// 			initial_cooldown: "Passive",
	// 			passive_passive_description: true,
	// 			description:
	// 				'Passive: When "Aimed Snipe" fails to kill an enemy, repeatedly snipe the target based on the number of charge stacks, until the target dies or the charges run out. The additional snipes are strengthened auto-attacks, dealing 1x damage with perfect accuracy. This shot can do critical damage, but doesn\'t ignore armor. Passive: Increases damage of normal attacks and skills by #1 when attacking enemies with less than 50% HP.',
	// 			number_of_stats: 1,
	// 			stat1: ["5%", "5.5%", "6%", "6.5%", "7%", "7.5%", "8%", "8.5%", "9%", "10%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Wolfwalker"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 125,
	// 		name: "MG4",
	// 		type: "MG",
	// 		rarity: 5,
	// 		max_hp: 182,
	// 		max_dmg: 84,
	// 		max_acc: 34,
	// 		max_eva: 34,
	// 		max_rof: 139,
	// 		skill: {
	// 			name: "Lock and Load",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "32%", "33%", "35%"],
	// 			stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
	// 			stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Armor by "],
	// 			stat2: ["12%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Survival Club Member"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 126,
	// 		name: "NZ75",
	// 		type: "HG",
	// 		rarity: 5,
	// 		max_hp: 73,
	// 		max_dmg: 33,
	// 		max_acc: 62,
	// 		max_eva: 74,
	// 		max_rof: 63,
	// 		skill: {
	// 			name: "Assault Suppression",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' rate of fire by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["18%", "19%", "21%", "22%", "23%", "25%", "26%", "27%", "29%", "30%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 1],
	// 			row2: [1, 2, 1],
	// 			row3: [0, 1, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Evasion by "],
	// 			stat2: ["20%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Golden Coreopsis", "ThanX! and Go2Hell!"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 127,
	// 		name: "Type 79",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 194,
	// 		max_dmg: 32,
	// 		max_acc: 12,
	// 		max_eva: 70,
	// 		max_rof: 88,
	// 		skill: {
	// 			name: "Stun Grenade",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [2.5, 2.7, 2.9, 3.2, 3.4, 3.6, 3.8, 4.1, 4.3, 4.5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Fox of Green Hill", "Fox Steps in a Starry Evening"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 128,
	// 		name: "M99",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 88,
	// 		max_dmg: 157,
	// 		max_acc: 81,
	// 		max_eva: 32,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Designated Shot",
	// 			initial_cooldown: "5s",
	// 			cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the furthest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [2.2, 2.3, 2.5, 2.6, 2.7, 2.9, 3, 3.1, 3.3, 3.4],
	// 			stat2: ["3.5x", "4x", "4.5x", "5x", "5.5x", "6x", "6.5x", "7x", "7.5x", "8x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Cyclamen", "Rabbit Squad", "White Rabbit's Summer Party"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 129,
	// 		name: "Type 95",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 116,
	// 		max_dmg: 55,
	// 		max_acc: 52,
	// 		max_eva: 46,
	// 		max_rof: 71,
	// 		skill: {
	// 			name: "Damage Focus T",
	// 			initial_cooldown: "2s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Evasion by "],
	// 			stat2: ["10%", "18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Jade Noisette Rose", "Summer Cicada", "Pure White Graduation"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 130,
	// 		name: "Type 97",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 116,
	// 		max_dmg: 54,
	// 		max_acc: 51,
	// 		max_eva: 46,
	// 		max_rof: 72,
	// 		skill: {
	// 			name: "Damage Focus T",
	// 			initial_cooldown: "2s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Evasion by "],
	// 			stat2: ["10%", "18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Peony Chief", "The 'Late to School' Performance"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 131,
	// 		name: "EVO 3",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 194,
	// 		max_dmg: 23,
	// 		max_acc: 13,
	// 		max_eva: 68,
	// 		max_rof: 93,
	// 		skill: {
	// 			name: "Hand Grenade",
	// 			initial_cooldown: "3s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
	// 			number_of_stats: 1,
	// 			stat1: ["2x", "2.4x", "2.9x", "3.3x", "3.8x", "4.2x", "4.7x", "5.1x", "5.6x", "6x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 1,
	// 			stat1: ["Accuracy by "],
	// 			stat2: ["55%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["White Night Star Whispers", "EVO 3's Dawn"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 132,
	// 		name: "Type 59",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 60,
	// 		max_dmg: 28,
	// 		max_acc: 61,
	// 		max_eva: 96,
	// 		max_rof: 61,
	// 		skill: {
	// 			name: "Cover Suppression N",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "During nighttime, decrease all enemies' evasion by #1 (#2 during the day) for #3 seconds (#4 seconds during the day).",
	// 			number_of_stats: 4,
	// 			stat1: ["55%", "57%", "59%", "62%", "64%", "66%", "68%", "71%", "73%", "75%"],
	// 			stat2: ["30%", "31%", "32%", "33%", "34%", "36%", "37%", "38%", "39%", "40%"],
	// 			stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
	// 			stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 1, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["20%", "50%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Fairy Primrose"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 133,
	// 		name: "Type 63",
	// 		type: "AR",
	// 		rarity: 2,
	// 		max_hp: 99,
	// 		max_dmg: 51,
	// 		max_acc: 40,
	// 		max_eva: 40,
	// 		max_rof: 73,
	// 		skill: {
	// 			name: "Precision Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases accuracy by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["200%", "233%", "267%", "300%", "333%", "367%", "400%", "433%", "467%", "500%"],
	// 			stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Rate of Fire by "],
	// 			stat2: ["10%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Yellow Phoenix"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 134,
	// 		name: "AR70",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 110,
	// 		max_dmg: 50,
	// 		max_acc: 44,
	// 		max_eva: 41,
	// 		max_rof: 71,
	// 		skill: {
	// 			name: "Anti-Personnel Grenade",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
	// 			number_of_stats: 1,
	// 			stat1: ["4.5x", "5.2x", "5.9x", "6.7x", "7.4x", "8.1x", "8.8x", "9.6x", "10.3x", "11x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["16%", "75%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 135,
	// 		name: "SR-3MP",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 194,
	// 		max_dmg: 31,
	// 		max_acc: 12,
	// 		max_eva: 67,
	// 		max_rof: 90,
	// 		skill: {
	// 			name: "Damage Focus",
	// 			initial_cooldown: "4s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["160%", "171%", "182%", "193%", "204%", "216%", "227%", "238%", "249%", "260%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Critical Rate by "],
	// 			stat2: ["18%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Black Rabbit Macchiato", "Special Attack Squad Leader Bunny", "Shrine Maidens Super Lucky Draw"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 136,
	// 		name: "PP-19",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 176,
	// 		max_dmg: 26,
	// 		max_acc: 14,
	// 		max_eva: 74,
	// 		max_rof: 91,
	// 		skill: {
	// 			name: "Hand Grenade",
	// 			initial_cooldown: "3s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
	// 			number_of_stats: 1,
	// 			stat1: ["2.2x", "2.7x", "3.2x", "3.6x", "4.1x", "4.6x", "5.1x", "5.5x", "6x", "6.5x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["24%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Little Frog Princess", "Freezing Summer"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 137,
	// 		name: "PP-19-01",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 194,
	// 		max_dmg: 27,
	// 		max_acc: 13,
	// 		max_eva: 68,
	// 		max_rof: 85,
	// 		skill: {
	// 			name: "Smoke Grenade",
	// 			initial_cooldown: "1s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
	// 			stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["12%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Carbonated Fizzy Candy"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 138,
	// 		name: "6P62",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 121,
	// 		max_dmg: 69,
	// 		max_acc: 37,
	// 		max_eva: 33,
	// 		max_rof: 54,
	// 		skill: {
	// 			name: "Raid Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 and accuracy by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["15%", "17%", "19%", "22%", "24%", "26%", "28%", "31%", "33%", "35%"],
	// 			stat2: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["35%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Battle Sailor"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 139,
	// 		name: "Bren Ten",
	// 		type: "HG",
	// 		rarity: 2,
	// 		max_hp: 70,
	// 		max_dmg: 31,
	// 		max_acc: 51,
	// 		max_eva: 63,
	// 		max_rof: 58,
	// 		skill: {
	// 			name: "Fire Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increase all allies' damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["10%", "11%", "12%", "13%", "14%", "14%", "15%", "16%", "17%", "18%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [1, 2, 1],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Rate of Fire by "],
	// 			stat2: ["16%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 140,
	// 		name: "PSM",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 57,
	// 		max_dmg: 24,
	// 		max_acc: 67,
	// 		max_eva: 112,
	// 		max_rof: 65,
	// 		skill: {
	// 			name: "Conceal Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increase all allies' accuracy by #1 and evasion by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
	// 			stat1: ["16%", "17%", "19%", "20%", "21%", "23%", "24%", "25%", "27%", "28%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [1, 2, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Evasion by "],
	// 			stat2: ["56%", "36%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 141,
	// 		name: "USP Compact",
	// 		type: "HG",
	// 		rarity: 2,
	// 		max_hp: 66,
	// 		max_dmg: 24,
	// 		max_acc: 60,
	// 		max_eva: 86,
	// 		max_rof: 64,
	// 		skill: {
	// 			name: "Precision Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increases all allies' accuracy by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 1,
	// 			stat1: ["Rate of Fire by "],
	// 			stat2: ["28%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 142,
	// 		name: "Five-seveN",
	// 		type: "HG",
	// 		rarity: 5,
	// 		max_hp: 63,
	// 		max_dmg: 31,
	// 		max_acc: 57,
	// 		max_eva: 97,
	// 		max_rof: 66,
	// 		skill: {
	// 			name: "Piercing Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increases all allies' rate of fire by #1 and critical rate by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["12%", "13%", "14%", "15%", "16%", "16%", "17%", "18%", "19%", "20%"],
	// 			stat1: ["12%", "13%", "14%", "15%", "16%", "16%", "17%", "18%", "19%", "20%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Critical Rate by "],
	// 			stat2: ["30%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 4,
	// 		skin_names: ["Cruise Queen", "Smile of Acceptance", "Fenfen's Adventures", "A Blue Christmas"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false, false],
	// 			hasSit2Animation: [false, false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 143,
	// 		name: "RO635",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 194,
	// 		max_dmg: 27,
	// 		max_acc: 14,
	// 		max_eva: 71,
	// 		max_rof: 97,
	// 		skill: {
	// 			name: "Mental Deterrence",
	// 			initial_cooldown: "3s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' damage by #1 and increase self evasion by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat2: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 1, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 1, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["10%", "35%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 143,
	// 		name: "RO635 Mod",
	// 		type: "SMG",
	// 		rarity: 6,
	// 		max_hp: 208,
	// 		max_dmg: 29,
	// 		max_acc: 15,
	// 		max_eva: 77,
	// 		max_rof: 97,
	// 		skill: {
	// 			name: "Mental Deterrence",
	// 			initial_cooldown: "3s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' damage by #1 and accuracy by #2 and increase self evasion by #3 for #4 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat2: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
	// 			stat3: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
	// 			stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 1, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 1, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["15%", "40%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Rule Enforcer", "Defender in the Rye"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 144,
	// 		name: "MT-9",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 203,
	// 		max_dmg: 25,
	// 		max_acc: 13,
	// 		max_eva: 60,
	// 		max_rof: 88,
	// 		skill: {
	// 			name: "Stun Grenade",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [2, 2.2, 2.3, 2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Evasion by ", "Damage by "],
	// 			stat2: ["12%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 145,
	// 		name: "OTs-44",
	// 		type: "RF",
	// 		rarity: 3,
	// 		max_hp: 80,
	// 		max_dmg: 157,
	// 		max_acc: 67,
	// 		max_eva: 32,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Locked Shot",
	// 			initial_cooldown: "8s",
	// 			cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 second, then deal #1 ~ #2 damage to the current enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3],
	// 			stat2: ["3x", "3.4x", "3.8x", "4.2x", "4.6x", "4.9x", "5.3x", "5.7x", "6.1x", "6.5x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Little Reindeer in the Forest", "Super Pig Girl"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 146,
	// 		name: "G28",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 88,
	// 		max_dmg: 119,
	// 		max_acc: 80,
	// 		max_eva: 29,
	// 		max_rof: 39,
	// 		skill: {
	// 			name: "Damage Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["40%", "43%", "46%", "49%", "52%", "55%", "57%", "60%", "63%", "65%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Tropical Storm", "Wiesnbier", "Moonlit Emerald"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 147,
	// 		name: "SSG 69",
	// 		type: "RF",
	// 		rarity: 3,
	// 		max_hp: 80,
	// 		max_dmg: 130,
	// 		max_acc: 82,
	// 		max_eva: 39,
	// 		max_rof: 30,
	// 		skill: {
	// 			name: "Damage Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 148,
	// 		name: "IWS 2000",
	// 		type: "RF",
	// 		rarity: 5,
	// 		max_hp: 88,
	// 		max_dmg: 162,
	// 		max_acc: 78,
	// 		max_eva: 29,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Giant Eagle Assault",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "In return for decreasing rate of fire by #1, increase damage by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "32%", "33%", "35%"],
	// 			stat2: ["80%", "91%", "102%", "113%", "124%", "136%", "147%", "158%", "169%", "180%"],
	// 			stat3: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["The Seventh Banisher", "Edelweiss"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 149,
	// 		name: "AEK-999",
	// 		type: "MG",
	// 		rarity: 4,
	// 		max_hp: 165,
	// 		max_dmg: 89,
	// 		max_acc: 29,
	// 		max_eva: 28,
	// 		max_rof: 120,
	// 		skill: {
	// 			name: "Hunting Impulse N",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "During nighttime, increases damage by #1 (no increase during daytime), accuracy by #2 (#3 during daytime) and causes all hits to be guaranteed critical hits for #4 seconds.",
	// 			number_of_stats: 4,
	// 			stat1: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
	// 			stat2: ["30%", "34%", "39%", "43%", "48%", "52%", "57%", "61%", "66%", "70%"],
	// 			stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
	// 			stat4: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Armor by "],
	// 			stat2: ["15%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Peerless Yakuza Rider"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 150,
	// 		name: "Shipka",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 168,
	// 		max_dmg: 24,
	// 		max_acc: 14,
	// 		max_eva: 79,
	// 		max_rof: 95,
	// 		skill: {
	// 			name: "Cover Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases evasion by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["70%", "77%", "83%", "90%", "97%", "103%", "110%", "117%", "123%", "130%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Evasion by "],
	// 			stat2: ["15%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// }
	// {
	// 	normal: {
	// 		id: 151,
	// 		name: "M1887",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 275,
	// 		max_dmg: 39,
	// 		max_acc: 12,
	// 		max_eva: 12,
	// 		max_rof: 22,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Terminating Shot",
	// 			initial_cooldown: "15s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Inflicts #1 damage to a single target and knocks them back by #2 units.",
	// 			number_of_stats: 2,
	// 			stat1: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
	// 			stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["20%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Law of Exorcism"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [true],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 152,
	// 		name: "M1897",
	// 		type: "SG",
	// 		rarity: 3,
	// 		max_hp: 253,
	// 		max_dmg: 35,
	// 		max_acc: 11,
	// 		max_eva: 11,
	// 		max_rof: 26,
	// 		max_armor: 21,
	// 		skill: {
	// 			name: "Burst Impact",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Performs an additional attack which deals #1 damage and pushes targets back by #2 units.",
	// 			number_of_stats: 2,
	// 			stat1: ["1x", "1.1x", "1.2x", "1.3x", "1.4x", "1.6x", "1.7x", "1.8x", "1.9x", "2x"],
	// 			stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Accuracy by "],
	// 			stat2: ["50%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Electronic Witch", "Blue Sky Patroller"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// }
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 153,
	// 		name: "M37",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 253,
	// 		max_dmg: 33,
	// 		max_acc: 12,
	// 		max_eva: 12,
	// 		max_rof: 26,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Burst Impact",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Performs an additional attack which deals #1 damage and pushes targets back by #2 units.",
	// 			number_of_stats: 2,
	// 			stat1: ["1.2x", "1.3x", "1.5x", "1.6x", "1.8x", "1.9x", "2.1x", "2.2x", "2.4x", "2.5x"],
	// 			stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 0, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Summer Parader"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 154,
	// 		name: "M500",
	// 		type: "SG",
	// 		rarity: 3,
	// 		max_hp: 264,
	// 		max_dmg: 31,
	// 		max_acc: 11,
	// 		max_eva: 10,
	// 		max_rof: 29,
	// 		max_armor: 21,
	// 		skill: {
	// 			name: "Protection Focus",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases own armor rating by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
	// 			stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 2],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 154,
	// 		name: "M500 Mod",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 271,
	// 		max_dmg: 33,
	// 		max_acc: 12,
	// 		max_eva: 11,
	// 		max_rof: 30,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Protection Focus",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases own armor rating by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
	// 			stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		skill2: {
	// 			name: "Hunting Instinct",
	// 			initial_cooldown: "Passive",
	// 			description:
	// 				"When receiving DMG/ROF/EVA/ACC/CRIT/ARMOR increasing effects from skills (including fairy talents), if there is another ally in the same column, grants a #1 HP shield to self and allies in the same column for #2 seconds. Stacks up to 3 times.",
	// 			number_of_stats: 2,
	// 			stat1: ["12", "13", "15", "16", "18", "19", "21", "22", "23", "25"],
	// 			stat2: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 2],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["18%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Classroom Daydream"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 155,
	// 		name: "M590",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 264,
	// 		max_dmg: 32,
	// 		max_acc: 11,
	// 		max_eva: 10,
	// 		max_rof: 31,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Protection Focus",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases own armor rating by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
	// 			stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 2],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Accuracy by "],
	// 			stat2: ["55%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Snowy Nil", "After-school Pastime"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 156,
	// 		name: "Super Shorty",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 242,
	// 		max_dmg: 28,
	// 		max_acc: 14,
	// 		max_eva: 19,
	// 		max_rof: 20,
	// 		max_armor: 20,
	// 		skill: {
	// 			name: "Survival Instinct",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases evasion by #1 and armor rating by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["28%", "31%", "34%", "37%", "40%", "43%", "46%", "49%", "52%", "55%"],
	// 			stat2: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
	// 			stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["15%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Crossing in Labyrinth"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 157,
	// 		name: "KSG",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 253,
	// 		max_dmg: 29,
	// 		max_acc: 13,
	// 		max_eva: 12,
	// 		max_rof: 30,
	// 		max_armor: 24,
	// 		skill: {
	// 			name: "Survival Instinct",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases evasion by #1 and armor rating by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
	// 			stat2: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
	// 			stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["15%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 158,
	// 		name: "KS-23",
	// 		type: "SG",
	// 		rarity: 3,
	// 		max_hp: 275,
	// 		max_dmg: 40,
	// 		max_acc: 9,
	// 		max_eva: 10,
	// 		max_rof: 25,
	// 		max_armor: 21,
	// 		skill: {
	// 			name: "Damage Focus SG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1, and increases the amount of targets hit per attack to 5 (overwrites the effect of Slugs), lasts for 8 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: ["30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", "110%", "120%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 2],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["12%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 159,
	// 		name: "RMB-93",
	// 		type: "SG",
	// 		rarity: 3,
	// 		max_hp: 242,
	// 		max_dmg: 30,
	// 		max_acc: 11,
	// 		max_eva: 13,
	// 		max_rof: 28,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Burst Impact",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Performs an additional attack which deals #1 damage and pushes targets back by #2 units.",
	// 			number_of_stats: 2,
	// 			stat1: ["1x", "1.1x", "1.2x", "1.3x", "1.4x", "1.6x", "1.7x", "1.8x", "1.9x", "2x"],
	// 			stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 0, 0],
	// 			row3: [0, 0, 2],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["12%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Cross the Milky Way", "Untouchable Moonlit Lover"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 160,
	// 		name: "Saiga-12",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 264,
	// 		max_dmg: 29,
	// 		max_acc: 12,
	// 		max_eva: 11,
	// 		max_rof: 35,
	// 		max_armor: 23,
	// 		skill: {
	// 			name: "Big Antelopes Horn",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Attacks thrice with increased damage after each successive hit, dealing #1 damage to each target.",
	// 			number_of_stats: 1,
	// 			stat1: ["0.8x/1.2x/1.6x", "0.9x/1.3x/1.7x", "0.9x/1.5x/2x", "1.0x/1.6x/2.2x", "1.1x/1.7x/2.5x", "1.2x/1.8x/2.8x", "1.3x/2.0x/3.0x", "1.3x/2.1x/3.2x", "1.4x/2.3x/3.3x", "1.5x/2.5x/3.5x"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Crimson Cruise", "Daylight Judge"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 161,
	// 		name: "Type 97 Shotgun",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 264,
	// 		max_dmg: 33,
	// 		max_acc: 12,
	// 		max_eva: 13,
	// 		max_rof: 27,
	// 		max_armor: 20,
	// 		skill: {
	// 			name: "Damage Focus SG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1, and increases the amount of targets hit per attack to 5 (overwrites the effect of Slugs), lasts for 8 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: ["30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", "110%", "120%"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 161,
	// 		name: "Type 97 Shotgun Mod",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 271,
	// 		max_dmg: 37,
	// 		max_acc: 13,
	// 		max_eva: 14,
	// 		max_rof: 28,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Damage Focus SG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 and accuracy by #2 and increases the amount of targets hit per attack to 5 (overwrites the effect of Slugs), lasts for 8 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", "110%", "120%"],
	// 			stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
	// 		},
	// 		skill2: {
	// 			name: "Anti-riot Special Attack",
	// 			initial_cooldown: "Passive",
	// 			description: "Reduces the movement speed of hit enemies by #1 for 1 second.",
	// 			number_of_stats: 1,
	// 			stat1: ["20%", "22%", "24%", "26%", "30%", "34%", "38%", "42%", "46%", "50%"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 1, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Cunning Plan 97"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 162,
	// 		name: "SPAS-12",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 275,
	// 		max_dmg: 33,
	// 		max_acc: 11,
	// 		max_eva: 9,
	// 		max_rof: 32,
	// 		max_armor: 21,
	// 		skill: {
	// 			name: "Damage Focus SG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1, and increases the amount of targets hit per attack to 5 (overwrites the effect of Slugs), lasts for 8 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: ["30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%", "110%", "120%"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["The Fruits of Summer", "Marching Band", "Goblin Huntress"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 163,
	// 		name: "AA-12",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 269,
	// 		max_dmg: 30,
	// 		max_acc: 12,
	// 		max_eva: 11,
	// 		max_rof: 39,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Ketonemia",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description:
	// 				'Passive: When equipped with "Frag-12 HE Rounds", attacks deal 1x armor ignoring damage to enemies within a radius of 1 units. Active: Grants #1 ammo to current clip and increases own rate of fire by #2 but decreases own damage by #3 for #4 seconds. Additionally, each attack has a #5 increased chance of knocking back enemy units.',
	// 			number_of_stats: 5,
	// 			stat1: ["+5", "+5", "+6", "+6", "+7", "+7", "+8", "+8", "+9", "+10"],
	// 			stat2: ["35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%"],
	// 			stat3: ["50%", "44%", "39%", "33%", "28%", "22%", "17%", "11%", "6%", "0%"],
	// 			stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 8],
	// 			stat5: ["6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%", "10%"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["22%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Never Rising Sun", "Smokeless Lollipop"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 164,
	// 		name: "FP-6",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 260,
	// 		max_dmg: 31,
	// 		max_acc: 13,
	// 		max_eva: 12,
	// 		max_rof: 28,
	// 		max_armor: 24,
	// 		skill: {
	// 			name: "Lost Paradise",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description:
	// 				"Randomly summon 2 shields in her column for #1 seconds dealing #2 damage and knocking back enemies in a small area around the shields. Allies standing on the shielded tiles will take #3 reduced damage.",
	// 			number_of_stats: 3,
	// 			stat1: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 8],
	// 			stat2: ["40%", "44%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%"],
	// 			stat3: ["15%", "17%", "19%", "21%", "22%", "24%", "26%", "27%", "28%", "30%"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 2],
	// 			row2: [1, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["12%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Satellite of Love"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 165,
	// 		name: "M1014",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 275,
	// 		max_dmg: 31,
	// 		max_acc: 12,
	// 		max_eva: 11,
	// 		max_rof: 32,
	// 		max_armor: 21,
	// 		skill: {
	// 			name: "Stress Allusion",
	// 			initial_cooldown: "10s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 and armor rating by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["20%", "23%", "26%", "29%", "33%", "36%", "39%", "43%", "47%", "50%"],
	// 			stat2: ["15%", "17%", "19%", "21%", "22%", "24%", "26%", "27%", "28%", "30%"],
	// 			stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 2],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Snow, Moon and Flowers", "Heartbeats Amongst Angels"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 166,
	// 		name: "CZ75",
	// 		type: "HG",
	// 		rarity: 5,
	// 		max_hp: 66,
	// 		max_dmg: 34,
	// 		max_acc: 62,
	// 		max_eva: 74,
	// 		max_rof: 66,
	// 		skill: {
	// 			name: "Observer's Strike",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Throws a tomahawk, dealing #1 of CZ75's damage at the targeted enemy.",
	// 			number_of_stats: 1,
	// 			stat1: ["5x", "5.6x", "6.1x", "6.7x", "7.2x", "7.8x", "8.3x", "8.9x", "9.4x", "10x"]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 1, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 1, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Rate of Fire by "],
	// 			stat2: ["16%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Winter Gatherer", "Golden Lotus"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 167,
	// 		name: "HK45",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 66,
	// 		max_dmg: 34,
	// 		max_acc: 58,
	// 		max_eva: 80,
	// 		max_rof: 55,
	// 		skill: {
	// 			name: "Raid Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increases all allies' damage by #1 and accuracy by #2 for #3 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
	// 			stat2: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
	// 			stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["32%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Miracle☆Start"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 168,
	// 		name: "Spitfire",
	// 		type: "HG",
	// 		rarity: 4,
	// 		max_hp: 70,
	// 		max_dmg: 33,
	// 		max_acc: 60,
	// 		max_eva: 71,
	// 		max_rof: 59,
	// 		skill: {
	// 			name: "Assault Suppression",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' rate of fire by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["16%", "17%", "19%", "20%", "21%", "23%", "24%", "25%", "27%", "28%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 1],
	// 			row2: [2, 0, 0],
	// 			row3: [1, 0, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["30%", "40%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["The Last Alice"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 169,
	// 		name: "SCW",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 168,
	// 		max_dmg: 30,
	// 		max_acc: 12,
	// 		max_eva: 68,
	// 		max_rof: 91,
	// 		skill: {
	// 			name: "Mobility Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 and evasion by #2 for #3 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["100%", "106%", "111%", "117%", "122%", "128%", "133%", "139%", "144%", "150%"],
	// 			stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Damage by "],
	// 			stat2: ["10%", "6%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 170,
	// 		name: "ASh-12.7",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 110,
	// 		max_dmg: 65,
	// 		max_acc: 41,
	// 		max_eva: 36,
	// 		max_rof: 59,
	// 		skill: {
	// 			name: "Elimination Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage and critical hit rate by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 171,
	// 		name: "Ribeyrolles",
	// 		type: "AR",
	// 		rarity: 4,
	// 		max_hp: 110,
	// 		max_dmg: 64,
	// 		max_acc: 44,
	// 		max_eva: 40,
	// 		max_rof: 63,
	// 		skill: {
	// 			name: "Crimson Echoes",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases the damage, accuracy, and rate of fire of allies present on her tiles by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 172,
	// 		name: "RFB",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 105,
	// 		max_dmg: 69,
	// 		max_acc: 68,
	// 		max_eva: 49,
	// 		max_rof: 54,
	// 		skill: {
	// 			name: "Ammo Supremacy",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 and accuracy by #2 and shifts her targeting to the back row for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["50%", "53%", "57%", "60%", "63%", "67%", "70%", "73%", "77%", "80%"],
	// 			stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
	// 			stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Evasion by "],
	// 			stat2: ["30%", "18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["RFB Steals Christmas", "New Year's Game Master"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 173,
	// 		name: "PKP",
	// 		type: "MG",
	// 		rarity: 5,
	// 		max_hp: 165,
	// 		max_dmg: 95,
	// 		max_acc: 31,
	// 		max_eva: 29,
	// 		max_rof: 127,
	// 		skill: {
	// 			name: "Ultimatum",
	// 			initial_cooldown: "Passive",
	// 			description: "Each attack has a #1 chance of firing an additional bullet that will deal critical damage",
	// 			number_of_stats: 1,
	// 			stat1: ["5%", "7%", "8%", "10%", "12%", "13%", "15%", "17%", "18%", "20%"]
	// 		},
	// 		tile_set: {
	// 			row1: [2, 0, 1],
	// 			row2: [0, 0, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["15%", "12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 4,
	// 		skin_names: ["Flower and Water", "Lady's Secret Order", "Silvery White Star", "Bamboo's Pride"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false, false],
	// 			hasSit2Animation: [false, false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 174,
	// 		name: "Type 81 Carbine",
	// 		type: "RF",
	// 		rarity: 3,
	// 		max_hp: 75,
	// 		max_dmg: 123,
	// 		max_acc: 79,
	// 		max_eva: 41,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Assault Focus N",
	// 			initial_cooldown: "8s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "During nighttime, increases rate of fire by #1 (#2 during day) for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "86%", "90%"],
	// 			stat2: ["16%", "18%", "19%", "21%", "22%", "24%", "25%", "27%", "28%", "30%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces by Skill CD by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["White Camellia"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 175,
	// 		name: "ART556",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 116,
	// 		max_dmg: 53,
	// 		max_acc: 53,
	// 		max_eva: 49,
	// 		max_rof: 69,
	// 		skill: {
	// 			name: "Charge Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases damage by #1 and rate of fire by #2 for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["50%", "54%", "58%", "62%", "66%", "69%", "73%", "77%", "81%", "85%"],
	// 			stat2: ["16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Evasion by "],
	// 			stat2: ["50%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Lotus White", "Chimney Sweeping Girl"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 176,
	// 		name: "TMP",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 150,
	// 		max_dmg: 28,
	// 		max_acc: 14,
	// 		max_eva: 77,
	// 		max_rof: 93,
	// 		skill: {
	// 			name: "Cover Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases evasion by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["65%", "71%", "77%", "83%", "89%", "96%", "102%", "108%", "114%", "120%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 2, 0],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Damage by "],
	// 			stat2: ["20%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Red Eared Cat TMP", "Meow Prism Power", "Black Cat Kindergarten"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 177,
	// 		name: "KLIN",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 190,
	// 		max_dmg: 25,
	// 		max_acc: 11,
	// 		max_eva: 74,
	// 		max_rof: 95,
	// 		skill: {
	// 			name: "Incendiary Grenade",
	// 			initial_cooldown: "3s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["3.2x", "3.6x", "3.9x", "4.3x", "4.7x", "5x", "5.4x", "5.8x", "6.1x", "6.5x"],
	// 			stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
	// 			stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 1,
	// 			stat1: ["Rate of Fire by "],
	// 			stat2: ["25%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Sanbagarasu", "The End of Winter"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 178,
	// 		name: "F1",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 212,
	// 		max_dmg: 26,
	// 		max_acc: 14,
	// 		max_eva: 60,
	// 		max_rof: 80,
	// 		skill: {
	// 			name: "Smoke Grenade",
	// 			initial_cooldown: "1s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a smoke grenade that decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["20%", "22%", "24%", "25%", "27%", "29%", "31%", "32%", "34%", "36%"],
	// 			stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Evasion by "],
	// 			stat2: ["40%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Black Magic Academy"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 179,
	// 		name: "DSR-50",
	// 		type: "RF",
	// 		rarity: 5,
	// 		max_hp: 82,
	// 		max_dmg: 163,
	// 		max_acc: 87,
	// 		max_eva: 33,
	// 		max_rof: 31,
	// 		skill: {
	// 			name: "Armor Breaking Shot",
	// 			initial_cooldown: "8s",
	// 			cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the highest HP enemy based on the current number of charge stacks. All stacks will be consumed on skill use. If the enemy is armored, deal #3 ~ #4 damage instead.",
	// 			number_of_stats: 4,
	// 			stat1: [1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
	// 			stat2: ["2.5x", "2.9x", "3.3x", "3.7x", "4.1x", "4.4x", "4.8x", "5.2x", "5.6x", "6x"],
	// 			stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4],
	// 			stat4: ["4.5x", "5.1x", "5.7x", "6.3x", "6.9x", "7.6x", "8.2x", "8.8x", "9.4x", "10x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [2, 1, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Pantone Peony", "Highest Bidder"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 180,
	// 		name: "PzB 39",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 84,
	// 		max_dmg: 148,
	// 		max_acc: 71,
	// 		max_eva: 31,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Piercing Shot",
	// 			initial_cooldown: "4s",
	// 			cooldown: [16, 15.6, 15.1, 14.7, 14.2, 13.8, 13.3, 12.9, 12.4, 12],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 4 stacks. When skill is used, aim for 1.5 seconds, then shoot the furthest target, dealing #1 ~ #2 damage based on the current number of charge stacks to all enemies in its path and again to the target. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [0.5, 0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.9, 0.9],
	// 			stat2: ["0.8x", "0.9x", "1x", "1.1x", "1.2x", "1.3x", "1.4x", "1.5x", "1.6x", "1.8x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Burst Rider"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 181,
	// 		name: "T91",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 124,
	// 		max_dmg: 51,
	// 		max_acc: 44,
	// 		max_eva: 46,
	// 		max_rof: 76,
	// 		skill: {
	// 			name: "Annihilation Focus N",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "During nighttime, increases damage by #1 (#2 during daytime) and critical rate by #3 (#4 during daytime) for #5 seconds.",
	// 			number_of_stats: 5,
	// 			stat1: ["60%", "67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%"],
	// 			stat2: ["20%", "23%", "27%", "30%", "33%", "37%", "40%", "43%", "47%", "50%"],
	// 			stat3: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
	// 			stat4: ["15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "25%"],
	// 			stat5: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 2, 1],
	// 			row2: [0, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Evasion by "],
	// 			stat2: ["20%", "12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Snowy Plum Pearls"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 182,
	// 		name: "wz.29",
	// 		type: "RF",
	// 		rarity: 3,
	// 		max_hp: 97,
	// 		max_dmg: 113,
	// 		max_acc: 65,
	// 		max_eva: 33,
	// 		max_rof: 32,
	// 		skill: {
	// 			name: "Assault Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases rate of fire by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Kachou Fuugetsu"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 183,
	// 		name: "Contender",
	// 		type: "HG",
	// 		rarity: 5,
	// 		max_hp: 66,
	// 		max_dmg: 46,
	// 		max_acc: 85,
	// 		max_eva: 82,
	// 		max_rof: 44,
	// 		skill: {
	// 			name: "Inquisitor's Bullet",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description:
	// 				"After taking aim for 1 second, shoots a special bullet that inflicts #1 the damage towards the enemy, amplifying the damage received by #2 and setting it as the target of focus fire for #3. Depending on whether Contender is in the front/middle/back column, it will target the enemy that's the furthest/highest hp/closest correspondingly. If a boss is present, it will target the boss first.",
	// 			number_of_stats: 3,
	// 			stat1: ["1.5x", "1.7x", "1.8x", "2x", "2.2x", "2.3x", "2.5x", "2.7x", "2.8x", "3x"],
	// 			stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 1, 1],
	// 			row2: [1, 2, 1],
	// 			row3: [1, 1, 1],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Critical Rate by "],
	// 			stat2: ["30%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Phantom of the Opera", "Floral Servitude", "Dragon Wolf Cub"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 184,
	// 		name: "T-5000",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 90,
	// 		max_dmg: 126,
	// 		max_acc: 85,
	// 		max_eva: 28,
	// 		max_rof: 36,
	// 		skill: {
	// 			name: "Lock-on Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases rate of fire and accuracy by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat2: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 1],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Oath to Transform", "Crimson Destroyer"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 185,
	// 		name: "Ameli",
	// 		type: "MG",
	// 		rarity: 4,
	// 		max_hp: 141,
	// 		max_dmg: 83,
	// 		max_acc: 38,
	// 		max_eva: 42,
	// 		max_rof: 149,
	// 		skill: {
	// 			name: "Lock and Load N",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "During nighttime, increases damage by #1 (#2 during day) and grants #3 ammo to current salvo for #4 seconds.",
	// 			number_of_stats: 4,
	// 			stat1: ["28%", "30%", "33%", "35%", "38%", "40%", "43%", "45%", "48%", "50%"],
	// 			stat2: ["6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%", "10%", "11%"],
	// 			stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
	// 			stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Armor by "],
	// 			stat2: ["10%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Present Selling Christmas Tree", "Ameli Catch!"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 186,
	// 		name: "P226",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 73,
	// 		max_dmg: 29,
	// 		max_acc: 58,
	// 		max_eva: 63,
	// 		max_rof: 61,
	// 		skill: {
	// 			name: "Assault Suppression",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' rate of fire by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Damage by "],
	// 			stat2: ["50%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 187,
	// 		name: "Ak 5",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 116,
	// 		max_dmg: 51,
	// 		max_acc: 48,
	// 		max_eva: 38,
	// 		max_rof: 75,
	// 		skill: {
	// 			name: "Damage Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["40%", "43%", "46%", "49%", "52%", "55%", "57%", "60%", "63%", "65%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["15%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Southern Wind"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 188,
	// 		name: "S.A.T.8",
	// 		type: "SG",
	// 		rarity: 5,
	// 		max_hp: 282,
	// 		max_dmg: 29,
	// 		max_acc: 13,
	// 		max_eva: 12,
	// 		max_rof: 33,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Theory of Fortification",
	// 			initial_cooldown: "2s",
	// 			cooldown: [12, 11.5, 11.1, 10.7, 10.2, 9.8, 9.4, 8.9, 8.4, 8],
	// 			description: "Grants a #1 HP shield to all allies on the front row for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: [12, 15, 17, 20, 22, 25, 27, 30, 32, 35],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 2],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["10%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Plum Blossom Seal", "Pumpkin Bunches", "Maiden's Cryptic Message"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 189,
	// 		name: "USAS-12",
	// 		type: "SG",
	// 		rarity: 4,
	// 		max_hp: 260,
	// 		max_dmg: 29,
	// 		max_acc: 11,
	// 		max_eva: 10,
	// 		max_rof: 37,
	// 		max_armor: 22,
	// 		skill: {
	// 			name: "Frenzied Assault",
	// 			initial_cooldown: "1s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases rate of fire by #1 for #2 seconds, adds an additional #3 rounds to the loaded ammunition, but increases reload time by 1 seconds after salvo ends.",
	// 			number_of_stats: 3,
	// 			stat1: ["32%", "35%", "38%", "41%", "44%", "47%", "50%", "53%", "56%", "60%"],
	// 			stat2: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.5, 7.7, 8],
	// 			stat3: [1, 2, 2, 2, 2, 3, 3, 3, 3, 4]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 0, 2],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["15%", "20%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["VRAIN Power"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 190,
	// 		name: "NS2000",
	// 		type: "SG",
	// 		rarity: 3,
	// 		max_hp: 253,
	// 		max_dmg: 33,
	// 		max_acc: 12,
	// 		max_eva: 11,
	// 		max_rof: 27,
	// 		max_armor: 20,
	// 		skill: {
	// 			name: "Burst Impact",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Performs an additional attack which deals #1 damage and pushes targets back by #2 units.",
	// 			number_of_stats: 2,
	// 			stat1: ["1.2x", "1.3x", "1.5x", "1.6x", "1.8x", "1.9x", "2.1x", "2.2x", "2.4x", "2.5x"],
	// 			stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 2],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Hundred Flavours Curry Bunny"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 191,
	// 		name: "M12",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 203,
	// 		max_dmg: 26,
	// 		max_acc: 15,
	// 		max_eva: 64,
	// 		max_rof: 76,
	// 		skill: {
	// 			name: "Incendiary Grenade",
	// 			initial_cooldown: "3s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"],
	// 			stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
	// 			stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 2],
	// 			row2: [0, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs MG",
	// 			number_of_stats: 1,
	// 			stat1: ["Damage by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 192,
	// 		name: "JS05",
	// 		type: "RF",
	// 		rarity: 5,
	// 		max_hp: 90,
	// 		max_dmg: 158,
	// 		max_acc: 88,
	// 		max_eva: 32,
	// 		max_rof: 31,
	// 		skill: {
	// 			name: "Piercing Shot",
	// 			initial_cooldown: "4s",
	// 			cooldown: [16, 15.6, 15.1, 14.7, 14.2, 13.8, 13.3, 12.9, 12.4, 12],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 4 stacks. When skill is used, aim for 1.5 seconds, then shoot the furthest target, dealing #1 ~ #2 damage based on the current number of charge stacks to all enemies in its path and again to the target. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.9, 0.9, 1, 1],
	// 			stat2: ["0.9x", "1x", "1.1x", "1.3x", "1.4x", "1.5x", "1.6x", "1.8x", "1.9x", "2x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["18%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Jade Rain Lily", "Parting Melody"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 193,
	// 		name: "T65",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 124,
	// 		max_dmg: 54,
	// 		max_acc: 44,
	// 		max_eva: 40,
	// 		max_rof: 73,
	// 		skill: {
	// 			name: "Annihilation Focus N",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "During nighttime, increases damage by #1 (#2 during daytime) and critical rate by #3 (#4 during daytime) for #5 seconds.",
	// 			number_of_stats: 5,
	// 			stat1: ["50%", "55%", "61%", "66%", "72%", "77%", "83%", "88%", "94%", "100%"],
	// 			stat2: ["18%", "21%", "24%", "27%", "30%", "33%", "36%", "39%", "42%", "45%"],
	// 			stat3: ["22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%"],
	// 			stat4: ["12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "22%"],
	// 			stat5: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["15%", "25%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 194,
	// 		name: "K2",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 127,
	// 		max_dmg: 50,
	// 		max_acc: 51,
	// 		max_eva: 42,
	// 		max_rof: 78,
	// 		skill: {
	// 			name: "Overheat",
	// 			initial_cooldown: "8s",
	// 			cooldown: [5, 4.8, 4.6, 4.4, 4.2, 4, 3.8, 3.6, 3.3, 3],
	// 			description:
	// 				"Activate skill during combat to switch between attack modes. Fever Mode (Default): Burst fire mode, shoots 3 bullets each doing #1 damage, barrel heats up by 1 level. At the 15th level the barrel overheats and starts losing #2 damage and accuracy for every level (up to 20 stacks). Note Mode: Single fire mode, reduces her own evasion and movespeed by #3 and shoots 1 bullet but each shot cools the barrel down by 1 level. Every subsequent attack on a single enemy will increase the damage dealt to it by #4 each (up to 10 stacks).",
	// 			number_of_stats: 4,
	// 			stat1: ["40%", "41.2%", "42.4%", "43.6%", "44.8%", "46%", "47.2%", "48.4%", "49.6%", "52%"],
	// 			stat2: ["3.2%", "3.1%", "3%", "2.8%", "2.7%", "2.6%", "2.4%", "2.3%", "2.2%", "2%"],
	// 			stat3: ["60%", "58%", "56%", "54%", "52%", "50%", "48%", "46%", "44%", "40%"],
	// 			stat4: ["2%", "2.3%", "2.6%", "3%", "3.3%", "3.6%", "4%", "4.3%", "4.7%", "5%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["25%", "50%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Far East Princess", "Before the Dawn"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 195,
	// 		name: "HK23",
	// 		type: "MG",
	// 		rarity: 3,
	// 		max_hp: 149,
	// 		max_dmg: 80,
	// 		max_acc: 34,
	// 		max_eva: 34,
	// 		max_rof: 135,
	// 		skill: {
	// 			name: "Lock and Load",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["18%", "19%", "21%", "22%", "23%", "25%", "26%", "27%", "29%", "30%"],
	// 			stat2: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3"],
	// 			stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Armor by "],
	// 			stat2: ["8%", "12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 196,
	// 		name: "Zas M21",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 121,
	// 		max_dmg: 55,
	// 		max_acc: 48,
	// 		max_eva: 41,
	// 		max_rof: 74,
	// 		skill: {
	// 			name: "Howl of the Nightingale",
	// 			initial_cooldown: "4s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description:
	// 				"Launches a grenade that deals #1 damage to enemies within a 2.5 radius. If 3 or more enemy units are hit, they will take #2 extra damage for #3 seconds. If less than 3 enemy units are hit, increases own damage by #4 for #5 seconds.",
	// 			number_of_stats: 5,
	// 			stat1: ["120%", "140%", "160%", "180%", "200%", "220%", "240%", "260%", "280%", "300%"],
	// 			stat2: ["10%", "11%", "11%", "12%", "12%", "13%", "13%", "14%", "14%", "15%"],
	// 			stat3: [2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3],
	// 			stat4: ["40%", "42%", "44%", "46%", "48%", "50%", "52%", "54%", "57%", "60%"],
	// 			stat5: [5, 5.3, 5.6, 5.9, 6.3, 6.6, 6.9, 7.2, 7.6, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Evasion by "],
	// 			stat2: ["12%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Snegurochka's Bullet Offering", "Queen of the White Pieces", "Affections Behind the Bouquet"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false],
	// 			hasVictoryLoopAnimation: [true, true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false, false],
	// 			hasSit2Animation: [false, false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 197,
	// 		name: "Carcano M1891",
	// 		type: "RF",
	// 		rarity: 5,
	// 		max_hp: 80,
	// 		max_dmg: 138,
	// 		max_acc: 85,
	// 		max_eva: 42,
	// 		max_rof: 34,
	// 		skill: {
	// 			name: "Horn of Mars",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			passive_active_description: true,
	// 			description:
	// 				"Passive: Each attack has a 40% chance to increase critical rate and rate of fire by #1 for T-Dolls within the same column for 2 seconds (max 3 stacks). Active: Upon activation, increases critical rate and rate of fire by #2 for every RF unit present in the echelon by for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["2%", "2.2%", "2.4%", "2.7%", "3.0%", "3.2%", "3.4%", "3.6%", "3.8%", "4%"],
	// 			stat2: ["5.0%", "5.3%", "5.6%", "5.9%", "6.3%", "6.6%", "7.0%", "7.3%", "7.6%", "8%"],
	// 			stat3: [4.5, 4.8, 5.2, 5.5, 5.8, 6.2, 6.5, 6.8, 7.2, 7.5]
	// 		},
	// 		tile_set: {
	// 			row1: [2, 0, 0],
	// 			row2: [1, 0, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs RF",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Brave Little Cano", "Bell of the Beginning"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 198,
	// 		name: "Carcano M91/38",
	// 		type: "RF",
	// 		rarity: 5,
	// 		max_hp: 73,
	// 		max_dmg: 146,
	// 		max_acc: 90,
	// 		max_eva: 44,
	// 		max_rof: 34,
	// 		skill: {
	// 			name: "Mask of Hermes",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			passive_active_description: true,
	// 			description:
	// 				"Passive: Instantly gains #1 stacks. Passive: Attacks have a #2 chance to gain #3 stacks. When stacks reach 18, the next attack against an elite enemy will deal #4 damage (#5 damage against normal enemy) and will clear current stacks to 0.",
	// 			number_of_stats: 5,
	// 			stat1: [12, 13, 13, 14, 15, 16, 16, 17, 17, 18],
	// 			stat2: ["30%", "35%", "40%", "45%", "50%", "55%", "55%", "60%", "65%", "70%"],
	// 			stat3: ["180%", "190%", "200%", "210%", "225%", "240%", "255%", "270%", "285%", "300%"],
	// 			stat4: ["2700%", "2850%", "3000%", "3150%", "3375%", "3600%", "3825%", "4050%", "4275%", "4500%"],
	// 			stat5: [1, 1, 1, 1, 1, 1, 2, 2, 2, 2]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 0, 0],
	// 			row3: [2, 0, 0],
	// 			targets: "Buffs RF",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Miss Pinocchio", "Chase the Kite"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false],
	// 			hasVictoryLoopAnimation: [true, true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false, false],
	// 			hasSit2Animation: [false, false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 199,
	// 		name: "Type 80",
	// 		type: "MG",
	// 		rarity: 4,
	// 		max_hp: 174,
	// 		max_dmg: 93,
	// 		max_acc: 26,
	// 		max_eva: 24,
	// 		max_rof: 118,
	// 		skill: {
	// 			name: "Damage Focus MG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%"],
	// 			stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 0, 1],
	// 			row3: [2, 0, 0],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Damage by "],
	// 			stat2: ["15%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Metal Butterfly"],
	// 		animations: {
	// 			hasSkillAnimation: [false],
	// 			hasVictoryLoopAnimation: [true]
	// 		},
	// 		animations_dorm: {
	// 			hasActionAnimation: [false],
	// 			hasSit2Animation: [false]
	// 		}
	// 	}
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	normal: {
	// 		id: 200,
	// 		name: "XM3",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 82,
	// 		max_dmg: 130,
	// 		max_acc: 90,
	// 		max_eva: 32,
	// 		max_rof: 35,
	// 		skill: {
	// 			name: "Assault Focus N",
	// 			initial_cooldown: "8s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "During nighttime, increases rate of fire by #1 (#2 during day) for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"],
	// 			stat2: ["18%", "20%", "21%", "23%", "24%", "26%", "27%", "29%", "30%", "32%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs HG",
	// 			number_of_stats: 1,
	// 			stat1: ["Reduces Skill CD by "],
	// 			stat2: ["15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: null
	// }
];
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// END OF #101-#200 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for #101-#200 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for #101-#200 T-Doll Index JSON.");

export default tdolls;
