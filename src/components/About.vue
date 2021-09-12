<template>
  <div class="about-all-div">
    <h3 class="about-h">このサイトについて</h3>
    <p>
      このサイトでは、旅行先のこの先一週間の天気予報（予想最高気温・最低気温・天気）を現在地と比較して見ることができます。<br>
      ユーザー登録なし・無料でご利用頂けますので、旅行の準備にご活用下さい。<br>
    </p>
    

    <h3 class="about-h">使い方</h3>
    <!-- weather -->
    <v-btn
      to="/weather"
      color="orange darken-1"
      class="about-button"
      dark
      rounded
    >
      <i class="fas fa-sun icon-padding-medium"></i>
      天気を見る
    </v-btn>
    <p>
      現在地・目的地（旅行先）を選んで、天気予報を見ることができます。
      選んだ現在地・目的地はお気に入りに登録できます。<br>
    </p>
  
    <!-- favorites -->
    <v-btn
      to="/favorites"
      color="cyan accent-4"
      class="about-button"
      dark
      rounded
    >
      <i class="fas fa-star icon-padding-medium"></i>
      お気に入り
    </v-btn>
    <p>
      登録済みのお気に入りから選んで、１クリックで天気予報を見ることができます。<br>
    </p>
  

    <h3 class="about-h">ご留意事項</h3>
    <ul>
      <li>
        現状、天気予報は日本国内の主要地点に対応しております。（海外は未対応）
      </li>
      <li>
        天気予報は予測主体（企業等）によって異なり、外れる可能性があることにご留意下さい。
      </li>
      <li>
        天気予報には
        <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
          OpenWeather
          <i class="fas fa-external-link-alt icon_margin_left"></i>
        </a>
        のAPI(Freeプラン)を利用しています。
      </li>
      <li>
        このサービスは、クラウドサービスの料金改定や運営者の都合により停止となる可能性があります。
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "About",
  }
</script>
