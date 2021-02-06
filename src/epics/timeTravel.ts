import { fromEvent } from 'rxjs';
import { map, tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic, ofType } from 'epix';

export const undoRedoShortcut: Epic = () => {
	return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
		filter((ev) => ev.code === 'KeyZ' && ev.ctrlKey),
		map(({ shiftKey }) => ({
			type: shiftKey ? 'redo' : 'undo',
		})),
	);
};

export const undoEpic: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('undo'),
		filter(() => store.undoManager.canUndo),
		tap(() => {
			store.undoManager.undo();
		}),
		ignoreElements(),
	);
};

export const redoEpic: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('redo'),
		filter(() => store.undoManager.canRedo),
		tap(() => {
			store.undoManager.redo();
		}),
		ignoreElements(),
	);
};
