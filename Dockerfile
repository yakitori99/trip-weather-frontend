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
# nginx設定ファイル(include用のテンプレート)をコピー
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
# nginx設定ファイル(本体)をコピー
COPY nginx.conf /etc/nginx/nginx.conf

# CMD ["nginx", "-g", "daemon off;"]
# 環境変数からポートを指定しつつ、実行
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'