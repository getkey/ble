function click(node: HTMLElement): void {
	const event = new MouseEvent('click');
	node.dispatchEvent(event);
}

export function download(fileContent: string, filename: string, mime = 'application/json'): void {
	const blob = new Blob([fileContent], { type: mime });
	const url = window.URL.createObjectURL(blob);

	const a = window.document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	a.setAttribute('href', url);
	a.setAttribute('download', filename);

	click(a);
	window.URL.revokeObjectURL(url);
}

export function toFilename(text: string, ext: string): string {
	const base = text.toLowerCase().replace(/\s/g, '_');

	return `${base}.${ext}`;
}
