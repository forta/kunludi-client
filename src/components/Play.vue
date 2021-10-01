<template>

<div>

<h1  v-show="!slotId"><router-link to="/ludi/games" > {{kt("Games")}} </router-link></h1>

<div v-show="slotId">

  <div id= "play" class="play">

    <div id= "play_top" class="play_top">

        <button v-on:click="showEndOfText()" > {{kt("bottom")}}  </button>

        <h2>{{kt("History")}}</h2>

        <div v-for="hitem in history">
            <!-- echo -->
            <p><b>
              <span v-if ="hitem.gameTurn > 0"> {{hitem.gameTurn}} &gt; </span>
              <!-- {{hitem.gameTurn}} &gt; -->
              {{i8n_showText(hitem.action)}}
            </b></p>

            <div :class = " (hitem.gameTurn < history.length - 1)? 'beforeTheLastReaction': 'lastReaction' " >
              <span v-for="r in hitem.reactionList">
                 <span v-if ="((r.visible) || (typeof r.visible == 'undefined'))">
                    <span v-if= "(r.type != 'rt_link')" v-html="i8n_showReaction(r, hitem.gameTurn)"></span>
                    <span v-if="(r.type == 'rt_link')">
                      <span v-if="(hitem.gameTurn == history.length - 1)"><a v-on:click="execLink(r.param)">{{r.param.l1.txt}}</a></span>
                      <span v-if="(hitem.gameTurn < history.length - 1)">{{r.param.l1.txt}}</span>
                    </span>
                 </span>
              </span>
            </div>

            <span id="{ 'reactionLink-' + hitem.gameTurn }" class = "reactionLink">
            <!-- to-do: render hidden pictures from links here?
            <span v-for="r in hitem.reactionList">
              <span v-html="i8n_showReactionLink(r, hitem.gameTurn)"></span> // show only clicked links
            </span>
            -->
            </span>

        </div>

        <div class="reactionList" v-if = "lastAction != undefined">
          <!-- echo of active reaction -->
          <p><b>
            <span v-if ="history.length > 0"> {{history.length-1}} &gt; {{actionToShow(lastAction, true)}} </span>
          </b></p>

      		<span v-for="r in reactionList">
            <span v-if ="((r.visible) || (typeof r.visible == 'undefined'))">

