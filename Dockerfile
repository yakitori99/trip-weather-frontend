## ビルド環境
FROM node:lts-alpine as build-stage
# カレントワーキングディレクトリとして 'app' フォルダを指定する
WORKDIR /app
# packageファイルをコピーし、必要ライブラリをインストール
COPY package.json ./
COPY package-lock.json ./
RUN npm install
# カレントワーキングディレクトリ(/app)にプロジェクトのファイルやフォルダをコピー
COPY . .
# ビルド(./distを作成)
RUN npm run build

## 本番環境
FROM nginx:stable-alpine as production-stage
# ビルド済み資材をappへコピー
COPY --from=build-stage /app/dist /app
# nginx設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80 # listenするポートはnginx.confで指定
CMD ["nginx", "-g", "daemon off;"]