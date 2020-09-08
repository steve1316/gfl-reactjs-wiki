/*
    This array of T-Dolls will contain information about index #1 to #50 in JSON format. Some things to note:
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
			},
			skill2: {
				name: "Duel Survivor",
				initial_cooldown: "Passive",
				description: "Increase all allies' rate of fire and accuracy by #1 for every #2 seconds that SAA is alive in battle. Max 3 stacks.",
				number_of_stats: 2,
				stat1: ["3%", "3%", "3%", "4%", "4%", "4%", "5%", "5%", "5%", "5%"],
				stat2: [6, 5.8, 5.6, 5.3, 5.1, 4.9, 4.7, 4.4, 4.2, 4],
				image_skill: undefined
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
			skin_names: ["Wish Upon A Star", "Queen of Miracle"],
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
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4],
				image_skill: undefined
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
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4],
				image_skill: undefined
			},
			skill2: {
				name: "Desperate Sharpshooter",
				initial_cooldown: "Passive",
				description: "After launching a smoke grenade, the next 7 attacks will strike targets starting from the furthest to the closest. Every hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["150%", "156%", "161%", "167%", "172%", "178%", "183%", "189%", "194%", "200%"],
				image_skill: undefined
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
			skin_names: ["Night Dancer"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat1: [1.6, 1.8, 2, 2.1, 2.3, 2.5, 2.7, 2.8, 3, 3.2],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
					"Passive: Whenever Python receives damage/rate of fire/evasion/accuracy/crit rate (including Fairies) skill buffs, increase the corresponding stats of allies on her tiles by #1 for 3 seconds. Active: The next six attacks will have a #2 chance of increasing self damage by #3 for #4 seconds. Max 6 stacks.",
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
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
				stat4: [3, 3.2, 3.4, 3.6, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
			},
			skill2: {
				name: "Seven Note Cadenza",
				initial_cooldown: "Passive",
				description: "Reloads after every 7 attacks. The first attack after reloading will increase all allies' damage and accuracy by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4],
				image_skill: undefined
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
			skin_names: ["Starry Reins"],
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			skin_names: ["A Couple's Journey", "Griffon Dancer"],
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
				hasSit2Animation: [false, true],
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
					"Passive: When equipped with \"Stechkin Exclusive Stock\", increases allies' damage by 4% for the same skill duration. Active: Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["12%", "13%", "14%", "15%", "16%", "17%", "18%", "19%", "20%", "22%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
					"Passive: When equipped with \"Stechkin Exclusive Stock\", increases allies' damage by 4% for the same skill duration. Active: Increases all allies' rate of fire by #1 for #2 seconds.",
				number_of_stats: 2,
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
				stat5: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
			skin_names: ["Miss Camellia's Special Service"],
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
				stat2: [4, 4, 4, 5, 5, 5, 5, 6, 6, 6],
				image_skill: undefined
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
			skin_names: ["Pumpkin Mishka", "A Certain Unscientific Sunflower"],
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
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15],
				image_skill: undefined
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
			skin_names: ["High Sorceress Apprentice"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat3: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			skin_names: ["Mach Tempest"],
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
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat2: [8, 9, 10, 11, 12, 12, 13, 13, 14, 15],
				image_skill: undefined
			},
			skill2: {
				name: "Night Sky Pursuer",
				initial_cooldown: "Passive",
				description: 'When "Flare" has been launched, grants allies #1 ammo to their current clip, additionally increases allies\' critical damage by #2 for #3 seconds.',
				number_of_stats: 3,
				stat1: ["+1", "+1", "+1", "+1", "+1", "+2", "+2", "+2", "+2", "+2"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat3: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: false,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
			skin_names: ["Astra's Swimming Pool Float"],
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
				stat2: [5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
				image_skill: undefined
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
				stat1: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4],
				image_skill: undefined
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
			skin_names: ["Demon Huntress"],
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
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"],
				image_skill: undefined
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
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5],
				image_skill: undefined
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
			skin_names: ["Kitty Paws", "Love is Blind"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true, true],
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
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
			skin_names: ["Moment of Vows"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
				hasVictoryLoopAnimation: [false],
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
				stat1: ["2x", "2.4x", "2.9x", "3.3x", "3.8x", "4.2x", "4.7x", "5.1x", "5.6x", "6x"],
				image_skill: undefined
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
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15],
				image_skill: undefined
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
				stat1: ["1.8x", "2.2x", "2.6x", "3x", "3.4x", "3.9x", "4.3x", "4.7x", "5.1x", "5.5x"],
				image_skill: undefined
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
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5],
				image_skill: undefined
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
			skin_names: ["Thumbelina"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat1: [1.5, 1.7, 1.8, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3],
				image_skill: undefined
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Critical Hit Rate by "],
				stat2: ["40%", "20%"]
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
				stat1: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4],
				image_skill: undefined
			},
			skill2: {
				name: "Immaterial Defense",
				initial_cooldown: "Passive",
				description: 'When "Force Shield" expires, increases evasion by #1 for #2 seconds for every enemy group present, up to 3 layers.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: [5, 5.3, 5.7, 6, 6.3, 6.7, 7, 7.3, 7.7, 8],
				image_skill: undefined
			},
			tile_set: {
				row1: [1, 0, 0],
				row2: [0, 2, 0],
				row3: [1, 0, 0],
				targets: "Buffs AR and RF",
				number_of_stats: 2,
				stat1: ["Accuracy by ", "Critical Hit Rate by "],
				stat2: ["45%", "20%"]
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
			skin_names: ["Nocturnal Familiar", "Sleepless Begonias", "A Small Step", "Vietnamese Balm"],
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
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5],
				image_skill: undefined
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
			skin_names: ["Crimson Starlet"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat4: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			skin_names: ["Lollipop Ammo"],
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
				stat1: ["2x", "2.4x", "2.9x", "3.3x", "3.8x", "4.2x", "4.7x", "5.1x", "5.6x", "6x"],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat1: ["2.2x", "2.7x", "3.2x", "3.6x", "4.1x", "4.6x", "5.1x", "5.5x", "6x", "6.5x"],
				image_skill: undefined
			},
			skill2: {
				name: "Valiant Shield",
				initial_cooldown: "6s",
				cooldown: [20, 19.6, 19.1, 18.7, 18.2, 17.8, 17.3, 16.9, 16.4, 16],
				description: "6 seconds after the battle begins, deploys a damage reducing shield in front of her that reduces all incoming damage by #1, lasting for #2 seconds.",
				number_of_stats: 2,
				stat1: ["20%", "22%", "23%", "25%", "27%", "28%", "30%", "31%", "33%", "35%"],
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			skin_names: ["Reciprocated Love"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat1: [1.8, 2, 2.1, 2.3, 2.4, 2.6, 2.7, 2.9, 3, 3.2],
				image_skill: undefined
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
				stat1: [2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4],
				image_skill: undefined
			},
			skill2: {
				name: "Scarlet Flame Pursuit",
				initial_cooldown: "Passive",
				description:
					"When a flashbang has been tossed, throw an additional incendiary grenade that deals #1 damage to enemies within a radius of 2.5 units and ignites them, dealing #2 continuous damage to them every 0.33 seconds for #3 seconds.",
				number_of_stats: 3,
				stat1: ["1.4x", "1.56x", "1.71x", "1.87x", "2.02x", "2.18x", "2.33x", "2.49x", "2.64x", "2.8x"],
				stat2: ["0.3x", "0.33x", "0.37x", "0.4x", "0.43x", "0.47x", "0.5x", "0.53x", "0.57x", "0.6x"],
				stat3: [2, 2.2, 2.4, 2.7, 2.9, 3.1, 3.3, 3.6, 3.8, 4],
				image_skill: undefined
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
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5],
				image_skill: undefined
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
			images: {
				card: undefined,
				card_damaged: undefined,
				full: undefined,
				full_damaged: undefined
			},
			animations: {
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat3: [2, 2.4, 2.7, 3, 3.4, 3.7, 4, 4.3, 4.7, 5],
				image_skill: undefined
			},
			skill2: {
				name: "Burning Chain",
				initial_cooldown: "Passive",
				description:
					"Incendiary grenade deals an additional #1 damage every 1.5 seconds to burned enemies and will spread around the burned enemy, causing a new burning area with a radius of 1 unit. This lasts until the effect of the incendiary grenade ends. Burn damage will take effect against enemies in an extremely small area.",
				number_of_stats: 1,
				stat1: ["0.4x", "0.44x", "0.49x", "0.53x", "0.58x", "0.62x", "0.67x", "0.71x", "0.76x", "0.8x"],
				image_skill: undefined
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
			skin_names: ["Woken-up Idiot"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat3: [2.5, 2.7, 2.8, 3, 3.2, 3.3, 3.5, 3.7, 3.8, 4],
				image_skill: undefined
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
			skin_names: ["Candy Express"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"],
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
			skin_names: ["Beach Princess"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat2: [9, 9.7, 10.3, 11, 11.7, 12.3, 13, 13.7, 14.3, 15],
				image_skill: undefined
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
			skin_names: ["Red Plums and White Snow"],
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
				stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"],
				image_skill: undefined
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
			skin_names: ["Classic Witch", "O Holy Night", "Queen in Radiance", "Stirring Mermaid"],
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
				hasVictoryLoopAnimation: false,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
			},
			skill2: {
				name: "Clear Fighting Spirit",
				initial_cooldown: "Passive",
				description: 'When "Damage Focus" is active, increases critical damage by #1 for #2 seconds.',
				number_of_stats: 2,
				stat1: ["5%", "6%", "6%", "7%", "7%", "8%", "8%", "9%", "9%", "10%"],
				stat2: [4, 4.2, 4.4, 4.7, 4.9, 5.1, 5.3, 5.6, 5.8, 6],
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
			skin_names: ["Xmas Parade"],
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
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"],
				image_skill: undefined
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
			skin_names: ["Xmas At Home"],
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
				stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"],
				image_skill: undefined
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
				stat2: ["3.2x", "3.6x", "3.9x", "4.3x", "4.7x", "5x", "5.4x", "5.8x", "6.1x", "6.5x"],
				image_skill: undefined
			},
			skill2: {
				name: "Pure White Reaper",
				initial_cooldown: "Passive",
				description:
					'Every enemy unit that she kills, increases her damage by #1 for 3 seconds (kills refresh this effect). Every enemy unit killed by her "Designated Shot" skill increases her rate of fire by #2 for 5 seconds.',
				number_of_stats: 2,
				stat1: ["10%", "11%", "12%", "13%", "14%", "16%", "17%", "18%", "19%", "20%"],
				stat2: ["15%", "17%", "18%", "20%", "22%", "23%", "25%", "27%", "28%", "30%"],
				image_skill: undefined
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
			skin_names: ["Moonlit Ocean", "White Steel Edge"],
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
				stat2: ["2.5x", "2.3x", "2.6x", "2.8x", "3.1x", "3.4x", "3.7x", "3.9x", "4.2x", "5x"],
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
				hasSkillAnimation: true,
				hasVictoryLoopAnimation: true,
				attack: undefined,
				die: undefined,
				move: undefined,
				skill: undefined,
				victory: undefined,
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
				stat2: ["3.2x", "3.6x", "4x", "4.5x", "4.9x", "5.3x", "5.7x", "6.2x", "6.6x", "7x"],
				image_skill: undefined
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
			skin_names: ["Romantic Mission"],
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
			skin_names: ["Winter Fairy"],
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
				stat2: ["2.8x", "3.1x", "3.4x", "3.7x", "4x", "4.3x", "4.6x", "4.9x", "5.2x", "5.5x"],
				image_skill: undefined
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
				stat2: ["3x", "3.3x", "3.7x", "4x", "4.3x", "4.7x", "5x", "5.3x", "5.7x", "6x"],
				image_skill: undefined
			},
			skill2: {
				name: "Shadowy Savior",
				initial_cooldown: "Passive",
				passive_active_description: true,
				description:
					'Passive: Enter camouflage mode after staying still for 3 seconds, and increases self accuracy and rate of fire by #1. Active: Using "Interdiction Shot" when in camouflage mode increases skill damage by #2 and removes camouflage.',
				number_of_stats: 2,
				stat1: ["5%", "5%", "6%", "6%", "6%", "7%", "7%", "7%", "8%", "8%"],
				stat2: ["10%", "11%", "12%", "13%", "14%", "14%", "15%", "16%", "17%", "18%"],
				image_skill: undefined
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
			skin_names: ["Waitress", "Piercing the Heart"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true, true],
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
				stat2: ["1.5x", "1.7x", "1.9x", "2.2x", "2.4x", "2.6x", "2.8x", "3.1x", "3.3x", "3.5x"],
				image_skill: undefined
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
			skin_names: ["Roses in Hand"],
			skin_images: [],
			skin_images_full: [],
			animations: {
				hasSkillAnimation: [true],
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
				stat3: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
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
			skin_names: ["Haunted Castle", "Date in the Snow", "Ballroom Interlude", "Op. Manta Ray"],
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
				hasActionAnimation: [false, false, false, true],
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
				stat2: [3, 3.2, 3.4, 3.7, 3.9, 4.1, 4.3, 4.6, 4.8, 5],
				image_skill: undefined
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
			skin_names: ["Huntress' Frock", "Lifelong Protector", "Onion Shooter"],
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
	}
];

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for #1-#50 T-Doll Index JSON.");

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
	if (id === 1) {
		// So far, only SAA has the victory2 animation.
		tdoll.normal.animations.victory2 = require(`../images/tdolls/${id}/animations/${id}_normal_victory2.gif`);
	}
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

console.log("Finished processing images and animations for #1-#50 T-Doll Index JSON.");

module.exports = tdolls;
