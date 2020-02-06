import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import { BlockType } from 'src/types/entity';
import IPoint from 'src/types/point';

const Block = types.model({
	id: types.identifier,
	type: types.enumeration(Object.values(BlockType)),
	params: types.model({
		vertices: types.array(Point),
		isStatic: false,
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
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	addVertex(pos: IPoint): void {
		self.params.vertices.push(pos);
	},
})).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.params.vertices.map(({ x, y }) => new PixiPoint(x, y));
	},
}));
export default Block;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlock extends Instance<typeof Block> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotInBlock extends SnapshotIn<typeof Block> {}
