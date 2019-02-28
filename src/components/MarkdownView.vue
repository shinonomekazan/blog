<template>
	<div>
		<v-textarea v-if="raw" readonly row="16" @click="copy" ref="textarea">
			{{preview}}
		</v-textarea>
		<div v-else v-html="preview"></div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component({})
export default class MarkdownView extends Vue {
	@Prop() body!: string;
	@Prop({
		type: Boolean,
		default: false,
	}) raw!: boolean;

	copy() {
		const target = (this.$refs.textarea as any).$refs.input as HTMLInputElement;
		target.select();
		document.execCommand("copy");
	}

	get preview() {
		if (! this.raw) {
			return utils.markdown(this.body);
		}
		return this.body;
	}
}
</script>
