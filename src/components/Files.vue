gameAbout.<template>
  <div class="files">

  <h1  v-show="!gameId"><router-link to="/ludi/games" > {{kt("Games")}} </router-link></h1>
  <!-- to-do: jump to /ludi/games')
    this.$router.push('/ludi/games')
  -->

  <div v-show="gameId">


  <!-- <br/><br/><br/> -->
	<h3>{{kt("Files")}}</h3>

    <ul>
        <li> <b>{{kt("Title")}}:</b> {{gameAbout.translation[languageIndex].title}} </li>
        <li> <b>{{kt("Description")}}:</b> {{gameAbout.translation[languageIndex].desc}} </li>
        <li> <b>{{kt("Introduction")}}:</b> {{gameAbout.translation[languageIndex].introduction}} </li>
        <li> <b>{{kt("Language")}}:</b> <span v-for="lan in gameAbout.translation" > {{lan.language }} </span> </li>
        <li> <b>{{kt("Author")}}:</b> {{gameAbout.translation[languageIndex].author.name}}
                (<b>{{kt("ludi account")}}:</b> {{gameAbout.translation[languageIndex].author.ludi_account}})
            (<b>{{kt("email")}}:</b> {{gameAbout.translation[languageIndex].author.email}})</li>
     </ul>

     <h3>{{kt("Options")}} </h3>

     <ul>

       <li><button @click='saveGame(gameId)'>{{kt("SaveGame")}}</button>
       <button @click='quitGame({message:kt ("Confirm game quit")})'>{{kt("QuitGame")}}</button></li>

       <!-- offline game states -->
       <div v-if=" (userId === '') ">
         <!-- offline default state -->
         <li v-if="slotId==''"><button v-on:click="loadGame()"> {{kt("LoadGameFromStart")}}  </button></li>

         <h3>{{kt("Private game states of the user")}}:</h3>
         <li v-for="gameSlot in gameSlots" >
           <span v-if="gameSlot.id!='default'">
             {{kt("Description")}}: [{{gameSlot.slotDescription}}]
             <!-- <button  v-on:click="loadGame(gameSlot.id)"> {{kt("LoadGame")}}  </button> | -->
             {{kt("Turns")}}: {{gameSlot.gameTurn}} |
             {{kt("Date")}}: {{convertDate(gameSlot.date)}}
            <button v-on:click="renameGameSlot({gameId: gameId, slotId: gameSlot.id, slotDescription: gameSlot.slotDescription})"> {{kt("Rename")}} </button>
            <button v-on:click="deleteGameSlot({gameId: gameId, slotId: gameSlot.id})"> {{kt("Delete")}} </button>
           </span>
         </li>

       </div>

       <!-- online game states -->
       <div v-else>
         <h3>{{kt("Private game states of the user on the server")}}:</h3>
         <li v-for="gameSlot in gameSlots" >
           <span v-if="gameSlot.id!='default' && gameSlot.type=='stored'">
              [{{gameSlot.slotDescription}}]
              <button v-on:click="renameGameSlot(gameSlot.id, gameSlot.slotDescription)"> {{kt("Rename")}} </button>
              - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
              <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>
              <br/>
           </span>
         </li>

       <h3>{{kt("The game is being played in group in these server sessions")}}:</h3>
       <li v-for="gameSlot in gameSlots" >
       <!-- online gameslots where the player is not playing right now -->
         <span v-if="gameSlot.id!='default' && gameSlot.type=='live' && gameSlot.playerList.indexOf(userId) < 0 && gameSlot.gameTurn > 0">
           [{{gameSlot.slotDescription}}]
           - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
           <span v-if="gameSlot.playerList.length>0">
              - {{kt("Players")}}: {{gameSlot.playerList.length}} =>  <span v-for="player in gameSlot.playerList"> {{player}} </span>
           </span>
          </span>
        </li>

        <!-- <li> <b>{{kt("SeeHistory")}}</b></li> -->

      </div>

     </ul>


  </div>
</div>

</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      languageIndex:0
    }
  },
  computed: mapGetters([
    'gameId',
    'slotId',
    'gameAbout',
    'locale',
    'userId',
    'kt',
    'gameSlots',
    'convertDate'
  ]),

  methods: Object.assign(mapActions([
    'deleteGameSlot',
    'renameGameSlot',
    'resetGameSlot',
    'saveGame',
    'quitGame'

  ]), {
    //  X: (par) => {   }
  }),

  beforeMount: function () {
  //mounted: function () {

    console.log("at Files.vue#beforeMount()")

    // https://vuejs.org/v2/guide/instance.html

    if (this.gameId =='') {
      console.log("It should be redirected to to /ludi/games")
      this.$router.push('/ludi/games')
    }

    /*
    this.$nextTick(function () {

      // code that assumes this.$el is in-document (vue2)
      if (this.$el.gameAbout.translation == undefined) return
      var languageIndex = 0
      for (var l=0; l<this.$el.gameAbout.translation.length;l++) if (this.$el.gameAbout.translation[l].language == this.$el.locale) languageIndex = l
      this.$el.languageIndex = languageIndex
    })*/
  }


}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p, li {
    text-align: left;
}

button {
    border-radius: 10px;
    font-size: .8em;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

/* Portrait */
@media screen
  and (-webkit-device-pixel-ratio: 2)
  and (orientation: portrait) {

    button {
        border-radius: 10px;
        font-size: .5em;
    }

}

/* Landscape */
@media screen
  and (-webkit-device-pixel-ratio: 2)
  and (orientation: landscape) {

    button {
        border-radius: 10px;
        font-size: 0.9em;
    }

}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border: none;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

body {
    font-size: 1em;
}

h3,li, button {
  font-size: 1em;
}


</style>
