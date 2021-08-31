
const KL_Delay = 500;

//module.exports = {
export default {

    SETLOCALE (state, newLocale) {

    // to-do: not to allow playing a game without this locale

    // prevention
    if ((newLocale == undefined) || (newLocale == "")) state.locale = "en"
    else state.locale = newLocale

    if (storageON()) localStorage.ludi_locale = state.locale

    if (state.slotId == '' || typeof state.slotId == 'undefined') {
      state.languages.all = ['en', 'eo', 'es', 'fr']
      state.languages.pref = [state.locale]
      state.languages.other = []
      for (let i=0;i<state.languages.all.length;i++) {
        if (state.languages.all[i] != state.locale) {
          state.languages.other.push (state.languages.all[i])
        }
      }
    } else {
      for (let i=0;i<state.gameAbout.translation.length;i++) {
        if (state.languages.all.indexOf (state.gameAbout.translation[i].language) >= 0) {
          state.languages.inGame.push (state.gameAbout.translation[i].language)
        }
      }

    }

    state.runnerProxie.setLocale (state)

    refreshFromProxie (state)

  },

  LOADGAMES (state, filter) {

  	if (state.runnerProxie.getUserId() == "") {
  		state.runnerProxie.loadGames ()
  	}

    state.games = state.runnerProxie.getGames ()
    console.log ("Games loaded in memory")

  },

  LOAD_GAME_ABOUT: LOAD_GAME_ABOUT,

  PROCESS_CHOICE (state, choice) {
	   processChoice (state, choice)
  },

  PROCESS_CHOICE_WITH_FILTER (state, choiceFilter) {
    console.log("choiceFilter selected: " + choiceFilter )

    var choices = state.runnerProxie.getChoices()
    var choiceIndex = -1

    for (var i= 0; i<choices.length; i++) {
      if (choices[i].choiceId == "top") continue
      if (choices[i].parent == "top") continue
      if (choices[i].txt_final.indexOf(choiceFilter) !== -1) {choiceIndex = i; break;}
    }

    if (choiceIndex == -1) return
    console.log("choice selected: " + choices[choiceIndex].txt_final )

	  processChoice (state, choices[choiceIndex])
  },

  afterRequesGameSlotList: afterRequesGameSlotList,

  SETGAME (state, gameId) {
    state.gameId = gameId
    console.log ("gameId: " + state.gameId)
    state.slotId = ""
    state.gameSlots = state.runnerProxie.getGameSlotList (state.gameId)
    var gameIndex = arrayObjectIndexOf (state.games, "name", gameId)
    state.gameAbout = state.games[gameIndex].about
  },

  SETGAMEID (state, payload) {

    var gameId= payload.gameId
    var slotId= payload.slotId

    console.log ("state.locale: " + state.locale)
    console.log ("Slot: " + slotId)

    let l;
    let t = state.gameAbout.translation;
    for (l=0; l < t.length; l++) {
      if (t[l].language == state.locale) break;
    }

    // languages
    let oldLanguages = state.languages
    let languagesInGame = []
    for (let i=0;i<state.gameAbout.translation.length;i++) {
      languagesInGame.push (state.gameAbout.translation[i].language)
    }
    state.languages = oldLanguages
    state.languages.inGame = languagesInGame

    state.gameId = gameId
    state.slotId = slotId

    state.gameSlots = state.runnerProxie.getGameSlotList (state.gameId)

    state.runnerProxie.setLocale (state)

    var gameIndex = arrayObjectIndexOf (state.games, "name", gameId)
    state.gameAbout = state.games[gameIndex].about

    // cleaning previous game data
    cleanHistory(state)

    if (state.userId == '') { // local engine
      state.runnerProxie.join ( gameId, slotId)
      afterGameLoaded(state, slotId)
    } else {
      state.choice = {choiceId:'top', isLeafe:false, parent:''}
      state.runnerProxie.join (gameId, slotId)

      //state.runnerProxie.setLocale (state) // update language data in proxie

      // wait for several seconds till the game were loaded
      setTimeout(function () {
        if (state.runnerProxie.getUserId() != '') {
          afterGameLoaded(state, slotId)
        }
      }, 3000);

    }


  },

  SAVE_GAME_STATE (state, slotDescription) {
    state.runnerProxie.saveGameState (slotDescription)
    // refresh slot list
    state.gameSlots = state.runnerProxie.getGameSlotList (state.gameId )
  },

  DELETE_GAME_STATE (state, payload) {
    state.runnerProxie.deleteGameState (payload.gameId, payload.slotId)
    // refresh slot list
    state.gameSlots = state.runnerProxie.getGameSlotList (payload.gameId )

  },

  RENAME_GAME_STATE (state, payload) {
    state.runnerProxie.renameGameState (payload.gameId, payload.slotId, payload.newSlotDescription)
    // refresh slot list
    state.gameSlots = state.runnerProxie.getGameSlotList (state.gameId )

  },

  RESETGAMESLOT (state, payload) {
      if (state.runnerProxie.getUserId() == '') return
  		state.runnerProxie.resetGameSlot (payload.gameId, payload.slotId, payload.newLocal)

  },

  SET_PENDING_CHOICE (state, choice) {
     state.menu = []
	   processChoice (state, choice)
  },

  SET_KEY_PRESSED (state, choice) {
	  state.runnerProxie.keyPressed()

    if (state.runnerProxie.getUserId() == '')  {
        refreshFromProxie (state)
    }
  },

  RESETUSERID (state) {
    state.runnerProxie.logoff()

    // wait for the change
    setTimeout(function () {
      if (state.runnerProxie.getUserId() == '') {
        //state.userId = state.runnerProxie.getUserId()
        refreshFromProxie (state)
      }
    }, 3000);
  },

  SETUSERID (state, payload) {
    state.runnerProxie.logon (payload.userId, payload.password)
    setTimeout(function () {
      if (state.runnerProxie.getUserId() != '') {
        //state.userId = state.runnerProxie.getUserId()
        refreshFromProxie (state)
      }
    }, 3000);
  },

  USERIDCHANGED (state, userId) {
    state.runnerProxie.quitGame()

    if (userId != '') {
      state.userSession =  state.runnerProxie.getToken()
      state.playerList = state.runnerProxie.getPlayerList ()
      if (storageON()) localStorage.ludi_userId = state.userId
      state.chatMessages = [
          {seq:1, from: 'demo-user', msg:'Mensaje de demo.', new:true},
          {seq:0, from: 'System', msg:'Bienvenido a KunLudi. En esta sección verás los mensajes de los otros jugadores.', new:true}
      ]
      state.chatMessagesInternal = []
      state.chatMessagesState = 0

      state.runnerProxie.linkChatMessages (state.chatMessagesInternal)

    }

  },

  QUITGAME (state) {
    state.runnerProxie.quitGame ()

    state.slotId = ''
    //  state.gameId = ''
    //  state.about= {}

  	//mutations.SETLOCALE (state, state.locale)

  	// force change
  	let oldLanguages = state.languages
  	state.languages = oldLanguages
  	state.languages.inGame = undefined

  	cleanHistory(state)

  },

  SEND_CHAT_MESSAGE(state, payload) {
    state.runnerProxie.sendChatMessage (payload.chatMessage, payload.target)
  }

}

