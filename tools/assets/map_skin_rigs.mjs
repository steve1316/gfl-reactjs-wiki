#!/usr/bin/env node
/**
 * Align each doll's skin Spine rigs with the order its skins appear in the UI.
 *
 * The Spine tree names skin rigs by the game's skin id, as in `M1873_2105`, while the page knows only
 * the position of the tab the reader clicked. Those cannot be matched by counting, because many skins
 * have no Spine rig published at all: doll 20 has three skins and two rigs, doll 26 has four and
 * three. Guessing by position would show the wrong outfit's animations.
 *
 * `skin.hjson` from gf-data-us maps every skin id to its name and the doll it belongs to, so each name
 * in `skin_names` can be matched to an id, and that id to a rig. Names alone do not get far, since the
 * wiki's were written in 2021 and the game's have been retranslated since, sometimes past recognition.
 * `match_skin_art.py` settles those by comparing the artwork itself. Neither signal wins outright, so
 * the stronger one is taken: an exact or prefix name match is as good as certain, artwork decides
 * where it wins by a clear margin, and a loose name match is the last resort. Reversing any of that
 * gets real skins wrong. SAA's two outfits are close enough in palette that artwork swaps them, while
 * Grizzly MkV's `Rainy Starry Night` shares two words with the wrong skin and needs the artwork.
 *
 * The result is written into `spine-index.json` as `skinRigs`, indexed by the same position the tabs
 * use, with nulls where a skin has no rig.
 *
 * Usage:
 *     node tools/assets/map_skin_rigs.mjs --skins <skin.hjson> [--art <matches.json>] [--index src/data/spine-index.json]
 */

import fs from "node:fs";

/** Data modules holding the hand-written doll records. */
const SHARDS = [
	"src/data/tdolls_from_1_to_100.js",
	"src/data/tdolls_from_101_to_200.js",
	"src/data/tdolls_from_201_to_300.js",
	"src/data/tdolls_from_301_to_400.js",
	"src/data/tdolls_from_1000_to_1050.js"
];

/** How far artwork must beat its runner-up before it is allowed to overrule a loose name match. */
const CLEAR_ART_MARGIN = 0.05;

/** Names differ in punctuation and case between the two sources, so comparison is loosened. */
const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Reduce a name to the words worth comparing, dropping single letters as too common to mean anything. */
const words = (value) => new Set(value.toLowerCase().split(/[^a-z0-9]+/i).filter((word) => word.length > 1));

/**
 * Read skin id, name and owning doll out of `skin.hjson`.
 *
 * A line scan is used rather than a real hjson parser, since only three flat fields are needed.
 *
 * @param {string} path Path to skin.hjson.
 * @returns {Map<number, {id: number, name: string}[]>} Skins keyed by doll id, in file order.
 */
