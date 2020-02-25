import { fromEvent } from 'rxjs';
import { filter, map, tap, switchMap, takeUntil, ignoreElements } from 'rxjs/operators';

import { Epic } from 'epix';

export const globalPan: Epic = (action$, { store }) => {
	return fromEvent<MouseEvent>(document, 'mousedown').pipe(
		filter((ev) => ev.button === 1),
		tap((ev) => {
			// on Windows middle-click is for multidirectional scroll
			ev.preventDefault();

			store.editor.setPanning(true);
		}),
		map((ev) => ({ // save starting values
			start: {
				x: ev.clientX,
				y: ev.clientY,
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
