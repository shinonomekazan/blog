<template>
	<div id="app">
		<img alt="Vue logo" src="../assets/logo.png">
		<SignIn v-bind:user="user" />
		<ul>
			<li v-for="post in posts">{{post.subject}}</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SignIn from "../components/SignIn.vue";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";

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
		SignIn,
	},
})
export default class Home extends Vue {
	user: models.User | null = null;
	postRef: firebase.firestore.CollectionReference | null = null;
	posts: models.Post[] = [];

	async created() {
		console.log("home created");
		this.postRef = firebase.firestore().collection("posts");
		try {
			const posts = await this.postRef.get();
			this.posts = [];
			posts.forEach((post) => {
				const data = post.data();
				this.posts.push({
					userId: data.userId,
					subject: data.subject,
					body: data.body,
				});
			});
		} catch (err) {
			console.error("get data error", err);
		}
	}

	mounted() {
		const currentUser = firebase.auth().currentUser;
		if (currentUser != null) {
			this.user = factories.createUser(currentUser);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user == null) {
				this.user = null;
			} else {
				this.user = factories.createUser(user);
				console.log(this.user);
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
