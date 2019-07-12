import Vue from "vue";
import Router from "vue-router";
import TopPage from "./views/TopPage.vue";
import PostForm from "./views/PostForm.vue";
import UserPosts from "./views/UserPosts.vue";
import UserPost from "./views/UserPost.vue";
import {store} from "./store";

Vue.use(Router);

function getInt(param: string | (string | null)[], defaultValue: null | number = null) {
	if (param == null) {
		return defaultValue;
	}
	if (typeof param === "string") {
		return parseInt(param, 10);
	}
	const firstParam = param[0];
	if (firstParam == null) {
		return 0;
	}
	return parseInt(firstParam, 10);
}
function getOrder(param: string | (string | null)[]) {
	if (param === "asc") {
		return "asc";
	}
	return "desc";
}

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: TopPage,
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ "./views/AboutThis.vue"),
		},
		{
			path: "/_do_post",
			name: "post",
			component: PostForm,
			props: (route) => {
				return {
					owner: store.user,
				};
			},
		},
		{
			path: "/:userName",
			name: "user",
			component: UserPosts,
			props: (route) => {
				return {
					userName: route.params.userName,
					// TODO: 多分ヘルパーある
					since: route.query.since,
					order: getOrder(route.query.order),
					page: getInt(route.query.page, 0),
				};
			},
		},
		{
			path: "/:userName/:postId",
			name: "userPost",
			component: UserPost,
			props: true,
		},
		// {
		// 	path: "/post",
		// 	name: "post",
		// 	component: () => import("./views/Post.vue"),
		// },
	],
});
