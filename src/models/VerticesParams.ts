import { types, destroy, getParent, getRoot, isAlive, Instance } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';
import { polygonIsSimple, polygonArea, canBeDecomposed } from 'bombhopperio-level-tools';

import { IRootStore } from 'src/models/RootStore';
import Vertex from 'src/models/Vertex';
import IPoint from 'src/types/point';
import { IEntity } from 'src/models/Entity';
import { pointSegmentDistanceSquared, pointsAligned } from 'src/utils/geom';

const VerticesParams = types.model({
	vertices: types.refinement(
		types.array(Vertex),
		(value) => value !== undefined && value.length > 0,
	),
}).views((self) => ({
	get verticesAsPixiPoints(): Array<PixiPoint> {
		return self.vertices.map((vertex) => vertex.asPixiPoint);
	},
	get isValid(): boolean {
		return polygonIsSimple(self.vertices) && canBeDecomposed(self.vertices);
	},
	get segments(): Array<[IPoint, IPoint]> {
		const vertices = [
			...self.vertices,
			self.vertices[0],
		];

		return vertices.slice(0, -1).map((pointA, i) => ([pointA, vertices[i + 1]]));
	},
})).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.vertices.map((vertex) => {
			vertex.set(
				vertex.x + deltaX,
				vertex.y + deltaY,
			);
		});
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
		self.vertices.splice(nearestIndex + 1, 0, pos);
	},
})).actions((self) => ({
	removeVertex(child: IPoint): void {
		// avoid keeping rogue empty polygons around
		if (self.vertices.length <= 1) {
			(getParent(self) as VerticesParamsEntity).remove();
		} else {
			destroy(child);
		}
	},
})).actions((self) => ({
	cleanSuperposedVertices(): void {
		for (
			let i = 0;
			isAlive(self) && self.vertices.length > 1 && i < self.vertices.length;
		) {
			const current = self.vertices[i];
			const next = self.vertices[(i + 1) % self.vertices.length];

			if (current.x === next.x && current.y === next.y) {
				// to prevent the user losing their selection
				// we remove the "sibling" vertex if this one is selected
				const root: IRootStore = getRoot(self);
				if (root.editor.selection.get(current.id) !== undefined) {
					self.removeVertex(next);
				} else {
					self.removeVertex(current);
				}
			} else {
				i += 1;
			}
		}
	},
	cleanAlignedVertices(): void {
		for(
			let i = 0;
			isAlive(self) && self.vertices.length > 2 && i < self.vertices.length;
		) {
			const current = self.vertices[i];
			const next = self.vertices[(i + 1) % self.vertices.length];
			const later = self.vertices[(i + 2) % self.vertices.length];

			if (pointsAligned(current, next, later)) {
				self.removeVertex(next);
			} else {
				i += 1;
			}
		}
	},
})).actions((self) => ({
	cleanInvalid(): void {
		self.cleanSuperposedVertices();
		self.cleanAlignedVertices();

		const isValid = self.vertices.length >= 3 && polygonArea(self.vertices) > 0;
		if (!isValid) {
			// polygon has too few vertices or no area, delete the block
			(getParent(self) as VerticesParamsEntity).remove();
		}
	},
}));
export default VerticesParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVerticesParams extends Instance<typeof VerticesParams> {}

// convenience type
export type VerticesParamsEntity = IEntity & {
	params: IVerticesParams,
};
