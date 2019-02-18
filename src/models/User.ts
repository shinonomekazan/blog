import fierbase from "firebase";
export interface User {
	id: string;
	displayName: string;
	registered: boolean;
	verified: boolean;
}

export interface StoreUser {
	name: string;
	displayName: string;
	created: firebase.firestore.Timestamp;
	posts: firebase.firestore.CollectionReference;
}
export interface RegisteredUser extends User {
	name: string;
	displayName: string;
	created: Date;
}
