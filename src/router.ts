import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import PostForm from "./views/PostForm.vue";
import User from "./views/User.vue";
import UserPost from "./views/UserPost.vue";

Vue.use(Router);

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
			props: true,
		},
		{
			path: "/:userName/:postId",
			name: "user",
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
