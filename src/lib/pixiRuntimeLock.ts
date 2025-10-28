/**
 * Serialises the Spine and Live2D runtime loaders behind one shared queue.
 *
 * `lib/spine.ts` and `lib/live2d.ts` both inject a chain of UMD scripts with `script.async = false`, which puts
 * every injected script from both runtimes into one document-wide, in-order execution list. Each runtime's
 * augmentation script (`pixi-spine-sjzs.js`, `pixi-live2d-display`) mutates whatever `window.PIXI` happens to be at
 * the moment it runs, so if the two runtimes' first loads overlap, their six scripts can interleave and an
 * augmentation script can attach itself to the other runtime's `PIXI` object instead of its own. Routing both
 * loaders through `withLoadLock` guarantees one runtime's whole script chain finishes running, and captures its own
 * `PIXI`, before the other runtime's first script is even injected, so the interleaving can never happen.
 */

/** The tail of the shared load queue. Starts resolved so the first loader through runs immediately. */
let loadLock: Promise<void> = Promise.resolve();

/**
 * Run a runtime loader once the previous loader (if any) has settled, queuing this one behind it.
 *
 * @param loader Starts loading a runtime's scripts and returns a promise that settles once they have all run.
 * @returns The loader's own promise, so the caller sees its real result or rejection.
 */
export function withLoadLock<T>(loader: () => Promise<T>): Promise<T> {
	const result = loadLock.then(loader, loader);
	// Advance the queue on both success and failure, so one runtime failing to load never wedges the other.
	loadLock = result.then(
		() => undefined,
		() => undefined
	);
	return result;
}

/**
 * Point `window.PIXI` at one runtime's own captured `PIXI` instance.
 *
 * `lib/spine.ts` and `lib/live2d.ts` share this one global. The vendored Spine runtime reads it at the moment its code runs rather than
 * only once at load time, so `lib/spine.ts` calls this right before any synchronous block that runs vendored code, and again
 * immediately after resuming from an `await` inside one, since the Live2D loader can hold the global while its scripts run. The Live2D
 * runtime reads the global only while its own scripts load, so `lib/live2d.ts` calls this once, to hand the global back afterwards.
 *
 * @param pixi The `PIXI` instance to make current, or whatever owned the global before, which may be undefined.
 */
export function claimPixiGlobal(pixi: unknown): void {
	(window as unknown as { PIXI: unknown }).PIXI = pixi;
}
