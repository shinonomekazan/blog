import firebase from "firebase";
export interface Post {
	userId: string;
	subject: string;
	body: string;
	created: firebase.firestore.Timestamp;
	updated: firebase.firestore.Timestamp;
}
