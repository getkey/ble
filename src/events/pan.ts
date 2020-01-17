import { fromEvent } from 'rxjs';
import { filter, map, tap, switchMap, takeUntil } from 'rxjs/operators';

import { store } from 'src/models/';
import point from 'src/types/point';

fromEvent(document, 'mousedown').pipe(
	filter((ev: MouseEvent) => ev.button === 1),
	map((ev: MouseEvent) => ({ // save starting values
		start: {
			x: ev.clientX,
			y: ev.clientY,
		},
		pivot: {
			x: store.editor.position.x,
			y: store.editor.position.y,
		},
	})),
	switchMap(({ start, pivot }: { start: point, pivot: point }) => fromEvent(document, 'mousemove').pipe(
		tap(({ clientX, clientY }: MouseEvent) => {
			const { scale } = store.editor;
			const deltaX = pivot.x + (start.x - clientX) * (1/scale);
			const deltaY = pivot.y + (start.y - clientY) * (1/scale);

			store.editor.position.set(deltaX, deltaY);
		}),
		takeUntil(fromEvent(document, 'mouseup')),
	)),
).subscribe();
