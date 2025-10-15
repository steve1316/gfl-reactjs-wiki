# Vendored Live2D runtime

Girls' Frontline ships some fairies and HOCs as Live2D Cubism 4 models instead of Spine. These three files are the
browser runtime that plays them, vendored at fixed versions rather than pulled from a CDN or added as an npm
dependency. `src/lib/live2d.ts` loads them on demand, only when a Live2D view is opened.

| File | Package | Version | Licence |
| --- | --- | --- | --- |
| `live2dcubismcore.min.js` | Live2D Cubism Core | 5.1 | Live2D Proprietary Software License Agreement (Redistributable Code) |
| `pixi.min.js` | pixi.js | 6.5.10 | MIT |
| `pixi-live2d-display.cubism4.min.js` | pixi-live2d-display (cubism4 build) | 0.4.0 | MIT |

## Live2D Cubism Core

Copyright (C) Live2D Inc. All rights reserved.

`live2dcubismcore.min.js` is the official Cubism Core runtime, obtained from
`https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js`. Its file header marks it "Redistributable
Code" under the Live2D Proprietary Software License Agreement:

`https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html`

Redistributable Code may be self-hosted alongside the site that uses it, which is what this folder does. The
Cubism SDK is free to use for individuals and small-scale enterprises (annual gross revenue under roughly 10
million JPY); this project is a non-commercial fan wiki and falls under that free tier. The agreement's licence
notice is preserved verbatim in the file's own header - do not strip it on a re-vendor.

## pixi.js

Copyright (c) 2013-2023 Mathew Groves, Chad Engler.

`pixi.min.js` is pixi.js 6.5.10, the WebGL renderer pixi-live2d-display and this site's Spine viewer both build on.
Licensed under the MIT License:

`http://www.opensource.org/licenses/mit-license`

## pixi-live2d-display

Copyright (c) 2021 guansss.

`pixi-live2d-display.cubism4.min.js` is the `cubism4` build of pixi-live2d-display 0.4.0, published as
`cubism4.min.js` upstream and renamed here for clarity since this repo does not vendor the parallel `cubism2`
build. Source: `https://github.com/guansss/pixi-live2d-display`. Licensed under the MIT License. The project is
effectively unmaintained and pinned to pixi.js v6, which is why pixi.js is pinned to 6.5.10 rather than a newer
major version.

The MIT License (for pixi.js and pixi-live2d-display):

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
