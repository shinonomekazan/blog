<template>
	<v-app>
		<v-navigation-drawer hide-overlay fixed v-model="drawer">
			<v-list>
				<v-list-tile to="/">
					<v-list-tile-action>
						<v-icon>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>
							ブログシステム
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-divider />
				<UserForList :user="store.user" />
				<v-divider />
				<v-list-tile v-if="store.user" to="/_do_post">
					<v-list-tile-action>
						<v-icon>create</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>
							記事を書く
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile to="/about">
					<v-list-tile-action>
						<v-icon>info</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>
							このサイトについて
						</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app>
			<v-toolbar-side-icon @click="drawer = !drawer" />
			<v-toolbar-title>
				<router-link to="/">
					ブログシステム
				</router-link>
			</v-toolbar-title>
			<v-spacer />
			<!-- PC用ショートカット -->
			<v-toolbar-items class="hidden-sm-and-down">
				<v-btn icon to="/_do_post" title="記事を書く" v-if="store.user">
					<v-icon>create</v-icon>
				</v-btn>
				<v-btn icon to="/about" title="このサイトについて">
					<v-icon>info</v-icon>
				</v-btn>
			</v-toolbar-items>
			<UserForToolbar :user="store.user" class="hidden-sm-and-down" />
		</v-toolbar>
		<v-content>
			<v-container>
				<router-view/>
			</v-container>
		</v-content>
		<RegisterUser :user="store.user" />
	</v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import UserForList from "./components/UserForList.vue";
import UserForToolbar from "./components/UserForToolbar.vue";
import {store} from "./store";
import RegisterUser from "./components/RegisterUser.vue";

@Component({
	components: {
		UserForList,
		UserForToolbar,
		RegisterUser,
	},
})
export default class App extends Vue {
	store = store;
	drawer = false;
}
</script>
<style scoped>
.v-toolbar__title a {
	color: black;
	text-decoration: none;
}
</style>
