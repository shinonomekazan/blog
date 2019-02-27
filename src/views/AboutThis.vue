<template>
	<v-container>
		<v-card>
			<v-card-title>
				東雲火山ブログシステム
			</v-card-title>
			<v-divider />
			<v-card-text>
				<v-subheader>これは何</v-subheader>
				<p>Vue.jsとVue RouterとTypeScript + Class Style Vue ComponentとVuetifyとFirebaseとFirestoreの勉強用に作ったおべんきょブログシステムです。</p>
				<p>サインインするとブログっぽいものの投稿などができます。</p>
				<v-divider />
				<v-subheader>どう使うの</v-subheader>
				<p>ソースをOSS公開しているので、サンプルや土台としてご利用ください。</p>
				<p><v-btn href="https://github.com/shinonomekazan/blog">GitHub</v-btn></p>
				<v-subheader>ここをそのまま使ってもよいの？</v-subheader>
				<p>https://blog.shinonomekazan.com をそのまま使うのは特に問題ありません。</p>
				<p>一般的なブログシステムにとって必須といえるOGPに対応していないのでおすすめはしません。</p>
				<p>また、Firebaseの無料プランから外れる規模のアクセスがある場合、運用を保証できません。</p>
				<p>あくまでもデモサイトという位置付けで見ていただくのがよいと思います。</p>
			</v-card-text>
		</v-card>
	</v-container>
</template>
