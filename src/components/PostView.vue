<template id="post">
	<v-card>
		<v-card-title>
			<h1>
				<router-link :to="{name: 'userPost', params: {userName: user.name, postId: post.id}}">
					{{post.subject}}
				</router-link>
			</h1>
		</v-card-title>
		<v-divider />
		<v-card-text>
			<MarkdownView :body="post.body" />
		</v-card-text>
		<v-divider />
		<v-card-text>
			<router-link :to="{name: 'user', params: {userName: user.name}}">
				{{user.displayName}}
			</router-link>
			<span> - {{date}}</span>
		</v-card-text>
	</v-card>
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

	get date() {
		return utils.fromTimestampToDate(this.post.created);
	}
}
</script>
