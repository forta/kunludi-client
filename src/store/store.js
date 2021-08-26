import Vue from 'vue'
// import VueResource from 'vue-resource'
import Vuex from 'vuex'
Vue.use(Vuex)
// Vue.use(VueResource)

// vue dependence (VueResource)
// vue2: runnerProxie.initHttp (Vue.http)

import state from "./state.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
  /*
  ,
  modules: {
    scoreBoard: childA,
    resultBoard: childB
  }
  */
})


// --------------------------------------
