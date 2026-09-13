import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Copy the built index.html to 404.html.
 *
 * GitHub Pages has no rewrite rules, so a direct visit to a route like /tdoll/280 would get its 404 page. Serving the
 * app as that 404 page lets the router take over and render the route.
 *
 * @returns The Vite plugin.
 */
function spaFallback(): Plugin {
	return {
		name: "spa-fallback",
		apply: "build",
		closeBundle() {
			const outDir = resolve(__dirname, "build");
			copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
		}
	};
}

// Pages serves the site from /gfl-reactjs-wiki/, while Docker and local previews serve it from the
// root. VITE_BASE lets the same source produce both without the two configurations conflicting.
export default defineConfig({
	base: process.env.VITE_BASE ?? "/gfl-reactjs-wiki/",
	plugins: [react(), spaFallback()],
	build: {
		outDir: "build",
		sourcemap: true
	}
});
