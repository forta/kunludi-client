Kunludi-client: Multilingual interactive fiction

("kunludi": in esperanto it means "to play together")


---------------------------------------------------------

The kunludi system is being developed in javascript on both the server side (with [node.js] (https://nodejs.org/)) and the client side (using [vue.js v2.0] (https://vuejs.org/)).

It is played from a web browser, either against the updated version on the internet (http://www.kunludi.com) or against a local web service (http: // localhost: 8080), which must be installed and launched, as we will see below.

Instructions for installing and launching the local kunludi web service.
-------------------------------------------------- --------------------

Before you can play kunludi games locally: install node.js (https://nodejs.org/en/)

Download the kunludi source code locally from https://github.com/forta/kunludi_vue 

1) Install packages required by the game: run from command line, in the local directory
``` bash
npm install
```
(In the case of windows, the command console must be executed with administrator permissions)

2) To launch the local web service run * in debug mode *:
``` bash
npm run dev (or: "node build/dev-server.js")
```
(In some linux it is "nodejs" instead of "node").

In * production mode *, it would execute:
``` bash
node build/build.js
```

3) To play locally: http://localhost:8101


Instructions for installing additional games not present in the kunludi github package
--------------------------------------------------------------------------------------------

The file **./kunludi/data/games.json ** tells kunludi which games are available.

To load extra games, unzip their sources in **./kunludi/data/games/**. These one are available:
- Texel: https://github.com/forta/kunludiGame_texel -> ./kunludi/data/games/texel
- The three sources: https://github.com/forta/kunludiGame_tresfuentes -> ./kunludi/data/games/tresfuentes

Likewise, if the user wants to develop their own game, just add an entry in the games.json file and create the associated directory.

Composition of a kunludi game.
------------------------------

Each kunludi game consists of:
- file ** about.json **: contains the title and credits of the game in each of the languages ​​in which it is available.
- file ** world.json **: world definition of the game: items (localities, objects, NPCs and PJs), and definition of attributes, actions and extra addresses that are not defined in the base library.
- file ** gReactions.js **: javascript program with game code
- for each language in which the game is defined, two additional files are used, in **. / Localization / [language] / **:
	- file ** messages.json **: game messages
	- file ** extraMessages.json **: additional language-dependent information on game items.
- file ** README.md **: the specific instructions of the game.
- file ** LICENSE.html **: by default, General Commons, but each game creator can replace that
- directory ** images / ** contains game-specific graphics
- directory ** audio / ** contains the specific audios of the game
