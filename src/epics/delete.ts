import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter } from 'rxjs/operators';
import { Epic } from 'epix';

import { IVertex } from 'src/models/Vertex';
import { EditorMode } from 'src/types/editor';

export const backspaceEntityDelete: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['Backspace', 'Delete'].includes(ev.key)),
		tap((ev) => ev.preventDefault()),
		tap(() => {
			if (store.editor.vertexSelection.size > 0) {
				store.editor.vertexSelection.forEach((vertex: IVertex) => vertex.remove());
			} else {
				store.editor.removeSelected();
			}
			store.editor.setMode(EditorMode.select);
		}),
		ignoreElements(),
	);
};
