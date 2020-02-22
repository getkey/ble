import { tap, ignoreElements, filter } from 'rxjs/operators';
import { ofType } from 'epix';

import { Epic } from 'src/types/actions';
import { EditorMode } from 'src/types/editor';
import BlockM from 'src/models/Block';

export const deletePolygon: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.delete),
		tap(({ entityId }) => {
			store.level.deleteEntity(entityId);
		}),
		ignoreElements(),
	);
};

export const deleteVertex: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('vertexPointerDown'),
		filter(() => store.editor.mode === EditorMode.delete),
		tap(({ entityId, vertexId }) => {
			const storePolygon = store.level.entities.get(entityId);
			if (storePolygon === undefined) throw new Error('Invalid entityId');

			if (!BlockM.is(storePolygon)) throw new Error('Not a block');

			storePolygon.deleteVertex(vertexId);
		}),
		ignoreElements(),
	);
};
