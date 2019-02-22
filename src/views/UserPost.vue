<template>
	<div id="home">
		<SignIn :user="store.user" />

		<h2 v-if="user"><router-link :to="userLink()">{{user.displayName}}のブログ</router-link></h2>
		<Post v-if="post" :user="user" :post="post" />
		<template>
			<h3 v-if="relativePosts.length > 0">他の記事</h3>
			<ul>
				<li v-for="(relativePost, index) in relativePosts" :key="index">
					<router-link :to="postLink(relativePost)">{{relativePost.subject}}</router-link>
				</li>
			</ul>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import SignIn from "../components/SignIn.vue";
import Post from "../components/Post.vue";
import firebase from "firebase";
import firestore = firebase.firestore;
import * as models from "../models";
import * as factories from "../factories";
import {store} from "../store";

@Component({
	components: {
		SignIn,
		Post,
	},
})
export default class User extends Vue {
	@Prop() userName!: string;
	@Prop() postId!: string;
	post: models.Post | null = null;
	relativePosts: models.ViewablePost[] = [];
	store = store;
	user: models.Owner | null = null;

	@Watch("postId")
	async onPostIdChanged() {
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

	async created() {
		console.log("user post created", this.userName, this.postId);
		const userRef = firestore().collection("users").doc(this.userName);
		const storeUser = await userRef.get();
		this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
		return this.onPostIdChanged();
	}

	postLink(post: models.ViewablePost) {
		return `${this.userLink()}/${post.id}`;
	}

	userLink() {
		if (this.user == null) {
			return "";
		}
		return `/${this.user.name}`;
	}
}
</script>
