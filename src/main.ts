import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";

Vue.config.productionTip = false;

// Initialize Firebase
const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
};
console.log(process.env);
firebase.initializeApp(firebaseConfig);

new Vue({
	render: (h) => h(App),
}).$mount("#app");
