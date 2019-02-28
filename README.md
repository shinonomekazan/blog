# blog

## このリポジトリについて

フロントエンドのリハビリのため、[Vue.js](https://jp.vuejs.org/index.html)と[Firebase](https://firebase.google.com/?hl=ja)を使って[はてなダイアリー](http://d.hatena.ne.jp/)の更新ができなくなった事で行き先を失ったブログ記事置き場を作ろうという試み。

## サーバについて

主に[こちらの記事](https://medium.com/google-cloud-jp/firestore2-920ac799345c)を参考に[Cloud Functions for Firebase](https://firebase.google.com/docs/functions/?hl=ja)も使っています。

Firebase側のソースは一応分けているので、必要に応じて[blog-server](https://github.com/shinonomekazan/blog-server)を参照してください。

## LICENSE

特に意味はありませんがMITです。

詳しくは[LICENSE](./LICENSE)をご参照ください。

## このリポジトリの使い方

お好きに使ってください。以下はデモサイトです。

- https://blog.shinonomekazan.com

## 残件

### 対応するもの

- 更新と削除の対応
    - Firestoreのルール検証のためにも、そのうちやると思う

### 対応しないもの

- [カスタムトークン](https://firebase.google.com/docs/auth/admin/create-custom-tokens?hl=ja)対応
    - 本当はuserIdsドキュメントをやめてカスタムトークンでauthにuserNameを含めたいんですが、Firebaseのみでカスタムトークンを発行する方法がわからず断念
    - できるならやった上で、 [blog-serverのfirestore.rules](https://github.com/shinonomekazan/blog-server/blob/master/firestore.rules)のisOwnerを書き換えたい
    - 今: `return get(/databases/$(database)/documents/userIds/$(uid)).data.name == name;`
    - やりたい: 　`return request.auth.token.userName == name;`
- [Nuxt.js](http://nuxtjs.org)対応
    - ブログシステムを作るなら当然OGPに対応したいのでSSRをやりたいので、Nuxt.jsを入れたいところ
    - これだけ対応したらなんならリリースできる
- [Vuex](https://vuex.vuejs.org/)導入
    - Vuexくらいは抑えて多少は綺麗な書き方を覚えようかと思ったが、Vuexを使ってないソースにも意義はありそうなのでやめた
    - やめた結果、ソースを綺麗にするモチベーションを失った
    - Vuexを入れないで綺麗にしてもいいんだが、Vuexなしの自分で考えた綺麗ソースはコスパが悪いんでやめた
- [RSS](https://ja.wikipedia.org/wiki/RSS)対応
    - BLOGあるある
    - SSR同様の問題があるんでやめ

## なんか自動生成されてた文書

以下の文書は[Vue CLI 3](https://cli.vuejs.org/)が勝手に作ったやつ。

必要に応じて参照してください。

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
