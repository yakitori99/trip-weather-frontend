<template>
  <div class="favorites-all-div">
    <div class="favorites-top-div">
      <h3 class="favorites-h">お気に入り</h3>
      <p>お気に入りから現在地、目的地を選んで天気を見ることができます。</p>
    </div>
    <v-card outlined>
      <!-- <v-card-title class="favorites-card-title">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="検索"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title> -->
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="favorites"
        v-bind:search="search"

        v-bind:loading="loading"
        loading-text="Loading... Please wait"
        
        v-bind:custom-sort="customSort"
        sort-by="UpdDate"
        sort-desc="true"
        
        mobile-breakpoint="320"

        :footer-props="{
          itemsPerPageOptions: [5, 10, 20, -1],
          itemsPerPageText: '表示件数',
        }"
      ></v-data-table>
    </v-card>

  </div>
</template>


<script>
import axios from "axios"

// const api_base_url = "http://localhost:1323"
const api_base_url = "https://trip-weather-backend.herokuapp.com"
//axiosインスタンス生成
const $http = new axios.create({
    baseURL: api_base_url
})

// favoritesを取得する件数n
const getN = 50

export default {
  name: "Favorites",
  
  data: () => ({  
    loading:true,

    search: "",
    // table data
    headers:[
      {text:"現在地", value:"FromName"},
      {text:"目的地", value:"ToName"},
      {text:"更新日", value:"UpdDate"},
    ],
    favorites:[],
    // 全件取得するか
    isGetAll:false,

  }),

  //created:インスタンス生成後に実行
  created(){
    this.getFavorites()
  },

  methods: {
    // API経由でお気に入り情報を取得
    async getFavorites () {
      this.loading = true
      let response
      // API get 
      if (this.isGetAll){
        response = await $http.get("/favorites")
      } else {
        response = await $http.get("/favorites/"+String(getN))
      }
      
      // 表示用にデータを整形
      let favorites = []
      response.data.forEach(function(v) {
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
      this.favorites = favorites
      this.loading = false
    },

    customSort(items, index, isDesc) {
      index = index[0]
      isDesc = isDesc[0]
      // The following is informations as far as I researched.
      // items: 'food' items
      // index: Enabled sort headers value. (black arrow status).
      // isDescending: Whether enabled sort headers is desc
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
