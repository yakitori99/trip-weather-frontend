<template>
  <div class="favorites-all-div">
    <div class="favorites-top-div">
      <h3 class="favorites-h">お気に入り</h3>
      <p>お気に入りから選んで、１クリックで天気予報を見ることができます。</p>
    </div>
    <v-card outlined>
      <!-- ニックネーム選択 -->
      <v-card-title class="favorites-card-title">
        <v-select
          v-bind:items="nicknames"
          v-bind:value="nicknameSelected"
          label="ニックネームを選択"
          @change="changeNickname($event)"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-circle-outline</v-icon>
          </template>
        </v-select>
      </v-card-title>
      <!-- お気に入り表示 -->
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="favorites"

        v-bind:loading="loading"
        loading-text="Loading... Please wait"
        
        v-bind:custom-sort="customSort"
        sort-by="UpdDate"
        v-bind:sort-desc="true"
        
        mobile-breakpoint="320"

        :footer-props="{
          itemsPerPageOptions: [5, 10, 20, -1],
          itemsPerPageText: '表示件数',
        }"

        @click:row="onClickRow($event)"
      ></v-data-table>
    </v-card>

  </div>
</template>


<script>
import axios from "axios"

import Types from '../vuex/types'
import config from "../config/config"

//axiosインスタンス生成
const $http = new axios.create({
    baseURL: config.API_BASE_URL
})

// favoritesのレスポンスデータを、this.favoritesに変換する関数
const changeResData2Favorites = function(resData){
  // 表示用にデータを整形
  let favorites = []
  resData.forEach(function(v) {
    const favorite = {
      // 表示用
      FromName: v["FromPrefName"]+" "+v["FromCityName"],
      ToName: v["ToPrefName"]+" "+v["ToCityName"],
      UpdDate: v["UpdatedAt"].substr(0, 10),
      // ソート用
      FromCityCode: v["FromCityCode"],
      ToCityCode: v["ToCityCode"],
      UpdatedAt: v["UpdatedAt"],
    }
    favorites.push(favorite)
  })
  return favorites
}



export default {
  name: "Favorites",
  
  data: () => ({  
    loading:true,

    // nickname
    nicknames:[],
    nicknameSelected:"",

    // table data
    headers:[
      {text:"現在地", value:"FromName"},
      {text:"目的地", value:"ToName"},
      {text:"更新日", value:"UpdDate"},
    ],
    favorites:[],

  }),

  //created:インスタンス生成後に実行
  created(){
    this.getFirst()
  },

  methods: {
    // API経由で初期情報を取得
    async getFirst () {
      this.loading = true
      // API get nicknames
      const resNicknames = await $http.get("/nicknames")
      let nicknames = []
      resNicknames.data.forEach(function(v) {
        // 空文字の場合、(ニックネームなし)とする
        if (v["Nickname"] == "") {
          nicknames.push(config.noNickname)
        } else {
          nicknames.push(v["Nickname"])
        }
      })
      this.nicknames = nicknames

      // storeからnicknameを取得し、this.nicknamesに存在するなら選択中に設定
      const storeNickname = this.$store.state.nickname
      // API GET用のニックネームは、ニックネームなし/空文字の場合は特殊文字列で指定(API側で特殊とみなして処理する)
      let apiGetNickname
      if (this.nicknames.indexOf(storeNickname) >= 0 && storeNickname != "") {
        this.nicknameSelected = storeNickname
        apiGetNickname = storeNickname
      } else {
        this.nicknameSelected = config.noNickname
        apiGetNickname = config.apiGetNoNickname
      }

      // API get favorites
      const resFavorites = await $http.get("/favorites/by/"+apiGetNickname)
      // 表示用にデータを整形して代入
      this.favorites = changeResData2Favorites(resFavorites.data)

      this.loading = false
    },

    // ニックネーム変更時に呼び出し
    async changeNickname(nickname){
      this.loading = true
      let apiGetNickname
      if (nickname == config.noNickname) {
        apiGetNickname = config.apiGetNoNickname
      } else {
        apiGetNickname = nickname
      }

      // API get favorites
      const resFavorites = await $http.get("/favorites/by/"+apiGetNickname)
      // 表示用にデータを整形して代入
      this.favorites = changeResData2Favorites(resFavorites.data)
      
      this.loading = false
    },

    onClickRow(row){
      // 都市コードから都道府県コードを作成
      const fromCityCode = row["FromCityCode"]
      const fromPrefCode = fromCityCode.substr(0, 2)
      const toCityCode = row["ToCityCode"]
      const toPrefCode = toCityCode.substr(0, 2)

      // 選択された現在地・目的地の都道府県・都市をstoreに保存
      this.$store.commit(Types.UPDATE_ITEM_FROM_CITY_SELECTED, fromCityCode)
      this.$store.commit(Types.UPDATE_ITEM_FROM_PREF_SELECTED, fromPrefCode)
      this.$store.commit(Types.UPDATE_ITEM_TO_CITY_SELECTED, toCityCode)
      this.$store.commit(Types.UPDATE_ITEM_TO_PREF_SELECTED, toPrefCode)
      
      // 画面遷移フラグをセットし、weather画面へ遷移
      this.$store.commit(Types.UPDATE_FLG_FAVORITES_TO_WEATHER, true)
      this.$router.push({
        name: 'weather',
      })
    },

    // v-data-tableのカスタムソート
    customSort(items, index, isDesc) {
      index = index[0]
      isDesc = isDesc[0]
      // itemsをソート
      items.sort((a, b) => {
        // sortKeyを指定
        let sortKey
        if (index == "FromName") {
          sortKey = "FromCityCode"
        } else if (index == "ToName") {
          sortKey = "ToCityCode"
        } else if (index == "UpdDate") {
          sortKey = "UpdatedAt"
        }
        // 並べ替え
        if (!isDesc) {
            if (a[sortKey] < b[sortKey]) {return -1}
            if (a[sortKey] > b[sortKey]) {return 1}
            return 0
        } else {
            if (b[sortKey] < a[sortKey]) {return -1}
            if (b[sortKey] > a[sortKey]) {return 1}
            return 0
        }
      })

      return items
    },

  },

}
</script>
