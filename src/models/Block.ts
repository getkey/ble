import { types, Instance, destroy, getParent, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import { Point as PixiPoint } from 'pixi.js';

import Vertex from 'src/models/Vertex';
import { ILevel } from 'src/models/Level';
import { BlockType } from 'src/types/entity';
import { blockAliases } from 'src/aliases';
import IPoint from 'src/types/point';

const Block = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.enumeration(Object.values(BlockType)),
	params: types.model({
		vertices: types.refinement(
			types.array(Vertex),
			(value) => value !== undefined && value.length > 0,
		),
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
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	addVertex(pos: IPoint): void {
		self.params.vertices.push(pos);
	},
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IBlock);
	},
// see https://mobx-state-tree.js.org/tips/typescript#typing-self-in-actions-and-views
// for why this is a separate action block
})).actions((self) => ({
	removeVertex(child: IPoint): void {
		// avoid keeping rogue empty polygons around
		if (self.params.vertices.length <= 1) {
			self.remove();
		} else {
			destroy(child);
		}
	},
})).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.params.vertices.map((vertex) => vertex.asPixiPoint);
	},
	get displayName(): string {
		return `${blockAliases[self.type]} polygon`;
	},
	get isValid(): boolean {
		return self.params.vertices.length >= 3;
	},
}));
export default Block;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlock extends Instance<typeof Block> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type SnapshotOutBlock = SnapshotOut<typeof Block>;
