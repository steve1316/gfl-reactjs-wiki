#!/usr/bin/env node
/**
 * Check that every asset the app can ask for actually exists, and that the animation tabs it offers
 * are ones the skeletons can play.
 *
 * Written after two bugs reached the live site that a load-time check could never have caught: an
 * animation that played off-canvas, and a skin whose damaged art resolved to a different skin. Both
 * lived in interaction paths, so this audits every combination rather than the default view.
 *
 * It resolves paths exactly as `src/lib/assets.ts` does, so a pass here means the real thing works. Animation names come from the Spine
 * index, which `add_spine_animations.mjs` fills with the same `skb.js` the browser uses.
 *
 * Usage:
 *     node tools/assets/audit_assets.mjs [--assets <dir>] [--manifest <file>] [--spine-index <file>] [--hoc-spine-index <file>] [--enemy-spine-index <file>]
 *
 * Audits the skin-id layout on disk: every file the version 3 manifest and Spine index reference must exist in the staging tree. `--v3`
 * is still accepted from before the version 2 audit of the live hosts was removed. HOC art and rigs are audited too, the HOC Spine index
 * only when its file exists, since a repo may not have any HOC rigs published yet. Fairy art, enemy art and enemy rigs are audited the
 * same way.
 *
 * Live2D fairy forms and HOC models are audited too: for each kind the manifest's `live2d` block lists, its `.moc3` and `.model3.json`
 * files must exist, plus the shared texture (`texture.webp` for a fairy, `texture0.webp` for a HOC) and at least one `.motion3.json`
 * file in its `motions/` folder. The moc3 and model3.json checks count toward the missing-files total; a missing texture does too,
 * but a folder with no motion files is a structural problem, since motion file names vary per model and cannot be checked by name.
 *
 * T-Doll skin Live2D variants are audited the same way, but a skin's texture count varies per model instead of following a fixed table,
 * so its textures, motions and physics rig (when it has one) are read out of the variant's own `model.model3.json` `FileReferences`
 * rather than a hardcoded filename, and each referenced file is checked to exist.
 *
 * Exits non-zero when anything is missing, so it can gate a deploy.
 */

import fs from "node:fs";
import path from "node:path";

/** Default inputs: the staging tree, and the manifest and Spine index the site bundles. */
const V3_DEFAULTS = {
	assets: "tools/assets/.staging/assets",
	manifest: "assets-manifest.json",
	spineIndex: "src/data/spine-index.json",
	hocSpineIndex: "src/data/hoc-spine-index.json",
	enemySpineIndex: "src/data/enemy-spine-index.json"
};

/** v3 image kind -> filename inside a form folder. */
const V3_IMAGE_FILES = { card: "card.webp", card_damaged: "card_d.webp", full: "full.webp", full_damaged: "full_d.webp" };

/** HOC image kind -> filename inside a HOC's `hocs/<id>/` folder. */
const HOC_IMAGE_FILES = { card: "card.webp", full: "full.webp" };

/** Enemy image kind -> filename inside an enemy's `enemies/<id>/` folder. An enemy has the same two kinds a HOC does. */
const ENEMY_IMAGE_FILES = { card: "card.webp", full: "full.webp" };

/** Fairy image kind -> filename inside a fairy's `fairies/<id>/` folder. */
const FAIRY_IMAGE_FILES = { form1: "form1.webp", form2: "form2.webp", form3: "form3.webp" };

/** Live2D fairy form kind -> its moc3 and model3.json filenames inside a fairy's `live2d/fairies/<id>/` folder. */
const LIVE2D_FAIRY_FILES = { form1: ["form1.moc3", "form1.model3.json"], form2: ["form2.moc3", "form2.model3.json"], form3: ["form3.moc3", "form3.model3.json"] };

/** Live2D HOC kind -> its moc3 and model3.json filenames inside a HOC's `live2d/hocs/<id>/` folder. */
const LIVE2D_HOC_FILES = { model: ["model.moc3", "model.model3.json"] };

/** v3 Mod-skin card kind -> filename inside a skin folder. */
const V3_MOD_CARD_FILES = { card: "mod_card.webp", card_damaged: "mod_card_d.webp" };

