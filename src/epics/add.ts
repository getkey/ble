import { empty, of } from 'rxjs';
import { filter, map, tap, ignoreElements, mergeMap, pluck } from 'rxjs/operators';
import { ofType, Epic } from 'epix';

import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';
import IPoint from 'src/types/point';
import BlockM, { IBlock } from 'src/models/Block';
import { BlockType } from 'src/types/entity';

export const addVertexOrEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		// we listen specifically on the background because when a user clicks another object they
		// probably expect to select it
		ofType('backgroundClick'),
		pluck('ev', 'data', 'originalEvent'),
		filter((ev) => ev.button === 0),
		map(({ clientX, clientY }) => store.editor.screenToWorld({
			x: clientX,
			y: clientY,
		})),
		map((posInWorld) => snapToGrid(posInWorld, store.editor.gridCellSize)),
		filter(() => store.editor.mode === EditorMode.addVertex || store.editor.mode === EditorMode.addBlock),
		mergeMap((posInWorld: IPoint) => {
			switch (store.editor.mode) {
				case EditorMode.addVertex:
					return of({
						type: 'addVertex' as 'addVertex',
						pos: posInWorld,
					});
				case EditorMode.addBlock:
					return of({
						type: 'addEntity' as 'addEntity',
						pos: posInWorld,
					});
			}

			return empty();
		}),
	);
};

export const addEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('addEntity'),
		tap(({ pos }) => {
			store.addEntity(pos);
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
			if (!BlockM.is(selectedEntity)) throw new Error('Not a block');
			(selectedEntity as IBlock).addVertex(pos);
		}),
		ignoreElements(),
	);
};
