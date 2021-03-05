import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic } from 'epix';

export const copy: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'copy').pipe(
		// target check to filter out event done in a text field
		filter(({ target }) => store.editor.selection.size > 0 && target === window.document.body),
		tap(() => {
			store.editor.copy();
		}),
		ignoreElements(),
	);
};

export const cut: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'cut').pipe(
		// target check to filter out event done in a text field
		filter(({ target }) => store.editor.selection.size > 0 && target === window.document.body),
		tap(() => {
			store.editor.cut();
		}),
		ignoreElements(),
	);
};

export const paste: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'paste').pipe(
		// target check to filter out event done in a text field
		filter(({ target, clipboardData }) => target === window.document.body && !!clipboardData),
		tap(({ clipboardData }) => {
			Array.from(clipboardData?.items || [])
				.filter(({ type }) => type === 'text/plain')
				.forEach((item) => {
					item.getAsString((clipboardContent) => {
						store.editor.paste(clipboardContent);
					});
				});
		}),
		ignoreElements(),
	);
};
