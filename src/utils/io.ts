export function toFilename(text: string, ext: string): string {
	const base = text.toLowerCase().replace(/\s/g, '_');

	return `${base}.${ext}`;
}
