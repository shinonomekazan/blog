import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router";
import {store} from "./store";

Vue.config.productionTip = false;

// Initialize Firebase
const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
};
firebase.initializeApp(firebaseConfig);

store.initialize();

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
