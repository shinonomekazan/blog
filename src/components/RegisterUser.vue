<template>
	<div class="registerUser">
		登録してください。
		<div>
			<form @submit.prevent="register">
				<div>
					<input type="text" placeholder="識別名" v-model="name" />
				</div>
				<div>
					<input type="text" placeholder="表示名" v-model="displayName" />
				</div>
				<div>
					<input type="submit" value="登録" />
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import firebase from "firebase";
import * as models from "../models";
import {store} from "../store";
import * as factories from "../factories";

@Component({})
export default class RegisterUser extends Vue {
	@Prop() user!: models.User;
	name: string | null = null;
	displayName: string | null = null;

	register() {
		if (this.name == null || this.name === "") {
			return;
		}
		if (this.displayName == null || this.displayName === "") {
			return;
		}
		const storeUser = {
			id: this.user.id,
			name: this.name,
			displayName: this.displayName,
			created: firebase.firestore.FieldValue.serverTimestamp(),
			postCount: 0,
		};
		// TODO: setしかなくcreateがない
		firebase.firestore().collection("users").doc(storeUser.name).set(storeUser).then((err) => {
			if (err != null) {
				console.error("register user error", err);
				return;
			}
			store.refresh();
			console.log("registered user");
		}).catch((err) => {
			console.error("register user error", err);
		});
	}
}
</script>
