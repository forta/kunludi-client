import router from '../router'

export default {
//module.exports = {

  setLocale: ({commit}, locale) => {
    commit('SETLOCALE', locale)
  },

  setGame: ({commit}, gameId) => {
    commit('SETGAME', gameId)
  },

  loadGames: ({commit}, filter) =>  {
    commit('LOADGAMES', filter)
  },

  loadGameAbout: ({commit}, gameId) => {
    commit('LOAD_GAME_ABOUT', gameId)
  } ,

  loadGame: ({commit}, payload) => {
    commit ('SETLOCALE', payload.newLocale)
    commit ('SETGAMEID', payload)

  },

  saveGame: ({commit}, gameId) => {
    var d = +new Date ()

    var slotDescription = prompt ("State description", gameId + d.toLocaleString())
    if (slotDescription && slotDescription !== '') {
      commit ('SAVE_GAME_STATE', slotDescription)
    }
  },

  quitGame : ({commit}, payload) => {
    var option = confirm (payload.message)
    if (!option) return
    router.push('/ludi/games')

    commit ('QUITGAME')
  },

  doGameChoice: ({commit}, choice) => {
    commit('PROCESS_CHOICE', choice)
  },

  menuOption: ({commit}, payload) => {
      //var choice = this.pendingChoice
      var choice = payload.pendingChoice
      choice.action.option = payload.m.id
      choice.action.msg = payload.m.msg
      choice.action.menu = payload.menu
      commit('SET_PENDING_CHOICE', choice)
  },

  pressAnyKey: ({commit}) => {
    commit('SET_KEY_PRESSED')
    //this.$router.push('/ludi/games')
  },

  logoff: ({commit}) => {
    commit('RESETUSERID')
    router.push('/ludi/games')
  },

  deleteGameSlot: ({commit}, payload) => {
      commit ('DELETE_GAME_STATE', payload)
  },

  renameGameSlot: ({commit}, payload) => {
      payload.newSlotDescription = prompt ("Description", payload.slotDescription)
      if (payload.newSlotDescription == '') return
      commit ('RENAME_GAME_STATE', payload)
  },

  resetGameSlot: ({commit}, payload) => {
    commit ('RESETGAMESLOT', {gameId: payload.gameId, slotId: payload.slotId, newLocal:payload.newLocal})
  },

  modifyUserId: ({commit}, payload) => {
    commit ('SETUSERID', {userId:payload.userId, password:payload.password} )
  },

  userModified: ({commit}, userId) => {
    commit ('USERIDCHANGED', {userId:userId} )
    if (userId == '') router.push('/ludi/games')
    else router.push('/ludi/play')
  },

  sendMessage: ({commit}, payload) => {
      commit ('SEND_CHAT_MESSAGE', {chatMessage:payload.chatMessage, target:payload.target})
  }

}
