import { types } from 'mobx-state-tree';

import EditorSelection from 'src/models/EditorSelection';
import EditorPosition from 'src/models/EditorPosition';
import EditorMisc from 'src/models/EditorMisc';

export default types.compose(
	EditorMisc,
	EditorSelection,
	EditorPosition,
);
