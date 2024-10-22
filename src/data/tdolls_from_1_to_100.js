/*
    This array of T-Dolls will contain information about index #1 to #100 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// START OF #1-#100 JSON DATA ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	{
		normal: {
			id: 1,
			name: "SAA",
			type: "HG",
			rarity: 4,
			max_hp: 80,
			max_dmg: 36,
			max_acc: 49,
			max_eva: 79,
			max_rof: 47,
			skill: {
				name: "Fire Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 1],
				row3: [0, 1, 0],
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
		mod: {
			id: 1,
			name: "SAA Mod",
			type: "HG",
			rarity: 5,
			max_hp: 83,
			max_dmg: 37,
			max_acc: 51,
			max_eva: 80,
			max_rof: 50,
			skill: {
				name: "Fire Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			skill2: {
				name: "Duel Survivor",
				initial_cooldown: "Passive",
				description: "Increase all allies' rate of fire and accuracy by #1 for every #2 seconds that SAA is alive in battle. Max 3 stacks.",
				number_of_stats: 2,
				stat1: ["3%", "3%", "3%", "4%", "4%", "4%", "5%", "5%", "5%", "5%"],
				stat2: [6, 5.8, 5.6, 5.3, 5.1, 4.9, 4.7, 4.4, 4.2, 4]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 1],
				row3: [0, 1, 0],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["Wish Upon A Star", "Queen of Miracle"],
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
			id: 2,
			name: "M1911",
			type: "HG",
			rarity: 2,
			max_hp: 73,
			max_dmg: 27,
			max_acc: 50,
			max_eva: 74,
			max_rof: 57,
			skill: {
				name: "Smoke Grenade",
				initial_cooldown: "1s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "22%", "24%", "25%", "27%", "29%", "31%", "32%", "34%", "36%"],
				stat2: ["28%", "30%", "32%", "34%", "36%", "37%", "39%", "41%", "43%", "45%"],
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 1],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["20%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 2,
			name: "M1911 Mod",
			type: "HG",
			rarity: 4,
			max_hp: 75,
			max_dmg: 29,
			max_acc: 52,
			max_eva: 78,
			max_rof: 58,
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
			skill2: {
				name: "Desperate Sharpshooter",
				initial_cooldown: "Passive",
				description: "After launching a smoke grenade, the next 7 attacks will strike targets starting from the furthest to the closest. Every hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["150%", "156%", "161%", "167%", "172%", "178%", "183%", "189%", "194%", "200%"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 1],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["24%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Night Dancer"],
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
			id: 3,
			name: "M9",
			type: "HG",
			rarity: 3,
			max_hp: 76,
			max_dmg: 29,
			max_acc: 56,
			max_eva: 66,
			max_rof: 61,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [1.6, 1.8, 2, 2.1, 2.3, 2.5, 2.7, 2.8, 3, 3.2]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Damage by "],
				stat2: ["20%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 4,
			name: "Python",
			type: "HG",
			rarity: 5,
			max_hp: 70,
			max_dmg: 40,
			max_acc: 81,
			max_eva: 82,
			max_rof: 49,
			skill: {
				name: "Embrace of the Fearless",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"[Passive]: Whenever Python receives damage/rate of fire/evasion/accuracy/crit rate (including Fairies) skill buffs, increase the corresponding stats of allies on her tiles by #1 for 3 seconds. [Active]: The next six attacks will have a #2 chance of increasing self damage by #3 for #4 seconds. Max 6 stacks.",
				number_of_stats: 4,
				stat1: [
					"3%/3%/15%/15%/6%",
					"3%/3%/17%/17%/7%",
					"4%/4%/18%/18%/7%",
					"4%/4%/20%/20%/7%",
					"5%/5%/22%/22%/8%",
					"5%/5%/23%/23%/9%",
					"5%/5%/25%/25%/9%",
					"6%/6%/27%/27%/10%",
					"6%/6%/28%/28%/11%",
					"6%/6%/30%/30%/12%"
				],
				stat2: ["40%", "47%", "53%", "60%", "67%", "73%", "80%", "87%", "93%", "100%"],
				stat3: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [1, 2, 1],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Crit Rate by "],
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
			id: 5,
			name: "Nagant Revolver",
			type: "HG",
			rarity: 2,
			max_hp: 70,
			max_dmg: 32,
			max_acc: 46,
			max_eva: 92,
			max_rof: 44,
			skill: {
				name: "Firepower Supression N",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "During nighttime, decrease all enemies' damage by #1 (#2 during daytime) for #3 seconds (#4 seconds during daytime).",
				number_of_stats: 4,
				stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "32%", "33%", "35%"],
				stat2: ["12%", "13%", "14%", "15%", "16%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Crit Rate by "],
				stat2: ["32%", "16%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 5,
			name: "Nagant Revolver Mod",
			type: "HG",
			rarity: 4,
			max_hp: 72,
			max_dmg: 35,
			max_acc: 48,
			max_eva: 100,
			max_rof: 45,
			skill: {
				name: "Firepower Supression N",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "During nighttime, decrease all enemies' damage by #1 (#2 during daytime) for #3 seconds (#4 seconds during daytime).",
				number_of_stats: 4,
				stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			skill2: {
				name: "Seven Note Cadenza",
				initial_cooldown: "Passive",
				description: "Reloads after every 7 attacks. The first attack after reloading will increase all allies' damage and accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Crit Rate by "],
				stat2: ["36%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Starry Reins"],
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
			id: 6,
			name: "Tokarev",
			type: "HG",
			rarity: 3,
			max_hp: 86,
			max_dmg: 31,
			max_acc: 47,
			max_eva: 66,
			max_rof: 52,
			skill: {
				name: "Cover Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["A Couple's Journey", "Griffon Dancer"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, true]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 7,
			name: "Stechkin",
			type: "HG",
			rarity: 4,
			max_hp: 83,
			max_dmg: 28,
			max_acc: 44,
			max_eva: 66,
			max_rof: 65,
			skill: {
				name: "Assault Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"[Passive]: When equipped with \"Stechkin Exclusive Stock\", increases allies' damage by 4% for the same skill duration. [Active]: Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "22%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["12%", "24%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 7,
			name: "Stechkin Mod",
			type: "HG",
			rarity: 5,
			max_hp: 85,
			max_dmg: 32,
			max_acc: 51,
			max_eva: 69,
			max_rof: 66,
			skill: {
				name: "Assault Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				passive_active_description: true,
				description:
					"[Passive]: When equipped with \"Stechkin Exclusive Stock\", increases allies' damage by 4% for the same skill duration. [Active]: Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			skill2: {
				name: "Percussion",
				initial_cooldown: "Passive",
				description:
					'When "Assault Command" is active, increases own damage by #1, and critical rate by #2 for #3 seconds. For the duration of "Percussion", prioritise targeting enemies with the lowest health and reduces the evasion of enemies with less than 30% health by #4 for #5 seconds.',
				number_of_stats: 5,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: ["20%", "23%", "27%", "30%", "33%", "37%", "40%", "43%", "47%", "50%"],
				stat5: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["16%", "24%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Miss Camellia's Special Service"],
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
			id: 8,
			name: "Makarov",
			type: "HG",
			rarity: 3,
			max_hp: 63,
			max_dmg: 26,
			max_acc: 61,
			max_eva: 96,
			max_rof: 61,
			skill: {
				name: "Precision Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decreases the enemy squads' accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["24%", "25%", "27%", "28%", "29%", "31%", "32%", "33%", "35%", "36%"],
				stat2: [4, 4, 4, 5, 5, 5, 5, 6, 6, 6]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["12%", "24%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Pumpkin Mishka", "A Certain Unscientific Sunflower"],
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
			id: 9,
			name: "P38",
			type: "HG",
			rarity: 2,
			max_hp: 66,
			max_dmg: 28,
			max_acc: 49,
			max_eva: 81,
			max_rof: 57,
			skill: {
				name: "Flare",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases all allies' accuracy by #1 for #2 seconds (night battles only).",
				number_of_stats: 2,
				stat1: ["50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "86%", "90%"],
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["14%", "56%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["High Sorceress Apprentice"],
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
			id: 10,
			name: "PPK",
			type: "HG",
			rarity: 2,
			max_hp: 57,
			max_dmg: 25,
			max_acc: 59,
			max_eva: 100,
			max_rof: 63,
			skill: {
				name: "Annihilation Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increases all allies' damage by #1 and critical rate by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%", "10%"],
				stat2: ["25%", "26%", "27%", "28%", "29%", "31%", "32%", "33%", "34%", "35%"],
				stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 1],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Critical Rate by "],
				stat2: ["32%", "16%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Mach Tempest"],
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
			id: 11,
			name: "P08",
			type: "HG",
			rarity: 3,
			max_hp: 70,
			max_dmg: 31,
			max_acc: 46,
			max_eva: 80,
			max_rof: 55,
			skill: {
				name: "Cover Command N",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "During nighttime, increases all allies' evasion by #1 (#2 during daytime) for #3 seconds (#4 seconds during day).",
				number_of_stats: 4,
				stat1: ["50%", "54%", "58%", "62%", "66%", "69%", "73%", "77%", "81%", "85%"],
				stat2: ["28%", "28%", "30%", "30%", "31%", "32%", "33%", "33%", "34%", "35%"],
				stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 1],
				row3: [0, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["70%", "14%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 12,
			name: "C96",
			type: "HG",
			rarity: 3,
			max_hp: 83,
			max_dmg: 29,
			max_acc: 41,
			max_eva: 61,
			max_rof: 62,
			skill: {
				name: "Flare",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases all allies' accuracy by #1 for #2 seconds (night battles only).",
				number_of_stats: 2,
				stat1: ["55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"],
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 1],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["64%", "30%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 12,
			name: "C96 Mod",
			type: "HG",
			rarity: 4,
			max_hp: 85,
			max_dmg: 32,
			max_acc: 52,
			max_eva: 71,
			max_rof: 64,
			skill: {
				name: "Flare",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases all allies' accuracy by #1 for #2 seconds (night battles only).",
				number_of_stats: 2,
				stat1: ["60%", "67%", "73%", "80%", "87%", "93%", "100%", "107%", "113%", "120%"],
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15]
			},
			skill2: {
				name: "Night Sky Pursuer",
				initial_cooldown: "Passive",
				description: 'When "Flare" has been launched, grants allies #1 ammo to their current clip, additionally increases allies\' critical damage by #2 for #3 seconds.',
				number_of_stats: 3,
				stat1: ["+1", "+1", "+1", "+1", "+1", "+2", "+2", "+2", "+2", "+2"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 1],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["80%", "40%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 13,
			name: "Type 92",
			type: "HG",
			rarity: 3,
			max_hp: 63,
			max_dmg: 31,
			max_acc: 46,
			max_eva: 80,
			max_rof: 61,
			skill: {
				name: "Charge Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increases all allies' damage and rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["6%", "6%", "7%", "7%", "8%", "8%", "8%", "9%", "9%", "10%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [1, 2, 1],
				row3: [1, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["50%", "40%"]
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
			id: 14,
			name: "Astra Revolver",
			type: "HG",
			rarity: 3,
			max_hp: 80,
			max_dmg: 33,
			max_acc: 45,
			max_eva: 68,
			max_rof: 52,
			skill: {
				name: "Assault Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 0, 1],
				row2: [0, 2, 0],
				row3: [1, 0, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["20%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Astra's Swimming Pool Float"],
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
			id: 15,
			name: "Glock 19",
			type: "HG",
			rarity: 3,
			max_hp: 63,
			max_dmg: 29,
			max_acc: 58,
			max_eva: 87,
			max_rof: 61,
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
				row1: [1, 0, 1],
				row2: [0, 2, 1],
				row3: [1, 0, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["64%", "30%"]
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
			id: 16,
			name: "Thompson",
			type: "SMG",
			rarity: 5,
			max_hp: 238,
			max_dmg: 31,
			max_acc: 12,
			max_eva: 56,
			max_rof: 82,
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
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["12%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Demon Huntress"],
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
			id: 17,
			name: "M3",
			type: "SMG",
			rarity: 2,
			max_hp: 185,
			max_dmg: 30,
			max_acc: 13,
			max_eva: 67,
			max_rof: 68,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["40%", "30%"]
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
			id: 18,
			name: "MAC-10",
			type: "SMG",
			rarity: 3,
			max_hp: 176,
			max_dmg: 28,
			max_acc: 11,
			max_eva: 68,
			max_rof: 91,
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
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 19,
			name: "FMG-9",
			type: "SMG",
			rarity: 3,
			max_hp: 141,
			max_dmg: 26,
			max_acc: 13,
			max_eva: 90,
			max_rof: 92,
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
				stat2: ["10%", "12%"]
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
			id: 20,
			name: "Vector",
			type: "SMG",
			rarity: 5,
			max_hp: 185,
			max_dmg: 30,
			max_acc: 11,
			max_eva: 71,
			max_rof: 101,
			skill: {
				name: "Incendiary Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["3.5x", "3.9x", "4.3x", "4.7x", "5.1x", "5.4x", "5.8x", "6.2x", "6.6x", "7x"],
				stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
				stat2: ["25%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Kitty Paws", "Love is Blind", "Hellfire"],
			animations: {
				hasSkillAnimation: [true, true, true],
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
			id: 21,
			name: "PPSh-41",
			type: "SMG",
			rarity: 2,
			max_hp: 194,
			max_dmg: 26,
			max_acc: 11,
			max_eva: 56,
			max_rof: 93,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["10%", "5%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Moment of Vows"],
			animations: {
				hasSkillAnimation: [true],
				hasVictoryLoopAnimation: [false]
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
			id: 22,
			name: "PPS-43",
			type: "SMG",
			rarity: 3,
			max_hp: 176,
			max_dmg: 33,
			max_acc: 13,
			max_eva: 65,
			max_rof: 74,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["2x", "2.4x", "2.9x", "3.3x", "3.8x", "4.2x", "4.7x", "5.1x", "5.6x", "6x"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["12%"]
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
			id: 23,
			name: "PP-90",
			type: "SMG",
			rarity: 4,
			max_hp: 159,
			max_dmg: 25,
			max_acc: 13,
			max_eva: 86,
			max_rof: 96,
			skill: {
				name: "Cover Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "27%", "29%", "32%", "34%", "36%", "38%", "41%", "43%", "45%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["8%", "20%"]
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
			id: 24,
			name: "PP-2000",
			type: "SMG",
			rarity: 2,
			max_hp: 159,
			max_dmg: 30,
			max_acc: 11,
			max_eva: 74,
			max_rof: 80,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["10%", "25%"]
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
			id: 25,
			name: "MP-40",
			type: "SMG",
			rarity: 2,
			max_hp: 185,
			max_dmg: 29,
			max_acc: 13,
			max_eva: 58,
			max_rof: 76,
			skill: {
				name: "Incendiary Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"],
				stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["25%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Thumbelina"],
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
			id: 26,
			name: "MP5",
			type: "SMG",
			rarity: 4,
			max_hp: 168,
			max_dmg: 30,
			max_acc: 13,
			max_eva: 68,
			max_rof: 89,
			skill: {
				name: "Force Shield",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Grants self a barrier with a Defense value of 9999 (Max value of 9999), reducing incoming damage by a percentage (100% if at max Defense value) for #1 seconds.",
				number_of_stats: 1,
				stat1: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Critical Rate by "],
				stat2: ["40%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 26,
			name: "MP5 Mod",
			type: "SMG",
			rarity: 5,
			max_hp: 181,
			max_dmg: 32,
			max_acc: 14,
			max_eva: 71,
			max_rof: 90,
			skill: {
				name: "Force Shield",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Grants self a barrier with a Defense value of 9999 (Max value of 9999), reducing incoming damage by a percentage (100% if at max Defense value) for #1 seconds.",
				number_of_stats: 1,
				stat1: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
			},
			skill2: {
				name: "Immaterial Defense",
				initial_cooldown: "Passive",
				description: 'When "Force Shield" expires, increases evasion by #1 for #2 seconds for every enemy group present, up to 3 layers.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR and RF",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Critical Rate by "],
				stat2: ["45%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 4,
			skin_names: ["Nocturnal Familiar", "Sleepless Begonias", "A Small Step", "Vietnamese Balm"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 27,
			name: "Skorpion",
			type: "SMG",
			rarity: 3,
			max_hp: 159,
			max_dmg: 24,
			max_acc: 13,
			max_eva: 83,
			max_rof: 95,
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
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["15%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Crimson Starlet"],
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
			id: 28,
			name: "MP7",
			type: "SMG",
			rarity: 5,
			max_hp: 198,
			max_dmg: 30,
			max_acc: 13,
			max_eva: 69,
			max_rof: 91,
			skill: {
				name: "Moon Dancer",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Decreases accuracy and rate of fire by #1 but increases evasion by #2 and movement speed by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: ["40%", "38%", "36%", "33%", "31%", "29%", "27%", "24%", "22%", "20%"],
				stat2: ["100%", "109%", "118%", "127%", "136%", "144%", "153%", "162%", "171%", "180%"],
				stat3: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["25%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Lollipop Ammo"],
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
			id: 29,
			name: "Sten MkII",
			type: "SMG",
			rarity: 3,
			max_hp: 185,
			max_dmg: 26,
			max_acc: 15,
			max_eva: 75,
			max_rof: 78,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["2x", "2.4x", "2.9x", "3.3x", "3.8x", "4.2x", "4.7x", "5.1x", "5.6x", "6x"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["10%", "30%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 29,
			name: "Sten MkII Mod",
			type: "SMG",
			rarity: 4,
			max_hp: 195,
			max_dmg: 29,
			max_acc: 17,
			max_eva: 79,
			max_rof: 86,
			skill: {
				name: "Hand Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a grenade that deals #1 damage to enemies within a 2.5 unit radius.",
				number_of_stats: 1,
				stat1: ["2.2x", "2.7x", "3.2x", "3.6x", "4.1x", "4.6x", "5.1x", "5.5x", "6x", "6.5x"]
			},
			skill2: {
				name: "Valiant Shield",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "6 seconds after the battle begins, deploys a damage reducing shield in front of her that reduces all incoming damage by #1, lasting for #2 seconds.",
				number_of_stats: 2,
				stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "31%", "33%", "35%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["30%", "40%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Reciprocated Love"],
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
			id: 31,
			name: "Beretta Model 38",
			type: "SMG",
			rarity: 2,
			max_hp: 203,
			max_dmg: 32,
			max_acc: 12,
			max_eva: 52,
			max_rof: 75,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [1.8, 2, 2.1, 2.3, 2.4, 2.6, 2.7, 2.9, 3, 3.2]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["5%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 31,
			name: "Beretta Model 38 Mod",
			type: "SMG",
			rarity: 4,
			max_hp: 217,
			max_dmg: 33,
			max_acc: 13,
			max_eva: 61,
			max_rof: 79,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4]
			},
			skill2: {
				name: "Scarlet Flame Pursuit",
				initial_cooldown: "Passive",
				description:
					"When a flashbang has been tossed, throw an additional incendiary grenade that deals #1 damage to enemies within a radius of 2.5 units and ignites them, dealing #2 continuous damage to them every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["1.4x", "1.56x", "1.71x", "1.87x", "2.02x", "2.18x", "2.33x", "2.49x", "2.64x", "2.8x"],
				stat2: ["0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x", "0.53x", "0.57x", "0.6x"],
				stat3: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR and RF",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["8%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 32,
			name: "Micro Uzi",
			type: "SMG",
			rarity: 3,
			max_hp: 159,
			max_dmg: 24,
			max_acc: 11,
			max_eva: 79,
			max_rof: 104,
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
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["18%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 32,
			name: "Micro Uzi Mod",
			type: "SMG",
			rarity: 4,
			max_hp: 177,
			max_dmg: 26,
			max_acc: 13,
			max_eva: 83,
			max_rof: 104,
			skill: {
				name: "Incendiary Grenade",
				initial_cooldown: "3s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws an incendiary grenade that deals #1 damage within a radius of 1.5 units and ignites them, dealing #2 continuous damage every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["3.2x", "3.6x", "3.9x", "4.3x", "4.7x", "5x", "5.4x", "5.8x", "6.1x", "6.5x"],
				stat2: ["0.5x", "0.6x", "0.6x", "0.7x", "0.7x", "0.8x", "0.8x", "0.9x", "0.9x", "1x"],
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5]
			},
			skill2: {
				name: "Burning Chain",
				initial_cooldown: "Passive",
				description:
					"Incendiary grenade deals an additional #1 damage every 1.5 seconds to burned enemies and will spread around the burned enemy, causing a new burning area with a radius of 1 unit. This lasts until the effect of the incendiary grenade ends. Burn damage will take effect against enemies in an extremely small area.",
				number_of_stats: 1,
				stat1: ["0.4x", "0.44x", "0.49x", "0.53x", "0.58x", "0.62x", "0.67x", "0.71x", "0.76x", "0.8x"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["18%", "15%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Woken-up Idiot"],
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
			id: 33,
			name: "m45",
			type: "SMG",
			rarity: 2,
			max_hp: 185,
			max_dmg: 30,
			max_acc: 12,
			max_eva: 62,
			max_rof: 74,
			skill: {
				name: "Smoke Grenade",
				initial_cooldown: "1s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Throws a smoke grenade which decreases the enemy's rate of fire by #1 and movement speed by #2 within a radius of 2.5 units for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "22%", "24%", "25%", "27%", "29%", "31%", "32%", "34%", "36%"],
				stat2: ["28%", "30%", "32%", "34%", "36%", "37%", "39%", "41%", "43%", "45%"],
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["10%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Candy Express"],
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
			id: 34,
			name: "M1 Garand",
			type: "RF",
			rarity: 3,
			max_hp: 88,
			max_dmg: 120,
			max_acc: 62,
			max_eva: 28,
			max_rof: 37,
			skill: {
				name: "Locked Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the current enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Beach Princess"],
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
			id: 35,
			name: "M1A1",
			type: "RF",
			rarity: 3,
			max_hp: 84,
			max_dmg: 95,
			max_acc: 77,
			max_eva: 42,
			max_rof: 38,
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Red Plums and White Snow"],
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
			id: 36,
			name: "Springfield",
			type: "RF",
			rarity: 4,
			max_hp: 84,
			max_dmg: 128,
			max_acc: 72,
			max_eva: 40,
			max_rof: 32,
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
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
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
			number_of_skins: 4,
			skin_names: ["Classic Witch", "O Holy Night", "Queen in Radiance", "Stirring Mermaid"],
			animations: {
				hasSkillAnimation: [false, true, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 37,
			name: "M14",
			type: "RF",
			rarity: 3,
			max_hp: 84,
			max_dmg: 108,
			max_acc: 71,
			max_eva: 27,
			max_rof: 43,
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
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 37,
			name: "M14 Mod",
			type: "RF",
			rarity: 4,
			max_hp: 86,
			max_dmg: 111,
			max_acc: 74,
			max_eva: 28,
			max_rof: 44,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "43%", "46%", "49%", "52%", "55%", "57%", "60%", "63%", "65%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			skill2: {
				name: "Clear Fighting Spirit",
				initial_cooldown: "Passive",
				description: 'When "Damage Focus" is active, increases critical damage by #1 for #2 seconds.',
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Xmas Parade"],
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
			id: 38,
			name: "M21",
			type: "RF",
			rarity: 3,
			max_hp: 93,
			max_dmg: 118,
			max_acc: 74,
			max_eva: 27,
			max_rof: 35,
			skill: {
				name: "Locked Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to a specific enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"]
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Xmas At Home"],
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
			id: 39,
			name: "Mosin-Nagant",
			type: "RF",
			rarity: 4,
			max_hp: 88,
			max_dmg: 131,
			max_acc: 85,
			max_eva: 38,
			max_rof: 30,
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
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
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
		mod: {
			id: 39,
			name: "Mosin-Nagant Mod",
			type: "RF",
			rarity: 5,
			max_hp: 91,
			max_dmg: 136,
			max_acc: 89,
			max_eva: 40,
			max_rof: 31,
			skill: {
				name: "Designated Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the furthest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2, 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3],
				stat2: ["3.2x", "3.6x", "3.9x", "4.3x", "4.7x", "5x", "5.4x", "5.8x", "6.1x", "6.5x"]
			},
			skill2: {
				name: "Pure White Reaper",
				initial_cooldown: "Passive",
				description:
					'Every enemy unit that she kills, increases her damage by #1 for 3 seconds (kills refresh this effect). Every enemy unit killed by her "Designated Shot" skill increases her rate of fire by #2 for 5 seconds.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["Moonlit Ocean", "White Steel Edge"],
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
			id: 40,
			name: "SVT-38",
			type: "RF",
			rarity: 2,
			max_hp: 84,
			max_dmg: 110,
			max_acc: 59,
			max_eva: 34,
			max_rof: 34,
			skill: {
				name: "Aimed Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1 second, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.6, 1.7, 1.8, 1.9, 2, 2, 2.1, 2.2, 2.3, 2.4],
				stat2: ["2.5x", "2.3x", "2.6x", "2.8x", "3.1x", "3.4x", "3.7x", "3.9x", "4.2x", "5x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["10%"]
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
			id: 41,
			name: "SKS",
			type: "RF",
			rarity: 2,
			max_hp: 93,
			max_dmg: 100,
			max_acc: 59,
			max_eva: 34,
			max_rof: 34,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["10%"]
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
			id: 42,
			name: "PTRD",
			type: "RF",
			rarity: 4,
			max_hp: 93,
			max_dmg: 159,
			max_acc: 75,
			max_eva: 29,
			max_rof: 28,
			skill: {
				name: "Interdiction Shot",
				initial_cooldown: "8s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9, 3, 3.1],
				stat2: ["3.2x", "3.6x", "4x", "4.5x", "4.9x", "5.3x", "5.7x", "6.2x", "6.6x", "7x"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
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
			skin_names: ["Romantic Mission"],
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
			id: 43,
			name: "SVD",
			type: "RF",
			rarity: 4,
			max_hp: 80,
			max_dmg: 130,
			max_acc: 80,
			max_eva: 33,
			max_rof: 37,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "43%", "46%", "48%", "51%", "54%", "57%", "59%", "62%", "65%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Winter Fairy"],
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
			id: 44,
			name: "SV-98",
			type: "RF",
			rarity: 3,
			max_hp: 84,
			max_dmg: 122,
			max_acc: 74,
			max_eva: 28,
			max_rof: 37,
			skill: {
				name: "Interdiction Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["12%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 44,
			name: "SV-98 Mod",
			type: "RF",
			rarity: 4,
			max_hp: 86,
			max_dmg: 128,
			max_acc: 81,
			max_eva: 29,
			max_rof: 37,
			skill: {
				name: "True Interdiction Shot",
				initial_cooldown: "5s",
				cooldown: [15, 14.6, 14.1, 13.7, 13.2, 12.8, 12.3, 11.9, 11.4, 11],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 5 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
				stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"]
			},
			skill2: {
				name: "Shadowy Savior",
				initial_cooldown: "Passive",
				passive_active_description: true,
				description:
					'[Passive]: Enter camouflage mode after staying still for 3 seconds, and increases self accuracy and rate of fire by #1. [Active]: Using "Interdiction Shot" when in camouflage mode increases skill damage by #2 and removes camouflage.',
				number_of_stats: 2,
				stat1: ["5%", "5%", "6%", "6%", "6%", "7%", "7%", "7%", "8%", "8%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "14%", "15%", "16%", "17%", "18%"]
			},
			tile_set: {
				row1: [0, 0, 0],
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
		skins: {
			number_of_skins: 2,
			skin_names: ["Waitress", "Piercing the Heart"],
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
			id: 46,
			name: "Kar98k",
			type: "RF",
			rarity: 5,
			max_hp: 84,
			max_dmg: 135,
			max_acc: 78,
			max_eva: 41,
			max_rof: 34,
			skill: {
				name: "Chain Shot",
				initial_cooldown: "4s",
				cooldown: [16, 15.6, 15.1, 14.7, 14.2, 13.8, 13.3, 12.9, 12.4, 12],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 4 stacks. When skill is used, shoot the current target twice, dealing #1 ~ #2 damage per shot based on the current number of charge stacks, taking 0.5 seconds to aim before each shot. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [0.7, 0.9, 1.2, 1.4, 1.6, 1.9, 2.1, 2.3, 2.6, 2.8],
				stat2: ["1.5x", "1.7x", "1.9x", "2.2x", "2.4x", "2.6x", "2.8x", "3.1x", "3.3x", "3.5x"]
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Roses in Hand"],
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
			id: 47,
			name: "G43",
			type: "RF",
			rarity: 2,
			max_hp: 80,
			max_dmg: 111,
			max_acc: 58,
			max_eva: 28,
			max_rof: 40,
			skill: {
				name: "Assault Focus N",
				initial_cooldown: "8s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "During nighttime, increases rate of fire by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["45%", "49%", "54%", "58%", "63%", "67%", "72%", "76%", "81%", "85%"],
				stat2: ["15%", "16%", "18%", "19%", "21%", "22%", "24%", "25%", "27%", "28%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["10%"]
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
			id: 48,
			name: "WA2000",
			type: "RF",
			rarity: 5,
			max_hp: 88,
			max_dmg: 130,
			max_acc: 82,
			max_eva: 30,
			max_rof: 39,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["45%", "48%", "52%", "55%", "58%", "62%", "65%", "68%", "72%", "75%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
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
			number_of_skins: 4,
			skin_names: ["Haunted Castle", "Date in the Snow", "Ballroom Interlude", "Op. Manta Ray"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, true],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 49,
			name: "Type 56",
			type: "RF",
			rarity: 3,
			max_hp: 93,
			max_dmg: 103,
			max_acc: 65,
			max_eva: 36,
			max_rof: 36,
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
			id: 50,
			name: "Lee-Enfield",
			type: "RF",
			rarity: 5,
			max_hp: 80,
			max_dmg: 135,
			max_acc: 78,
			max_eva: 40,
			max_rof: 36,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["45%", "48%", "52%", "55%", "58%", "62%", "65%", "68%", "72%", "75%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
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
			number_of_skins: 3,
			skin_names: ["Huntress' Frock", "Lifelong Protector", "Onion Shooter"],
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
			id: 51,
			name: "FN-49",
			type: "RF",
			rarity: 2,
			max_hp: 93,
			max_dmg: 111,
			max_acc: 61,
			max_eva: 32,
			max_rof: 32,
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
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 51,
			name: "FN-49 Mod",
			type: "RF",
			rarity: 4,
			max_hp: 96,
			max_dmg: 120,
			max_acc: 64,
			max_eva: 33,
			max_rof: 34,
			skill: {
				name: "Damage Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "43%", "46%", "49%", "52%", "55%", "57%", "60%", "63%", "65%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			skill2: {
				name: "Cold Fighting Spirit",
				initial_cooldown: "Passive",
				description: 'Whenever "Damage Focus" is active, increases rate of fire by #1% for #2 seconds.',
				number_of_stats: 2,
				stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Umbrella Daydream"],
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
			id: 52,
			name: "BM59",
			type: "RF",
			rarity: 2,
			max_hp: 97,
			max_dmg: 104,
			max_acc: 52,
			max_eva: 25,
			max_rof: 38,
			skill: {
				name: "Assault Focus",
				initial_cooldown: "5s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["32%", "35%", "37%", "40%", "42%", "45%", "47%", "50%", "52%", "55%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["10%"]
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
			id: 53,
			name: "NTW-20",
			type: "RF",
			rarity: 5,
			max_hp: 93,
			max_dmg: 165,
			max_acc: 75,
			max_eva: 29,
			max_rof: 30,
			skill: {
				name: "Interdiction Shot",
				initial_cooldown: "8s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, then deal #1 ~ #2 damage to the nearest enemy based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2.2, 2.3, 2.5, 2.6, 2.7, 2.9, 3, 3.1, 3.3, 3.4],
				stat2: ["3.5x", "4x", "4.5x", "5x", "5.5x", "6x", "6.5x", "7x", "7.5x", "8x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["18%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 53,
			name: "NTW-20 Mod",
			type: "RF",
			rarity: 6,
			max_hp: 95,
			max_dmg: 170,
			max_acc: 82,
			max_eva: 31,
			max_rof: 32,
			skill: {
				name: "Hunter's Mania",
				initial_cooldown: "7s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, prioritising the enemy with the highest health that can be killed in 1 shot (affected by link protection). If there are no enemies that can be instantly killed, prioritise the enemy with the highest health. After aiming, deal #1 ~ #2 damage that ignores HP shields based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2.7, 3, 3.3, 3.5, 3.8, 4, 4.3, 4.5, 4.8, 5],
				stat2: ["5x", "5.6x", "6.2x", "6.7x", "7.3x", "7.8x", "8.4x", "8.9x", "9.5x", "10x"]
			},
			skill2: {
				name: "Chain Reaction",
				initial_cooldown: "Passive",
				passive_passive_description: true,
				description:
					'Passive 1: When "Hunter\'s Mania" kills an enemy, activate skill again and gain 3 charge stacks. Can activate up to 3 times. The additional skill uses incurs no aiming time and do not gain bonus DMG from charge stacks, dealing #1 damage that can miss. Priorities enemy with the lowest HP that can be killed in one shot. Passive 2: Increases DMG of normal attacks and skill by 10% when attacking enemies with more than 50% HP.',
				number_of_stats: 1,
				stat1: ["2.5x", "2.7x", "2.9x", "3x", "3.2x", "3.4x", "3.5x", "3.7x", "3.9x", "4x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 4,
			skin_names: ["Reindeer", "Op. Blazing Sun", "Aristocraft Experience Service", "Black Iron Heart"],
			animations: {
				hasSkillAnimation: [false, true, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, true, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 54,
			name: "M16A1",
			type: "AR",
			rarity: 4,
			max_hp: 121,
			max_dmg: 47,
			max_acc: 46,
			max_eva: 44,
			max_rof: 75,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Damage by "],
				stat2: ["12%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["One-Eyed Rabbit Knight", "One Who Shows the Way"],
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
			id: 55,
			name: "M4A1",
			type: "AR",
			rarity: 4,
			max_hp: 110,
			max_dmg: 46,
			max_acc: 48,
			max_eva: 48,
			max_rof: 79,
			skill: {
				name: "Damage Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["18%", "30%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 55,
			name: "M4A1 Mod",
			type: "AR",
			rarity: 5,
			max_hp: 113,
			max_dmg: 50,
			max_acc: 50,
			max_eva: 50,
			max_rof: 80,
			skill: {
				name: "Damage Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["45%", "48%", "52%", "55%", "58%", "62%", "65%", "68%", "72%", "75%"],
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			skill2: {
				name: "Seal of the Avenger",
				initial_cooldown: "Passive",
				description:
					'When "Damage Focus T" is active, apply Seal of the Avenger to the current target. In addition, once 3 or less allies are on the field, reduces self rate of fire by 70% and regular attacks do #1 damage, with an additional 100% splash damage to all targets within 2.5 units. This splash damage also applies Seal of the Avenger. ("Damage Focus T" is still in effect during this time).',
				number_of_stats: 1,
				stat1: ["300%", "333%", "367%", "400%", "433%", "467%", "500%", "533%", "567%", "600%"]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Rate by "],
				stat2: ["20%", "32%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 2,
			skin_names: ["A Girl's Hot Air Balloon Adventure", "Determiner of Time"],
			animations: {
				hasSkillAnimation: [true, true],
				hasAttack2Animation: [true, true],
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
			id: 56,
			name: "M4 SOPMOD II",
			type: "AR",
			rarity: 4,
			max_hp: 110,
			max_dmg: 50,
			max_acc: 49,
			max_eva: 44,
			max_rof: 78,
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
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Accuracy by "],
				stat2: ["12%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false
			}
		},
		mod: {
			id: 56,
			name: "M4 SOPMOD II Mod",
			type: "AR",
			rarity: 5,
			max_hp: 113,
			max_dmg: 52,
			max_acc: 51,
			max_eva: 46,
			max_rof: 79,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"]
			},
			skill2: {
				name: "Hysterical Circus",
				initial_cooldown: "Passive",
				description:
					"Her Anti-Personnel Grenade splits into 3 smaller grenades on explosion (prioritizes enemies marked with the Seal of the Avenger). Each smaller grenade deals #1 damage to enemies within 1 yard and does an extra #2 damage to enemies marked with the Seal of the Avenger.",
				number_of_stats: 2,
				stat1: ["70%", "83%", "97%", "110%", "123%", "137%", "150%", "163%", "177%", "190%"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Accuracy by "],
				stat2: ["15%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 2,
			skin_names: ["The Guarded Beloved", "Cocktail Party Exterminator"],
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
			id: 57,
			name: "ST AR-15",
			type: "AR",
			rarity: 4,
			max_hp: 105,
			max_dmg: 48,
			max_acc: 50,
			max_eva: 50,
			max_rof: 77,
			skill: {
				name: "Assault Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "27%", "29%", "32%", "34%", "36%", "38%", "41%", "43%", "45%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Rate of Fire by "],
				stat2: ["12%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 57,
			name: "ST AR-15 Mod",
			type: "AR",
			rarity: 5,
			max_hp: 108,
			max_dmg: 50,
			max_acc: 55,
			max_eva: 52,
			max_rof: 78,
			skill: {
				name: "Assault Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			skill2: {
				name: "Crime and Punishment",
				initial_cooldown: "Passive",
				description: "Attack with both weapons during Assault Focus's activation. The secondary weapon will deal #1 damage, doubled to #2 against targets marked with the Seal of the Avenger.",
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: ["10%", "12%", "12%", "14%", "14%", "16%", "16%", "18%", "18%", "20%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Rate of Fire by "],
				stat2: ["15%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 3,
			skin_names: ["Literary Girl", "Top Hat Drifting to the Flowers", "Dreamscape Prisoner"],
			animations: {
				hasSkillAnimation: [false, true, true],
				hasAttack2Animation: [false, true, true],
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
			id: 58,
			name: "AK-47",
			type: "AR",
			rarity: 3,
			max_hp: 132,
			max_dmg: 53,
			max_acc: 35,
			max_eva: 34,
			max_rof: 65,
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
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 1, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Evasion by "],
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
			skin_names: ["Lord of War"],
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
			id: 59,
			name: "AK-74U",
			type: "SMG",
			rarity: 5,
			max_hp: 194,
			max_dmg: 35,
			max_acc: 13,
			max_eva: 67,
			max_rof: 83,
			skill: {
				name: "Repulsive Response",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"While skill is active, any enemy units she deals damage to, will receive a #1 damage and accuracy reducing penalty (elite units receives #2 instead) for #3 seconds (repeated hits on the same target resets debuff duration).",
				number_of_stats: 3,
				stat1: ["25%", "28%", "31%", "33%", "36%", "39%", "42%", "44%", "47%", "50%"],
				stat2: ["12%", "14%", "15%", "17%", "18%", "19%", "21%", "22%", "24%", "25%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Lily of the Valley"],
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
			id: 60,
			name: "AS VAL",
			type: "AR",
			rarity: 4,
			max_hp: 132,
			max_dmg: 39,
			max_acc: 46,
			max_eva: 49,
			max_rof: 75,
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
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
				stat2: ["10%", "25%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 60,
			name: "AS VAL Mod",
			type: "AR",
			rarity: 5,
			max_hp: 136,
			max_dmg: 43,
			max_acc: 51,
			max_eva: 51,
			max_rof: 76,
			skill: {
				name: "Damage Focus N",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["120%", "129%", "138%", "147%", "156%", "164%", "173%", "183%", "191%", "200%"],
				stat2: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
			},
			skill2: {
				name: "Belief",
				initial_cooldown: "Passive",
				description: "Upon receiving any type of damage buff (including fairy skills and talents), grants self perfect accuracy for #1 seconds.",
				number_of_stats: 1,
				stat1: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
				stat2: ["15%", "25%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Fireworks of Dreams"],
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
			id: 61,
			name: "StG44",
			type: "AR",
			rarity: 3,
			max_hp: 127,
			max_dmg: 53,
			max_acc: 46,
			max_eva: 36,
			max_rof: 61,
			skill: {
				name: "High-Explosive Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
				number_of_stats: 1,
				stat1: ["1.8/0.7/0.4x", "2.1/0.8/0.5x", "2.4/0.9/0.5x", "2.7/1.1/0.6x", "3/1.2/0.7x", "3.3/1.3/0.7x", "3.6/1.4/0.8x", "3.9/1.7/0.9x", "4.2/1.8/0.9x", "4.5/1.8/1x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["60%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 61,
			name: "StG44 Mod",
			type: "AR",
			rarity: 4,
			max_hp: 130,
			max_dmg: 58,
			max_acc: 50,
			max_eva: 38,
			max_rof: 66,
			skill: {
				name: "High-Explosive Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
				number_of_stats: 1,
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"]
			},
			skill2: {
				name: "Firestorm",
				initial_cooldown: "Passive",
				description:
					"Base grenade damage increased by #1, and will explode 3 times, dealing damage to enemies on the edges of the 1, 2.5 and 4 explosions radius. Enemies will receive multiple hits when standing in overlapping areas.",
				number_of_stats: 1,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 1],
				row3: [0, 1, 0],
				targets: "Buffs SMG and AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Evasion by "],
				stat2: ["60%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 62,
			name: "G41",
			type: "AR",
			rarity: 5,
			max_hp: 127,
			max_dmg: 50,
			max_acc: 48,
			max_eva: 40,
			max_rof: 77,
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
				stat1: ["Evasion by ", "Accuracy by "],
				stat2: ["15%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Beach Punk 2062"],
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
			id: 63,
			name: "G3",
			type: "AR",
			rarity: 2,
			max_hp: 110,
			max_dmg: 55,
			max_acc: 46,
			max_eva: 38,
			max_rof: 61,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["4x", "4.7x", "5.3x", "6x", "6.7x", "7.3x", "8x", "8.7x", "9.3x", "10x"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["50%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 63,
			name: "G3 Mod",
			type: "AR",
			rarity: 4,
			max_hp: 113,
			max_dmg: 58,
			max_acc: 55,
			max_eva: 40,
			max_rof: 68,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["5x", "5.8x", "6.6x", "7.3x", "8.1x", "8.9x", "9.7x", "10.4x", "11.2x", "12x"]
			},
			skill2: {
				name: "Freezing Point of Bravery",
				initial_cooldown: "Passive",
				description:
					"Upon launching her grenade, have 1 of 2 effects happen depending on how much HP her targets have: If targets have over 50% HP, applies a stun effect that lasts #1 seconds. If targets have under 50% HP, her grenade will deal an extra #2 damage.",
				number_of_stats: 2,
				stat1: ["0.8", "0.9", "1.0", "1.1", "1.2", "1.2", "1.3", "1.4", "1.5", "1.6"],
				stat2: ["1.6x", "1.87x", "2.13x", "2.4x", "2.67x", "2.93x", "3.2x", "3.47x", "3.73x", "4x"]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Rate of Fire by "],
				stat2: ["55%", "25%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Battlefield Patissier"],
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
			id: 64,
			name: "G36",
			type: "AR",
			rarity: 4,
			max_hp: 127,
			max_dmg: 47,
			max_acc: 44,
			max_eva: 41,
			max_rof: 72,
			skill: {
				name: "Damage Focus T",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "43%", "47%", "50%", "53%", "57%", "60%", "63%", "67%", "70%"],
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["30%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 64,
			name: "G36 Mod",
			type: "AR",
			rarity: 5,
			max_hp: 130,
			max_dmg: 51,
			max_acc: 48,
			max_eva: 45,
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
			skill2: {
				name: "Arclight Pact",
				initial_cooldown: "Passive",
				description:
					'When "Damage Focus T" is active, increases the evasion of allies on her buff tiles by #1 for #2 seconds. For every ally present on her buff tiles during the passive\'s activation, grants self #3 rate of fire for #4 seconds (max 2 stacks).',
				number_of_stats: 4,
				stat1: ["10%", "12%", "13%", "15%", "17%", "18%", "20%", "21%", "23%", "25%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat3: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Rate of Fire by "],
				stat2: ["30%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 6,
			skin_names: ["Petit Waitress", "Bartender", "Pure White Cornflower", "Fifty Days with G36", "Every Child's Christmas Dream", "Moonlit Wishes"],
			animations: {
				hasSkillAnimation: [false, false, false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, true, false, true],
				hasSit2Animation: [false, false, false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 65,
			name: "HK416",
			type: "AR",
			rarity: 5,
			max_hp: 121,
			max_dmg: 51,
			max_acc: 46,
			max_eva: 44,
			max_rof: 76,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["40%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 65,
			name: "HK416 Mod",
			type: "AR",
			rarity: 6,
			max_hp: 125,
			max_dmg: 55,
			max_acc: 51,
			max_eva: 47,
			max_rof: 79,
			skill: {
				name: "Anti-Personnel Grenade",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1.5 unit.",
				number_of_stats: 1,
				stat1: ["6x", "7.1x", "8.2x", "9.3x", "10.4x", "11.6x", "12.7x", "13.8x", "14.9x", "16x"]
			},
			skill2: {
				name: "Parasitic Grenade",
				initial_cooldown: "Passive",
				description:
					"If grenade kills the main target, cause a secondary explosion dealing #1 damage to enemies within a radius of 4 units. If grenade did not kill the main target, deal #2 damage every 0.33 seconds and increases damage dealt to the target by #3 for 3 seconds.",
				number_of_stats: 3,
				stat1: ["1.5x", "1.72x", "1.94x", "2.17x", "2.39x", "2.61x", "2.83x", "3.06x", "3.28x", "3.5x"],
				stat2: ["0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x", "0.53x", "0.57x", "0.6x"],
				stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["45%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 4,
			skin_names: ["Starry Cocoon", "Black Cat's Gift", "Primrose-Flavored Foil Candy", "Fangs"],
			animations: {
				hasSkillAnimation: [true, true, true, true],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 66,
			name: "Type 56-1",
			type: "AR",
			rarity: 4,
			max_hp: 138,
			max_dmg: 53,
			max_acc: 35,
			max_eva: 35,
			max_rof: 69,
			skill: {
				name: "High-Explosive Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
				number_of_stats: 1,
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Critical Rate by ", "Evasion by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Scarlet Sage", "As One, Forever Entwined"],
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
			id: 68,
			name: "L85A1",
			type: "AR",
			rarity: 2,
			max_hp: 94,
			max_dmg: 46,
			max_acc: 43,
			max_eva: 43,
			max_rof: 78,
			skill: {
				name: "Charge Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases damage by #1 and rate of fire by #2 for #3 seconds.",
				number_of_stats: 3,
				stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "32%", "33%", "35%"],
				stat2: ["10%", "11%", "11%", "12%", "12%", "13%", "13%", "14%", "14%", "15%"],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["50%", "20%"]
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
			id: 69,
			name: "FAMAS",
			type: "AR",
			rarity: 4,
			max_hp: 121,
			max_dmg: 44,
			max_acc: 48,
			max_eva: 40,
			max_rof: 81,
			skill: {
				name: "High-Explosive Grenade",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Launches a grenade that deals #1 damage to enemies within a radius of 1/2.5/4 units.",
				number_of_stats: 1,
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["60%", "25%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Guns N' Side Boxes", "Bird and Forest Whisperer"],
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
			id: 70,
			name: "FF FNC",
			type: "AR",
			rarity: 3,
			max_hp: 110,
			max_dmg: 51,
			max_acc: 46,
			max_eva: 37,
			max_rof: 73,
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
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Evasion by ", "Accuracy by "],
				stat2: ["12%", "50%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Steal the Precious Candy", "Strawberry Cake and Cosmos Flower"],
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
			id: 71,
			name: "Galil",
			type: "AR",
			rarity: 2,
			max_hp: 105,
			max_dmg: 50,
			max_acc: 44,
			max_eva: 43,
			max_rof: 66,
			skill: {
				name: "Precision Focus",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Increases accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["200%", "233%", "267%", "300%", "333%", "367%", "400%", "433%", "467%", "500%"],
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Accuracy by "],
				stat2: ["12%", "50%"]
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
			id: 72,
			name: "TAR-21",
			type: "AR",
			rarity: 4,
			max_hp: 103,
			max_dmg: 49,
			max_acc: 48,
			max_eva: 44,
			max_rof: 79,
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
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 1,
				stat1: ["Evasion by "],
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
			skin_names: ["Night at the Bar"],
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
			id: 73,
			name: "AUG",
			type: "AR",
			rarity: 5,
			max_hp: 121,
			max_dmg: 55,
			max_acc: 57,
			max_eva: 46,
			max_rof: 75,
			skill: {
				name: "Rain of Burial",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "At the cost of reducing own accuracy by #1, raise own rate of fire to 150 and enter sweep mode (switch target after every shot), last for #2 seconds.",
				number_of_stats: 2,
				stat1: ["-30%", "-27%", "-23%", "-20%", "-17%", "-13%", "-10%", "-7%", "-3%", "-0%"],
				stat2: [3, 3.4, 3.9, 4.3, 4.8, 5.2, 5.7, 6.1, 6.6, 7]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["12%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Funeral Array"],
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
			id: 74,
			name: "SIG-510",
			type: "AR",
			rarity: 2,
			max_hp: 116,
			max_dmg: 56,
			max_acc: 41,
			max_eva: 37,
			max_rof: 59,
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
				row1: [0, 0, 1],
				row2: [0, 2, 0],
				row3: [0, 0, 1],
				targets: "Buffs SMG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
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
			id: 75,
			name: "M1918",
			type: "MG",
			rarity: 4,
			max_hp: 147,
			max_dmg: 96,
			max_acc: 31,
			max_eva: 33,
			max_rof: 114,
			skill: {
				name: "Damage Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Armor by ", "Damage by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 75,
			name: "M1918 Mod",
			type: "MG",
			rarity: 5,
			max_hp: 161,
			max_dmg: 101,
			max_acc: 34,
			max_eva: 34,
			max_rof: 115,
			skill: {
				name: "Damage Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["28%", "33%", "38%", "43%", "48%", "54%", "59%", "64%", "70%", "75%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			skill2: {
				name: "Battlefield Witch",
				initial_cooldown: "Passive",
				description: "Self reload time is reduced to a fixed #1 seconds. After reloading, the first 3 bullets will have #2 increased damage (affects first volley).",
				number_of_stats: 2,
				stat1: [5.5, 5.4, 5.4, 5.3, 5.3, 5.2, 5.2, 5.1, 5.1, 5],
				stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Armor by ", "Damage by "],
				stat2: ["10%", "18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 3,
			skin_names: ["Bunny Girl", "Tender Nocturne", "The Christmas You Wished For"],
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
			id: 77,
			name: "M2HB",
			type: "MG",
			rarity: 3,
			max_hp: 215,
			max_dmg: 102,
			max_acc: 18,
			max_eva: 16,
			max_rof: 100,
			skill: {
				name: "Terminating Barrage",
				initial_cooldown: "Passive",
				description: "After every 3 hits, the next hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["1.2x", "1.3x", "1.5x", "1.6x", "1.7x", "1.9x", "2x", "2.1x", "2.3x", "2.4x"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["22%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Blazing Tarmac"],
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
			id: 78,
			name: "M60",
			type: "MG",
			rarity: 4,
			max_hp: 182,
			max_dmg: 92,
			max_acc: 26,
			max_eva: 26,
			max_rof: 111,
			skill: {
				name: "Damage Focus N-MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["40%", "47%", "54%", "62%", "69%", "76%", "83%", "91%", "98%", "105%"],
				stat2: ["12%", "15%", "17%", "20%", "22%", "25%", "27%", "30%", "32%", "35%"],
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
				stat2: ["8%", "10%"]
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
			id: 79,
			name: "M249 SAW",
			type: "MG",
			rarity: 3,
			max_hp: 157,
			max_dmg: 79,
			max_acc: 35,
			max_eva: 36,
			max_rof: 139,
			skill: {
				name: "Lock and Load N",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "During nighttime, increases damage by #1 (#2 during day) and grants #3 ammo to current salvo for #4 seconds.",
				number_of_stats: 4,
				stat1: ["25%", "27%", "29%", "32%", "34%", "36%", "38%", "41%", "43%", "45%"],
				stat2: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["12%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Arctic Fox", "Oborozukuyo"],
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
			id: 80,
			name: "M1919A4",
			type: "MG",
			rarity: 3,
			max_hp: 182,
			max_dmg: 96,
			max_acc: 26,
			max_eva: 22,
			max_rof: 99,
			skill: {
				name: "Hunting Impulse",
				initial_cooldown: "3s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases accuracy by #1 and all hits will be criticals for #2 seconds.",
				number_of_stats: 2,
				stat1: ["25%", "29%", "34%", "38%", "43%", "47%", "52%", "56%", "61%", "65%"],
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 0],
				row3: [2, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Armor by "],
				stat2: ["25%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Carmilla", "Partying Sweetheart"],
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
			id: 81,
			name: "LWMMG",
			type: "MG",
			rarity: 2,
			max_hp: 174,
			max_dmg: 95,
			max_acc: 24,
			max_eva: 22,
			max_rof: 90,
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
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
				stat2: ["10%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 81,
			name: "LWMMG Mod",
			type: "MG",
			rarity: 4,
			max_hp: 178,
			max_dmg: 103,
			max_acc: 27,
			max_eva: 24,
			max_rof: 92,
			skill: {
				name: "Hunting Impulse",
				initial_cooldown: "3s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases accuracy by #1 and all hits will be criticals for #2 seconds.",
				number_of_stats: 2,
				stat1: ["30%", "34%", "39%", "43%", "48%", "52%", "57%", "61%", "66%", "70%"],
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6]
			},
			skill2: {
				name: "Shining Barrier",
				initial_cooldown: "Passive",
				description:
					'Every attack she does has a #1 chance to grant a #2 HP shield to dolls on her tiles, lasting for #3 seconds. While "Hunting Impulse" is active, increases the chance of granting a shield to 100%.',
				number_of_stats: 3,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [3, 3, 3, 3, 4, 4, 4, 4, 4, 5],
				stat3: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.4, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Damage by "],
				stat2: ["15%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 2,
			skin_names: ["Yellow Star-thistle", "My Lie in December"],
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
			id: 82,
			name: "DP28",
			type: "MG",
			rarity: 2,
			max_hp: 141,
			max_dmg: 88,
			max_acc: 28,
			max_eva: 31,
			max_rof: 114,
			skill: {
				name: "Lock and Load",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
				number_of_stats: 3,
				stat1: ["16%", "17%", "19%", "20%", "21%", "23%", "24%", "25%", "27%", "28%"],
				stat2: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3"],
				stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 0],
				row3: [2, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
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
			id: 84,
			name: "RPD",
			type: "MG",
			rarity: 3,
			max_hp: 165,
			max_dmg: 82,
			max_acc: 34,
			max_eva: 34,
			max_rof: 121,
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
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
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
	///////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 85,
			name: "PK",
			type: "MG",
			rarity: 4,
			max_hp: 190,
			max_dmg: 96,
			max_acc: 21,
			max_eva: 23,
			max_rof: 84,
			skill: {
				name: "Terminating Barrage",
				initial_cooldown: "Passive",
				description: "After every 3 hits, the next hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["1.5x", "1.6x", "1.7x", "1.9x", "2x", "2.1x", "2.2x", "2.4x", "2.5x", "2.6x"]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 1],
				row3: [0, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Damage by "],
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
			skin_names: ["By Your Side"],
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
			id: 86,
			name: "MG42",
			type: "MG",
			rarity: 3,
			max_hp: 165,
			max_dmg: 92,
			max_acc: 23,
			max_eva: 26,
			max_rof: 132,
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
				row1: [2, 0, 0],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["22%"]
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
			id: 87,
			name: "MG34",
			type: "MG",
			rarity: 2,
			max_hp: 165,
			max_dmg: 85,
			max_acc: 22,
			max_eva: 25,
			max_rof: 120,
			skill: {
				name: "Damage Focus MG",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["20%", "24%", "29%", "33%", "38%", "42%", "47%", "51%", "56%", "60%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [0, 0, 0],
				row3: [2, 0, 0],
				targets: "Buffs SG",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Jade Peach Fairy"],
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
			id: 88,
			name: "MG3",
			type: "MG",
			rarity: 4,
			max_hp: 198,
			max_dmg: 85,
			max_acc: 26,
			max_eva: 21,
			max_rof: 130,
			skill: {
				name: "Lock and Load",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
				number_of_stats: 3,
				stat1: ["18%", "19%", "21%", "22%", "23%", "25%", "26%", "27%", "29%", "30%"],
				stat2: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
				stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			tile_set: {
				row1: [0, 0, 1],
				row2: [2, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["15%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 3,
			skin_names: ["Urban Holiday", "Full Moon's Gaze", "Springtime Lion Dance"],
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
			id: 89,
			name: "Bren",
			type: "MG",
			rarity: 3,
			max_hp: 174,
			max_dmg: 89,
			max_acc: 31,
			max_eva: 28,
			max_rof: 102,
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
				row1: [2, 0, 1],
				row2: [0, 0, 0],
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
		mod: {
			id: 89,
			name: "Bren Mod",
			type: "MG",
			rarity: 4,
			max_hp: 178,
			max_dmg: 97,
			max_acc: 34,
			max_eva: 29,
			max_rof: 103,
			skill: {
				name: "Lock and Load",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Increases damage by #1 and grants #2 ammo to current salvo for #3 seconds.",
				number_of_stats: 3,
				stat1: ["18%", "19%", "21%", "22%", "23%", "25%", "26%", "27%", "29%", "30%"],
				stat2: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
				stat3: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8]
			},
			skill2: {
				name: "Disparity of the Strong",
				initial_cooldown: "Passive",
				description: "Increases accuracy by #1 and increases max ammo by +1 for every reload. Can be stacked up to 3 times.",
				number_of_stats: 1,
				stat1: ["5%", "6%", "7%", "8%", "9%", "11%", "12%", "13%", "14%", "15%"]
			},
			tile_set: {
				row1: [2, 0, 1],
				row2: [0, 0, 0],
				row3: [0, 0, 1],
				targets: "Buffs SG",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["10%", "15%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 1,
			skin_names: ["Jack o'Three"],
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
			id: 90,
			name: "FNP-9",
			type: "HG",
			rarity: 2,
			max_hp: 60,
			max_dmg: 28,
			max_acc: 53,
			max_eva: 83,
			max_rof: 61,
			skill: {
				name: "Cover Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["32%", "33%", "34%", "35%", "36%", "36%", "37%", "38%", "39%", "40%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["20%", "40%"]
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
			id: 91,
			name: "MP-446",
			type: "HG",
			rarity: 2,
			max_hp: 66,
			max_dmg: 30,
			max_acc: 53,
			max_eva: 74,
			max_rof: 59,
			skill: {
				name: "Assault Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["12%", "13%", "14%", "15%", "16%", "18%", "19%", "20%", "21%", "22%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["28%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 91,
			name: "MP-446 Mod",
			type: "HG",
			rarity: 4,
			max_hp: 68,
			max_dmg: 31,
			max_acc: 57,
			max_eva: 80,
			max_rof: 60,
			skill: {
				name: "Assault Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["16%", "17%", "19%", "20%", "21%", "23%", "24%", "25%", "27%", "28%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			skill2: {
				name: "Tidal Breach",
				initial_cooldown: "Passive",
				description: 'Upon activation of "Assault Suppression", increases the rate of fire of allies on her tile buffs by #1 for #2 seconds.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["36%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 2,
			skin_names: ["Boisterous Rogue", "Sunflower"],
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
			id: 92,
			name: "Spectre M4",
			type: "SMG",
			rarity: 2,
			max_hp: 176,
			max_dmg: 25,
			max_acc: 12,
			max_eva: 66,
			max_rof: 88,
			skill: {
				name: "Cover Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["60%", "66%", "71%", "77%", "82%", "88%", "93%", "99%", "104%", "110%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Damage by "],
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
			id: 93,
			name: "IDW",
			type: "SMG",
			rarity: 2,
			max_hp: 150,
			max_dmg: 26,
			max_acc: 15,
			max_eva: 85,
			max_rof: 75,
			skill: {
				name: "Cover Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["60%", "66%", "71%", "77%", "82%", "88%", "93%", "99%", "104%", "110%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Evasion by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 93,
			name: "IDW Mod",
			type: "SMG",
			rarity: 4,
			max_hp: 154,
			max_dmg: 27,
			max_acc: 16,
			max_eva: 92,
			max_rof: 75,
			skill: {
				name: "Cover Focus",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "Increases evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["70%", "77%", "83%", "90%", "97%", "103%", "110%", "117%", "123%", "130%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			skill2: {
				name: "Lightning Carnival",
				initial_cooldown: "Passive",
				description:
					'Start a battle with 3 bars of battery, each bar increasing rate of fire by #1 and damage by #2. Consumes 1 bar of battery every #3 seconds. When IDW uses "Cover Focus", battery replenishes back to 3.',
				number_of_stats: 3,
				stat1: ["6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%", "10%"],
				stat2: ["12%", "13%", "14%", "15%", "16%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [1.5, 1.6, 1.7, 1.9, 2.0, 2.1, 2.2, 2.4, 2.5, 2.6]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Critical Rate by "],
				stat2: ["20%", "10%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 3,
			skin_names: ["Cat in the Box", "Cloak and Cat Ears", "Daruma Cat Samurai"],
			animations: {
				hasSkillAnimation: [true, true, true],
				hasVictoryLoopAnimation: [true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, true, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 94,
			name: "Type 64",
			type: "SMG",
			rarity: 2,
			max_hp: 176,
			max_dmg: 27,
			max_acc: 11,
			max_eva: 65,
			max_rof: 93,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [1.8, 2, 2.1, 2.3, 2.4, 2.6, 2.7, 2.9, 3, 3.2]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
				stat2: ["20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: {
			id: 94,
			name: "Type 64 Mod",
			type: "SMG",
			rarity: 4,
			max_hp: 181,
			max_dmg: 28,
			max_acc: 12,
			max_eva: 70,
			max_rof: 93,
			skill: {
				name: "Stun Grenade",
				initial_cooldown: "Passive",
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds.",
				number_of_stats: 1,
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4]
			},
			skill2: {
				name: "Silencing Flash",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Thrown flashbang will also incur a #1 accuracy penalty to struck units which last for #2 seconds. Units that are immune to stuns are also affected.",
				number_of_stats: 1,
				stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [1, 2, 0],
				row3: [0, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 1,
				stat1: ["Rate of Fire by "],
				stat2: ["24%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 2,
			skin_names: ["Witch from Afar", "Water Gown"],
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
			id: 95,
			name: "Hanyang Type 88",
			type: "RF",
			rarity: 3,
			max_hp: 102,
			max_dmg: 108,
			max_acc: 60,
			max_eva: 37,
			max_rof: 31,
			skill: {
				name: "Damage Focus N",
				initial_cooldown: "8s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "During nighttime, increases damage by #1 (#2 during day) for #3 seconds.",
				number_of_stats: 3,
				stat1: ["50%", "54%", "59%", "63%", "68%", "72%", "77%", "81%", "86%", "90%"],
				stat2: ["16%", "18%", "19%", "21%", "22%", "24%", "25%", "27%", "28%", "30%"],
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
			},
			tile_set: {
				row1: [0, 0, 0],
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
		mod: {
			id: 95,
			name: "Hanyang Type 88 Mod",
			type: "RF",
			rarity: 4,
			max_hp: 104,
			max_dmg: 118,
			max_acc: 69,
			max_eva: 39,
			max_rof: 37,
			skill: {
				name: "Damage Focus N",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description: "During nighttime, increases damage by #1 (#2 during day) and movement speed by 500% for #3 seconds.",
				number_of_stats: 3,
				stat1: ["55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"],
				stat2: ["18%", "20%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "35%"],
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6]
			},
			skill2: {
				name: "Almighty Combat Skills",
				initial_cooldown: "Passive",
				description:
					"If there are enemies directly in front of her, switch to attacking with an energy blade sending out waves of energy dealing 1x damage to all enemy units in the same lane as her. When \"Damage Focus N\" is active, attacks gain a piercing effect, dealing 1x damage to all enemies it passes through. Additionally perform one of two actions based on the enemies status: If they're armored and has the highest HP, fire a missile dealing #1 damage to the target and dealing #2 damage to enemies within a radius of 2 units. Splash damage is affected by armor. If they're unarmored, throw a cluster grenade which will deal #3 damage within a radius of 1 unit repeatedly up to 7 times. Repeated explosions on the same target will only deal #4 damage. Grenade damage can be evaded and is affected by armor.",
				number_of_stats: 4,
				stat1: ["0.6x", "0.7x", "0.8x", "0.9x", "1x", "1.1x", "1.2x", "1.3x", "1.4x", "1.5x"],
				stat2: ["0.2x", "0.23x", "0.27x", "0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x"],
				stat3: ["0.2x", "0.23x", "0.27x", "0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x"],
				stat4: ["0.1x", "0.115x", "0.135x", "0.15x", "0.165x", "0.185x", "0.2x", "0.215x", "0.235x", "0.25x"]
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
				hasSkillAnimation: true,
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 96,
			name: "Grizzly MkV",
			type: "HG",
			rarity: 5,
			max_hp: 86,
			max_dmg: 38,
			max_acc: 51,
			max_eva: 66,
			max_rof: 54,
			skill: {
				name: "Fire Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' damage by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 2, 1],
				row3: [1, 1, 0],
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
			number_of_skins: 4,
			skin_names: ["Weekend Cop", "Transform! Teddy Bear!", "Starry Night Prom", "Rainy Starry Night"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 97,
			name: "M950A",
			type: "HG",
			rarity: 5,
			max_hp: 76,
			max_dmg: 30,
			max_acc: 55,
			max_eva: 68,
			max_rof: 72,
			skill: {
				name: "Assault Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 1],
				row2: [0, 2, 0],
				row3: [1, 0, 1],
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
		mod: {
			id: 97,
			name: "M950A Mod",
			type: "HG",
			rarity: 6,
			max_hp: 80,
			max_dmg: 33,
			max_acc: 57,
			max_eva: 77,
			max_rof: 72,
			skill: {
				name: "Assault Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["16%", "17%", "19%", "20%", "21%", "23%", "24%", "25%", "27%", "28%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			skill2: {
				name: "Soul LIVE!",
				initial_cooldown: "Passive",
				description:
					"When entering combat on an allied node, create a deceleration zone in a radius of 4 units in front of the echelon's formation, reducing the movement speed and evasion of enemies within by #1 for #2 seconds. When entering combat on a non-allied node, increase all allies' rate of fire by #3 for #4 seconds. Additionally, increase SMG/RF/AR/MG/SG movement speed by 3/8/5/11/9 points for #5 seconds.",
				number_of_stats: 5,
				stat1: ["10%", "12%", "14%", "17%", "19%", "21%", "23%", "26%", "28%", "30%"],
				stat2: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.3, 5.7, 6],
				stat3: ["3%", "3%", "3%", "4%", "4%", "4%", "4%", "5%", "5%", "5%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat5: [30, 33.3, 36.7, 40, 43.3, 46.7, 50, 53.3, 56.7, 60]
			},
			tile_set: {
				row1: [1, 0, 1],
				row2: [0, 2, 0],
				row3: [1, 0, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["32%", "60%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		skins: {
			number_of_skins: 4,
			skin_names: ["Ace on Duty", "Concert Diva", "Housework Training", "The Warbler And The Rose"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 98,
			name: "SPP-1",
			type: "HG",
			rarity: 4,
			max_hp: 76,
			max_dmg: 35,
			max_acc: 61,
			max_eva: 75,
			max_rof: 48,
			skill: {
				name: "Cover Suppression",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Decrease all enemies' evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["40%", "42%", "43%", "45%", "47%", "48%", "50%", "52%", "53%", "55%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Damage by "],
				stat2: ["90%", "12%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Embracing Snowflakes", "Blue Lotus Night"],
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
			id: 99,
			name: "Mk23",
			type: "HG",
			rarity: 4,
			max_hp: 80,
			max_dmg: 29,
			max_acc: 53,
			max_eva: 66,
			max_rof: 64,
			skill: {
				name: "Fire Command N",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "During nighttime, increase all allies' damage by #1 (#2 during daytime) for #3 seconds (#4 seconds during daytime).",
				number_of_stats: 4,
				stat1: ["18%", "20%", "22%", "24%", "26%", "27%", "29%", "31%", "33%", "35%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 1],
				row3: [1, 0, 0],
				targets: "Buffs All Types",
				number_of_stats: 1,
				stat1: ["Damage by "],
				stat2: ["36%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 4,
			skin_names: ["Impish Sweetheart", "Honey Sweet Flower", "Conveyed Feelings", "The Cats Song Announcement"],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false]
			}
		}
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 100,
			name: "P7",
			type: "HG",
			rarity: 4,
			max_hp: 63,
			max_dmg: 32,
			max_acc: 62,
			max_eva: 83,
			max_rof: 61,
			skill: {
				name: "Cover Command",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Increase all allies' evasion by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [0, 2, 0],
				row3: [1, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Rate of Fire by "],
				stat2: ["24%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Pinky Swear", "Demonic Gunslinger"],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true]
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false]
			}
		}
	}
];
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// END OF #1-#100 JSON DATA //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//console.log("Now processing images and animations for #1-#100 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for #1-#100 T-Doll Index JSON.");

export default tdolls;
