
// module.exports = {

export default {

  // mappings
  locale: state => state.locale,
  languages: state => state.languages,
  gameId: state => state.gameId,
  userId: state => state.userId,

  slotId: state => state.slotId,
  games: state => state.games,
  gameAbout: state => state.gameAbout,
  gameSlots: state => state.gameSlots,

  // play
  history: state => state.history,
  lastAction: state => state.lastAction,
  gameIsOver: state => state.gameIsOver,
  pendingPressKey: state => state.pendingPressKey,
  choices: state => state.choices,
  menu: state => state.menu,
  menuPiece: state => state.menuPiece,
  currentChoice: state => state.choice, //!
  PCState: state => state.PCState,

  reactionList: state => state.reactionList,
  pendingChoice: state => state.pendingChoice,
  pressKeyMessage: state => state.pressKeyMessage,
  chatMessages: state => state.chatMessages,
  playerList: state => state.playerList,

  convertDate: () => (dateJSON) => {
      try {
        var d = new Date (JSON.parse (dateJSON))
        return d.toLocaleString()
      }
      catch(error) {
        return "date?"
      }
  },

  kt: (state) => (kMsg) => {
  		if (state.locale == "") {
  			// set default language and load kernel messages
  			// attention: using window object
  			if (["es", "en", "eo", "fr"].indexOf(window.navigator.language) >=0)
  				mutations.SETLOCALE(state, window.navigator.language);
  			else
  				mutations.SETLOCALE(state, 'en');
  		}

  		if (state.locale != "") {
  			if (state.kernelMessages [state.locale] != undefined) {
  				if (state.kernelMessages[state.locale][kMsg] != undefined) {
  					return state.kernelMessages[state.locale][kMsg].message
  				}
  			}
  		}
  		return "(" + kMsg + ")"
  },

  langIsValid: (state) => (lang) => {
      // console.log ('langIsValid(). lang: ' + lang)

      if (typeof state.languages.inGame == 'undefined') return true
      for (var l=0; l<state.languages.inGame.length;l++ ) {
          if (state.languages.inGame.indexOf (lang) >= 0) return true
      }
      return false
  },

  translatedGameName: (state) => (gameId) => {
    // to-do: use an external module for gameIsInLocale and others?

    function gameIsInLocale() {
      for (var i=0; i<state.games.length;i++) {
        if (state.games[i].name == gameId ) {
           for (var j=0; j<state.games[i].about.translation.length;j++) {
             if (state.games[i].about.translation[j].language == state.locale ) {
                return {gameIndex: i, translationIndex:j}
             }
           }
           return {gameIndex: i, translationIndex:undefined}
        }
      }
    }

    var l = gameIsInLocale(gameId)

    if (l == undefined) return gameId + " undefined"
    if (l.translationIndex == undefined)
      return state.games[l.gameIndex].about.translation[0].title + " (" + state.games[l.gameIndex].about.translation[0].language + ")"

    return state.games[l.gameIndex].about.translation[l.translationIndex].title

  },

  getChoiceClass: () => (choice) => {

      if (choice.choiceId == 'action0') return "choiceDA"
      if (choice.choiceId == 'action') return "choiceAction"
      else if (choice.choiceId == 'action2')  return "choiceAction2"
      else if (choice.choiceId == 'obj1') return "choiceObj1" + "_" + choice.parent
      else if (choice.choiceId == 'dir1') return "choiceDir1"
      else if (choice.choiceId == 'itemGroup') return 'choiceIG' + "_" + choice.itemGroup
      else if (choice.choiceId == 'directActions') return 'choiceDA'
      else if (choice.choiceId == 'directionGroup') return 'choiceDirections'
      return ""
  },

  currentParent: (state, getters) => () => {
      for (var c in state.choices) {
        if (state.choices[c].parent == 'obj1') { // first action with obj1 parent
          for (var c2 in state.choices) {
            if (state.choices[c2].choiceId == 'obj1' &&
                state.choices[c2].item1 == state.choices[c].action.item1) {
                  return "<p>" + i8n_showText_interno (state.choices[c2], state.locale) + "</p>"
              }
          }
        }
      }
     return ""
  },

  i8n_showText: (state) => (i8nMsg, isEcho) => {
    return i8n_showText_interno (i8nMsg, state.locale)
  },


  i8n_showText_with_Filter: (state) => (i8nMsg, isEcho, choiceFilter) => {
    var txt = i8n_showText_interno (i8nMsg, state.locale)
    if (typeof choiceFilter == "undefined"  || choiceFilter == "" ) return txt
    return (txt.indexOf(choiceFilter) !== -1)? txt: ""
  },


  i8n_showPCStateLocation: (state) => () => {
    if (typeof state.PCState == 'undefined') return "(loc)"
    if (typeof state.PCState.profile == 'undefined') return "(loc)"
    if (typeof state.PCState.profile.locMsg == 'undefined') "(loc)"

    return i8n_showText_interno (state.PCState.profile.locMsg, state.locale)
  },

  i8n_showReaction: (state, getters) => (reaction) => {

    var txt = i8n_showText_interno (reaction, state.locale) + "<br/>"

    if (typeof reaction.type == 'undefined') {
      return JSON.stringify (reaction)
    }

    if (reaction.type == "rt_refresh") return ""
    if (reaction.type == "rt_dev_msg") return ""

    if ( (reaction.type == "rt_graph") ||
         (reaction.type == "img") ) { //?? received a menuPiece
      var imgText = ""
      if (reaction.isLink) {
        if (reaction.isLocal) {
          imgText += "<a href='" + require("./../../data/games/" + state.gameId + "/images/" + reaction.url) + "' target='_blank'>" + txt + "</a><br/>"
        }	else {
          imgText += "<a href='" + reaction.url + "' target='_blank'>" + txt + "</a><br/>"
        }
      } else {
        // patch
        var url_src = (reaction.type == "rt_graph")? reaction.url : reaction.src
        try {
          if (reaction.isLocal) {
            url_src = "/images/" + url_src
            imgText = "<p>" + txt + "</p><img src='" + require("./../../data/games/" + state.gameId + url_src) + "'/><br/>"
          } else {
            // to-do: in fact, it doesn't work
            imgText += "<p>" + txt + "</p><img src='" + url_src + "'/><br/>"
          }
        }
        catch(error) {
          //console.error(error);
          console.log("Error: broken link to " +  url_src);
          imgText = "<p>" + txt + " (error on " + url_src + ")</p>"
        }
      }
      return imgText

    } else if (reaction.type == "rt_play_audio") {
        var imgText = "audio: " + JSON.stringify (reaction)

        /*
          old code:

          // define sound
          var audioElem = document.getElementById('audio');
          audioElem.src = "./client/data/games/" + ludi_routing.userState.data.gamename + "/audio/" + ca.fileName;

          // link to pause/restart
          txt ="<div id = 'audioStart'>";
          txt += ludi_renderer.expandText(ludi_renderer.showMSG (ca.txt, ca.param));
          txt	+= "<button id=\"playIt1\" onclick=\"" + "ludi_routing.playAudio()" + "\">" + "Play/Pause" + "</button>";
          txt += "</div>\n";

          if (ca.autoStart)
            ludi_routing.playAudio();

       */

       /*
       ludi_routing.playAudio = function () {

        var audioElem = document.getElementById('audio');
        if (audioElem.paused)
          audioElem.play();
        else
          audioElem.pause();

       }
       */
    } else if (txt != "") {
      return txt
    } else {
      return JSON.stringify (reaction)
    }

  }

}

function i8n_showText_interno (i8nMsg, locale) {

  // txt_final: static conversion, forever
  if (typeof (i8nMsg.txt_final) != 'undefined') {
    return i8nMsg.txt_final
  }

  if (typeof (i8nMsg.i8n) !== 'undefined') {
    if (typeof (i8nMsg.i8n[locale]) !== 'undefined') {
      if (typeof (i8nMsg.i8n[locale].txt) !== 'undefined') {
        i8nMsg.txt_final = i8nMsg.i8n[locale].txt
        i8nMsg.i8n = undefined
        return i8nMsg.txt_final
      }
    } else { // to-do: try another locales

    }
  } else if (typeof (i8nMsg.msg) != 'undefined') {
    i8nMsg.txt_final = "[msg:" + i8nMsg.msg + "]" //?
    return i8nMsg.txt_final
  } else if (typeof (i8nMsg.txt) != 'undefined') {
    i8nMsg.txt_final = "[" + i8nMsg.txt + "]" //?
    return i8nMsg.txt_final
  }
  i8nMsg.txt_final = "[.]"
  //i8nMsg.txt_final = "[" + JSON.stringify(i8nMsg) + "]"
  return i8nMsg.txt_final

}
