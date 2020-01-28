import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, filter, scan } from 'rxjs/operators';

import { Epic } from 'src/types/actions';
import { ofType } from 'src/utils/epics';
import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';

export const polygonMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('polygonPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		// we copy the relevant data because react pools events
		map(({ ev, polygonId }) => ({
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			x: ev.data.originalEvent.clientX,
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			y: ev.data.originalEvent.clientY,
			polygonId,
		})),
		switchMap(({ x, y, polygonId }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
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

				const storePolygon = store.level.entities.get(polygonId);
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
		switchMap(({ polygonId, vertexId }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			tap((ev) => {
				const pos = {
					x: ev.clientX,
					y: ev.clientY,
				};
				const storePolygon = store.level.entities.get(polygonId);
				if (storePolygon === undefined) return;
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

export const deletePolygon: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('polygonPointerDown'),
		filter(() => store.editor.mode === EditorMode.delete),
		tap(({ polygonId }) => {
			store.level.deleteEntity(polygonId);
		}),
		ignoreElements(),
	);
};

export const deleteVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.delete),
		tap(({ polygonId, vertexId }) => {
			const storePolygon = store.level.entities.get(polygonId);
			if (storePolygon === undefined) return;

			storePolygon.deleteVertex(vertexId);
		}),
		ignoreElements(),
	);
};


export const selectPolygon: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('polygonPointerDown', 'vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ polygonId }) => {
			const storePolygon = store.level.entities.get(polygonId);
			if (storePolygon === undefined) return;

			store.editor.setSelectedEntity(storePolygon);
		}),
		ignoreElements(),
	);
};
