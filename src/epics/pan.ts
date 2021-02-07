import { fromEvent, merge } from 'rxjs';
import { pluck, map, tap, switchMap, takeUntil, ignoreElements, filter } from 'rxjs/operators';
import { Epic, ofType } from 'epix';

import { EditorMode } from 'src/types/editor';

export const globalPan: Epic = (action$, { store, app }) => {
	const startPanning$ = merge(
		action$.pipe(
			ofType('backgroundPointerDown'),
			filter(() => store.editor.mode === EditorMode.select),
			// it's important to use global and not original event
			// because TouchEvents don't have clientX
			pluck('ev', 'data', 'global'),
			map(({ x, y }) => ({
				x: x + store.editor.renderZone.x,
				y: y + store.editor.renderZone.y,
			})),
		),
		fromEvent<PointerEvent>(app.view, 'mousedown').pipe(
			filter((ev) => ev.button === 1),
			tap((ev) => {
				// on Windows middle-click is for multidirectional scroll
				ev.preventDefault();
			}),
			map(({ clientX, clientY }) => ({
				x: clientX,
				y: clientY,
			})),
		),
	);

	return startPanning$.pipe(
		tap(() => {
			store.editor.setPanning(true);
			store.undoManager.startGroup();
		}),
		map(({ x, y }) => ({ // save starting values
			start: {
				x,
				y,
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
