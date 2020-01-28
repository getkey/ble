import { tap, ignoreElements, filter } from 'rxjs/operators';

import { Epic } from 'src/types/actions';
import { ofType } from 'src/utils/epics';
import { EditorMode } from 'src/types/editor';

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
