/*
    This array of T-Dolls will contain information about index #101 to #150 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// START OF #101-#150 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	// {
	// 	normal: {
	// 		id: 101,
	// 		name: "UMP9",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 176,
	// 		max_dmg: 26,
	// 		max_acc: 14,
	// 		max_eva: 76,
	// 		max_rof: 87,
	// 		skill: {
	// 			name: "Stun Grenade",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Rate of Fire by "],
	// 			stat2: ["30%", "12%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 101,
	// 		name: "UMP9 Mod",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 181,
	// 		max_dmg: 29,
	// 		max_acc: 18,
	// 		max_eva: 84,
	// 		max_rof: 87,
	// 		skill: {
	// 			name: "Stun Grenade",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [2.5, 2.7, 2.9, 3.2, 3.4, 3.6, 3.8, 4.1, 4.3, 4.5]
	// 		},
	// 		skill2: {
	// 			name: "Snow Owl's Roar",
	// 			initial_cooldown: "Passive",
	// 			description:
	// 				"If the main target of the flashbang was not stunned or is already dead, grants a #1 HP shield and #2 evasion to self and allies on the same column for #3 seconds. If the main target of the flashbang was stunned, increase the damage of self and allies on the same column by #4 for #5 seconds.",
	// 			number_of_stats: 5,
	// 			stat1: [15, 16, 17, 18, 19, 21, 22, 23, 24, 25],
	// 			stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
	// 			stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
	// 			stat4: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
	// 			stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Rate of Fire by "],
	// 			stat2: ["30%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 4,
	// 		skin_names: ["Am I Late?", "Song of the World", "Shiba Inu Scout", "Wish-Giving Fireworks Magician"],
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
	// 		id: 102,
	// 		name: "UMP40",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 180,
	// 		max_dmg: 27,
	// 		max_acc: 14,
	// 		max_eva: 75,
	// 		max_rof: 85,
	// 		skill: {
	// 			name: "Etching Overload",
	// 			initial_cooldown: "1s",
	// 			cooldown: [666, 666, 666, 666, 666, 666, 666, 666, 666, 666],
	// 			passive_active_description: true,
	// 			description:
	// 				"Passive: Before activation, increase evasion by 10% and decrease damage by 5% every 2 seconds, 5 stacks maximum. Active: Clear all passive stacks, increase damage by #1 and decrease evasion by #2 every 2 seconds, 5 stacks maximum.",
	// 			number_of_stats: 2,
	// 			stat1: ["20%", "21%", "22%", "23%", "24%", "25%", "26%", "27%", "28%", "30%"],
	// 			stat2: ["20%", "21%", "21%", "22%", "22%", "23%", "23%", "24%", "24%", "25%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 1, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 1,
	// 			stat1: ["Critical Rate by "],
	// 			stat2: ["500%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Wish-Protecting Maiden of Shadows"],
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
	// 		id: 103,
	// 		name: "UMP45",
	// 		type: "SMG",
	// 		rarity: 4,
	// 		max_hp: 185,
	// 		max_dmg: 28,
	// 		max_acc: 13,
	// 		max_eva: 74,
	// 		max_rof: 82,
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
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Critical Rate by "],
	// 			stat2: ["18%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: {
	// 		id: 103,
	// 		name: "UMP45 Mod",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 195,
	// 		max_dmg: 29,
	// 		max_acc: 14,
	// 		max_eva: 77,
	// 		max_rof: 83,
	// 		skill: {
	// 			name: "Smoke Grenade",
	// 			initial_cooldown: "1s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
	// 			stat2: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
	// 			stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
	// 		},
	// 		skill2: {
	// 			name: "Mist Trap",
	// 			initial_cooldown: "Passive",
	// 			description:
	// 				"2 seconds after the smoke grenade takes effect, targets affected by the smoke grenade will be hacked every 2 seconds. Hacked targets will enter a short-circuited state, receiving #1 fixed damage every attack. Short-circuit state lasts for 5 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [23, 26, 29, 32, 35, 38, 41, 44, 47, 50]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Critical Rate by "],
	// 			stat2: ["20%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	skins: {
	// 		number_of_skins: 5,
	// 		skin_names: ["Just This Time.", "Diamond Flower", "Winter Journey", "Lop-Eared Rabbit Agent", "Hopeful Fireworks Magician"],
	// 		animations: {
	// 			hasSkillAnimation: [false, false, false, false, false],
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
	// 		id: 104,
	// 		name: "G36C",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 203,
	// 		max_dmg: 32,
	// 		max_acc: 12,
	// 		max_eva: 65,
	// 		max_rof: 83,
	// 		skill: {
	// 			name: "Force Shield",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Grants self a barrier with a Defense value of 9999 (Max value of 9999), reducing incoming damage by a percentage (100% if at max Defense value) for #1 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Rate of Fire by "],
	// 			stat2: ["10%", "8%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Ode to Summer", "You Who Takes the Step", "Burning-Eyed G36C"],
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
	// 		id: 105,
	// 		name: "OTs-12",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 105,
	// 		max_dmg: 42,
	// 		max_acc: 54,
	// 		max_eva: 54,
	// 		max_rof: 72,
	// 		skill: {
	// 			name: "Assault Focus T",
	// 			initial_cooldown: "4s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Increases rate of fire by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
	// 			stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Damage by "],
	// 			stat2: ["20%", "15%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Blossoming Flowers"],
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
	// 		id: 106,
	// 		name: "FAL",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 132,
	// 		max_dmg: 57,
	// 		max_acc: 43,
	// 		max_eva: 38,
	// 		max_rof: 72,
	// 		skill: {
	// 			name: "Grenade Salvo",
	// 			initial_cooldown: "6s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Launches 3 grenades consecutively that deals #1 damage to enemies within a radius of 1.5 units.",
	// 			number_of_stats: 1,
	// 			stat1: ["2.5x", "2.8x", "3.1x", "3.3x", "3.6x", "3.9x", "4.2x", "4.4x", "4.7x", "5x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 1,
	// 			stat1: ["Evasion by "],
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
	// 		skin_names: ["Winter Supply Operation", "The Big Day", "FAL's Summer"],
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
	// 		id: 107,
	// 		name: "F2000",
	// 		type: "AR",
	// 		rarity: 2,
	// 		max_hp: 105,
	// 		max_dmg: 42,
	// 		max_acc: 44,
	// 		max_eva: 40,
	// 		max_rof: 81,
	// 		skill: {
	// 			name: "Damage Focus",
	// 			initial_cooldown: "5s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 0],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 0],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Evasion by ", "Damage by "],
	// 			stat2: ["10%", "20%"]
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
	// 		id: 108,
	// 		name: "CZ-805",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 116,
	// 		max_dmg: 43,
	// 		max_acc: 49,
	// 		max_eva: 41,
	// 		max_rof: 75,
	// 		skill: {
	// 			name: "High-Explosive Grenade",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
	// 			number_of_stats: 1,
	// 			stat1: ["1.8/0.7/0.4x", "2.1/0.8/0.5x", "2.4/0.9/0.5x", "2.7/1.1/0.6x", "3/1.2/0.7x", "3.3/1.3/0.7x", "3.6/1.4/0.8x", "3.9/1.7/0.9x", "4.2/1.8/0.9x", "4.5/1.8/1x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Rate of Fire by "],
	// 			stat2: ["50%", "25%"]
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
	// 		id: 109,
	// 		name: "MG5",
	// 		type: "MG",
	// 		rarity: 5,
	// 		max_hp: 198,
	// 		max_dmg: 85,
	// 		max_acc: 27,
	// 		max_eva: 27,
	// 		max_rof: 120,
	// 		skill: {
	// 			name: "Terminating Barrage",
	// 			initial_cooldown: "Passive",
	// 			description: "After every 3 hits, the next hit will deal #1 damage.",
	// 			number_of_stats: 2,
	// 			stat1: ["1.5x", "1.7x", "1.8x", "2x", "2.2x", "2.3x", "2.5x", "2.7x", "2.8x", "3x"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Armor by "],
	// 			stat2: ["10%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 4,
	// 		skin_names: ["Crimson Guardian", "Wild Hunter", "Knight of Pestilence", "Dark Tea Stalks"],
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
	// 		id: 110,
	// 		name: "FG42",
	// 		type: "MG",
	// 		rarity: 2,
	// 		max_hp: 149,
	// 		max_dmg: 87,
	// 		max_acc: 28,
	// 		max_eva: 33,
	// 		max_rof: 121,
	// 		skill: {
	// 			name: "Hunting Impulse",
	// 			initial_cooldown: "3s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases accuracy by #1 and all hits will be criticals for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["22%", "26%", "30%", "35%", "39%", "43%", "47%", "52%", "56%", "60%"],
	// 			stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 1,
	// 			stat1: ["Accuracy by "],
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
	// 		id: 111,
	// 		name: "AAT-52",
	// 		type: "MG",
	// 		rarity: 2,
	// 		max_hp: 182,
	// 		max_dmg: 79,
	// 		max_acc: 24,
	// 		max_eva: 22,
	// 		max_rof: 118,
	// 		skill: {
	// 			name: "Damage Focus N-MG",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases damage by #1 (#2 during day) for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["32%", "38%", "44%", "50%", "56%", "61%", "67%", "73%", "79%", "85%"],
	// 			stat2: ["10%", "12%", "14%", "17%", "19%", "21%", "23%", "26%", "28%", "30%"],
	// 			stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [2, 0, 0],
	// 			row2: [0, 0, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 1,
	// 			stat1: ["Rate of Fire by "],
	// 			stat2: ["20%"]
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
	// 		id: 112,
	// 		name: "Negev",
	// 		type: "MG",
	// 		rarity: 5,
	// 		max_hp: 174,
	// 		max_dmg: 84,
	// 		max_acc: 35,
	// 		max_eva: 36,
	// 		max_rof: 139,
	// 		skill: {
	// 			name: "Manic Blood",
	// 			initial_cooldown: "8s",
	// 			cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
	// 			description: "Increases damage by #1 after every reload. Can be stacked up to 3 times for 25 seconds.",
	// 			number_of_stats: 1,
	// 			stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [2, 0, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 1,
	// 			stat1: ["Armor by "],
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
	// 		skin_names: ["Little Vagrant", "Obsidian Princess"],
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
	// 		id: 113,
	// 		name: "Serdyukov",
	// 		type: "HG",
	// 		rarity: 3,
	// 		max_hp: 70,
	// 		max_dmg: 33,
	// 		max_acc: 58,
	// 		max_eva: 68,
	// 		max_rof: 59,
	// 		skill: {
	// 			name: "Fire Command",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Increase all allies' damage by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%"],
	// 			stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 1, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [0, 1, 0],
	// 			targets: "Buffs SG",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Accuracy by "],
	// 			stat2: ["24%", "40%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 1,
	// 		skin_names: ["Black Crow Lifeguard"],
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
	// 		id: 114,
	// 		name: "Welrod MkII",
	// 		type: "HG",
	// 		rarity: 5,
	// 		max_hp: 80,
	// 		max_dmg: 28,
	// 		max_acc: 71,
	// 		max_eva: 90,
	// 		max_rof: 52,
	// 		skill: {
	// 			name: "Precision Suppression",
	// 			initial_cooldown: "6s",
	// 			cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
	// 			description: "Decrease all enemies' accuracy by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["30%", "32%", "33%", "35%", "37%", "38%", "40%", "42%", "43%", "45%"],
	// 			stat2: [4, 4, 4, 5, 5, 5, 5, 6, 6, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 1, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 1, 0],
	// 			targets: "Buffs All Types",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Rate of Fire by "],
	// 			stat2: ["20%", "16%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["English in Love", "Lord of Darkness", "Twilight Menace"],
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
	// 		id: 115,
	// 		name: "Suomi",
	// 		type: "SMG",
	// 		rarity: 5,
	// 		max_hp: 220,
	// 		max_dmg: 28,
	// 		max_acc: 15,
	// 		max_eva: 56,
	// 		max_rof: 93,
	// 		skill: {
	// 			name: "Cover Focus",
	// 			initial_cooldown: "6s",
	// 			cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
	// 			description: "Increases evasion by #1 for #2 seconds.",
	// 			number_of_stats: 2,
	// 			stat1: ["80%", "88%", "96%", "103%", "111%", "119%", "127%", "134%", "142%", "150%"],
	// 			stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
	// 		},
	// 		tile_set: {
	// 			row1: [1, 0, 0],
	// 			row2: [0, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Rate of Fire by ", "Accuracy by "],
	// 			stat2: ["15%", "30%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Korvantunturi Pixie", "Midsummer Pixie", "Mission for Happiness"],
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
	// 		id: 116,
	// 		name: "Z-62",
	// 		type: "SMG",
	// 		rarity: 3,
	// 		max_hp: 168,
	// 		max_dmg: 28,
	// 		max_acc: 15,
	// 		max_eva: 77,
	// 		max_rof: 77,
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
	// 			row1: [0, 0, 0],
	// 			row2: [1, 2, 0],
	// 			row3: [1, 0, 0],
	// 			targets: "Buffs AR",
	// 			number_of_stats: 2,
	// 			stat1: ["Damage by ", "Evasion by "],
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
	// 		skin_names: ["Swimming Question"],
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
	// 		id: 117,
	// 		name: "PSG-1",
	// 		type: "RF",
	// 		rarity: 4,
	// 		max_hp: 93,
	// 		max_dmg: 120,
	// 		max_acc: 73,
	// 		max_eva: 26,
	// 		max_rof: 39,
	// 		skill: {
	// 			name: "Designated Shot",
	// 			initial_cooldown: "5s",
	// 			cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
	// 			description:
	// 				"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the furthest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
	// 			number_of_stats: 2,
	// 			stat1: [1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
	// 			stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"]
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
	// 		skin_names: ["Phantom Assaulter"],
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
	// 		id: 118,
	// 		name: "9A-91",
	// 		type: "AR",
	// 		rarity: 4,
	// 		max_hp: 116,
	// 		max_dmg: 42,
	// 		max_acc: 49,
	// 		max_eva: 50,
	// 		max_rof: 78,
	// 		skill: {
	// 			name: "Damage Focus N",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["110%", "118%", "126%", "133%", "141%", "149%", "157%", "164%", "172%", "180%"],
	// 			stat2: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
	// 			stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 0],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Evasion by ", "Rate of Fire by "],
	// 			stat2: ["15%", "10%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 2,
	// 		skin_names: ["Bullets Cafe", "Purifying Arrow, Flowers and Dreams"],
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
	// 		id: 119,
	// 		name: "OTs-14",
	// 		type: "AR",
	// 		rarity: 5,
	// 		max_hp: 110,
	// 		max_dmg: 49,
	// 		max_acc: 54,
	// 		max_eva: 54,
	// 		max_rof: 75,
	// 		skill: {
	// 			name: "Damage Focus N",
	// 			initial_cooldown: "5s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
	// 			number_of_stats: 3,
	// 			stat1: ["120%", "129%", "138%", "147%", "156%", "164%", "173%", "182%", "191%", "200%"],
	// 			stat2: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
	// 			stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
	// 		},
	// 		tile_set: {
	// 			row1: [0, 0, 1],
	// 			row2: [0, 2, 1],
	// 			row3: [0, 0, 1],
	// 			targets: "Buffs SMG",
	// 			number_of_stats: 2,
	// 			stat1: ["Accuracy by ", "Rate of Fire by "],
	// 			stat2: ["65%", "25%"]
	// 		},
	// 		animations: {
	// 			hasSkillAnimation: false,
	// 			hasVictoryLoopAnimation: true
	// 		}
	// 	},
	// 	mod: null,
	// 	skins: {
	// 		number_of_skins: 3,
	// 		skin_names: ["Flurry of Petals", "Crassula Volkensii", "Dinner Dictator"],
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
	// 		id: 120,
	// 		name: "ARX-160",
	// 		type: "AR",
	// 		rarity: 3,
	// 		max_hp: 99,
	// 		max_dmg: 49,
	// 		max_acc: 48,
	// 		max_eva: 48,
	// 		max_rof: 73,
	// 		skill: {
	// 			name: "Anti-Personnel Grenade",
	// 			initial_cooldown: "8s",
	// 			cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
	// 			description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
	// 			number_of_stats: 1,
	// 			stat1: ["4.5x", "5.2x", "5.9x", "6.7x", "7.4x", "8.1x", "8.8x", "9.6x", "10.3x", "11x"]
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
	// 	skins: null
	// },
	// /////////////////////////////////////////////////////////////////////////////////////////////////
	// /////////////////////////////////////////////////////////////////////////////////////////////////
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
];
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// END OF #101-#150 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for #101-#150 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for #101-#150 T-Doll Index JSON.");

export default tdolls;
