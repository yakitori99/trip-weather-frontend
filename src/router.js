import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Top from './components/Top'
import WeatherComponent from './components/WeatherComponent'
import Favorites from './components/Favorites'
import About from './components/About'

export default new VueRouter({
  routes:[
    // TOP
    {
      name:"top", component: Top, path:"/",
      meta: { title: 'TripWeather', desc: '旅行先の天気予報を現在地と比較して簡単に確認できます。' }
    },
    // weather
    {
      name:"weather", component: WeatherComponent, path:"/weather",
      meta: { title: '天気を見る', desc: '旅行先のこの先一週間の天気予報を現在地と比較して見ることができます。旅行の服装・持ち物の準備にどうぞ。' }
    },
    // favorites
    {
      name:"favorites", component: Favorites, path:"/favorites",
      meta: { title: 'お気に入り', desc: 'お気に入りから現在地、目的地を選んで天気を見ることができます。' }
    },
    // About
    {
      name:"about", component: About, path:"/about",
      meta: { title: 'このサイトについて', desc: 'このサイトでは、旅行先のこの先一週間の天気予報を現在地と比較して見ることができます。旅行の服装・持ち物の準備にどうぞ。' }
    },
  ]
})