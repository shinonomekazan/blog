import markdownIt from "markdown-it";
const md = markdownIt({
	html: true,
	linkify: true,
});

export function markdown(source: string) {
	return md.render(source);
}
