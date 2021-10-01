<template>

    <div class="ludi" id="app">
       <div class="ludi_bottom" id="ludi_bottom">
            <router-view></router-view>
      </div>
  </div>


</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters([
    'locale',
    'gameId',
    'kt'
  ]),
  methods: mapActions([
    'setLocale'
  ])
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}

html {
}

body {
  display: flex;
  justify-content: left;
  height: 100%;
  font-size:20px;
  overflow-x: hidden; /* Hide horizontal scrollbar */
}

/*
body {
    font-size:1em;
}
*/

body {
    font-size: 1em; /* until commented on 25/7/2017 it was 2em*/
}

/* commented on 25/7/2017

@media screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 1),
        screen  and (min-device-width: 1200px)  and (max-device-width: 1600px)  and (-webkit-min-device-pixel-ratio: 2)  and (min-resolution: 192dpi) {
  body {
      font-size: 1em;
  }
}

@media screen and (min-resolution: 350dpi),
       screen and (min-resolution: 2dppx) {
  body {
      font-size: 2.5em;
  }
}

*/

/*

@media screen
  and (-webkit-device-pixel-ratio: 2)  and (orientation: portrait) {
    body {
        font-size: 2.3em;
    }
}

@media screen
  and (-webkit-device-pixel-ratio: 2)  and (orientation: landscape) {

    body {
        font-size: 1.2em;
    }
}

*/

#app {
  color: #2c3e50;
  /*max-width: 600px;*/
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: left;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

div.ludi {
    overflow: hidden;
    height: 100%;
    width: 100%;
    //border: 1px solid gray;
}


div.ludi_bottom {

  width: 100%;
   /*position: static;
    top: 200px;

    left:0px;
    width: 100%;
    border: 1px solid yellow;
    overflow:scroll;
    */


}

h2 {
    font-size:1em;
}

h3 {
    font-size:.7em;
}

</style>
