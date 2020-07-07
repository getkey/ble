import { fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, filter, scan } from 'rxjs/operators';
import { ofType, Epic } from 'epix';
import { resolveIdentifier } from 'mobx-state-tree';

import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';
import BlockM from 'src/models/Block';
import EntityM from 'src/models/Entity';
import VertexM from 'src/models/Vertex';

export const entityMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		// we copy the relevant data because react pools events
		map(({ ev, entityId }) => ({
			x: ev.data.global.x,
			y: ev.data.global.y,
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

				// @ts-ignore
				const entity = resolveIdentifier(EntityM, store.level.entities, entityId);
				if (entity === undefined) return offset;
				entity.move(displacement.x, displacement.y);

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
				const storePolygon = resolveIdentifier(BlockM, store.level.entities, entityId);
				if (storePolygon === undefined) return;

				const storePoint = resolveIdentifier(VertexM, storePolygon.params.vertices, vertexId);
				if (storePoint === undefined) return;

				const posInWorld = store.editor.screenToWorld(pos);
				const snappedPos = snapToGrid(posInWorld, store.editor.gridCellSize);

				storePoint.set(snappedPos.x, snappedPos.y);
			}),
			takeUntil(fromEvent(document, 'pointerup')),
		)),
		ignoreElements(),
	);
};

export const selectEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ entityId }) => {
			// @ts-ignore
			const entity = resolveIdentifier(EntityM, store.level.entities, entityId);
			if (entity === undefined) return;

			store.editor.setSelectedEntity(entity);
		}),
		ignoreElements(),
	);
};

export const selectVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ entityId, vertexId }) => {
			const block = resolveIdentifier(BlockM, store.level.entities, entityId);
			if (block === undefined) return;

			const point = resolveIdentifier(VertexM, block.params.vertices, vertexId);

			store.editor.setSelectedEntity(point);
		}),
		ignoreElements(),
	);
};

export const unselect: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('backgroundPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		tap(() => {
			store.editor.setSelectedEntity(undefined);
		}),
		ignoreElements(),
	);
};
