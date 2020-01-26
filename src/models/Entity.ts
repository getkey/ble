import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import { EntityType } from 'src/types/entity';

export default types.model({
	type: types.enumeration(Object.values(EntityType)),
	params: types.model({
		vertices: types.array(Point),
	}),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.vertices.map((vertex) => {
			vertex.set(
				vertex.x + deltaX,
				vertex.y + deltaY,
			);
		});
	},
	deleteVertex(index: number): void {
		self.params.vertices.splice(index, 1);
	},
})).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.params.vertices.map(({ x, y }) => new PixiPoint(x, y));
	},
}));
