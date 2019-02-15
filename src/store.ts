import firebase from "firebase";
import * as models from "./models";
import * as factories from "./factories";

export interface Store {
	user: models.User | null;
	initialize(): void;
}

export const store: Store = {
	user: null as models.User | null,
	initialize() {
		const currentUser = firebase.auth().currentUser;
		if (currentUser != null) {
			this.user = factories.createUser(currentUser);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user == null) {
				this.user = null;
			} else {
				this.user = factories.createUser(user);
				console.log(this.user);
			}
		}, (err) => {
			console.error("error auth: ", err);
		});
	},
};
