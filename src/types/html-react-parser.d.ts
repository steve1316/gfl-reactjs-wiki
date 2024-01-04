/**
 * Minimal types for `html-react-parser`.
 *
 * The package ships an `index.d.ts` but declares no `types` field and omits types from its `exports`
 * map, so bundler-style resolution cannot find them. Only the default export is used here.
 */
declare module "html-react-parser" {
	import type { ReactNode } from "react";

	/**
	 * Parse an HTML string into React nodes.
	 *
	 * @param html The HTML to parse.
	 * @returns The parsed nodes.
	 */
	export default function parse(html: string): ReactNode;
}
