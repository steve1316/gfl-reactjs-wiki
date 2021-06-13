# Girls Frontline ReactJS Wiki

![Girls' Frontline](/src/images/logo.png)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/steve1316/gfl-database?logo=GitHub) ![GitHub last commit](https://img.shields.io/github/last-commit/steve1316/gfl-database?logo=GitHub) ![GitHub issues](https://img.shields.io/github/issues/steve1316/gfl-database?logo=GitHub) ![GitHub pull requests](https://img.shields.io/github/issues-pr/steve1316/gfl-database?logo=GitHub) ![GitHub repo size](https://img.shields.io/github/repo-size/steve1316/gfl-database?logo=GitHub) ![GitHub](https://img.shields.io/github/license/steve1316/gfl-database?logo=GitHub)

# Database last updated on January 13, 2021.

This project serves to provide a mobile-friendly web application of a database hosted on GitHub featuring the mobile game, Girls' Frontline by Mica Team, based on the React + Material UI framework.

<img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/55/animations/55_mod_move.gif" width=175 height=175 alt="M4A1 Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/56/animations/56_mod_move.gif" width=175 height=175 alt="M4 SOPMOD II Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/57/animations/57_mod_move.gif" width=175 height=175 alt="ST AR-15 Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/143/animations/143_mod_move.gif" width=175 height=175 alt="RO635 Mod">

# Table of Contents

- [Planned Features](<#features>)
- [TODO List](<#todo-list>)
- [Installation](#installation)
- [How to host locally](#how-to-host-locally)
- [How to build and deploy to your GitHub Pages](#how-to-build-and-deploy-to-your-github-pages)
- [License](#license)

# Features

- [x] Stats and animations of all T-Dolls (Tactical Dolls) in the game as of January 13, 2021.

- [x] Information on equipment and their effects when equipped on T-Dolls.

- [ ] Information on Fairies.

- [ ] Information on HOCs (Heavy Ordnance Corps).

- [ ] Formation Simulator that can help you plan out your formations with tile buffs, equipment, and Fairies showing updated T-Doll stats.

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# TODO List

<img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/122/animations/122_mod_victoryloop.gif" width=175 height=175 alt="G11 Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/65/animations/65_mod_wait.gif" style="transform: scaleX(-1)" width=175 height=175 alt="416 Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/101/animations/101_mod_victoryloop.gif" width=175 height=175 alt="UMP9 Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/103/animations/103_mod_victoryloop.gif" width=175 height=175 alt="UMP45 Mod">

- [x] ~~Mock up the pages for the app.~~
- [x] ~~Create initial structure of JSON data object that will hold all T-Dolls.~~
- [x] ~~Set up filters and searching functionality for T-Dolls.~~
  - [x] ~~Finalize the Chip components.~~
  - [x] ~~Save filters when moving to and from T-Doll Index page for persistence.~~ (Maybe have a "Clear Filters" button)
  - [x] ~~Add 6* rarity filter to depict the Mod of 5*'s. Make it only show up by clicking on the Mod Filter Button.~~ (Did not add a 6* rarity filter but rather had the 5* rarity filter show the 6\* Mods instead)
- [x] ~~Add T-Dolls #1 to #10 to JSON data object.~~
- [x] ~~Add functionality to view information for each T-Doll.~~
- [x] ~~Add images and animations.~~ (GIFs, not Spine unfortunately)
  - [x] ~~Rework the logic such that clicking on the GIF plays the next animation and loops back around when you reach the last animation.~~
- [x] ~~Add T-Dolls #11 to 320~~ (currently as of October 10, 2020)
- [x] ~~Add all Special T-Dolls #1000 to 1027.~~ (currently as of October 10, 2020)
- [ ] ~~(HIGH PRIORITY) Add Pagination Component to T-Doll Index page to reduce loading time (made the algorithm already).~~
- [ ] ~~Redo each Normal Card image to get rid of artifacting on the left side of each image.~~ (Doing so will mess up the image resolution and make it too blurry)
- [x] ~~(HIGH PRIORITY) Finish the T-Doll rerolling component on the Home Page.~~
  - [x] ~~Create logic for the 2 buttons below it and link it to the component.~~
- [x] ~~Create initial structure of JSON data object that will hold all equipment.~~
  - [x] ~~Add Special Equipment for the T-Dolls that have Mods or are farmable in-game.~~
  - [x] ~~(HIGH PRIORITY) Create the Equipment Index page.~~
    - [x] ~~(MEDIUM PRIORTIY) Set up filters and searching for equipment.~~
    - [ ] (LOW PRIORITY) Add Tooltips to T-Doll skill descriptions that have a reference to Special Equipment.
    - [ ] (MEDIUM PRIORITY) Add a way to go to the T-Doll from its exclusive equipment.
    - [ ] (MEDIUM PRIORITY) Display all exclusive equipment linked to a T-Doll on its page.
- [ ] (MEDIUM PRIORITY) Create data model for HOCs.
  - [ ] (MEDIUM PRIORITY) Create the HOC Index page.
  - [ ] (LOW PRIORITY) Add in the animations of the HOCs.
- [ ] (LOW PRIORITY) Create the data model for Fairies.
  - [ ] (LOW PRIORITY) Create the Fairy Index page.
  - [ ] (LOW PRIORITY) Add in the animations of the Fairies.
- [ ] (LOW PRIORITY) Create the Formation Simulator page.
  - [ ] (LOW PRIORITY) Create logic to connect the T-Dolls' stats and tiles to equipments and fairies buffs.
- [ ] (LOW PRIORITY) Add functionality to see the stats of equipped T-Dolls.
- [ ] (LOW PRIORITY) Add build times for T-Dolls.
- [ ] (LOW PRIORITY) Add build times for equipment.
- [ ] (LOW PRIORITY) Add build times for Fairies.
- [x] ~~(LOW PRIORITY) Update the database from its last updated state of October 10, 2020 to the latest.~~

<sup><a href="#girls-frontline-database">Go back to top</a></sup>

# Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/getting-started/install) to install all dependencies that the app requires.

```javascript
npm install

yarn install
```

<img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/124/animations/124_mod_victory.gif" width=175 height=175 alt="Super SASS Mod"> <img src="https://raw.githubusercontent.com/steve1316/gfl-database/master/src/images/tdolls/281/animations/281_normal_victoryloop.gif" width=175 height=175 alt="CAWS">

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
