/**
 * Loads and drives the vendored Live2D Cubism 4 runtime.
 *
 * The game ships some fairies and HOCs as Live2D models, which need Cubism Core plus a WebGL renderer that neither
 * this repo nor any maintained npm package provides pre-typed. `public/vendor/live2d` carries a frozen copy of
 * Cubism Core, pixi.js and pixi-live2d-display. See the licence notice there.
 *
 * Like `src/lib/spine.ts`, the runtime is plain UMD that expects to be loaded through script tags and to find its
 * globals on `window`, so it is injected on demand rather than imported. Nothing here runs until a Live2D view
 * actually wants a model, which keeps its ~790 KB off every other route.
 */

import { LIVE2D_RUNTIME_BASE, LIVE2D_RUNTIME_SCRIPTS } from "./live2dPreload";
import { claimPixiGlobal, withLoadLock } from "./pixiRuntimeLock";

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Runtime globals
//
// The vendored files ship no TypeScript types, so the shapes below are declared by hand, narrowed to exactly what
// this module calls. This is the one place that reaches onto `window` for them.

/** The subset of a loaded `Live2DModel` this module uses. */
interface Live2dModel {
	/** Natural width of the model, in its own local units. Reflects the current `scale` once one has been set. */
	width: number;
	/** Natural height of the model, in its own local units. Reflects the current `scale` once one has been set. */
	height: number;
	/** X position of the model's origin on the stage. */
	x: number;
	/** Y position of the model's origin on the stage. */
	y: number;
	/** Uniform scale applied to the model. */
	scale: { set(value: number): void };
	/** The loaded Cubism model and its motion state. */
	internalModel: { motionManager: { definitions: Record<string, unknown> } };
	/** Whether the model advances on the shared ticker. Its motion clock only moves while this is on, so turning it off freezes the motion. */
	autoUpdate: boolean;
	/**
	 * Start playing a motion group. Looping is driven by the `Loop` flag baked into the motion's own JSON, so nothing
	 * here needs to restart it.
	 *
	 * @param group Motion group name, exactly as it appears in the model's `model3.json`.
	 * @param index Index of the motion within the group.
	 * @param priority Playback priority; a higher priority pre-empts whatever is currently playing.
	 * @returns Whether the motion started.
	 */
	motion(group: string, index: number, priority: number): Promise<boolean>;
}

/** Options accepted by `Live2DModel.from`. */
interface Live2dModelOptions {
	/** Disables the runtime's own pointer-following and tap handling, since callers drive interaction through `Live2dStage` instead. */
	autoInteract: boolean;
}

/** The pixi-live2d-display plugin namespace pixi.js exposes as `PIXI.live2d` once all three scripts have loaded. */
interface Live2dPlugin {
	Live2DModel: {
		from(url: string, options: Live2dModelOptions): Promise<Live2dModel>;
		/**
		 * Set the ticker every model advances on. Without it, the plugin looks up `window.PIXI.Ticker` the first time a model turns
		 * on its updates, which may be the Spine runtime's global by then.
		 *
		 * @param ticker The `Ticker` class of the pixi.js build the plugin is attached to.
		 */
		registerTicker(ticker: unknown): void;
	};
	MotionPriority: { FORCE: number };
}

/** Options accepted by the pixi.js `Application` constructor, narrowed to what this module passes. */
interface PixiApplicationOptions {
	/** Existing canvas to render into, owned by the caller rather than created here. */
	view: HTMLCanvasElement;
	/** Renderer width in CSS pixels. */
	width: number;
	/** Renderer height in CSS pixels. */
	height: number;
	/** Fill colour behind the model when `transparent` is false. */
	backgroundColor: number;
	/** Whether the canvas clears to transparent instead of `backgroundColor`. */
	transparent: boolean;
	/** Whether the renderer starts its own render loop immediately. */
	autoStart: boolean;
}

/** A pixi.js `Application` instance, narrowed to what this module calls. */
interface PixiApplication {
	stage: { addChild(child: Live2dModel): void };
	/** Start the application's render loop. */
	start(): void;
	/** Stop the application's render loop. The canvas keeps showing the last frame it drew. */
	stop(): void;
	/**
	 * Tear the application down and release its WebGL context.
	 *
	 * @param removeView Whether to also detach the canvas from the DOM. False here since the caller owns the canvas element.
	 * @param stageOptions Whether to also destroy the stage's children, their textures and base textures.
	 */
	destroy(removeView: boolean, stageOptions: { children: boolean; texture: boolean; baseTexture: boolean }): void;
}

