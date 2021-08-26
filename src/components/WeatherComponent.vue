<template>
  <v-container>
    <!-- 都道府県、都市の選択 -->
    <v-row class="mt-1">
      <!-- Fromの選択 -->
      <v-col cols="6" sm="6">
        <p>現在地</p>
        <!-- From pref -->
        <v-select
          v-bind:items="itemsFromPref"
          item-text="PrefName"
          item-value="PrefCode"
          label="都道府県を選択"
          @change="getFromCityByPrefcode"
          v-model="itemFromPrefSelected"
        >
          <template v-slot:prepend>
            <v-icon class="from_color">mdi-map</v-icon>
          </template>
        </v-select>
        <!-- From city -->
        <v-select
          v-bind:items="itemsFromCity"
          item-text="CityName"
          item-value="CityCode"
          label="都市を選択"
          prepend-icon="mdi-map-marker"
          @change="changeFromCity"
          v-model="itemFromCitySelected"
        >
          <template v-slot:prepend>
            <v-icon class="from_color">mdi-map-marker</v-icon>
          </template>
        </v-select>
      </v-col>

      <!-- Toの選択 -->
      <v-col cols="6" sm="6">
        <p>目的地</p>
        <!-- To pref -->
        <v-select
          v-bind:items="itemsToPref"
          item-text="PrefName"
          item-value="PrefCode"
          label="都道府県を選択"
          prepend-icon="mdi-map"
          @change="getToCityByPrefcode"
          v-model="itemToPrefSelected"
        >
          <template v-slot:prepend>
            <v-icon class="to_color">mdi-map</v-icon>
          </template>
        </v-select>
        <!-- To city -->
        <v-select
          v-bind:items="itemsToCity"
          item-text="CityName"
          item-value="CityCode"
          label="都市を選択"
          prepend-icon="mdi-map-marker"
          @change="changeToCity"
          v-model="itemToCitySelected"
        >
          <template v-slot:prepend>
            <v-icon class="to_color">mdi-map-marker</v-icon>
          </template>
        </v-select>
      </v-col>
    
    </v-row>

    <!-- 天気のグラフ -->
    <WeatherLineChart v-if="loaded" 
      v-bind:from-temp-maxs="fromTempMaxs" 
      v-bind:from-temp-mins="fromTempMins" 
      v-bind:from-city-name="fromCityName" 
      v-bind:to-temp-maxs="toTempMaxs" 
      v-bind:to-temp-mins="toTempMins" 
      v-bind:to-city-name="toCityName" 
      v-bind:labels="labels" 
      v-bind:label-x-font-size="labelXFontSize"
      v-bind:label-y-font-size="labelYFontSize"
    />
  </v-container>
</template>

<script>
import axios from 'axios'

import WeatherLineChart from './WeatherLineChart.vue'

const api_base_url = 'http://localhost:1323'
//axiosインスタンス生成
const $http = new axios.create({
    baseURL: api_base_url
})

// WEATHER_CODEは開始、終了を持たせて範囲で判定する
// CODE=700台のレアな天気は、個別のICONが無いため全てsmogのアイコンとする
const WEATHER_CODE_ICONS = [
    [200, 299, '\uf0e7'], // Thunderstorm
    [300, 399, '\uf740'], // Drizzle 霧雨 Rainと同じアイコンとする
    [500, 500, '\uf743'], // Light Rain // 小雨
    [501, 599, '\uf740'], // Rain
    [600, 699, '\uf2dc'], // Snow
    [700, 799, '\uf75f'], // レアな天気。個別のICONが無いため全てsmogのアイコンとする
    [800, 800, '\uf185'], // Clear 晴れ
    [801, 802, '\uf6c4'], // few clouds, scattered clouds 晴れ時々曇り
    [803, 804, '\uf0c2'], // 曇り
]
// weatherCodeを受け取り、対応するweatherIconを返す関数
const getWeatherIconByWeatherCode = function(weatherCode){
  for (const arr of WEATHER_CODE_ICONS) {
    let codeS = arr[0]
    let codeE = arr[1]
    let icon = arr[2]
    if (codeS <= weatherCode && weatherCode <=codeE){
      return icon
    }
  }
}
// fromWeathersとtoWeathersを受け取り、1つのarrayにまとめて返す関数
const makeLabelWeathers = function(fromWeathers, toWeathers){
  let labelWeathers = []
  for (let i=0; i<9; ++i){
    if (i == 0){
      labelWeathers.push(fromWeathers[i])
    } else if (i == 1){
      labelWeathers.push(fromWeathers[i] + "/" + toWeathers[i-1])
    } else{
      labelWeathers.push(toWeathers[i-1])
    }
  }
  return labelWeathers
}

