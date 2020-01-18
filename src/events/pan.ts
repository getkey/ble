import { fromEvent } from 'rxjs';
import { filter, map, tap, switchMap, takeUntil } from 'rxjs/operators';

import { store } from 'src/models/';
import point from 'src/types/point';

fromEvent<MouseEvent>(document, 'mousedown').pipe(
	filter((ev) => ev.button === 1),
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
	switchMap(({ start, pivot }: { start: point, pivot: point }) => fromEvent<MouseEvent>(document, 'mousemove').pipe(
		tap(({ clientX, clientY }) => {
			const { scale } = store.editor;
			const deltaX = pivot.x + (start.x - clientX) * (1/scale);
			const deltaY = pivot.y + (start.y - clientY) * (1/scale);

			store.editor.position.set(deltaX, deltaY);
		}),
		takeUntil(fromEvent(document, 'mouseup')),
	)),
).subscribe();
