<template id="post">
	<div class="post">
		<h3>{{post.subject}}</h3>
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
	@Prop() user!: models.User;
	@Prop() post!: models.Post;
}
</script>
