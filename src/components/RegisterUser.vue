<template>
	<v-layout row justify-center>
		<v-dialog v-model="dialog" persistent>
			<v-card>
				<v-card-title>
					ユーザ登録
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form @submit.prevent="register">
							<v-flex xs12>
								<v-text-field
									placeholder="識別名"
									v-model="name"
									required
									label="識別名"
								/>
							</v-flex>
							<v-flex xs12>
								<v-text-field
									placeholder="表示名"
									v-model="displayName"
									required
									label="表示名" />
							</v-flex>
							<v-flex xs12>
								<v-btn color="success" @click="register">
									登録
								</v-btn>
								<v-btn color="error" @click="cancel">
									キャンセル
								</v-btn>
							</v-flex>
						</v-form>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as firebase from "firebase/app";
import * as models from "../models";
import {store} from "../store";
import * as factories from "../factories";

@Component({})
export default class RegisterUser extends Vue {
	@Prop() user!: models.User;
	name: string | null = null;
	displayName: string | null = null;
	dialog: boolean = false;

	@Watch("user")
	onUserChanged() {
		this.dialog = this.user != null && this.user.registered === false;
	}

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

	cancel() {
		firebase.auth().signOut();
	}
}
</script>
