<template>
  <div class="about">

    <div v-show="locale == 'en'">

    <h4>Welcome to kunludi!</h4>

    <p>&quot;kun-ludi&quot; (&quot;to play together&quot; in <a href="https://en.wikipedia.org/wiki/Esperanto">esperanto</a>) is an environment to play <b> multi-lingual interactive fiction</b> games.</p>
	  <p>The <u>cooperative mode</u>, now disabled, will allow you to switch the game control with other players. Each player will be able to choose a different language and chat with the other players.</p>
    <p>When we rehabilitate the cooperative mode, if you register your user you can also play private games on the server and save games on it. You can also transfer a private game of yours to a public game, so that other players accompany you at the point where you have saved the game.</p>
    <p>If you want to collaborate in some way, you can write to: ludi.ludon (at) gmail (dot) com.</p>

    <h3>Instructions </h3>
    <ol>
    <li>Choose the language you want to use: Language </li>
    <li>Choose your game: Games / Load initial game state</li>
    <li>Once the game is started, to save the current game status or to load a previously saved game: click on <b>File</b></li>
    </ol>

    <h3>More</h3>
    <ul>
    <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
    <li>Source code of kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Two games included: Vampiro and My Dear Sister)</li>
    <li>Source code of game The Three Fountains: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
    <li>Source code of game Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
    </ul>

    </div>

    <div v-show="locale == 'es'">

        <h4>¡Bienvenido a kunludi!</h4>

        <p>&quot;kunludi&quot; (&quot;jugar juntos&quot; en <a href = "https://es.wikipedia.org/wiki/Esperanto">esperanto</a>) es un entorno para jugar <b>aventuras multilingües de ficción interactiva</b>.</p>
        <p>La opción de jugar en <u>modo cooperativo</u>, ahora deshabilitada, te permitirá alternar el control de un juego con otros usuarios. Cada jugador podrá ver el juego en el idioma que elija y chatear con los otros usuarios.</p>
        <p>Cuando rehabilitemos el modo cooperativo, si registras tu usuario además podrás jugar a partidas privadas en el servidor y guardar partidas en el mismo. También podrás traspasar una partida privada tuya a un juego público, para que otros jugadores te acompañen en el punto en que hayas guardado el juego.</p>
        <p>Si quieres colaborar de alguna manera, nos puedes escribir a: ludi.ludon (arroba) gmail (punto) com .</p>

     	<h3>Instrucciones</h3>
        <ol>
        <li>Elige el idioma que quieres usar: Idioma</li>
        <li>Elige tu juego: Juegos / Cargar estado inicial del juego</li>
        <li>Una vez iniciado el juego, para guardar el estado actual del juego o cargar una partida guardada previamente: pulsa en <b>Archivo</b></li>
        </ol>

     	<h3>Más</h3>
        <ul>
        <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Código fuente de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Incluye dos juegos: Vampiro y Mi Querida Hermana)</li>
        <li>Código fuente del juego Las Tres Fuentes: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Código fuente del juego Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
        </ul>
    </div>

    <div v-show="locale == 'eo'">

        <h4>Estu bonvena en kunludi!</h4>

        <p>Kompreneble, &quot;kunludi &quot; estas esperanta vorto kaj estas medio por ludi <b>multlingvajn interagajn fikciajn ludojn</b>.</p>
		    <p>Kiam ni rehabilitos la kunlaboran reĝimon, se vi registras vian uzanton, vi povas ankaŭ ludi privatajn ludojn en la servilo kaj ŝpari ludojn ĉe ĝi. Vi ankaŭ povas transdoni privatan ludon al publika ludo, por ke aliaj ludantoj akompanu vin ĉe la punkto, kie vi savis la ludon.</p>
        <p><u>La kunlabora reĝimo</u>, nun malebligita, permesos al vi ŝanĝi la ludokontrolon kun aliaj ludantoj. Ĉiu ludanto povos elekti malsaman lingvon kaj babili kun la aliaj ludantoj.</p>

        <p>Se vi volas kunlabori iel ajn, vi povas kontakti nin je. ludi.ludon (ĉe) gmail (punkto) com .</p>

        <h3> Instrukcioj </h3>
        <ol>
        <li>Elektu viajn preferatan lingvon: Lingvo</li>
        <li>Elektu vian ludon: Ludoj / Rekuperi startan statuson el ludo</li>
        <li>Post starti la ludon, por gardi la nunan lud-statuson aŭ ŝarĝi malnovan statuson, kliku sur <b>Arĥivo</b></li>
        </ol>

        <h3>Plu</h3>
        <ul>
        <li>Blogo: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Kodo de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Du ludoj inkluzivitaj: Vampiro kaj Mia Kara Fratino)</li>
        <li>Kodo de la ludo La Tri Fontoj: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Kodo de la ludo Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
        </ul>

    </div>

    <div v-show="locale == 'fr'">
        <h4>Bienvenue à kunludi!</h4>

        <p>&quot;kun-ludi&quot; (&quot;jouer ensemble&quot; en <a href="https://fr.wikipedia.org/wiki/Esp%C3%A9ranto">espéranto</a>) est un environnement pour jouer à des <b>jeux de fiction interactifs multilingues</b>.</p>
		    <p>Le <u>mode coopératif</u>, maintenant désactivé, vous permettra de changer le contrôle du jeu avec les autres joueurs. Chaque joueur pourra choisir une langue différente et discuter avec les autres joueurs.<p>
        <p>Lorsque nous réhabilitons le mode coopératif, si vous enregistrez votre utilisateur, vous pouvez également jouer à des jeux privés sur le serveur et y sauvegarder des jeux. Vous pouvez également transférer une de vos parties privées vers une partie publique afin que les autres joueurs vous accompagnent au moment où vous avez sauvegardé la partie.</p>
        <p>Si vous voulez aider en quelque sorte, nous pouvons écrire: ludi.ludon (at) gmail (dot) com</p>.

        <h3>Instructions</h3>
        <ol>
        <li>Choisissez la langue que vous souhaitez utiliser: Langue </li>
        <li>Choisissez votre jeu: Jeux / Chargez état initial du jeu </li>
        <li>Une fois le jeu lancé, pour sauvegarder l'état actuel du jeu ou pour charger un jeu précédemment enregistré: cliquez sur <b>Archive</b></li>
        </ol>


     	  <h3>Plus</h3>
        <ul>
        <li>Blog: <a href="http://blog.kunludi.com" target="_blank">http://blog.kunludi.com</a></li>
        <li>Code source de kunludi: <a href="https://github.com/forta/kunludi_vue" target="_blank"> https://github.com/forta/kunludi_vue</a> (Y compris les jeux: Vampiro et Ma Chère sœur</li>
        <li>Code source du jeu juego Las Tres Fuentes: <a href="https://github.com/forta/kunludiGame_tresfuentes" target="_blank">https://github.com/forta/kunludiGame_tresfuentes</a></li>
        <li>Code source du jeu Texel: <a href="https://github.com/forta/kunludiGame_texel" target="_blank">https://github.com/forta/kunludiGame_texel</a></li>
        </ul>

    </div>

  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters([
    'locale'
  ]),
  methods: mapActions([
    'setLocale'
  ]),
  route: {
    beforeRouteEnter: function () {
        console.log('login route activated!')
        console.log('this.$route.path: ' + JSON.stringify (this.$route.path))
        console.log('this.$route.params: ' + JSON.stringify (this.$route.params))
        console.log('this.$route.query: ' + JSON.stringify (this.$route.query))
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p, li {
    text-align: left;
}

h4, h3 {
  text-align: left;
  color: #42b983;
}

.login {
  text-align: left;
}




</style>
