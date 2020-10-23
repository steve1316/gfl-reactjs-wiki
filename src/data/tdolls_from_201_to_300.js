/*
    This array of T-Dolls will contain information about index #201-#300 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// START OF #201-#300 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	{
		normal: {
			id: 201,
			name: "Gepard M1",
			type: "RF",
			rarity: 3,
			max_hp: 88,
			max_dmg: 143,
			max_acc: 77,
			max_eva: 28,
			max_rof: 30,
			skill: {
				name: "Interdiction Shot",
				initial_cooldown: "8s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3],
				stat2: ["3x", "3.4x", "3.8x", "4.2x", "4.6x", "4.9x", "5.3x", "5.7x", "6.1x", "6.5x"]
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
		skins: {
			number_of_skins: 3,
			skin_names: ["Today's Contract", "Looking Forward to Tomorrow", "Innocent Protector"],
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
			id: 202,
			name: "Thunder",
			type: "HG",
			rarity: 4,
			max_hp: 86,
			max_dmg: 46,
			max_acc: 57,
			max_eva: 60,
			max_rof: 37,
			skill: {
				name: "Critical Point Shot",
				initial_cooldown: "4s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Aims for 1 second and shoots the nearest enemy for #1 damage. This shot can be avoided, in that case, reload for 2 seconds and aim again.",
				number_of_stats: 1,
				stat1: ["800%", "840%", "890%", "930%", "980%", "1020%", "1070%", "1100%", "1160%", "1200%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 1],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["36%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Renoirs Crow", "Dream of the Black Swan"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 203,
			name: "Honey Badger",
			type: "SMG",
			rarity: 4,
			max_hp: 198,
			max_dmg: 33,
			max_acc: 13,
			max_eva: 60,
			max_rof: 82,
			skill: {
				name: "Mobility Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 and evasion by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["110%", "116%", "121%", "127%", "132%", "138%", "143%", "149%", "154%", "160%"],
				stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [0, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["20%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Christmas Princess and Unsmiling Pet"],
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
			id: 204,
			name: "Ballista",
			type: "RF",
			rarity: 5,
			max_hp: 82,
			max_dmg: 139,
			max_acc: 92,
			max_eva: 35,
			max_rof: 36,
			skill: {
				name: "Falcon Strike",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: Apply 1 layer of marks to enemies every #1 seconds (these marks can stack). Active: Each normal attack will target a marked enemy and activate an additional attack while consuming 1 mark. Skill lasts for #2 seconds or until all marks are consumed.",
				number_of_stats: 2,
				stat1: [3, 2.8, 2.7, 2.5, 2.3, 2.2, 2, 1.8, 1.7, 1.5],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
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
			id: 205,
			name: "AN-94",
			type: "AR",
			rarity: 5,
			max_hp: 116,
			max_dmg: 55,
			max_acc: 67,
			max_eva: 48,
			max_rof: 76,
			skill: {
				name: "Doll Trigger",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description: "Passive: The first attack on a new target will hit twice. Active: Upon skill activation, each attack will hit twice on current target for #1 seconds.",
				number_of_stats: 1,
				stat1: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 2, 1],
				row2: [0, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["55%", "16%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["The Diving Bell and the Doll", "Solemn Rouge"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 206,
			name: "AK-12",
			type: "AR",
			rarity: 5,
			max_hp: 110,
			max_dmg: 56,
			max_acc: 62,
			max_eva: 52,
			max_rof: 78,
			skill: {
				name: "Eye of the Snow Wolf",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage, rate of fire, accuracy, and critical hit rate by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "17%", "19%", "22%", "24%", "26%", "28%", "31%", "33%", "35%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 2, 1],
				row2: [0, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["55%", "16%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Age of Slushies", "Silent Cyan", "Faint Light of Furthest Day"],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasAttack2Animation: [true, true, true],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, true, false],
				hasSit2Animation: [false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 207,
			name: "CZ2000",
			type: "AR",
			rarity: 4,
			max_hp: 110,
			max_dmg: 48,
			max_acc: 44,
			max_eva: 46,
			max_rof: 78,
			skill: {
				name: "Twilight Flame",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 and critical hit rate by #2 in daytime while increasing accuracy by #3 and fire rate by #4 in nighttime for #5 seconds.",
				number_of_stats: 5,
				stat1: ["40%", "43%", "46%", "48%", "51%", "54%", "57%", "59%", "62%", "65%"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat3: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat4: ["15%", "17%", "19%", "22%", "24%", "26%", "28%", "31%", "33%", "35%"],
				stat5: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
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
			id: 208,
			name: "HK21",
			type: "MG",
			rarity: 5,
			max_hp: 169,
			max_dmg: 92,
			max_acc: 29,
			max_eva: 33,
			max_rof: 135,
			skill: {
				name: "Indiscriminate Destruction",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description:
					"Increases damage by #1, accuracy by #2 and enters sweeping mode (switches target after every shot). While skill is active, reduces own movement speed by 50% and grants #3 ammo to current salvo for #4 seconds.",
				number_of_stats: 4,
				stat1: ["10%", "13%", "17%", "20%", "23%", "27%", "30%", "33%", "37%", "40%"],
				stat2: ["15%", "17%", "19%", "21%", "22%", "24%", "26%", "27%", "28%", "30%"],
				stat3: ["+1", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2", "+2"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Armor by "],
				stat2: ["15%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["The Bullet that Broke the Chain", "Silver Fox's 1/9 Platform"],
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
			id: 209,
			name: "OTs-39",
			type: "SMG",
			rarity: 3,
			max_hp: 190,
			max_dmg: 27,
			max_acc: 14,
			max_eva: 72,
			max_rof: 74,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2, 2.2, 2.3, 2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["16%"]
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
			id: 210,
			name: "CZ52",
			type: "HG",
			rarity: 3,
			max_hp: 76,
			max_dmg: 33,
			max_acc: 50,
			max_eva: 68,
			max_rof: 53,
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
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Southern Star"],
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
			id: 211,
			name: "SRS",
			type: "RF",
			rarity: 5,
			max_hp: 87,
			max_dmg: 135,
			max_acc: 82,
			max_eva: 35,
			max_rof: 35,
			skill: {
				name: "Hunting Demonstration",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
				stat2: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
			id: 212,
			name: "K5",
			type: "HG",
			rarity: 4,
			max_hp: 66,
			max_dmg: 29,
			max_acc: 52,
			max_eva: 81,
			max_rof: 62,
			skill: {
				name: "Museum of War Philosophy",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description:
					"Provides different bonus dependent on the type of T-Dolls currently standing on her buff tiles upon activation. HG/SMG T-Dolls will receive a #1 increase to evasion, AR/RF T-Dolls will receive a #2 bonus to damage, SG/MG T-Dolls will receive a #3 bonus to accuracy, last for #4 seconds.",
				number_of_stats: 4,
				stat1: ["20%", "22.2%", "24.4%", "26.7%", "28.9%", "31.1%", "33.3%", "35.5%", "37.7%", "40%"],
				stat2: ["10%", "11.3%", "12.7%", "14%", "15.3%", "16.7%", "18%", "19.3%", "20.6%", "22%"],
				stat3: ["40%", "44.4%", "48.9%", "53.3%", "57.8%", "62.2%", "66.7%", "71.1%", "75.6%", "80%"],
				stat4: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 1],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["30%", "40%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Moonlight on the Dome", "Waltz of Fate"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 213,
			name: "C-MS",
			type: "SMG",
			rarity: 5,
			max_hp: 185,
			max_dmg: 32,
			max_acc: 15,
			max_eva: 75,
			max_rof: 87,
			skill: {
				name: "Fickle Temper",
				initial_cooldown: "1s",
				cooldown: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				description:
					"Tap skill to switch between different ammunition types, each providing a different passive effect: [Subsonic rounds (default)]: Increases evasion by #1. [Spoon point tip]: Increases damage by #2. [Standard rounds]: Increases accuracy by #3.",
				number_of_stats: 3,
				stat1: ["30%", "34%", "38%", "42%", "46%", "49%", "53%", "57%", "61%", "65%"],
				stat2: ["40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%"],
				stat3: ["110%", "120%", "130%", "140%", "150%", "160%", "170%", "180%", "190%", "200%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["15%", "5%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["The Wonderful Adventures of Swan", "Advance of the Flying Fish"],
			animations: {
				hasSkillAnimation: [true, true],
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
			id: 214,
			name: "ADS",
			type: "AR",
			rarity: 5,
			max_hp: 121,
			max_dmg: 50,
			max_acc: 54,
			max_eva: 45,
			max_rof: 78,
			skill: {
				name: "Storm Surge",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: Normal attacks have #1 chance to apply 1 layer of Corrosion. When an enemy accumulates 5 layers of Corrosion, it deals #2 damage and stuns for #3 seconds in an extremely small area, and clears the Corrosion effect on the enemy. [Corrosion]: Reduces the target's rate of fire and movement speed by #4 for #5 seconds. Active: Fires a special grenade, applying 3 layers of Corrosion to targets within a radius of 2.5 units, and an additional 2 layers to the main targets of the grenade. After using the skill, chance of applying Corrosion on normal attacks increase to 100% for #6 seconds.",
				number_of_stats: 6,
				stat1: ["20%", "22%", "24%", "26%", "30%", "32%", "34%", "36%", "38%", "40%"],
				stat2: ["3x", "3.2x", "3.67x", "4x", "4.33x", "4.67x", "5x", "5.33x", "5.67x", "6x"],
				stat3: [1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4],
				stat4: ["3%", "3%", "4%", "4%", "4%", "5%", "5%", "5%", "6%", "6%"],
				stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Water-Coloured Youth"],
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
			id: 215,
			name: "MDR",
			type: "AR",
			rarity: 5,
			max_hp: 119,
			max_dmg: 56,
			max_acc: 50,
			max_eva: 41,
			max_rof: 76,
			skill: {
				name: "Danger Sniffer",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"If an ally is directly in front of her in battle, grant that ally with a #1 HP shield and #2 increased evasion. If no ally is in front of her, increase her damage by #3 and rate of fire by #4 for #5 seconds.",
				number_of_stats: 5,
				stat1: [15, 17.8, 20.6, 23.3, 26.1, 28.9, 31.7, 34.4, 37.2, 40],
				stat2: ["40%", "44%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%"],
				stat3: ["20%", "23%", "26%", "28%", "31%", "34%", "37%", "39%", "42%", "45%"],
				stat4: ["10%", "11%", "13%", "14%", "15%", "17%", "18%", "19%", "21%", "22%"],
				stat5: [6, 6.4, 6.8, 7.4, 7.8, 8.2, 8.6, 9.2, 9.6, 10]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["65%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Spirit Trap", "Cocktail Party Observer"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 216,
			name: "XM8",
			type: "AR",
			rarity: 4,
			max_hp: 108,
			max_dmg: 48,
			max_acc: 46,
			max_eva: 42,
			max_rof: 79,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["5x", "5.8x", "6.6x", "7.3x", "8.1x", "8.9x", "9.7x", "10.4x", "11.2x", "12x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "15%"]
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
			id: 217,
			name: "SM-1",
			type: "RF",
			rarity: 3,
			max_hp: 101,
			max_dmg: 95,
			max_acc: 79,
			max_eva: 40,
			max_rof: 40,
			skill: {
				name: "Assault Focus T",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
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
			id: 218,
			name: "T77",
			type: "SMG",
			rarity: 3,
			max_hp: 185,
			max_dmg: 24,
			max_acc: 11,
			max_eva: 69,
			max_rof: 92,
			skill: {
				name: "Cover Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
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
			id: 220,
			name: "MP-443",
			type: "HG",
			rarity: 3,
			max_hp: 70,
			max_dmg: 33,
			max_acc: 53,
			max_eva: 71,
			max_rof: 59,
			skill: {
				name: "Firepower Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decreases all enemies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "20%"]
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
			id: 221,
			name: "GSh-18",
			type: "HG",
			rarity: 3,
			max_hp: 70,
			max_dmg: 33,
			max_acc: 53,
			max_eva: 71,
			max_rof: 59,
			skill: {
				name: "Chain Assault",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Pulls out a secondary handgun and dual wields for #1 seconds, dealing guaranteed critical damage per shot while skill remains active.",
				number_of_stats: 1,
				stat1: [3, 3.3, 3.5, 3.7, 4.3, 4.7, 5, 5.3, 5.7, 6]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "40%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 221,
			name: "GSh-18 Mod",
			type: "HG",
			rarity: 4,
			max_hp: 74,
			max_dmg: 34,
			max_acc: 53,
			max_eva: 90,
			max_rof: 58,
			skill: {
				name: "Chain Assault",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Pulls out a secondary handgun and dual wields for #1 seconds, dealing guaranteed critical damage per shot while skill remains active.",
				number_of_stats: 1,
				stat1: [4, 4.4, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8]
			},
			skill2: {
				name: "Twin Star Protection",
				initial_cooldown: "Passive",
				description:
					'Every attack has a chance to grant 1 HP shields to allies on her tiles, where the chance is equal to her critical rate. The shields last for 60 seconds and can be stacked infinitely. Additionally, increases self critical damage by #1 while "Chain Assault" is active.',
				number_of_stats: 1,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 1],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["30%", "40%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Walking Operating Table"],
			animations: {
				hasSkillAnimation: [false],
				hasAttack2Animation: [true],
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
			id: 222,
			name: "TAC-50",
			type: "RF",
			rarity: 5,
			max_hp: 87,
			max_dmg: 155,
			max_acc: 83,
			max_eva: 31,
			max_rof: 32,
			skill: {
				name: "Maple and Firefly",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				passive_active_description: true,
				description:
					"Passive: At max charge stacks, TAC's drone will start marking a random enemy (marked enemy changes every second). Active: Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the marked target based on the current number of charge stacks. This skill is capable of critical damage and all charge stacks will be consumed on skill usage.",
				number_of_stats: 2,
				stat1: [1.5, 1.6, 1.7, 1.7, 1.8, 1.9, 2, 2, 2.1, 2.2],
				stat2: ["2.5x", "2.7x", "2.9x", "3.2x", "3.4x", "3.6x", "3.8x", "4.1x", "4.3x", "4.5x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Elven Demon Huntress"],
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
			id: 223,
			name: "Model L",
			type: "AR",
			rarity: 3,
			max_hp: 110,
			max_dmg: 50,
			max_acc: 45,
			max_eva: 41,
			max_rof: 73,
			skill: {
				name: "Lock-on Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases accuracy by #1 and rate of fire by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["40%", "46%", "51%", "56%", "62%", "68%", "74%", "79%", "85%", "90%"],
				stat2: ["16%", "19%", "22%", "24%", "27%", "30%", "32%", "35%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Instant Midnight Execution"],
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
			id: 224,
			name: "PM-06",
			type: "SMG",
			rarity: 5,
			max_hp: 190,
			max_dmg: 29,
			max_acc: 15,
			max_eva: 75,
			max_rof: 83,
			skill: {
				name: "Concealment Focus N",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "During nighttime, increases evasion by #1 (#2 during daytime) and accuracy by #3 (#4 during daytime) for #5 seconds.",
				number_of_stats: 5,
				stat1: ["60%", "70%", "80%", "90%", "100%", "110%", "120%", "130%", "140%", "150%"],
				stat2: ["30%", "32.2%", "34.4%", "36.7%", "38.9%", "41.1%", "43.3%", "45.6%", "47.8%", "50%"],
				stat3: ["40%", "44.4%", "48.9%", "53.3%", "57.8%", "62.2%", "66.7%", "71.1%", "75.6%", "80%"],
				stat4: ["20%", "22.2%", "24.4%", "26.7%", "28.9%", "31.1%", "33.3%", "35.6%", "37.8%", "40%"],
				stat5: [6, 6.4, 6.9, 7.3, 7.8, 8.2, 8.7, 9.1, 9.6, 10]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["12%", "35%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Soaring Magic"],
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
			id: 225,
			name: "Cx4 Storm",
			type: "SMG",
			rarity: 4,
			max_hp: 180,
			max_dmg: 34,
			max_acc: 16,
			max_eva: 74,
			max_rof: 64,
			skill: {
				name: "Concealment Focus",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases evasion by #1 and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["40%", "44%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%"],
				stat2: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
				stat3: [6, 6.4, 6.9, 7.3, 7.8, 8.2, 8.7, 9.1, 9.6, 10]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["15%", "10%"]
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
			id: 226,
			name: "Mk 12",
			type: "RF",
			rarity: 4,
			max_hp: 81,
			max_dmg: 101,
			max_acc: 82,
			max_eva: 32,
			max_rof: 46,
			skill: {
				name: "Rage Induced Inspirations",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire and critical damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 227,
			name: "A-91",
			type: "AR",
			rarity: 4,
			max_hp: 113,
			max_dmg: 52,
			max_acc: 50,
			max_eva: 37,
			max_rof: 75,
			skill: {
				name: "Anti-Personnel Grenade N",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Launches a grenade dealing #1 damage in a 1.5 unit radius. During nighttime, grants self an additional buff on grenade launch, increasing her damage and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["4x", "4.7x", "5.3x", "6x", "6.7x", "7.3x", "8x", "8.7x", "9.3x", "10x"],
				stat2: ["20%", "23.3%", "26.7%", "30%", "33.3%", "36.7%", "40%", "43.3%", "46.7%", "50%"],
				stat3: [6, 6.4, 6.9, 7.3, 7.8, 8.2, 8.7, 9.1, 9.6, 10]
			},
			tile_set: {
				row1: [0, 2, 1],
				row2: [0, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Inflammable Oolong Tea"],
			animations: {
				hasSkillAnimation: [true],
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
			id: 228,
			name: "Type 100",
			type: "SMG",
			rarity: 5,
			max_hp: 212,
			max_dmg: 29,
			max_acc: 12,
			max_eva: 67,
			max_rof: 76,
			skill: {
				name: "Cherry Blossom's Reflection",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Grants self a #1 HP shield for 5 seconds. If the shield breaks, increases own evasion by #2 for #3 seconds. If the shield expires without breaking, increases own damage by #4 for #5 seconds instead.",
				number_of_stats: 5,
				stat1: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
				stat2: ["30%", "34%", "38%", "42%", "46%", "49%", "53%", "57%", "61%", "65%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat4: ["40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%"],
				stat5: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["12%", "35%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Armed Shrine Maiden", "Treasure Buried Deep", "Kagura Vestments"],
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
			id: 229,
			name: "M870",
			type: "SG",
			rarity: 5,
			max_hp: 264,
			max_dmg: 33,
			max_acc: 12,
			max_eva: 13,
			max_rof: 29,
			max_armor: 23,
			skill: {
				name: "Highway to Hell",
				initial_cooldown: "10s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Grants self a barrier with Defense value of #1 points (Max Defense of 1000) which reduces incoming damage by #2 for #3 seconds. Barrier Defense decays by 100 points (-10% damage reduction) per second.",
				number_of_stats: 3,
				stat1: [550, 600, 650, 700, 750, 800, 850, 900, 950, 1000],
				stat2: ["55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"],
				stat5: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 0, 0],
				row3: [1, 0, 2],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["18%", "12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Pumpkin Fortification"],
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
			id: 230,
			name: "OBR",
			type: "RF",
			rarity: 3,
			max_hp: 81,
			max_dmg: 117,
			max_acc: 80,
			max_eva: 32,
			max_rof: 37,
			skill: {
				name: "Lock-on Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire and accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["28%", "29%", "31%", "33%", "35%", "37%", "39%", "41%", "43%", "45%"],
				stat2: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
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
			id: 231,
			name: "M82A1",
			type: "RF",
			rarity: 5,
			max_hp: 88,
			max_dmg: 158,
			max_acc: 77,
			max_eva: 30,
			max_rof: 34,
			skill: {
				name: "Prophecy of a False God",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"Gain 3 special bullets each battle. Each use of the skill will expend 1 bullet and has her aim for 1 second and do #1 damage to her target. The last bullet will deal double damage and reduces the target's damage by #2 for #3 seconds. Every victory in the current mission will increase her skill damage by #4 up to 3 stacks maximum.",
				number_of_stats: 4,
				stat1: ["2.5x", "2.69x", "2.88%", "3.07%", "3.26%", "3.44%", "3.63%", "3.82%", "4.01%", "4.2%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat4: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
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
			id: 232,
			name: "MP-448",
			type: "HG",
			rarity: 3,
			max_hp: 64,
			max_dmg: 26,
			max_acc: 62,
			max_eva: 99,
			max_rof: 60,
			skill: {
				name: "Cover Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["36%", "37%", "38%", "39%", "41%", "42%", "43%", "44%", "45%", "46%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["12%", "20%"]
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
			id: 233,
			name: "Px4 Storm",
			type: "HG",
			rarity: 5,
			max_hp: 68,
			max_dmg: 35,
			max_acc: 69,
			max_eva: 93,
			max_rof: 57,
			skill: {
				name: "Hunting Token",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Sacrifice #1 critical rate of all allies on her tiles to increase their critical damage by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["30%", "29%", "28%", "27%", "26%", "24%", "23%", "22%", "21%", "20%"],
				stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 1, 0],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "60%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Queen of Christmas Morning"],
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
			id: 234,
			name: "JS 9",
			type: "SMG",
			rarity: 5,
			max_hp: 180,
			max_dmg: 27,
			max_acc: 15,
			max_eva: 86,
			max_rof: 89,
			skill: {
				name: "Last Minute Preparations",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"Gain stacks of evasion (#1 per stack) and damage (#2 per stack) for #3 seconds for each group of enemies on the field. Upon skill activation, if there is only one group of enemies, gain 3 stacks of damage. For every additional group of enemies, gain 1 evasion stack and lose 1 damage stack. Max 6 stacks.",
				number_of_stats: 3,
				stat1: ["15%", "17%", "19%", "22%", "24%", "26%", "28%", "31%", "33%", "35%"],
				stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Critical Rate by "],
				stat2: ["18%", "30%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Kerria's Intimacy", "Orca's Journey"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 235,
			name: "SPR A3G",
			type: "RF",
			rarity: 4,
			max_hp: 87,
			max_dmg: 130,
			max_acc: 83,
			max_eva: 31,
			max_rof: 35,
			skill: {
				name: "Self Exuberance",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Marks the current attack target, after a 1.5 second aim time, unleash a charged shot dealing #1 damage to the target, mark effect persists on target for 5 seconds. If marked target dies while mark is active, increase self rate of fire by #2, lasts for 5 seconds.",
				number_of_stats: 2,
				stat1: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 236,
			name: "K11",
			type: "AR",
			rarity: 5,
			max_hp: 135,
			max_dmg: 53,
			max_acc: 54,
			max_eva: 37,
			max_rof: 76,
			skill: {
				name: "Terror Grenades",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Launches grenades based on self dummy link expansions, dealing #1 damage to enemies within a radius of 1 unit. Enemies hit by grenades is marked for 3 seconds. When K11's grenades in the same salvo hit marked enemies, they take an additional 2x damage.",
				number_of_stats: 1,
				stat1: ["2x", "2.2x", "2.4x", "2.7x", "3x", "3.2x", "3.4x", "3.6x", "3.8x", "4x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["15%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Precious Scientist"],
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
			id: 237,
			name: "SAR-21",
			type: "AR",
			rarity: 4,
			max_hp: 116,
			max_dmg: 44,
			max_acc: 46,
			max_eva: 38,
			max_rof: 80,
			skill: {
				name: "Great Meteor Storm",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "At the cost of reducing own accuracy by #1, raise own rate of fire to 150 and enter sweep mode (switch target after every shot), last for #2 seconds.",
				number_of_stats: 2,
				stat1: ["-30%", "-27%", "-23%", "-20%", "-17%", "-13%", "-10%", "-7%", "-3%", "-0%"],
				stat2: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["20%", "55%"]
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
			id: 238,
			name: "QJY-88",
			type: "MG",
			rarity: 5,
			max_hp: 165,
			max_dmg: 86,
			max_acc: 33,
			max_eva: 35,
			max_rof: 126,
			skill: {
				name: "Slothful Rage",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"Passive: Switch to LMG mode if she moves, which increases movement speed by 50% and decreases accuracy by #1. Remaining stationary for 6 seconds will switch her to HMG mode, which increases the number of rounds fired per volley by #2 and accuracy by #3. Active: Increase damage by #4 for #5 seconds.",
				number_of_stats: 5,
				stat1: ["40%", "38%", "36%", "33%", "31%", "29%", "27%", "24%", "22%", "20%"],
				stat2: ["+0", "+0", "+0", "+1", "+1", "+1", "+2", "+2", "+2", "+2"],
				stat3: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat4: ["27%", "32%", "38%", "43%", "48%", "54%", "59%", "64%", "70%", "75%"],
				stat5: [4, 4.2, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 1],
				row3: [2, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Ghost Orchid", "Anti-Drowning Accessory"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 239,
			name: "Type 03",
			type: "AR",
			rarity: 3,
			max_hp: 116,
			max_dmg: 51,
			max_acc: 47,
			max_eva: 39,
			max_rof: 71,
			skill: {
				name: "Elimination Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage and critical hit rate by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["12%", "12%"]
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
			id: 240,
			name: "Mk46",
			type: "MG",
			rarity: 4,
			max_hp: 162,
			max_dmg: 78,
			max_acc: 34,
			max_eva: 36,
			max_rof: 142,
			skill: {
				name: "Raid Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "23%", "26%", "29%", "33%", "36%", "39%", "43%", "47%", "50%"],
				stat2: ["30%", "34%", "39%", "43%", "48%", "52%", "57%", "61%", "66%", "70%"],
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
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
			id: 241,
			name: "RT-20",
			type: "RF",
			rarity: 3,
			max_hp: 90,
			max_dmg: 158,
			max_acc: 78,
			max_eva: 28,
			max_rof: 27,
			skill: {
				name: "Interdiction Shot",
				initial_cooldown: "8s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3],
				stat2: ["3x", "3.4x", "3.8x", "4.2x", "4.6x", "4.9x", "5.3x", "5.7x", "6.1x", "6.5x"]
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
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 242,
			name: "P22",
			type: "HG",
			rarity: 5,
			max_hp: 70,
			max_dmg: 28,
			max_acc: 66,
			max_eva: 110,
			max_rof: 62,
			skill: {
				name: "Decisive Battle Sequence",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Grant/increase allies in the front/middle/back columns by a #1 HP shield/#2 accuracy and evasion/#3 damage respectively for #4 seconds.",
				number_of_stats: 4,
				stat1: [26, 29, 32, 35, 38, 41, 44, 47, 50, 53],
				stat2: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat3: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat4: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 1, 1],
				row3: [1, 2, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["30%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Soaring Dash"],
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
			id: 243,
			name: "64 Shiki",
			type: "AR",
			rarity: 5,
			max_hp: 125,
			max_dmg: 67,
			max_acc: 62,
			max_eva: 43,
			max_rof: 63,
			skill: {
				name: "Future Warning",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Upon skill activation, if there are more than 5 groups of enemies, increases rate of fire and accuracy by #1, otherwise increases damage by #2, duration 3 seconds. After 3 seconds, if there are more than 2 groups of enemies, grant a #3 HP shield to allies on her tiles, otherwise increases damage of self and allies on her tiles by #4, duration 5 seconds.",
				number_of_stats: 4,
				stat1: ["30%", "36%", "41%", "47%", "52%", "58%", "63%", "69%", "74%", "80%"],
				stat2: ["40%", "46%", "51%", "56%", "62%", "68%", "74%", "79%", "85%", "90%"],
				stat3: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
				stat4: ["25%", "28%", "32%", "35%", "38%", "42%", "45%", "48%", "52%", "55%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["18%", "18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["New Years' Prayer"],
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
			id: 244,
			name: "TEC-9",
			type: "HG",
			rarity: 3,
			max_hp: 83,
			max_dmg: 28,
			max_acc: 46,
			max_eva: 63,
			max_rof: 63,
			skill: {
				name: "Firepower Suppression N",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "During nighttime, decreases all enemies damage by #1 (#2 during daytime) for #3 seconds (#4 seconds during daytime).",
				number_of_stats: 4,
				stat1: ["22%", "24%", "26%", "28%", "30%", "32%", "34%", "36%", "38%", "40%"],
				stat2: ["13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "21%", "22%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 1],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
				stat2: ["32%"]
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
			id: 245,
			name: "P90",
			type: "SMG",
			rarity: 5,
			max_hp: 190,
			max_dmg: 30,
			max_acc: 15,
			max_eva: 83,
			max_rof: 93,
			skill: {
				name: "Squirrel",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					'Passive: Activates "Arc Shadow" for 3 seconds upon losing 5% health. 6 second cooldown. [Arc Shadow]: Gain a stackable #1 evasion increase every second. The following four attacks will be guaranteed hits and crits. Active: Activate "Arc Shadow" for 5 seconds and deploy 999 armor, 3 HP holograms for 3 seconds. The number of holograms deployed depend upon the number of Dummy Links.',
				number_of_stats: 1,
				stat1: ["8%", "9%", "11%", "12%", "13%", "15%", "16%", "17%", "19%", "20%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["12%", "30%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Crimson Turbine"],
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
			id: 247,
			name: "K31",
			type: "RF",
			rarity: 4,
			max_hp: 78,
			max_dmg: 126,
			max_acc: 78,
			max_eva: 37,
			max_rof: 39,
			skill: {
				name: "Emergency Speed",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "At the cost of decreasing her own accuracy by #1, increases her own rate of fire by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "32%", "33%", "35%"],
				stat2: ["40%", "44%", "49%", "53%", "58%", "62%", "67%", "71%", "76%", "80%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 248,
			name: "Jericho",
			type: "HG",
			rarity: 4,
			max_hp: 76,
			max_dmg: 31,
			max_acc: 50,
			max_eva: 64,
			max_rof: 60,
			skill: {
				name: "Crimson Eclipse",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"Passive: Whenever an ally situated on her tiles reload, increase their damage and accuracy by 5% for 15 seconds. Max 3 stacks. Active: Increase damage of allies situated on her tiles by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 1],
				row2: [1, 2, 1],
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
			id: 249,
			name: "62 Shiki",
			type: "MG",
			rarity: 3,
			max_hp: 169,
			max_dmg: 87,
			max_acc: 31,
			max_eva: 28,
			max_rof: 122,
			skill: {
				name: "Raid Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["18%", "21%", "24%", "27%", "30%", "33%", "36%", "39%", "42%", "45%"],
				stat2: ["25%", "29%", "34%", "38%", "43%", "47%", "52%", "56%", "61%", "65%"],
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 1],
				row3: [2, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
				stat2: ["18%", "8%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["New Year's Garden Party"],
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
			id: 250,
			name: "HS2000",
			type: "HG",
			rarity: 5,
			max_hp: 72,
			max_dmg: 33,
			max_acc: 61,
			max_eva: 87,
			max_rof: 62,
			skill: {
				name: "Counterattacker Barrier",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Grant a #1 HP shield to all allies for 6 seconds. If the shield still persists after 3 seconds, increase the damage and accuracy of those allies by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
				stat2: ["18%", "20%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "35%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [1, 1, 1],
				row3: [0, 2, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["30%", "20%"]
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
			id: 251,
			name: "X95",
			type: "SMG",
			rarity: 5,
			max_hp: 194,
			max_dmg: 34,
			max_acc: 13,
			max_eva: 67,
			max_rof: 90,
			skill: {
				name: "Flower Lock",
				initial_cooldown: "4s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"For #1 seconds upon skill activation, attacks will be directed at enemies with the lowest HP. Damage is increased the lower the enemy's HP. The damage increase multiplier is calculated at #2 the target's lost HP %.",
				number_of_stats: 2,
				stat1: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat2: ["1.2x", "1.4x", "1.6x", "1.8x", "2x", "2.2x", "2.4x", "2.6x", "2.8x", "3x"]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["15%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["White Rose Girl"],
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
			id: 252,
			name: "KSVK",
			type: "RF",
			rarity: 4,
			max_hp: 88,
			max_dmg: 158,
			max_acc: 78,
			max_eva: 30,
			max_rof: 31,
			skill: {
				name: "Concussive Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Start to charge after skill cool down. Increase charges by 1 stack every second, 5 stacks maximum. Tap the skill to aim for 1 second, remove all charges and deal #1 ~ #2 damage to the closest target depending on the number of stacks. Additionally, deal 0.5x damage to enemies within a radius of 2 behind the main target and decrease their accuracy and rate of fire by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: [1.2, 1.3, 1.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat2: ["2x", "2.2x", "2.4x", "2.7x", "3x", "3.2x", "3.4x", "3.6x", "3.8x", "4x"],
				stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 1, 0],
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
		mod: {
			id: 252,
			name: "KSVK Mod",
			type: "RF",
			rarity: 5,
			max_hp: 91,
			max_dmg: 165,
			max_acc: 87,
			max_eva: 31,
			max_rof: 32,
			skill: {
				name: "Concussive Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Start to charge after skill cool down. Increase charges by 1 stack every second, 5 stacks maximum. Tap the skill to aim for 1 second, remove all charges and deal #1 ~ #2 damage to the closest target depending on the number of stacks. Additionally, deal 0.5x damage to enemies within a radius of 2 behind the main target and decrease their accuracy and rate of fire by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: [1.25, 1.4, 1.55, 1.7, 1.85, 2, 2.15, 2.3, 2.45, 2.6],
				stat2: ["2.3x", "2.6x", "2.9x", "3.2x", "3.5x", "3.8x", "4.1x", "4.4x", "4.7x", "5x"],
				stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			skill2: {
				name: "Shockwave Demolition Round",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"When any enemy units are suffering from a negative status effect, normal attacks switch to Demolition Round mode and prioritize the closest enemies with negative status effects on them, also dealing #1 splash damage to all enemy units in a 2-unit radius behind their target.",
				number_of_stats: 1,
				stat1: ["0.15x", "0.17x", "0.18x", "0.2x", "0.22x", "0.23x", "0.25x", "0.27x", "0.28x", "0.3x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 1, 1],
				row3: [0, 1, 0],
				targets: "Buffs HG and SG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 3,
			skin_names: ["Angel's Brush", "Darkside Moonwalk", "The Truman Traveller"],
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
			id: 253,
			name: "Lewis",
			type: "MG",
			rarity: 5,
			max_hp: 190,
			max_dmg: 102,
			max_acc: 31,
			max_eva: 31,
			max_rof: 116,
			skill: {
				name: "Dynami",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"Passive: Reduce reload time by 15% after every reload, max 45% reduction. Increase the number of rounds fired per volley by 1 after every reload, max 3 rounds Active: Increase damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["27%", "32%", "38%", "43%", "48%", "54%", "59%", "64%", "70%", "75%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Sunscreen Battle", "Holy Night Promise"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 254,
			name: "UKM-2000",
			type: "MG",
			rarity: 4,
			max_hp: 169,
			max_dmg: 90,
			max_acc: 26,
			max_eva: 26,
			max_rof: 115,
			skill: {
				name: "White Night Solo",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description:
					"During nighttime, increase accuracy by #1 (#2 during daytime), the number of rounds fired per volley by 4 (2 during daytime), and reduce reload time by 30% (no change during daytime) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["40%", "44%", "48%", "54%", "58%", "62%", "66%", "72%", "76%", "80%"],
				stat2: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Swift Whirlwind"],
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
			id: 255,
			name: "Steyr Scout",
			type: "RF",
			rarity: 3,
			max_hp: 90,
			max_dmg: 114,
			max_acc: 78,
			max_eva: 35,
			max_rof: 35,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 256,
			name: "Falcon",
			type: "RF",
			rarity: 3,
			max_hp: 88,
			max_dmg: 140,
			max_acc: 71,
			max_eva: 28,
			max_rof: 32,
			skill: {
				name: "Sunset Falcon",
				initial_cooldown: "6s",
				cooldown: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				passive_passive_active_description: true,
				description:
					"Passive 1: Gain one special bullet 6 seconds after battle start, then one every 8 seconds afterward. Max two special bullets. Each special bullet held increases damage and accuracy by #1. Passive 2: Use a normal bullet to initiate a normal attack every 1 second to deal 1.5x damage to the farthest enemy. Max two normal bullets. Reload after normal bullets are depleted. Reload time depends upon rate of fire. Active: Use one special bullet to aim for 2 seconds to deal #2 damage (can crit) to the enemy with the highest HP.",
				number_of_stats: 2,
				stat1: ["6%", "7%", "9%", "10%", "11%", "13%", "14%", "15%", "16%", "18%"],
				stat2: ["1.5x", "1.61x", "1.72x", "1.83x", "1.94x", "2.06x", "2.17x", "2.28x", "2.39x", "2.5x"]
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
		skins: {
			number_of_skins: 1,
			skin_names: ["With You"],
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
			id: 257,
			name: "m200",
			type: "RF",
			rarity: 5,
			max_hp: 88,
			max_dmg: 145,
			max_acc: 96,
			max_eva: 31,
			max_rof: 34,
			skill: {
				name: "Unspoken Killing Intent",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: Normal attacks against armorless enemies deal 1.05x damage. Active: Enter sniper mode for 9 seconds. After every #1 seconds of aiming, deal #2 damage (able to crit, but affected by armor) that cannot be dodged to the furthest target and decrease their damage by #3 for 3 seconds.",
				number_of_stats: 3,
				stat1: [2.5, 2.4, 2.3, 2.2, 2.1, 1.9, 1.8, 1.7, 1.6, 1.5],
				stat2: ["1.5x", "1.56x", "1.61x", "1.67x", "1.72x", "1.78x", "1.83x", "1.89x", "1.94x", "2x"],
				stat3: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
		skins: {
			number_of_skins: 1,
			skin_names: ["War Correspondent"],
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
			id: 258,
			name: "Magal",
			type: "AR",
			rarity: 3,
			max_hp: 116,
			max_dmg: 47,
			max_acc: 47,
			max_eva: 43,
			max_rof: 70,
			skill: {
				name: "Charge Focus",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 and rate of fire by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["35%", "37%", "38%", "40%", "42%", "43%", "45%", "47%", "48%", "50%"],
				stat2: ["12%", "13%", "14%", "15%", "16%", "16%", "16%", "18%", "19%", "20%"],
				stat3: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["50%", "12%"]
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
			id: 259,
			name: "PM-9",
			type: "SMG",
			rarity: 5,
			max_hp: 176,
			max_dmg: 28,
			max_acc: 13,
			max_eva: 85,
			max_rof: 102,
			skill: {
				name: "Phanstasmal Dark Force",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increase evasion by #1, decrease damage and accuracy by #2, and all attacks will hit twice for #3 seconds.",
				number_of_stats: 3,
				stat1: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat2: ["50%", "48%", "46%", "43%", "41%", "39%", "37%", "34%", "32%", "30%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [0, 0, 0],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 260,
			name: "PA-15",
			type: "HG",
			rarity: 5,
			max_hp: 70,
			max_dmg: 35,
			max_acc: 65,
			max_eva: 76,
			max_rof: 64,
			skill: {
				name: "High-Octane Paradise",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description:
					"Stun the enemy with the highest HP for #1 second and deal #2 damage (perfect accuracy, affected by armor, able to crit). If there are enemies horizontally adjacent to the target within a radius of 2.5, stun them for #3 second and deal #4 damage (perfect accuracy, affected by armor, able to crit).",
				number_of_stats: 4,
				stat1: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3],
				stat2: ["2.5x", "2.67x", "2.83x", "3x", "3.17x", "3.33x", "3.5x", "3.67x", "3.83x", "4x"],
				stat3: [1, 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 1.8, 1.9, 2],
				stat4: ["1.2x", "1.29x", "1.38x", "1.47x", "1.56x", "1.64x", "1.73x", "1.82x", "1.91x", "2x"]
			},
			tile_set: {
				row1: [1, 2, 1],
				row2: [1, 1, 1],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["30%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Highschool Heartbeat Story", "Larkspur's Allure", "Marvellous Herb Cake"],
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
			id: 261,
			name: "QBU-88",
			type: "RF",
			rarity: 5,
			max_hp: 84,
			max_dmg: 126,
			max_acc: 87,
			max_eva: 41,
			max_rof: 42,
			skill: {
				name: "Rocks Piercing Clouds",
				initial_cooldown: "4s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"Passive: After attacking the same target 2 times, deal #1 bonus explosive damage to enemies within a small radius on the next attack. Active: Begin charging after skill cooldown ends, gaining 1 charge stack every 1s, up to a maximum of 4 stacks. When skill is activated, aim for 1s, then deal #2 ~ #3 damage to the enemy with the highest HP based on the current number of charge stacks. Additionally, deal #4 explosive damage to enemies within a radius of 1.5 units. All stacks will be consumed on skill use.",
				number_of_stats: 4,
				stat1: ["0.8x", "0.88x", "0.96x", "1.03x", "1.11x", "1.19x", "1.27x", "1.34x", "1.42x", "1.5x"],
				stat2: ["1.8x", "1.9x", "2x", "2x", "2.1x", "2.2x", "2.3x", "2.3x", "2.4x", "2.5x"],
				stat3: ["3x", "3.2x", "3.4x", "3.7x", "3.9x", "4.1x", "4.3x", "4.6x", "4.8x", "5x"],
				stat4: ["0.8x", "0.88x", "0.96x", "1.03x", "1.11x", "1.19x", "1.27x", "1.34x", "1.42x", "1.5x"]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 1, 0],
				row3: [2, 1, 0],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["Sweets Extortionist", "Natural Explorer"],
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
			id: 262,
			name: "EM-2",
			type: "AR",
			rarity: 4,
			max_hp: 119,
			max_dmg: 57,
			max_acc: 48,
			max_eva: 48,
			max_rof: 61,
			skill: {
				name: "Cookie Blam Shot",
				initial_cooldown: "4s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Shoot 3 quick shots to deal #1 damage to a random enemy (perfect accuracy, affected by armor, able to crit).",
				number_of_stats: 1,
				stat1: ["2x", "2.18x", "2.36x", "2.53x", "2.71x", "2.89x", "3.07x", "3.24x", "3.42x", "3.5x"]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 1, 0],
				row3: [2, 1, 0],
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Clove's Fragrance"],
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
			id: 263,
			name: "Gr MG36",
			type: "MG",
			rarity: 5,
			max_hp: 183,
			max_dmg: 85,
			max_acc: 34,
			max_eva: 36,
			max_rof: 129,
			skill: {
				name: "Shadow Veil",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"Passive: Reduce damage taken by 20% for allies on her tiles when she is reloading. Active: Increase damage by #1 for #2 seconds. In addition, gain extra stats for herself depending on the types of allies on her tiles: AR increases accuracy by 25% for 4 seconds, SMG reduces the time of the next reload by 25%, and SG increases ammo count by 1. Max 3 stacks per type.",
				number_of_stats: 2,
				stat1: ["25%", "28%", "32%", "35%", "38%", "42%", "45%", "48%", "52%", "55%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 1, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG, AR and SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Crimson Mallow", "Bamboo Shadow Samurai"],
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
			id: 264,
			name: "Chauchat",
			type: "MG",
			rarity: 4,
			max_hp: 174,
			max_dmg: 102,
			max_acc: 34,
			max_eva: 30,
			max_rof: 81,
			skill: {
				name: "Fleur-de-lis",
				initial_cooldown: "6s",
				cooldown: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				passive_active_description: true,
				description:
					"Passive: Start the battle with 1 fleur-de-lis. Gain 1 fleur-de-lis every #1 seconds. Max 4 stacks. Active: Consume 1 fleur-de-lis to reduce the time of the next reload by #2. Max 2 stacks.",
				number_of_stats: 2,
				stat1: [6, 5.8, 5.6, 5.3, 5.1, 4.9, 4.7, 4.4, 4.2, 4],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [0, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Armor by "],
				stat2: ["12%", "12%"]
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
			id: 265,
			name: "Gr HK33",
			type: "AR",
			rarity: 3,
			max_hp: 105,
			max_dmg: 49,
			max_acc: 51,
			max_eva: 46,
			max_rof: 73,
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
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
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
			id: 266,
			name: "R93",
			type: "RF",
			rarity: 5,
			max_hp: 81,
			max_dmg: 133,
			max_acc: 97,
			max_eva: 34,
			max_rof: 39,
			skill: {
				name: "Lucky Trigger",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					"Passive: Consecutive attacks on the same target within 3 seconds will increase rate of fire by #1 for 3 seconds. Max 3 stacks. Stacks reset when target changes. Active: Increase damage by #2 for #3 seconds. The target switches to the farthest enemy until it dies. While the skill is active, stacks do not reset when target changes.",
				number_of_stats: 3,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["Holiday Lucky Star", "Wisteria Songstress"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 267,
			name: "MP41",
			type: "SMG",
			rarity: 3,
			max_hp: 194,
			max_dmg: 30,
			max_acc: 13,
			max_eva: 60,
			max_rof: 77,
			skill: {
				name: "Smoke Grenade",
				initial_cooldown: "1s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a smoke grenade that decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "22%", "24%", "25%", "27%", "29%", "31%", "32%", "34%", "36%"],
				stat2: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
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
			id: 268,
			name: "T-CMS",
			type: "RF",
			rarity: 3,
			max_hp: 88,
			max_dmg: 120,
			max_acc: 75,
			max_eva: 27,
			max_rof: 37,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
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
			id: 269,
			name: "P30",
			type: "HG",
			rarity: 4,
			max_hp: 70,
			max_dmg: 32,
			max_acc: 62,
			max_eva: 85,
			max_rof: 55,
			skill: {
				name: "Vengeance of Small Grievance",
				initial_cooldown: "3s",
				cooldown: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				description:
					"Press skill to switch between modes. [In Midst of Vengeance (default)]: Increase rate of fire of all allies by #1 (cannot activate Python's passive). [Determination to Pursue]: Increase movement speed of all allies by #2.",
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"]
			},
			tile_set: {
				row1: [1, 2, 1],
				row2: [1, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["18%", "60%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Devil's Ring Pop"],
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
			id: 270,
			name: "4 Shiki",
			type: "RF",
			rarity: 4,
			max_hp: 84,
			max_dmg: 112,
			max_acc: 74,
			max_eva: 37,
			max_rof: 39,
			skill: {
				name: "Dead Line Strike",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description: "Passive: Every third attack deals 1x damage with perfect accuracy and piercing effect. Active: Increase rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "28%", "32%", "35%", "38%", "42%", "45%", "48%", "52%", "55%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
			number_of_skins: 2,
			skin_names: ["Cape No. 4", "Paddle of Flower Petals"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [true, false],
				hasSit2Animation: [false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 271,
			name: "K3",
			type: "MG",
			rarity: 3,
			max_hp: 165,
			max_dmg: 78,
			max_acc: 30,
			max_eva: 35,
			max_rof: 134,
			skill: {
				name: "Lock and Load",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
				number_of_stats: 3,
				stat1: ["18%", "19%", "21%", "22%", "23%", "25%", "26%", "27%", "29%", "30%"],
				stat2: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3"],
				stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
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
			id: 272,
			name: "Desert Eagle",
			type: "HG",
			rarity: 5,
			max_hp: 73,
			max_dmg: 41,
			max_acc: 57,
			max_eva: 66,
			max_rof: 55,
			skill: {
				name: "Deterrent Mark",
				initial_cooldown: "8s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"Passive: Attacks penetrate HP shields and deal an equivalent amount of damage to the HP shield as well. Active: Increase self rate of fire by #1 for #2 seconds. Mark 3 enemy units with the highest combined HP and shield, and increase their damage taken by 10% for #3 seconds. Prioritize attacking the marked enemies, increasing the final damage dealt to marked enemies by #4 every attack, stacking up to 3 times.",
				number_of_stats: 4,
				stat1: ["15%", "18%", "21%", "23%", "26%", "29%", "32%", "34%", "37%", "40%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat3: [6, 6.7, 7.3, 8, 8.7, 9.3, 10, 10.7, 11.3, 12],
				stat4: ["1.3x", "1.33x", "1.37x", "1.4x", "1.43x", "1.47x", "1.5x", "1.53x", "1.57x", "1.6x"]
			},
			tile_set: {
				row1: [2, 1, 1],
				row2: [1, 1, 0],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["30%", "20%"]
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
			id: 273,
			name: "SSG 3000",
			type: "RF",
			rarity: 4,
			max_hp: 88,
			max_dmg: 126,
			max_acc: 77,
			max_eva: 30,
			max_rof: 37,
			skill: {
				name: "Silent Hunter",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Enter sniper mode for 9 seconds. After every #1 seconds of aiming, deal #2 damage (perfect accuracy, affected by armor, able to crit) to the furthest target and decrease their damage by #3 for 3 seconds.",
				number_of_stats: 3,
				stat1: [2.5, 2.4, 2.3, 2.2, 2.1, 1.9, 1.8, 1.7, 1.6, 1.5],
				stat2: ["1.2x", "1.27x", "1.33x", "1.4x", "1.47x", "1.53x", "1.6x", "1.67x", "1.73x", "1.8x"],
				stat3: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 274,
			name: "ACR",
			type: "AR",
			rarity: 5,
			max_hp: 116,
			max_dmg: 54,
			max_acc: 54,
			max_eva: 48,
			max_rof: 77,
			skill: {
				name: "Shadow Strangulation Tune",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					"Passive: Increase damage when attacking debuffed enemies. Increase damage by #1 if the enemy has 1 debuff. Further increase damage by #2 for each different type of debuff on the enemy. Debuffs include: damage decrease, rate of fire decrease, accuracy decrease, evasion decrease, armor decrease, movement speed decrease, burning, stun. Active: Increase rate of fire by #3 for #4 seconds. Decrease the damage of ACR's target by #5 for 3 seconds, up to 5 stacks.",
				number_of_stats: 5,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: ["3%", "3%", "3%", "4%", "4%", "4%", "5%", "5%", "5%", "5%"],
				stat3: ["20%", "23%", "27%", "30%", "33%", "37%", "40%", "43%", "47%", "50%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat5: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 1],
				row3: [0, 2, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["25%", "65%"]
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
			id: 275,
			name: "M1895 CB",
			type: "AR",
			rarity: 5,
			max_hp: 190,
			max_dmg: 90,
			max_acc: 26,
			max_eva: 23,
			max_rof: 131,
			skill: {
				name: "Preparedness",
				initial_cooldown: "3s",
				cooldown: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
				passive_active_description: true,
				description:
					"Passive: Start the battle with 30 reserve ammo. Gain 1 reserve ammo every 3 seconds when not reloading. Active: Press skill to activate Reserve Ammo Shooting mode. Each attack will use 1 reserve ammo to increase damage by #1 but decrease accuracy by #2 up to a max of 10 stacks for 5 seconds. Normal ammo remaining will be used up before using the reserve ammo. Press skill again to deactivate Reserve Ammo Shooting mode.",
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: ["25%", "24%", "23%", "22%", "21%", "19%", "18%", "17%", "16%", "15%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
				stat2: ["10%", "12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Slipper Orchid"],
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
			id: 276,
			name: "Kord",
			type: "MG",
			rarity: 5,
			max_hp: 198,
			max_dmg: 109,
			max_acc: 22,
			max_eva: 21,
			max_rof: 110,
			skill: {
				name: "High Pressure Assault",
				initial_cooldown: "0s",
				cooldown: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				passive_active_description: true,
				description:
					"Press skill to switch between modes. [Pierce (default)]: Attacks pierce through enemies, but decrease damage by #1 and armor penetration by 50%. [Assault]: Increase damage and accuracy by #2.",
				number_of_stats: 2,
				stat1: ["45%", "43%", "42%", "40%", "38%", "37%", "35%", "33%", "32%", "30%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Armor by "],
				stat2: ["15%", "15%"]
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
			id: 277,
			name: "Gr VP70",
			type: "HG",
			rarity: 3,
			max_hp: 66,
			max_dmg: 31,
			max_acc: 54,
			max_eva: 75,
			max_rof: 60,
			skill: {
				name: "Firepower Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decreases all enemies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["20%", "50%"]
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
			id: 278,
			name: "Six12",
			type: "SG",
			rarity: 3,
			max_hp: 242,
			max_dmg: 34,
			max_acc: 13,
			max_eva: 13,
			max_rof: 30,
			max_armor: 20,
			skill: {
				name: "Burst Impact",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Performs an additional attack which deals #1 damage and pushes targets back by #2 units.",
				number_of_stats: 2,
				stat1: ["1.2x", "1.3x", "1.5x", "1.6x", "1.8x", "1.9x", "2.1x", "2.2x", "2.4x", "2.5x"],
				stat2: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 0, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
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
			id: 279,
			name: "INSAS",
			type: "AR",
			rarity: 3,
			max_hp: 110,
			max_dmg: 49,
			max_acc: 52,
			max_eva: 45,
			max_rof: 71,
			skill: {
				name: "Raid Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 and accuracy by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["15%", "17%", "19%", "22%", "24%", "26%", "28%", "31%", "33%", "35%"],
				stat2: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
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
			id: 280,
			name: "MAT-49",
			type: "SMG",
			rarity: 4,
			max_hp: 185,
			max_dmg: 29,
			max_acc: 14,
			max_eva: 73,
			max_rof: 81,
			skill: {
				name: "Last Minute Preparation",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"For each enemy on the battlefield, gain a stack of evasion that lasts #1 seconds (each stack raises evasion by #2) and a stack of damage (each stack raises damage by #3). When there are only 1 or fewer enemies present, gain 3 stacks of damage instead. For each extra enemy group present, gain a stack of evasion, but lose a stack of damage, to a maximum of 6 stacks.",
				number_of_stats: 3,
				stat1: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat2: ["12%", "14%", "16%", "18%", "20%", "22%", "24%", "26%", "28%", "30%"],
				stat3: ["25%", "27%", "29%", "32%", "34%", "36%", "38%", "41%", "43%", "45%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 0, 0],
				row3: [1, 2, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["20%", "20%"]
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
			id: 281,
			name: "CAWS",
			type: "SG",
			rarity: 5,
			max_hp: 247,
			max_dmg: 30,
			max_acc: 12,
			max_eva: 13,
			max_rof: 35,
			max_armor: 23,
			skill: {
				name: "Dimensional Flames of Vengeance",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: When any HP shield is active on self, stop attacking and gain 1 stack of charge every 1.5 seconds, up to 3 stacks. When charges are maxed out or the HP shield expires, carry out an expanding special attack and clear all charge stacks. [Charge 1]: Deal #1 damage that cannot miss to enemies within an area of 3 units ahead of self. [Charge 2]: Deals an additional #2 damage that cannot miss to enemies within an area of 5 units ahead of self. [Charge 3]: Deals an additional #3 damage that cannot miss to enemies within an area of 8 units ahead of self. Active: Gains a #4 HP shield for 5 seconds.",
				number_of_stats: 4,
				stat1: ["3x", "3.3x", "3.6x", "3.8x", "4.1x", "4.4x", "4.7x", "4.9x", "5.2x", "5.5x"],
				stat2: ["3x", "3.3x", "3.6x", "3.8x", "4.1x", "4.4x", "4.7x", "4.9x", "5.2x", "5.5x"],
				stat3: ["3x", "3.3x", "3.6x", "3.8x", "4.1x", "4.4x", "4.7x", "4.9x", "5.2x", "5.5x"],
				stat4: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 0, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["18%", "12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasWait2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["120 Winter Gifts"],
			animations: {
				hasSkillAnimation: [false],
				hasWait2Animation: [true],
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
			id: 282,
			name: "DP-12",
			type: "SG",
			rarity: 5,
			max_hp: 252,
			max_dmg: 31,
			max_acc: 13,
			max_eva: 13,
			max_rof: 30,
			max_armor: 23,
			skill: {
				name: "Enigmatic Ballad",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: Each reload grants a #1 HP shield to self for #2 seconds. Additionally, reduces incoming damage by #3 to self and allies in the tiles directly behind her for #4 seconds. Active: Immediately carry out a rapid reload and obtain +3 additional ammo to current clip; Additional ammo will be consumed first and deal #5 damage twice (incompatible with slugs).",
				number_of_stats: 5,
				stat1: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat3: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat5: ["0.6x", "0.64x", "0.69x", "0.73x", "0.78x", "0.82x", "0.87x", "0.91x", "0.96x", "1x"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 0, 2],
				row3: [0, 0, 0],
				targets: "Buffs MG and RF",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["15%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Echeveria Lantern", "Sanzu Lady General"],
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
			id: 283,
			name: "Liberator",
			type: "SG",
			rarity: 4,
			max_hp: 231,
			max_dmg: 36,
			max_acc: 12,
			max_eva: 15,
			max_rof: 30,
			max_armor: 21,
			skill: {
				name: "Punitive Impact",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "During skill activation, each attack will deal 4 individual attacks at #1 damage each to the target. Lasts for #2 seconds.",
				number_of_stats: 2,
				stat1: ["0.3x", "0.32x", "0.34x", "0.37x", "0.39x", "0.41x", "0.43x", "0.46x", "0.48x", "0.5x"],
				stat2: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [1, 0, 2],
				row2: [0, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["10%", "25%"]
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
			id: 284,
			name: "Zas M76",
			type: "RF",
			rarity: 3,
			max_hp: 84,
			max_dmg: 110,
			max_acc: 78,
			max_eva: 35,
			max_rof: 37,
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Sky Breaker"],
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
			id: 285,
			name: "C-93",
			type: "HG",
			rarity: 5,
			max_hp: 63,
			max_dmg: 33,
			max_acc: 62,
			max_eva: 98,
			max_rof: 64,
			skill: {
				name: "Pigeonwing Recording",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					"Passive: Gain 3 Pigeonwings upon the start of the battle. When an allied unit has received a stat-decreasing debuff, that unit gains #1 Rate of Fire for 4 seconds, stacking up to 1 time. This boost does not trigger other passive effects, and cannot take effect on the same unit within 3 seconds. When C-93 receives 1 stat-decreasing debuff, trigger the aforementioned effect on herself and gain 1 Pigeonwing. Only up to 6 Pigeonwings can be stocked at once. Active: Increase all allied units' damage by #2 for #3 seconds, and expend all currently stocked Pigeonwings. For every Pigeonwing expended, an ally gains #4 Rate of Fire for 4 seconds, stacking up to 2 times, and this can stack with the Passive variant. This skill prioritizes units that have not been buffed by the Pigeonwings, and thereafter the units with the highest damage. Once the skill ends, C-93 replenishes 3 Pigeonwings.",
				number_of_stats: 4,
				stat1: ["3%", "4%", "4%", "5%", "5%", "6%", "6%", "7%", "7%", "8%"],
				stat2: ["8%", "9%", "10%", "11%", "12%", "14%", "15%", "16%", "17%", "18%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: ["3%", "4%", "4%", "5%", "5%", "6%", "6%", "7%", "7%", "8%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 1, 0],
				row3: [2, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["24%", "60%"]
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
			id: 286,
			name: "KAC-PDW",
			type: "SMG",
			rarity: 4,
			max_hp: 180,
			max_dmg: 33,
			max_acc: 14,
			max_eva: 71,
			max_rof: 81,
			skill: {
				name: "D-Fense",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Clear all negative status effects on self and grant self a maxed-out forcefield lasting 1 seconds. Once the forcefield disappears, raise self evade by #1, lasting #2 seconds.",
				number_of_stats: 2,
				stat1: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["15%", "30%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Adoring Sweetheart"],
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
			id: 287,
			name: "SIG-556",
			type: "AR",
			rarity: 5,
			max_hp: 121,
			max_dmg: 51,
			max_acc: 46,
			max_eva: 45,
			max_rof: 76,
			skill: {
				name: "Battlefield Trendsetter",
				initial_cooldown: "5s",
				cooldown: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
				description:
					"Raise self ROF to the maximum and increase self damage by #1. Click again to deactivate the skill. When skill is active, each attack adds 1 stacks of Overload. At 12 stacks of Overload, remove all stacks of Overload, stun self for 2 seconds and end the skill. While stunned, the echelon cannot move forward. When the skill is deactivated, each attack removes 1 stacks of Overload.",
				number_of_stats: 1,
				stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["12%", "15%"]
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
			id: 288,
			name: "CR-21",
			type: "AR",
			rarity: 4,
			max_hp: 110,
			max_dmg: 48,
			max_acc: 52,
			max_eva: 43,
			max_rof: 81,
			skill: {
				name: "Muscle Pump",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Raise self damage by #1 and change target priority to enemies with the highest damage, lasting for #2 seconds.",
				number_of_stats: 2,
				stat1: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["50%", "12%"]
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
			id: 289,
			name: "R5",
			type: "AR",
			rarity: 5,
			max_hp: 124,
			max_dmg: 55,
			max_acc: 54,
			max_eva: 43,
			max_rof: 76,
			skill: {
				name: "Damage Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["45%", "48%", "52%", "55%", "58%", "62%", "65%", "68%", "72%", "75%"],
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["12%", "15%"]
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
			id: 290,
			name: "Howa Type 89",
			type: "AR",
			rarity: 5,
			max_hp: 121,
			max_dmg: 54,
			max_acc: 48,
			max_eva: 45,
			max_rof: 79,
			skill: {
				name: "Test System",
				initial_cooldown: "3s",
				cooldown: [6, 5.8, 5.6, 5.3, 5.1, 4.9, 4.7, 4.4, 4.2, 4],
				description:
					"[Revision Mode]: Each attack increases Focus by 1 points, with a maximum of 18 points. Automatically switches to Full Marks Mode once 18 points of Focus have been accumulated. When skill is activated in Revision Mode, expend 6 points of Focus to raise self damage by #1 and ROF by #2, lasting for 4 seconds. If there are less than 6 points of Focus, all current points of Focus are expended. [Full Marks Mode]: Each attack depletes 1 points of Focus, and when 18 points of Focus have been expended, automatically switch to Revision Mode. Attacks in Full Marks Mode target the unit with the highest HP, and consecutive attacks against the same target increase damage by #3 each, to a maximum of 3 stacks. When skill is activated in this mode, increase self damage by #4, ROF by #5, and accuracy by #6, while also increasing damage taken by 30% and reducing move speed by 30%. This lasts for 6 seconds.",
				number_of_stats: 6,
				stat1: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat2: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat3: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat4: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat5: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"],
				stat6: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
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
			id: 291,
			name: "43M",
			type: "SMG",
			rarity: 3,
			max_hp: 185,
			max_dmg: 30,
			max_acc: 13,
			max_eva: 56,
			max_rof: 89,
			skill: {
				name: "Cover Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["65%", "71%", "77%", "83%", "89%", "96%", "102%", "108%", "114%", "120%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["12%", "10%"]
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
			id: 292,
			name: "RPK-16",
			type: "MG",
			rarity: 5,
			max_hp: 165,
			max_dmg: 85,
			max_acc: 37,
			max_eva: 36,
			max_rof: 129,
			skill: {
				name: "Wits of the Silver Fox",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					"Passive: Once ammo in current clip is depleted, enters AR Mode, reducing own rate of fire by #1 while increasing own accuracy by 100% and movement speed by 150%. Active: Reloads and switches back to MG Mode. Reload time is a fixed 1 second and reloading clears all stat changes from AR Mode while increasing own damage by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat2: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [1, 1, 1],
				row3: [1, 0, 0],
				targets: "Buffs SMG, AR and SG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Armor by "],
				stat2: ["12%", "18%"]
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
			id: 293,
			name: "AK-15",
			type: "AR",
			rarity: 5,
			max_hp: 110,
			max_dmg: 58,
			max_acc: 52,
			max_eva: 51,
			max_rof: 77,
			skill: {
				name: "Eye of the White Mastiff",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				passive_active_description: true,
				description:
					'Passive: Attacks have a 15% chance to cause Rage, which lasts for 3 seconds. While Rage is active, every normal attack deals an instance of #1 extra damage. Active: Activates "Eye of the White Mastiff" and monitors all enemies. Attacks on monitored enemies raise self firepower, accuracy and critical chance by #2, and being attacked by a monitored enemy raises self evade by #3. Monitoring lasts for 6 seconds. While the skill is in effect, gain 5 stacks of Strain every 2 seconds, with each group of monitored enemies adding 1 stack of Strain per 2 seconds. At #4 stacks of Strain, Eye of the White Mastiff drops in effectiveness and clears all Strain stacks, inflicting a 20% decrease in ROF and accuracy for 5 seconds. This debuff can coexist with Monitoring, but the skill cannot be reactivated while the debuff is in effect.',
				number_of_stats: 4,
				stat1: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat2: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat3: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat4: [18, 18, 18, 20, 20, 20, 22, 22, 22, 24]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["25%", "65%"]
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
			id: 294,
			name: "Webley",
			type: "HG",
			rarity: 5,
			max_hp: 86,
			max_dmg: 29,
			max_acc: 66,
			max_eva: 81,
			max_rof: 57,
			skill: {
				name: "Linked Order",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description:
					"When placed in an echelon member slot, increase the echelon leader's damage and ROF by #1 for #2 seconds, while reducing the current cooldown time of the leader's skill by #3. When placed in the echelon leader position or if the leader is absent, raise all allies' damage by #4, lasting for #5 seconds.",
				number_of_stats: 5,
				stat1: ["10%", "11%", "13%", "14%", "15%", "17%", "18%", "19%", "21%", "22%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat3: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat4: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat5: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 1, 0],
				row3: [1, 2, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["16%", "20%"]
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
			id: 295,
			name: "CF05",
			type: "SMG",
			rarity: 5,
			max_hp: 190,
			max_dmg: 26,
			max_acc: 13,
			max_eva: 73,
			max_rof: 87,
			skill: {
				name: "Butter Cream",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Reduces every instance of damage taken by #1 points for #2 seconds.",
				number_of_stats: 2,
				stat1: [5, 6, 7, 6, 8, 9, 10, 11, 12, 13],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 7.7, 5.8]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["20%", "25%"]
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
			id: 296,
			name: "SL8",
			type: "RF",
			rarity: 5,
			max_hp: 85,
			max_dmg: 120,
			max_acc: 78,
			max_eva: 39,
			max_rof: 41,
			skill: {
				name: "Shimmering Waves",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"Raise self ROF by #1, and buff self depending on the number of gun types on the buff tiles. For every different gun type on the tiles, gain a stack of #2 damage increase lasting for #3 seconds, with a maximum of 3stacks.",
				number_of_stats: 3,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: ["3%", "3.2%", "3.4%", "3.7%", "3.9%", "4.1%", "4.3%", "4.6%", "4.8%", "5%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 2, 0],
				row2: [1, 0, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["20%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Wave Crest"],
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
			id: 297,
			name: "M82",
			type: "AR",
			rarity: 4,
			max_hp: 113,
			max_dmg: 51,
			max_acc: 45,
			max_eva: 46,
			max_rof: 75,
			skill: {
				name: "Charge Focus",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 and rate of fire by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["45%", "48%", "52%", "55%", "58%", "62%", "65%", "68%", "72%", "75%"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["50%", "12%"]
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
			id: 298,
			name: "Vepr",
			type: "AR",
			rarity: 3,
			max_hp: 110,
			max_dmg: 48,
			max_acc: 49,
			max_eva: 47,
			max_rof: 71,
			skill: {
				name: "Blue Steel Timpani",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "When skill is activated, all teammates on buff tiles have their damage, ROF and accuracy raised by #1, lasting #2 seconds.",
				number_of_stats: 2,
				stat1: ["12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "22%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["16%"]
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
			id: 299,
			name: "HSM10",
			type: "SG",
			rarity: 3,
			max_hp: 247,
			max_dmg: 34,
			max_acc: 13,
			max_eva: 12,
			max_rof: 27,
			max_armor: 21,
			skill: {
				name: "Survival Instinct",
				initial_cooldown: "10s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases evasion by #1 and armor rating by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
				stat2: ["20%", "23%", "26%", "28%", "31%", "34%", "36%", "39%", "42%", "45%"],
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 0, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
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
			id: 300,
			name: "CAR",
			type: "MG",
			rarity: 3,
			max_hp: 165,
			max_dmg: 93,
			max_acc: 32,
			max_eva: 29,
			max_rof: 112,
			skill: {
				name: "Damage Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["22%", "27%", "32%", "36%", "41%", "46%", "51%", "55%", "60%", "65%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["10%", "12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: null
	}
];
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// END OF #201-#300 JSON DATA ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for #201-#300 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for #201-#300 T-Doll Index JSON.");

export default tdolls;
