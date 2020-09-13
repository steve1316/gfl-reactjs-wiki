/*
    This array of T-Dolls will contain information about index #51 to #100 in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
	- If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- Likewise, if T-Doll has no skins, skins property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

	- TODO: Include exclusive equipment for Mods.
*/

const tdolls = [
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
			},
			skill2: {
				name: "Cold Fighting Spirit",
				initial_cooldown: "Passive",
				description: 'Whenever "Damage Focus" is active, increases rate of fire by #1% for #2 seconds.',
				number_of_stats: 2,
				stat1: ["6%", "7%", "8%", "9%", "10%", "11%", "12%", "13%", "14%", "15%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Umbrella Daydream"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [true],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: ["3.5x", "4x", "4.5x", "5x", "5.5x", "6x", "6.5x", "7x", "7.5x", "8x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: ["5x", "5.6x", "6.2x", "6.7x", "7.3x", "7.8x", "8.4x", "8.9x", "9.5x", "10x"],
				image_skill: undefined
			},
			skill2: {
				name: "Chain Reaction",
				initial_cooldown: "Passive",
				passive_passive_description: true,
				description:
					'Passive 1: When "Hunter\'s Mania" kills an enemy, activate skill again and gain 3 charge stacks. Can activate up to 3 times. The additional skill uses incurs no aiming time and do not gain bonus DMG from charge stacks, dealing #1 damage that can miss. Priorities enemy with the lowest HP that can be killed in one shot. Passive 2: Increases DMG of normal attacks and skill by 10% when attacking enemies with more than 50% HP.',
				number_of_stats: 1,
				stat1: ["2.5x", "2.7x", "2.9x", "3x", "3.2x", "3.4x", "3.5x", "3.7x", "3.9x", "4x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 4,
			skin_names: ["Reindeer", "Op. Blazing Sun", "Aristocraft Experience Service", "Black Iron Heart"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, true, false, false],
				hasVictoryLoopAnimation: [true, true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, true, false, false],
				hasSit2Animation: [false, false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["One Who Shows the Way", "One-Eyed Rabbit Knight"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10],
				image_skill: undefined
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Hit Rate by "],
				stat2: ["18%", "30%"]
			},
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10],
				image_skill: undefined
			},
			skill2: {
				name: "Seal of the Avenger",
				initial_cooldown: "Passive",
				description:
					'When "Damage Focus T" is active, apply Seal of the Avenger to the current target. In addition, once 3 or less allies are on the field, reduces self rate of fire by 70% and regular attacks do #1 damage, with an additional 100% splash damage to all targets within 2.5 units. This splash damage also applies Seal of the Avenger. ("Damage Focus T" is still in effect during this time).',
				number_of_stats: 1,
				stat1: ["300%", "333%", "367%", "400%", "433%", "467%", "500%", "533%", "567%", "600%"],
				image_skill: undefined
			},
			tile_set: {
				row1: [0, 1, 1],
				row2: [0, 2, 1],
				row3: [0, 1, 1],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Damage by ", "Critical Hit Rate by "],
				stat2: ["20%", "32%"]
			},
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Determiner of Time", "A Girl's Hot Air Balloon Adventure"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: ["5x", "5.8x", "6.6x", "7.3x", "8.1x", "8.9x", "9.7x", "10.4x", "11.2x", "12x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat1: ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"],
				image_skill: undefined
			},
			skill2: {
				name: "Hysterical Circus",
				initial_cooldown: "Passive",
				description:
					"Her Anti-Personnel Grenade splits into 3 smaller grenades on explosion (prioritizes enemies marked with the Seal of the Avenger). Each smaller grenade deals #1 damage to enemies within 1 yard and does an extra #2 damage to enemies marked with the Seal of the Avenger.",
				number_of_stats: 2,
				stat1: ["70%", "83%", "97%", "110%", "123%", "137%", "150%", "163%", "177%", "190%"],
				stat2: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Cocktail Party Exterminator", "The Guarded Beloved"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15],
				image_skill: undefined
			},
			skill2: {
				name: "Crime and Punishment",
				initial_cooldown: "Passive",
				description: 'Attack with both weapons during "Assault Focus"\'s activation. The secondary weapon will deal #1 damage, doubled to #2 against targets marked with the Seal of the Avenger.',
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: ["10%", "12%", "12%", "14%", "14%", "16%", "16%", "18%", "18%", "20%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 3,
			skin_names: ["Literary Girl", "Dreamscape Prisoner", "Top Hat Drifting to the Flowers"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Lord of War"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Lily of the Valley"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6],
				image_skill: undefined
			},
			skill2: {
				name: "Belief",
				initial_cooldown: "Passive",
				description: "Upon receiving any type of damage buff (including fairy skills and talents), grants self perfect accuracy for #1 seconds.",
				number_of_stats: 1,
				stat3: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Fireworks of Dreams"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: ["1.8/0.7/0.4x", "2.1/0.8/0.5x", "2.4/0.9/0.5x", "2.7/1.1/0.6x", "3/1.2/0.7x", "3.3/1.3/0.7x", "3.6/1.4/0.8x", "3.9/1.7/0.9x", "4.2/1.8/0.9x", "4.5/1.8/1x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"],
				image_skill: undefined
			},
			skill2: {
				name: "Firestorm",
				initial_cooldown: "Passive",
				description:
					"Base grenade damage increased by #1, and will explode 3 times, dealing damage to enemies on the edges of the 1, 2.5 and 4 explosions radius. Enemies will receive multiple hits when standing in overlapping areas.",
				number_of_stats: 1,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
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
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Beach Punk 2062"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: ["4x", "4.7x", "5.3x", "6x", "6.7x", "7.3x", "8x", "8.7x", "9.3x", "10x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat1: ["5x", "5.8x", "6.6x", "7.3x", "8.1x", "8.9x", "9.7x", "10.4x", "11.2x", "12x"],
				image_skill: undefined
			},
			skill2: {
				name: "Freezing Point of Bravery",
				initial_cooldown: "Passive",
				description:
					"Upon launching her grenade, have 1 of 2 effects happen depending on how much HP her targets have. If targets have over 50% HP, applies a stun effect that lasts #1 seconds. If targets have under 50% HP, her grenade will deal an extra #2 damage.",
				number_of_stats: 2,
				stat1: ["0.8", "0.9", "1.0", "1.1", "1.2", "1.2", "1.3", "1.4", "1.5", "1.6"],
				stat2: ["1.6x", "1.87x", "2.13x", "2.4x", "2.67x", "2.93x", "3.2x", "3.47x", "3.73x", "4x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Battlefield Patissier"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [6, 6.4, 6.8, 7.2, 7.6, 8, 8.4, 8.8, 9.4, 10],
				image_skill: undefined
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
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 6,
			skin_names: ["Petit Waitress", "Bartender", "Pure White Cornflower", "Fifty Days with G36", "Every Child's Christmas Dream", "Moonlit Wishes"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false, false, false],
				hasSit2Animation: [false, false, false, false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: ["6x", "7x", "8x", "9x", "10x", "11x", "12x", "13x", "14x", "15x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat1: ["6x", "7.1x", "8.2x", "9.3x", "10.4x", "11.6x", "12.7x", "13.8x", "14.9x", "16x"],
				image_skill: undefined
			},
			skill2: {
				name: "Parasitic Grenade",
				initial_cooldown: "Passive",
				description:
					"If grenade kills the main target, cause a secondary explosion dealing #1 damage to enemies within a radius of 4 units. If grenade did not kill the main target, deal #2 damage every 0.33 seconds and increases damage dealt to the target by #3 for 3 seconds.",
				number_of_stats: 3,
				stat1: ["1.5x", "1.72x", "1.94x", "2.17x", "2.39x", "2.61x", "2.83x", "3.06x", "3.28x", "3.5x"],
				stat2: ["0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x", "0.53x", "0.57x", "0.6x"],
				stat3: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 3,
			skin_names: ["Starry Cocoon", "Black Cat's Gift", "Primrose-Flavored Foil Candy"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Scarlet Sage", "As One, Forever Entwined"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat1: ["2/0.8/0.4x", "2.1/0.8/0.5x", "2.7/1.1/0.5x", "3/1.2/0.6x", "3.3/1.3/0.7x", "3.7/1.5/0.7x", "4/1.6/0.8x", "4.3/1.7/0.9x", "4.7/1.9/0.9x", "5/2/1x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Guns N' Side Boxes", "Bird and Forest Whisperer"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Steal the Precious Candy", "Strawberry Cake and Cosmos Flower"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Night at the Bar"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [3, 3.4, 3.9, 4.3, 4.8, 5.2, 5.7, 6.1, 6.6, 7],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Funeral Array"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
			},
			skill2: {
				name: "Battlefield Witch",
				initial_cooldown: "Passive",
				description: "Self reload time is reduced to a fixed #1 seconds. After reloading, the first 3 bullets will have #2 increased damage (affects first volley).",
				number_of_stats: 2,
				stat1: [5.5, 5.4, 5.4, 5.3, 5.3, 5.2, 5.2, 5.1, 5.1, 5],
				stat2: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 3,
			skin_names: ["Bunny Girl", "Tender Nocturne", "The Christmas You Wished For"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				number_of_stats: 2,
				stat1: ["1.2x", "1.3x", "1.5x", "1.6x", "1.7x", "1.9x", "2x", "2.1x", "2.3x", "2.4x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Blazing Tarmac"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Arctic Fox", "Oborozukuyo"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Carmilla", "Partying Sweetheart"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [1, 1.6, 2.1, 2.7, 3.2, 3.8, 4.3, 4.9, 5.4, 6],
				image_skill: undefined
			},
			skill2: {
				name: "Shining Barrier",
				initial_cooldown: "Passive",
				description:
					'Every attack she does has a #1 chance to grant a #2 HP shield to dolls on her tiles, lasting for #3 seconds. While "Hunting Impulse" is active, increases the chance of granting a shield to 100%.',
				number_of_stats: 3,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [3, 3, 3, 3, 4, 4, 4, 4, 4, 5],
				stat3: [3, 3.3, 3.7, 4, 4.3, 4.7, 5, 5.4, 5.7, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Yellow Star-thistle", "My Lie in December"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: null
	},
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
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
				number_of_stats: 2,
				stat1: ["1.5x", "1.6x", "1.7x", "1.9x", "2x", "2.1x", "2.2x", "2.4x", "2.5x", "2.6x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: null
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
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Jade Peach Fairy"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 3,
			skin_names: ["Urban Holiday", "Full Moon's Gaze", "Springtime Lion Dance"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+3"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat3: ["+1", "+2", "+2", "+2", "+2", "+3", "+3", "+3", "+3", "+4"],
				stat4: [6, 6.2, 6.4, 6.7, 6.9, 7.1, 7.3, 7.6, 7.8, 8],
				image_skill: undefined
			},
			skill2: {
				name: "Disparity of the Strong",
				initial_cooldown: "Passive",
				description: "Increases accuracy by #1 and increases max ammo by +1 for every reload. Can be stacked up to 3 times.",
				number_of_stats: 1,
				stat1: ["5%", "6%", "7%", "8%", "9%", "11%", "12%", "13%", "14%", "15%"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Jack o'Three"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
			},
			skill2: {
				name: "Tidal Breach",
				initial_cooldown: "Passive",
				description: 'Upon activation of "Assault Suppression", increases the rate of fire of allies on her tile buffs by #1 for #2 seconds.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Boisterous Rogue", "Sunflower"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
			},
			skill2: {
				name: "Lightning Carnival",
				initial_cooldown: "Passive",
				description:
					'Start a battle with 3 bars of battery, each bar increasing rate of fire by #1 and damage by #2. Consumes 1 bar of battery every #3 seconds. When IDW uses "Cover Focus", battery replenishes back to 3.',
				number_of_stats: 3,
				stat1: ["6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%", "10%"],
				stat2: ["12%", "13%", "14%", "15%", "16%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [1.5, 1.6, 1.7, 1.9, 2.0, 2.1, 2.2, 2.4, 2.5, 2.6],
				image_skill: undefined
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [1, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Evasion by ", "Critical Hit Rate by "],
				stat2: ["20%", "10%"]
			},
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 3,
			skin_names: ["Cat in the Box", "Cloak and Cat Ears", "Daruma Cat Samurai"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false],
				hasVictoryLoopAnimation: [true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false],
				hasSit2Animation: [false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat1: [1.8, 2, 2.1, 2.3, 2.4, 2.6, 2.7, 2.9, 3, 3.2],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4],
				image_skill: undefined
			},
			skill2: {
				name: "Silencing Flash",
				initial_cooldown: "5s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "Thrown flashbang will also incur a #1 accuracy penalty to struck units which last for #2 seconds. Units that are immune to stuns are also affected.",
				number_of_stats: 1,
				stat1: ["25%", "27%", "28%", "30%", "32%", "33%", "35%", "37%", "38%", "40%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Witch from Afar", "Water Gown"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat3: [3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.4, 5.7, 6],
				image_skill: undefined
			},
			skill2: {
				name: "Almighty Combat Skills",
				initial_cooldown: "Passive",
				description:
					"If there are enemies directly in front of her, switch to attacking with an energy blade sending out waves of energy dealing 1x damage to all enemy units in the same lane as her. When \"Damage Focus N\" is active, attacks gain a piercing effect, dealing 1x damage to all enemies it passes through. Additionally perform one of two actions based on the enemies status: If they're armored and has the highest HP, fire a missile dealing #1 damage to the target and dealing #2 damage to enemies within a radius of 2 units. Splash damage is affected by armor. If they're unarmored, throw a cluster grenade which will deal #3 damage within a radius of 1 unit repeatedly up to 7 times. Repeated explosions on the same target will only deal #4 damage. Grenade damage can be evaded and is affected by armor.",
				number_of_stats: 4,
				stat1: ["0.6x", "0.7x", "0.8x", "0.9x", "1x", "1.1x", "1.2x", "1.3x", "1.4x", "1.5x"],
				stat2: ["0.2x", "0.23x", "0.27x", "0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x"],
				stat2: ["0.2x", "0.23x", "0.27x", "0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x"],
				stat2: ["0.1x", "0.115x", "0.135x", "0.15x", "0.165x", "0.185x", "0.2x", "0.215x", "0.235x", "0.25x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Lotus of the East Lake"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false],
				hasVictoryLoopAnimation: [true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false],
				hasSit2Animation: [false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
			}
		}
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 4,
			skin_names: ["Weekend Cop", "Transform! Teddy Bear!", "Starry Night Prom", "Rainy Starry Night"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
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
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
				stat5: [30, 33.3, 36.7, 40, 43.3, 46.7, 50, 53.3, 56.7, 60],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		selected: {},
		skins: {
			number_of_skins: 4,
			skin_names: ["Ace on Duty", "Concert Diva", "Housework Training", "The Warbler And The Rose"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Embracing Snowflakes", "Blue Lotus Night"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 4,
			skin_names: ["Impish Sweetheart", "Honey Sweet Flower", "Conveyed Feelings", "The Cats Song Announcement"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false, false, false],
				hasVictoryLoopAnimation: [true, true, true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false, false, false],
				hasSit2Animation: [false, false, false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
				victory2: undefined,
				victoryloop: undefined,
				wait: undefined
			},
			animations_dorm: {
				lying: undefined,
				move: undefined,
				pick: undefined,
				sit: undefined,
				wait: undefined
			}
		},
		mod: null,
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Pinky Swear", "Demonic Gunslinger"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [false, false],
				hasVictoryLoopAnimation: [true, true],
				attack: [],
				die: [],
				move: [],
				skill: [],
				victory: [],
				victoryloop: [],
				wait: []
			},
			animations_dorm: {
				hasActionAnimation: [false, false],
				hasSit2Animation: [false, false],
				lying: [],
				move: [],
				action: [],
				pick: [],
				sit: [],
				sit2: [],
				wait: []
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////
];

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for #51-#100 T-Doll Index JSON.");

// Programmatically populate the images and animation properties inside the JSON before exporting it.
tdolls.forEach((tdoll) => {
	var id = tdoll.normal.id;

	//console.log("Processing ", tdoll.normal.name);

	//////////// Images for Normal. ////////////
	tdoll.normal.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
	tdoll.normal.images.card = require(`../images/tdolls/${id}/${id}_card.png`);
	tdoll.normal.images.card_damaged = require(`../images/tdolls/${id}/${id}_card_d.png`);
	tdoll.normal.images.full = require(`../images/tdolls/${id}/${id}_full.png`);
	tdoll.normal.images.full_damaged = require(`../images/tdolls/${id}/${id}_full_d.png`);

	//////////// Animations for Normal. ////////////
	tdoll.normal.animations.attack = require(`../images/tdolls/${id}/animations/${id}_normal_attack.gif`);
	tdoll.normal.animations.die = require(`../images/tdolls/${id}/animations/${id}_normal_die.gif`);
	tdoll.normal.animations.move = require(`../images/tdolls/${id}/animations/${id}_normal_move.gif`);
	if (tdoll.normal.animations.hasSkillAnimation) {
		// Some T-Dolls have skill animations, some do not.
		tdoll.normal.animations.skill = require(`../images/tdolls/${id}/animations/${id}_normal_skill.gif`);
	}
	tdoll.normal.animations.victory = require(`../images/tdolls/${id}/animations/${id}_normal_victory.gif`);
	// if (id === 1) {
	// 	// So far, only SAA has the victory2 animation.
	// 	tdoll.normal.animations.victory2 = require(`../images/tdolls/${id}/animations/${id}_normal_victory2.gif`);
	// }
	if (tdoll.normal.animations.hasVictoryLoopAnimation) {
		// Certain older T-Dolls did not come with victoryloop animation as it was just the victory animation.
		tdoll.normal.animations.victoryloop = require(`../images/tdolls/${id}/animations/${id}_normal_victoryloop.gif`);
	}
	tdoll.normal.animations.wait = require(`../images/tdolls/${id}/animations/${id}_normal_wait.gif`);

	// Dorm animations
	tdoll.normal.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_lying.gif`);
	tdoll.normal.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_move.gif`);
	tdoll.normal.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_pick.gif`);
	tdoll.normal.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_sit.gif`);
	tdoll.normal.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_wait.gif`);

	if (tdoll.mod !== null) {
		//////////// Images for Mod ////////////
		tdoll.mod.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
		tdoll.mod.skill2.image_skill = require(`../images/tdolls/${id}/${id}_skill2.png`);
		tdoll.mod.images.card = require(`../images/tdolls/${id}/${id}_mod_card.png`);
		tdoll.mod.images.card_damaged = require(`../images/tdolls/${id}/${id}_mod_card_d.png`);
		tdoll.mod.images.full = require(`../images/tdolls/${id}/${id}_mod_full.png`);
		tdoll.mod.images.full_damaged = require(`../images/tdolls/${id}/${id}_mod_full_d.png`);

		//////////// Animations for Mod ////////////
		tdoll.mod.animations.attack = require(`../images/tdolls/${id}/animations/${id}_mod_attack.gif`);
		tdoll.mod.animations.die = require(`../images/tdolls/${id}/animations/${id}_mod_die.gif`);
		tdoll.mod.animations.move = require(`../images/tdolls/${id}/animations/${id}_mod_move.gif`);
		if (tdoll.mod.animations.hasSkillAnimation) {
			tdoll.mod.animations.skill = require(`../images/tdolls/${id}/animations/${id}_mod_skill.gif`);
		}
		tdoll.mod.animations.victory = require(`../images/tdolls/${id}/animations/${id}_mod_victory.gif`);
		tdoll.mod.animations.victoryloop = require(`../images/tdolls/${id}/animations/${id}_mod_victoryloop.gif`);
		tdoll.mod.animations.wait = require(`../images/tdolls/${id}/animations/${id}_mod_wait.gif`);

		// Dorm animations
		tdoll.mod.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_lying.gif`);
		tdoll.mod.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_move.gif`);
		tdoll.mod.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_pick.gif`);
		tdoll.mod.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_sit.gif`);
		tdoll.mod.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_wait.gif`);
	}

	if (tdoll.skins !== null) {
		var skinSelected = 1;
		for (var i = 0; skinSelected <= tdoll.skins.number_of_skins; i++) {
			//////////// Images for Skin(s) ////////////
			tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card.png`));
			tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card_d.png`));

			tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full.png`));
			tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full_d.png`));

			//////////// Animations for Skin(s) ////////////
			tdoll.skins.animations.attack[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_attack.gif`);
			tdoll.skins.animations.die[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_die.gif`);
			tdoll.skins.animations.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_move.gif`);
			if (tdoll.skins.animations.hasSkillAnimation[i]) {
				// Some T-Dolls have skill animations, some do not.
				tdoll.skins.animations.skill[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_skill.gif`);
			}
			tdoll.skins.animations.victory[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victory.gif`);
			if (tdoll.skins.animations.hasVictoryLoopAnimation[i]) {
				// Some skins do not have victoryloop animations.
				tdoll.skins.animations.victoryloop[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victoryloop.gif`);
			}
			tdoll.skins.animations.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_wait.gif`);

			// Dorm animations
			tdoll.skins.animations_dorm.lying[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_lying.gif`);
			tdoll.skins.animations_dorm.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_move.gif`);
			if (tdoll.skins.animations_dorm.hasActionAnimation[i]) {
				// Some T-Dolls have action animations for their skins, some do not.
				tdoll.skins.animations_dorm.action[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_action.gif`);
			}
			tdoll.skins.animations_dorm.pick[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_pick.gif`);
			tdoll.skins.animations_dorm.sit[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit.gif`);
			if (tdoll.skins.animations_dorm.hasSit2Animation[i]) {
				// Some T-Dolls have a second sit animation for their skins, some do not.
				tdoll.skins.animations_dorm.sit2[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit2.gif`);
			}
			tdoll.skins.animations_dorm.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_wait.gif`);

			skinSelected++; // Increment and loop through all available skins for this T-Doll.
		}
	}
});

console.log("Finished processing images and animations for #51-#100 T-Doll Index JSON.");

module.exports = tdolls;
