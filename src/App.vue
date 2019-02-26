<template>
	<v-app>
		<v-toolbar app>
			<router-link to="/">TOP</router-link> |
			<template v-if="store.user">
				<router-link to="/_do_post">記事を書く</router-link> |
			</template>
			<router-link to="/about">このサイト</router-link>
			<span style="margin-right: 1ex"></span>
			<SignIn :user="store.user" />
		</v-toolbar>
		<v-content>
			<router-view/>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SignIn from "./components/SignIn.vue";
import {store} from "./store";

@Component({
	components: {
			SignIn,
	},
})
export default class App extends Vue {
	store = store;
}
</script>
