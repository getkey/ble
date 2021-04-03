import { fromEvent, empty, of, merge } from 'rxjs';
import { map, tap, switchMap, takeUntil, ignoreElements, filter, scan, mergeMap, pluck, switchMapTo, mapTo, startWith, pairwise } from 'rxjs/operators';
import { ofType, Epic } from 'epix';
import { resolveIdentifier } from 'mobx-state-tree';
import { testPolygonCircle, testPolygonPolygon, Polygon, Vector, pointInCircle, pointInPolygon, Box } from 'sat';

import { EditorMode } from 'src/types/editor';
import { snapToGrid, snapBoxToGrid } from 'src/utils/geom';
import EntityM, { IEntity } from 'src/models/Entity';
import VertexM, { IVertex } from 'src/models/Vertex';
import { isShortcut } from 'src/utils/event';
import { fromMobx } from 'src/utils/observables';

export const entityMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.select),
		// middle click is panning only
		filter(({ ev }) => !(ev.data.pointerType === 'mouse' && ev.data.button === 1)),
		// it's important to use global and not original event
		// because TouchEvents don't have clientX
		pluck('ev', 'data', 'global'),
		// we copy the relevant data because react pools events
		map(({ x, y }) => ({
			x: x + store.editor.renderZone.x,
			y: y + store.editor.renderZone.y,
		})),
		tap(() => {
			store.undoManager.startGroup();
		}),
		switchMap(({ x, y }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			map(({ clientX, clientY }) => new Vector(clientX, clientY)),
			startWith(new Vector(x, y)),
			pairwise(),
			map(([prev, curr]) => curr.clone().sub(prev)),
			filter((vec) => vec.len2() !== 0),
			map((vec) => vec.scale(1/store.editor.scale)),
			scan((acc, delta) => {
				const totalDelta = acc.clone().add(delta);

				const displacement = snapBoxToGrid(
					new Box(
						store.editor.selectionAsAabb.pos.clone().add(totalDelta),
						store.editor.selectionAsAabb.w,
						store.editor.selectionAsAabb.h,
					),
					store.editor.gridCellSize,
				);

				store.editor.selection.forEach((entity: IEntity) => {
					entity.params.move(totalDelta.x + displacement.x, totalDelta.y + displacement.y);
				});

				return displacement.reverse();
			}, new Vector(0, 0)),
			takeUntil(fromEvent(document, 'pointerup').pipe(
				tap(() => {
					store.undoManager.stopGroup();
				}),
			)),
		)),
		ignoreElements(),
	);
};

export const pointMove: Epic = (action$, { store }) => {
	return action$.pipe (
		ofType('vertexPointerDown'),
		// middle click is panning only
		filter(({ ev }) => !(ev.data.pointerType === 'mouse' && ev.data.button === 1)),
		filter(() => store.editor.mode === EditorMode.select),
		mergeMap(({ vertexId }) => {
			const storePoint = resolveIdentifier(VertexM, store.level.entities, vertexId);
			if (storePoint === undefined) return empty();

			return of({
				storePoint,
			});
		}),
		tap(() => {
			store.undoManager.startGroup();
		}),
		switchMap(({ storePoint }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
			tap((ev) => {
				const pos = {
					x: ev.clientX - store.editor.renderZone.x,
					y: ev.clientY - store.editor.renderZone.y,
				};

				const posInWorld = store.editor.screenToWorld(pos);
				const snappedPos = snapToGrid(posInWorld, store.editor.gridCellSize);

				const delta = {
					x: snappedPos.x - storePoint.x,
					y: snappedPos.y - storePoint.y,
				};
				// we move the point under the cursor, snapping it to the grid
				storePoint.set(snappedPos.x, snappedPos.y);

				// the other seleced vertices aren't snapped
				store.editor.vertexSelection.forEach((vertex: IVertex) => {
					if (vertex === storePoint) return;

					vertex.move(delta.x, delta.y);
				});
			}),
			takeUntil(fromEvent(document, 'pointerup').pipe(
				tap(() => {
					store.undoManager.stopGroup();
					storePoint.parentBlock.params.cleanSuperposedVertices();
				}),
			)),
		)),
		ignoreElements(),
	);
};

