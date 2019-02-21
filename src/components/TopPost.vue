<template>
	<div>
		<router-link :to="postLink()">
			<a>{{post.subject}}</a>
		</router-link>
		(<router-link :to="userLink()">
			<a>{{post.userDisplayName}}</a>
		</router-link>)
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
