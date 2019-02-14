<template>
	<form id="post" v-on:submit.prevent="post">
		<div v-show="msg">{{msg}}</div>
		<div>
			タイトル: <input type="text" v-model="subject" placeholder="タイトル" aria-label="ブログの記事タイトル">
		</div>
		<div>
			<div>本文:</div>
			<div>
				<textarea v-model="body" placeholder="本文" aria-label="ブログの本文"></textarea>
			</div>
		</div>
		<input type="submit">
	</form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";

export default class Post extends Vue {
	// あとでなんとかする
	user: models.User | null = null;
	// @Prop() user!: models.User;
	subject: string = "";
	body: string = "";
	msg: string = "";

	created() {
		console.log("post created");
	}

	activated() {
		console.log("post activated");
	}

	mounted() {
		console.log("post mounted");
		const currentUser = firebase.auth().currentUser;
		console.log("auth?", currentUser);
		if (currentUser != null) {
			this.user = factories.createUser(currentUser);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user == null) {
				this.user = null;
			} else {
				this.user = factories.createUser(user);
				console.log(this.user);
			}
		}, (err) => {
			console.error("error auth: ", err);
		});
	}

	async post() {
		console.log("posted");
		// TODO: validate
		if (this.user == null) {
			return;
		}
		console.log(this.subject);
		console.log(this.body);
		try {
			await firebase.firestore().collection("posts").add({
				subject: this.subject,
				body: this.body,
				userId: this.user.id,
			} as models.Post);
			this._clear();
			this.msg = "投稿しました。";
		} catch (err) {
			console.error("add error", err);
			this.msg = "投稿失敗";
		}
	}

	_clear() {
		this.subject = "";
		this.body = "";
	}
}
</script>
