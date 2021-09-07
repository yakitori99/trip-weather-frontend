<template>
    <v-app-bar
      app
      color="orange darken-1"
      dark
    >
      <!-- アプリのメインアイコン+アプリ名 ...リンク0:TOP-->
      <router-link to="/" class="white--text app_title">
        <i class="fas fa-plane"></i>
        TripWeather
      </router-link>

      <v-spacer></v-spacer>

      <!-- リンク1:天気を見る -->
      <router-link to="/weather"  class="white--text header_menu_title header_menu_padding">
        <i class="fas fa-sun"></i>
        天気を見る
      </router-link>

      <!-- リンク2:About -->
      <router-link to="/about"  class="white--text header_menu_title">
        <i class="far fa-question-circle"></i>
        About
      </router-link>
      
    </v-app-bar>
</template>

<script>
  export default {
    name: "Header",
  };
</script>
