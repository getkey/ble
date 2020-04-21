import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';

const Door = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('endpoint'),
	params: types.model({
		x: types.number,
		y: types.number,
		isStatic: false,
		rightFacing: true,
		angle: 0,
	}),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	setAngle(angle: number): void {
		self.params.angle = angle;
	},
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
