import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pages serves the site from /gfl-reactjs-wiki/, while Docker and local previews serve it from the
// root. VITE_BASE lets the same source produce both without the two configurations conflicting.
export default defineConfig({
	base: process.env.VITE_BASE ?? "/gfl-reactjs-wiki/",
	plugins: [react()],
	build: {
		outDir: "build",
		sourcemap: true
	}
});
