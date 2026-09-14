import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig } from "vite";
import type { Connect, Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Pages serves the site from /gfl-reactjs-wiki/, while Docker and local previews serve it from the
// root. VITE_BASE lets the same source produce both without the two configurations conflicting.
const BASE = process.env.VITE_BASE ?? "/gfl-reactjs-wiki/";

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

/**
 * Redirect the base path without its trailing slash to the base path, in the dev and preview servers.
 *
 * Vite answers `/gfl-reactjs-wiki` with a "did you mean /gfl-reactjs-wiki/" notice instead of the app, and the router writes that
 * slash-less address when it navigates home. GitHub Pages already redirects it, so this only brings the local servers in line.
 *
 * @returns The Vite plugin.
 */
function baseTrailingSlash(): Plugin {
	const bare = BASE.replace(/\/$/, "");
	const redirect: Connect.NextHandleFunction = (req, res, next) => {
		const url = req.url ?? "";
		const queryStart = url.indexOf("?");
		const path = queryStart === -1 ? url : url.slice(0, queryStart);
		if (bare === "" || path !== bare) {
			next();
			return;
		}
		res.statusCode = 302;
		res.setHeader("Location", `${BASE}${queryStart === -1 ? "" : url.slice(queryStart)}`);
		res.end();
	};
	return {
		name: "base-trailing-slash",
		configureServer(server) {
			server.middlewares.use(redirect);
		},
		configurePreviewServer(server) {
			server.middlewares.use(redirect);
		}
	};
}

export default defineConfig({
	base: BASE,
	plugins: [react(), spaFallback(), baseTrailingSlash()],
	build: {
		outDir: "build",
		sourcemap: true
	}
});
