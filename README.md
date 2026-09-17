# Girls' Frontline Wiki

A fast, mobile-friendly wiki for _Girls' Frontline_, the mobile game by MICA Team. It runs entirely in the browser and is hosted on GitHub Pages.

**[Open the wiki](https://steve1316.github.io/gfl-reactjs-wiki/)**

[![Deploy](https://github.com/steve1316/gfl-reactjs-wiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/steve1316/gfl-reactjs-wiki/actions/workflows/deploy.yml)
[![Refresh game data](https://github.com/steve1316/gfl-reactjs-wiki/actions/workflows/refresh.yml/badge.svg)](https://github.com/steve1316/gfl-reactjs-wiki/actions/workflows/refresh.yml)
[![Last commit](https://img.shields.io/github/last-commit/steve1316/gfl-reactjs-wiki)](https://github.com/steve1316/gfl-reactjs-wiki/commits/master)
[![License](https://img.shields.io/github/license/steve1316/gfl-reactjs-wiki)](LICENSE)

![A T-Doll page playing a skin's Live2D model](https://raw.githubusercontent.com/steve1316/gfl-wiki-assets/main/readme/tdoll-page.webp)

## Features

- **T-Doll Index** - filter by rarity, type, Mod and Live2D, search by name or build time, and sort by ID, name, rarity or Global release.
- **T-Doll pages** - stats, skills at any level, tile buffs, profile and gun spec sheet, exclusive equipment, and every skin and Mod with a zoomable full-art viewer.
- **Animations** - battle and dorm chibis from the game's Spine rigs, plus skin Live2D models with their motions and dialogue.
- **HOCs and Fairies** - their own indexes and pages with stats, skills, fairy talents, art and animations, including Live2D where the game has it.
- **Equipment Index** - filter, search and sort equipment, and see which dolls an exclusive item belongs to.
- **Always current** - a daily job picks up new dolls, skins, equipment and art from the game data.

<p>
  <img src="https://raw.githubusercontent.com/steve1316/gfl-wiki-assets/main/readme/tdoll-index.webp" width="49%" alt="The T-Doll Index with its filters">
  <img src="https://raw.githubusercontent.com/steve1316/gfl-wiki-assets/main/readme/hoc-page.webp" width="49%" alt="A HOC page">
</p>

## Roadmap

- [ ] **Formation Simulator** - place an echelon and see tile, equipment and fairy buffs applied to each doll's stats.
- [ ] **Story player** - read the main story and events in the browser.

## Running locally

You need Node 22 and pnpm, which ships with Node through corepack.

```sh
corepack enable
pnpm install
pnpm dev          # dev server at http://localhost:5173/gfl-reactjs-wiki/
pnpm typecheck    # type check only
pnpm build        # type check, then a production build into build/
pnpm preview      # serve the production build
pnpm test:data    # data pipeline tests
```

To serve the production build the way GitHub Pages does, but from the site root, run `docker compose up --build` and open http://localhost:8088.

Art and animations are not in this repo. They load from [gfl-wiki-assets](https://github.com/steve1316/gfl-wiki-assets), set by `VITE_ASSET_BASE_URL` in `.env`.

## How it works

- **`src/`** - the site: React 19, TypeScript and MUI, built with Vite. Game data ships as generated JSON, and each page loads only what it needs.
- **`tools/data/`** - imports doll, equipment, HOC and fairy data from the game's tables and checks the result.
- **`tools/assets/`** - Python tools (UnityPy, Python 3.12) that extract art, Spine rigs and Live2D models from the game's asset bundles and publish them to the asset repo.
- **`.github/workflows/`** - `deploy.yml` publishes the site on every push to `master`. `refresh.yml` runs daily, imports anything new, and deploys only if something changed.

## Data sources

- **Game data** - stats, skills, profiles and release dates from [gf-data-us](https://github.com/gf-data-tools/gf-data-us), cross-checked against [gf-data-ch](https://github.com/gf-data-tools/gf-data-ch).
- **Faction, manufacturer, country and full gun name** - [IOPWiki](https://iopwiki.com/) under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), with gaps filled from [Wikidata](https://www.wikidata.org/) (CC0).
- **Art and animations** - extracted from the game's own asset bundles.

## Credits

- **Spine 2.1 runtime** - vendored from [naganeko-tools](https://github.com/naganeko/naganeko-tools) (GPL-3.0).
- **Live2D Cubism Core** - © Live2D Inc., redistributed under the Live2D Proprietary Software License Agreement.
- **pixi-live2d-display** and **PixiJS** - MIT.

Versions and licence details are in [`public/vendor/`](public/vendor/).

_Girls' Frontline_ and its characters, art and data are © Sunborn / MICA Team. This is an unofficial fan project and is not affiliated with or endorsed by them.

## License

The code is licensed under [GPL-3.0](LICENSE).
