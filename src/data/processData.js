// The main purpose of this file is to lower the number of code duplication inside the T-Doll JSONs by programmatically processing them and adding new properties when needed.
// It will process the given T-Dolls JSON file by finding and adding all images and animations for each T-Doll.

export default function processData(tdolls) {
	tdolls.forEach((tdoll) => {
		var id = tdoll.normal.id;

		//console.log("Processing ", tdoll.normal.name);

		// Create new properties inside the JSON in advance.
		tdoll.normal.images = {};
		tdoll.normal.animations_dorm = {};

		//////////// Images for Normal ////////////
		tdoll.normal.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
		tdoll.normal.images.card = require(`../images/tdolls/${id}/${id}_card.png`);
		tdoll.normal.images.card_damaged = require(`../images/tdolls/${id}/${id}_card_d.png`);
		tdoll.normal.images.full = require(`../images/tdolls/${id}/${id}_full.png`);
		tdoll.normal.images.full_damaged = require(`../images/tdolls/${id}/${id}_full_d.png`);

		//////////// Normal Animations for Normal ////////////
		tdoll.normal.animations.attack = require(`../images/tdolls/${id}/animations/${id}_normal_attack.gif`);
		tdoll.normal.animations.die = require(`../images/tdolls/${id}/animations/${id}_normal_die.gif`);
		tdoll.normal.animations.move = require(`../images/tdolls/${id}/animations/${id}_normal_move.gif`);
		tdoll.normal.animations.victory = require(`../images/tdolls/${id}/animations/${id}_normal_victory.gif`);
		tdoll.normal.animations.wait = require(`../images/tdolls/${id}/animations/${id}_normal_wait.gif`);

		if (tdoll.normal.animations.hasSkillAnimation) {
			tdoll.normal.animations.skill = require(`../images/tdolls/${id}/animations/${id}_normal_skill.gif`);
		}

		if (id === 1) {
			// So far, only SAA has the victory2 animation.
			tdoll.normal.animations.victory2 = require(`../images/tdolls/${id}/animations/${id}_normal_victory2.gif`);
		}

		if (tdoll.normal.animations.hasVictoryLoopAnimation) {
			tdoll.normal.animations.victoryloop = require(`../images/tdolls/${id}/animations/${id}_normal_victoryloop.gif`);
		}

		if ("hasAttack2Animation" in tdoll.normal.animations) {
			tdoll.normal.animations.attack2 = require(`../images/tdolls/${id}/animations/${id}_normal_attack2.gif`);
		}

		if (tdoll.normal.type === "MG") {
			tdoll.normal.animations.reload = require(`../images/tdolls/${id}/animations/${id}_normal_reload.gif`);
		}

		//////////// Dorm Animations for Normal ////////////
		tdoll.normal.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_lying.gif`);
		tdoll.normal.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_move.gif`);
		tdoll.normal.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_pick.gif`);
		tdoll.normal.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_sit.gif`);
		tdoll.normal.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_normal_dorm_wait.gif`);

		if (tdoll.mod !== null) {
			// Create new properties inside the JSON in advance.
			tdoll.mod.images = {};
			tdoll.mod.animations_dorm = {};

			//////////// Images for Mod ////////////
			tdoll.mod.skill.image_skill = require(`../images/tdolls/${id}/${id}_skill1.png`);
			tdoll.mod.skill2.image_skill = require(`../images/tdolls/${id}/${id}_skill2.png`);
			tdoll.mod.images.card = require(`../images/tdolls/${id}/${id}_mod_card.png`);
			tdoll.mod.images.card_damaged = require(`../images/tdolls/${id}/${id}_mod_card_d.png`);
			tdoll.mod.images.full = require(`../images/tdolls/${id}/${id}_mod_full.png`);
			tdoll.mod.images.full_damaged = require(`../images/tdolls/${id}/${id}_mod_full_d.png`);

			//////////// Normal Animations for Mod ////////////
			tdoll.mod.animations.attack = require(`../images/tdolls/${id}/animations/${id}_mod_attack.gif`);
			tdoll.mod.animations.die = require(`../images/tdolls/${id}/animations/${id}_mod_die.gif`);
			tdoll.mod.animations.move = require(`../images/tdolls/${id}/animations/${id}_mod_move.gif`);
			tdoll.mod.animations.victory = require(`../images/tdolls/${id}/animations/${id}_mod_victory.gif`);
			tdoll.mod.animations.victoryloop = require(`../images/tdolls/${id}/animations/${id}_mod_victoryloop.gif`);
			tdoll.mod.animations.wait = require(`../images/tdolls/${id}/animations/${id}_mod_wait.gif`);

			if (tdoll.mod.animations.hasSkillAnimation) {
				tdoll.mod.animations.skill = require(`../images/tdolls/${id}/animations/${id}_mod_skill.gif`);
			}

			if ("hasAttack2Animation" in tdoll.mod.animations) {
				tdoll.mod.animations.attack2 = require(`../images/tdolls/${id}/animations/${id}_mod_attack2.gif`);
			}

			if (tdoll.mod.type === "MG") {
				tdoll.mod.animations.reload = require(`../images/tdolls/${id}/animations/${id}_mod_reload.gif`);
			}

			if (tdoll.normal.id === 95) {
				// Takes care of the additional animations for Hanyang Type 88 Mod.
				tdoll.mod.animations.landing = require(`../images/tdolls/${id}/animations/${id}_mod_landing.gif`);
				tdoll.mod.animations.skill2 = require(`../images/tdolls/${id}/animations/${id}_mod_skill2.gif`);
				tdoll.mod.animations.spattack = require(`../images/tdolls/${id}/animations/${id}_mod_spattack.gif`);
				tdoll.mod.animations.spattack2 = require(`../images/tdolls/${id}/animations/${id}_mod_spattack2.gif`);
			}

			//////////// Dorm Animations for Mod ////////////
			tdoll.mod.animations_dorm.lying = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_lying.gif`);
			tdoll.mod.animations_dorm.move = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_move.gif`);
			tdoll.mod.animations_dorm.pick = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_pick.gif`);
			tdoll.mod.animations_dorm.sit = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_sit.gif`);
			tdoll.mod.animations_dorm.wait = require(`../images/tdolls/${id}/animations/${id}_mod_dorm_wait.gif`);
		}

		if (tdoll.skins !== null) {
			// Create new properties inside the JSON in advance.
			tdoll.skins.skin_images = [];
			tdoll.skins.skin_images_full = [];
			tdoll.skins.animations.attack = [];
			tdoll.skins.animations.die = [];
			tdoll.skins.animations.move = [];
			tdoll.skins.animations.victory = [];
			tdoll.skins.animations.wait = [];
			tdoll.skins.animations_dorm.lying = [];
			tdoll.skins.animations_dorm.move = [];
			tdoll.skins.animations_dorm.pick = [];
			tdoll.skins.animations_dorm.sit = [];
			tdoll.skins.animations_dorm.wait = [];

			// Increment and loop through all available skins for this T-Doll.
			for (var i = 0, skinSelected = 1; skinSelected <= tdoll.skins.number_of_skins; i++, skinSelected++) {
				//////////// Images for Skin(s) ////////////
				tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card.png`));
				tdoll.skins.skin_images.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_card_d.png`));

				tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full.png`));
				tdoll.skins.skin_images_full.push(require(`../images/tdolls/${id}/${id}_skin${skinSelected}_full_d.png`));

				//////////// Normal Animations for Skin(s) ////////////
				tdoll.skins.animations.attack[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_attack.gif`);
				tdoll.skins.animations.die[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_die.gif`);
				tdoll.skins.animations.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_move.gif`);
				tdoll.skins.animations.victory[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victory.gif`);
				tdoll.skins.animations.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_wait.gif`);

				if (tdoll.skins.animations.hasSkillAnimation[i]) {
					if (tdoll.skins.animations.skill === undefined) {
						tdoll.skins.animations.skill = [];
					}
					tdoll.skins.animations.skill[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_skill.gif`);
				}

				if (tdoll.skins.animations.hasVictoryLoopAnimation[i]) {
					if (tdoll.skins.animations.victoryloop === undefined) {
						tdoll.skins.animations.victoryloop = [];
					}
					tdoll.skins.animations.victoryloop[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_victoryloop.gif`);
				}

				if ("hasAttack2Animation" in tdoll.skins.animations && tdoll.skins.animations.hasAttack2Animation[i]) {
					if (tdoll.skins.animations.attack2 === undefined) {
						tdoll.skins.animations.attack2 = [];
					}
					tdoll.skins.animations.attack2[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_attack2.gif`);
				}

				if (tdoll.normal.type === "MG") {
					if (tdoll.skins.animations.reload === undefined) {
						tdoll.skins.animations.reload = [];
					}
					tdoll.skins.animations.reload[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_reload.gif`);
				}

				//////////// Dorm Animations for Skin(s) ////////////
				tdoll.skins.animations_dorm.lying[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_lying.gif`);
				tdoll.skins.animations_dorm.move[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_move.gif`);
				tdoll.skins.animations_dorm.pick[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_pick.gif`);
				tdoll.skins.animations_dorm.sit[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit.gif`);
				tdoll.skins.animations_dorm.wait[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_wait.gif`);

				if (tdoll.skins.animations_dorm.hasActionAnimation[i]) {
					if (tdoll.skins.animations_dorm.action === undefined) {
						tdoll.skins.animations_dorm.action = [];
					}
					tdoll.skins.animations_dorm.action[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_action.gif`);
				}

				if (tdoll.skins.animations_dorm.hasSit2Animation[i]) {
					if (tdoll.skins.animations_dorm.sit2 === undefined) {
						tdoll.skins.animations_dorm.sit2 = [];
					}
					tdoll.skins.animations_dorm.sit2[i] = require(`../images/tdolls/${id}/animations/${id}_skin${skinSelected}_dorm_sit2.gif`);
				}
			}
		}
	});

	// Return the new JSON back in order to be exported.
	return tdolls;
}
