<template>

<div>

  <!-- <img src="./../../data/icons/social.jpg"> -->

  <div class="kune">
    <div v-show="userId == ''">
       <login></login>
  	</div>

  	<div v-show="userId != ''">
          <h3>{{kt("Username")}}: {{ userId }}</h3>
          <p v-if="userId=='admin'"> <router-link to="/admin"> {{kt("Admin")}} </router-link> </p>
          <button v-on:click="logoff">Logout</button>
          <!--
          <router-link to="kune/messages" v-show="userId != 'annonymous'" > {{kt("Messages")}} | </router-link>
          <router-link to="/kune/boards" v-show="userId != 'annonymous'" > {{kt("Boards")}} | </router-link>
          -->
  	</div>

  </div>

  <div class="chatSecton" v-show="userId != ''">
    <b>{{kt("Online Players")}}: </b>
    <span v-for="p in playerList">
        <span><b>{{p.userId}}</b>({{convertDate(p.date)}}) | </span>
    </span>

    <br/><br/>

    <!-- send private messages -->
    <!--
    <span>{{kt("ChatPrivate")}}. </span>
    <span>{{kt("Username")}}: </span>
    <input v-model="chatToUser">
    <input v-model="chatMessagePrivate">
    <button v-on:click="sendMessagePrivate()" > {{kt("Send message")}}  </button>
    -->

    </div>
  </div>

</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import Login from './Login.vue'

export default {
  data () {
    return {
    }
  },
  computed: mapGetters([
    'gameId',
    'userId',
    'kt',
    'playerList'
  ]),

  methods: Object.assign(mapActions([
    'logoff'
  ]), {

    convertDate: (dateJSON) => {
      var d = new Date (JSON.parse (dateJSON))
      return d.toLocaleString()
    }
  }),

  mounted: function () {
    // https://vuejs.org/v2/guide/instance.html
    this.$forceUpdate() // important to refresh not already translated messages
    console.log("at Kune.vue#mounted()")
  },

  components: {
     Login
  }

}

</script>


<style scoped>

</style>
