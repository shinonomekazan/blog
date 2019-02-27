<template>
	<v-toolbar-items>
		<v-btn flat :to="{name: 'user', params: { userName: user.name}}" v-if="user">
			{{user.displayName}}
		</v-btn>
		<v-btn flat @click="signOut" v-if="user">signOut</v-btn>
		<v-btn flat @click="signIn" v-else>signIn</v-btn>
	</v-toolbar-items>
<!--
	<v-avatar v-if="user">
		<v-icon>person</v-icon>
		<strong>{{user.displayName}}</strong>
	</v-avatar>
	<template v-if="user">
		<v-btn flat @click="signOut">signOut</v-btn>
		<RegisterUser v-if="!user.registered" :user="user" />
	</template>
	<template v-else>
		<v-btn @click="signIn">signIn</v-btn>
	</template>
-->
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
