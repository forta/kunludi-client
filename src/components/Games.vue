<template>

  <!-- to-do: gameId2 -->

  <div class="games">

	<div v-if="!slotId">
    <h2>{{kt("Games")}}:</h2>

    <div v-if=" (userId !== '') ">
        <p>{{kt("Username")}}: {{ userId }}</p>
    </div>

        <p>{{kt("Choose Game")}}</p>
        <ul class="gameList">
            <li v-for="game in games" class="gameList">
               <!-- <button v-on:click="currentgame=game"> -> </button> -->
               <button v-on:click="currentgame=game;setGame(game.name) "> -> </button>
              {{translatedGameName (game.name)}}
            </li>
        </ul>

<!-- not yet:

        <h4>Filters</h4>
        <input type="checkbox" id="checkbox" v-model="filterOnDevelopment"> <label>On development</label> |
        <label>By languages:</label>
        <select v-model="filterByLang">
            <option selected>Current</option>
            <option>My language favourites</option>
            <option>Any Language</option>
        </select>
-->

    <ludi-game-detail :game="currentgame"></ludi-game-detail>

	</div>

	<div v-else>
		<play></play>
	</div>

  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'
import LudiGameDetail from './LudiGameDetail.vue'
import Play from './Play.vue'

export default {

  data () {

    return {
      currentgame: {},
      filterOnDevelopment: false,
      filterByLang: 'Current',
    }
  },

  computed: mapGetters([
    'locale',
    'gameId',
    'slotId',
    'userId',
    'languages',
    'games',
    'kt',
    'translatedGameName'
  ]),

  components: {
     LudiGameDetail,
     Play
  },

  methods: mapActions([
    'setLocale',
    'setGame'
  ]),

  beforeMount: function () {
    if (typeof this.$route.query.game != "undefined") {
      console.log("Game by path: " + this.$route.query.game)
      console.log("to-do: setgame " + this.$route.query.game)
      //this.setGame (this.$route.query.game)
    }
  }

}



/*
export default {



  computed: {
     gameloaded: function () { return (this.gameId !== ""); }
  },
  mounted: function () {
    this.$nextTick(function () {
      // code that assumes this.$el is in-document (vue2)
      // each time, the game list is loaded
      if (!this.$el.gameloaded)  store.dispatch('LOADGAMES')

      if (this.$el.$router.app.$route.params.gameId2 != undefined) {
          console.log ("From path: " + this.$el.$router.app.$route.params.gameId2)
          this.$el.$data.currentgame = {name:this.$el.$router.app.$route.params.gameId2}
      }
    })
  },

}

*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body {
    font-size: 2.3em;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

.gameList {
  text-align: left;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}


ul.gameList {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li.gameList {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
  font-size: 1em;
}

li.gameList:last-child {
  border: none;
}

@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
       screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {

 body {
     font-size: 1em;
 }

 button {
     border-radius: 10px;
     font-size: 1em;
 }

 li.gameList {
   font-size: 1em;
 }

}


</style>
