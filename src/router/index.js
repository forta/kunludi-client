import Vue from 'vue'
import Router from 'vue-router'

import Ludi from '@/components/Ludi'
import About from '@/components/About'
import Lingvo from '@/components/Lingvo'
import Games from '@/components/Games'
import Play from '@/components/Play'
import Files from '@/components/Files'
import Kune from '@/components/Kune'
import Login from '@/components/Login'

Vue.use(Router)


export default new Router({
//export const router = new VueRouter({
  routes: [

      { path: '/',  component: Ludi,
          children: [
            {  path: '', component: About },
            {  path: 'lingvo', component:  Lingvo },
            {  path: 'about', component: About },
            {  path: 'kune', component: Kune,
               children: [
                 {  path: '/', component:  Login }
              ]
            },
            {  path: '/ludi/files', component: Files },
            {  path: '/ludi/games', component: Games },
            {  path: '/ludi/games/:gameId2', component: Games },
           {  path: '/ludi/play', component: Play }
          ]
        },

  ]
})
