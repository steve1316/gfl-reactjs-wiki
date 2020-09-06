# Girls Frontline Database

![Girls' Frontline](/src/images/logo.png)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/steve1316/gfl-database?logo=GitHub) ![GitHub last commit](https://img.shields.io/github/last-commit/steve1316/gfl-database?logo=GitHub) ![GitHub issues](https://img.shields.io/github/issues/steve1316/gfl-database?logo=GitHub) ![GitHub pull requests](https://img.shields.io/github/issues-pr/steve1316/gfl-database?logo=GitHub) ![GitHub repo size](https://img.shields.io/github/repo-size/steve1316/gfl-database?logo=GitHub) ![GitHub](https://img.shields.io/github/license/steve1316/gfl-database?logo=GitHub)

This project serves to provide a mobile-friendly web application of a database featuring the mobile game, Girls' Frontline by Mica Team, based on the React + Material UI framework.

# Table of Contents

- [Planned Features (Subject to change)](<#planned-features-(subject-to-change)>)
- [TODO (Subject to change)](<#todo-(subject-to-change)>)
- [Installation](#installation)
- [How to host locally](#how-to-host-locally)
- [How to build and deploy to your GitHub Pages](#how-to-build-and-deploy-to-your-github-pages)
- [License](#license)

# Planned Features (Subject to change)

- Stats and animations of all T-Dolls (Tactical Dolls) in the game as of September 09, 2020.

- Information on equipment and their effects when equipped on T-Dolls.

- Information on Fairies.

- Information on HOCs (Heavy Ordnance Corps).

- Formation Simulator that can help you plan out your formations with tile buffs, equipment, and Fairies showing updated T-Doll stats.

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# TODO (Subject to change)

- [x] Mock up the pages for the app.

- [x] Create initial structure of JSON data object that will hold all T-Dolls.

- [x] Set up filters and searching functionality for T-Dolls.

  - [x] Finalize the Chip components.
  - [ ] Save filters when moving to and from T-Doll Index page for persistence. Maybe have a "Clear Filters" button.
  - [ ] Add 6* rarity filter to depict the Mod of 5*'s. Make it only show up by clicking on the Mod Filter Button.

- [x] Add T-Dolls #1 to #10 to JSON data object.

- [x] Add functionality to view information for each T-Doll.

- [x] Add images and animations (GIFs, not Spine unfortunately).

  - [x] Rework the logic such that clicking on the GIF plays the next animation and loops back around when you reach the last animation.

- [ ] Add T-Dolls #11 to #50.

- [ ] ~~Redo each Normal Card image to get rid of artifacting on the left side of each image.~~ Doing so will mess up the image resolution and make it too blurry.

- [ ] Create initial structure of JSON data object that will hold all equipment.

- [ ] Set up filters and searching for equipment.

- [ ] Add X amount of equipment to the JSON data object.

  - [ ] Add Special Equipment for the T-Dolls that have Mods or are farmable in-game.

  - [ ] Add Tooltips to T-Doll skill descriptions that have a reference to Special Equipment.

- [ ] Add functionality to see the stats of equipped T-Dolls.

- [ ] Add Pagination Component to T-Doll Index page.

- [ ] ...

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/getting-started/install) to install all dependencies that the app requires.

```javascript
npm install

yarn install
```

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# How to host locally

```javascript
# Deploys on localhost:3000
npm run start

yarn start
```

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# How to build and deploy to your GitHub Pages

```ssh
# This assumes that you have GitHub Pages running properly when you forked this project.
npm run deploy

yarn deploy
```

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# License

[GNU GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)

<sup><a href="#girls-frontline-database">Go back to top</a></sup>
