import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import PostForm from "./views/PostForm.vue";
import User from "./views/User.vue";
import UserPost from "./views/UserPost.vue";

Vue.use(Router);

function getInt(param: string | string[] | null, defaultValue: null | number = null) {
	if (param == null) {
		return defaultValue;
	}
	if (typeof param === "string") {
		return parseInt(param, 10);
	}
	return parseInt(param[0], 10);
}
function getOrder(param: string | string[] | null) {
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
			component: Home,
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ "./views/About.vue"),
		},
		{
			path: "/_do_post",
			name: "post",
			component: PostForm,
		},
		{
			path: "/:userName",
			name: "user",
			component: User,
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
