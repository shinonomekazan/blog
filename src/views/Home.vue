<template>
	<div id="home">
		<SignIn :user="store.user" />

		<ul class="toppost">
			<li v-for="(post, index) in posts" :key="index">
				<TopPost :post="post" />
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SignIn from "../components/SignIn.vue";
import TopPost from "../components/TopPost.vue";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";
import {store} from "../store";

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
		TopPost,
	},
})
export default class Home extends Vue {
	postRef: firebase.firestore.CollectionReference | null = null;
	posts: models.AllPost[] = [];
	store = store;

	async created() {
		console.log("home created");
		this.postRef = firebase.firestore().collection("allPosts");
		try {
			// TODO: キャッシュのライフサイクル的なものを設定して強めにきかせたい
			const posts = await this.postRef.orderBy("created", "desc").limit(100).get();
			this.posts = [];
			posts.forEach((post) => {
				const data = post.data();
				this.posts.push({
					subject: data.subject,
					body: data.body,
					created: data.created,
					updated: data.updated,
					postRef: data.postRef,
					userId: data.userId,
					userName: data.userName,
					userDisplayName: data.userDisplayName,
				});
			});
		} catch (err) {
			console.error("get data error", err);
		}
	}
}
</script>
