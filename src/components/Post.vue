<template id="post">
	<div class="post">
		<h3><router-link :to="postLink()">{{post.subject}}</router-link></h3>
		<div v-html="body()"></div>
		<div>{{date()}}</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as models from "../models";
import markdownIt from "markdown-it";

const md = markdownIt({
	html: true,
	linkify: true,
});

@Component({})
export default class Post extends Vue {
	@Prop() user!: models.Owner;
	@Prop() post!: models.ViewablePost;

	body() {
		return md.render(this.post.body);
	}

	date() {
		const d = this.post.created.toDate();
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}時${d.getMinutes()}分`;
	}

	postLink() {
		return `${this.userLink()}/${this.post.id}`;
	}

	userLink() {
		return `/${this.user.name}`;
	}
}
</script>
