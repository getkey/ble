export function isShortcut(ev: KeyboardEvent | MouseEvent): boolean {
	return navigator.platform.startsWith('Mac') ? ev.metaKey : ev.ctrlKey;
}
