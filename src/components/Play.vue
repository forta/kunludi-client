<template>

<div>

<h1  v-show="!slotId"><router-link to="/ludi/games" > {{kt("Games")}} </router-link></h1>

  <div v-show="slotId">

    <div id= "play" class="play">

      <div id= "play_top" class="play_top">
          <button v-on:click="showEndOfText()" > {{kt("bottom")}}  </button>
          <history-panel></history-panel>
      </div>

      <div  id="play_bottom" class="play_bottom" v-if ="!gameIsOver">
        <input-classic></input-classic>
      </div>

      <div class="chatSecton" v-show="userId != ''">
        <chat></chat>
      </div>

      <!--
      <audio id="audio">
        <source src="" type="audio/mpeg">
        Your browser does not support this audio format.
      </audio>
       -->

     <div id="play_bottom_2"></div>

    </div>

  </div>
</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

// import Reaction from './Reaction.vue'
import InputClassic from './InputClassic.vue'
import HistoryPanel from './HistoryPanel.vue'
import Chat from './Chat.vue'

export default {

    data () {
     return {
       gameEnded:false
      }
  },

  computed: mapGetters([

    'locale',
    'gameId',
    'slotId',
    'userId',

    'kt',

    'gameIsOver',

  ]),


 components: {
     InputClassic,
     HistoryPanel,
     Chat
     // Reaction
  },

  methods: Object.assign(mapActions([
    'setLocale',
  ]), {

    showEndOfText: () => {
          //var elem = document.getElementById("play_bottom")
          // elem.scrollIntoView(true)

          setTimeout(function(){
          var elem = document.getElementById("play_bottom_2")
          if (elem != null)
              //elem.scrollTop =  elem.scrollHeight
              elem.scrollIntoView(true)

          }, 100);
    }
  }),

  beforeMount: function () {
  //mounted: function () {

    // console.log("at Play.vue#beforeMount()")

    // https://vuejs.org/v2/guide/instance.html

    if (this.gameId =='' || typeof this.gameId == 'undefined') {
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

let methods_old = {

      selectChatToUser: function (userId) {
        this.selectedUserToChat = userId
      },
      selectChatToAll: function () {
        this.selectedUserToChat = ''
      },
      convertDate: function (dateJSON) {
          var d = new Date (JSON.parse (dateJSON))
          return d.toLocaleString()
      },

      isMiddleChoice: function (choice) {
         return ((choice.choiceId == 'action0') ||(choice.choiceId == 'action') ||(choice.choiceId == 'action2') || (choice.choiceId == 'obj1') || (choice.choiceId == 'dir1'))
      },

      decodeHtml: function (html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1 {
  color: #42b983;
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
  font: 200 Helvetica, Verdana, sans-serif;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border: none;
}

div.play {
    overflow: hidden;
    height:100%;
    line-height: 1.5;
}

div.play_top {

  position: relative;
  top: 0;
  right: 0;
 	overflow: hidden; /* Hide both scrollbars */
  text-align: left;
	background-color:#FFF;
  /*overflow-x: hidden; /* /* Hide horizontal scrollbar */

}


/*
div.play_bottom {
    position: relative;
    buttom: 0;
    right: 0;
}
*/

div.play_bottom_2 {
    position: relative;
    buttom: 0;
    right: 0;
    background-color: #FE2E64;
}



button {
    border-radius: 5px;
    font-size: 1.5em;
}

div, p {
    font-size: 1em;
}


@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
        screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {
  button {
      font-size: 1em;
  }
}

@media screen and (min-resolution: 350dpi),
       screen and (min-resolution: 2dppx) {
  button {
      font-size: 1.3em;
  }
}

</style>