<!--            <span v-if ="((r.visible) || (typeof r.visible == 'undefined'))" v-html="i8n_showReaction(r, history.length-1)"></span>-->
              <span v-if= "(r.type != 'rt_link')" v-html="i8n_showReaction(r, history.length-1)"></span>
              <span v-if="(r.type == 'rt_link')"> {{r.param.l1.txt}}</span>
            </span>

      		</span>
        </div>

    </div>

  </div>

  <div  id="play_bottom" class="play_bottom" v-if ="!gameIsOver">

    <!-- press key -->
    <div v-if = "pendingPressKey">
       <button v-on:click="pressAnyKey()" > {{i8n_showText(pressKeyMessage)}}  </button>
    </div>

    <!--
    <div class="mainChoices" >
      <span v-for="choice in choices">
          <p><button v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText(choice, false)}}</button></p>
      </span>
    </div>
    -->

    <!-- choices (not menu nor presskey) -->
    <div v-if = "!pendingPressKey && menu.length == 0  && currentChoice.choiceId != 'quit'" >

      <div class="mainChoices" >
          <h3> {{kt("Location")}}: {{i8n_showPCStateLocation()}}</h3>

          <span v-for="choice in choices">
              <span v-if ="choice.choiceId == 'itemGroup'"  v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()"> {{i8n_showText(choice, false)}} </span>
              <span v-if ="choice.choiceId == 'directActions' "  v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()"> {{i8n_showText(choice, false) }} </span>
              <span v-if ="choice.choiceId == 'directionGroup' "  v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()"> {{i8n_showText(choice, false)}} </span>
          </span>
      </div>
      <div class="mainChoices" >
          <!-- to-do: focus on filter REf: https://michaelnthiessen.com/set-focus-on-input-vue -->
          <h3> Filtro: <input  v-model="choiceFilter"  v-on:keyup.enter="doGameChoiceWithFilter(choiceFilter);choiceFilter='';showEndOfText()"> </h3>
      </div>

  	<hr/>

    <!-- free-of-context choices -->
    <span v-for="choice in choices">
        <button v-if = "(choice.parent!= 'top') && (choice.choiceId!= 'top') && (choice.parent != 'obj1') && (choice.parent != 'inside') && (choice.parent != 'action2') && i8n_showText_with_Filter(choice, false, choiceFilter) != ''" v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText_with_Filter(choice, false, choiceFilter)}}</button>
    </span>

      <h3 v-if="currentChoice.choiceId=='obj1'"> {{i8n_showText(currentChoice)}}</h3>

  	<!-- actions on selected item -->
      <div class="choices" v-if= "currentParent() != ''">
          <!-- show current item  -->
          <p><div v-html="currentParent()"></div></p>
          <span v-for="choice in choices">
              <!-- use choiceFilter -->
              <button v-if = "(choice.parent == 'obj1') && i8n_showText_with_Filter(choice, false, choiceFilter) != '' " v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText_with_Filter(choice, false)}}</button>
              <button v-if = "(choice.parent == 'inside') && i8n_showText_with_Filter(choice, false, choiceFilter) != '' " v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText_with_Filter(choice, false)}}</button>
              <button v-if = "(choice.parent == 'action2') && i8n_showText_with_Filter(choice, false, choiceFilter) != '' " v-bind:class="getChoiceClass(choice)" v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText_with_Filter(choice, false)}}</button>
          </span>
      </div>

   </div>

    <!-- menu but not presskey -->
    <div class="menu" v-if = "!pendingPressKey && menu.length > 0">

      <div class="menuPiece" v-if = "typeof menuPiece != 'undefined'" v-html="i8n_showReaction (menuPiece, history.length-1)"></div>  <!-- history.length? -->

      <div class="menuChoices">
        <!-- <h3> {{kt("Action")}}: {{i8n_showText(pendingChoice)}}</h3> -->
        <ul>
            <span v-for="(m, index) in menu">
            <li><button v-on:click="menuOption({pendingChoice:pendingChoice, menu:menu, m:m}); showEndOfText()">  {{ index + 1}} - {{i8n_showText(m)}}</button></li>
            </span>
        </ul>
      </div>

    </div>

  </div>

  <div class="chatSecton" v-show="userId != ''">
      <!-- <button v-on:click="seeChatSection()"> -->
      <button v-on:click="chatVisible = !chatVisible;numberOfKnownMessages = chatMessages.length">

        {{kt("Messages")}}
        <span v-if = "!chatVisible">({{chatMessages.length - numberOfKnownMessages}})</span>
      </button>
      <div class="chatSubsecton" v-show="chatVisible">
        <div v-for="c in chatMessages">
            <p><b>{{c.from}}
            <span v-if="c.scope == 'private'"> -&gt; {{c.target}}</span>:</b>
            {{c.msg}} </p>
        </div>
        <b>{{kt("Online Players")}}: </b>
        <span v-for="p in playerList">
            // <span v-if = "slotId == p.slotId">
              <span v-if="userId != p.userId"><button v-on:click="selectChatToUser(p.userId)" >{{p.userId}}</button></span>
              <span v-if="userId == p.userId"><b>{{p.userId}}</b></span>
              <span v-if="p.type > 0"><b>(R)</b></span>
              ({{p.locale}}) ({{convertDate(p.date)}})
            // </span>
        </span>

        <br/>

        <span v-show="selectedUserToChat != ''"><button v-on:click="selectChatToAll()"> {{kt("ChatGame")}}</button></span>
        <span class="chatToAll" v-show="selectedUserToChat == ''">{{kt("ChatGame")}}: </span>
        <span class="chatToUser" v-show="selectedUserToChat != ''">{{kt("ChatPrivate")}} [{{selectedUserToChat}}]: </span>
        <input v-model="chatMessage">
        <button v-on:click="sendMessage({chatMessage: chatMessage, target:selectedUserToChat}); chatMessage = ''" > {{kt("Send message")}}  </button>
        <br/><br/>
    </div>
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
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
// import Reaction from './Reaction.vue'

