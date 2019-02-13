<template>
  <div class="signin">
    <a v-if="isAuth" @click="signOut" class="button--green">signOut</a>
    <a v-else @click="signIn" class="button--green">signIn</a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class SignIn extends Vue {
	@Prop() isAuth!: boolean;

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
