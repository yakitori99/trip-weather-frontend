import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import WeatherComponent from './components/WeatherComponent'
import About from './components/About'

export default new VueRouter({
  routes:[
    {name:"home", component: WeatherComponent, path:"/"},
    {name:"about", component: About, path:"/about"},
  ]
})