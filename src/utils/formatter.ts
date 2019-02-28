import * as firebase from "firebase/app";

export function fromTimestampToDate(ts: firebase.firestore.Timestamp) {
	const d = ts.toDate();
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}時${d.getMinutes()}分`;
}
