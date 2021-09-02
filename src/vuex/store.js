import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Types from './types'

// 初期値で使うケースがある変数は適切な初期値、それ以外はnullを指定する
const state = {
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
    labelDates:null,
    fromWeathers:["-", "-"], // 2
    toWeathers:["-", "-", "-", "-", "-", "-", "-", "-"], // 8
    // chart data
    fromTempMaxs:[NaN],
    fromTempMins:[NaN],
    toTempMaxs:[NaN],
    toTempMins:[NaN]
}


const mutations = {
  // DICTの更新
  [Types.UPDATE_CITY_CODE_NAME_DICT](state, cityCodeNameDict) {
    state.cityCodeNameDict = cityCodeNameDict
  },
  [Types.UPDATE_PREF_CODE_CITY_INFOS_DICT](state, prefCodeCityInfosDict) {
    state.prefCodeCityInfosDict = prefCodeCityInfosDict
  },

  // FROM
  [Types.UPDATE_ITEMS_FROM_PREF](state, itemsFromPref) {
    state.itemsFromPref = itemsFromPref
  },
  [Types.UPDATE_ITEM_FROM_PREF_SELECTED](state, itemFromPrefSelected) {
    state.itemFromPrefSelected = itemFromPrefSelected
  },
  [Types.UPDATE_ITEMS_FROM_CITY](state, itemsFromCity) {
    state.itemsFromCity = itemsFromCity
  },
  [Types.UPDATE_ITEM_FROM_CITY_SELECTED](state, itemFromCitySelected) {
    state.itemFromCitySelected = itemFromCitySelected
  },
  [Types.UPDATE_FROM_CITY_NAME](state, fromCityName) {
    state.fromCityName = fromCityName
  },

  // TO
  [Types.UPDATE_ITEMS_TO_PREF](state, itemsToPref) {
    state.itemsToPref = itemsToPref
  },
  [Types.UPDATE_ITEM_TO_PREF_SELECTED](state, itemToPrefSelected) {
    state.itemToPrefSelected = itemToPrefSelected
  },
  [Types.UPDATE_ITEMS_TO_CITY](state, itemsToCity) {
    state.itemsToCity = itemsToCity
  },
  [Types.UPDATE_ITEM_TO_CITY_SELECTED](state, itemToCitySelected) {
    state.itemToCitySelected = itemToCitySelected
  },
  [Types.UPDATE_TO_CITY_NAME](state, toCityName) {
    state.toCityName = toCityName
  },

  // CHART LABEL
  [Types.UPDATE_LABEL_DATES](state, labelDates) {
    state.labelDates = labelDates
  },
  [Types.UPDATE_FROM_WEATHERS](state, fromWeathers) {
    state.fromWeathers = fromWeathers
  },
  [Types.UPDATE_TO_WEATHERS](state, toWeathers) {
    state.toWeathers = toWeathers
  },

  // CHART DATA
  [Types.UPDATE_FROM_TEMP_MAXS](state, fromTempMaxs) {
    state.fromTempMaxs = fromTempMaxs
  },
  [Types.UPDATE_FROM_TEMP_MINS](state, fromTempMins) {
    state.fromTempMins = fromTempMins
  },
  [Types.UPDATE_TO_TEMP_MAXS](state, toTempMaxs) {
    state.toTempMaxs = toTempMaxs
  },
  [Types.UPDATE_TO_TEMP_MINS](state, toTempMins) {
    state.toTempMins = toTempMins
  },

}

const getters = {}

const actions = {}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
})