function parseSkins(path) {
	const byGun = new Map();
	let current = null;
	for (const raw of fs.readFileSync(path, "utf8").split("\n")) {
		const line = raw.trimEnd();
		if (line === "  {") {
			current = {};
		} else if (line === "  }," || line === "  }") {
			if (current?.id && current.name && current.fit_gun) {
				const gun = Number(current.fit_gun);
				if (!byGun.has(gun)) byGun.set(gun, []);
				byGun.get(gun).push({ id: Number(current.id), name: current.name });
			}
			current = null;
		} else if (current) {
			const match = /^    (id|name|fit_gun): (.*)$/.exec(line);
			if (match && current[match[1]] === undefined) {
				current[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
			}
		}
	}
	return byGun;
}

/**
 * Read each doll's skin names from the app's own data, in the order the tabs render them.
 *
 * @returns {Map<number, string[]>} Skin names keyed by doll id.
 */
function parseSkinNames() {
	const names = new Map();
	for (const shard of SHARDS) {
		const source = fs.readFileSync(shard, "utf8").replace("export default tdolls;", "return tdolls;");
		for (const doll of new Function(source)()) {
			if (doll.skins?.skin_names?.length) {
				names.set(doll.normal.id, doll.skins.skin_names);
			}
		}
	}
	return names;
}

/**
 * Find the catalogue entry for a skin name.
 *
 * The wiki's names were written in 2021 and the game's have drifted since, mostly in small ways such
 * as "Queen of Miracle" against "Queen of Miracles". Exact matching alone leaves most skins
 * unresolved, so a prefix match is tried next. Position is used only as a last resort and only when
 * both lists are the same length, since a wrong guess shows the wrong outfit's animations.
 *
 * @param {string} name The name as the wiki writes it.
 * @param {number} position Its index in the wiki's list.
 * @param {{id: number, name: string}[]} catalogue The doll's skins from the game data, id-ordered.
 * @param {string[]} allNames Every name the wiki lists for this doll.
 * @returns {{skin: object, how: string}|null} The matched skin and how it was found.
 */
function matchSkin(name, position, catalogue, allNames) {
	const target = normalise(name);
	const exact = catalogue.find((candidate) => normalise(candidate.name) === target);
	if (exact) return { skin: exact, how: "name" };

	const prefix = catalogue.find((candidate) => {
		const other = normalise(candidate.name);
		return other.startsWith(target) || target.startsWith(other);
	});
	if (prefix) return { skin: prefix, how: "prefix" };

	// Several names were retranslated between 2021 and now: "Fifty Days with G36" became "50 Days with
	// Gr G36", "Every Child's Christmas Dream" became "Every Child's X'mas Dream". Word overlap catches
	// those. The threshold is deliberately high, since a wrong match shows the wrong outfit and is worse
	// than showing the doll's default rig.
	const targetWords = words(name);
	let best = null;
	let bestScore = 0;
	for (const candidate of catalogue) {
		const other = words(candidate.name);
		const shared = [...targetWords].filter((word) => other.has(word)).length;
		const score = shared / new Set([...targetWords, ...other]).size;
		if (score > bestScore) {
			bestScore = score;
			best = candidate;
		}
	}
	if (best && bestScore >= 0.5) {
		return { skin: best, how: "words" };
	}

	if (catalogue.length === allNames.length && catalogue[position]) {
		return { skin: catalogue[position], how: "position" };
	}
	return null;
}

/**
 * Pick between the name match and the artwork match, taking whichever is the stronger signal.
 *
 * An exact or prefix name match is as good as certain, so it wins outright. Artwork comes next, but
 * only where it beat its runner-up by a clear margin. A loose name match is the last resort, ahead of
 * an artwork match that was too close to call.
 *
 * @param {{skin: {id: number}, how: string}|null} named The name match, if one was found.
 * @param {{skin: number, margin: number}|null} art The artwork match, if one was found.
 * @returns {{skinId: number, how: string}|null} The skin that won and how, or null when neither signal has one.
 */
function chooseSkin(named, art) {
	if (named?.how === "name" || named?.how === "prefix") return { skinId: named.skin.id, how: named.how };
	if (art && art.margin >= CLEAR_ART_MARGIN) return { skinId: art.skin, how: "art" };
	if (named) return { skinId: named.skin.id, how: named.how };
	if (art) return { skinId: art.skin, how: "art (close)" };
	return null;
}

/** Resolve every doll's skin rigs by position and write them back into the index. */
function main() {
	const args = process.argv.slice(2);
	const skinsPath = args[args.indexOf("--skins") + 1];
	const indexPath = args.includes("--index") ? args[args.indexOf("--index") + 1] : "src/data/spine-index.json";
	const artPath = args.includes("--art") ? args[args.indexOf("--art") + 1] : null;
	if (!skinsPath || !fs.existsSync(skinsPath)) {
		console.error("pass --skins <skin.hjson>");
		process.exit(1);
	}

	const gameSkins = parseSkins(skinsPath);
	const uiNames = parseSkinNames();
	const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
	const artMatches = artPath ? JSON.parse(fs.readFileSync(artPath, "utf8")) : {};

	let matched = 0;
	let withoutRig = 0;
	let unmatched = 0;
	const strategy = {};
	const agreement = { agree: 0, disagree: 0 };
	const disagreements = [];

	for (const [id, entry] of Object.entries(index)) {
		const names = uiNames.get(Number(id));
		if (!names) continue;

		// Ordered by id, which only roughly tracks release order, so this is a weak signal on its own.
		const catalogue = (gameSkins.get(Number(id)) ?? []).slice().sort((a, b) => a.id - b.id);
		const rigs = entry.skins ?? {};

		entry.skinRigs = names.map((name, position) => {
			// The artwork matcher counts skins the way the old image filenames did, from one.
			const art = artMatches[id]?.[String(position + 1)] ?? null;
			const named = matchSkin(name, position, catalogue, names);

			if (art && named) {
				agreement[art.skin === named.skin.id ? "agree" : "disagree"]++;
				if (art.skin !== named.skin.id) {
					const label = (skinId) => catalogue.find((candidate) => candidate.id === skinId)?.name ?? "?";
					disagreements.push(`doll ${id} "${name}": art ${art.skin} ${label(art.skin)} by ${art.margin} / ${named.how} ${named.skin.id} ${label(named.skin.id)}`);
				}
			}

			const choice = chooseSkin(named, art);
			if (!choice) {
				unmatched++;
				return null;
			}
			strategy[choice.how] = (strategy[choice.how] ?? 0) + 1;
			const rig = rigs[String(choice.skinId)];
			if (!rig) {
				withoutRig++;
				return null;
			}
			matched++;
			return rig;
		});
		// The id-keyed form has no consumer once positions are resolved.
		delete entry.skins;
	}

	fs.writeFileSync(indexPath, `${JSON.stringify(index)}\n`);
	console.log(`updated ${indexPath} (${(fs.statSync(indexPath).size / 1024).toFixed(0)} KB)`);
	console.log(`  skins matched to a rig   ${matched}`);
	console.log(`  skins with no rig        ${withoutRig}`);
	console.log(`  no match at all          ${unmatched}`);
	console.log(`  matched by               ${JSON.stringify(strategy)}`);
	console.log(`  art against names        ${JSON.stringify(agreement)}`);
	disagreements.slice(0, 15).forEach((line) => console.log(`     ${line}`));
}

main();
