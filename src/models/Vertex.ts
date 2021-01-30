import { getParent, Instance, types, SnapshotOut, getRoot } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { IBlock } from 'src/models/Block';
import { IRootStore } from 'src/models/RootStore';
import Point from 'src/models/Point';

const Vertex = types.compose(
	Point,
	types.model({
		id: types.optional(types.identifier, nanoid),
	}),
).views((self) => ({
	get parentBlock(): IBlock {
		return getParent(self, 3);
	},
})).actions((self) => ({
	remove(): void {
		const root: IRootStore = getRoot(self);

		// order matters here!
		// we add the parent in the selection first because if self is the last point, parent will get removed too
		if (root.editor.selection.get(self.id) === self) {
			root.editor.addToSelection(self.parentBlock);
		}

		self.parentBlock.removeVertex(self);
	},
}));

export default Vertex;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVertex extends Instance<typeof Vertex> {}
export type SnapshotOutVertex = SnapshotOut<typeof Vertex>;
