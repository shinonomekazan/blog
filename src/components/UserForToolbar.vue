<template>
	<v-toolbar-items>
		<v-btn flat :to="{name: 'user', params: { userName: user.name}}" v-if="user">
			{{user.displayName}}
		</v-btn>
		<v-btn flat @click="signOut" v-if="user">signOut</v-btn>
		<v-btn flat @click="signIn" v-else>signIn</v-btn>
	</v-toolbar-items>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as firebase from "firebase/app";
import * as models from "../models";

@Component({})
export default class UserForToolbar extends Vue {
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
