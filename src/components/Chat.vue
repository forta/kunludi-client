<template>
  <div class="chat">
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
</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {

  data () {
    return {
     chatVisible: true,
     chatMessage:'',
     selectedUserToChat: '',
     numberOfKnownMessages:0     
     }
  },

  computed: mapGetters([
    'locale',
    'kt',
    'chatMessages',
    'playerList'
  ]),
  methods: Object.assign(mapActions([
    'setLocale',
    'sendMessage'
  ]),{

    seeChatSection: () => {
        this.chatVisible = !this.chatVisible
        /*
        if (!this.chatVisible) {
          this.numberOfKnownMessages = this.chatMessages.length
        }
        */
    }
  })

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


div.chatSecton {
  background-color: #EEE;
  text-align: left;
  /*font-size: 0.9vw;*/
}

span.chatToUser, span.chatToAll {
  background-color: #AFD;
}

</style>
