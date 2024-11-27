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
 *     node tools/assets/audit_assets.mjs [--assets <dir>] [--art <dir>] [--manifest <file>] [--spine-index <file>] [--hoc-spine-index <file>]
 *
 * Audits the skin-id layout on disk: every file the version 3 manifest and Spine index reference must exist in the staging trees. `--v3`
 * is still accepted from before the version 2 audit of the live hosts was removed. HOC art and rigs are audited too, the HOC Spine index
 * only when its file exists, since a repo may not have any HOC rigs published yet.
 *
 * Exits non-zero when anything is missing, so it can gate a deploy.
 */

import fs from "node:fs";
import path from "node:path";

/** Default inputs: the staging trees, and the manifest and Spine index the site bundles. */
const V3_DEFAULTS = {
	assets: "tools/assets/.staging/assets",
	art: "tools/assets/.staging/art",
	manifest: "assets-manifest.json",
	spineIndex: "src/data/spine-index.json",
	hocSpineIndex: "src/data/hoc-spine-index.json"
};

/** v3 image kind -> tree and filename inside a form folder. */
const V3_IMAGE_FILES = { card: ["assets", "card.webp"], card_damaged: ["assets", "card_d.webp"], full: ["art", "full.webp"], full_damaged: ["art", "full_d.webp"] };

/** HOC image kind -> tree and filename inside a HOC's `hocs/<id>/` folder. */
const HOC_IMAGE_FILES = { card: ["assets", "card.webp"], full: ["art", "full.webp"] };

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
 * Audit the v3 manifest and Spine index against the staging trees on disk.
 *
 * @param {string[]} args Command-line arguments.
 */
function auditV3(args) {
	const roots = { assets: option(args, "--assets", V3_DEFAULTS.assets), art: option(args, "--art", V3_DEFAULTS.art) };
	const manifest = JSON.parse(fs.readFileSync(option(args, "--manifest", V3_DEFAULTS.manifest), "utf8"));
	const spineIndex = JSON.parse(fs.readFileSync(option(args, "--spine-index", V3_DEFAULTS.spineIndex), "utf8"));
	const hocSpineIndexPath = option(args, "--hoc-spine-index", V3_DEFAULTS.hocSpineIndex);

	const missing = [];
	const problems = [];
	const notes = [];
	let checked = 0;

	/** Record one required file, relative to a tree root. */
	const need = (tree, rel, why) => {
		checked++;
		if (!fs.existsSync(path.join(roots[tree], rel))) {
			missing.push(`${tree}/${rel} (${why})`);
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
				const [tree, name] = V3_IMAGE_FILES[kind];
				need(tree, `${folder}/${name}`, `doll ${id} ${label} ${kind}`);
			}
			for (const kind of form.modImages ?? []) {
				need("assets", `${folder}/${V3_MOD_CARD_FILES[kind]}`, `doll ${id} ${label} Mod ${kind}`);
			}
		}
		for (const skill of doll.skills) {
			need("assets", `tdolls/${id}/${skill}.png`, `doll ${id} ${skill}`);
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
		for (const [kind, rig] of v3Rigs(rigs)) {
			need("assets", `spine/${id}/${rig.skel}.skel`, `doll ${id} ${kind} skeleton`);
			const atlasRel = `spine/${id}/${rig.atlas}.atlas`;
			need("assets", atlasRel, `doll ${id} ${kind} atlas`);
			const atlasFile = path.join(roots.assets, atlasRel);
			if (fs.existsSync(atlasFile)) {
				// Page images resolve against the atlas's own folder, exactly as `spineImageBase` builds the URL.
				for (const line of fs.readFileSync(atlasFile, "utf8").split("\n")) {
					const name = line.trim();
					if (name.toLowerCase().endsWith(".png")) {
						need("assets", `${path.posix.dirname(atlasRel)}/${name}`, `doll ${id} ${kind} atlas page`);
					}
				}
			}
			if (kind === "combat" && /_\d+$/.test(rig.skel.split("/").pop())) {
				problems.push(`doll ${id}: default rig ${rig.skel} is a skin, not the base rig`);
			}
			if (!rig.anims?.length) {
				problems.push(`doll ${id} ${kind}: skeleton ${rig.skel} defines no animations, or skb.js cannot parse it`);
				continue;
			}
			const unlabelled = rig.anims.filter((name) => !KNOWN_ANIMATION_NAMES.has(name));
			if (unlabelled.length) {
				notes.push(`doll ${id} ${kind}: shown under raw names ${unlabelled.join(",")}`);
			}
		}
	}

	for (const equipId of manifest.equipment) {
		need("assets", `equipment/${equipId}.png`, `equipment ${equipId}`);
	}

	for (const [id, kinds] of Object.entries(manifest.hocs ?? {})) {
		for (const kind of kinds) {
			const [tree, name] = HOC_IMAGE_FILES[kind];
			need(tree, `hocs/${id}/${name}`, `hoc ${id} ${kind}`);
		}
	}

	if (fs.existsSync(hocSpineIndexPath)) {
		const hocSpineIndex = JSON.parse(fs.readFileSync(hocSpineIndexPath, "utf8"));
		for (const [id, entry] of Object.entries(hocSpineIndex)) {
			const rigs = [["combat", entry.combat], ...(entry.crew ?? []).map((rig, i) => [`crew ${i + 1}`, rig])];
			for (const [label, rig] of rigs) {
				if (!rig) continue;
				need("assets", `hoc-spine/${id}/${rig.skel}.skel`, `hoc ${id} ${label} skeleton`);
				need("assets", `hoc-spine/${id}/${rig.atlas}.atlas`, `hoc ${id} ${label} atlas`);
				if (!rig.anims?.length) {
					problems.push(`hoc ${id} ${label}: skeleton ${rig.skel} defines no animations, or skb.js cannot parse it`);
				}
			}
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
