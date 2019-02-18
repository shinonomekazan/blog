import firebase from "firebase";
export interface Post {
	subject: string;
	body: string;
	created: firebase.firestore.Timestamp;
	updated: firebase.firestore.Timestamp;
}
