<template>
  <div id="app">

    <!-- <img src="../assets/logo.png"> -->
    <div class="ludi_top1">
      <!--
      <p>kunludi.com ({{locale}}):
        <span v-show="locale=='en'"> textual interactive fiction with multilingual and cooperative features. </span>
        <span v-show="locale=='es'"> ficción interactiva textual con características multilingües y colaborativas.</span>
        <span v-show="locale=='eo'"> teksta interaktiva fikcio kun multlingvaj kaj kunlaboraj ecoj.</span>
        <span v-show="locale=='fr'"> fiction interactive textuelle avec des fonctionnalités multilingues et coopératives.</span>
      <br/>
    -->
        <router-link to="/kune"> {{kt("Together")}} </router-link> | 
        <span v-show="slotId==''"> <router-link to="/ludi/games"> {{kt("Games")}} </router-link> </span>
        <span v-show="slotId!='' ">  | <router-link to="/ludi/play"> {{kt("Play")}} </router-link> </span>
        | <router-link to="/lingvo"> {{kt("Language")}} </router-link>
        | <router-link to="/about"> {{kt("About")}} </router-link>
        <span v-show="slotId!=''"> | <router-link to="/ludi/files"> {{kt("Files")}} </router-link>  </span>
      </p>
    </div>

    <router-view/>
  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: mapGetters([
    'locale',
    'gameId',
    'slotId',
    'kt'
  ]),
  methods: mapActions([
    // 'setlocale'
  ]),
  beforeMount: function () {
    // https://michaelnthiessen.com/force-re-render
    // https://vuejs.org/v2/guide/instance.html
    console.log("at App.vue#beforeMount()")
  },
  mounted: function () {
    // https://vuejs.org/v2/guide/instance.html
    this.$forceUpdate() // important to refresh not already translated messages
    console.log("at App.vue#mounted()")
  }

}


</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}

div.ludi_top1 {
   left: 0px;
   top: 0px;
   width: 100%;
   border: 1px solid red;
   position: fixed;

   /*border-bottom:1px solid #eb7429; */
   background:#fc9400;
   padding:10px 20px;
   z-index:100;

}

</style>
