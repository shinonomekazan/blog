<template id="post">
	<div class="post">
		<h2><router-link :to="{name: 'userPost', params: {userName: user.name, postId: post.id}}">{{post.subject}}</router-link></h2>
		<MarkdownView :body="post.body" />
		<div>{{$_PostView_date}}</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MarkdownView from "./MarkdownView.vue";
import * as models from "../models";
import * as utils from "../utils";

@Component({
	components: {
		MarkdownView,
	},
})
export default class PostView extends Vue {
	@Prop() user!: models.Owner;
	@Prop() post!: models.ViewablePost;

	get $_PostView_date() {
		const d = this.post.created.toDate();
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}時${d.getMinutes()}分`;
	}
}
</script>
