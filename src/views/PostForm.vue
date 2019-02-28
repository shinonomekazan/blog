<template>
	<v-form id="postForm" @submit.prevent="post" ref="postForm" lazy-validation>
		<div v-show="msg">{{msg}}</div>
		<v-layout row wrap>
			<v-flex xs12 md12>
				<v-text-field
					v-model="subject"
					placeholder="タイトル"
					aria-label="ブログの記事タイトル"
					required
					label="タイトル"
					:rules="titleRule"
				/>
			</v-flex>
			<v-flex xs12 md12>
				<v-layout>
					<v-flex xs12 sm3 md3>
						<v-btn color="success" @click="$refs.inputUpload.click()">画像を追加</v-btn>
						<input v-show="false" ref="inputUpload" type="file" @change="uploadFile" multiple="false" >
					</v-flex>
					<v-flex xs12 sm9 md9>
						<v-text-field v-model="imageUrl" label="画像のURL" placeholder="アップロードされた画像のURLが入ります" @click="copyUrl" ref="url" :readonly="true" />
					</v-flex>
				</v-layout>
			</v-flex>
			<!-- TODO: ほんとはauto-growやめてMarkdownViewもtextareaと同じ高さに自動調整したい -->
			<v-flex xs12 sm12 md6>
				<v-textarea
					v-model="body"
					placeholder="本文"
					aria-label="ブログの本文"
					required
					auto-grow
					label="本文"
					:rules="bodyRule"
					rows="16"
					ref="body"
				></v-textarea>
			</v-flex>
			<v-flex xs12 sm12 md6>
				<MarkdownView :body="body" />
			</v-flex>
		</v-layout>
		<v-btn color="success" type="submit">投稿</v-btn>
	</v-form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MarkdownView from "../components/MarkdownView.vue";
import * as firebase from "firebase/app";
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
	imageUrl: string = "";

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

	copyUrl() {
		const target = (this.$refs.url as any).$refs.input as HTMLInputElement;
		target.select();
		document.execCommand("copy");
		// TODO: ほんとはbodyにfocusあてたいけど上手く当たらない。。
	}

	async uploadFile() {
		const fileElement = this.$refs.inputUpload as HTMLInputElement;
		if (fileElement.files == null || fileElement.files.length === 0) {
			alert("選択してください");
			return;
		}

		const ref = firebase.storage().ref(`user/${this.owner.id}/public`);
		try {
			const file = fileElement.files[0];
			const metadata = {
				contentType: file.type,
			};
			const ext = utils.getFilenameExtension(file.name);
			if (! ext) {
				alert("拡張子付きのファイルをアップロードしてください");
				return;
			}
			const fileName = `${Date.now().toString(16)}.${ext}`;
			const result = await ref.child(fileName).put(file, metadata);
			if (result.state === "success") {
				if (result.downloadURL == null) {
					const downloadUrl = await result.ref.getDownloadURL();
					console.log("getDownloadURL", downloadUrl);
					this.imageUrl = downloadUrl;
				} else {
					this.imageUrl = result.downloadURL;
				}
			}
		} catch (error) {
			// TODO: show error
			console.error("upload file error", error);
		}

	}

	async post() {
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
		// TODO: VFormを型解決しないと無理だけど現状型解決できないっぽい
		(this.$refs.postForm as any).resetValidation();
	}
}
</script>
