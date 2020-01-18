import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';

export default types.model({
	type: types.enumeration('EntityType', ['normal', 'ice', 'breakable', 'deadly', 'bouncy']),
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
})).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.vertices.map(({ x, y }) => new PixiPoint(x, y));
	},
}));
