<script>
import { Line } from 'vue-chartjs'

const chartTension = 0.1

export default {
  name: 'WeatherLineChart',
  extends: Line,
  // グラフ表示するデータ内容を呼び出し元から受け取る
  props: [
    "fromTempMaxs", 'fromTempMins', 'fromCityName', 
      'toTempMaxs',   'toTempMins',   'toCityName', 
    'labels', 'labelXFontSize', 'labelYFontSize'
  ],
  data: () => ({
      datacollection:"",
      options:"",
  }),

  mounted () {
      this.fillData()
      this.renderChart(this.datacollection, this.options)
  },
  
  methods: {
    fillData(){
      this.datacollection = {
        labels: this.labels,
        datasets: [
          {
            label: this.fromCityName + 'の最高気温',
            borderColor: '#f31818', //red系
            fill: false,
            data: this.fromTempMaxs,
            tension:chartTension,
          },
          {
            label: this.fromCityName + 'の最低気温',
            borderColor: '#1e9fa4', //blue系
            fill: false,
            data: this.fromTempMins,
            tension:chartTension,
          },
          {
            label: this.toCityName + 'の予想最高気温',
            borderColor: '#f87979', //red系
            fill: false,
            data: this.toTempMaxs,
            tension:chartTension,
          },
          {
            label: this.toCityName + 'の予想最低気温',
            borderColor: '#35d3da', //blue系
            fill: false,
            data: this.toTempMins,
            tension:chartTension,
          },
        ]
      }
      this.options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              xAxes: [{
                  ticks: { //目盛り
                      fontFamily: '"Font Awesome 5 Free"',
                      // Font Awesome 5 Free版ではsolidのみが提供されているため、bold(=fontWeight:900)の指定必須
                      fontStyle:'bold',
                      fontSize:this.labelXFontSize,
                  }
              }],
              yAxes: [{
                  scaleLabel: { // 軸ラベル
                      display:true,
                      labelString:'気温(℃)',
                      fontFamily: 'Meiryo UI',
                      fontSize:this.labelYFontSize,
                  },
                  ticks: { //目盛り
                      fontFamily: 'Meiryo UI',
                      fontSize:this.labelYFontSize,
                  },
              }]
          },
          tooltips: { //マウスホバーした際のtooltip設定
              titleFontFamily: '"Font Awesome 5 Free"',
              bodyFontFamily: 'Meiryo UI',
          },
      }
    }
  }
}
</script>