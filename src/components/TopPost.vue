<template>
	<div>
		<a :href="postLink()">{{post.subject}}</a> (<a :href="userLink()">{{post.userDisplayName}}</a>)
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as models from "../models";

@Component({})
export default class TopPost extends Vue {
	@Prop() post!: models.AllPost;

	postLink() {
		return `${this.userLink()}/${this.post.postRef.id}`;
	}

	userLink() {
		return `/${this.post.userName}`;
	}
}
</script>
