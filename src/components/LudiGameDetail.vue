<template>

  <div class="ludi-game-detail"  v-show='game.name'>

      <p>{{kt("Details")}}:</p>

      <ul>
        <li> {{kt("Id")}}: {{game.name}} </li>

        <!-- // <li> Type: {{game.type}} </li>   <li> Group: {{game.group}} </li>     <li> Url: {{game.baseurl}} </li> -->


        <li> <label>{{kt("Language")}}:</label>
            <select v-model="languageIndex">

            <option v-for="(option, index) in gameAbout.translation" v-bind:value="index">
                {{ option.language }}
            </option>

            </select>
        </li>
        <div v-if="languageIndex >= 0 ">
            <li> {{kt("Title")}}: {{gameAbout.translation[languageIndex].title}} </li>
            <li> {{kt("Description")}}: {{gameAbout.translation[languageIndex].desc}} </li>
            <li> {{kt("Introduction")}}: {{gameAbout.translation[languageIndex].introduction}} </li>
            <li> {{kt("Author")}}: {{gameAbout.translation[languageIndex].author.name}}
                    ({{kt("ludi account")}}: {{gameAbout.translation[languageIndex].author.ludi_account}})
                ({{kt("email")}}: {{gameAbout.translation[languageIndex].author.email}})</li>
            <li v-show='gameAbout.subgames'> {{kt("Subgames")}}: {{gameAbout.subgames}} </li>
         </div>
    </ul>


    <div v-if="languageIndex >= 0 && gameAbout.translation[languageIndex].desc != '??'">

        <h3>{{kt("Options")}}</h3>
        <ul>

          <!--  offline game states -->
          <div v-if=" (userId === '') ">

            <!--  offline default state -->

            <li><button v-on:click="loadGame({gameId: game.name, slotId:'default', newLocale:gameAbout.translation[languageIndex].language})"> {{kt("LoadGameFromStart")}} </button></li>

            <h3>{{kt("Private game states of the user")}}:</h3>
            <li v-for="gameSlot in gameSlots" >
              <span v-if="gameSlot.id!='default'">
                <button  v-on:click="loadGame({gameId: game.name, slotId: gameSlot.id, newLocale: gameAbout.translation[languageIndex].language})"> {{kt("LoadGame")}} </button>
                 [{{gameSlot.slotDescription}}]
                 - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
                 <button v-on:click="renameGameSlot({gameId: game.name, slotId: gameSlot.id, slotDescription: gameSlot.slotDescription})"> {{kt("Rename")}} </button>
                 <button v-on:click="deleteGameSlot({gameId: game.name, slotId: gameSlot.id})"> {{kt("Delete")}} </button>
                 <br/>
              </span>
            </li>

          </div>

          <!--  online game states -->
          <div v-else>

            <h3>{{kt("Private game states of the user")}}:</h3>


            <!--  no default / stored -->
            <li v-for="gameSlot in gameSlots" >
              <span v-if="gameSlot.type=='stored'">
                <button  v-on:click="loadGame({gameId: gameSlot.id})">{{kt("LoadGame")}} </button>
                 [{{gameSlot.slotDescription}}]
                 <button v-on:click="renameGameSlot(gameSlot.id, gameSlot.slotDescription)"> {{kt("Rename")}} </button>
                 - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
                 <button v-on:click="deleteGameSlot(gameSlot.id)"> {{kt("Delete")}} </button>
                 <br/>
              </span>
            </li>

            <h3>{{kt("The game is being played in group in these server sessions")}}:</h3>

            <li v-for="gameSlot in gameSlots" >
              <span v-if="gameSlot.type=='live'">
                <button  v-on:click="loadGame({gameId:game.name, slotId: gameSlot.id, newLocale: gameAbout.translation[languageIndex].language})">   {{kt("JoinGame")}} </button>
                [{{gameSlot.slotDescription}}]
                 - {{kt("Turns")}}: {{gameSlot.gameTurn}} - {{kt("Date")}}: {{convertDate(gameSlot.date)}}
                 <span v-if="gameSlot.playerList.length>0">
                   - {{kt("Players")}}: {{gameSlot.playerList.length}} =>  <span v-for="player in gameSlot.playerList"> {{player}} </span>
                 </span>
                 <span v-if="gameSlot.gameTurn>0 && gameSlot.playerList.length==0">
                   <button v-on:click="resetGameSlot({gameId: gameId, slotId: gameSlot.id, newLocal: gameAbout.translation[languageIndex].language})"> {{kt("ResetGame")}} </button>
                 </span>
                 <br/>
              </span>

              </li>

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
        languageIndex: -1
    }
  },
  watch: {
     'game': function (val, oldVal) {

        this.loadGameAbout (val.name)
        // store.dispatch('LOAD_GAME_SLOTS', val.name)

        // show current local in the language combobox
        var i=0
        for (; i<this.gameAbout.translation.length;i++) {
            if (this.gameAbout.translation[i].language == this.locale) {
                this.languageIndex=i
                break
            }
        }
        // not necessary, but...
        if ( i==this.gameAbout.translation.length) this.languageIndex=0
     }
  },
  computed: mapGetters([
    'locale',
    'gameId',
    'kt',
    'userId',
    'gameAbout',
    'gameSlots',
    'convertDate'
  ]),
  methods: mapActions([
    'setLocale',
    'loadGameAbout',
    'loadGame',
    'deleteGameSlot',
    'renameGameSlot',
    'resetGameSlot'

  ]),
  props: ['game']
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  color: #42b983;
  text-align: left;
}

.ludi-game-detail {
  text-align: left;

}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
  text-align: left;
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
