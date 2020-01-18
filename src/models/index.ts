import { types, Instance } from 'mobx-state-tree';

import Editor from 'src/models/Editor';
import Entities from 'src/models/Entities';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 0,
			y: 0,
		},
	}),
	entities: types.optional(Entities, [
		{
			vertices: [
				{ x: 0, y: 0 },
				{ x: 0, y: 50 },
				{ x: 50, y: 50 },
				{ x: 50, y: 0 },
			],
		},
		{
			vertices: [
				{ x: 100, y: 300 },
				{ x: 100, y: 350 },
				{ x: 200, y: 350 },
				{ x: 200, y: 300 },
				{ x: 150, y: 250 },
			],
		},
	]),
});
export const store = RootStore.create();
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
