<template>
  <!-- 全体の背景 -->
  <div class="top-bg-all">
    <div class="top-bg-image">
      <!-- 上下中央揃え コンテナ -->
      <div class="top-centered-container">
        <!-- 上下中央揃え 中身 -->
        <div class="top-centered-box top-text-appname">
          <i class="fas fa-plane icon-padding-small"></i>
          TripWeather
        </div>

        <div class="top-centered-box top-text">
          旅行先の天気予報を現在地と比較して簡単に確認できます。
        </div>
        
        <div class="top-centered-box top-button-box">
          <v-btn
           to="/weather"
           color="orange darken-1"
           class="top-button"
           large
           dark
           rounded
          >
            <i class="fas fa-sun icon-padding-small"></i>
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
