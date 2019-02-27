<template>
	<div id="home">
		<v-list two-line>
			<template  v-for="(post, index) in posts">
				<TopPostTitle :post="post" :key="index" />
			</template>
		</v-list>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TopPostTitle from "../components/TopPostTitle.vue";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";

@Component({
	components: {
		TopPostTitle,
	},
})
export default class TopPage extends Vue {
	postRef: firebase.firestore.CollectionReference | null = null;
	posts: models.AllPost[] = [];

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
