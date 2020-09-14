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
var tdolls = [];
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// END OF EXTRAS #1000-#1050 JSON DATA /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Now processing images and animations for EXTRAS #1000-#1050 T-Doll Index JSON.");
tdolls = processData(tdolls);
console.log("Finished processing images and animations for EXTRAS #1000-#1050 T-Doll Index JSON.");

export default tdolls;
