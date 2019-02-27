<template>
	<v-list-tile :to="{name: 'userPost', params: {userName: post.userName, postId: post.postRef.id}}">
		<v-list-tile-content>
			<v-list-tile-title>{{post.subject}}</v-list-tile-title>
			<v-list-tile-sub-title>
				{{date}}
				 -
				<router-link :to="{name: 'user', params: { userName: post.userName}}">
					{{post.userDisplayName}}
				</router-link>
			</v-list-tile-sub-title>
		</v-list-tile-content>
	</v-list-tile>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as models from "../models";
import PostLink from "../components/PostLink.vue";
import * as utils from "../utils";

@Component({})
export default class TopPostTitle extends Vue {
	@Prop() post!: models.AllPost;

	get date() {
		return utils.fromTimestampToDate(this.post.created);
	}
}
</script>
