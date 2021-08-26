// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// var VueResource = require('vue-resource')

import Vuex from 'vuex'
Vue.use(Vuex)

import store from './store/store'

// Vue.use(VueResource)

import App from './components/App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

function storageON() {
    try {
        localStorage.setItem("__test", "data");
    } catch (e) {
        return false;
    }
    return true;
}

// load data from localStorage
if (storageON()) {

  // language by default:
  store.dispatch('setLocale', localStorage.ludi_locale)
  store.dispatch('loadGames')

}
