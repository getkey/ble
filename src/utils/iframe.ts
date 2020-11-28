export const inIframe = window.parent.location !== window.location;

type EditorMessage = {
	type: string;
	[key: string]: unknown;
};

export function postMessage(message: EditorMessage): void {
	window.parent.postMessage(message, 'http://127.0.0.1:10001');
	window.parent.postMessage(message, 'https://bombhopper.io');
}
