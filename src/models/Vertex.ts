import { getParent, Instance, types, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { IBlock } from 'src/models/Block';
import Point from 'src/models/Point';

const Vertex = types.compose(
	Point,
	types.model({
		id: types.optional(types.identifier, nanoid),
	}),
).actions((self) => ({
	remove(): void {
		(getParent(self, 3) as IBlock).removeVertex(self);
	},
}));

export default Vertex;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVertex extends Instance<typeof Vertex> {}
export type SnapshotOutVertex = SnapshotOut<typeof Vertex>;
