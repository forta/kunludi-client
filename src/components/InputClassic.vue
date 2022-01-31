<template>
  <div class="input-classic">

    <!-- press key -->
    <div v-if = "pendingPressKey">
       <button v-on:click="pressAnyKey();showEndOfText()" > {{i8n_showText(pressKeyMessage)}}  </button>
    </div>

    <!--
    <div class="mainChoices" >
      <span v-for="choice in choices">
          <p><button v-on:click="doGameChoice(choice); showEndOfText()">{{i8n_showText(choice, false)}}</button></p>
      </span>
    </div>
    -->

    <!-- choices (not menu nor presskey) -->
    <div v-if = "!pendingPressKey && menu.length == 0  && currentChoice.choiceId != 'quit' && enableChoices">

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
          <h3 v-if="enableChoices"> Filtro: <input  v-model="choiceFilter"  v-on:keyup.enter="doGameChoiceWithFilter(choiceFilter);choiceFilter='';showEndOfText()"></h3>
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




  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {

  data () {
   return {
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
    'kt',

    'i8n_showText',
    'i8n_showText_with_Filter',
    'i8n_showPCStateLocation',
    'currentParent',

    'history',
    'choices',

    'getChoiceClass',
    'pendingPressKey',
    'menu',
    'menuPiece',
    'currentChoice',
    // 'PCState',
    'enableChoices',
    'pressKeyMessage'

  ]),

  methods: Object.assign(mapActions([
    'setLocale',
    'pressAnyKey',
    'doGameChoice',
    'doGameChoiceWithFilter',
    'menuOption'

  ]), {
    showEndOfText: () => {
      // defined in play.vue // release it from here?
    }

  })

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.mainChoices {
	background-color: #FFE;
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

div.menuPiece {
  float:left;
}

</style>
