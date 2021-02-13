import { types, Instance, getParent, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';
import { BlockType } from 'src/types/entity';
import { blockAliases } from 'src/aliases';
import StaticParams from 'src/models/StaticParams';

const BallParams = types.compose(
	types.model({
		x: types.number,
		y: types.number,
		radius: types.optional(
			types.refinement(
				types.number,
				(value) => value >= 0,
			),
			15,
		),
	}).views((self) => ({
		move(deltaX: number, deltaY: number): void {
			self.x += deltaX;
			self.y += deltaY;
		},
	})),
	StaticParams,
);

const Ball = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.enumeration(Object.values(BlockType)),
	params: BallParams,
}).actions((self) => ({
	setRadius(radius: number): void {
		self.params.radius = radius;
	},
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IBall);
	},
})).actions((self) => ({
	setRadius(radius: number): void {
		if (radius <= 0) {
			self.remove();
			return;
		}

		self.params.radius = radius;
	},
})).views((self) => ({
	get displayName(): string {
		return `${blockAliases[self.type]} circle`;
	},
}));
export default Ball;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBall extends Instance<typeof Ball> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type SnapshotOutBall = SnapshotOut<typeof Ball>;
