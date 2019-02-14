import firebase from "firebase";
import User from "../models/User";

export function createUser(firebaseUser: firebase.User): User {
	return {
		id: firebaseUser.uid,
		name: firebaseUser.displayName,
		verified: firebaseUser.emailVerified,
	};
}
