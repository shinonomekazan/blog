import firebase from "firebase";
export interface Post {
	subject: string;
	body: string;
	created: firebase.firestore.Timestamp;
	updated: firebase.firestore.Timestamp;
}

export interface ViewablePost extends Post {
	ref: firebase.firestore.DocumentSnapshot;
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
