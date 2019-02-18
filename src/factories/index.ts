import firebase from "firebase";
import {User, StoreUser, RegisteredUser} from "../models/User";

export function createUser(firebaseUser: firebase.User, storeUser?: StoreUser): User {
	if (storeUser == null) {
		return {
			id: firebaseUser.uid,
			displayName: firebaseUser.displayName || firebaseUser.email || firebaseUser.uid,
			verified: firebaseUser.emailVerified,
			registered: false,
		};
	}
	return {
		id: firebaseUser.uid,
		verified: firebaseUser.emailVerified,
		registered: true,
		name: storeUser.name,
		displayName: storeUser.displayName,
		created: storeUser.created.toDate(),
	} as RegisteredUser;
}
