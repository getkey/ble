import { fromEvent, empty, of } from 'rxjs';
import { filter, map, tap, ignoreElements, mergeMap } from 'rxjs/operators';
import { ofType } from 'epix';

import { Epic } from 'src/types/actions';
import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';
import IPoint from 'src/types/point';

export const addVertexOrEntity: Epic = (action$, { store }) => {
	return fromEvent<MouseEvent>(document, 'mousedown').pipe(
		filter((ev) => ev.button === 0 && ev.target !== null && (ev.target as HTMLElement).tagName === 'CANVAS'),
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
			selectedEntity.addVertex(pos);
		}),
		ignoreElements(),
	);
};
