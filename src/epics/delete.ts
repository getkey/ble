import { empty, of, fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter, map, mergeMap } from 'rxjs/operators';
import { ofType, Epic } from 'epix';

import { EditorMode } from 'src/types/editor';
import BlockM, { IBlock } from 'src/models/Block';

export const backspaceEntityDelete: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['Backspace', 'Delete'].includes(ev.key)),
		tap((ev) => ev.preventDefault()),
		map(() => store.editor.selectedEntity),
		filter((selectedEntity) => selectedEntity !== undefined),
		map(({ id }) => ({
			type: 'deleteEntity',
			entityId: id,
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
