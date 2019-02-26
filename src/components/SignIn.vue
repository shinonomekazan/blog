<template>
	<div style="display: inline">
		<template v-if="user">
			ようこそ <span>{{user.displayName}}</span> さん
			<a @click="signOut" class="button--green">signOut</a>
			<RegisterUser v-if="!user.registered" :user="user" />
		</template>
		<template v-else>
			<a @click="signIn" class="button--green">signIn</a>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import firebase from "firebase";
import * as models from "../models";
import RegisterUser from "./RegisterUser.vue";

@Component({
	components: {
		RegisterUser,
	},
})
export default class SignIn extends Vue {
	@Prop() user!: models.User;

	signIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	}

	signOut() {
		firebase.auth().signOut();
	}
}
</script>
