import { empty, of  } from 'rxjs';
import { tap, ignoreElements, filter, map, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'epix';

import { EditorMode } from 'src/types/editor';
import BlockM, { IBlock } from 'src/models/Block';

export const entityPointerDownDelete: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('entityPointerDown'),
		filter(() => store.editor.mode === EditorMode.delete),
		map(({ entityId }) => ({
			type: 'deleteEntity',
			entityId,
		})),
	);
};

export const deleteEntity: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('deleteEntity'),
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
		mergeMap(({ entityId, vertexId }) => {
			const storePolygon = store.level.entities.get(entityId);
			if (storePolygon === undefined) throw new Error('Invalid entityId');

			if (!BlockM.is(storePolygon)) throw new Error('Not a block');
			const block = storePolygon as IBlock;

			// avoid keeping rogue empty polygons around
			if (block.params.vertices.length <= 1) {
				return of({
					type: 'deleteEntity',
					entityId,
				});
			}

			block.deleteVertex(vertexId);

			return empty();
		}),
	);
};
