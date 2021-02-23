import { fromEvent, merge } from 'rxjs';
import { take, map, tap, switchMap, takeUntil, ignoreElements, filter } from 'rxjs/operators';
import { Epic, ofType } from 'epix';

import { EditorMode } from 'src/types/editor';

export const middleClickPan: Epic = (action$, { store, app }) => {
	return fromEvent<PointerEvent>(app.view, 'mousedown').pipe(
		filter((ev) => ev.button === 1),
		tap((ev) => {
			// on Windows middle-click is for multidirectional scroll
			ev.preventDefault();
		}),
		switchMap(() => {
			const oldMode = store.editor.mode;

			store.editor.setMode(EditorMode.pan);

			return fromEvent<PointerEvent>(app.view, 'mouseup').pipe(
				tap(() => {
					store.editor.setMode(oldMode);
				}),
				take(1),
			);
		}),
		ignoreElements(),
	);
};

export const globalPan: Epic = (action$, { store, app }) => {
	return fromEvent<PointerEvent>(app.view, 'pointerdown').pipe(
		// setting the editor pan mode must be done before! order is important
		filter(() => store.editor.mode === EditorMode.pan),
		tap(() => {
			store.editor.setPanning(true);
			store.undoManager.startGroup();
		}),
		map(({ clientX, clientY }) => ({ // save starting values
			start: {
				x: clientX,
				y: clientY,
			},
			pivot: {
				x: store.editor.position.x,
				y: store.editor.position.y,
			},
		})),
		switchMap(({ start, pivot }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			tap(({ clientX, clientY }) => {
				const { scale } = store.editor;
				const deltaX = pivot.x + (start.x - clientX) * (1/scale);
				const deltaY = pivot.y + (start.y - clientY) * (1/scale);

				store.editor.position.set(deltaX, deltaY);
			}),
			takeUntil(fromEvent(document, 'pointerup').pipe(
				tap(() => {
					store.undoManager.stopGroup();
					store.editor.setPanning(false);
				})
			)),
		)),
		ignoreElements(),
	);
};

export const resize: Epic = (action$, { store, app }) => {
	return merge(
		action$.pipe(
			ofType('hydrate'),
		),
		fromEvent(app.renderer, 'resize'),
	).pipe(
		tap(() => {
			const box = app.view.getBoundingClientRect();
			store.editor.setScreenSize(box);
		}),
		ignoreElements(),
	);
};