/** The pixi.js global `settings` object, narrowed to the one flag this module sets. */
interface PixiSettings {
	/** Whether image textures are decoded into an `ImageBitmap` off the main thread before upload, instead of synchronously inside the first upload. */
	CREATE_IMAGE_BITMAP: boolean;
}

/** The `PIXI` UMD global, narrowed to what this module uses. `pixi-live2d-display` attaches itself at `PIXI.live2d` once loaded. */
interface PixiGlobal {
	Application: new (options: PixiApplicationOptions) => PixiApplication;
	/** The pixi.js `Ticker` class, whose shared instance drives model updates. */
	Ticker: unknown;
	live2d: Live2dPlugin;
	/** Global defaults read by pixi.js whenever it creates a resource. */
	settings: PixiSettings;
}

declare global {
	interface Window {
		PIXI?: PixiGlobal;
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Runtime loading

/** The motion group name the publish pipeline always gives the idle animation, on both fairies and HOCs. */
const IDLE_MOTION_GROUP = "Idle";

/** Shared across callers so the ~790 KB runtime is fetched at most once per session. */
let runtimePromise: Promise<void> | undefined;

/**
 * The Live2D runtime's own `PIXI` (v6, with `.live2d` attached), captured the moment its scripts finish loading. `lib/spine.ts` loads a
 * different major version of PixiJS onto the same `window.PIXI` global, and its vendored code reads that bare global every frame and
 * whenever a new attachment appears, so a chibi breaks the moment the global points at this runtime instead. Nothing in this runtime
 * reads the global once its scripts have run and `loadLive2dRuntime` has registered the plugin's ticker, so everything here uses this
 * capture and the loader hands the global straight back to its previous owner.
 */
let live2dPixi: PixiGlobal | undefined;

/** The currently mounted stage, if any. Kept so creating another stage can destroy this one first. */
let currentStage: Live2dStage | undefined;

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
 * Load the Live2D runtime, once.
 *
 * @returns A promise that settles once the runtime's own `PIXI`, with `.live2d` attached, has been captured in `live2dPixi`.
 */
export function loadLive2dRuntime(): Promise<void> {
	if (runtimePromise) {
		return runtimePromise;
	}

	// Queued behind `withLoadLock` so a concurrent first load of the Spine runtime cannot interleave its scripts
	// with these: see `pixiRuntimeLock.ts` for why that would attach `.live2d` to the wrong `PIXI` object.
	// Each script is still injected only once the one before it has run. `preloadLive2dRuntime` has usually already started all three
	// downloading, so each injection runs its preloaded copy straight away instead of starting a download of its own.
	runtimePromise = withLoadLock(() => {
		// pixi.js takes over the global while these scripts run, and pixi-live2d-display attaches itself to whatever the global is when it
		// runs. Whatever owned it before, usually the Spine runtime's PIXI with a chibi still animating, gets it back afterwards.
		const previousPixi = window.PIXI;
		return LIVE2D_RUNTIME_SCRIPTS.reduce((chain, name) => chain.then(() => loadScript(`${LIVE2D_RUNTIME_BASE}${name}`)), Promise.resolve())
			.then(() => {
				live2dPixi = window.PIXI;
				// Decode textures off the main thread. A 2048px texture otherwise decodes inside its first upload, a ~100 ms desktop and
				// ~800 ms mobile long task. Set on this runtime's own pixi v6 `settings` only, never on the Spine runtime's pixi v4.
				if (live2dPixi) {
					live2dPixi.settings.CREATE_IMAGE_BITMAP = true;
					// Hand the plugin its ticker now, while the global is still this runtime's. Left to itself, it reads `window.PIXI.Ticker`
					// when the first model initialises, by which point the global belongs to the Spine runtime again. It then finds no
					// ticker and that model draws one frame but never animates.
					live2dPixi.live2d.Live2DModel.registerTicker(live2dPixi.Ticker);
				}
			})
			.finally(() => {
				claimPixiGlobal(previousPixi);
			});
	});
	return runtimePromise;
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Stage

/** A mounted Live2D model, and the handles needed to drive or dispose of it. */
export interface Live2dStage {
	/** Play a motion by its group name, looping per the motion's own data. Unknown names are ignored by the runtime. */
	playMotion(name: string): void;
	/** Stop or restart updating and rendering. Resuming carries on from the same point in the current motion rather than restarting it. */
	setPaused(paused: boolean): void;
	/** Tear down the renderer and free its WebGL context. */
	destroy(): void;
}

/**
 * Build a Live2D stage on a canvas and mount a model. Only one stage may exist at a time: this destroys whatever
 * stage a previous call created, so navigating between models never leaks a WebGL context.
 *
 * @param canvas Canvas to render into, sized by the caller before this is called.
 * @param modelUrl URL of the model's `model3.json`.
 * @returns The mounted stage.
 */
export async function createLive2dStage(canvas: HTMLCanvasElement, modelUrl: string): Promise<Live2dStage> {
	await loadLive2dRuntime();

	const PIXI = live2dPixi;
	if (!PIXI) {
		throw new Error("Live2D runtime failed to load");
	}
	currentStage?.destroy();

	const width = canvas.width;
	const height = canvas.height;
	// Transparent rather than the spike's opaque grey, so the model sits on the page's own dark background instead of
	// a mismatched square. preserveDrawingBuffer is dropped too: the spike needed it so a screenshot script could read
	// the canvas back after the render loop had moved on, but nothing here reads pixels back, so the default (false,
	// letting the browser discard the buffer between frames) is cheaper.
	const app = new PIXI.Application({ view: canvas, width, height, backgroundColor: 0x000000, transparent: true, autoStart: true });

	// A model URL comes from a separate asset host over a raw GitHub link, so a 404 or malformed file is a realistic
	// failure, not an edge case. Nothing holds a reference to `app` once this function returns, so a rejection here
	// has to destroy it itself or its WebGL context leaks silently.
	let model: Live2dModel;
	try {
		model = await PIXI.live2d.Live2DModel.from(modelUrl, { autoInteract: false });
	} catch (error) {
		app.destroy(false, { children: true, texture: true, baseTexture: true });
		throw error;
	}

	// Fit against the model's natural size, then set scale, then re-read width/height: pixi.js reports both already
	// multiplied by the current scale, so centring afterwards needs no second multiplication.
	const fit = Math.min(width / model.width, height / model.height) * 0.95;
	model.scale.set(fit);
	model.x = (width - model.width) / 2;
	model.y = (height - model.height) / 2;
	app.stage.addChild(model);

	let destroyed = false;
	let paused = false;

	/**
	 * Play a motion group, ignoring a rejected or unresolved promise since `Live2dStage.playMotion` is fire-and-forget.
	 *
	 * @param group Motion group name to play.
	 */
	const play = (group: string) => {
		model.motion(group, 0, PIXI.live2d.MotionPriority.FORCE).catch(() => undefined);
	};

	const definitionNames = Object.keys(model.internalModel.motionManager.definitions);
	play(definitionNames.includes(IDLE_MOTION_GROUP) ? IDLE_MOTION_GROUP : (definitionNames[0] ?? IDLE_MOTION_GROUP));

	const stage: Live2dStage = {
		playMotion(name: string) {
			if (!destroyed) {
				play(name);
			}
		},
		setPaused(next: boolean) {
			if (destroyed || next === paused) {
				return;
			}
			paused = next;
			// Dropping the model off the shared ticker freezes its motion clock, and stopping the application's own ticker stops rendering.
			// Neither touches the motion queue, so resuming picks the current motion up where it left off.
			model.autoUpdate = !next;
			if (next) {
				app.stop();
			} else {
				app.start();
			}
		},
		destroy() {
			if (destroyed) {
				return;
			}
			destroyed = true;
			// removeView is false: the canvas element belongs to the caller, only the renderer and its WebGL context go here.
			app.destroy(false, { children: true, texture: true, baseTexture: true });
			if (currentStage === stage) {
				currentStage = undefined;
			}
		}
	};
	currentStage = stage;
	return stage;
}
