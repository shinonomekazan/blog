<template>
	<v-card flat>
		<v-list class="pa-0" v-if="user">
			<v-list-tile avatar :to="{name: 'user', params: { userName: user.name}}">
				<v-list-tile-avatar>
					<v-icon>person</v-icon>
				</v-list-tile-avatar>
				<v-list-tile-content>
					<v-list-tile-title>{{user.displayName}}</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
		<v-list class="pa-0">
			<v-list-tile @click="signOut" v-if="user">
				<v-list-tile-action />
				<v-list-tile-content>
					<v-list-tile-title>
						SignOut
					</v-list-tile-title>
					<RegisterUser v-if="!user.registered" :user="user" />
				</v-list-tile-content>
			</v-list-tile>
			<v-list-tile @click="signIn" v-else>
				<v-list-tile-action />
				<v-list-tile-content>
					<v-list-tile-title>
						SignIn
					</v-list-tile-title>
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
	</v-card>
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
export default class UserForList extends Vue {
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