/** Animation names src/lib/spine.ts can give a readable label. Anything else shows as its raw name. */
const KNOWN_ANIMATION_NAMES = new Set([
	"wait",
	"wait2",
	"move",
	"attack",
	"attack1",
	"attack2",
	"reload",
	"squatreload",
	"s",
	"skill",
	"skill2",
	"crouch",
	"squat",
	"snipe",
	"action",
	"action1",
	"action2",
	"spattack",
	"spattack2",
	"spa",
	"spc",
	"sp",
	"sp1",
	"sp2",
	"landing",
	"die",
	"victory",
	"victory2",
	"victoryloop",
	"pick",
	"sit",
	"sit2",
	"lying",
	"violin",
	"book",
	"therun2"
]);

/**
 * Read a command-line option value.
 *
 * @param {string[]} args Command-line arguments.
 * @param {string} name Option name including the dashes.
 * @param {string} fallback Value when the option is absent.
 * @returns {string} The option value.
 */
const option = (args, name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);

/**
 * List every rig a v3 Spine index entry holds, labelled for messages.
 *
 * @param {object} rigs One doll's v3 index entry.
 * @returns {Array<[string, object]>} Label and rig pairs, absent rigs dropped.
 */
function v3Rigs(rigs) {
	return [
		["combat", rigs.combat],
		["dorm", rigs.dorm],
		["mod", rigs.mod?.combat],
		["mod dorm", rigs.mod?.dorm],
		...Object.entries(rigs.skins ?? {}).flatMap(([skinId, pair]) => [
			[`skin ${skinId}`, pair.combat],
			[`skin ${skinId} dorm`, pair.dorm]
		])
	].filter(([, rig]) => rig);
}

/**
 * Audit the v3 manifest and Spine index against the staging tree on disk.
 *
 * @param {string[]} args Command-line arguments.
 */
