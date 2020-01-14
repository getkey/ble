import { types } from 'mobx-state-tree';

import { Editor } from './Editor.js';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 0,
			y: 0,
		},
	}),
});
export const store = RootStore.create();
