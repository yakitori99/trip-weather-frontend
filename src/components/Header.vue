<template>
    <v-app-bar
      app
      color="orange darken-1"
      dark
    >
      <!-- アプリのメインアイコン+アプリ名 ...リンク1:気温・天気を見る-->
      <router-link to="/" class="text-sm-h5 white--text" style="text-decoration:none; display:block;">
        <i class="fas fa-cloud-sun"></i>
        TripWeather
      </router-link>

      <v-spacer></v-spacer>

      <!-- リンク2:About -->
      <router-link to="/about"  class="text-sm-h6 white--text font-weight-regular" style="text-decoration:none; display:block;">
        <i class="far fa-question-circle "></i>
        About
      </router-link>
      
    </v-app-bar>
</template>

<script>
  export default {
    name: "Header",
  };
</script>
