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
