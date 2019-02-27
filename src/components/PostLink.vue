<template>
	<span>
		<router-link :to="{name:'userPost', params: {userName: userName, postId: post.id}}">
			{{post.subject}}
		</router-link>
		 ({{date}})
	</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as models from "../models";
import * as utils from "../utils";

@Component({})
export default class PostLink extends Vue {
	@Prop() userName!: string;
	@Prop() post!: models.ViewablePost;

	get date() {
		return utils.fromTimestampToDate(this.post.created);
	}
}
</script>
