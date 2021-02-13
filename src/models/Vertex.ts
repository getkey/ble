import { getParent, Instance, types, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import Point from 'src/models/Point';
import { VerticesParamsEntity } from 'src/models/VerticesParams';

export const Vertex = types.compose(
	Point,
	types.model({
		id: types.optional(types.identifier, nanoid),
	}),
).views((self) => ({
	get parentBlock(): VerticesParamsEntity {
		return getParent(self, 3) as VerticesParamsEntity;
	},
})).actions((self) => ({
	remove(): void {
		self.parentBlock.params.removeVertex(self);
	},
}));

export default Vertex;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVertex extends Instance<typeof Vertex> {}
export type SnapshotOutVertex = SnapshotOut<typeof Vertex>;
