export function getFilenameExtension(fileName: string) {
	if (! fileName) {
		return "";
	}
	const pos = fileName.lastIndexOf(".");
	if (pos === -1) {
		return "";
	}
	return fileName.substr(pos + 1);
}
