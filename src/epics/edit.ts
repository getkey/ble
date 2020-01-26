import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, startWith, pairwise, filter } from 'rxjs/operators';

import { Epic } from 'src/types/actions';
import { ofType } from 'src/utils/epics';
import { EditorMode } from 'src/types/editor';

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
			startWith({ x: 0, y: 0 }),
			pairwise(),
			tap(([previousDelta, currentDelta]) => {
				// compute one increment
				const delta = {
					x: currentDelta.x - previousDelta.x,
					y: currentDelta.y - previousDelta.y,
				};
				const storePolygon = store.level.entities[polygonId];
				const { editor } = store;
				storePolygon.move(delta.x*(1/editor.scale), delta.y*(1/editor.scale));
			}),
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
				const storePoint = store.level.entities[polygonId].params.vertices[vertexId];
				const posInWorld = store.editor.screenToWorld(pos);
				// TODO: add grid snapping to grids of other size than 1
				const roundedPos = {
					x: Math.round(posInWorld.x),
					y: Math.round(posInWorld.y),
				};
				storePoint.set(roundedPos.x, roundedPos.y);
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
			store.level.entities[polygonId].deleteVertex(vertexId);
		}),
		ignoreElements(),
	);
};
