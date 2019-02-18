<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">TOP</router-link> |
			<router-link to="/_do_post">記事を書く</router-link> |
			<router-link to="/about">このサイト</router-link>
		</div>
		<router-view/>
	</div>
</template>

<!--
<script lang="ts">
import { Vue } from "vue-property-decorator";
// TODO: ここに認証コードを書いて、/postの表示非表示切り替え
export default class App extends Vue {
}
</script>
-->
<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
