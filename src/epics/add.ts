import { fromEvent } from 'rxjs';
import { filter, map, tap, ignoreElements } from 'rxjs/operators';

import { Epic } from 'src/types/actions';
import { EditorMode } from 'src/types/editor';
import { snapToGrid } from 'src/utils/geom';

export const addEntityOrVertex: Epic = (action$, { store }) => {
	return fromEvent<MouseEvent>(document, 'mousedown').pipe(
		filter((ev) => ev.button === 0 && ev.target !== null && (ev.target as HTMLElement).tagName === 'CANVAS'),
		filter(() => store.editor.mode === EditorMode.add),
		map(({ clientX, clientY }) => store.editor.screenToWorld({
			x: clientX,
			y: clientY,
		})),
		map((posInWorld) => snapToGrid(posInWorld, store.editor.gridCellSize)),
		tap((posInWorld) => {
			const { selectedEntity } = store.editor;

			if (selectedEntity === undefined) {
				store.addEntity(posInWorld);
			} else {
				selectedEntity.addVertex(posInWorld);
			}
		}),
		ignoreElements(),
	);
};
