<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
	<SignIn v-bind:user="user" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import SignIn from "./components/SignIn.vue";
import firebase from "firebase";
import * as models from "./models";
import * as factories from "./factories";

/* tslint:disable */
// ◆クラススタイルVueコンポーネント
// vue: https://jp.vuejs.org/v2/guide/typescript.html#%E3%82%AF%E3%83%A9%E3%82%B9%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB-Vue-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88
// class-style: https://github.com/vuejs/vue-class-component
// decorator: https://github.com/kaorun343/vue-property-decorator
// ◆v-bindによるデータ伝達
// v-bind: // v-bind: https://qiita.com/_Keitaro_/items/f77d2340f9390f028677
/* tslint:enable */

@Component({
	components: {
		HelloWorld,
		SignIn,
	},
})
export default class App extends Vue {
	user: models.User | null = null;

	mounted() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user == null) {
				this.user = null;
			} else {
				this.user = factories.createUser(user);
			}
		}, (err) => {
			console.error("error auth: ", err);
		});
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
