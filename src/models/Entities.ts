import { types } from 'mobx-state-tree';

import Point from 'src/models/Point';

export default types.array(
	types.model({
		vertices: types.array(Point),
	}).actions((self) => ({
		move(deltaX: number, deltaY: number): void {
			self.vertices.map((vertex) => {
				vertex.set(
					vertex.x + deltaX,
					vertex.y + deltaY,
				);
			});
		},
	}))
);
