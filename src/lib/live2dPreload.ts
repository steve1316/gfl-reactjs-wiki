/**
 * Starts a Live2D stage's downloads as soon as it is asked for a model, all at once instead of one after another.
 *
 * Left alone, every download waits on the one before it. `lib/live2d.ts` runs its three runtime scripts in order, and pixi-live2d-display
 * then fetches `model3.json`, then the moc3 and textures, then physics, each only once the step before has finished. This module starts
 * all of them in parallel instead. The runtime scripts go through `<link rel="preload">`, which downloads a script without running it,
 * so execution order and `withLoadLock` in `lib/live2d.ts` stay exactly as they were. The model files go through plain `fetch` calls
 * whose responses land in the HTTP cache, where the runtime's own requests for the same URLs find them.
 *
 * This is a separate module from `lib/live2d.ts` so the stage hook can call it straight away, without first waiting on that chunk's own
 * dynamic import.
 */

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Module state

/** Script filenames, in the order `lib/live2d.ts` must run them: Cubism Core, then pixi.js, then the pixi-live2d-display plugin. */
export const LIVE2D_RUNTIME_SCRIPTS = ["live2dcubismcore.min.js", "pixi.min.js", "pixi-live2d-display.cubism4.min.js"];

/** Folder the vendored Live2D runtime is served from, with a trailing slash. */
export const LIVE2D_RUNTIME_BASE = `${import.meta.env.BASE_URL}vendor/live2d/`;

/** Whether the runtime scripts have been handed to the browser as preloads yet. The runtime loads once per session, so this only happens once. */
let runtimePreloaded = false;

/** Model URLs whose files have already been fetched through once this session, so switching back to a model does not read them all again. */
const warmedModels = new Set<string>();

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Preloading

/** The parts of a `model3.json` this module reads. Every field is checked before use, since the file comes from a separate asset host. */
interface Model3Json {
	/** Paths of the model's files, relative to the `model3.json` itself. */
	FileReferences?: {
		/** Path of the compiled `.moc3` model. */
		Moc?: unknown;
		/** Paths of the texture atlas images. */
		Textures?: unknown;
		/** Path of the `.physics3.json` settings, on models that have physics. */
		Physics?: unknown;
	};
}

/**
 * Hand the runtime scripts to the browser as preloads, so all three download in parallel. Only the first call does anything.
 */
export function preloadLive2dRuntime(): void {
	if (runtimePreloaded) {
		return;
	}
	runtimePreloaded = true;
	// No `crossOrigin`, matching the plain `<script>` tags `lib/live2d.ts` injects, or the browser would not reuse the preloaded response.
	for (const name of LIVE2D_RUNTIME_SCRIPTS) {
		const link = document.createElement("link");
		link.rel = "preload";
		link.as = "script";
		link.href = `${LIVE2D_RUNTIME_BASE}${name}`;
		document.head.appendChild(link);
	}
}

/**
 * Start downloading a model's `model3.json` and, once it has parsed, its moc3, textures and physics in parallel.
 *
 * Each request is a default `fetch`: a CORS GET that sends no credentials to the asset host, the same as the runtime's own XHRs and
 * `crossorigin="anonymous"` images, so the HTTP cache serves the runtime's requests. Bodies are read to the end so each response is
 * cached whole. Motions are left alone, since a model has many small ones and most never play. A failed warm-up is ignored, because
 * the runtime then simply fetches that file itself, exactly as it would have anyway.
 *
 * @param modelUrl URL of the model's `model3.json`.
 * @param signal Cancels every request still in flight, for a stage that unmounts or switches models before it finishes loading.
 */
export function warmLive2dModel(modelUrl: string, signal: AbortSignal): void {
	if (warmedModels.has(modelUrl)) {
		return;
	}
	fetch(modelUrl, { signal })
		.then((response) => (response.ok ? (response.json() as Promise<Model3Json>) : undefined))
		.then((model) => {
			const references = model?.FileReferences;
			const textures: unknown[] = Array.isArray(references?.Textures) ? references.Textures : [];
			const files = [references?.Moc, ...textures, references?.Physics].filter((file): file is string => typeof file === "string");
			const base = new URL(modelUrl, document.baseURI);
			return Promise.all(files.map((file) => fetch(new URL(file, base).href, { signal }).then((response) => response.blob())));
		})
		.then(() => {
			warmedModels.add(modelUrl);
		})
		.catch(() => undefined);
}
