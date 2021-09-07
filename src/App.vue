<template>
  <v-app>
    <!-- ヘッダー and ナビゲーション -->
    <Header/>

    <!-- メインコンテンツ -->
    <v-main>
      <!-- Pathが一致したComponentの描画結果を挿入する箇所 -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import router from './router'

import Header from './components/Header'

export default {
  router,
  name: 'App',
  components: {
    Header,
  },

  // mounted :DOMが作成された直後
  mounted() {
    let to = this.$route
    this.createTitleDesc(to)
  },

  // watch:監視プロパティ
  // 監視するプロパティの名前と、そのプロパティに変化(トリガー)があった場合に実行する関数(ハンドラ)を対にして指定
  watch: { 
    $route(to) {
        this.createTitleDesc(to)
    }
  },
  
  methods: {
    createTitleDesc(to){
      // titleを設定
      if(to.meta.title){
        const appName = 'TripWeather'
        let title = to.meta.title
        if (title != appName){
          title = title + ' | ' + appName
        }
        document.title = title
      }

      // メタタグdescriptionを設定
      if(to.meta.desc){
        document.querySelector("meta[name='description']").setAttribute('content', to.meta.desc)
      }
    }
  },
};
</script>

<style src='./assets/css/style.css'></style>