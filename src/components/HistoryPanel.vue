<template>
  <div class="history-panel">
  <h2>{{kt("History")}}</h2>

    <div v-for="hitem in history">
        <!-- echo -->
        <p><b>
          <!-- <span v-if ="hitem.gameTurn > 0"> {{hitem.gameTurn}} &gt; </span> -->
          {{i8n_showText(hitem.action)}}
        </b></p>

        <div :class = " (hitem.gameTurn < history.length - 1)? 'beforeTheLastReaction': 'lastReaction' " >
          <span v-for="r in hitem.reactionList">

             <span v-if ="((r.visible) || (typeof r.visible == 'undefined'))">
        <!-- to-do: if choicesDisable do not show choice bottons at all! -->
                <span v-if= "(r.type != 'rt_link')" v-html="i8n_showReaction(r, hitem.gameTurn)"></span>
                <span v-if="(r.type == 'rt_link')">

                  <span v-if="((hitem.gameTurn < history.length - 1) || gameIsOver || (r.active == false))">{{r.param.l1.txt}}</span>
                  <span v-if="((hitem.gameTurn == history.length - 1) && !gameIsOver  && ((typeof r.active == 'undefined') || (r.active == true)) )"><a v-on:click="execLink(r.param)">{{r.param.l1.txt}}</a></span>

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
        <span v-if ="history.length > 0"><!-- {{history.length-1}} &gt; -->{{actionToShow(lastAction, true)}} </span>
      </b></p>

      <span v-for="r in reactionList">
        <span v-if ="((r.visible) || (typeof r.visible == 'undefined'))">

          <span v-if="((r.type == 'rt_link') || gameIsOver)">{{r.param.l1.txt}}</span>
          <span v-if= "((r.type != 'rt_link') && !gameIsOver)" v-html="i8n_showReaction(r, history.length-1)"></span>

        </span>

      </span>
    </div>

  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters([
    'locale',
    'kt',
    'i8n_showText',
    'i8n_showReaction',
    'gameIsOver',
    'lastAction',
    'reactionList',
    'pendingChoice',
    'history'

  ]),

  methods: Object.assign(mapActions([
    'setLocale',
    'execLink'
  ]), {
    actionToShow: function (choice, isEcho) {

      if (typeof choice.i8n != 'undefined')
        if (choice.i8n[this.locale] != 'undefined')
          if (choice.i8n[this.locale].txt != '')
            return choice.i8n[this.locale].txt // más adelante, que no sea txt, sino echo.txt, short.txt, long.txt, o inlcuso un objeto renderizable

      console.log ("warning (missing echo): " + JSON.stringify(choice) + " . isEcho: " + isEcho)
      return ""
    }

  })

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.reactionList {
	/*background-color: #FFF;*/
  text-align: left;
  background-color: #CFD;
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


</style>
