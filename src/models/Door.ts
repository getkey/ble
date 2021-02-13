import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';
import StaticParams from 'src/models/StaticParams';
import AngleParams from 'src/models/AngleParams';

const DoorParams = types.compose(
	StaticParams,
	AngleParams,
	types.model({
		x: types.number,
		y: types.number,
		rightFacing: true,
	}).actions((self) => ({
		move(deltaX: number, deltaY: number): void {
			self.x += deltaX;
			self.y += deltaY;
		},
	})),
);

const Door = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('endpoint'),
	params: DoorParams,
}).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IDoor);
	},
})).views(() => ({
	get displayName(): string {
		return 'Door';
	},
}));
export default Door;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDoor extends Instance<typeof Door> {}
