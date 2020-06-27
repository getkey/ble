import { fromEvent } from 'rxjs';
import { pluck, map, tap, switchMap, takeUntil, ignoreElements } from 'rxjs/operators';

import { Epic, ofType } from 'epix';

export const globalPan: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('backgroundClick'),
		pluck('ev', 'data', 'global'),
		tap(() => {
			store.editor.setPanning(true);
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
		switchMap(({ start, pivot }) => fromEvent<MouseEvent>(document, 'mousemove').pipe(
			tap(({ clientX, clientY }) => {
				const { scale } = store.editor;
				const deltaX = pivot.x + (start.x - clientX) * (1/scale);
				const deltaY = pivot.y + (start.y - clientY) * (1/scale);

				store.editor.position.set(deltaX, deltaY);
			}),
			takeUntil(fromEvent(document, 'mouseup').pipe(
				tap(() => {
					store.editor.setPanning(false);
				})
			)),
		)),
		ignoreElements(),
	);
};

export const resize: Epic = (action$, { store }) => {
	// TODO: use app.renderer 'resize' event once it gets released
	// https://github.com/pixijs/pixi.js/pull/6415
	return fromEvent(window, 'resize').pipe(
		tap(() => {
			store.editor.setScreenSize(window.innerWidth, window.innerHeight);
		}),
		ignoreElements(),
	);
};
