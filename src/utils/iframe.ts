export const inIframe = window.parent.location !== window.location;

type EditorMessage = {
	type: string;
	[key: string]: unknown;
};

export function postMessage(message: EditorMessage): void {
	window.parent.postMessage(message, '*');
}
