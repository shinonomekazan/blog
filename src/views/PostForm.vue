<template>
	<form id="post" @submit.prevent="post">
		<div v-show="msg">{{msg}}</div>
		<div>
			タイトル: <input type="text" v-model="subject" placeholder="タイトル" aria-label="ブログの記事タイトル">
		</div>
		<div>
			<div>本文:</div>
			<div>
				<textarea v-model="body" placeholder="本文" aria-label="ブログの本文"></textarea>
			</div>
			<MarkdownView :body="body" />
		</div>
		<input type="submit">
	</form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MarkdownView from "../components/MarkdownView.vue";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";
import {store} from "../store";
import * as utils from "../utils";

@Component({
	components: {
		MarkdownView,
	},
})
export default class PostForm extends Vue {
	store = store;
	subject: string = "";
	body: string = "";
	msg: string = "";

	async post() {
		console.log("posted");
		// TODO: validate
		if (this.store.user == null || !this.store.user.registered) {
			this.msg = "ログインしてください。";
			return;
		}
		const registeredUser = this.store.user as models.RegisteredUser;
		const post = {
			subject: this.subject,
			body: this.body,
			created: firebase.firestore.FieldValue.serverTimestamp(),
			updated: firebase.firestore.FieldValue.serverTimestamp(),
		} as models.Post;
		console.log(post);
		try {
			await firebase.firestore().collection("users").doc(registeredUser.name).collection("posts").add(post);
			this.$_postForm_clear();
			this.msg = "投稿しました。";
		} catch (err) {
			console.error("add error", err);
			this.msg = "投稿失敗";
		}
	}

	$_postForm_clear() {
		this.subject = "";
		this.body = "";
	}
}
</script>