export default {

    data () {
     return {
       chatVisible: true,
       selectedUserToChat: '',
       chatMessage:'',
       numberOfKnownMessages:0,
       gameEnded:false,
       choiceFilter: ''
      }
  },
  /*
  watch: {
      choiceFilter: function(val) {
        console.log("choiceFilter has changed: " + val )

      }
  },
  */

  computed: mapGetters([

    'locale',
    'gameId',
    'slotId',
    'userId',
    // 'languages',
    //'games',
    'kt',
    'i8n_showText',
    'i8n_showText_with_Filter',
    'i8n_showReaction',
    'i8n_showPCStateLocation',
    'getChoiceClass',
    'currentParent',

    'history',
    'lastAction',
    'gameIsOver',
    'pendingPressKey',
    'choices',
    'menu',
    'menuPiece',
    'currentChoice',
    'PCState',
    'reactionList',
    'pendingChoice',
    'pressKeyMessage',

    // messages
    'chatMessages',
    'playerList'

  ]),


 components: {
     // Reaction
  },

  methods: Object.assign(mapActions([
    'setLocale',
    'doGameChoice',
    'execLink',
    'doGameChoiceWithFilter',
    'menuOption',
    'pressAnyKey',
    'sendMessage'
  ]), {

    internalActionExample: (par) => {
      // do something with par
    },

    actionToShow: function (choice, isEcho) {

      if (typeof choice.i8n != 'undefined')
        if (choice.i8n[this.locale] != 'undefined')
          if (choice.i8n[this.locale].txt != '')
            return choice.i8n[this.locale].txt // más adelante, que no sea txt, sino echo.txt, short.txt, long.txt, o inlcuso un objeto renderizable

      return JSON.stringify(choice) + ". isEcho: " + isEcho
    },

    showEndOfText: () => {
          //var elem = document.getElementById("play_bottom")
          // elem.scrollIntoView(true)

          setTimeout(function(){
          var elem = document.getElementById("play_bottom_2")
          if (elem != null)
              //elem.scrollTop =  elem.scrollHeight
              elem.scrollIntoView(true)

          }, 100);

    },

    seeChatSection: () => {
        this.chatVisible = !this.chatVisible
        /*
        if (!this.chatVisible) {
          this.numberOfKnownMessages = this.chatMessages.length
        }
        */
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
      },
      showCurrentChoice: function () {
           console.log ("current choice on play.vue: " + JSON.stringify (this.currentChoice))

           return i8n_showText (this.currentChoice)

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

.choiceTop {
	background-color: #DAA;
}

.choiceIG_here {

	background-color: #40FF00;
}


.choiceObj1_here {
	background-color: #40FF00;
}
.choiceIG_carrying {
	background-color: #FFFF00;
}
.choiceObj1_carrying {
	background-color: #FFFF00;
}
.choiceIG_notHere {
	background-color: #FF0000;
}
.choiceObj1_notHere {
	background-color: #FF0000;
}

.choiceDA {
	background-color: #DF7400;
}

.choiceDirections {
	background-color: #2EFEF7;
}
.choiceDir1 {
	background-color: #2EFEF7;
}

.choiceAction {
	background-color: #FCA;
}

.choiceAction2 {
	background-color: #FE2E64;
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

div.reactionList {
	/*background-color: #FFF;*/
  text-align: left;
  background-color: #CFD;
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


div.mainChoices {
	background-color: #FFE;
}

div.chatSecton {
  background-color: #EEE;
  text-align: left;
  /*font-size: 0.9vw;*/
}

div.beforeTheLastReaction {
  /* background-color: #FFD; */
}

div.lastReaction {
  background-color: #CFD;
}

span.reactionLink {
  background-color: #FFD;
}

div.choices {
	background-color: #FFD;
  text-align: left;
}

span.chatToUser, span.chatToAll {
  background-color: #AFD;
}

button {
    border-radius: 5px;
    font-size: 1.5em;
}

div, p {
    font-size: 1em;
}

div.menuPiece {
  float:left;
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
