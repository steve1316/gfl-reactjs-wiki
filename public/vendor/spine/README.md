# Vendored Spine 2.1 runtime

Girls' Frontline ships Spine **2.1** skeletons. No maintained web runtime supports that version, so
these three files are vendored from [naganeko-tools](https://github.com/naganeko/naganeko-tools),
which is GPL-3.0 and therefore compatible with this project's licence.

| File | What it is |
|---|---|
| `pixi.js` | PixiJS 4.8.6, patched by naganeko for premultiplied-alpha handling |
| `pixi-spine-sjzs.js` | pixi-spine 1.0.10 plus patches for Girls' Frontline SD data |
| `skb.js` | `SkeletonBinary`, which converts a Spine 2.x binary `.skel` into Spine JSON |

They are treated as frozen third-party code: unmaintained, pinned to PixiJS 4, and not tracked as a
dependency. Do not upgrade them piecemeal.

Four globals **must** be defined before `pixi.js` loads or it throws on load:
`test_PMA_base`, `test_PMA_Texture`, `test_PMA_glstore` and `enable_clear_fail_step`. The last is
never assigned anywhere in naganeko's own source and gates whether `flipX`/`flipY` timelines are
built, so it must be falsy. `src/lib/spine.ts` sets all four.

## Local patches to `skb.js`

`skb.js` differs from the naganeko copy in four places, each marked with a `// Local patch:` comment. A re-vendor must carry all four
over, or skeletons with IK constraints stop parsing or bend the wrong way (`grep -n "Local patch" skb.js` lists them):

1. **IK frame creation.** The IK timeline loop assigned `time`, `mix` and `bendPositive` onto `timeline[frameIndex]` without ever
   creating the frame object, so any skeleton with an IK timeline threw. The loop now creates `timeline[frameIndex] = {}` first.
2. **Constraint-name keying.** IK timelines were stored under the constraint object (`ik[this.json.ik[ikIndex]]`), which stringifies to
   `[object Object]`. They are now keyed by `this.json.ik[ikIndex].name`, the key the JSON reader looks them up by.
3. **Duration.** The animation duration now includes the last IK frame time, so an animation whose IK keys run past its other
   timelines is not cut short.
4. **Signed bend direction.** Spine writes an IK bend direction as a signed byte (1 or -1). It was read with `readBoolean`, so -1 came
   out positive. A `readSByte` helper now reads it, and `bendPositive` is `readSByte() >= 0`, for both the constraint and its timeline frames.
