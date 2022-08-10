import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic } from 'epix';

export const copy: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'copy').pipe(
		filter(() => store.editor.selection.size > 0),
		tap(() => {
			store.editor.copy();
		}),
		ignoreElements(),
	);
};

export const cut: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'cut').pipe(
		filter(() => store.editor.selection.size > 0),
		tap(() => {
			store.editor.cut();
		}),
		ignoreElements(),
	);
};

export const paste: Epic = (action$, { store }) => {
	return fromEvent<ClipboardEvent>(window, 'paste').pipe(
		filter(({ clipboardData }) => !!clipboardData),
		tap(({ clipboardData }) => {
			Array.from(clipboardData?.items ?? [])
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
