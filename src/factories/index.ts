import firebase from "firebase";
import * as models from "../models";

export function createOwner(id: string, storeUser: models.StoreUser): models.Owner {
	return {
		id,
		name: storeUser.name,
		displayName: storeUser.displayName,
		created: storeUser.created.toDate(),
		postCount: storeUser.postCount,
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

export function createViewablePostByDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot) {
	const data = documentSnapshot.data() as models.Post;
	return {
		subject: data.subject,
		body: data.body,
		created: data.created,
		updated: data.updated,
		// TODO: なんだかんだで参照を持っておく方が便利だがメモリの無駄遣い感もあり、ベストプラクティスを調べたい
		ref: documentSnapshot,
	};
}
