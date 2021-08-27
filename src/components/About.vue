<template>
  <div class="about_all_div">
    <h3 class="about_h">このサイトについて</h3>
    <p>
      このサイトでは、旅行先のこの先一週間の天気予報（予想最高気温・最低気温・天気）を現在地と比較して見ることができます。<br>
      旅行の服装・持ち物の準備にご活用下さい。<br>
      <router-link to="/">Topページ</router-link>からご利用頂けます。
    </p>
    <h3 class="about_h">ご留意事項</h3>
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
