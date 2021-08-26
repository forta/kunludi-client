<template>
  <div class="login">

  	<div v-show="userId == ''">

        <form>
          <!-- <p>Please type your user name and password to logon: </p> -->
          <label> {{kt("Username")}}: </label><input v-model="newUserId" autofocus v-on:keyup.enter="submit"><br/><br/>

          <label> {{kt("Password")}}: </label><input v-model="password" type="password" autocomplete =""><br/>
          <p> {{kt("LoginInformation")}} </p>
          <button @click='submit' > {{kt("Login")}} </button>
        </form>

          <p> {{kt("RequestAccount")}} </p>

  	</div>
  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'


export default {
  data () {
    return {
      newUserId: '',
      password: ''
    }
  },
  watch: {
      userId: function() {
        console.log("userId has changed: " + this.userId)
        this.userModified(this.userId)
      }
  },
  computed: mapGetters([
    'userId',
    'kt',
    'playerList'
  ]),

  mounted: function () {
    // https://vuejs.org/v2/guide/instance.html
    this.$forceUpdate() // important to refresh not already translated messages
    console.log("at Login.vue#mounted()")
  },

  methods: Object.assign(mapActions([
    'logout',
    'modifyUserId',
    'userModified'
  ]), {

    convertDate: (dateJSON) => {
      var d = new Date (JSON.parse (dateJSON))
      return d.toLocaleString()
    },

    before_modifyUserId: () => {
      if (this.gameId != "") {
        alert ("Close the current game before try to logon.")
        // mutations.RESETGAMEID (state)
      }
    },
    after_modifyUserId: () => {
      //this.newUserId = this.userId
      // to-do: if after a timeout userId remains null: show alert "connection error"
      setTimeout(this.timeOutError, 3000);
    },
    timeOutError: function () {
      if (this.userId == "") {
        alert("Connection error with username " + this.newUserId );
        this.newUserId = ""
      }
    },
    submit: function () {

        this.newUserId = this.newUserId.replace(/ /g,'') // remove spaces
        if (this.newUserId) {
          this.modifyUserId({userId:this.newUserId, password:this.password});
          this.after_modifyUserId ()
        }

      }

  })

}


// to-do: on change on :     router.push('/ludi/games')
/*
  created: function () {
    console.log('login created: this.$route.params: ' + JSON.stringify (this.$route.params))
  },
  mounted: function () {
    this.$nextTick(function () {
      // code that assumes this.$el is in-document (vue2)
      console.log('login ready: this.$el.$route.params: ' + JSON.stringify (this.$el.$route.params))
    })
  },
  route: {
    beforeRouteEnter: function () {
        console.log('login route activated!')
        console.log('this.$route.path: ' + JSON.stringify (this.$route.path))
        console.log('this.$route.params: ' + JSON.stringify (this.$route.params))
        console.log('this.$route.query: ' + JSON.stringify (this.$route.query))

    }
  },

}
*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.login {
  text-align: left;
}

</style>
