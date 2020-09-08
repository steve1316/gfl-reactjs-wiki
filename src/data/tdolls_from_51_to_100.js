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
				name: "Burning Hunting Spirit",
				initial_cooldown: "7s",
				cooldown: [13, 12.6, 12.1, 11.7, 11.2, 10.8, 10.3, 9.9, 9.4, 9],
				description:
					"Begin charging after skill cooldown ends, gaining 1 charge stack every second, up to a maximum of 7 stacks. When skill is used, aim for 1.5 seconds, prioritising the enemy with the highest health that can be killed in 1 shot (affected by link protection). If there are no enemies that can be instantly killed, prioritise the enemy with the highest health. After aiming, deal #1 ~ #2 damage that ignores HP shields based on the current number of charge stacks. All stacks will be consumed on skill use.",
				number_of_stats: 2,
				stat1: [2.7, 3, 3.3, 3.5, 3.8, 4, 4.3, 4.5, 4.8, 5],
				stat2: ["5x", "5.6x", "6.2x", "6.7x", "7.3x", "7.8x", "8.4x", "8.9x", "9.5x", "10x"],
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
