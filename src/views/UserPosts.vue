<template>
	<div id="user">
		<h1 v-if="user">{{user.displayName}}の投稿</h1>
		<template>
			<div class="prev_pager">
				<template v-if="hasPrev">
					<v-btn color="info" @click="prev">新しい記事</v-btn>
				</template>
			</div>
			<PostView v-for="(post, index) in posts" :key="index" :post="post" :user="user" class="mb-4" />
			<div class="next_pager">
				<template v-if="hasNext">
					<v-btn color="info" @click="next">前の記事</v-btn>
				</template>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PostView from "../components/PostView.vue";
import firebase from "firebase";
import firestore = firebase.firestore;
import * as models from "../models";
import * as factories from "../factories";
import {store} from "../store";

@Component({
	components: {
		PostView,
	},
})
export default class UserPosts extends Vue {
	@Prop() userName!: string;
	@Prop({
		required: false,
		default: null,
	}) since!: string | null;
	@Prop({
		required: true,
		default: "desc",
	}) order!: "asc" | "desc";	// 本当はorderは「両方」をサポートするとより良いかもしれない
	@Prop({
		type: Number,
		default: 5,
	}) pagingCount!: number;
	@Prop({
		type: Number,
		default: 10,
	}) showCount!: number;
	posts: models.ViewablePost[] = [];
	lastPost: models.ViewablePost | null = null;
	firstPost: models.ViewablePost | null = null;
	hasPrev: boolean = false;
	hasNext: boolean = false;
	user: models.Owner | null = null;
	sinceId: string | null = null;

	// 使ってないがこのURLで栞的なものは作れる（それよりも文書中に栞を挟める方が便利だが）
	get prevLink() {
		if (this.firstPost == null) {
			return "?";
		}
		return `?since=${this.firstPost.id}&order=asc`;
	}

	// 使ってないがこのURLで栞的なものは作れる（それよりも文書中に栞を挟める方が便利だが）
	get nextLink() {
		if (this.lastPost == null) {
			return "?";
		}
		return `?since=${this.lastPost.id}`;
	}

	async next() {
		try {
			const posts = await this.$_UserPosts_getPosts(this.lastPost);
			this.posts = this.posts.concat(posts);
			this.$_UserPosts_refreshLastFirst(posts);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async prev() {
		try {
			const posts = await this.$_UserPosts_getPosts(this.firstPost, "asc");
			// なんかださい（applyしたいけどそれだとvueが変更検知に失敗する）
			posts.forEach((post) => {
				this.posts.unshift(post);
			});
			this.$_UserPosts_refreshLastFirst(posts, "asc");
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async created() {
		console.log("user created", this.userName, this.since, this.order);
		const userRef = firestore().collection("users").doc(this.userName);
		try {
			this.sinceId = this.since;
			const storeUser = await userRef.get();
			this.posts = await this.$_UserPosts_getPostsByProps();
			if (this.order === "asc") {
				// これはほんとは常時reverseしてprev()メソッドのunshiftをやめるべきなのかも？
				this.posts.reverse();
			}
			this.user = factories.createOwner(this.userName, storeUser.data() as models.StoreUser);
			this.$_UserPosts_refreshLastFirst(this.posts, this.order);
		} catch (err) {
			console.error("get data error", err);
		}
	}

	async $_UserPosts_getPosts(
		startAfter: models.ViewablePost | null = null,
		order: firestore.OrderByDirection = "desc") {
		try {
			const postRef = firestore().collection("users").doc(this.userName).collection("posts");
			let query = postRef.limit(this.pagingCount).orderBy("created", order);
			if (startAfter != null) {
				query = query.startAfter(startAfter.created);
			}
			try {
				const querySnapshot = await query.get();
				return this.$_UserPosts_createPosts(querySnapshot, order);
			} catch (error) {
				return Promise.reject(error);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}

	$_UserPosts_createPosts(querySnapshot: firestore.QuerySnapshot, order: firestore.OrderByDirection = "desc") {
		const posts: models.ViewablePost[] = [];
		querySnapshot.forEach((postDocumentSnapshot) => {
			posts.push(factories.createViewablePostByDocumentSnapshot(postDocumentSnapshot));
		});

		return posts;
	}

	async $_UserPosts_getPostsByProps() {
		if (this.since != null ) {
			const post = await this.$_UserPosts_getPost(this.since);
			return await this.$_UserPosts_getPosts(
				post,
				this.order,
			);
		} else {
			return this.$_UserPosts_getPosts();
		}
	}

	$_UserPosts_refreshLastFirst(newPosts: models.ViewablePost[], order: "desc" | "asc" = "desc") {
		if (this.posts.length > 0) {
			// 読み込みすぎの場合のカット処理
			if (this.posts.length > this.showCount) {
				if (order === "desc") {
					this.posts = this.posts.slice(this.posts.length - this.showCount);
					this.sinceId = this.posts[0].id;
				} else {
					this.posts = this.posts.slice(0, this.showCount - this.posts.length);
					this.sinceId = this.posts[this.posts.length - 1].id;
				}
			}
			this.lastPost = this.posts[this.posts.length - 1];
			this.firstPost = this.posts[0];
		} else {
			this.lastPost = null;
			this.firstPost = null;
		}
		// この次ページ/前ページ判定では最後まで読んだ時に一度無駄読み（0件であることを確認する読み込み）が発生する
		// 防止する場合はpagingの1個先まで読むという手が考えられそう
		if (order === "desc") {
			this.hasNext = newPosts.length >= this.pagingCount;
			this.hasPrev = this.sinceId != null;
		} else {
			this.hasPrev = newPosts.length >= this.pagingCount;
			this.hasNext = this.sinceId != null;
		}
	}

	async $_UserPosts_getPost(id: string): Promise<models.ViewablePost | null> {
		try {
			const postDoc = firestore().collection("users").doc(this.userName).collection("posts").doc(id);
			const documentSnapshot = await postDoc.get();
			if (! documentSnapshot.exists) {
				return null;
			}
			return factories.createViewablePostByDocumentSnapshot(documentSnapshot);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
</script>