export const selectEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('entityPointerDown'),
		// middle click is panning only
		filter(({ ev }) => !(ev.data.pointerType === 'mouse' && ev.data.button === 1)),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ entityId, ev }) => {
			// @ts-ignore
			const entity = resolveIdentifier(EntityM, store.level.entities, entityId);
			if (entity === undefined) return;

			if (isShortcut(ev.data.originalEvent)) {
				if (store.editor.selection.has(entity.id)) {
					store.editor.removeFromSelection(entity);
				} else {
					store.editor.addEntityToSelection(entity);
				}
			} else if (!store.editor.selection.has(entity.id)) {
				store.editor.setSelection([entity]);
			}
		}),
		ignoreElements(),
	);
};

export const selectVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('vertexPointerDown'),
		// middle click is panning only
		filter(({ ev }) => !(ev.data.pointerType === 'mouse' && ev.data.button === 1)),
		filter(() => store.editor.mode === EditorMode.select),
		tap(({ vertexId, ev }) => {
			const point = resolveIdentifier(VertexM, store.level.entities, vertexId);

			if (point === undefined) return;

			if (isShortcut(ev.data.originalEvent)) {
				if (store.editor.vertexSelection.has(point.id)) {
					store.editor.removeVertexFromSelection(point);
				} else {
					store.editor.addVertexToSelection(point);
				}
			} else if (!store.editor.vertexSelection.has(point.id)) {
				store.editor.setVertexSelection([point]);
			}
		}),
		ignoreElements(),
	);
};

export const selectionBox: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('backgroundPointerDown'),
		// middle click is panning only
		filter(({ ev }) => !(ev.data.pointerType === 'mouse' && ev.data.button === 1)),
		filter(() => store.editor.mode === EditorMode.select),
		// it's important to use global and not original event
		// because TouchEvents don't have clientX
		pluck('ev', 'data', 'global'),
		map((global) => store.editor.screenToWorld(global)),
		tap((worldPos) => {
			store.undoManager.startGroup();
			store.editor.startSelectionBox(worldPos);
		}),
		switchMapTo(fromEvent<PointerEvent>(document, 'pointermove').pipe(
			map((ev) => store.editor.screenToWorld({
				x: ev.clientX - store.editor.renderZone.x,
				y: ev.clientY - store.editor.renderZone.y,
			})),
			tap((posInWorld) => {
				store.editor.updateSelectionBox(posInWorld);
			}),
			takeUntil(merge(
				fromEvent<PointerEvent>(document, 'pointerup').pipe(
					map((ev) => isShortcut(ev)),
				),
				fromMobx(() => store.editor.mode).pipe(
					filter((mode) => mode !== EditorMode.select),
					mapTo(false),
				),
			).pipe(
				tap((shortcut) => {
					const entitiesToAdd = store.level.entities.filter((entity: IEntity) => {
						if ('params' in entity && 'asSatCircle' in entity.params) {
							const tester = store.editor.selectionBoxAsSat instanceof Vector ? pointInCircle : testPolygonCircle;
							return tester(
								store.editor.selectionBoxAsSat,
								entity.params.asSatCircle
							);

							store.editor.addEntityToSelection(entity);
						}
						if ('params' in entity && 'asSatPolygons' in entity.params) {
							const tester = store.editor.selectionBoxAsSat instanceof Vector ? pointInPolygon : testPolygonPolygon;
							return entity.params.asSatPolygons
								.some((polygon: Polygon) => tester(store.editor.selectionBoxAsSat, polygon));

						}

						return false;
					});

					if (shortcut) {
						entitiesToAdd.forEach((entity: IEntity) => store.editor.addEntityToSelection(entity));
					} else {
						store.editor.setSelection(entitiesToAdd);
					}

					store.editor.endSelectionBox();
					store.undoManager.stopGroup();
				}),
			)),
		)),
		ignoreElements(),
	);
};

export const selectAll: Epic = (action$, { store }) => {
	return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
		filter((ev) => ev.code === 'KeyA' && isShortcut(ev)),
		tap((ev) => {
			ev.preventDefault();
			store.editor.addEntitiesToSelection(store.level.entities);
		}),
		ignoreElements(),
	);
};
