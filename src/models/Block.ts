import { types, Instance, destroy, getParent, SnapshotOut, getRoot, isAlive } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import { Point as PixiPoint } from 'pixi.js';
import { polygonIsSimple } from 'bombhopperio-level-tools';

import { IRootStore } from 'src/models/';
import Vertex from 'src/models/Vertex';
import { ILevel } from 'src/models/Level';
import { BlockType } from 'src/types/entity';
import { blockAliases } from 'src/aliases';
import IPoint from 'src/types/point';
import { pointSegmentDistanceSquared } from 'src/utils/geom';


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
}).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.params.vertices.map((vertex) => vertex.asPixiPoint);
	},
	get displayName(): string {
		return `${blockAliases[self.type]} polygon`;
	},
	get isSimple(): boolean {
		return polygonIsSimple(self.params.vertices);
	},
	get segments(): Array<[IPoint, IPoint]> {
		const vertices = [
			...self.params.vertices,
			self.params.vertices[0],
		];

		return vertices.slice(0, -1).map((pointA, i) => ([pointA, vertices[i + 1]]));
	},
})).actions((self) => ({
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
		// add the vertex between the 2 nearest vertices

		const { index: nearestIndex } = self.segments.reduce((acc, [vertexA, vertexB], i) => {
			const distance = pointSegmentDistanceSquared(vertexA, vertexB, pos);
			if (distance < acc.distance) {
				return {
					distance,
					index: i,
				};
			}

			return acc;
		}, { distance: Infinity, index: -1 });

		// + 1 to be in between nearestIndex and nearestIndex + 1
		self.params.vertices.splice(nearestIndex + 1, 0, pos);
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
})).actions((self) => ({
	cleanInvalidVertices(): void {
		for (
			let i = 0;
			isAlive(self) && self.params.vertices.length > 1 && i < self.params.vertices.length;
			i += 1
		) {
			const current = self.params.vertices[i];
			const previous = self.params.vertices[i === 0 ? self.params.vertices.length - 1 : i - 1];

			if (current.x === previous.x && current.y === previous.y) {
				// to prevent the user losing their selection
				// we remove the "sibling" vertex if this one is selected
				const root: IRootStore = getRoot(self);
				if (root.editor.selectedEntity === current) {
					self.removeVertex(previous);
				} else {
					self.removeVertex(current);
				}
				i -= 1;
			}
		}
	},
})).actions((self) => ({
	cleanInvalid(): void {
		self.cleanInvalidVertices();

		const isValid = self.params.vertices.length >= 3;
		if (!isValid) {
			self.remove();
		}
	},
}));
export default Block;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlock extends Instance<typeof Block> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type SnapshotOutBlock = SnapshotOut<typeof Block>;
