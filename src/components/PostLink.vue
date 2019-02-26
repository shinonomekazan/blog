<template>
	<router-link :to="{name:'userPost', params: {userName: userName, postId: post.id}}">
		{{post.subject}}
	</router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as models from "../models";

@Component({})
export default class PostLink extends Vue {
	@Prop() userName!: string;
	@Prop() post!: models.ViewablePost;
}
</script>