function auditV3(args) {
	const root = option(args, "--assets", V3_DEFAULTS.assets);
	const manifest = JSON.parse(fs.readFileSync(option(args, "--manifest", V3_DEFAULTS.manifest), "utf8"));
	const spineIndex = JSON.parse(fs.readFileSync(option(args, "--spine-index", V3_DEFAULTS.spineIndex), "utf8"));
	const hocSpineIndexPath = option(args, "--hoc-spine-index", V3_DEFAULTS.hocSpineIndex);
	const enemySpineIndexPath = option(args, "--enemy-spine-index", V3_DEFAULTS.enemySpineIndex);

	const missing = [];
	const problems = [];
	const notes = [];
	let checked = 0;

	/** Record one required file, relative to the tree root. */
	const need = (rel, why) => {
		checked++;
		if (!fs.existsSync(path.join(root, rel))) {
			missing.push(`${rel} (${why})`);
		}
	};

	/**
	 * Check every rig of one index entry: its skeleton, atlas and atlas pages exist, the default rig is not a skin, and its animations parse
	 * and have labels.
	 *
	 * @param {string} label Message prefix naming the entry, e.g. `doll 65` or `hoc 1`.
	 * @param {string} folder The entry's rig folder inside the assets tree, e.g. `spine/65`.
	 * @param {Array<[string, object]>} rigs Kind label and rig pairs, absent rigs already dropped.
	 */
	/**
	 * Check one entry's rigs: every skeleton, atlas and atlas page must exist.
	 *
	 * `hasSkinRigs` is only true for dolls. A doll's skin rig is named `<Code>_<skinId>`, so a base rig ending in digits means a skin
	 * leaked into the base slot. Enemies and HOCs have no skins, and their skeletons legitimately end in digits (`Bathhouse_guest_1`),
	 * so the check would only produce false alarms there.
	 */
	const auditRigs = (label, folder, rigs, hasSkinRigs = false) => {
		for (const [kind, rig] of rigs) {
			need(`${folder}/${rig.skel}.skel`, `${label} ${kind} skeleton`);
			const atlasRel = `${folder}/${rig.atlas}.atlas`;
			need(atlasRel, `${label} ${kind} atlas`);
			const atlasFile = path.join(root, atlasRel);
			if (fs.existsSync(atlasFile)) {
				// Page images resolve against the atlas's own folder, exactly as `spineImageBase` builds the URL.
				for (const line of fs.readFileSync(atlasFile, "utf8").split("\n")) {
					const name = line.trim();
					if (name.toLowerCase().endsWith(".png")) {
						need(`${path.posix.dirname(atlasRel)}/${name}`, `${label} ${kind} atlas page`);
					}
				}
			}
			if (hasSkinRigs && kind === "combat" && /_\d+$/.test(rig.skel.split("/").pop())) {
				problems.push(`${label}: default rig ${rig.skel} is a skin, not the base rig`);
			}
			if (!rig.anims?.length) {
				problems.push(`${label} ${kind}: skeleton ${rig.skel} defines no animations, or skb.js cannot parse it`);
				continue;
			}
			const unlabelled = rig.anims.filter((name) => !KNOWN_ANIMATION_NAMES.has(name));
			if (unlabelled.length) {
				notes.push(`${label} ${kind}: shown under raw names ${unlabelled.join(",")}`);
			}
		}
	};

	if (manifest.version !== 3) {
		problems.push(`manifest version is ${manifest.version}, expected 3`);
	}

	for (const [id, doll] of Object.entries(manifest.dolls)) {
		const forms = [
			["normal", `tdolls/${id}`, doll.normal],
			["mod", `tdolls/${id}/mod`, doll.mod],
			...Object.entries(doll.skins ?? {}).map(([skinId, skin]) => [`skin ${skinId}`, `tdolls/${id}/skins/${skinId}`, skin])
		];
		for (const [label, folder, form] of forms) {
			if (!form) continue;
			for (const kind of form.images) {
				need(`${folder}/${V3_IMAGE_FILES[kind]}`, `doll ${id} ${label} ${kind}`);
			}
			for (const kind of form.modImages ?? []) {
				need(`${folder}/${V3_MOD_CARD_FILES[kind]}`, `doll ${id} ${label} Mod ${kind}`);
			}
		}
		for (const skill of doll.skills) {
			need(`tdolls/${id}/${skill}.png`, `doll ${id} ${skill}`);
		}

		const rigs = spineIndex[id];
		if (!rigs?.combat) {
			problems.push(`doll ${id}: no combat rig, the animation panel would be empty`);
			continue;
		}
		if (doll.mod && !rigs.mod?.combat) {
			problems.push(`doll ${id}: has a Mod form but no Mod rig, so it would play the base animations`);
		}
		for (const skinId of Object.keys(doll.skins ?? {})) {
			if (!rigs.skins?.[skinId]?.combat) {
				notes.push(`doll ${id} skin ${skinId}: no Spine rig, the page falls back to the base rig`);
			}
		}
	}

	for (const [id, rigs] of Object.entries(spineIndex)) {
		if (!manifest.dolls[id]) {
			notes.push(`doll ${id}: has rigs but no manifest entry`);
		}
		auditRigs(`doll ${id}`, `spine/${id}`, v3Rigs(rigs), true);
	}

	for (const equipId of manifest.equipment) {
		need(`equipment/${equipId}.png`, `equipment ${equipId}`);
	}

	for (const [id, kinds] of Object.entries(manifest.hocs ?? {})) {
		for (const kind of kinds) {
			need(`hocs/${id}/${HOC_IMAGE_FILES[kind]}`, `hoc ${id} ${kind}`);
		}
	}

	for (const [id, kinds] of Object.entries(manifest.fairies ?? {})) {
		for (const kind of kinds) {
			need(`fairies/${id}/${FAIRY_IMAGE_FILES[kind]}`, `fairy ${id} ${kind}`);
		}
	}

	for (const [id, kinds] of Object.entries(manifest.enemies ?? {})) {
		for (const kind of kinds) {
			need(`enemies/${id}/${ENEMY_IMAGE_FILES[kind]}`, `enemy ${id} ${kind}`);
		}
	}

	/**
	 * Check one Live2D model's folder: the moc3 and model3.json of every listed kind, the shared texture, and at least one motion file.
	 *
	 * @param {string} label Message prefix naming the entry, e.g. `live2d fairy 1`.
	 * @param {string} folder The model's folder inside the assets tree, e.g. `live2d/fairies/1`.
	 * @param {string[]} kinds The kinds the manifest lists for it.
	 * @param {Record<string, string[]>} kindFiles Kind -> its required filenames.
	 * @param {string} textureFile The shared texture's filename.
	 */
	const auditLive2dModel = (label, folder, kinds, kindFiles, textureFile) => {
		for (const kind of kinds) {
			for (const file of kindFiles[kind]) {
				need(`${folder}/${file}`, `${label} ${kind}`);
			}
		}
		need(`${folder}/${textureFile}`, `${label} texture`);
		const motionsDir = path.join(root, folder, "motions");
		const hasMotion = fs.existsSync(motionsDir) && fs.readdirSync(motionsDir).some((name) => name.endsWith(".motion3.json"));
		if (!hasMotion) {
			problems.push(`${label}: no .motion3.json files in ${folder}/motions`);
		}
	};

	for (const [id, kinds] of Object.entries(manifest.live2d?.fairies ?? {})) {
		auditLive2dModel(`live2d fairy ${id}`, `live2d/fairies/${id}`, kinds, LIVE2D_FAIRY_FILES, "texture.webp");
	}

	for (const [id, kinds] of Object.entries(manifest.live2d?.hocs ?? {})) {
		auditLive2dModel(`live2d hoc ${id}`, `live2d/hocs/${id}`, kinds, LIVE2D_HOC_FILES, "texture0.webp");
	}

	/**
	 * Check one T-Doll skin Live2D variant: its moc3 and model3.json exist, then every texture, motion and physics file the
	 * model3.json itself lists exists too. Unlike a fairy or HOC, a skin's texture count is not fixed, so it is read from the file
	 * rather than a hardcoded table.
	 *
	 * @param {string} label Message prefix naming the entry, e.g. `live2d tdoll 104 base 1202 normal`.
	 * @param {string} folder The variant's folder inside the assets tree, e.g. `live2d/tdolls/104/base/1202/normal`.
	 */
	const auditSkinLive2dVariant = (label, folder) => {
		need(`${folder}/model.moc3`, `${label} moc3`);
		const model3Rel = `${folder}/model.model3.json`;
		need(model3Rel, `${label} model3`);
		const model3File = path.join(root, model3Rel);
		if (!fs.existsSync(model3File)) {
			return;
		}
		const refs = JSON.parse(fs.readFileSync(model3File, "utf8")).FileReferences ?? {};
		for (const texture of refs.Textures ?? []) {
			need(`${folder}/${texture}`, `${label} texture`);
		}
		if (refs.Physics) {
			need(`${folder}/${refs.Physics}`, `${label} physics`);
		}
		const motionFiles = Object.values(refs.Motions ?? {}).flatMap((group) => group.map((entry) => entry.File));
		for (const file of motionFiles) {
			need(`${folder}/${file}`, `${label} motion`);
		}
		if (motionFiles.length === 0) {
			problems.push(`${label}: no motions listed in ${model3Rel}`);
		}
	};

	for (const [id, forms] of Object.entries(manifest.live2d?.tdolls ?? {})) {
		for (const [form, skins] of Object.entries(forms)) {
			for (const [skin, variants] of Object.entries(skins)) {
				for (const variant of variants) {
					auditSkinLive2dVariant(`live2d tdoll ${id} ${form} ${skin} ${variant}`, `live2d/tdolls/${id}/${form}/${skin}/${variant}`);
				}
			}
		}
	}

	if (fs.existsSync(hocSpineIndexPath)) {
		const hocSpineIndex = JSON.parse(fs.readFileSync(hocSpineIndexPath, "utf8"));
		for (const [id, entry] of Object.entries(hocSpineIndex)) {
			const rigs = [["combat", entry.combat], ...(entry.crew ?? []).map((rig, i) => [`crew ${i + 1}`, rig])];
			auditRigs(
				`hoc ${id}`,
				`hoc-spine/${id}`,
				rigs.filter(([, rig]) => rig)
			);
		}
	}

	if (fs.existsSync(enemySpineIndexPath)) {
		const enemySpineIndex = JSON.parse(fs.readFileSync(enemySpineIndexPath, "utf8"));
		for (const [id, entry] of Object.entries(enemySpineIndex)) {
			auditRigs(`enemy ${id}`, `enemy-spine/${id}`, entry.combat ? [["combat", entry.combat]] : []);
		}
	}

	console.log(`dolls               ${Object.keys(manifest.dolls).length}`);
	console.log(`equipment           ${manifest.equipment.length}`);
	console.log(`files checked       ${checked}`);
	console.log(`missing files       ${missing.length}`);
	missing.slice(0, 20).forEach((m) => console.log(`   ${m}`));
	console.log(`structural problems ${problems.length}`);
	problems.slice(0, 25).forEach((p) => console.log(`   ${p}`));
	console.log(`notes (not failures) ${notes.length}`);
	notes.slice(0, 10).forEach((n) => console.log(`   ${n}`));
	if (missing.length || problems.length) {
		process.exitCode = 1;
	} else {
		console.log("\nall good");
	}
}

auditV3(process.argv.slice(2));
