import firebase from "firebase";
import * as models from "../models/User";

export function createOwner(id: string, storeUser: models.StoreUser): models.Owner {
	return {
		id,
		name: storeUser.name,
		displayName: storeUser.displayName,
		created: storeUser.created.toDate(),
	};
}

export function createUser(firebaseUser: firebase.User, storeUser?: models.StoreUser): models.User {
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
	} as models.RegisteredUser;
}
