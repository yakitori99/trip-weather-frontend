<template>
  <!-- 全体の背景 -->
  <div class="top-bg-all">
    <div class="top-bg-image">
      <!-- 上下中央揃え コンテナ -->
      <div class="top-centered-container">
        <!-- 上下中央揃え 中身 -->
        <div class="top-centered-box top-text-appname">
          <i class="fas fa-plane" style="padding-right:0.2rem;"></i>
          TripWeather
        </div>

        <div class="top-centered-box top-text">
          旅行先の天気予報を現在地と比較して簡単に確認できます。
          <!-- <br> -->
          <!-- 旅行の準備にどうぞ -->
        </div>
        
        <div class="top-centered-box">
          <v-btn
           to="/weather"
           color="orange darken-1"
           dark
           rounded
          >
            <i class="fas fa-sun" style="padding-right:0.2rem;"></i>
            天気を見る
          </v-btn>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Top",
  }
</script>
