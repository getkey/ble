import { empty, of } from 'rxjs';
import { filter, map, tap, ignoreElements, mergeMap, pluck } from 'rxjs/operators';
import { ofType, Epic } from 'epix';

import { EditorMode } from 'src/types/editor';
import { BlockType } from 'src/types/entity';
import IPoint from 'src/types/point';
import { snapToGrid } from 'src/utils/geom';
import BlockM, { IBlock } from 'src/models/Block';
import VertexM, { IVertex } from 'src/models/Vertex';

export const addVertexOrEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		// we listen specifically on the background because when a user clicks another object they
		// probably expect to select it
		ofType('backgroundClick'),
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
		filter(() => store.editor.addType in BlockType),
		tap(() => {
			store.editor.setMode(EditorMode.addVertex);
		}),
		ignoreElements(),
	);
};

export const addVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('addVertex'),
		tap(({ pos }) => {
			const { selectedEntity } = store.editor;

			if (selectedEntity === undefined) {
				throw new Error('Trying to add a vertex but no entity is selected');
			}

			if (BlockM.is(selectedEntity)) {
				(selectedEntity as IBlock).addVertex(pos);
				return;
			}
			if (VertexM.is(selectedEntity)) {
				(selectedEntity as IVertex).parentBlock.addVertex(pos);
				return;
			}

			throw new Error('Not a block');
		}),
		ignoreElements(),
	);
};
