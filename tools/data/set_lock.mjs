#!/usr/bin/env node
/**
 * Move the pinned gf-data-us and gf-data-ch commits in `tools/data/upstream.lock.json`.
 *
 * Usage:
 *     node tools/data/set_lock.mjs --us <sha> --cn <sha>
 */

import fs from "node:fs";

import { LOCK_FILE, setLockShas } from "./lib/upstream.mjs";

/**
 * Read the value after a command-line flag.
 *
 * @param {string[]} args Command-line arguments.
 * @param {string} name The flag, such as `--us`.
 * @returns {string | undefined} The value, or undefined when the flag is absent.
 */
function flagValue(args, name) {
	const index = args.indexOf(name);
	return index === -1 ? undefined : args[index + 1];
}

/**
 * Rewrite the lock file with the given pins.
 */
function main() {
	const args = process.argv.slice(2);
	const us = flagValue(args, "--us");
	const cn = flagValue(args, "--cn");
	if (!us || !cn) {
		console.error("usage: node tools/data/set_lock.mjs --us <sha> --cn <sha>");
		process.exit(1);
	}
	fs.writeFileSync(LOCK_FILE, setLockShas(fs.readFileSync(LOCK_FILE, "utf8"), { us, cn }));
	console.log(`pinned gf-data-us ${us.slice(0, 8)} and gf-data-ch ${cn.slice(0, 8)}`);
}

main();
