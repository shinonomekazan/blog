<template>
	<div id="home">
		<PostView v-if="post" :user="user" :post="post" />
		<RelativePost :post="post" :userName="userName" />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import PostView from "../components/PostView.vue";
import RelativePost from "../components/RelativePost.vue";
import firebase from "firebase";
import firestore = firebase.firestore;
import * as models from "../models";
import * as factories from "../factories";

@Component({
	components: {
		PostView,
		RelativePost,
	},
})
export default class UserPost extends Vue {
	@Prop() userName!: string;
	@Prop() postId!: string;
	post: models.ViewablePost | null = null;
	relativePosts: models.ViewablePost[] = [];
	user: models.Owner | null = null;

	async created() {
		console.log("user post created", this.userName, this.postId);
		const userRef = firestore().collection("users").doc(this.userName);
		const storeUser = await userRef.get();
		this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
		return this.$_UserPost_onPostIdChanged();
	}

	@Watch("postId")
	async $_UserPost_onPostIdChanged() {
		const userRef = firestore().collection("users").doc(this.userName);
		this.relativePosts = [];
		try {
			const postRef = userRef.collection("posts");
			const thisPost = await postRef.doc(this.postId).get();
			this.post = factories.createViewablePostByDocumentSnapshot(thisPost);
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
				if (post.id === this.postId) {
					return;
				}
				this.relativePosts.push(factories.createViewablePostByDocumentSnapshot(post));
			});
			// 10個からランダムに3つ表示
			while (this.relativePosts.length > 3) {
				this.relativePosts.splice(Math.floor(Math.random() * this.relativePosts.length), 1);
			}
		} catch (err) {
			console.error("get data error", err);
		}
	}
}
</script>
