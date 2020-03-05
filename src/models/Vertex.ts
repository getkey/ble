import { getParent, Instance } from 'mobx-state-tree';

import { IBlock } from 'src/models/Block';
import Point from 'src/models/Point';

const Vertex = Point.actions((self) => ({
	remove(): void {
		(getParent(self, 3) as IBlock).removeVertex(self);
	},
}));

export default Vertex;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVertex extends Instance<typeof Vertex> {}