// arrayをまとめる関数
const zipFunc = (...arrays) => {
  const length = Math.min(...(arrays.map(arr => arr.length)))
  return new Array(length).fill().map((_, i) => arrays.map(arr => arr[i]))
}

export default {
  name: 'WeatherComponent',
  components: { WeatherLineChart },

  data: () => ({  
    loaded: false,
    // dict{cityCode:cityName}
    cityCodeNameDict:null,
    // dict{prefCode:array of CityInfo}
    // CityInfoの例:{"CityCode":"011000","CityName":"稚内","PrefCode":"01","CityLon":141.673889,"CityLat":45.409439}
    prefCodeCityInfosDict:null,
    // From
    itemsFromPref: [],
    itemFromPrefSelected:null,
    itemsFromCity: [],
    itemFromCitySelected:null,
    fromCityName:"現在地",
    // To
    itemsToPref: [],
    itemToPrefSelected:null,
    itemsToCity: [],
    itemToCitySelected:null,
    toCityName:"目的地",
    // chart label
    labelDates:[],
    labelWeathers:["-", "-/-", "-", "-", "-", "-", "-", "-", "-"],
    fromWeathers:["-", "-"], // 2
    toWeathers:["-", "-", "-", "-", "-", "-", "-", "-"], // 8
    labels:[],
    labelXFontSize:12,
    labelYFontSize:12,
    // chart data
    fromTempMaxs:[NaN],
    fromTempMins:[NaN],
    toTempMaxs:[NaN],
    toTempMins:[NaN]
  }),

  //created:インスタンス生成後に実行
  created(){
    this.getPrefCityAllAsync()
  },

  // mounted :DOMが作成された直後
  mounted() {
    this.fillFistChart()
  },

  methods: {
    // APIから都道府県データを取得
    getPrefCityAllAsync () {
      //非同期関数の定義
      const httpGetPrefCityAll = async () => {
          //1.GETリクエスト送信 //並行処理
          //2.全てのレスポンスが返ってくるまで待ち合わせ
          // Promise.all([])とawaitを併用する
          const results = await Promise.all([
            $http.get('/get_prefs'),
            $http.get('/get_cities')
          ])
          const resPrefs = results[0]
          const resCities = results[1]

          //3.response内のレスポンス結果代入
          this.cityCodeNameDict = {}
          this.prefCodeCityInfosDict = {}
          for (const row of resCities.data) {
            this.cityCodeNameDict[row["CityCode"]] = row["CityName"]
            
            if (row["PrefCode"] in this.prefCodeCityInfosDict){
              this.prefCodeCityInfosDict[row["PrefCode"]].push(row)
            } else {
              this.prefCodeCityInfosDict[row["PrefCode"]] = [row]
            }
          }
          
          // 代入 -> v-bindにより更新
          this.itemsFromPref = resPrefs.data
          this.itemsToPref = resPrefs.data
      }

      //非同期関数の実行
      httpGetPrefCityAll()
    },

    // 現在地の都道府県変更時に呼び出し、都市情報selectを再設定
    getFromCityByPrefcode () {
      this.itemFromCitySelected = null // 選択済みの都市をリセット
      // this.prefCodeCityInfosDictから、PrefCodeに応じたCityInfosを取得し代入
      this.itemsFromCity = this.prefCodeCityInfosDict[this.itemFromPrefSelected]
    },
    // 目的地の都道府県変更時に呼び出し、都市情報selectを再設定
    getToCityByPrefcode () {
      this.itemToCitySelected = null // 選択済みの都市をリセット
      // this.prefCodeCityInfosDictから、PrefCodeに応じたCityInfosを取得し代入
      this.itemsToCity = this.prefCodeCityInfosDict[this.itemToPrefSelected]
    },
    
    // 現在地の都市変更時に呼び出し
    async changeFromCity(){
      this.loaded = false

      // API get 
      const response = await $http.get('/get_weather_from/'+this.itemFromCitySelected)
      // 整形してthisへ代入
      let fromTempMaxs = []
      let fromTempMins = []
      let fromWeathers = []
      for (const v of response.data) {
        fromTempMaxs.push(v["MaxTemp"])
        fromTempMins.push(v["MinTemp"])
        fromWeathers.push(getWeatherIconByWeatherCode(v["WeatherCode"]))
      }
      this.fromTempMaxs = fromTempMaxs
      this.fromTempMins = fromTempMins
      this.fromWeathers = fromWeathers
      // 都市名を設定
      this.fromCityName = this.cityCodeNameDict[this.itemFromCitySelected]
      // labelを作成
      this.labelWeathers = makeLabelWeathers(this.fromWeathers, this.toWeathers)
      this.labels = zipFunc(this.labelWeathers, this.labelDates)
      this.loaded = true
    },
    // 目的地の都市変更時に呼び出し
    async changeToCity(){
      this.loaded = false

      // API get 
      const response = await $http.get('/get_weather_to/'+this.itemToCitySelected)
      // 整形してthisへ代入
      let toTempMaxs = [NaN]
      let toTempMins = [NaN]
      let toWeathers = []
      for (const v of response.data) {
        toTempMaxs.push(v["MaxTemp"])
        toTempMins.push(v["MinTemp"])
        toWeathers.push(getWeatherIconByWeatherCode(v["WeatherCode"]))
      }
      this.toTempMaxs = toTempMaxs
      this.toTempMins = toTempMins
      this.toWeathers = toWeathers
      // 都市名を設定
      this.toCityName = this.cityCodeNameDict[this.itemToCitySelected]
      // labelを作成
      this.labelWeathers = makeLabelWeathers(this.fromWeathers, this.toWeathers)
      this.labels = zipFunc(this.labelWeathers, this.labelDates)
      this.loaded = true
    },

    // 最初にグラフ初期値を描くための関数
    async fillFistChart () {
      this.loaded = false
      //// 日付ラベルのarrayを作成
      // APIコールして日付データ取得
      const response = await $http.get('/get_datetimes')
      // 日付ラベルの形式を整える
      const rawLabelDates = response.data
      let labelDates = []
      rawLabelDates.forEach(function(v, i) {
        if (i == 0) {
          labelDates.push('昨日')
        } else if (i==1) {
          labelDates.push('今日')
        } else if (i==2){
          labelDates.push('明日')
        } else {
          const dateStr = v.substr(5,2) + "/" + v.substr(8,2)
          labelDates.push(dateStr)
        }
      })
      this.labelDates = labelDates
      
      // labelを作成
      this.labels = zipFunc(this.labelWeathers, this.labelDates)
      // labelのフォントサイズを決定
      let fontXSize = 12
      let fontYSize = 12
      if(window.matchMedia('(min-width: 540px)').matches) {
        // PC/タブレット向け
        fontXSize = 15
        fontYSize = 12
      } else if (window.matchMedia('(min-width: 400px)').matches){
        // 大きめのスマホ向け
        fontXSize = 12
        fontYSize = 10
      } else {
        // 小さめのスマホ向け
        fontXSize = 10
        fontYSize = 10
      }
      this.labelXFontSize = fontXSize
      this.labelYFontSize = fontYSize
      this.loaded = true
    }
  
  }
}
</script>