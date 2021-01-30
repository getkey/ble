import { fromEvent  } from 'rxjs';
import { tap, ignoreElements, filter, map } from 'rxjs/operators';
import { Epic } from 'epix';

import { IVertex } from 'src/models/Vertex';
import { IEntity } from 'src/models/Entity';
import { EditorMode } from 'src/types/editor';

export const backspaceEntityDelete: Epic = (action$, { store, app }) => {
	// it's very important to use app.view here, if document.body was used
	// it would prevent using text fields normally etc
	return fromEvent<KeyboardEvent>(app.view, 'keydown').pipe(
		filter((ev) => ['Backspace', 'Delete'].includes(ev.key)),
		tap((ev) => ev.preventDefault()),
		map(() => store.editor.selection),
		tap((selection) => {
			selection.forEach((thing: IVertex | IEntity) => thing.remove());
			store.editor.setMode(EditorMode.select);
		}),
		ignoreElements(),
	);
};
