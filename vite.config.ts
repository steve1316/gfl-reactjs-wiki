import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pages serves the site from /gfl-reactjs-wiki/, while Docker and local previews serve it from the
// root. VITE_BASE lets the same source produce both without the two configurations conflicting.
export default defineConfig({
	base: process.env.VITE_BASE ?? "/gfl-reactjs-wiki/",
	plugins: [react()],
	resolve: {
		alias: [
			// MUI v4 ships an ESM build but only maps the barrel through its `module` field, so deep
			// imports such as `@material-ui/icons/Menu` resolve to CommonJS. Vite's interop then wraps
			// those a second time, and the icon arrives as `{ default: Component }`, which React rejects
			// with "Element type is invalid". Pointing deep icon imports at the ESM build avoids both the
			// double wrap and the cost of pulling in the whole icon barrel.
			{ find: /^@material-ui\/icons\/(?!esm\/)(.*)$/, replacement: "@material-ui/icons/esm/$1" }
		]
	},
	build: {
		outDir: "build",
		sourcemap: true
	}
});
