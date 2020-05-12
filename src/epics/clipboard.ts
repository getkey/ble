import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic } from 'epix';
import { getSnapshot, clone } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import Entity, { IEntitySnapshotIn } from 'src/models/Entity';

export const copy: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['C', 'c'].includes(ev.key) && ev.ctrlKey && Entity.is(store.editor.selectedEntity)),
		tap(() => {
			// store a copy, not a reference so the original entity can be moved, etc
			const snapshot = getSnapshot<IEntitySnapshotIn>(store.editor.selectedEntity);
			const entityCopy = Entity.create({
				...snapshot,
				id: nanoid(),
			});
			store.editor.setClipboard(entityCopy);
		}),
		ignoreElements(),
	);
};

export const cut: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['X', 'x'].includes(ev.key) && ev.ctrlKey && Entity.is(store.editor.selectedEntity)),
		tap(() => {
			const entityCopy = clone(store.editor.selectedEntity);
			store.editor.selectedEntity.remove();
			store.editor.setClipboard(entityCopy);
		}),
		ignoreElements(),
	);
};

export const paste: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['V', 'v'].includes(ev.key) && ev.ctrlKey && store.editor.clipboard !== undefined),
		tap(() => {
			const snapshot = getSnapshot<IEntitySnapshotIn>(store.editor.clipboard);
			const entityCopy = Entity.create({
				...snapshot,
				id: nanoid(),
			});
			entityCopy.move(store.editor.gridCellSize, store.editor.gridCellSize);
			store.addEntity(entityCopy);
		}),
		ignoreElements(),
	);
};
