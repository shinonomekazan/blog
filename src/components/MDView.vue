<template>
	<div v-html="preview()"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as utils from "../utils";

@Component({})
export default class MDView extends Vue {
	@Prop() body!: string;

	preview() {
		return utils.markdown(this.body);
	}
}
</script>
