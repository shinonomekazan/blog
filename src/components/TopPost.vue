<template>
	<div>
		<router-link :to="{name: 'userPost', params: {userName: this.post.userName, postId: this.post.postRef.id}}">
			{{post.subject}}
		</router-link>
		(<router-link :to="{name: 'user', params: { userName: this.post.userName}}">
			{{post.userDisplayName}}
		</router-link>)
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as models from "../models";
import PostLink from "../components/PostLink.vue";

@Component({})
export default class TopPost extends Vue {
	@Prop() post!: models.AllPost;
}
</script>
