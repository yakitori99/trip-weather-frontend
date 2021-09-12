<template>
<div>
  <v-container>

    <!-- 都道府県、都市の選択 -->
    <v-row class="mt-1">
      <!-- Fromの選択 -->
      <v-col cols="6" sm="6">
        <p class="select_area_title">現在地</p>
        <!-- From pref -->
        <v-select
          v-bind:items="$store.state.itemsFromPref"
          v-bind:value="$store.state.itemFromPrefSelected"
          item-text="PrefName"
          item-value="PrefCode"
          label="都道府県を選択"
          @change="getFromCityByPrefcode($event)"
        >
          <template v-slot:prepend>
            <v-icon class="from_color">mdi-map</v-icon>
          </template>
        </v-select>
        <!-- From city -->
        <v-select
          v-bind:items="$store.state.itemsFromCity"
          v-bind:value="$store.state.itemFromCitySelected"
          item-text="CityName"
          item-value="CityCode"
          label="都市を選択"
          prepend-icon="mdi-map-marker"
          @change="changeFromCity($event)"
        >
          <template v-slot:prepend>
            <v-icon class="from_color">mdi-map-marker</v-icon>
          </template>
        </v-select>
      </v-col>

      <!-- Toの選択 -->
      <v-col cols="6" sm="6">
        <p class="select_area_title">目的地</p>
        <!-- To pref -->
        <v-select
          v-bind:items="$store.state.itemsToPref"
          v-bind:value="$store.state.itemToPrefSelected"
          item-text="PrefName"
          item-value="PrefCode"
          label="都道府県を選択"
          prepend-icon="mdi-map"
          @change="getToCityByPrefcode($event)"
        >
          <template v-slot:prepend>
            <v-icon class="to_color">mdi-map</v-icon>
          </template>
        </v-select>
        <!-- To city -->
        <v-select
          v-bind:items="$store.state.itemsToCity"
          v-bind:value="$store.state.itemToCitySelected"
          item-text="CityName"
          item-value="CityCode"
          label="都市を選択"
          prepend-icon="mdi-map-marker"
          @change="changeToCity($event)"
        >
          <template v-slot:prepend>
            <v-icon class="to_color">mdi-map-marker</v-icon>
          </template>
        </v-select>
      </v-col>
    
    </v-row>

    <!-- 天気のグラフ -->
    <WeatherLineChart v-if="loaded" 
      v-bind:from-temp-maxs="$store.state.fromTempMaxs" 
      v-bind:from-temp-mins="$store.state.fromTempMins" 
      v-bind:from-city-name="$store.state.fromCityName" 
      v-bind:to-temp-maxs="$store.state.toTempMaxs" 
      v-bind:to-temp-mins="$store.state.toTempMins" 
      v-bind:to-city-name="$store.state.toCityName" 
      v-bind:labels="labels" 
      v-bind:label-x-font-size="labelXFontSize"
      v-bind:label-y-font-size="labelYFontSize"
    />
    <!-- 天気のグラフのロード中に表示するアイコン -->
    <div class="text-center">
      <v-progress-circular
          v-if="!loaded"
          indeterminate
          color="orange accent-3"
          :size="50"
          :width="4"
          class="v-progress-circular"
      ></v-progress-circular>
    </div>
  
    <!-- お気に入りに登録エリア -->
      <v-row
        justify="end"
        class="weather-ins-area-div"
      >
      <!-- お気に入り登録用ニックネーム -->
      <div class="text-end">
        <v-text-field
          label="ニックネーム（任意）"
          prepend-icon="mdi-account-circle-outline"

          v-model="nickname"
          v-bind:rules="[rules.counter]"
          counter="10"
          maxlength="10"
          v-if="flgFromCitySelected && flgToCitySelected"
        ></v-text-field>
      </div>

      <!-- お気に入りに登録ボタン -->
      <div class="text-end">
        <v-btn
          color="cyan accent-4"
          class="weather-ins-button"
          dark
          @click="insertFavorite"
          v-if="flgFromCitySelected && flgToCitySelected"
          v-bind:loading="loading"        
        >
          <i class="fas fa-star icon-padding-medium"></i>
          お気に入りに登録
        </v-btn>
      </div>
    </v-row>

  </v-container>
