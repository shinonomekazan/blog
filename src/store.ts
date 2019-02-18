import firebase from "firebase";
import * as models from "./models";
import * as factories from "./factories";

export interface Store {
	user: models.User | null;
	firebaseUser: firebase.User | null;
	initialize(): void;
	refresh(): void;
}

function getUserData(user: firebase.User): Promise<models.User> {
	return new Promise((resolve, reject) => {
		firebase.firestore().collection("users").where("id", "==", user.uid).get().then((users) => {
			if (users.docs.length === 0) {
				resolve(factories.createUser(user));
				return;
			}
			const storeUser = users.docs[0].data() as models.StoreUser;
			console.log(storeUser);
			resolve(factories.createUser(user, storeUser));
		}).catch(reject);
	});
}

export const store: Store = {
	user: null as models.User | null,
	firebaseUser: null as firebase.User | null,

	async refresh() {
		if (this.firebaseUser == null) {
			this.user = null;
			console.log("user is null");
			return;
		}
		try {
			this.user = await getUserData(this.firebaseUser);
			console.log("user", this.user);
		} catch (error) {
			console.error("get user data error", error);
		}
	},

	initialize() {
		const currentUser = firebase.auth().currentUser;
		if (currentUser != null) {
			this.firebaseUser = currentUser;
			this.refresh();
		}
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user == null) {
				this.firebaseUser = null;
				this.refresh();
			} else {
				this.firebaseUser = user;
				this.refresh();
			}
		}, (err) => {
			console.error("error auth: ", err);
		});
	},
};
