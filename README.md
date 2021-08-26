Kunludi-client: Multilingual interactive fiction

("kunludi": in esperanto it means "to play together")


---------------------------------------------------------

The kunludi system is being developed in javascript on both the server side (with [node.js] (https://nodejs.org/)) and the client side (using [vue.js v1.0] (https://vuejs.org/)).

It is played from a web browser, either against the updated version on the internet (http://www.kunludi.com) or against a local web service (http: // localhost: 8080), which must be installed and launched, as we will see below.

To play directly the game "Mi Querida Hermana" presented to the Spanish Comp ["Beyond the Comp"](wiki.caad.es/Más_allá_de_la_Comp): http://www.kunludi.com:8080/#!/ludi/games/miqueridahermana

Instructions for installing and launching the local kunludi web service.
-------------------------------------------------- --------------------

Before you can play kunludi games locally: install node.js (https://nodejs.org/en/)
The game has been tested with node.js v.4.4.2

Download the kunludi source code locally from https://github.com/forta/kunludi_vue (for example, in c: \ games \ kunludi). And then:

1) Install packages required by the game: run from command line, in the above directory
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

3) To play locally: http://localhost:8080

4) To go directly to a game, you must use its internal name. By example, for the game "My Dear Sister": http://localhost:8080/#!/ludi/games/miqueridahermana

Instructions for installing additional games not present in the kunludi github package
--------------------------------------------------------------------------------------------

The file **./kunludi/data/games.json ** tells kunludi which games are available.

The games "texel" and "the three sources" are not in the kunludi code package, but they are present in games.json.

To load these two games, unzip their sources in **./kunludi/data/games/**:
- Texel: https://github.com/forta/kunludiGame_texel -> ./kunludi/data/games/texel
- The three sources: https://github.com/forta/kunludiGame_tresfuentes -> ./kunludi/data/games/tresfuentes

Likewise, if the user wants to develop their own game, just add an entry in the games.json file and create the associated directory.

Composition of a kunludi game.
------------------------------

Each kunludi game consists of:
- file ** about.json **: contains the title and credits of the game in each of the languages ​​in which it is available.
- file ** world.json **: munco definition of the game: items (localities, objects, NPCs and PJs), and definition of attributes, actions and extra addresses that are not defined in the base library.
- file ** gReactions.js **: javascript program with game code
- for each language in which the game is defined, two additional files are used, in **. / Localization / [language] / **:
	- file ** messages.json **: game messages
	- file ** extraMessages.json **: additional language-dependent information on game items.
- file ** README.md **: the specific instructions of the game.
- file ** LICENSE.html **: by default, General Commons, but each game creator can user the terms you want.
- directory ** images / ** contains game-specific graphics
- directory ** audio / ** contains the specific audios of the game

The messages of the game are in a format that understands the GTT (Google Translation Toolkit): a quick translation can be done using GTT, which also allows online collaboration to translate the file by several people.

Initial program template, using [vue-cli and webpack] (http://vuejs-templates.github.io/webpack/).
