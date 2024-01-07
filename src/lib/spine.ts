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
// Animation names

/**
 * Alternative names a skeleton may use for the same animation.
 *
 * The GIF filenames and the skeletons do not always agree. Sixty-eight dolls call their skill
 * animation `s`, against three that spell it out, and a handful use the game's internal names for
 * special attacks. Resolving through this table is what keeps a tab from doing nothing when clicked.
 */
const ANIMATION_ALIASES: Record<string, string[]> = {
	skill: ["skill", "s"],
	skill2: ["skill2", "s2"],
	crouch: ["crouch", "squat"],
	spattack: ["spattack", "spa", "sp1", "sp"],
	spattack2: ["spattack2", "spc", "sp2"],
	attack2: ["attack2", "attack1"],
	reload: ["reload", "squatreload"]
};

/**
 * Find the name a skeleton actually uses for a requested animation.
 *
 * @param available Animation names the skeleton defines.
 * @param name The name the UI asked for.
 * @returns The matching skeleton animation name, or undefined when it has none.
 */
export function resolveAnimation(available: readonly string[], name: string): string | undefined {
	for (const candidate of ANIMATION_ALIASES[name] ?? [name]) {
		if (available.includes(candidate)) {
			return candidate;
		}
	}
	return undefined;
}

/**
 * Human-readable labels for skeleton animation names.
 *
 * Several names are the game's internal ones rather than anything a reader would recognise, and a few
 * skeletons carry animations the GIF era never exposed at all, such as the RF `snipe` pose.
 */
const ANIMATION_LABELS: Record<string, string> = {
	wait: "Wait",
	wait2: "Wait 2",
	move: "Move",
	attack: "Attack",
	attack1: "Attack",
	attack2: "Attack 2",
	reload: "Reload",
	squatreload: "Reload (Crouched)",
	s: "Skill",
	skill: "Skill",
	skill2: "Skill 2",
	crouch: "Crouch",
	squat: "Crouch",
	snipe: "Snipe",
	action: "Action",
	action1: "Action",
	action2: "Action 2",
	spattack: "Special Attack",
	spattack2: "Special Attack 2",
	spa: "Special Attack",
	spc: "Special Attack 2",
	sp: "Special",
	sp1: "Special 1",
	sp2: "Special 2",
	landing: "Landing",
	die: "Die",
	victory: "Victory",
	victory2: "Victory 2",
	victoryloop: "Victory Loop",
	pick: "Pick",
	sit: "Sit",
	sit2: "Sit 2",
	lying: "Lying",
	violin: "Violin",
	book: "Book",
	therun2: "Run"
};

/** Preferred tab order. Anything not listed keeps its relative order and follows these. */
const ANIMATION_ORDER = [
	"wait", "wait2", "move", "attack", "attack1", "attack2", "snipe", "reload", "squatreload",
	"s", "skill", "skill2", "crouch", "squat", "action", "action1", "action2",
	"spattack", "spa", "spattack2", "spc", "sp", "sp1", "sp2", "landing",
	"die", "victory", "victory2", "victoryloop", "pick", "sit", "sit2", "lying"
];

/** One animation tab: the skeleton's own name, and what to show for it. */
export interface AnimationTab {
	/** The skeleton's animation name, used verbatim to play it. */
	value: string;
	/** Label for the tab. */
	label: string;
}

/**
 * Build the tab list for a skeleton.
 *
 * Every animation the skeleton defines gets a tab. Deriving the list from a fixed set instead left
 * real animations unreachable: `snipe` on nine rifles, and the dorm poses on three dolls that keep
 * them inside the combat rig rather than a separate one.
 *
 * @param available Animation names the skeleton defines.
 * @returns Tabs in a stable, readable order.
 */
export function animationTabs(available: readonly string[]): AnimationTab[] {
	const rank = (name: string) => {
		const index = ANIMATION_ORDER.indexOf(name);
		return index === -1 ? ANIMATION_ORDER.length : index;
	};
	return [...available]
		.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
		.map((value) => ({
			value,
			// Unknown names are shown as-is rather than hidden, so nothing is silently unreachable.
			label: ANIMATION_LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
		}));
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
	app.stage.addChild(spine);

	// How far the drawn artwork extends past the bone positions, measured once from the setup pose.
	// Bones sit inside the silhouette, so fitting to bones alone crops hair, weapons and coat tails.
	let padLeft = 0;
	let padRight = 0;
	let padTop = 0;
	let padBottom = 0;

	{
		const skeleton = spine.skeleton;
		skeleton.setToSetupPose();
		skeleton.updateWorldTransform();
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const bone of skeleton.bones) {
			minX = Math.min(minX, bone.worldX);
			maxX = Math.max(maxX, bone.worldX);
			minY = Math.min(minY, bone.worldY);
			maxY = Math.max(maxY, bone.worldY);
		}
		spine.x = 0;
		spine.y = 0;
		spine.scale.set(1);
		app.renderer.render(app.stage);
		const drawn = spine.getLocalBounds();
		padLeft = Math.max(0, minX - drawn.x);
		padRight = Math.max(0, drawn.x + drawn.width - maxX);
		padTop = Math.max(0, minY - drawn.y);
		padBottom = Math.max(0, drawn.y + drawn.height - maxY);
	}

	/**
	 * Position and scale the skeleton so the whole animation stays in frame.
	 *
	 * Not every animation plays in place. Desert Eagle's `victoryloop` translates the rig far enough
	 * left that a sprite pinned at a fixed spot leaves the canvas entirely and the animation looks
	 * broken rather than merely off-centre. The extent is sampled across the whole duration, so the
	 * framing is chosen once and does not drift while it plays.
	 *
	 * @param animation The animation about to play.
	 */
	const fitToAnimation = (animation: { duration: number; apply: (...args: unknown[]) => void }) => {
		const skeleton = spine.skeleton;
		const steps = 20;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let step = 0; step <= steps; step++) {
			const time = (animation.duration * step) / steps;
			skeleton.setToSetupPose();
			animation.apply(skeleton, time, time, false, []);
			skeleton.updateWorldTransform();
			for (const bone of skeleton.bones) {
				minX = Math.min(minX, bone.worldX);
				maxX = Math.max(maxX, bone.worldX);
				minY = Math.min(minY, bone.worldY);
				maxY = Math.max(maxY, bone.worldY);
			}
		}

		if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
			return;
		}

		// A little breathing room on top of the measured artwork so nothing grazes the edge.
		const breathing = size * 0.04;
		minX -= padLeft + breathing;
		maxX += padRight + breathing;
		minY -= padTop + breathing;
		maxY += padBottom + breathing;

		// Never enlarge, only shrink to fit. Scaling a chibi up looks worse than leaving it small.
		const fit = Math.min(size / (maxX - minX), size / (maxY - minY), 1);
		spine.scale.set(fit);
		// pixi-spine already flips the Y axis, so these bone coordinates share Pixi's orientation and
		// both axes centre the same way. Adding on Y instead pushes the skeleton off the top.
		spine.x = size / 2 - ((minX + maxX) / 2) * fit;
		spine.y = size / 2 - ((minY + maxY) / 2) * fit;
	};

	const animations: string[] = skeletonData.animations.map((animation: { name: string }) => animation.name);

	/**
	 * Play an animation by name.
	 *
	 * @param name The animation to play.
	 */
	const play = (name: string) => {
		// This runtime's setAnimation takes an Animation object, not a name. Passing a string fails at
		// the first tick with "current.animation.apply is not a function".
		const animation = skeletonData.findAnimation(resolveAnimation(animations, name) ?? name);
		if (animation) {
			fitToAnimation(animation);
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
