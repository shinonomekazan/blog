<template id="post">
	<div class="post">
		<h3><router-link :to="postLink()">{{post.subject}}</router-link></h3>
		<!-- マークダウンをサポートしたい -->
		<div v-html="post.body"></div>
		<div>{{post.id}}</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as models from "../models";

@Component({})
export default class Post extends Vue {
	@Prop() user!: models.Owner;
	@Prop() post!: models.ViewablePost;

	postLink() {
		return `${this.userLink()}/${this.post.id}`;
	}

	userLink() {
		return `/${this.user.name}`;
	}
}
</script>
