import * as firebase from "firebase/app";
export interface Post {
	subject: string;
	body: string;
	created: firebase.firestore.Timestamp;
	updated: firebase.firestore.Timestamp;
}

export interface ViewablePost extends Post {
	id: string;
}

export interface AllPost {
	subject: string;
	body: string;
	userId: string;
	userName: string;
	userDisplayName: string;
	postRef: firebase.firestore.DocumentReference;
	created: firebase.firestore.Timestamp;
	updated: firebase.firestore.Timestamp;
}
