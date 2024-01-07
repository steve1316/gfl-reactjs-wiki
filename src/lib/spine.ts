/**
 * Loads and drives the vendored Spine 2.1 runtime.
 *
 * The game ships Spine 2.1 skeletons and no maintained web runtime reads them, so `public/vendor/spine`
 * carries a frozen copy of PixiJS 4 plus a Girls' Frontline patched pixi-spine. See the README there.
 *
 * The runtime is plain UMD that expects to be loaded through script tags and to find its globals on
 * `window`, so it is injected on demand rather than imported. Nothing here runs until a doll page
 * actually wants an animation, which keeps 1.5 MB of vendor code off every other route.
 */

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Runtime loading

/** Script filenames, in the order they must load. */
const RUNTIME_SCRIPTS = ["pixi.js", "pixi-spine-sjzs.js", "skb.js"];

/** Shared across callers so the 1.5 MB runtime is fetched at most once per session. */
let runtimePromise: Promise<void> | undefined;

/**
 * Inject one script and wait for it.
 *
 * @param src URL to load.
 * @returns A promise that settles when the script has run.
 */
function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = false;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`failed to load ${src}`));
		document.head.appendChild(script);
	});
}

/**
 * Load the Spine runtime, once.
 *
 * @returns A promise that settles when `PIXI.spine` and `SkeletonBinary` are available.
 */
export function loadSpineRuntime(): Promise<void> {
	if (runtimePromise) {
		return runtimePromise;
	}

	// These four must exist before pixi.js evaluates or it throws a ReferenceError on load. Only the
	// first three appear in naganeko's own HTML. `enable_clear_fail_step` is never assigned anywhere in
	// that project and gates whether flipX/flipY timelines are built, so it has to be falsy.
	const globals = window as unknown as Record<string, unknown>;
	globals.test_PMA_base = true;
	globals.test_PMA_Texture = false;
	globals.test_PMA_glstore = true;
	globals.enable_clear_fail_step = false;

	const base = `${import.meta.env.BASE_URL}vendor/spine/`;
	runtimePromise = RUNTIME_SCRIPTS.reduce(
		(chain, name) => chain.then(() => loadScript(`${base}${name}`)),
		Promise.resolve()
	);
	return runtimePromise;
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Player

/** A mounted Spine animation, and the handles needed to drive or dispose of it. */
export interface SpinePlayer {
	/** Animation names this skeleton defines. */
	animations: string[];
	/** Play one animation by name, looping. Unknown names are ignored. */
	play: (name: string) => void;
	/** Tear down the renderer and free its WebGL context. */
	destroy: () => void;
}

/** What `createSpinePlayer` needs to build a skeleton. */
export interface SpinePlayerOptions {
	/** Element to mount the canvas into. */
	container: HTMLElement;
	/** URL of the binary `.skel`. */
	skelUrl: string;
	/** URL of the `.atlas`. */
	atlasUrl: string;
	/** Directory the atlas's page images sit in, with a trailing slash. */
	imageBase: string;
	/** Canvas size in CSS pixels. */
	size?: number;
	/** Animation to start with. */
	initialAnimation?: string;
}

/**
 * Build a Spine player and mount it.
 *
 * @param options Where to mount and what to load.
 * @returns The mounted player.
 */
export async function createSpinePlayer(options: SpinePlayerOptions): Promise<SpinePlayer> {
	await loadSpineRuntime();

	const size = options.size ?? 250;
	const PIXI = (window as unknown as { PIXI: any }).PIXI;
	const SkeletonBinary = (window as unknown as { SkeletonBinary: any }).SkeletonBinary;
	const runtime = PIXI.spine.SpineRuntime;

	const [skelBuffer, atlasText] = await Promise.all([
		fetch(options.skelUrl).then((response) => response.arrayBuffer()),
		fetch(options.atlasUrl).then((response) => response.text())
	]);

	// The .skel is Spine's binary format; skb.js converts it to the JSON the runtime parses.
	const binary = new SkeletonBinary();
	binary.data = new Uint8Array(skelBuffer);
	binary.scale = 1;
	binary.initJson();

	// The loader middleware does not fire for an in-memory skeleton, so the atlas chain is built by hand.
	//
	// The runtime's own `syncImageLoaderAdapter` cannot be used here: it accepts a baseUrl, carefully
	// appends a trailing slash to it, and then never reads it again, calling
	// `BaseTexture.fromImage(line)` with the bare filename from the atlas. Pages served from the same
	// directory as their images never notice. Ours are on a different host, so the texture resolved
	// against the page and 404'd, leaving a skeleton that posed and animated correctly while drawing
	// nothing at all.
	//
	// crossOrigin matters for the same reason: WebGL refuses to upload a texture from an image that was
	// not fetched in CORS mode. The asset host sends `access-control-allow-origin: *`.
	const loadPage = (line: string, callback: (texture: unknown) => void) => {
		callback(PIXI.Texture.fromImage(`${options.imageBase}${line}`, "anonymous").baseTexture);
	};
	const atlas = new runtime.Atlas(atlasText, loadPage, () => {});
	const skeletonData = new runtime.SkeletonJsonParser(new runtime.AtlasAttachmentParser(atlas)).readSkeletonData(binary.json);

	const app = new PIXI.Application(size, size, { backgroundColor: 0x000000, transparent: true, antialias: true });
	options.container.appendChild(app.view);

	const spine = new PIXI.spine.Spine(skeletonData);
	// Skeletons are authored with the origin at the feet, so the sprite is anchored near the bottom.
	spine.x = size / 2;
	spine.y = size * 0.92;
	app.stage.addChild(spine);

	const animations: string[] = skeletonData.animations.map((animation: { name: string }) => animation.name);

	/**
	 * Play an animation by name.
	 *
	 * @param name The animation to play.
	 */
	const play = (name: string) => {
		// This runtime's setAnimation takes an Animation object, not a name. Passing a string fails at
		// the first tick with "current.animation.apply is not a function".
		const animation = skeletonData.findAnimation(name);
		if (animation) {
			spine.state.setAnimation(0, animation, true);
		}
	};

	const first = options.initialAnimation && animations.includes(options.initialAnimation) ? options.initialAnimation : animations[0];
	if (first) {
		play(first);
	}

	return {
		animations,
		play,
		destroy: () => {
			app.destroy(true, { children: true, texture: true, baseTexture: true });
		}
	};
}
