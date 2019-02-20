<template>
	<div id="home">
		<SignIn :user="store.user" />

		<h2 v-if="user">{{user.displayName}}のブログ</h2>
		<template>
			<Post v-for="(post, index) in posts" :key="index" :post="post" :user="user" />
			<div class="pager">
				<template v-if="hasPrev()">
					<a :href="prevLink()">前のページ</a>
				</template>
				&nbsp;&nbsp;
				<template v-if="hasNext()">
					<a :href="nextLink()">次のページ</a>
				</template>
			</div>
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
	@Prop({
		required: false,
		default: null,
		type: Number,
	}) after!: number | null;
	@Prop({
		required: false,
		default: null,
		type: Number,
	}) before!: number | null;
	@Prop({
		required: false,
		default: 0,
		type: Number,
	}) page!: number;

	pagingCount: number = 2;
	posts: models.Post[] = [];
	lastPost: models.Post | null = null;
	firstPost: models.Post | null = null;
	store = store;
	user: models.Owner | null = null;

	offset() {
		return this.page * this.pagingCount;
	}

	prevLink() {
		if (this.firstPost == null) return "?";
		if (this.page === 1) return "?";
		return `?before=${this.firstPost.created.toMillis()}&page=${this.page - 1}`;
	}

	nextLink() {
		if (this.lastPost == null) return "?";
		return `?after=${this.lastPost.created.toMillis()}&page=${this.page + 1}`;
	}

	hasPrev() {
		return this.page > 0;
	}

	hasNext() {
		if (this.user == null) return false;
		console.log("hasNext: ",  this.offset(), this.pagingCount, this.user.postCount);
		return (this.offset() + this.pagingCount) < this.user.postCount;
	}

	createQuery(userRef: firebase.firestore.DocumentReference) {
		let postQuery = userRef.collection("posts")
			.limit(this.pagingCount);
		console.log("create query", this.after, this.before, this.page);
		if (this.after != null) {
			postQuery = postQuery.orderBy("created", "desc")
				.startAfter(firebase.firestore.Timestamp.fromMillis(this.after));
		} else if (this.before != null && this.page > 0) {
			postQuery = postQuery.orderBy("created", "asc")
				.startAfter(firebase.firestore.Timestamp.fromMillis(this.before));
		} else {
			postQuery = postQuery.orderBy("created", "desc");
		}

		return postQuery;
	}

	async created() {
		console.log("user created", this.userName, this.before, this.after);
		const userRef = firebase.firestore().collection("users").doc(this.userName);
		try {
			const storeUser = await userRef.get();
			const posts = await this.createQuery(userRef).get();
			console.log("error wa koko desuka?")
			this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
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
			// TODO: ばっちい。
			if (this.before != null && this.page > 0) {
				this.posts = this.posts.reverse();
			}
			if (this.posts.length > 0) {
				this.lastPost = this.posts[this.posts.length - 1];
				this.firstPost = this.posts[0];
			} else {
				this.lastPost = null;
				this.firstPost = null;
			}
		} catch (err) {
			console.error("get data error", err);
		}
	}
}
</script>
