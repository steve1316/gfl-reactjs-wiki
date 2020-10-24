/*
    This array of T-Dolls will contain information about Extras #1000 to #1050 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

import processData from "./processData";

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// START OF EXTRAS #1000-#1050 JSON DATA ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var tdolls = [
	{
		normal: {
			id: 1001,
			name: "Noel",
			type: "HG",
			rarity: 1,
			max_hp: 60,
			max_dmg: 30,
			max_acc: 60,
			max_eva: 82,
			max_rof: 65,
			skill: {
				name: "Zero-Gun: Fenrir",
				initial_cooldown: "6s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description: "Dash forwards and deal #1 damage 8 times to enemies in a small area.",
				number_of_stats: 1,
				stat1: ["0.6x", "0.7x", "0.7x", "0.8x", "0.9x", "0.9x", "1x", "1.1x", "1.1x", "1.2x"]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [0, 2, 0],
				row3: [1, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["30%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["μ-12"],
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
			id: 1002,
			name: "Elphelt",
			type: "SG",
			rarity: 1,
			max_hp: 275,
			max_dmg: 36,
			max_acc: 13,
			max_eva: 9,
			max_rof: 28,
			max_armor: 23,
			skill: {
				name: "Genoverse",
				initial_cooldown: "10s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Inflicts #1 damage and locks on to the target before launching a missile that deals #2 damage to enemies within 1.5 unit radius.",
				number_of_stats: 2,
				stat1: ["4x", "4.4x", "4.9x", "5.3x", "5.8x", "6.2x", "6.7x", "7.1x", "7.6x", "8x"],
				stat2: ["6x", "6.7x", "7.3x", "8x", "8.7x", "9.3x", "10x", "10.7x", "11.3x", "12x"]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [0, 2, 0],
				row3: [1, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Evasion by "],
				stat2: ["30%", "20%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 2,
			skin_names: ["Magnum Wedding", "Automaton Annihilator"],
			animations: {
				hasSkillAnimation: [true, true],
				hasSkill2Animation: [false, true],
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
			id: 1003,
			name: "Kiana",
			type: "HG",
			rarity: 1,
			max_hp: 70,
			max_dmg: 31,
			max_acc: 53,
			max_eva: 76,
			max_rof: 64,
			skill: {
				name: "Asgard's Wrath",
				initial_cooldown: "10s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"Generate a bolt of lightning that deals critical damage to enemies within a radius of 1.5. Enemies hit will be paralyzed for #1 seconds (unable to move or attack) and become vulnerable (receive #2 more damage). (BOSS is immune to both effects)",
				number_of_stats: 2,
				stat1: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3],
				stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Evasion by "],
				stat2: ["20%", "30%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Formal Dress"],
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
			id: 1004,
			name: "Raiden Mei",
			type: "RF",
			rarity: 1,
			max_hp: 84,
			max_dmg: 146,
			max_acc: 70,
			max_eva: 32,
			max_rof: 34,
			skill: {
				name: "Electromagnetic Shot",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "After aiming for 1.5 seconds, shoot the furthest target for #1 damage and paralyze it (unable to move or attack) for #2 seconds. (BOSS is immune to effect)",
				number_of_stats: 2,
				stat1: ["2.5x", "2.8x", "3.1x", "3.3x", "3.6x", "3.9x", "4.2x", "4.4x", "4.7x", "5x"],
				stat2: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 0],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 1005,
			name: "Bronya",
			type: "RF",
			rarity: 1,
			max_hp: 81,
			max_dmg: 132,
			max_acc: 77,
			max_eva: 33,
			max_rof: 37,
			skill: {
				name: "Black Hole Catalyst",
				initial_cooldown: "5s",
				cooldown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				description:
					"Throw a grenade that will create a black hole. The black hole lasts for #1 seconds and will draw in enemies within a 2.5 units radius. Enemies within a 1.5 unit radius will receive #2 damage per second.",
				number_of_stats: 2,
				stat1: [2, 2.3, 2.7, 3, 3.3, 3.7, 4, 4.3, 4.7, 5],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"]
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Bronya's Armor"],
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
			id: 1006,
			name: "Theresa",
			type: "HG",
			rarity: 1,
			max_hp: 83,
			max_dmg: 30,
			max_acc: 47,
			max_eva: 79,
			max_rof: 54,
			skill: {
				name: "Divine Punishment",
				initial_cooldown: "1s",
				cooldown: [15, 14.7, 14.3, 14, 13.7, 13.3, 13, 12.7, 12.4, 12],
				description:
					"Increase damage to enemies by #1 within a self radius of #2 for #3 seconds, and every attack has a #4 chance of immobilizing (unable to move) the target for #5 seconds. (BOSS is immune to effect)",
				number_of_stats: 5,
				stat1: ["60%", "64%", "69%", "73%", "78%", "82%", "87%", "91%", "96%", "100%"],
				stat2: [4, 4, 4, 4, 4, 4, 4, 5, 5, 5],
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat4: ["5%", "8%", "11%", "13%", "16%", "19%", "22%", "24%", "27%", "30%"],
				stat5: [1.5, 1.6, 1.6, 1.7, 1.7, 1.8, 1.8, 1.9, 1.9, 2]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [0, 2, 0],
				row3: [1, 1, 0],
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 1007,
			name: "Murata Himeko",
			type: "AR",
			rarity: 1,
			max_hp: 121,
			max_dmg: 58,
			max_acc: 45,
			max_eva: 42,
			max_rof: 64,
			skill: {
				name: "Dread of the Night",
				initial_cooldown: "1s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"For #1 seconds, charm (decrease damage by #2) and fear (decrease movement speed by #3) the nearest 3 enemies. At the same time, increase self damage against feared enemies by #4.",
				number_of_stats: 4,
				stat1: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat2: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat3: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat4: ["30%", "33%", "37%", "40%", "43%", "47%", "50%", "53%", "57%", "60%"]
			},
			tile_set: {
				row1: [0, 0, 0],
				row2: [0, 2, 1],
				row3: [0, 0, 0],
				targets: "Buffs SMG",
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
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
	{
		normal: {
			id: 1008,
			name: "Seele",
			type: "SG",
			rarity: 1,
			max_hp: 247,
			max_dmg: 35,
			max_acc: 11,
			max_eva: 13,
			max_rof: 27,
			max_armor: 22,
			skill: {
				name: "Quantum Recall",
				initial_cooldown: "Passive",
				description: "The last shot before reload will deal #1 damage. Reloads instantly.",
				number_of_stats: 1,
				stat1: ["150%", "170%", "180%", "200%", "220%", "230%", "250%", "270%", "280%", "300%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 0, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["20%", "10%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Festival"],
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
			id: 1009,
			name: "Clear",
			type: "HG",
			rarity: 1,
			max_hp: 66,
			max_dmg: 31,
			max_acc: 62,
			max_eva: 88,
			max_rof: 61,
			skill: {
				name: '"Make It Better"',
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					'Stop attacking to put on 5 performances. Each performance increases a random ally\'s damage and accuracy by #1 (#2 with "Glorylight" equipped). Max 1 stack. Each stack lasts 3 seconds.',
				number_of_stats: 2,
				stat1: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat2: ["20%", "22%", "24%", "26%", "28%", "30%", "32%", "34%", "37%", "40%"]
			},
			tile_set: {
				row1: [1, 1, 0],
				row2: [1, 2, 0],
				row3: [1, 1, 0],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["30%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Queen of Pocket City II"],
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
			id: 1010,
			name: "Fail",
			type: "HG",
			rarity: 1,
			max_hp: 66,
			max_dmg: 31,
			max_acc: 62,
			max_eva: 88,
			max_rof: 61,
			skill: {
				name: '"Sin Prisa"',
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					'Stop attacking to put on 5 performances. Each performance decreases 3 random enemies\' rate of fire and accuracy by #1 (#2 with "Black Cat" equipped). Max 2 stacks. Each stack lasts 3 seconds.',
				number_of_stats: 2,
				stat1: ["7%", "8%", "8%", "9%", "9%", "10%", "10%", "11%", "11%", "12%"],
				stat2: ["10%", "11%", "11%", "12%", "12%", "13%", "13%", "14%", "14%", "15%"]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Rate of Fire by ", "Accuracy by "],
				stat2: ["30%", "50%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Queen of Pocket City III"],
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
			id: 1017,
			name: "Jill",
			type: "HG",
			rarity: 1,
			max_hp: 80,
			max_dmg: 30,
			max_acc: 53,
			max_eva: 96,
			max_rof: 55,
			skill: {
				name: "Mixing Time",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description:
					"During battle, Jill takes 3 seconds to mix different drinks depending upon her equipment. Each drink grants a different buff to her echelon.\nJill cannot attack. Each point of Jill's base damage stat grants herself 1% skill cooldown reduction (does not affect initial cooldown time), max 30%.\n<color=#db3d3d>■</color>Adelhyde <color=#70ad47>■</color>Flanergide <color=#91c1f0>■</color>Karmotrine <color=#ffb400>■</color>Bronson Ext <color=#2e74b5>■</color>Pwd Delta  \n╔∷∷∷∷∷∷∷∷♪♪Menu♪♪∷∷∷∷∷∷∷∷╗\n <color=#ffb400>■</color>Bronson Ext<color=#70ad47>■</color>Flanergide<color=#91c1f0>■</color>Karmotrine \nBig Beer \n Increase SG armor by #1 and damage and accuracy by #2 for #3 seconds.\n <color=#db3d3d>■</color>Adelhyde<color=#db3d3d>■</color>Adelhyde<color=#2e74b5>■</color>Pwd Delta \nBrandtini\n Increase MG damage and accuracy by #4 for #5 seconds.\n <color=#db3d3d>■</color>Adelhyde<color=#ffb400>■</color>Bronson Ext<color=#91c1f0>■</color>Karmotrine \nPiano Woman\n Increase the front column's evasion by #6 and the other positions' damage by #7 for #8 seconds.\n <color=#db3d3d>■</color>Adelhyde<color=#db3d3d>■</color>Adelhyde<color=#91c1f0>■</color>Karmotrine \nMoonblast \n Increase all allies' rate of fire by #9 for #10 seconds.\n <color=#ffb400>■</color>Bronson Ext<color=#2e74b5>■</color>Pwd Delta<color=#70ad47>■</color>Flanergide \nBleeding Jane\n Increase RF and AR crit rate by #11 and 60% of the crit rate over the cap becomes additional crit damage for #12 seconds.\n <color=#91c1f0>■</color>Karmotrine<color=#91c1f0>■</color>Karmotrine<color=#91c1f0>■</color>Karmotrine \nFringe Weaver \n Increase all allies' damage by #13 for #14 seconds. After the skill effect ends, become drunk and decrease damage and accuracy by #15 for 3 seconds.\n <color=#db3d3d>❈❈❈</color> Default: Sugar Rush\n Increase all allies' damage by #16 for #17 seconds.\n╚∷∷∷∷∷∷∷♪♪Night Night♪♪∷∷∷∷∷∷╝",
				number_of_stats: 17,
				stat1: ["10%", "12%", "13%", "15%", "17%", "18%", "20%", "21%", "23%", "25%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat4: ["10%", "12%", "13%", "15%", "17%", "18%", "20%", "21%", "23%", "25%"],
				stat5: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat6: ["35%", "38%", "41%", "43%", "46%", "49%", "52%", "54%", "57%", "60%"],
				stat7: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat8: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat9: ["10%", "11%", "13%", "14%", "15%", "17%", "18%", "19%", "21%", "22%"],
				stat10: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat11: ["10%", "12%", "13%", "15%", "17%", "18%", "20%", "21%", "23%", "25%"],
				stat12: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				stat13: ["15%", "17%", "20%", "22%", "24%", "27%", "29%", "31%", "33%", "35%"],
				stat14: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat15: ["-20%", "-19%", "-19%", "-18%", "-18%", "-17%", "-17%", "-16%", "-16%", "-15%"],
				stat16: ["10%", "11%", "12%", "13%", "14%", "14%", "15%", "16%", "17%", "18%"],
				stat17: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 1, 1],
				row2: [1, 2, 1],
				row3: [1, 1, 1],
				targets: "Buffs All Types",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["40%", "40%"]
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Model Warrior"],
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
			id: 1018,
			name: "Sei",
			type: "HG",
			rarity: 1,
			max_hp: 85,
			max_dmg: 30,
			max_acc: 59,
			max_eva: 77,
			max_rof: 53,
			skill: {
				name: "White Knight's Shield",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				description:
					"Grant ally SGs, SMGs, HGs, and Fairies a shield with a base HP of #1 points for #2 seconds. The shield gains additional HP based upon the target's missing HP, with the minimum increase being 0.8x and the maximum being 1.8x. When Stella is present, Sei's attacks count toward Stella's passive skill. Favorite Drink: When buffed by a Moonblast, skill takes effect for the duration of the Moonblast, and the additional shield HP gain based upon the target's missing HP is doubled.",
				number_of_stats: 2,
				stat1: [14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
			number_of_skins: 1,
			skin_names: ["Friend's Casual Wear"],
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
			id: 1019,
			name: "Dorothy",
			type: "SMG",
			rarity: 1,
			max_hp: 176,
			max_dmg: 28,
			max_acc: 15,
			max_eva: 87,
			max_rof: 79,
			skill: {
				name: "Secret Modifications",
				initial_cooldown: "1s",
				cooldown: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				description:
					"Press to toggle between Nano-Camo and MIRD-113. MIRD-113: When activated, increase self damage by #1 and decrease the accuracy of all allies in the same column by #2 but increase their evasion by #3 (cannot activate Python's passive). Nano-Camo: When activated, increase self evasion by #4 and decrease the evasion of all allies in same column by #5 but increase their accuracy by #6 (cannot activate Python's passive) .\nWhen Dorothy is in the center row, she activates Nano-Camo by default and MIRD-113 otherwise.\nFavorite Drink: When buffed by a Piano Woman, reduce the debuff effect of her skill by 50%.",
				number_of_stats: 6,
				stat1: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat2: ["60%", "58%", "56%", "53%", "51%", "49%", "47%", "44%", "42%", "40%"],
				stat3: ["50%", "53%", "57%", "60%", "63%", "68%", "70%", "73%", "77%", "80%"],
				stat4: ["50%", "56%", "61%", "67%", "72%", "78%", "83%", "89%", "94%", "100%"],
				stat5: ["60%", "58%", "56%", "53%", "51%", "49%", "47%", "44%", "42%", "40%"],
				stat6: ["50%", "53%", "57%", "60%", "63%", "68%", "70%", "73%", "77%", "80%"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR and RF",
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
			skin_names: ["Precious Christmas Uniform"],
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
			id: 1020,
			name: "Stella",
			type: "RF",
			rarity: 1,
			max_hp: 90,
			max_dmg: 117,
			max_acc: 84,
			max_eva: 36,
			max_rof: 35,
			skill: {
				name: "Puppet Mask",
				initial_cooldown: "6s",
				cooldown: [10, 9.8, 9.6, 9.3, 9.1, 8.9, 8.7, 8.4, 8.2, 8],
				passive_active_description: true,
				description:
					"Passive: After her puppets attack #1 times, her next attack gains an extra 50% critical damage. When Sei is present, Stella grants Sei 10% skill cooldown reduction (does not affect initial cooldown time). Favorite Drink: When buffed by a Bleeding Jane, the passive effect only requires #2 attacks to trigger. Active: Increase damage by #3 for #4 seconds.",
				number_of_stats: 4,
				stat1: [20, 20, 20, 20, 18, 18, 18, 16, 16, 16],
				stat2: [14, 14, 14, 14, 12, 12, 12, 10, 10, 10],
				stat3: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
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
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Friend's Armor"],
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
			id: 1021,
			name: "Alma",
			type: "MG",
			rarity: 1,
			max_hp: 195,
			max_dmg: 89,
			max_acc: 31,
			max_eva: 23,
			max_rof: 129,
			skill: {
				name: "Love and Dreams",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description: "Summon two drones that each deal #1 damage per hit for #2 seconds. Favorite Drink: when buffed by a Brandtini, drones last 1 second longer.",
				number_of_stats: 4,
				stat1: ["20%", "22%", "24%", "27%", "29%", "31%", "33%", "36%", "38%", "40%"],
				stat2: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4]
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
				hasAttack2Animation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Middle School Adventure"],
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
			id: 1022,
			name: "Dana",
			type: "SG",
			rarity: 1,
			max_hp: 269,
			max_dmg: 38,
			max_acc: 15,
			max_eva: 13,
			max_rof: 26,
			max_armor: 22,
			skill: {
				name: "Crimson Geyser",
				initial_cooldown: "8s",
				cooldown: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
				description:
					"Jump up and pound the ground to create a big explosion, dealing #1 damage to enemies within a radius of 2 and knocking them back. Every point of armor increases the damage by 1%. Favorite Drink: When buffed by a Big Beer, gain 0.5 point of shield HP per point of armor. Normal attack: Launch an exploding rocket punch that deals #2 damage to a single target with a #3 knockback chance (does not stack with slug ammo).",
				number_of_stats: 3,
				stat1: ["1.2x", "1.27x", "1.33x", "1.4x", "0.9x", "0.9x", "1x", "1.1x", "1.1x", "1.2x"],
				stat2: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat3: ["0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x", "0.53x", "0.57x", "0.6x"]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 0, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
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
			number_of_skins: 1,
			skin_names: ["Red Comet"],
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
			id: 1023,
			name: "Henrietta",
			type: "SMG",
			rarity: 1,
			max_hp: 190,
			max_dmg: 30,
			max_acc: 15,
			max_eva: 83,
			max_rof: 93,
			skill: {
				name: "Full Moon Protector",
				initial_cooldown: "4s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					'Passive: Gain a 10-HP shield at the start of battle, lasting for 8s. When shielded, obtain a stack of "Damage Mark" every 2s, up to a maximum of 3 stacks. Each "Damage mark" stack increases her damage by #1 for #2. When not shielded, obtain a stack of "Evasion Mark" every 2s, up to a maximum of 3 stacks. Each "Evasion Mark" stack increases her evasion by #3 for #4. Active: Gain a +10 HP shield for 8s. For every stack of "Damage Mark", increase rate of fire by #5; for every stack of "Evasion Mark", gain an additional #6 HP shield. Effects last for #7.',
				number_of_stats: 7,
				stat1: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat5: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat6: ["+6", "+7", "+8", "+9", "+10", "+11", "+12", "+13", "+14", "+15"],
				stat7: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 0],
				row2: [1, 1, 0],
				row3: [1, 2, 0],
				targets: "Buffs AR and SMG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
				stat2: ["12%", "20%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasActionAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Luna's Vacation"],
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
			id: 1024,
			name: "Rico",
			type: "RF",
			rarity: 1,
			max_hp: 80,
			max_dmg: 130,
			max_acc: 80,
			max_eva: 33,
			max_rof: 37,
			skill: {
				name: "Tower of Tisiphone",
				initial_cooldown: "4s",
				cooldown: [12, 11.8, 11.6, 11.3, 11.1, 10.9, 10.7, 10.4, 10.2, 10],
				passive_active_description: true,
				description:
					"Passive: Obtain a Tarot Card every 3 attacks, up to a maximum of 3 Tarot Cards. Each Tarot Card increases her damage by #1 for #2. Active: Consume all Tarot Cards and fire a shot that will not miss, dealing #3 damage to the furthest target and possible critical damage. Additionally, deal additional damage to enemies within a 1-unit radius around the target. The additional damage is equal to #4 the number of Tarot Cards consumed, up to a maximum of #5 damage.",
				number_of_stats: 5,
				stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				stat3: ["2x", "2.1x", "2.2x", "2.3x", "2.4x", "2.6x", "2.7x", "2.8x", "2.9x", "3x"],
				stat4: ["0.3x", "0.32x", "0.34x", "0.37x", "0.39x", "0.41x", "0.43x", "0.46x", "0.48x", "0.5x"],
				stat5: ["0.9x", "0.96x", "1.02x", "1.11x", "1.17x", "1.23x", "1.29x", "1.38x", "1.44x", "1.5x"]
			},
			tile_set: {
				row1: [2, 0, 0],
				row2: [1, 0, 0],
				row3: [1, 1, 0],
				targets: "Buffs HG",
				number_of_stats: 1,
				stat1: ["Reduces Skill CD by "],
				stat2: ["18%"]
			},
			animations: {
				hasSkillAnimation: false,
				hasActionAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Freestyle Diner"],
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
			id: 1025,
			name: "Triela",
			type: "SG",
			rarity: 1,
			max_hp: 253,
			max_dmg: 35,
			max_acc: 11,
			max_eva: 11,
			max_rof: 26,
			max_armor: 21,
			skill: {
				name: "Puppet Trick",
				initial_cooldown: "8s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				passive_active_description: true,
				description:
					"Passive: When there is an enemy unit within a 2-unit distance, switch to using a bayonet to deal 2x damage to the nearest target. In this state, no ammo is consumed and rate of fire increases by #1 (this passive will not take effect when using Slug ammo). If there are no enemy units within a 2-unit distance, increase maximum hit targets by 1. Active: Increase damage by #2 and movement speed by #3 for #4.",
				number_of_stats: 4,
				stat1: ["30%", "32%", "34%", "37%", "39%", "41%", "43%", "46%", "48%", "50%"],
				stat2: ["30%", "36%", "41%", "47%", "52%", "58%", "63%", "69%", "74%", "80%"],
				stat3: [3, 3, 3, 4, 4, 4, 5, 5, 5, 6],
				stat4: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8]
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 1, 2],
				row3: [1, 0, 0],
				targets: "Buffs MG",
				number_of_stats: 2,
				stat1: ["Damage by ", "Accuracy by "],
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
			number_of_skins: 1,
			skin_names: ["Shadow Operations"],
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
			id: 1026,
			name: "Claes",
			type: "MG",
			rarity: 1,
			max_hp: 157,
			max_dmg: 79,
			max_acc: 35,
			max_eva: 36,
			max_rof: 139,
			skill: {
				name: "Thinker's Key",
				initial_cooldown: "0s",
				cooldown: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
				passive_active_description: true,
				description:
					'Passive: While in Charging Mode, this unit cannot perform normal attacks. For every 2s after a battle has begun, obtain a Charge up to a maximum of 5 Charges. Each Charge increases her damage by #1. Active: Enter Attack Mode. After Attack Mode expires, reload and remove all damage buff from Charging mode, then re-enter Charging Mode. When equipped with "Spectacles", Charging Mode grants 8-HP shields to all allied units in front of her for 5 seconds, up to a maximum of 3 stacks. When equipped with "Meteorite", Charging Mode increases all allies\' damage by 5% for 5 seconds, up to a maximum of 3 stacks. When equipped with "Wristwatch", Charging Mode grants her 1 extra ammo.',
				number_of_stats: 1,
				stat1: ["16%", "17%", "18%", "19%", "20%", "21%", "22%", "23%", "24%", "25%"]
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
				hasSkillAnimation: true,
				hasActionAnimation: true,
				hasVictoryLoopAnimation: true
			}
		},
		mod: null,
		skins: {
			number_of_skins: 1,
			skin_names: ["Garden's Morning Breeze"],
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
			id: 1027,
			name: "Angelica",
			type: "AR",
			rarity: 1,
			max_hp: 121,
			max_dmg: 55,
			max_acc: 57,
			max_eva: 46,
			max_rof: 75,
			skill: {
				name: "Extreme Shooting",
				initial_cooldown: "4s",
				cooldown: [16, 15.6, 15.1, 14.7, 14.2, 13.8, 13.3, 12.9, 12.4, 12],
				passive_active_description: true,
				description:
					"Passive: Increase damage by 12% at the start of battle. This buff gradually decays by 4% every 2s, and is completely removed after 6s. The buff will refresh itself every 10s. Active: Sacrifice #1 of accuracy to increase rate of fire to a fixed 150 for #2.",
				number_of_stats: 2,
				stat1: ["40%", "36%", "31%", "27%", "22%", "18%", "13%", "9%", "4%", "0%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5]
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs AR and SMG",
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
		skins: {
			number_of_skins: 1,
			skin_names: ["Excursion Surprise"],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true]
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false]
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
];
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// END OF EXTRAS #1000-#1050 JSON DATA /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for EXTRAS #1000-#1050 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for EXTRAS #1000-#1050 T-Doll Index JSON.");

export default tdolls;
