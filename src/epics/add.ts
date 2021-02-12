import { empty, of } from 'rxjs';
import { filter, map, tap, ignoreElements, mergeMap, pluck } from 'rxjs/operators';
import { ofType, Epic } from 'epix';

import { EditorMode } from 'src/types/editor';
import { blockAddTypes } from 'src/types/entity';
import IPoint from 'src/types/point';
import { snapToGrid } from 'src/utils/geom';
import { IEntity } from 'src/models/Entity';
import VertexM, { IVertex } from 'src/models/Vertex';
import VerticesParams from 'src/models/VerticesParams';

export const addVertexOrEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		// we listen specifically on the background because when a user clicks another object they
		// probably expect to select it
		ofType('backgroundPointerDown'),
		pluck('ev', 'data'),
		filter((data) => data.button === 0 || data.pointerType === 'touch'),
		map(({ global }) => store.editor.screenToWorld({
			x: global.x,
			y: global.y,
		})),
		map((posInWorld) => snapToGrid(posInWorld, store.editor.gridCellSize)),
		filter(() => store.editor.mode === EditorMode.addVertex || store.editor.mode === EditorMode.addBlock),
		mergeMap((posInWorld: IPoint) => {
			switch (store.editor.mode) {
				case EditorMode.addVertex:
					return of({
						type: 'addVertex',
						pos: posInWorld,
					});
				case EditorMode.addBlock:
					return of({
						type: 'createEntity',
						pos: posInWorld,
					});
			}

			return empty();
		}),
	);
};

export const createEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('createEntity'),
		tap(({ pos }) => {
			store.createEntity(pos);
		}),
		filter(() => blockAddTypes.includes(store.editor.addType)),
		tap(() => {
			store.editor.setMode(EditorMode.addVertex);
		}),
		ignoreElements(),
	);
};

export const addVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('addVertex'),
		filter(() => store.editor.selection.size === 1),
		tap(({ pos }) => {
			// c'mon Typescript, why do I need this cast -_-
			const selectedEntity = (Array.from(store.editor.selection.values())[0] as IEntity);

			if (VerticesParams.is(selectedEntity.params)) {
				selectedEntity.params.addVertex(pos);
				return;
			}
			if (VertexM.is(selectedEntity)) {
				(selectedEntity as IVertex).parentBlock.params.addVertex(pos);
				return;
			}
		}),
		ignoreElements(),
	);
};
