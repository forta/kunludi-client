<template>

  <div class="lingvo">

<!--  <br/><br/><br/> -->
  <img src="./../../data/icons/languages.jpg">

	<h2>{{kt("Your languages")}}:</h2>
    <ul>
        <li v-for="l in languages.pref">
            <span v-if ="langIsValid (l)">
            <button @click='setLocale(l)'>{{kt("choose")}}</button>
            <span class="lingvoText"> {{l}} </span>
            <!-- <button @click='removeAsFavouriteLanguage("en")'> remove </button> -->
            </span>
        </li>

    </ul>

	<h2>{{kt("Additional languages")}}:</h2>
    <ul>
        <li v-for="l in languages.other">
            <span v-if ="langIsValid (l)">
                <button @click='setLocale(l)'>{{kt("choose")}}</button>
                <span class="lingvoText"> {{l}} </span>
                <!-- <button @click='removeAsFavouriteLanguage("en")'> remove </button> -->
            </span>
        </li>
    </ul>

  </div>
</template>

<script>


import { mapGetters, mapActions } from 'vuex'

export default {

  computed: mapGetters([
    'locale',
    'languages',
    'kt',
    'langIsValid'
  ]),
  methods: mapActions([
    'setLocale'
  ])
}

</script>

<style scoped>

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}


li {
  border-bottom: 1px solid #ccc;
  text-align: left;
}

li:last-child {
  border: none;
}

button {
    border-radius: 10px;
    font-size: 1em;
}

button:hover {
    background-color: #4CAF50; /* Green */
    border-radius: 10px;
    color: white;
}

.lingvoText {
  font-size: 1em;
}


</style>
