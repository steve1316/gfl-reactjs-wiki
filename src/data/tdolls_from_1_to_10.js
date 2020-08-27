/*
    This array of T-Dolls will contain information about each one in JSON format. Some things to note:
    - All stats are considered at max rank. For skill stats, I'm separating them for now.
    - If T-Doll has Mod, mod property will be populated. If not, mod property will be set to null.
	- number_of_stats in skill attribute dictates the amount of numbers from stat(1) to stat(n) to be replacing the "#(n)"" delimiters inside the skill description in sequential order.
	- Note: Depending on the T-Doll, whether Normal, Mod, or skin, sometimes they do not come with some animations like Victory2 and sometimes come with additional animations like Skill.

*/

const tdolls = [
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
				image_skill: require("../images/tdolls/1/1_skill1.png")
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
				card: require("../images/tdolls/1/1_card.png"),
				card_damaged: require("../images/tdolls/1/1_card_damaged.png"),
				full: require("../images/tdolls/1/1_full.png"),
				full_damaged: require("../images/tdolls/1/1_full_damaged.png")
			},
			animations: {
				attack: require("../images/tdolls/1/animations/1_normal_attack.gif"),
				die: require("../images/tdolls/1/animations/1_normal_die.gif"),
				move: require("../images/tdolls/1/animations/1_normal_move.gif"),
				victory: require("../images/tdolls/1/animations/1_normal_victory.gif"),
				victory2: require("../images/tdolls/1/animations/1_normal_victory2.gif"),
				victoryloop: require("../images/tdolls/1/animations/1_normal_victoryloop.gif"),
				wait: require("../images/tdolls/1/animations/1_normal_wait.gif")
			},
			animations_dorm: {
				lying: require("../images/tdolls/1/animations/1_normal_dorm_lying.gif"),
				move: require("../images/tdolls/1/animations/1_normal_dorm_move.gif"),
				pick: require("../images/tdolls/1/animations/1_normal_dorm_pick.gif"),
				sit: require("../images/tdolls/1/animations/1_normal_dorm_sit.gif"),
				wait: require("../images/tdolls/1/animations/1_normal_dorm_wait.gif")
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
				image_skill: require("../images/tdolls/1/1_skill1.png")
			},
			skill2: {
				name: "Duel Survivor",
				initial_cooldown: "Passive",
				description: "Increase all allies' rate of fire and accuracy by #1 for every #2 seconds that SAA is alive in battle. Max 3 stacks.",
				number_of_stats: 2,
				stat1: ["3%", "3%", "3%", "4%", "4%", "4%", "5%", "5%", "5%", "5%"],
				stat2: [6, 5.8, 5.6, 5.3, 5.1, 4.9, 4.7, 4.4, 4.2, 4],
				image_skill: require("../images/tdolls/1/1_skill2.png")
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
				card: require("../images/tdolls/1/1_mod_card.png"),
				card_damaged: require("../images/tdolls/1/1_mod_card_damaged.png"),
				full: require("../images/tdolls/1/1_mod_full.png"),
				full_damaged: require("../images/tdolls/1/1_mod_full_damaged.png")
			},
			animations: {
				attack: require("../images/tdolls/1/animations/1_mod_attack.gif"),
				die: require("../images/tdolls/1/animations/1_mod_die.gif"),
				move: require("../images/tdolls/1/animations/1_mod_move.gif"),
				victory: require("../images/tdolls/1/animations/1_mod_victory.gif"),
				victoryloop: require("../images/tdolls/1/animations/1_mod_victoryloop.gif"),
				wait: require("../images/tdolls/1/animations/1_mod_wait.gif")
			},
			animations_dorm: {
				lying: require("../images/tdolls/1/animations/1_mod_dorm_lying.gif"),
				move: require("../images/tdolls/1/animations/1_mod_dorm_move.gif"),
				pick: require("../images/tdolls/1/animations/1_mod_dorm_pick.gif"),
				sit: require("../images/tdolls/1/animations/1_mod_dorm_sit.gif"),
				wait: require("../images/tdolls/1/animations/1_mod_dorm_wait.gif")
			}
		},
		selected: {},
		skins: {
			number_of_skins: 2,
			skin_names: ["Wish Upon A Star", "Queen of Miracle"],
			skin_images: [
				require("../images/tdolls/1/1_skin1_card.png"),
				require("../images/tdolls/1/1_skin1_card_damaged.png"),
				require("../images/tdolls/1/1_skin2_card.png"),
				require("../images/tdolls/1/1_skin2_card_damaged.png")
			],
			skin_images_full: [
				require("../images/tdolls/1/1_skin1_full.png"),
				require("../images/tdolls/1/1_skin1_full_damaged.png"),
				require("../images/tdolls/1/1_skin2_full.png"),
				require("../images/tdolls/1/1_skin2_full_damaged.png")
			],
			animations: {
				attack: [require("../images/tdolls/1/animations/1_skin1_attack.gif"), require("../images/tdolls/1/animations/1_skin2_attack.gif")],
				die: [require("../images/tdolls/1/animations/1_skin1_die.gif"), require("../images/tdolls/1/animations/1_skin2_die.gif")],
				move: [require("../images/tdolls/1/animations/1_skin1_move.gif"), require("../images/tdolls/1/animations/1_skin2_move.gif")],
				victory: [require("../images/tdolls/1/animations/1_skin1_victory.gif"), require("../images/tdolls/1/animations/1_skin2_victory.gif")],
				victoryloop: [require("../images/tdolls/1/animations/1_skin1_victoryloop.gif"), require("../images/tdolls/1/animations/1_skin2_victoryloop.gif")],
				wait: [require("../images/tdolls/1/animations/1_skin1_wait.gif"), require("../images/tdolls/1/animations/1_skin2_wait.gif")]
			},
			animations_dorm: {
				lying: [require("../images/tdolls/1/animations/1_skin1_dorm_lying.gif"), require("../images/tdolls/1/animations/1_skin2_dorm_lying.gif")],
				move: [require("../images/tdolls/1/animations/1_skin1_dorm_move.gif"), require("../images/tdolls/1/animations/1_skin2_dorm_move.gif")],
				pick: [require("../images/tdolls/1/animations/1_skin1_dorm_pick.gif"), require("../images/tdolls/1/animations/1_skin2_dorm_pick.gif")],
				sit: [require("../images/tdolls/1/animations/1_skin1_dorm_sit.gif"), require("../images/tdolls/1/animations/1_skin2_dorm_sit.gif")],
				wait: [require("../images/tdolls/1/animations/1_skin1_dorm_wait.gif"), require("../images/tdolls/1/animations/1_skin2_dorm_wait.gif")]
			}
		}
	},
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
				image_skill: require("../images/tdolls/2/2_skill1.png")
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
				card: require("../images/tdolls/2/2_card.png"),
				card_damaged: require("../images/tdolls/2/2_card_damaged.png"),
				full: require("../images/tdolls/2/2_full.png"),
				full_damaged: require("../images/tdolls/2/2_full_damaged.png")
			},
			animations: {
				attack: require("../images/tdolls/2/animations/2_normal_attack.gif"),
				die: require("../images/tdolls/2/animations/2_normal_die.gif"),
				move: require("../images/tdolls/2/animations/2_normal_move.gif"),
				victory: require("../images/tdolls/2/animations/2_normal_victory.gif"),
				skill: require("../images/tdolls/2/animations/2_normal_skill.gif"),
				victoryloop: require("../images/tdolls/2/animations/2_normal_victoryloop.gif"),
				wait: require("../images/tdolls/2/animations/2_normal_wait.gif")
			},
			animations_dorm: {
				lying: require("../images/tdolls/2/animations/2_normal_dorm_lying.gif"),
				move: require("../images/tdolls/2/animations/2_normal_dorm_move.gif"),
				pick: require("../images/tdolls/2/animations/2_normal_dorm_pick.gif"),
				sit: require("../images/tdolls/2/animations/2_normal_dorm_sit.gif"),
				wait: require("../images/tdolls/2/animations/2_normal_dorm_wait.gif")
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
				image_skill: require("../images/tdolls/2/2_skill1.png")
			},
			skill2: {
				name: "Desperate Sharpshooter",
				initial_cooldown: "Passive",
				description: "After launching a smoke grenade, the next 7 attacks will strike targets starting from the furthest to the closest. Every hit will deal #1 damage.",
				number_of_stats: 1,
				stat1: ["150%", "156%", "161%", "167%", "172%", "178%", "183%", "189%", "194%", "200%"],
				image_skill: require("../images/tdolls/2/2_skill2.png")
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
				card: require("../images/tdolls/2/2_mod_card.png"),
				card_damaged: require("../images/tdolls/2/2_mod_card_damaged.png"),
				full: require("../images/tdolls/2/2_mod_full.png"),
				full_damaged: require("../images/tdolls/2/2_mod_full_damaged.png")
			},
			animations: {
				attack: require("../images/tdolls/2/animations/2_mod_attack.gif"),
				die: require("../images/tdolls/2/animations/2_mod_die.gif"),
				move: require("../images/tdolls/2/animations/2_mod_move.gif"),
				victory: require("../images/tdolls/2/animations/2_mod_victory.gif"),
				skill: require("../images/tdolls/2/animations/2_mod_skill.gif"),
				victoryloop: require("../images/tdolls/2/animations/2_mod_victoryloop.gif"),
				wait: require("../images/tdolls/2/animations/2_mod_wait.gif")
			},
			animations_dorm: {
				lying: require("../images/tdolls/2/animations/2_mod_dorm_lying.gif"),
				move: require("../images/tdolls/2/animations/2_mod_dorm_move.gif"),
				pick: require("../images/tdolls/2/animations/2_mod_dorm_pick.gif"),
				sit: require("../images/tdolls/2/animations/2_mod_dorm_sit.gif"),
				wait: require("../images/tdolls/2/animations/2_mod_dorm_wait.gif")
			}
		},
		selected: {},
		skins: {
			number_of_skins: 1,
			skin_names: ["Night Dancer"],
			skin_images: [require("../images/tdolls/2/2_skin1_card.png"), require("../images/tdolls/2/2_skin1_card_damaged.png")],
			skin_images_full: [require("../images/tdolls/2/2_skin1_full.png"), require("../images/tdolls/2/2_skin1_full_damaged.png")],
			animations: {
				attack: [require("../images/tdolls/2/animations/2_skin1_attack.gif")],
				die: [require("../images/tdolls/2/animations/2_skin1_die.gif")],
				move: [require("../images/tdolls/2/animations/2_skin1_move.gif")],
				skill: [require("../images/tdolls/2/animations/2_skin1_skill.gif")],
				victory: [require("../images/tdolls/2/animations/2_skin1_victory.gif")],
				victoryloop: [require("../images/tdolls/2/animations/2_skin1_victoryloop.gif")],
				wait: [require("../images/tdolls/2/animations/2_skin1_wait.gif")]
			},
			animations_dorm: {
				lying: [require("../images/tdolls/2/animations/2_skin1_dorm_lying.gif")],
				move: [require("../images/tdolls/2/animations/2_skin1_dorm_move.gif")],
				pick: [require("../images/tdolls/2/animations/2_skin1_dorm_pick.gif")],
				sit: [require("../images/tdolls/2/animations/2_skin1_dorm_sit.gif")],
				wait: [require("../images/tdolls/2/animations/2_skin1_dorm_wait.gif")]
			}
		}
	}
];

module.exports = tdolls;
