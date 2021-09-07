<template>
<span>
  <!-- ナビゲーション（ハンバーガーメニュー押下時に出るナビゲーション） -->
  <v-navigation-drawer
    app
    v-model="drawer"
    temporary
    right
  >
    <v-list
      nav
    >
      <v-list-item-group
        v-model="group"
        active-class="orange--text text--darken-1"
        color="orange darken-1"
      >
        <v-list-item to="/weather">
          <i class="fas fa-sun icon-padding-medium"></i>
          <v-list-item-title>天気を見る</v-list-item-title>
        </v-list-item>

        <v-list-item  to="/favorites">
          <i class="fas fa-star icon-padding-medium"></i>
          <v-list-item-title>お気に入り</v-list-item-title>
        </v-list-item>

        <v-list-item to="/about">
          <i class="far fa-question-circle icon-padding-medium"></i>
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>

  <!-- ヘッダー（上部メニュー） -->
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
    
    <!-- 上部メニューのリンク sm(600px)より大きい幅で表示-->
    <!-- リンク1 -->
    <router-link to="/weather"  class="white--text header_menu_title header_menu_padding d-none d-sm-block">
      <i class="fas fa-sun"></i>
      天気を見る
    </router-link>
    
    <!-- リンク2 -->
    <router-link to="/favorites"  class="white--text header_menu_title header_menu_padding d-none d-sm-block">
      <i class="fas fa-star"></i>
      お気に入り
    </router-link>

    <!-- リンク3 -->
    <router-link to="/about"  class="white--text header_menu_title d-none d-sm-block">
      <i class="far fa-question-circle"></i>
      About
    </router-link>

    <!-- ハンバーガーメニュー sm(600px)以下の幅で表示-->
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-sm-none"></v-app-bar-nav-icon>
  </v-app-bar>
</span>
</template>

<script>
export default {
  name: "Header",
  
  data: () => ({
    drawer: false,
    group: null,
  }),

  watch: {
    group () {
      this.drawer = false
    },
  },
};
</script>