// --------------------------------------

function LOAD_GAME_ABOUT (state, gameId) {

	// general information
	for (var i=0;i<state.games.length;i++) {
		if (state.games[i].name == gameId) {state.gameAbout = state.games[i].about; break; }
	}

	// available slots
	state.runnerProxie.requestGameSlotList ({gameId: gameId})
	if (state.runnerProxie.getUserId() == '') {
		afterRequesGameSlotList (state)
	} else {
    // vue2! how to do it?!
		setTimeout(afterRequesGameSlotList (state), KL_Delay)
	}

}

function afterRequesGameSlotList (state) {
  state.gameSlots = state.runnerProxie.getGameSlotList ()
}


// --------------------------------------

function arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function storageON() {
    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

function refreshFromProxie (state) {


  state.userId = state.runnerProxie.getUserId()
  state.gameId = state.runnerProxie.getGameId()
  state.slotId = state.runnerProxie.getSlotId()

  if (state.gameId == "" || typeof state.slotId == 'undefined') {
    state.games = state.runnerProxie.getGames ()
  } else { // if playing a game
    state.choice = state.runnerProxie.getCurrentChoice()
    state.reactionList = state.runnerProxie.getReactionList ()
    state.pendingChoice = state.runnerProxie.getPendingChoice()
    state.choices = state.runnerProxie.getChoices ()
    state.gameTurn = state.runnerProxie.getGameTurn ()
    state.PCState = state.runnerProxie.getPCState()
    state.history = state.runnerProxie.getHistory()
    state.pendingPressKey = state.runnerProxie.getPendingPressKey ()
    state.pressKeyMessage = state.runnerProxie.getPressKeyMessage ()
    state.lastAction =  state.runnerProxie.getLastAction ()
    state.menu = state.runnerProxie.getMenu ()
    state.menuPiece = state.runnerProxie.getMenuPiece ()

    state.gameIsOver = state.runnerProxie.getGameIsOver()
  }

  // chatmessages
  if ((state.chatMessagesInternal.length > 0) && (state.chatMessagesState != state.chatMessagesInternal[0].seq)) {
    state.chatMessagesState = state.chatMessages[0].seq
    state.chatMessages = state.chatMessagesInternal.slice()
    console.log ("State of chatMessages: " +  state.chatMessages[0].seq)
  }
}

function cleanHistory (state) {

	state.history = []

	state.history.push ( {
		action: { choiceId:'action0', action : {actionId:'look'}, noEcho:true},
		reactionList: [
			//{ type: 'rt_msg', txt: 'Introduction' },
			// { type: 'rt_press_key', txt: 'press_key_to_start' }
		]
	})

	state.gameTurn = state.runnerProxie.resetGameTurn()
	state.runnerProxie.setHistory(state.history )
	state.pendingChoice = {}
}

function afterGameLoaded(state, slotId) {

  // to-do: what if error?

  state.slotId = slotId

  state.runnerProxie.setLocale (state)

  refreshFromProxie(state)


	if (state.PCState.profile.indexPC < 0) { // old: state.PCState.PC < 0) {
		// error
		alert ("http error");
		mutations.RESETGAMEID(state)
		return
	}

  /*
  //only when local playing
  if (state.runnerProxie.getUserId() == '') {
	  state.runnerProxie.setHistory(state.history )
  }
  */

	// ?? state.runnerProxie.saveGameState (slotId)

	state.gameSlots = state.runnerProxie.getGameSlotList (state.gameId)

}

function processChoice (state, choice) {

  // to-do here
  if (state.choice != undefined) {
    if (state.choice.choiceId == 'quit') return

  }

	state.choice = choice
	state.menu = []

	var optionMsg
	if (choice.isLeafe) {
		console.log ("store.js. leafe action: {userSession:'" + state.userSession + "', action: {" +  JSON.stringify(choice.action) + "}" )

		optionMsg = choice.action.msg
    state.lastAction = choice
	} else {
    console.log ("store.js. non-leafe action: {userSession:'" + state.userSession + "', choice: {" +  JSON.stringify(choice) + "}" )

  }

	// processing choices or game actions (leave choices)
	state.runnerProxie.processChoice (choice, optionMsg)

  // to-do: sure?
	if (state.runnerProxie.getUserId() == '') {
      refreshFromProxie (state)
  }

}
