<template>
	<v-form id="postForm" @submit.prevent="post" ref="postForm" lazy-validation>
		<div v-show="msg">{{msg}}</div>
		<div>
			<v-text-field
				v-model="subject"
				placeholder="タイトル"
				aria-label="ブログの記事タイトル"
				required
				label="タイトル"
				:rules="titleRule"
			/>
		</div>
		<div>
			<div>
				<!-- auto-growする方がいいのかもしれない -->
				<v-textarea
					v-model="body"
					placeholder="本文"
					aria-label="ブログの本文"
					required
					label="本文"
					:rules="bodyRule"
					rows="16"
				></v-textarea>
			</div>
			<MarkdownView :body="body" />
		</div>
		<v-btn color="success" @click="post">投稿</v-btn>
	</v-form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MarkdownView from "../components/MarkdownView.vue";
import firebase from "firebase";
import * as models from "../models";
import * as factories from "../factories";
import * as utils from "../utils";

@Component({
	components: {
		MarkdownView,
	},
})
export default class PostForm extends Vue {
	@Prop() owner!: models.RegisteredUser;
	subject: string = "";
	body: string = "";
	msg: string = "";

	get titleRule() {
		return [
			(v: string) => v.length === 0 ? "タイトルを入力してください" : true,
		];
	}

	get bodyRule() {
		return [
			(v: string) => v.length === 0 ? "本文を入力してください" : true,
		];
	}

	async post() {
		console.log("posted");
		console.log("validate?", (this.$refs.postForm as HTMLFormElement).validate());
		if (! (this.$refs.postForm as HTMLFormElement).validate()) {
			return;
		}
		if (this.owner == null || !this.owner.registered) {
			this.msg = "ログインしてください。";
			return;
		}
		const post = {
			subject: this.subject,
			body: this.body,
			created: firebase.firestore.FieldValue.serverTimestamp(),
			updated: firebase.firestore.FieldValue.serverTimestamp(),
		} as models.Post;
		console.log(post);
		try {
			await firebase.firestore().collection("users").doc(this.owner.name).collection("posts").add(post);
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
