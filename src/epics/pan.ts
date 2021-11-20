import { fromEvent, merge, partition } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, filter, exhaustMap, take } from 'rxjs/operators';
import { Epic, ofType } from 'epix';

import { EditorMode } from 'src/types/editor';

export const panShortcut: Epic = (action$, { store }) => {
	return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
		filter((ev) => ev.key === ' '),
		map(() => store.editor.mode),
		tap(() => {
			store.editor.setMode(EditorMode.pan);
		}),
		exhaustMap((oldMode) => fromEvent<KeyboardEvent>(document, 'keyup').pipe(
			take(1),
			tap(() => {
				store.editor.setMode(oldMode);
			}),
		)),
	);
};

export const globalPan: Epic = (action$, { store, app }) => {
	const [middleClick$, otherClick$] = partition(fromEvent<PointerEvent>(app.view, 'pointerdown'), (ev) => ev.button === 1);

	const startPanning$ = merge(
		middleClick$.pipe(
			tap((ev) => {
				// on Windows middle-click is for multidirectional scroll
				ev.preventDefault();
			}),
		),
		otherClick$.pipe(
			filter((ev) => store.editor.mode === EditorMode.pan || ev.button === 1),
		),
	);

	return startPanning$.pipe(
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
		switchMap(({ start, pivot }) => {
			const oldMode = store.editor.mode;
			store.editor.setMode(EditorMode.pan);

			return fromEvent<PointerEvent>(document, 'pointermove').pipe(
				tap(({ clientX, clientY }) => {
					const { scale } = store.editor;
					const deltaX = pivot.x + (start.x - clientX) * (1/scale);
					const deltaY = pivot.y + (start.y - clientY) * (1/scale);

					store.editor.position.set(deltaX, deltaY);
				}),
				takeUntil(fromEvent(document, 'pointerup').pipe(
					tap(() => {
						store.editor.setMode(oldMode);
						store.undoManager.stopGroup();
						store.editor.setPanning(false);
					})
				)),
			);
		}),
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
