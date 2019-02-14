<template>
	<div class="signin">
		<template v-if="user">
			ようこそ <span>{{user.name}}</span> さん
			<a @click="signOut" class="button--green">signOut</a>
		</template>
		<template v-else>
			<a @click="signIn" class="button--green">signIn</a>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import firebase from "firebase";
import * as models from "../models";

@Component
export default class SignIn extends Vue {
	@Prop() user!: models.User;

	signIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		// provider.addScope()
		firebase.auth().signInWithRedirect(provider);
	}
	signOut() {
		// TODO: このPromise処理しないでいいの？
		firebase.auth().signOut();
	}
}
</script>
