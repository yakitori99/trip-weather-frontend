<template>
  <v-app>
    <!-- ヘッダー -->
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

import Header from './components/Header';

export default {
  router,
  name: 'App',
  components: {
    Header,
  },
};
</script>

<style src='./assets/css/style.css'></style>