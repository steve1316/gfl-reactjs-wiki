/*
    This array of T-Dolls will contain information about each one in JSON format. Some things to note:
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
				stat1: ["20%", "22%", "24%", "25%", "27%", "29%", "31%", "32%", "34%", "36%"],
				stat2: ["28%", "30%", "32%", "34%", "36%", "37%", "39%", "41%", "43%", "45%"],
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
				description: "Throws a flashbang that stuns enemies within a 2.5 unit radius for #1 seconds",
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
			max_hp: 70,
			max_dmg: 34,
			max_acc: 46,
			max_eva: 96,
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
				stat1: ["15%", "16%", "17%", "18%", "19%", "21%", "22%", "23%", "24%", "25%"],
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
			id: 7,
			name: "Stechkin Mod",
			type: "HG",
			rarity: 5,
			max_hp: 83,
			max_dmg: 31,
			max_acc: 49,
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
				hasSkillAnimation: [false, false],
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
	}
];

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for JSON.");

// Programmatically populate the images and animation properties inside the JSON before exporting it.
tdolls.forEach((tdoll) => {
	var id = tdoll.normal.id;

	//////////// Populate images for Normal. ////////////
	tdoll.normal.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
	tdoll.normal.images.card = require(`../images/tdolls/${id}/${id}_card.png`);
	tdoll.normal.images.card_damaged = require(`../images/tdolls/${id}/${id}_card_damaged.png`);
	tdoll.normal.images.full = require(`../images/tdolls/${id}/${id}_full.png`);
	tdoll.normal.images.full_damaged = require(`../images/tdolls/${id}/${id}_full_damaged.png`);

	//////////// Populate animations for Normal. ////////////
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

	tdoll.normal.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_lying.gif`);
	tdoll.normal.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_move.gif`);
	tdoll.normal.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_pick.gif`);
	tdoll.normal.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_sit.gif`);
	tdoll.normal.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_wait.gif`);

	if (tdoll.mod !== null) {
		//////////// Populate images for Mod ////////////
		tdoll.mod.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
		tdoll.mod.skill2.image_skill = require(`../images/tdolls/${id}/${id}_skill2.png`);
		tdoll.mod.images.card = require(`../images/tdolls/${id}/${id}_mod_card.png`);
		tdoll.mod.images.card_damaged = require(`../images/tdolls/${id}/${id}_mod_card_damaged.png`);
		tdoll.mod.images.full = require(`../images/tdolls/${id}/${id}_mod_full.png`);
		tdoll.mod.images.full_damaged = require(`../images/tdolls/${id}/${id}_mod_full_damaged.png`);

		//////////// Populate animations for Mod ////////////
		tdoll.mod.animations.attack = require(`../images/tdolls/${id}/animations/${id}_mod_attack.gif`);
		tdoll.mod.animations.die = require(`../images/tdolls/${id}/animations/${id}_mod_die.gif`);
		tdoll.mod.animations.move = require(`../images/tdolls/${id}/animations/${id}_mod_move.gif`);
		if (tdoll.mod.animations.hasSkillAnimation) {
			tdoll.mod.animations.skill = require(`../images/tdolls/${id}/animations/${id}_mod_skill.gif`);
		}
		tdoll.mod.animations.victory = require(`../images/tdolls/${id}/animations/${id}_mod_victory.gif`);
		tdoll.mod.animations.victoryloop = require(`../images/tdolls/${id}/animations/${id}_mod_victoryloop.gif`);
		tdoll.mod.animations.wait = require(`../images/tdolls/${id}/animations/${id}_mod_wait.gif`);

		tdoll.mod.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_lying.gif`);
		tdoll.mod.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_move.gif`);
		tdoll.mod.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_pick.gif`);
		tdoll.mod.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_sit.gif`);
		tdoll.mod.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_wait.gif`);
	}

	if (tdoll.skins !== null) {
		var skinSelected = 1;
		for (var i = 0; skinSelected <= tdoll.skins.number_of_skins; i++) {
			//////////// Populate images for Skin(s) ////////////
			tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card.png`));
			tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card_damaged.png`));

			tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full.png`));
			tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full_damaged.png`));

			//////////// Populate animations for Skin(s) ////////////
			tdoll.skins.animations.attack[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_attack.gif`);
			tdoll.skins.animations.die[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_die.gif`);
			tdoll.skins.animations.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_move.gif`);
			if (tdoll.skins.animations.hasSkillAnimation[i]) {
				// Some T-Dolls have skill animations, some do not.
				tdoll.skins.animations.skill[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_skill.gif`);
			}
			tdoll.skins.animations.victory[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victory.gif`);
			tdoll.skins.animations.victoryloop[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victoryloop.gif`);
			tdoll.skins.animations.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_wait.gif`);

			tdoll.skins.animations_dorm.lying[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_lying.gif`);
			tdoll.skins.animations_dorm.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_move.gif`);
			if (tdoll.skins.animations_dorm.hasActionAnimation[i]) {
				// Some T-Dolls have action animations for one of their skins, some do not.
				tdoll.skins.animations_dorm.action[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_action.gif`);
			}
			tdoll.skins.animations_dorm.pick[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_pick.gif`);
			tdoll.skins.animations_dorm.sit[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit.gif`);
			if (tdoll.skins.animations_dorm.hasSit2Animation[i]) {
				// Some T-Dolls have a second sit animation for one of their skins, some do not.
				tdoll.skins.animations_dorm.sit2[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit2.gif`);
			}
			tdoll.skins.animations_dorm.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_wait.gif`);

			skinSelected++;
		}
	}
});

console.log("Finished processing images and animations for JSON.");

module.exports = tdolls;
