import { tap, ignoreElements, filter } from 'rxjs/operators';
import { ofType } from 'epix';

import { Epic } from 'src/types/actions';
import { EditorMode } from 'src/types/editor';
import BlockM from 'src/models/Block';

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
			if (storePolygon === undefined) throw new Error('Invalid polygonId');

			if (!BlockM.is(storePolygon)) throw new Error('Not a block');

			storePolygon.deleteVertex(vertexId);
		}),
		ignoreElements(),
	);
};
