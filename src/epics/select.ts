import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, filter, scan } from 'rxjs/operators';
import { ofType } from 'epix';

import { Epic } from 'src/types/actions';
import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';
import BlockM from 'src/models/Block';

export const polygonMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		// we copy the relevant data because react pools events
		map(({ ev, entityId }) => ({
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			x: ev.data.originalEvent.clientX,
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			y: ev.data.originalEvent.clientY,
			entityId,
		})),
		switchMap(({ x, y, entityId }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			map(({ clientX, clientY }) => {
				return {
					x: clientX - x,
					y: clientY - y,
				};
			}),
			// we store how much the polygon has been offset already in offset
			scan((offset, currentDelta) => {
				const { editor: { scale } } = store;
				const wantedPos = snapToGrid({
					x: currentDelta.x*(1/scale),
					y: currentDelta.y*(1/scale),
				}, store.editor.gridCellSize);

				const displacement = {
					x: wantedPos.x - offset.x,
					y: wantedPos.y - offset.y,
				};

				const storePolygon = store.level.entities.get(entityId);
				if (storePolygon === undefined) return offset;
				storePolygon.move(displacement.x, displacement.y);

				return wantedPos;
			}, { x: 0, y: 0 }),
			takeUntil(fromEvent(document, 'pointerup')),
		)),
		ignoreElements(),
	);
};

export const pointMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		switchMap(({ entityId, vertexId }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			tap((ev) => {
				const pos = {
					x: ev.clientX,
					y: ev.clientY,
				};
				const storePolygon = store.level.entities.get(entityId);
				if (storePolygon === undefined) return;
				if (!BlockM.is(storePolygon)) throw new Error('Not a block');
				const storePoint = storePolygon.params.vertices[vertexId];

				const posInWorld = store.editor.screenToWorld(pos);
				const snappedPos = snapToGrid(posInWorld, store.editor.gridCellSize);

				storePoint.set(snappedPos.x, snappedPos.y);
			}),
			takeUntil(fromEvent(document, 'pointerup')),
		)),
		ignoreElements(),
	);
};

export const selectPolygon: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('entityPointerDown', 'vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ entityId }) => {
			const storePolygon = store.level.entities.get(entityId);
			if (storePolygon === undefined) return;

			store.editor.setSelectedEntity(storePolygon);
		}),
		ignoreElements(),
	);
};

export const unselect: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('backgroundClick'),
		filter(() => [EditorMode.select, EditorMode.delete].includes(store.editor.mode)),
		tap(() => {
			store.editor.setSelectedEntity(undefined);
		}),
		ignoreElements(),
	);
};
