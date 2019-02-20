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
	}) since!: string | null;
	@Prop({
		required: true,
		default: "desc",
	}) order!: "asc" | "desc";
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
		return `?since=${this.firstPost.id!}&order=asc&page=${this.page - 1}`;
	}

	nextLink() {
		if (this.lastPost == null) return "?";
		return `?since=${this.lastPost.id!}&page=${this.page + 1}`;
	}

	hasPrev() {
		return this.page > 0;
	}

	hasNext() {
		if (this.user == null) return false;
		console.log("hasNext: ",  this.offset(), this.pagingCount, this.user.postCount);
		return (this.offset() + this.pagingCount) < this.user.postCount;
	}

	async createQuery(userRef: firebase.firestore.DocumentReference) {
		const postRef = userRef.collection("posts");
		const postQuery = postRef.limit(this.pagingCount);
		async function orderWithSince(query: firebase.firestore.Query, order: firebase.firestore.OrderByDirection, since: string) {
			const sinceDoc = await (postRef.doc(since)).get();
			if (! sinceDoc.exists) return query.orderBy("created", order);
			return query.orderBy("created", order).startAfter(sinceDoc);
		}
		if (this.order === "asc" && this.since != null) {
			return orderWithSince(postQuery, "asc", this.since);
		}
		if (this.since != null) {
			return orderWithSince(postQuery, "desc", this.since);
		}
		return postQuery.orderBy("created", "desc");
	}

	async created() {
		console.log("user created", this.userName, this.since, this.order, this.page);
		const userRef = firebase.firestore().collection("users").doc(this.userName);
		try {
			const storeUser = await userRef.get();
			const query = await this.createQuery(userRef);
			const posts = await query.get();
			this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
			this.posts = [];
			posts.forEach((post) => {
				const data = post.data() as models.Post;
				this.posts.push({
					subject: data.subject,
					body: data.body,
					created: data.created,
					updated: data.updated,
					id: post.id,
				});
			});
			if (this.order === "asc") {
				this.posts = this.posts.reverse();
			}
			// TODO: ばっちい。
			// if (this.before != null && this.page > 0) {
			// 	this.posts = this.posts.reverse();
			// }
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