</div>
</template>

<script>
import axios from 'axios'

import WeatherLineChart from './WeatherLineChart.vue'
import Types from '../vuex/types'
import config from "../config/config"

//axiosインスタンス生成
const $http = new axios.create({
    baseURL: config.API_BASE_URL
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

const makeLabels = function(fromWeathers, toWeathers, labelDates, labelDaysOfWeek){
  const labelWeathers = makeLabelWeathers(fromWeathers, toWeathers)
  const labels = zipFunc(labelWeathers, labelDates, labelDaysOfWeek)
  return labels
}

export default {
  name: 'WeatherComponent',
  components: { WeatherLineChart },

  data: () => ({  
    loaded: false,

    // 都市が選択されているかのフラグ
    flgFromCitySelected: false,
    flgToCitySelected: false,

    // 登録ボタンの二度押しを防ぐためのフラグ
    loading: false,

    // chart label
    labels:[],
    labelXFontSize:12,
    labelYFontSize:12,

    // テキストフィールド
    nickname:"",
    rules: {
      counter: value => value.length <= 10 || '最大10文字です',
    },
  }),

  //created:インスタンス生成後に実行
  created(){
    // 代入先に一つでも初期値のものがある場合、処理実行
    if (this.$store.state.cityCodeNameDict     ==null ||
        this.$store.state.prefCodeCityInfosDict==null ||
        this.$store.state.itemsFromPref.length ==0 ||
        this.$store.state.itemsToPref.length   ==0
    ){
      this.getPrefCityAllAsync()
    }
  },

  // mounted :DOMが作成された直後に実行
  mounted() {
    this.fillFirstChart()
  },


  // 現在地都市、目的地都市のstoreの値を監視し、選択中か否かのフラグを切り替え(computedとwatchの組み合わせで実現)
  computed: {
    getItemFromCitySelected() {
      return this.$store.state.itemFromCitySelected
    },
    getItemToCitySelected() {
      return this.$store.state.itemToCitySelected
    },
  },
  watch: {
    getItemFromCitySelected (newVal) {
      if (newVal == null){
        this.flgFromCitySelected = false
      } else {
        this.flgFromCitySelected = true
      }
    },
    getItemToCitySelected (newVal) {
      if (newVal == null){
        this.flgToCitySelected = false
      } else {
        this.flgToCitySelected = true
      }
    },
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
        let cityCodeNameDict = {}
        let prefCodeCityInfosDict = {}
        for (const row of resCities.data) {
          cityCodeNameDict[row["CityCode"]] = row["CityName"]
          
          if (row["PrefCode"] in prefCodeCityInfosDict){
            prefCodeCityInfosDict[row["PrefCode"]].push(row)
          } else {
            prefCodeCityInfosDict[row["PrefCode"]] = [row]
          }
        }
        // storeへ代入
        this.$store.commit(Types.UPDATE_CITY_CODE_NAME_DICT, cityCodeNameDict)
        this.$store.commit(Types.UPDATE_PREF_CODE_CITY_INFOS_DICT, prefCodeCityInfosDict)
        
        // storeへ代入 -> v-bindにより更新
        this.$store.commit(Types.UPDATE_ITEMS_FROM_PREF, resPrefs.data)
        this.$store.commit(Types.UPDATE_ITEMS_TO_PREF, resPrefs.data)
      }

      //非同期関数の実行
      httpGetPrefCityAll()
    },

    // 現在地の都道府県変更時に呼び出し、都市情報selectを再設定
    getFromCityByPrefcode (prefCode) {
      this.$store.commit(Types.UPDATE_ITEM_FROM_PREF_SELECTED, prefCode) // 選択されたprefCodeをセット
      this.$store.commit(Types.UPDATE_ITEM_FROM_CITY_SELECTED, null) // 選択済みの都市をリセット
      // PrefCodeに応じたCityInfosを取得し代入
      this.$store.commit(Types.UPDATE_ITEMS_FROM_CITY, this.$store.state.prefCodeCityInfosDict[this.$store.state.itemFromPrefSelected])
    },
    // 目的地の都道府県変更時に呼び出し、都市情報selectを再設定
    getToCityByPrefcode (prefCode) {
      this.$store.commit(Types.UPDATE_ITEM_TO_PREF_SELECTED, prefCode) // 選択されたprefCodeをセット
      this.$store.commit(Types.UPDATE_ITEM_TO_CITY_SELECTED, null) // 選択済みの都市をリセット
      // PrefCodeに応じたCityInfosを取得し代入
      this.$store.commit(Types.UPDATE_ITEMS_TO_CITY, this.$store.state.prefCodeCityInfosDict[this.$store.state.itemToPrefSelected])
    },
    
    // 現在地の都市変更時に呼び出し
    async changeFromCity(cityCode){
      this.loaded = false
      this.$store.commit(Types.UPDATE_ITEM_FROM_CITY_SELECTED, cityCode)

      // API get 
      const response = await $http.get('/get_weather_from/'+this.$store.state.itemFromCitySelected)
      // 整形してstoreへ代入
      let fromTempMaxs = []
      let fromTempMins = []
      let fromWeathers = []
      for (const v of response.data) {
        fromTempMaxs.push(v["MaxTemp"])
        fromTempMins.push(v["MinTemp"])
        fromWeathers.push(getWeatherIconByWeatherCode(v["WeatherCode"]))
      }
      this.$store.commit(Types.UPDATE_FROM_TEMP_MAXS, fromTempMaxs)
      this.$store.commit(Types.UPDATE_FROM_TEMP_MINS, fromTempMins)
      this.$store.commit(Types.UPDATE_FROM_WEATHERS, fromWeathers)
      // 都市名を設定
      this.$store.commit(Types.UPDATE_FROM_CITY_NAME, this.$store.state.cityCodeNameDict[this.$store.state.itemFromCitySelected])
      // labelを作成
      this.labels = makeLabels(this.$store.state.fromWeathers, this.$store.state.toWeathers, this.$store.state.labelDates, this.$store.state.labelDaysOfWeek)
      this.loaded = true
    },
    // 目的地の都市変更時に呼び出し
    async changeToCity(cityCode){
      this.loaded = false
      this.$store.commit(Types.UPDATE_ITEM_TO_CITY_SELECTED, cityCode)

      // API get 
      const response = await $http.get('/get_weather_to/'+this.$store.state.itemToCitySelected)
      // 整形してstoreへ代入
      let toTempMaxs = [NaN]
      let toTempMins = [NaN]
      let toWeathers = []
      for (const v of response.data) {
        toTempMaxs.push(v["MaxTemp"])
        toTempMins.push(v["MinTemp"])
        toWeathers.push(getWeatherIconByWeatherCode(v["WeatherCode"]))
      }
      this.$store.commit(Types.UPDATE_TO_TEMP_MAXS, toTempMaxs)
      this.$store.commit(Types.UPDATE_TO_TEMP_MINS, toTempMins)
      this.$store.commit(Types.UPDATE_TO_WEATHERS, toWeathers)
      // 都市名を設定
      this.$store.commit(Types.UPDATE_TO_CITY_NAME, this.$store.state.cityCodeNameDict[this.$store.state.itemToCitySelected])
      // labelを作成
      this.labels = makeLabels(this.$store.state.fromWeathers, this.$store.state.toWeathers, this.$store.state.labelDates, this.$store.state.labelDaysOfWeek)
      this.loaded = true
    },

    // 最初にグラフ初期値を描くための関数
    async fillFirstChart () {
      this.loaded = false
      // 日付ラベルのarrayがまだ存在しない場合、APIから取得し作成
      if (this.$store.state.labelDates == null) {
        // APIコールして日付データ取得
        const response = await $http.get('/get_datetimes')
        // 日付ラベルの形式を整える
        const rawLabelDates = response.data
        let labelDates = []
        let labelDaysOfWeek = [] //曜日
        rawLabelDates.forEach(function(v, i) {
          const date = new Date(v)
          const dayOfWeek = date.getDay() ;	// 曜日(数値)
          const dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek]// 曜日(日本語表記)
          let dateStr = ""
          if (i == 0) {
            dateStr = "昨日"
          } else if (i==1) {
            dateStr = "今日"
          } else if (i==2){
            dateStr = "明日"
          } else {
            const month = date.getMonth()+1 // 0始まりの数字で取得されるため、+1する
            const day = date.getDate()
            dateStr = month + "/" + day
          }
          labelDates.push(dateStr)
          labelDaysOfWeek.push("(" + dayOfWeekStr + ")")
        })
        this.$store.commit(Types.UPDATE_LABEL_DATES, labelDates)
        this.$store.commit(Types.UPDATE_LABEL_DAYS_OF_WEEK, labelDaysOfWeek)
      }
      
      // labelを作成
      this.labels = makeLabels(this.$store.state.fromWeathers, this.$store.state.toWeathers, this.$store.state.labelDates, this.$store.state.labelDaysOfWeek)

      // labelのフォントサイズを決定
      let fontXSize = 12
      let fontYSize = 12
      if(window.matchMedia('(min-width: 570px)').matches) {
        // PC/タブレット向け
        fontXSize = 15
        fontYSize = 12
      } else if (window.matchMedia('(min-width: 400px)').matches){
        // 大きめのスマホ向け
        fontXSize = 11
        fontYSize = 10
      } else if (window.matchMedia('(min-width: 350px)').matches){
        // 小さめのスマホ向け
        fontXSize = 9.5
        fontYSize = 10
      } else {
        // より小さいスマホ向け
        fontXSize = 9
        fontYSize = 10
      }
      this.labelXFontSize = fontXSize
      this.labelYFontSize = fontYSize

      // storeの状態をもとに、現在地、目的地の都市選択フラグを更新
      if (this.$store.state.itemFromCitySelected != null){
        this.flgFromCitySelected = true
      }
      if (this.$store.state.itemToCitySelected != null){
        this.flgToCitySelected = true
      }
      // storeからnicknameを取得し設定
      this.nickname = this.$store.state.nickname

      this.loaded = true
    },

    // 選択中の現在地都市、目的地都市をAPI経由でfavoriteテーブルへ登録（登録済みの場合、更新日時のみ更新）
    async insertFavorite () {
      this.loading = true
      // ニックネーム文字列の空白を削除してthisへ再設定、storeへ登録
      this.nickname = this.nickname.split(' ').join('').split('　').join('')
      const nickname = this.nickname
      this.$store.commit(Types.UPDATE_NICKNAME, nickname)

      const fromCityCode = this.$store.state.itemFromCitySelected
      const toCityCode = this.$store.state.itemToCitySelected
      
      // json形式でAPI POST
      const response = await $http.post('/favorites', {
        nickname:nickname,
        from_city_code:fromCityCode,
        to_city_code:toCityCode,
      })
      
      // 登録結果を受け取り、画面表示
      const resultCode = parseInt(response.data["ResultCode"])
      let resultMessage
      let toastType
      if (resultCode == 1){
        // 新規追加成功
        resultMessage = "お気に入りに登録しました！"
        toastType = "success"
      } else if (resultCode == 2){
        // 更新成功
        resultMessage = "お気に入りを更新しました！"
        toastType = "info"
      }

      this.$toasted.show(resultMessage, {
        theme:"bubble",
        position:"top-right",
        duration:3000,
        type:toastType,
      })

      this.loading = false
    },
  
  }
}
</script>