<template>
	<div>
		<h3 v-if="relativePosts.length > 0">他の記事</h3>
		<ul>
			<li v-for="(relativePost, index) in relativePosts" :key="index">
				<PostLink :userName="userName" :post="relativePost" />
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PostLink from "./PostLink.vue";
import * as models from "../models";
import * as factories from "../factories";
import firebase from "firebase";
import firestore = firebase.firestore;

@Component({
	components: {
		PostLink,
	},
})
export default class RelativePost extends Vue {
	@Prop() userName!: string;
	@Prop() post!: models.ViewablePost;
	relativePosts: models.ViewablePost[] = [];

	@Watch("post")
	async onPostChanged() {
		this.relativePosts = [];
		const postRef = firestore().collection("users").doc(this.userName).collection("posts");
		try {
			// 30日前から適当に10個取る
			// TODO: 本当は前後の記事 or 本当のランダム取得を2クエリ以内でやりたいができなかった
			// TODO: 一か月に3本以上書いてくれないと3個出てくれないクソ仕様
			const old = firestore.Timestamp.fromMillis(this.post.created.toMillis() - 30 * 24 * 60 * 60 * 1000);
			const relativePosts = await postRef.where(
				"created",
				">",
				old,
			).limit(10).get();
			relativePosts.forEach((post) => {
				if (post.id === this.post.id) {
					return;
				}
				this.relativePosts.push(factories.createViewablePostByDocumentSnapshot(post));
			});
			// 10個からランダムに3つ表示
			while (this.relativePosts.length > 3) {
				this.relativePosts.splice(Math.floor(Math.random() * this.relativePosts.length), 1);
			}
		} catch (err) {
			console.error("get relative post error", err);
		}
	}
}
</script>
