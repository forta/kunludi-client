//game engine
// const runnerProxie = require ('../components/RunnerProxie.js');
import runnerProxie from '../components/RunnerProxie.js'

export default {

  locale: 'es',
  languages: { all: [], pref: [], other: []},
  kernelMessages:[],

  gameId: '',
  slotId: '',
  subgameId: '',

  games: [],
  gameAbout: {},
  gameSlots: [],

  // play
  runnerProxie: runnerProxie,

  gameTurn: 0,
  PCState : {},
  userId: '', // kune
  userSession: 'anonymous',
  history: [ ],

  choices: [],
  choice: {choiceId:'top', isLeafe:false, parent:''} ,
  lastAction: {},
  pendingChoice: {},
  gameIsOver:false,
  enableChoices: true,
  pendingPressKey: false,
  pressKeyMessage: {},
  menu: [],
  menuPiece: '',
  reactionList: [],
  lib: {
    primitives: {},
    reactions:{}
  },
  game: {	},

  // messages and users
  playerList: [],
  chatMessages: [],
  chatMessagesInternal: [],
  chatMessagesState: 0

}
