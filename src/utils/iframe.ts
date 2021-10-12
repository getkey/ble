export const inIframe = window.parent.location !== window.location;

type EditorMessage = {
	type: string;
	[key: string]: unknown;
};

export function postMessage(message: EditorMessage): void {
	[
		'https://bombhopper.io',
		'https://b11df0e8-fbf1-11e9-ab1b-e6a2878b8862.poki-gdn.com',
		'https://staging.bombhopper.io',
		'http://127.0.0.1:10001',
	].forEach((targetOrigin) => window.parent.postMessage(message, targetOrigin));
}
