#!/usr/bin/env node
/**
 * Tell the scheduled refresh whether it has work, without writing any data.
 *
 * Reads only the gun table and its names from a gf-data-us checkout, which the workflow fetches sparsely at the latest commit. Prints the
 * plan as JSON and, inside GitHub Actions, appends `work=true` or `work=false` to `$GITHUB_OUTPUT`.
 *
 * Usage:
 *     node tools/data/plan.mjs --gf-data <dir> --latest <sha> [--date YYYY-MM-DD]
 */

import fs from "node:fs";

import { selectReleased } from "./lib/dolls.mjs";
import { planRefresh } from "./lib/plan.mjs";
import { SHARDS } from "./lib/shards.mjs";
import { loadUpstream, readLock } from "./lib/upstream.mjs";

/**
 * Read the value after a command-line flag.
 *
 * @param {string[]} args Command-line arguments.
 * @param {string} name The flag, such as `--latest`.
 * @returns {string | undefined} The value, or undefined when the flag is absent.
 */
function flagValue(args, name) {
	const index = args.indexOf(name);
	return index === -1 ? undefined : args[index + 1];
}

/**
 * Build and print the plan.
 */
function main() {
	const args = process.argv.slice(2);
	const gfData = flagValue(args, "--gf-data");
	const latest = flagValue(args, "--latest");
	const cutoff = flagValue(args, "--date") ?? new Date().toISOString().slice(0, 10);
	if (!gfData || !latest) {
		console.error("usage: node tools/data/plan.mjs --gf-data <dir> --latest <sha> [--date YYYY-MM-DD]");
		process.exit(1);
	}
	const committedIds = SHARDS.flatMap((shard) => JSON.parse(fs.readFileSync(`src/data/${shard.file}.json`, "utf8")).map((doll) => doll.normal.id));
	const extraIds = JSON.parse(fs.readFileSync("tools/data/overrides.json", "utf8")).addDolls.map((doll) => doll.normal.id);
	const releasedIds = selectReleased(loadUpstream(gfData), cutoff).map((gun) => gun.id);
	const plan = planRefresh({ lockedSha: readLock().sha, latestSha: latest, releasedIds, committedIds, extraIds });
	console.log(JSON.stringify(plan));
	if (process.env.GITHUB_OUTPUT) {
		fs.appendFileSync(process.env.GITHUB_OUTPUT, `work=${plan.work}\n`);
	}
}

main();
