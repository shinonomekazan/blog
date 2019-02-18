<template>
	<div id="home">
		<SignIn :user="store.user" />

		<h2 v-if="user">{{user.displayName}}のブログ</h2>
		<template>
			<Post v-for="(post, index) in posts" :key="index" :post="post" :user="user" />
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SignIn from "../components/SignIn.vue";
import Post from "../components/Post.vue";
import firebase from "firebase";
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
	posts: models.Post[] = [];
	store = store;
	user: models.Owner | null = null;

	async created() {
		console.log("user created", this.userName);
		const userRef = firebase.firestore().collection("users").doc(this.userName);
		try {
			const storeUser = await userRef.get();
			this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
			// TODO: ページングのサポート
			const posts = await userRef.collection("posts").orderBy("created", "desc").limit(100).get();
			this.posts = [];
			posts.forEach((post) => {
				const data = post.data() as models.Post;
				this.posts.push({
					subject: data.subject,
					body: data.body,
					created: data.created,
					updated: data.updated,
				});
			});
		} catch (err) {
			console.error("get data error", err);
		}
	}
}
</script>
